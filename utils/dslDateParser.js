const DSLParser = require('./dsl-parser');
const iCalParser = require('./iCalParser');
const fs = require('fs');
const MoodleActivity = require('../app/models/moodle_activity');
const moment = require('moment');
const { CalendarActivityNotFound } = require('../app/exceptions');
const {
  fetchActivities,
  repackageToMBZ,
  updateActivities,
} = require('./xmlReader');
const MoodleQuiz = require('../app/models/moodle_quiz');

var path =
  'data/backup-moodle2-course-17014-s20222-log210-99-20220619-1506-nu.mbz';
var new_path =
  'tmp/backup-moodle2-course-17014-s20222-log210-99-20220619-1506-nu/';

// Uncomment the lines below to test in the terminal using "node ./utils/dslDateParser.js"
const test = async function () {
  var string = fs.readFileSync('./data/test.dsl', { encoding: 'utf8' });
  var ical = new iCalParser('', 'LOG210', '01', '2022', '2');
  var calendarActivities = await ical.parse();
  var newTimes = getListModifiedTimes(
    calendarActivities,
    DSLParser.parse(string)[1],
  );
  console.log(newTimes);

  var activities = fetchActivities(
    'tmp/backup-moodle2-course-17014-s20222-log210-99-20220619-1506-nu',
  );
  console.log(activities);

  for (const obj of newTimes) {
    if (obj.activity.includes('Quiz')) {
      var index = Number.parseInt(obj.activity.split(' ')[2]) - 1;
      let i = 0;
      for (var activity of activities) {
        if (activity instanceof MoodleQuiz) {
          if (i == index) {
            activity.setTimeOpen(`${obj.open.getTime() / 1000}`);
            activity.setTimeClose(`${obj.close.getTime() / 1000}`);
            break;
          }
          i++;
        }
      }
    }
  }
  console.log(activities);

  updateActivities(
    'tmp/backup-moodle2-course-17014-s20222-log210-99-20220619-1506-nu/',
    activities,
  );
  repackageToMBZ(
    'tmp/backup-moodle2-course-17014-s20222-log210-99-20220619-1506-nu/',
  );
};
// test()

// Parses the calendar activities and peg grammar to return an array containing the new dates to change for each activity
// This is the main function to call to change the actual dates of moodle activities.
const getListModifiedTimes = function (calendarActivities, pegObj) {
  var listModifiedTimes = [];
  for (const obj of pegObj) {
    const activity = obj.activity;
    var dateObj = {};
    if (activity.includes('Quiz'))
      dateObj = getNewQuizDates(obj, calendarActivities);
    if (activity.includes('Homework'))
      dateObj = getNewHomeworkDates(obj, calendarActivities);
    if (activity.includes('Exam'))
      dateObj = getNewExamDates(obj, calendarActivities);
    listModifiedTimes.push({ activity: activity, ...dateObj });
  }
  return listModifiedTimes;
};

// Parses the peg obj and returns the modified dates for a quiz
const getNewQuizDates = function (obj, calendarActivities) {
  // Get pegObj info open
  const [openActivityName, openActivityNumber] = obj.open.activity.split(' ');
  const openModifier = obj.open.modifier;
  const openTimeObj = obj.open.time;
  // Get correct calendar activity for oepn date
  var openCalendarAct = getCalendarActivity(
    calendarActivities,
    openActivityName,
    openActivityNumber,
  );

  // Get pegObj info close
  const [closeActivityName, closeActivityNumber] =
    obj.close.activity.split(' ');
  const closeModifier = obj.close.modifier;
  const closeTimeObj = obj.close.time;
  // Get correct calendar activity for oepn date
  var closeCalendarAct = getCalendarActivity(
    calendarActivities,
    closeActivityName,
    closeActivityNumber,
  );

  // Get modified open date
  var openDate = modifyTime(openCalendarAct, openModifier, openTimeObj);
  // console.log("New open date: ", openDate.toDate())

  // Get modified close date
  var closeDate = modifyTime(closeCalendarAct, closeModifier, closeTimeObj);
  // console.log("New close date: ", closeDate.toDate())

  return {
    open: openDate.toDate(),
    close: closeDate.toDate(),
  };
};

