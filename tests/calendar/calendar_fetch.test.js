/* Calendar requirements */
const iCalParser = require('../../utils/iCalParser');

const TEST_ICAL =
  "https://calendar.google.com/calendar/ical/etsmtl.net_2ke" +
  "m5ippvlh70v7pd6oo4ed9ig%40group.calendar.google.com/public/basic.ics";


/* Function called only once before all the tests in this file */
beforeAll(() => {
    // Use returns if the function your going to call returns a promess
    return true;
});

/* Function called only once after all the tests in this file */
afterAll(() => {
    // Use returns if the function your going to call returns a promess
    return true;
});

/* Function called before each of the tests in this file */
beforeEach(() => {
    true;
});

/* Function called after each of the tests in this file */
afterEach(() => {
    true;
});

/*-------CALENDAR TESTS--------*/

test('Instantiate iCalParser', () => {
    var parser = new iCalParser(TEST_ICAL)
    expect(parser.url).toBe(TEST_ICAL)
});

test('Parse test calendar with iCalParser', () => {
    var parser = new iCalParser(TEST_ICAL)
    expect(parser.url).toBe(TEST_ICAL)
    // Test parsing function
});