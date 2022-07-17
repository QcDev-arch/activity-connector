/* Requires for dsl date parser tests */
const { getListModifiedTimes } = require("../../app/utils/dslDateParser");
const iCalParser = require("../../app/utils/iCalParser");
const DslParser = require("../../app/utils/dslParser");
const fs = require("fs-extra");
const moment = require("moment");
var dslString;
var activities;

const activityTypes = ["", "C", "TP", "Labo"];
const symbol = "LOG210";
const group = "01";
const year = "2022";
const semesterSeason = 2;

jest.mock("../../app/utils/iCalParser");

// Mocking require that we reassigned all the previous values
const icsParser = new iCalParser(
  activityTypes[0],
  symbol,
  group,
  year,
  semesterSeason,
);

const fakeICSReturn = require("../../data/fakeData");

/*---------DSL DATE PARSER TEST----------*/

beforeAll(async () => {
  dslString = fs.readFileSync("./data/test.dsl", { encoding: "utf8" });
  icsParser.parse.mockResolvedValue(fakeICSReturn);
  activities = await icsParser.parse();
});

test("Get the list of modified times", () => {
  const newTimes = getListModifiedTimes(
    activities,
    DslParser.parse(dslString)[1],
  );

  const testTimes = [
    {
      activity: "Moodle Quiz 1",
      open: moment("2022-05-05T16:00:00.000Z").toDate(),
      close: moment("2022-05-12T12:00:00.000Z").toDate(),
    },
    {
      activity: "Moodle Quiz 2",
      open: moment("2022-05-12T16:00:00.000Z").toDate(),
      close: moment("2022-05-18T23:55:00.000Z").toDate(),
    },
    {
      activity: "Moodle Homework 1",
      open: moment("2022-05-17T15:30:00.000Z").toDate(),
      due: moment("2022-05-23T23:55:00.000Z").toDate(),
      cutoff: moment("2022-05-23T23:55:00.000Z").toDate(),
    },
    { activity: "Exam 1", open: moment("2022-07-14T12:30:00.000Z").toDate() },
  ];

  expect(newTimes[0].open).toStrictEqual(testTimes[0].open);
  expect(newTimes[0].close).toStrictEqual(testTimes[0].close);

  expect(newTimes[1].open).toStrictEqual(testTimes[1].open);
  expect(newTimes[1].close).toStrictEqual(testTimes[1].close);

  expect(newTimes[2].open).toStrictEqual(testTimes[2].open);
  expect(newTimes[2].due).toStrictEqual(testTimes[2].due);
  expect(newTimes[2].cutoff).toStrictEqual(testTimes[2].cutoff);

  expect(newTimes[3].open).toStrictEqual(testTimes[3].open);
});
