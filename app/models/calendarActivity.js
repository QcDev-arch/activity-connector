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
  }
}

class Laboratory extends CalendarActivity {
  constructor(event) {
    super(event);
  }
}

class Practicum extends CalendarActivity {
  constructor(event) {
    super(event);
  }
}

module.exports = {
  CalendarActivity: CalendarActivity,
  Seminar: Seminar,
  Laboratory: Laboratory,
  Practicum: Practicum,
};
