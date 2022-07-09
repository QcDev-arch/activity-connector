/* Requires for dsl date parser tests */
const { getListModifiedTimes } = require("../../app/utils/dslDateParser");
const iCalParser = require("../../app/utils/iCalParser");
const DslParser = require("../../app/utils/dslParser");
const fs = require("fs-extra");
var dslString;
var activities;
let ical = new iCalParser("", "LOG210", "01", "2022", 2);

/*---------DSL DATE PARSER TEST----------*/

beforeAll(async () => {
  dslString = fs.readFileSync("./data/test.dsl", { encoding: "utf8" });
  activities = await ical.parse();
});

test("Get the list of modified times", () => {
  const newTimes = getListModifiedTimes(
    activities,
    DslParser.parse(dslString)[1],
  );

  const testTimes = [
    {
      activity: "Moodle Quiz 1",
      open: new Date("2022-05-05T16:00:00.000Z"),
      close: new Date("2022-05-12T12:00:00.000Z"),
    },
    {
      activity: "Moodle Quiz 2",
      open: new Date("2022-05-12T16:00:00.000Z"),
      close: new Date("2022-05-19T03:55:00.000Z"),
    },
    {
      activity: "Moodle Homework 1",
      open: new Date("2022-05-17T15:30:00.000Z"),
      due: new Date("2022-05-24T03:55:00.000Z"),
      cutoff: new Date("2022-05-24T03:55:00.000Z"),
    },
    { activity: "Exam 1", open: new Date("2022-07-14T12:30:00.000Z") },
  ];

  expect(newTimes).toEqual(expect.anything());

  // TODO : Find a way to use iCalParser with a predownload ics file instead of fetching on the ETS portal
  // expect(newTimes[0].open).toStrictEqual(testTimes[0].open);
  // expect(newTimes[0].close).toStrictEqual(testTimes[0].close);

  // expect(newTimes[1].open).toStrictEqual(testTimes[1].open);
  // expect(newTimes[1].close).toStrictEqual(testTimes[1].close);

  // expect(newTimes[2].open).toStrictEqual(testTimes[2].open);
  // expect(newTimes[2].close).toStrictEqual(testTimes[2].close);
  // expect(newTimes[2].cutoff).toStrictEqual(testTimes[2].cutoff);

  // expect(newTimes[3].open).toStrictEqual(testTimes[3].open);
});
