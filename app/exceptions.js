class CalendarActivityNotFound extends Error {
  constructor(activityName, activityNumber) {
    super(
      `The calendar activity defined in the DSL '${activityName} ${activityNumber}' cannot be found or does not exist.`,
    );
    this.name = "CalendarActivityNotFound";
  }
}

class InvalidSemesterSeason extends Error {
  constructor(semesterSeason) {
    super(`The provided semester season '${semesterSeason}' is incorrect.`);
    this.name = "InvalidSemesterSeason";
  }
}

class ICSCalendarActivityInvalid extends Error {
  constructor(event) {
    super(
      "Not a valid calendar activity. The following payload is not mapped yet: " +
        event,
    );
    this.name = "ICSCalendarActivityInvalid";
  }
}

class DSLActivityDatesInvalid extends Error{
  constructor(activityName){
    super(
      `The specified dates for the DSL activity "${activityName}" are invalid. 
Please check that the dates specified in the DSL are in the correct order
For example, "Q1 S2 S1" is not a valid DSL because the start date is greater than the end date (Seminar 2 happens AFTER Seminar 1).`
    )
    this.name = "DSLActivityDatesInvalid"
  }
}

module.exports = {
  CalendarActivityNotFound: CalendarActivityNotFound,
  InvalidSemesterSeason: InvalidSemesterSeason,
  ICSCalendarActivityInvalid: ICSCalendarActivityInvalid,
  DSLActivityDatesInvalid: DSLActivityDatesInvalid
};
