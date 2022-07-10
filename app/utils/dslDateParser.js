const moment = require('moment');
const { CalendarActivityNotFound } = require('../exceptions');


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
/* istanbul ignore next */
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

  // Get modified close date
  var closeDate = modifyTime(closeCalendarAct, closeModifier, closeTimeObj);

  return {
    open: openDate.toDate(),
    close: closeDate.toDate(),
  };
};

// Parses the peg obj and returns the modified dates for an exam
/* istanbul ignore next */
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
/* istanbul ignore next */
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

  // Get modified due date
  var dueDate = modifyTime(dueCalendarAct, dueModifier, dueTimeObj);

  // Get modified cutoff date
  var cutoffDate = modifyTime(cutoffCalendarAct, cutoffModifier, cutoffTimeObj);

  return {
    open: openDate.toDate(),
    due: dueDate.toDate(),
    cutoff: cutoffDate.toDate(),
  };
};

// Get calendar activity based on the DSL activity name and its number.
/* istanbul ignore next */
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
/* istanbul ignore next */
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
