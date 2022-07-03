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
    super(
      `The provided semester season '${semesterSeason}' is incorrect.`
    )
    this.name = "InvalidSemesterSeason"
  }
}

class ICSCalendarActivityInvalid extends Error{
  constructor(event){
    super("Not a valid calendar activity. The following payload is not mapped yet: ", event)
    this.name = "ICSCalendarActivityInvalid"
  }
}

module.exports = {
  CalendarActivityNotFound: CalendarActivityNotFound,
  InvalidSemesterSeason: InvalidSemesterSeason,
  ICSCalendarActivityInvalid: ICSCalendarActivityInvalid
};
