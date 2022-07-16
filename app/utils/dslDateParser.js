const moment = require("moment");
const { CalendarActivityNotFound, DSLActivityDatesInvalid } = require("../exceptions");
const {
  ACTIVITY_TYPES,
  ASSIGNMENT_TYPES,
  DATES,
  OPERATION_TYPES,
  SPLITTER_TYPE,
} = require("./constants");

// Parses the calendar activities and peg grammar to return an array containing the new dates to change for each activity
// This is the main function to call to change the actual dates of moodle activities.
const getListModifiedTimes = function (calendarActivities, pegObj) {
  const listModifiedTimes = [];
  for (const obj of pegObj) {
    const activity = obj.activity;
    let dateObj = {};
    if (activity.includes(ASSIGNMENT_TYPES.QUIZ))
      dateObj = getNewQuizDates(obj, calendarActivities);
    if (activity.includes(ASSIGNMENT_TYPES.HOMEWORK))
      dateObj = getNewHomeworkDates(obj, calendarActivities);
    if (activity.includes(ASSIGNMENT_TYPES.EXAM))
      dateObj = getNewExamDates(obj, calendarActivities);
    listModifiedTimes.push({ activity: activity, ...dateObj });
  }
  return listModifiedTimes;
};

// Parses the peg obj and returns the modified dates for a quiz
const getNewQuizDates = function (obj, calendarActivities) {
  // Get pegObj info open
  const [openActivityName, openActivityNumber] = obj.open.activity.split(
    SPLITTER_TYPE.WHITESPACE,
  );
  const openModifier = obj.open.modifier;
  const openTimeObj = obj.open.time;
  // Get correct calendar activity for open date
  const openCalendarAct = getCalendarActivity(
    calendarActivities,
    openActivityName,
    openActivityNumber,
  );

  // Get pegObj info close
  const [closeActivityName, closeActivityNumber] = obj.close.activity.split(
    SPLITTER_TYPE.WHITESPACE,
  );
  const closeModifier = obj.close.modifier;
  const closeTimeObj = obj.close.time;
  // Get correct calendar activity for open date
  const closeCalendarAct = getCalendarActivity(
    calendarActivities,
    closeActivityName,
    closeActivityNumber,
  );

  // Get modified open date
  const openDate = modifyTime(openCalendarAct, openModifier, openTimeObj);
  // console.log("New open date: ", openDate.toDate())

  // Get modified close date
  const closeDate = modifyTime(closeCalendarAct, closeModifier, closeTimeObj);
  // console.log("New close date: ", closeDate.toDate())
  
  if(openDate.toDate() > closeDate.toDate()){
    throw new DSLActivityDatesInvalid(obj.activity)
  }

  return {
    open: openDate.toDate(),
    close: closeDate.toDate(),
  };
};

// Parses the peg obj and returns the modified dates for an exam
const getNewExamDates = function (obj, calendarActivities) {
  // Get pegObj info open
  const [openActivityName, openActivityNumber] = obj.open.activity.split(
    SPLITTER_TYPE.WHITESPACE,
  );
  const openModifier = obj.open.modifier;
  const openTimeObj = obj.open.time;
  // Get correct calendar activity for open date
  const openCalendarAct = getCalendarActivity(
    calendarActivities,
    openActivityName,
    openActivityNumber,
  );

  // Get modified open date
  const openDate = modifyTime(openCalendarAct, openModifier, openTimeObj);
  // console.log("New open date: ", openDate.toDate())

  return {
    open: openDate.toDate(),
  };
};

// Parses the peg obj and returns the modified dates for a homework
const getNewHomeworkDates = function (obj, calendarActivities) {
  // Get pegObj info open
  const [openActivityName, openActivityNumber] = obj.open.activity.split(
    SPLITTER_TYPE.WHITESPACE,
  );
  const openModifier = obj.open.modifier;
  const openTimeObj = obj.open.time;
  // Get correct calendar activity for open date
  const openCalendarAct = getCalendarActivity(
    calendarActivities,
    openActivityName,
    openActivityNumber,
  );

  // Get pegObj info due
  const [dueActivityName, dueActivityNumber] = obj.due.activity.split(
    SPLITTER_TYPE.WHITESPACE,
  );
  const dueModifier = obj.due.modifier;
  const dueTimeObj = obj.due.time;
  // Get correct calendar activity for open date
  const dueCalendarAct = getCalendarActivity(
    calendarActivities,
    dueActivityName,
    dueActivityNumber,
  );

  // Get pegObj info due
  const [cutoffActivityName, cutoffActivityNumber] = obj.cutoff.activity.split(
    SPLITTER_TYPE.WHITESPACE,
  );
  const cutoffModifier = obj.cutoff.modifier;
  const cutoffTimeObj = obj.cutoff.time;
  // Get correct calendar activity for open date
  const cutoffCalendarAct = getCalendarActivity(
    calendarActivities,
    cutoffActivityName,
    cutoffActivityNumber,
  );

  // Get modified open date
  const openDate = modifyTime(openCalendarAct, openModifier, openTimeObj);
  // console.log("New open date: ", openDate.toDate())

  // Get modified due date
  const dueDate = modifyTime(dueCalendarAct, dueModifier, dueTimeObj);
  // console.log("New due date: ", dueDate.toDate())

  // Get modified cutoff date
  const cutoffDate = modifyTime(
    cutoffCalendarAct,
    cutoffModifier,
    cutoffTimeObj,
  );
  // console.log("New cutoff date: ", cutoffDate.toDate())

  if(openDate.toDate() > dueDate.toDate() || 
  openDate.toDate() > cutoffDate.toDate() ||
  dueDate.toDate() > cutoffDate.toDate()){
    throw new DSLActivityDatesInvalid(obj.activity)
  }
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
  let activity;
  switch (activityName) {
    case ACTIVITY_TYPES.SEMINAR:
      activity =
        calendarActivities.seminars[Number.parseInt(activityNumber) - 1];
      break;
    case ACTIVITY_TYPES.LABORATORY:
      activity =
        calendarActivities.laboratories[Number.parseInt(activityNumber) - 1];
      break;
    case ACTIVITY_TYPES.PRACTICUM:
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
  let newDate;
  switch (modifier) {
    case DATES.START_DATE:
      newDate = moment(calendarAct.startDate);
      break;
    case DATES.END_DATE:
      newDate = moment(calendarAct.endDate);
      break;
    case undefined:
      newDate = moment(calendarAct.startDate);
  }
  if (timeObj) {
    switch (timeObj.modifier) {
      case OPERATION_TYPES.ADD:
        newDate = newDate.clone().add(timeObj.number, timeObj.type);
        break;
      case OPERATION_TYPES.SUBTRACT:
        newDate = newDate.clone().subtract(timeObj.number, timeObj.type);
        break;
    }
    if (timeObj.at) {
      const [hours, minutes] = timeObj.at.split(SPLITTER_TYPE.COLON);
      newDate.hours(Number.parseInt(hours)).minutes(Number.parseInt(minutes));
    }
  }
  return newDate;
};

module.exports = {
  getListModifiedTimes: getListModifiedTimes,
};