// Parses the peg obj and returns the modified dates for an exam
const getNewExamDates = function (obj, calendarActivities) {
  // Get pegObj info open
  const [openActivityName, openActivityNumber] = obj.open.activity.split(' ');
  const openModifier = obj.open.modifier;
  const openTimeObj = obj.open.time;
  // Get correct calendar activity for oepn date
  var openCalendarAct = getCalendarActivity(
    calendarActivities,
    openActivityName,
    openActivityNumber,
  );

  // Get modified open date
  var openDate = modifyTime(openCalendarAct, openModifier, openTimeObj);
  // console.log("New open date: ", openDate.toDate())

  return {
    open: openDate.toDate(),
  };
};

// Parses the peg obj and returns the modified dates for a homework
const getNewHomeworkDates = function (obj, calendarActivities) {
  // Get pegObj info open
  const [openActivityName, openActivityNumber] = obj.open.activity.split(' ');
  const openModifier = obj.open.modifier;
  const openTimeObj = obj.open.time;
  // Get correct calendar activity for oepn date
  var openCalendarAct = getCalendarActivity(
    calendarActivities,
    openActivityName,
    openActivityNumber,
  );

  // Get pegObj info due
  const [dueActivityName, dueActivityNumber] = obj.due.activity.split(' ');
  const dueModifier = obj.due.modifier;
  const dueTimeObj = obj.due.time;
  // Get correct calendar activity for oepn date
  var dueCalendarAct = getCalendarActivity(
    calendarActivities,
    dueActivityName,
    dueActivityNumber,
  );

  // Get pegObj info due
  const [cutoffActivityName, cutoffActivityNumber] =
    obj.cutoff.activity.split(' ');
  const cutoffModifier = obj.cutoff.modifier;
  const cutoffTimeObj = obj.cutoff.time;
  // Get correct calendar activity for oepn date
  var cutoffCalendarAct = getCalendarActivity(
    calendarActivities,
    cutoffActivityName,
    cutoffActivityNumber,
  );

  // Get modified open date
  var openDate = modifyTime(openCalendarAct, openModifier, openTimeObj);
  // console.log("New open date: ", openDate.toDate())

  // Get modified due date
  var dueDate = modifyTime(dueCalendarAct, dueModifier, dueTimeObj);
  // console.log("New due date: ", dueDate.toDate())

  // Get modified cutoff date
  var cutoffDate = modifyTime(cutoffCalendarAct, cutoffModifier, cutoffTimeObj);
  // console.log("New cutoff date: ", cutoffDate.toDate())

  return {
    open: openDate.toDate(),
    due: dueDate.toDate(),
    cutoff: cutoffDate.toDate(),
  };
};

// Get calendar activity based on the DSL activity name and its number.
const getCalendarActivity = function (
  calendarActivities,
  activityName,
  activityNumber,
) {
  var activity;
  switch (activityName) {
    case 'Seminar':
      activity =
        calendarActivities.seminars[Number.parseInt(activityNumber) - 1];
      break;
    case 'Laboratory':
      activity =
        calendarActivities.laboratories[Number.parseInt(activityNumber) - 1];
      break;
    case 'Practicum':
      activity =
        calendarActivities.practicums[Number.parseInt(activityNumber) - 1];
      break;
    default:
      activity = undefined;
      break;
  }
  if (activity != undefined) {
    return activity;
  } else {
    throw new CalendarActivityNotFound(activityName, activityNumber);
  }
};

// Returns a modified time based on the peg object modifier and time object (if present)
const modifyTime = function (calendarAct, modifier, timeObj) {
  var newDate;
  switch (modifier) {
    case 'start':
      newDate = moment(calendarAct.startDate);
      break;
    case 'end':
      newDate = moment(calendarAct.endDate);
      break;
    case undefined:
      newDate = moment(calendarAct.startDate);
  }
  if (timeObj) {
    switch (timeObj.modifier) {
      case '+':
        newDate = newDate.clone().add(timeObj.number, timeObj.type);
        break;
      case '-':
        newDate = newDate.clone().subtract(timeObj.number, timeObj.type);
        break;
    }
    if (timeObj.at) {
      const [hours, minutes] = timeObj.at.split(':');
      newDate.hours(Number.parseInt(hours)).minutes(Number.parseInt(minutes));
    }
  }
  return newDate;
};

module.exports = {
  getListModifiedTimes: getListModifiedTimes,
};
