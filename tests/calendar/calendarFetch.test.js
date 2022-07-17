/* Calendar requirements */
const iCalParser = require("../../app/utils/iCalParser");

const {
  CalendarActivity,
  Seminar,
  Laboratory,
  Practicum,
} = require("../../app/models/calendarActivity");

const activityTypes = ["", "C", "TP", "Labo"];
const symbol = "LOG210";
const group = "01";
const year = "2022";
const semesterSeason = 2;

// Mocking require that we reassigned all the previous values
const icsParser = new iCalParser(
  activityTypes[0],
  symbol,
  group,
  year,
  semesterSeason,
);

/*-------CALENDAR TESTS--------*/

test.each(activityTypes)(
  "given %p activity type as argument, return the activity",
  activityType => {
    icsParser.typeact = activityType;

    expect(icsParser.typeact).toBe(activityType);
    expect(icsParser.symbol).toBe(symbol);
    expect(icsParser.group).toBe(group);
    expect(icsParser.year).toBe(year);
    expect(icsParser.semesterSeason).toBe(semesterSeason);
  },
);

describe("Parser test", () => {
  test("Parser test", () => {
    icsParser.typeact = activityTypes[0];
    return icsParser.parse().then(ics => {
      expect(ics).toEqual(expect.anything());
    });
  });

  test("Error invalid type", () => {
    icsParser.typeact = null;
    return icsParser.parse().then(ics => {
      expect(ics).toBeNull();
    });
  });
});

describe("Calendar class instantiation test", () => {
  test("Instantiate a CalendarActivity object", () => {
    const test = "test";
    const activity = new CalendarActivity({
      description: test,
      start: test,
      end: test,
      dtstamp: { tz: test },
    });
    expect(activity.description).toBe(test);
    expect(activity.startDate).toBe(test);
    expect(activity.endDate).toBe(test);
    expect(activity.timeZone).toBe(test);
  });

  test("Instantiate a Seminar object", () => {
    const test = "test";
    const activity = new Seminar({
      description: test,
      start: test,
      end: test,
      dtstamp: { tz: test },
    });
    expect(activity.description).toBe(test);
    expect(activity.startDate).toBe(test);
    expect(activity.endDate).toBe(test);
    expect(activity.timeZone).toBe(test);
  });

  test("Instantiate a Laboratory object", () => {
    const test = "test";
    const activity = new Laboratory({
      description: test,
      start: test,
      end: test,
      dtstamp: { tz: test },
    });
    expect(activity.description).toBe(test);
    expect(activity.startDate).toBe(test);
    expect(activity.endDate).toBe(test);
    expect(activity.timeZone).toBe(test);
  });

  test("Instantiate a Practicum object", () => {
    const test = "test";
    const activity = new Practicum({
      description: test,
      start: test,
      end: test,
      dtstamp: { tz: test },
    });
    expect(activity.description).toBe(test);
    expect(activity.startDate).toBe(test);
    expect(activity.endDate).toBe(test);
    expect(activity.timeZone).toBe(test);
  });
});
