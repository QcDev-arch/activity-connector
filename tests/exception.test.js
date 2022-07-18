const {
  CalendarActivityNotFound,
  InvalidSemesterSeason,
  ICSCalendarActivityInvalid,
  DSLActivityDatesInvalid
} = require("../app/exceptions");

/*-------EXCEPTION TESTS--------*/

test("CalendarActivityNotFound exception", () => {
  expect(() => {
    const name = "test";
    throw new CalendarActivityNotFound(name, name);
  }).toThrow();
});

test("CalendarActivityNotFound exception", () => {
  expect(() => {
    const name = "test";
    throw new InvalidSemesterSeason(name);
  }).toThrow();
});

test("CalendarActivityNotFound exception", () => {
  expect(() => {
    const name = "test";
    throw new ICSCalendarActivityInvalid(name);
  }).toThrow();
});

test("DSLActivityDatesInvalid exception", () => {
  expect(() => {
    const name = "test";
    throw new DSLActivityDatesInvalid(name);
  }).toThrow();
});