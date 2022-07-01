#!/usr/bin/env node
const path = require("path");
const program = require("commander");
const fs = require("fs");

const dslDateParser = require("./utils/dslDateParser");
const DSLParser = require("./utils/dsl-parser");
const iCalParser = require("./utils/iCalParser");
const MoodleQuiz = require("./app/models/moodle_quiz");
const {
  extractTar,
  fetchActivities,
  updateActivities,
  repackageToMBZ,
} = require("./utils/xmlReader");

const getSemesterSeasonNumber = function (semesterSeason) {
  switch (semesterSeason) {
    case "Winter":
      return 1;
    case "Summer":
      return 2;
    case "Fall":
      return 3;
    default:
      // TODO add exception handling
      console.log(
        "Wrong semester season, the options are Winter, Summer or Fall",
      );
      process.exitCode = 1;
      return;
  }
};

program
  .command("extract")
  .description("Extracts [.mbz file] to the tmp directory")
  .argument("<file-path>", "the path to the .mbz file to extract")
  .action(function (filePath) {
    console.log("Extracting .mbz file...");
    extractTar(filePath);
    console.log("Done!");
  });

// ./activity-connector.js print-dir data/backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu
// node activity-connector.js print-dir .\tmp\backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu
program
  .command("print-dir")
  .description("Outputs all activities from a [mbz directory]")
  .argument("<directory-path>", "the directory to the extracted Moodle files.")
  .action(function (directoryPath) {
    console.log(fetchActivities(directoryPath));
  });

// ./activity-connector.js print-ics log210 01 2022 Summer
// node activity-connector.js print-ics LOG210 01 2022 Summer
program
  .command("print-ics")
  .description(
    "Outputs dates for specified [activity type] [course acronym] [group] [year] [semester #: Winter(1), Summer(2), Fall (3)]",
  )
  .argument(
    "<course-acronym>",
    "the course's acronym (e.g. LOG210, GTI745, MEC200, ...)",
  )
  .argument(
    "<group>",
    "the group number for the course (if the group is a single digit, add a 0 in front e.g. 01, 02, ...)",
  )
  .argument("<year>", "the year of the course")
  .argument(
    "<semesterSeason>",
    "the semester season. The options are Winter, Summer or Fall",
  )
  .option("-t, --typeact", "the activity type (such as C, Labo or TP)", "")
  .action(function (courseAcronym, group, year, semesterSeason, options) {
    let icsParser = new iCalParser(
      options.typeact,
      courseAcronym,
      group,
      year,
      getSemesterSeasonNumber(semesterSeason),
    );

    icsParser.parse().then(ics => console.log(ics));
  });

// ./activity-connector.js parse-dsl ./data/test.dsl LOG210 01 2022 Summer
// node activity-connector.js parse-dsl ./data/test.dsl LOG210 01 2022 Summer
program
  .command("parse-dsl")
  .description(
    "Parses [.dsl file] for specified [activity type] [course symbol] [group] [year] [semester #: Winter(1), Summer(2), Fall (3)]",
  )
  .argument("<dsl-file-path>", "The path to the DSL file")
  .argument(
    "<course-acronym>",
    "the course's acronym (e.g. LOG210, GTI745, MEC200, ...)",
  )
  .argument(
    "<group>",
    "the group number for the course (if the group is a single digit, add a 0 in front e.g. 01, 02, ...)",
  )
  .argument("<year>", "the year of the course")
  .argument(
    "<semesterSeason>",
    "the semester season (options are Winter, Summer or Fall)",
  )
  .option("-t, --typeact", "the activity type (such as C, Labo or TP)", "")
  .action(async function (
    dslFilePath,
    courseAcronym,
    group,
    year,
    semesterSeason,
    options,
  ) {
    string = fs.readFileSync(dslFilePath, { encoding: "utf8" });
    ical = new iCalParser(
      options.typeact,
      courseAcronym,
      group,
      year,
      getSemesterSeasonNumber(semesterSeason),
    );
    ical.parse().then(ics => {
      console.log(
        dslDateParser.getListModifiedTimes(ics, DSLParser.parse(string)[1]),
      );
    });
  });

// ./activity-connector.js update data/backup-moodle2-course-17014-s20222-log210-99-20220619-1506-nu.mbz data/test.dsl LOG210 01 2022 Summer
// node activity-connector.js update .\data\backup-moodle2-course-17014-s20222-log210-99-20220619-1506-nu.mbz .\data\test.dsl LOG210 01 2022 Summer
program
  .command("update")
  .description(
    "Extracts, updates values and repackages [.mbz file] using [.dsl file] [activity type] [course symbol] [group] [year] [semester #: Winter(1), Summer(2), Fall (3)]",
  )
  .argument("<mbz-file-path>", "the path of the mbz file")
  .argument("<dsl-file-path>", "the path of the dsl file")
  .argument(
    "<course-acronym>",
    "the course's acronym (e.g. LOG210, GTI745, MEC200, ...)",
  )
  .argument(
    "<group>",
    "the group number for the course (if the group is a single digit, add a 0 in front e.g. 01, 02, ...)",
  )
  .argument("<year>", "the year of the course")
  .argument(
    "<semesterSeason>",
    "the semester season (options are Winter, Summer or Fall)",
  )
  .action(async function (
    mbzFilePath,
    dslFilePath,
    courseAcronym,
    group,
    year,
    semesterSeason,
  ) {
    var string = fs.readFileSync(dslFilePath, { encoding: "utf8" });
    var ical = new iCalParser(
      "",
      courseAcronym,
      group,
      year,
      getSemesterSeasonNumber(semesterSeason),
    );
    var calendarActivities = await ical.parse();
    var newTimes = dslDateParser.getListModifiedTimes(
      calendarActivities,
      DSLParser.parse(string)[1],
    );

    var newPath = path.join(
      "tmp",
      mbzFilePath.split("\\").pop().split("/").pop().split(".mbz")[0],
      "/",
    );
    extractTar(mbzFilePath);
    var activities = fetchActivities(newPath);

    // TODO Refactor into another file
    // TODO only modifies quiz so far, have to cover the other classes
    for (const obj of newTimes) {
      if (obj.activity.includes("Quiz")) {
        var index = Number.parseInt(obj.activity.split(" ")[2]) - 1;
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
