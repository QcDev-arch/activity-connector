/* Calendar requirements */
const iCalParser = require('../../app/utils/iCalParser');

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
