const nodeICalParser = require("node-ical");
const {
  Seminar,
  Laboratory,
  Practicum,
} = require("../models/calendarActivity");
const { ICAL_ACTIVITY_TYPES } = require("./constants");

const BASE_URL = "https://portail.etsmtl.ca/ICal/SeancesCours?";

class iCalParser {
  constructor(typeact, symbol, group, year, semesterSeason) {
    this.typeact = typeact;
    this.symbol = symbol;
    this.group = group;
    this.year = year;
    this.semesterSeason = semesterSeason;
  }

  async parse() {
    const params = new URLSearchParams(
      `typeact=${this.typeact}&` +
        `Sigle=${this.symbol}&` +
        `Groupe=${this.group}&` +
        `Session=${this.year + this.semesterSeason}&`,
    );
    const data = await nodeICalParser.async.fromURL(
      BASE_URL + params.toString(),
    );

    return this.createData(data);
  }

  async parseFile(filePath) {
    const data = await nodeICalParser.async.parseFile(filePath);
    return this.createData(data);
  }

  createData(data) {
    var seminars = [];
    var practicums = [];
    var laboratories = [];

    for (const event of Object.values(data)) {
      if (event.type == "VEVENT") {
        switch (event.categories[0]) {
          case ICAL_ACTIVITY_TYPES.SEMINAR:
            seminars.push(new Seminar(event));
            break;
          case ICAL_ACTIVITY_TYPES.PRACTICUM:
            practicums.push(new Practicum(event));
            break;
          case ICAL_ACTIVITY_TYPES.LABORATORY:
            laboratories.push(new Laboratory(event));
            break;
          case ICAL_ACTIVITY_TYPES.FINAL_EXAM:
            console.log(
              "Final exam currently not supported. Please change the final exam dates on Moodle manually.",
            );
            break;
          default:
            throw "Not a valid activity type!";
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
  }
}

module.exports = iCalParser;
