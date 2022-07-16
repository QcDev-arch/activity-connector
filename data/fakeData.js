const {
    CalendarActivity,
    Seminar,
    Laboratory,
    Practicum,
  } = require("../app/models/calendarActivity");

const fakeICSReturn = {
    seminars: [
        new Seminar ({
            description: 'LOG210 - Analyse et conception de logiciels - Activité de cours',
            start: new Date("2022-05-05T12:30:00.000Z"),
            end: new Date("2022-05-05T16:00:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Seminar ({
            description: 'LOG210 - Analyse et conception de logiciels - Activité de cours',
            start: new Date("2022-05-12T12:30:00.000Z"),
            end: new Date("2022-05-12T16:00:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Seminar ({
            description: 'LOG210 - Analyse et conception de logiciels - Activité de cours',
            start: new Date("2022-05-19T12:30:00.000Z"),
            end: new Date("2022-05-19T16:00:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Seminar ({
            description: 'LOG210 - Analyse et conception de logiciels - Activité de cours',
            start: new Date("2022-05-26T12:30:00.000Z"),
            end: new Date("2022-05-26T16:00:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Seminar ({
            description: 'LOG210 - Analyse et conception de logiciels - Activité de cours',
            start: new Date("2022-06-02T12:30:00.000Z"),
            end: new Date("2022-06-02T16:00:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Seminar ({
            description: 'LOG210 - Analyse et conception de logiciels - Activité de cours',
            start: new Date("2022-06-09T12:30:00.000Z"),
            end: new Date("2022-06-09T16:00:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Seminar ({
            description: 'LOG210 - Analyse et conception de logiciels - Activité de cours',
            start: new Date("2022-06-16T12:30:00.000Z"),
            end: new Date("2022-06-16T16:00:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Seminar ({
            description: 'LOG210 - Analyse et conception de logiciels - Activité de cours',
            start: new Date("2022-06-23T12:30:00.000Z"),
            end: new Date("2022-06-23T16:00:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Seminar ({
            description: 'LOG210 - Analyse et conception de logiciels - Activité de cours',
            start: new Date("2022-07-07T12:30:00.000Z"),
            end: new Date("2022-07-07T16:00:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Seminar ({
            description: 'LOG210 - Analyse et conception de logiciels - Activité de cours',
            start: new Date("2022-07-14T12:30:00.000Z"),
            end: new Date("2022-07-14T16:00:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Seminar ({
            description: 'LOG210 - Analyse et conception de logiciels - Activité de cours',
            start: new Date("2022-07-21T12:30:00.000Z"),
            end: new Date("2022-07-21T16:00:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Seminar ({
            description: 'LOG210 - Analyse et conception de logiciels - Activité de cours',
            start: new Date("2022-07-28T12:30:00.000Z"),
            end: new Date("2022-07-28T16:00:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Seminar ({
            description: 'LOG210 - Analyse et conception de logiciels - Activité de cours',
            start: new Date("2022-08-04T12:30:00.000Z"),
            end: new Date("2022-08-04T16:00:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        })
    ],
    practicums: [],
    laboratories: [
        new Laboratory ({
            description: 'LOG210 - Analyse et conception de logiciels - Laboratoire',
            start: new Date("2022-05-10T12:30:00.000Z"),
            end: new Date("2022-05-10T15:30:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Laboratory ({
            description: 'LOG210 - Analyse et conception de logiciels - Laboratoire',
            start: new Date("2022-05-17T12:30:00.000Z"),
            end: new Date("2022-05-17T15:30:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Laboratory ({
            description: 'LOG210 - Analyse et conception de logiciels - Laboratoire',
            start: new Date("2022-05-24T12:30:00.000Z"),
            end: new Date("2022-05-24T15:30:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Laboratory ({
            description: 'LOG210 - Analyse et conception de logiciels - Laboratoire',
            start: new Date("2022-05-31T12:30:00.000Z"),
            end: new Date("2022-05-31T15:30:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Laboratory ({
            description: 'LOG210 - Analyse et conception de logiciels - Laboratoire',
            start: new Date("2022-06-07T12:30:00.000Z"),
            end: new Date("2022-06-07T15:30:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Laboratory ({
            description: 'LOG210 - Analyse et conception de logiciels - Laboratoire',
            start: new Date("2022-06-14T12:30:00.000Z"),
            end: new Date("2022-06-14T15:30:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Laboratory ({
            description: 'LOG210 - Analyse et conception de logiciels - Laboratoire',
            start: new Date("2022-06-21T12:30:00.000Z"),
            end: new Date("2022-06-21T15:30:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Laboratory ({
            description: 'LOG210 - Analyse et conception de logiciels - Laboratoire',
            start: new Date("2022-06-28T12:30:00.000Z"),
            end: new Date("2022-06-28T15:30:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Laboratory ({
            description: 'LOG210 - Analyse et conception de logiciels - Laboratoire',
            start: new Date("2022-07-05T12:30:00.000Z"),
            end: new Date("2022-07-05T15:30:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Laboratory ({
            description: 'LOG210 - Analyse et conception de logiciels - Laboratoire',
            start: new Date("2022-07-12T12:30:00.000Z"),
            end: new Date("2022-07-12T15:30:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Laboratory ({
            description: 'LOG210 - Analyse et conception de logiciels - Laboratoire',
            start: new Date("2022-07-19T12:30:00.000Z"),
            end: new Date("2022-07-19T15:30:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Laboratory ({
            description: 'LOG210 - Analyse et conception de logiciels - Laboratoire',
            start: new Date("2022-07-26T12:30:00.000Z"),
            end: new Date("2022-07-26T15:30:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        }),
        new Laboratory ({
            description: 'LOG210 - Analyse et conception de logiciels - Laboratoire',
            start: new Date("2022-08-02T12:30:00.000Z"),
            end: new Date("2022-08-02T15:30:00.000Z"),
            dtstamp: { tz: 'Etc/UTC' },
        })
    ]
};

module.exports = fakeICSReturn;