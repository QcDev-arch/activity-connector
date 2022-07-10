#!/usr/bin/env node
const path = require("path");
const program = require("commander");
const fs = require("fs");

const dslDateParser = require("./app/utils/dslDateParser");
const DSLParser = require("./app/utils/dsl-parser");
const iCalParser = require("./app/utils/iCalParser");
const MoodleQuiz = require("./app/models/moodle_quiz");
const {
  extractTar,
  fetchActivities,
  updateActivities,
  repackageToMBZ,
} = require("./app/utils/xmlReader");
const MoodleAssignment = require("./app/models/moodle_assignment");
const { InvalidSemesterSeason } = require("./app/exceptions");

const getSemesterSeasonNumber = function (semesterSeason) {
  switch (semesterSeason) {
    case "Winter":
      return 1;
    case "Summer":
      return 2;
    case "Fall":
      return 3;
    default:
      throw new InvalidSemesterSeason(semesterSeason);
  }
};

// node activity-connector.js extract-mbz -p .\data\backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu.mbz
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

// node activity-connector.js print-dir --path .\tmp\backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu
program
  .command("print-dir")
  .summary("Outputs all activities from a mbz directory")
  .description(`Outputs all activities from a mbz directory
Example: node activity-connector.js print-dir --path ./path/to/directory`)
  .requiredOption(
    "--path <directory>",
    "(required) the directory to the extracted Moodle files.",
  )
  .action(function (options) {
    console.log(fetchActivities(options.path));
  });

// node activity-connector.js print-ics --acronym LOG210 --group 01 --year 2022 --semester Summer
program
  .command("print-ics")
  .summary("Outputs dates for a course")
  .description(`
  `)
  .requiredOption(
    "-a, --acronym <course>",
    "(required) the course's acronym (e.g. LOG210, GTI745, MEC200, ...)",
  )
  .requiredOption(
    "-g, --group <number>",
    "(required) the group number for the course (if the group is a single digit, add a 0 in front e.g. 01, 02, ...)",
  )
  .requiredOption("-y --year <number>", "(required) the year of the course")
  .requiredOption(
    "-s --semester <season>",
    "(required) the semester's season. The options are Winter, Summer or Fall",
  )
  .option("-t, --typeact", "the activity type (such as C, Labo or TP)", "")
  .action(function (options) {
    try {
      let icsParser = new iCalParser(
        options.typeact,
        options.acronym,
        options.group,
        options.year,
        getSemesterSeasonNumber(options.semester),
      );
      icsParser.parse().then(ics => console.log(ics));
    } catch (err) {
      console.error(err.message);
    }
  });

// node activity-connector.js parse-dsl -dp ./data/test.dsl -a LOG210 -g 01 -y 2022 -s Summer
program
  .command("parse-dsl")
  .summary("Parses a dsl file and outputs new dates based on a course")
  .description(
    `Parses a dsl file and outputs new dates based on a course's informations.
Example: node activity-connector.js parse-dsl -dp ./path/to/file.dsl -a LOG210 -g 01 -y 2022 -s Summer`)
  .requiredOption(
    "-dp, --dslpath <directory>",
    "(required) the path to the DSL file",
  )
  .requiredOption(
    "-a, --acronym <course>",
    "(required) the course's acronym (e.g. LOG210, GTI745, MEC200, ...)",
  )
  .requiredOption(
    "-g, --group <number>",
    "(required) the group number for the course (if the group is a single digit, add a 0 in front e.g. 01, 02, ...)",
  )
  .requiredOption("-y --year <number>", "(required) the year of the course")
  .requiredOption(
    "-s --semester <season>",
    "(required) the semester's season. The options are Winter, Summer or Fall",
  )
  .option("-t, --typeact", "the activity type (such as C, Labo or TP)", "")
  .action(async function (options) {
    try {
      let string = fs.readFileSync(options.dslpath, { encoding: "utf8" });
      let ical = new iCalParser(
        options.typeact,
        options.acronym,
        options.group,
        options.year,
        getSemesterSeasonNumber(options.semester),
      );
      ical.parse().then(ics => {
        console.log(
          dslDateParser.getListModifiedTimes(ics, DSLParser.parse(string)[1]),
        );
      });
    } catch (err) {
      console.error(err.message);
    }
  });

// node activity-connector.js create -mp .\data\backup-moodle2-course-17014-s20222-log210-99-20220703-1253-nu.mbz -dp .\data\test.dsl -a LOG210 -g 01 -y 2022 -s Summer
program
  .command("create")
  .summary("create a new updated mbz file")
  .description(
    `Create a new updated mbz file using the mbz backup from
Moodle, the dsl file and informations about the course.

Example: create -mp ./path/to/file.mbz -dp ./path/to/file.dsl -a LOG210 -g 01 -y 2022 -s Summer`,
  )
  .requiredOption("-mp --mbzpath <directory>", "(required) the path of the mbz file")
  .requiredOption(
    "-dp, --dslpath <directory>",
    "(required) the path to the DSL file",
  )
  .requiredOption(
    "-a, --acronym <course>",
    "(required) the course's acronym (e.g. LOG210, GTI745, MEC200, ...)",
  )
  .requiredOption(
    "-g, --group <number>",
    "(required) the group number for the course (if the group is a single digit, add a 0 in front e.g. 01, 02, ...)",
  )
  .requiredOption("-y --year <number>", "(required) the year of the course")
  .requiredOption(
    "-s --semester <season>",
    "(required) the semester's season. The options are Winter, Summer or Fall",
  )
  .action(async function (options) {
    try {
      console.log("Fetching DSL...");
      var string = fs.readFileSync(options.dslpath, { encoding: "utf8" });

      console.log("Fetching .ics calendar...");
      var ical = new iCalParser(
        "",
        options.acronym,
        options.group,
        options.year,
        getSemesterSeasonNumber(options.semester),
      );
      var calendarActivities = await ical.parse();

      console.log("Parse DSL and getting new dates...");
      var newTimes = dslDateParser.getListModifiedTimes(
        calendarActivities,
        DSLParser.parse(string)[1],
      );

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
      console.log("Modifying Moodle Activities...");
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

      console.log("Done! The new .mbz file is in the following path:", mbzPath);
    } catch (err) {
      console.error(err.message);
    }
  });

program.parse(process.argv);
