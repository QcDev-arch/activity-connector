class CalendarActivityNotFound extends Error {
  constructor(activityName, activityNumber) {
    super(
      `The calendar activity defined in the DSL '${activityName} ${activityNumber}' cannot be found or does not exist.`,
    );
    this.name = 'CalendarActivityNotFound';
  }
}

module.exports = {
  CalendarActivityNotFound: CalendarActivityNotFound,
};
