class CalendarActivity {
  constructor(event) {
    this.description = event.description;
    this.startDate = event.start;
    this.endDate = event.end;
    this.timeZone = event.dtstamp.tz;
  }
}

class Seminar extends CalendarActivity {
  constructor(event) {
    super(event);
    // console.log(event.description);
  }
}

class Laboratory extends CalendarActivity {
  constructor(event) {
    super(event);
    // console.log(event.description);
  }
}

class Practicum extends CalendarActivity {
  constructor(event) {
    super(event);
    // console.log(event.description);
  }
}

module.exports = {
  CalendarActivity: CalendarActivity,
  Seminar: Seminar,
  Laboratory: Laboratory,
  Practicum: Practicum,
};
