/* Calendar requirements */
const iCalParser = require('../../app/utils/iCalParser');

const {CalendarActivity,Seminar,Laboratory,Practicum} = require('../../app/models/calendarActivity');

const activityTypes = ['', 'C', 'TP', 'LABO'];
var symbol = 'log210';
var group = '01';
var year = '2022';
var semesterSeason = '2';

/*-------CALENDAR TESTS--------*/

test.each(activityTypes)("given %p activity type as argument, return the activity", activityType => {
  var parser = new iCalParser(
    activityType, 
    symbol, 
    group, 
    year, 
    semesterSeason);
    
  expect(parser.typeact).toBe(activityType);
  expect(parser.symbol).toBe(symbol);
  expect(parser.group).toBe(group);
  expect(parser.year).toBe(year);
  expect(parser.semesterSeason).toBe(semesterSeason);
})

test('invalid activity', () => {
  var typeact = "";
  year = "2023";
  var parser = new iCalParser(typeact, symbol, group, year, semesterSeason);

  return parser.parse().then(data => {
    expect(data).toBeNull();
  });
});

describe('Parser test', () => {
  test('Parser test', () => {
    // Fetch and parse calendar
    let icsParser = new iCalParser(
      "",
      "LOG210",
      "01",
      "2022",
      2
    );
    return icsParser.parse().then((ics) => {
      expect(ics).toEqual(expect.anything());
    });
  });

  test('Error invalid type', () => {
    // Fetch and parse calendar
    let icsParser = new iCalParser(
      null,
      null,
      null,
      null,
      null
    );
    return icsParser.parse().then((ics) => {
      expect(ics).toBeNull();
    });
  });
});

describe('Calendar class instantiation test', () => {
  test('Instantiate a CalendarActivity object', () => {
    var test = "test";
    var activity = new CalendarActivity({"description":test,"start":test,"end":test,"dtstamp":{"tz":test}})
    expect(activity.description).toBe(test)
    expect(activity.startDate).toBe(test)
    expect(activity.endDate).toBe(test)
    expect(activity.timeZone).toBe(test)
  });

  test('Instantiate a Seminar object', () => {
    var test = "test";
    var activity = new Seminar({"description":test,"start":test,"end":test,"dtstamp":{"tz":test}})
    expect(activity.description).toBe(test)
    expect(activity.startDate).toBe(test)
    expect(activity.endDate).toBe(test)
    expect(activity.timeZone).toBe(test)
  });

  test('Instantiate a Laboratory object', () => {
    var test = "test";
    var activity = new Laboratory({"description":test,"start":test,"end":test,"dtstamp":{"tz":test}})
    expect(activity.description).toBe(test)
    expect(activity.startDate).toBe(test)
    expect(activity.endDate).toBe(test)
    expect(activity.timeZone).toBe(test)
  });

  test('Instantiate a Practicum object', () => {
    var test = "test";
    var activity = new Practicum({"description":test,"start":test,"end":test,"dtstamp":{"tz":test}})
    expect(activity.description).toBe(test)
    expect(activity.startDate).toBe(test)
    expect(activity.endDate).toBe(test)
    expect(activity.timeZone).toBe(test)
  });
});
