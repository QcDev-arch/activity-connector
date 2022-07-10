const {CalendarActivityNotFound,InvalidSemesterSeason,ICSCalendarActivityInvalid} = require('../app/exceptions');

/*-------EXCEPTION TESTS--------*/

test('CalendarActivityNotFound exception', () => {
    expect(() => {
        var name = "test";
        throw new CalendarActivityNotFound(name, name);
    }).toThrow();
});

test('CalendarActivityNotFound exception', () => {
    expect(() => {
        var name = "test";
        throw new InvalidSemesterSeason(name);
    }).toThrow();
});

test('CalendarActivityNotFound exception', () => {
    expect(() => {
        var name = "test";
        throw new ICSCalendarActivityInvalid(name);
    }).toThrow();
});