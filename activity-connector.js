#!/usr/bin/env node
const path = require("path");
const program = require("commander");
const fs = require("fs");

const dslDateParser = require("./app/utils/dslDateParser");
const DSLParser = require("./app/utils/dslParser");
const iCalParser = require("./app/utils/iCalParser");
const MoodleQuiz = require("./app/models/moodleQuiz");
const {
  extractTar,
  fetchActivities,
  updateActivities,
  repackageToMBZ,
} = require("./app/utils/xmlReader");
const { SEMESTERS } = require("./app/utils/constants");
const MoodleAssignment = require("./app/models/moodleAssignment");
const { InvalidSemesterSeason } = require("./app/exceptions");
const { exit } = require("process");

const getSemesterSeasonNumber = function (semesterSeason) {
  switch (semesterSeason) {
    case SEMESTERS.WINTER:
      return 1;
    case SEMESTERS.SUMMER:
      return 2;
    case SEMESTERS.FALL:
      return 3;
    default:
      throw new InvalidSemesterSeason(semesterSeason);
  }
};

// node activity-connector.js extract-mbz -p ./data/backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu.mbz
program
  .command("extract-mbz")
  .description("Extracts .mbz file to the tmp directory")
  .requiredOption(
    "-p, --path <directory>",
    "(required) the path to the .mbz file to extract",
  )
  .action(function (options) {
    try {
      console.log("Extracting .mbz file...");
      extractTar(options.path);
      console.log("Done!");
    } catch (err) {
      console.error(err.message);
    }
  });

// node activity-connector.js print-dir --path ./tmp/backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu
program
  .command("print-dir")
  .summary("Outputs all activities from a mbz directory")
  .description(
    `Outputs all activities from a mbz directory
Example: node activity-connector.js print-dir --path ./path/to/directory`,
  )
  .requiredOption(
    "-p, --path <directory>",
    "(required) the directory to the extracted Moodle files.",
  )
  .action(function (options) {
    console.log(fetchActivities(options.path));
  });

// node activity-connector.js print-ics --acronym LOG210 --group 01 --year 2022 --semester Summer
program
  .command("print-ics")
  .summary("Outputs dates for a course")
  .description(
    `Parses a calendar and outputs its informations.

If the -if, --icsfile option is passed to the command, the ics file will be used instead of the API. 
Otherwise, the required options are --acronym, --group, --year and --semester (short flags are also accepted).

Example: node activity-connector.js print-ics -a LOG210 -g 01 -y 2022 -s Summer
         node activity-connector.js print-ics -if ./path/to/file.ics`,
  )
  .option("-if, --icsfile <directory>", "the path to the ics file")
  .option(
    "-a, --acronym <course>",
    "the course's acronym (e.g. LOG210, GTI745, MEC200, ...)",
  )
  .option(
    "-g, --group <number>",
    "the group number for the course (if the group is a single digit, add a 0 in front e.g. 01, 02, ...)",
  )
  .option("-y --year <number>", "the year of the course")
  .option(
    "-s --semester <season>",
    "the semester's season. The options are Winter, Summer or Fall",
  )
  .option(
    "-t, --typeact <string>",
    "(optional) the activity type (such as C, Labo or TP)",
    "",
  )
  .action(function (options) {
    try {
      let ical;

      if (options.icsfile) {
        ical = new iCalParser();
        ical.parseFile(options.icsfile).then(ics => {
          console.log(ics);
        });
      } else {
        // Check input values
        if (
          !options.acronym ||
          !options.group ||
          !options.year ||
          !options.semester
        ) {
          throw new Error(
            "(error) Incorrect parameters passed. Please check that all the required parameters were correctly entered (use -h for help).",
          );
        }

        ical = new iCalParser(
          options.typeact,
          options.acronym,
          options.group,
          options.year,
          getSemesterSeasonNumber(options.semester),
        );

        ical.parse().then(ics => console.log(ics));
      }
    } catch (err) {
      console.error(err.message);
    }
  });

