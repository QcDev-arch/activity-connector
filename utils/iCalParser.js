// import ical
const ical = require('node-ical');
const {
  Seminar,
  Laboratory,
  Practicum,
} = require('../app/models/calendarActivity');

const BASE_URL = 'https://portail.etsmtl.ca/ICal/SeancesCours?';

class iCalParser {
  constructor(typeact, symbol, group, year, semesterSeason) {
    this.typeact = typeact;
    this.symbol = symbol;
    this.group = group;
    this.year = year;
    this.semesterSeason = semesterSeason;
  }

  parse = async () => {
    const params = new URLSearchParams(
      `typeact=${this.typeact}&` +
        `Sigle=${this.symbol}&` +
        `Groupe=${this.group}&` +
        `Session=${this.year + this.semesterSeason}&`,
    );

    const url = await ical.async.fromURL(BASE_URL + params.toString());

    var seminars = [];
    var practicums = [];
    var laboratories = [];

    for (const event of Object.values(url)) {
      if (event.type == 'VEVENT') {
        switch (event.categories[0]) {
          case 'C        ': // categories: [ 'C        ' ] -> very doodoo
            seminars.push(new Seminar(event));
            break;
          case 'TP':
            practicums.push(new Practicum(event));
            break;
          case 'Labo':
            laboratories.push(new Laboratory(event));
            break;
          default:
            throw 'Not a valid activity type!';
        }
      }
    }

    this.seminars = seminars;
    this.practicums = practicums;
    this.laboratories = laboratories;

    if (!seminars.length && !practicums.length && !laboratories.length)
      return null;

    return {
      seminars: this.seminars,
      practicums: this.practicums,
      laboratories: this.laboratories,
    };
  };
}

module.exports = iCalParser;
