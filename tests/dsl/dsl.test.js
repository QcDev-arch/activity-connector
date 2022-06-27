const DslParser = require('../../utils/dsl-parser');

/*-------DSL TESTS--------*/

test('Test parser basic', () => {
  expect(
    DslParser.parse(
      'E1 S2\nQ1 S1F S2S-30m\nH1 L2F L3S-1d@23:55 L3S-1d@23:55\nQ1 S1F+1h P2S-15m',
    ),
  ).toStrictEqual([
    [],
    [
      {
        activity: 'Exam 1',
        open: {
          activity: 'Seminar 2',
        },
      },
      {
        activity: 'Moodle Quiz 1',
        open: {
          activity: 'Seminar 1',
          modifier: 'end',
        },
        close: {
          activity: 'Seminar 2',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 30,
            type: 'm',
          },
        },
      },
      {
        activity: 'Moodle Homework 1',
        open: {
          activity: 'Laboratory 2',
          modifier: 'end',
        },
        due: {
          activity: 'Laboratory 3',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 1,
            type: 'd',
            at: '23:55',
          },
        },
        cutoff: {
          activity: 'Laboratory 3',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 1,
            type: 'd',
            at: '23:55',
          },
        },
      },
      {
        activity: 'Moodle Quiz 1',
        open: {
          activity: 'Seminar 1',
          modifier: 'end',
          time: {
            modifier: '+',
            number: 1,
            type: 'h',
          },
        },
        close: {
          activity: 'Practicum 2',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 15,
            type: 'm',
          },
        },
      },
    ],
    'EOF',
  ]);
});

