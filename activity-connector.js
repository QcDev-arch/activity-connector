#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const dslDateParser = require('./utils/dslDateParser');
const DSLParser = require('./utils/dsl-parser');
const path = require('path');
const MoodleQuiz = require('./app/models/moodle_quiz');
const {
  extractTar,
  fetchActivities,
  updateActivities,
  repackageToMBZ,
} = require('./utils/xmlReader');
const iCalParser = require('./utils/iCalParser');

program
  .command('extract')
  .description('Extracts [.mbz file] to the tmp directory')
  .argument('<file-path>', 'The path to the .mbz file to extract')
  .action(function (filePath) {
    console.log('Extracting .mbz file...');
    extractTar(filePath);
    console.log('Done!');
  });

// ./activity-connector.js extract data/backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu.mbz
program
  .command('print-dir')
  .description('Outputs all activities from a [mbz directory]')
  .argument('<directory-path>', 'The directory to the extracted Moodle files.')
  .action(function (directoryPath) {
    console.log(fetchActivities(directoryPath));
  });

// ./activity-connector.js print-ics C log210 01 2022 2
program
  .command('print-ics')
  .description(
    'Outputs dates for specified [activity type] [course symbol] [group] [year] [semester #: Winter(1), Summer(2), Fall (3)]',
  )
  .argument('<typeact>', '')
  .argument('<symbol>', '')
  .argument('<group>', '')
  .argument('<year>', '')
  .argument('<semesterSeason>', '')
  .action(function (typeact, symbol, group, year, semesterSeason) {
    let icsParser = new iCalParser(
      typeact,
      symbol,
      group,
      year,
      semesterSeason,
    );

    icsParser.parse().then(ics => console.log(ics));
  });

// ./activity-connector.js parse-dsl ./data/test.dsl "" LOG210 01 2022 2
program
  .command('parse-dsl')
  .description(
    'Parses [.dsl file] for specified [activity type] [course symbol] [group] [year] [semester #: Winter(1), Summer(2), Fall (3)]',
  )
  .argument('<dsl-file-path>', '')
  .argument('<typeact>', '')
  .argument('<symbol>', '')
  .argument('<group>', '')
  .argument('<year>', '')
  .argument('<semesterSeason>', '')
  .action(async function (
    dslFilePath,
    typeact,
    symbol,
    group,
    year,
    semesterSeason,
  ) {
    string = fs.readFileSync(dslFilePath, { encoding: 'utf8' });
    ical = new iCalParser(typeact, symbol, group, year, semesterSeason);
    ical.parse().then(ics => {
      console.log(
        dslDateParser.getListModifiedTimes(ics, DSLParser.parse(string)[1]),
      );
    });
  });

// ./activity-connector.js update data/backup-moodle2-course-17014-s20222-log210-99-20220619-1506-nu.mbz data/test.dsl "" LOG210 01 2022 2
program
  .command('update')
  .description(
    'Extracts, updates values and repackages [.mbz file] using [.dsl file] [activity type] [course symbol] [group] [year] [semester #: Winter(1), Summer(2), Fall (3)]',
  )
  .argument('<mbz-file-path>', 'the path of the mbz file')
  .argument('<dsl-file-path>', 'the path of the dsl file')
  .argument('<typeact>', '')
  .argument('<symbol>', '')
  .argument('<group>', '')
  .argument('<year>', '')
  .argument('<semesterSeason>', '')
  .action(async function (
    mbzFilePath,
    dslFilePath,
    typeact,
    symbol,
    group,
    year,
    semesterSeason,
  ) {
    var string = fs.readFileSync(dslFilePath, { encoding: 'utf8' });
    var ical = new iCalParser(typeact, symbol, group, year, semesterSeason);
    var calendarActivities = await ical.parse();
    var newTimes = dslDateParser.getListModifiedTimes(
      calendarActivities,
      DSLParser.parse(string)[1],
    );

    var newPath = path.join(
      'tmp',
      mbzFilePath.split('/').pop().split('.mbz')[0],
      '/',
    ); // TODO refactor
    var activities = fetchActivities(newPath);

    // TODO Refactor into another file
    // TODO only modifies quiz so far, have to cover the other classes
    for (const obj of newTimes) {
      if (obj.activity.includes('Quiz')) {
        var index = Number.parseInt(obj.activity.split(' ')[2]) - 1;
        let i = 0;
        for (var activity of activities) {
          if (activity instanceof MoodleQuiz) {
            if (i == index) {
              activity.setTimeOpen(`${obj.open.getTime() / 1000}`);
              activity.setTimeClose(`${obj.close.getTime() / 1000}`);
              break;
            }
            i++;
          }
        }
      }
    }

    updateActivities(newPath, activities);
    repackageToMBZ(newPath);
  });

program.parse(process.argv);