// node activity-connector.js parse-dsl -dp ./data/test.dsl -a LOG210 -g 01 -y 2022 -s Summer
// node activity-connector.js parse-dsl -dp ./data/test.dsl -if ./data/Seances.ics
program
  .command("parse-dsl")
  .summary("Parses a plan (.dsl) file and outputs new dates based on a course")
  .description(
    `Parses a plan (.dsl) file and outputs new dates based on a course's calendar.

If the -if, --icsfile option is passed to the command, the ics file will be used instead of the ETS API. 
Otherwise, the required options are --acronym, --group, --year and --semester (short flags are also accepted).
The -dp flag is always required.

Example: node activity-connector.js parse-dsl -dp ./path/to/file.dsl -a LOG210 -g 01 -y 2022 -s Summer
         node activity-connector.js parse-dsl -dp ./path/to/file.dsl -if ./path/to/file.ics`,
  )
  .requiredOption(
    "-dp, --dslpath <directory>",
    "(required) the path to the plan (.dsl) file",
  )
  .option("-if, --icsfile <directory>", "the path to the calendar (.ics) file")
  .option(
    "-a, --acronym <course>",
    "the École de technologie supérieure course's acronym (e.g. LOG210, GTI745, MEC200, ...)",
  )
  .option(
    "-g, --group <number>",
    "the group number for the École de technologie supérieure course (if the group is a single digit, add a 0 in front e.g. 01, 02, ...)",
  )
  .option("-y --year <number>", "the year of the École de technologie supérieure course")
  .option(
    "-s --semester <name>",
    "the École de technologie supérieure semester's name. The options are Winter, Summer or Fall",
  )
  .option(
    "-t, --typeact <string>",
    "(optional) the École de technologie supérieure activity type (such as C, Labo or TP)",
    "",
  )
  .action(async function (options) {
    try {
      let activityPlan = fs.readFileSync(options.dslpath, { encoding: "utf8" });
      let ical;

      if (options.icsfile) {
        ical = new iCalParser();
        ical.parseFile(options.icsfile).then(ics => {
          console.log(
            dslDateParser.getListModifiedTimes(ics, DSLParser.parse(activityPlan)[1]),
          );
        });
      } else {
        // Check input values
        if (
          !options.acronym ||
          !options.group ||
          !options.year ||
          !options.semester
        ) {
          throw new Error(
            "(error) Incorrect parameters passed. Please check that all the required parameters were correctly entered (use -h for help).",
          );
        }

        ical = new iCalParser(
          options.typeact,
          options.acronym,
          options.group,
          options.year,
          getSemesterSeasonNumber(options.semester),
        );

        ical.parse().then(ics => {
          console.log(
            dslDateParser.getListModifiedTimes(ics, DSLParser.parse(activityPlan)[1]),
          );
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  });

// node activity-connector.js create -mp ./data/backup-moodle2-course-17014-s20222-log210-99-20220703-1253-nu.mbz -dp ./data/test.dsl -a LOG210 -g 01 -y 2022 -s Summer
program
  .command("create")
  .summary("create a new updated mbz file")
  .description(
    `Create a new, updated backup (.mbz) file using an existing backup (.mbz) file from Moodle, a plan (.dsl) file and the calendar of course events (.ics).

Example: create -mp ./path/to/file.mbz -dp ./path/to/file.dsl -a LOG210 -g 01 -y 2022 -s Summer
         create -mp ./path/to/file.mbz -dp ./path/to/file.dsl -if ./path/to/file.ics`,
  )
  .requiredOption(
    "-mp --mbzpath <directory>",
    "(required) the path of the Moodle backup (.mbz) file",
  )
  .requiredOption(
    "-dp, --dslpath <directory>",
    "(required) the path to the plan (.dsl) file",
  )
  .option("-if, --icsfile <directory>", "the path to the calendar (.ics) file")
  .option(
    "-a, --acronym <course>",
    "the École de technologie supérieure course's acronym (e.g., LOG210, GTI745, MEC200, ...)",
  )
  .option(
    "-g, --group <number>",
    "the group number for the École de technologie supérieure course (if the group is a single digit, add a 0 in front e.g., 01, 02, ...)",
  )
  .option("-y --year <number>", "the year of the École de technologie supérieure course, e.g., 2022")
  .option(
    "-s --semester <name>",
    "the École de technologie supérieure semester's name. The options are Winter, Summer or Fall.",
  )
  .action(async function (options) {
    try {
      console.log("Fetching activity plan (.dsl) file...");
      var activityPlan = fs.readFileSync(options.dslpath, { encoding: "utf8" });

      console.log("Fetching .ics calendar...");
      let ical;
      var calendarActivities;
      if (options.icsfile) {
        ical = new iCalParser();
        calendarActivities = await ical.parseFile(options.icsfile);
      } else {
        // Check input values
        if (
          !options.acronym ||
          !options.group ||
          !options.year ||
          !options.semester
        ) {
          throw new Error(
            "(error) Incorrect parameters passed. Please check that all the required parameters were correctly entered (use -h for help).",
          );
        }

        ical = new iCalParser(
          "",
          options.acronym,
          options.group,
          options.year,
          getSemesterSeasonNumber(options.semester),
        );
        calendarActivities = await ical.parse();
      }

      console.log("Parse activity plan (.dsl) file and getting new dates...");
      try {
        var newTimes = dslDateParser.getListModifiedTimes(
          calendarActivities,
          DSLParser.parse(activityPlan)[1],
        );          
      } catch (error) {
        // console.error(`Start line ${error.location.start.line}, start column ${error.location.start.column}`);
        // console.error(`End line ${error.location.end.line}, end column ${error.location.end.column}`);
        console.error(`ERROR parsing plan data in ${options.dslpath} at line ${error.location.start.line}:`);
        console.error(`${activityPlan.split("\r\n")[error.location.start.line-1]}`);
        console.error(" ".repeat(error.location.start.column-1) + "^".repeat(error.location.end.column - error.location.start.column));
        console.error(`${error.message}`);
        exit(1);
      }

      var newPath = path.join(
        "tmp",
        options.mbzpath.split("\\").pop().split("/").pop().split(".mbz")[0],
        "/",
      );

      console.log("Extracting .mbz file...");
      extractTar(options.mbzpath);
      var activities = fetchActivities(newPath);

      // TODO Refactor into another file
      // TODO only modifies quiz so far, have to cover the other classes
      console.log("Modifying Moodle activity dates...");
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
        if (obj.activity.includes("Homework")) {
          var index = Number.parseInt(obj.activity.split(" ")[2]) - 1;
          let i = 0;
          for (var activity of activities) {
            if (activity instanceof MoodleAssignment) {
              if (i == index) {
                activity.setDueDate(`${obj.due.getTime() / 1000}`);
                activity.setAllowSubmissionsFromDate(
                  `${obj.open.getTime() / 1000}`,
                );
                activity.setCutoffDate(`${obj.cutoff.getTime() / 1000}`);
                break;
              }
              i++;
            }
          }
        }
        if (obj.activity.includes("Exam")) {
          var index = Number.parseInt(obj.activity.split(" ")[1]) - 1;
          let i = 0;
          for (var activity of activities) {
            if (
              activity instanceof MoodleQuiz &&
              activity.title.toLowerCase().includes("exam")
            ) {
              if (i == index) {
                activity.setTimeOpen(`${obj.open.getTime() / 1000}`);
                activity.setTimeClose(
                  `${
                    obj.open.getTime() / 1000 +
                    Number.parseInt(activity.getTimeLimit())
                  }`,
                );
                break;
              }
              i++;
            }
          }
        }
      }
      updateActivities(newPath, activities);

      console.log("Repackaging...");
      let mbzPath = await repackageToMBZ(newPath);

      console.log("Done! The new .mbz file with updated activity dates is in the following path:", mbzPath);
    } catch (err) {
      console.error(err.message);
    }
  });

program.parse(process.argv);