test('Test parser with a lot of stuff', () => {
  expect(
    DslParser.parse(
      'E1 S2\nQ1 S1F S2S-30m\nH1 L2F L3S-1d@23:55 L3S-1d@23:55\nQ1 S1F+1h P2S-15m\nQ1 S1F S2S-30m\nH1 L2F L3S-1d@23:55 L3S-1d@23:55\nQ1 S1F+1h P2S-15m\nQ1 S1F S2S-30m\nH1 L2F L3S-1d@23:55 L3S-1d@23:55\nQ1 S1F+1h P2S-15m\nQ1 S1F S2S-30m\nH1 L2F L3S-1d@23:55 L3S-1d@23:55\nQ1 S1F+1h P2S-15m\nQ1 S1F S2S-30m\nH1 L2F L3S-1d@23:55 L3S+1d@23:55\nQ1 S1F+1h P2S-15m\nQ1 S1F S2S-30m\nH1 L2F L3S-1d@23:55 L3S-1d@23:55\nQ1 S1F+1h P2S-15w\nQ1 S1F S2S-30m\nH1 L2F L3S-1d@23:55 L3S-1d@23:55\nQ1 S1F+1h P2S-15m\nE2 S13',
    ),
  ).toStrictEqual([
    [],
    [
      {
        activity: 'Exam 1',
        open: {
          activity: 'Seminar 2',
        },
      },
      {
        activity: 'Moodle Quiz 1',
        open: {
          activity: 'Seminar 1',
          modifier: 'end',
        },
        close: {
          activity: 'Seminar 2',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 30,
            type: 'm',
          },
        },
      },
      {
        activity: 'Moodle Homework 1',
        open: {
          activity: 'Laboratory 2',
          modifier: 'end',
        },
        due: {
          activity: 'Laboratory 3',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 1,
            type: 'd',
            at: '23:55',
          },
        },
        cutoff: {
          activity: 'Laboratory 3',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 1,
            type: 'd',
            at: '23:55',
          },
        },
      },
      {
        activity: 'Moodle Quiz 1',
        open: {
          activity: 'Seminar 1',
          modifier: 'end',
          time: {
            modifier: '+',
            number: 1,
            type: 'h',
          },
        },
        close: {
          activity: 'Practicum 2',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 15,
            type: 'm',
          },
        },
      },
      {
        activity: 'Moodle Quiz 1',
        open: {
          activity: 'Seminar 1',
          modifier: 'end',
        },
        close: {
          activity: 'Seminar 2',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 30,
            type: 'm',
          },
        },
      },
      {
        activity: 'Moodle Homework 1',
        open: {
          activity: 'Laboratory 2',
          modifier: 'end',
        },
        due: {
          activity: 'Laboratory 3',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 1,
            type: 'd',
            at: '23:55',
          },
        },
        cutoff: {
          activity: 'Laboratory 3',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 1,
            type: 'd',
            at: '23:55',
          },
        },
      },
      {
        activity: 'Moodle Quiz 1',
        open: {
          activity: 'Seminar 1',
          modifier: 'end',
          time: {
            modifier: '+',
            number: 1,
            type: 'h',
          },
        },
        close: {
          activity: 'Practicum 2',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 15,
            type: 'm',
          },
        },
      },
      {
        activity: 'Moodle Quiz 1',
        open: {
          activity: 'Seminar 1',
          modifier: 'end',
        },
        close: {
          activity: 'Seminar 2',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 30,
            type: 'm',
          },
        },
      },
      {
        activity: 'Moodle Homework 1',
        open: {
          activity: 'Laboratory 2',
          modifier: 'end',
        },
        due: {
          activity: 'Laboratory 3',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 1,
            type: 'd',
            at: '23:55',
          },
        },
        cutoff: {
          activity: 'Laboratory 3',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 1,
            type: 'd',
            at: '23:55',
          },
        },
      },
      {
        activity: 'Moodle Quiz 1',
        open: {
          activity: 'Seminar 1',
          modifier: 'end',
          time: {
            modifier: '+',
            number: 1,
            type: 'h',
          },
        },
        close: {
          activity: 'Practicum 2',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 15,
            type: 'm',
          },
        },
      },
      {
        activity: 'Moodle Quiz 1',
        open: {
          activity: 'Seminar 1',
          modifier: 'end',
        },
        close: {
          activity: 'Seminar 2',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 30,
            type: 'm',
          },
        },
      },
      {
        activity: 'Moodle Homework 1',
        open: {
          activity: 'Laboratory 2',
          modifier: 'end',
        },
        due: {
          activity: 'Laboratory 3',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 1,
            type: 'd',
            at: '23:55',
          },
        },
        cutoff: {
          activity: 'Laboratory 3',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 1,
            type: 'd',
            at: '23:55',
          },
        },
      },
      {
        activity: 'Moodle Quiz 1',
        open: {
          activity: 'Seminar 1',
          modifier: 'end',
          time: {
            modifier: '+',
            number: 1,
            type: 'h',
          },
        },
        close: {
          activity: 'Practicum 2',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 15,
            type: 'm',
          },
        },
      },
      {
        activity: 'Moodle Quiz 1',
        open: {
          activity: 'Seminar 1',
          modifier: 'end',
        },
        close: {
          activity: 'Seminar 2',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 30,
            type: 'm',
          },
        },
      },
      {
        activity: 'Moodle Homework 1',
        open: {
          activity: 'Laboratory 2',
          modifier: 'end',
        },
        due: {
          activity: 'Laboratory 3',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 1,
            type: 'd',
            at: '23:55',
          },
        },
        cutoff: {
          activity: 'Laboratory 3',
          modifier: 'start',
          time: {
            modifier: '+',
            number: 1,
            type: 'd',
            at: '23:55',
          },
        },
      },
      {
        activity: 'Moodle Quiz 1',
        open: {
          activity: 'Seminar 1',
          modifier: 'end',
          time: {
            modifier: '+',
            number: 1,
            type: 'h',
          },
        },
        close: {
          activity: 'Practicum 2',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 15,
            type: 'm',
          },
        },
      },
      {
        activity: 'Moodle Quiz 1',
        open: {
          activity: 'Seminar 1',
          modifier: 'end',
        },
        close: {
          activity: 'Seminar 2',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 30,
            type: 'm',
          },
        },
      },
      {
        activity: 'Moodle Homework 1',
        open: {
          activity: 'Laboratory 2',
          modifier: 'end',
        },
        due: {
          activity: 'Laboratory 3',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 1,
            type: 'd',
            at: '23:55',
          },
        },
        cutoff: {
          activity: 'Laboratory 3',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 1,
            type: 'd',
            at: '23:55',
          },
        },
      },
      {
        activity: 'Moodle Quiz 1',
        open: {
          activity: 'Seminar 1',
          modifier: 'end',
          time: {
            modifier: '+',
            number: 1,
            type: 'h',
          },
        },
        close: {
          activity: 'Practicum 2',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 15,
            type: 'w',
          },
        },
      },
      {
        activity: 'Moodle Quiz 1',
        open: {
          activity: 'Seminar 1',
          modifier: 'end',
        },
        close: {
          activity: 'Seminar 2',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 30,
            type: 'm',
          },
        },
      },
      {
        activity: 'Moodle Homework 1',
        open: {
          activity: 'Laboratory 2',
          modifier: 'end',
        },
        due: {
          activity: 'Laboratory 3',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 1,
            type: 'd',
            at: '23:55',
          },
        },
        cutoff: {
          activity: 'Laboratory 3',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 1,
            type: 'd',
            at: '23:55',
          },
        },
      },
      {
        activity: 'Moodle Quiz 1',
        open: {
          activity: 'Seminar 1',
          modifier: 'end',
          time: {
            modifier: '+',
            number: 1,
            type: 'h',
          },
        },
        close: {
          activity: 'Practicum 2',
          modifier: 'start',
          time: {
            modifier: '-',
            number: 15,
            type: 'm',
          },
        },
      },
      {
        activity: 'Exam 2',
        open: {
          activity: 'Seminar 13',
        },
      },
    ],
    'EOF',
  ]);
});
