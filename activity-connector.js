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

program
  .command("extract")
  .description("Extracts [.mbz file] to the tmp directory")
  .argument("<file-path>", "the path to the .mbz file to extract")
  .action(function (filePath) {
    try{
      console.log("Extracting .mbz file...");
      extractTar(filePath);
      console.log("Done!");
    } catch (err) {
      console.error(err.message)
    }
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
    try {
      let icsParser = new iCalParser(
        options.typeact,
        courseAcronym,
        group,
        year,
        getSemesterSeasonNumber(semesterSeason),
      );
      icsParser.parse().then(ics => console.log(ics));
    } catch (err) {
      console.error(err.message);
    }
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
    try {
      let string = fs.readFileSync(dslFilePath, { encoding: "utf8" });
      let ical = new iCalParser(
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
    } catch (err) {
      console.error(err.message)
    }
  });

// ./activity-connector.js update data/backup-moodle2-course-17014-s20222-log210-99-20220619-1506-nu.mbz data/test.dsl LOG210 01 2022 Summer
// node activity-connector.js update .\data\backup-moodle2-course-17014-s20222-log210-99-20220703-1253-nu.mbz .\data\test.dsl LOG210 01 2022 Summer
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
    try{
      let semesterSeasonNumber = getSemesterSeasonNumber(semesterSeason)
      console.log("Fetching DSL...");
      var string = fs.readFileSync(dslFilePath, { encoding: "utf8" });
  
      console.log("Fetching .ics calendar...");
      var ical = new iCalParser(
        "",
        courseAcronym,
        group,
        year,
        semesterSeasonNumber,
      );
      var calendarActivities = await ical.parse();
  
      console.log("Parse DSL and getting new dates...");
      var newTimes = dslDateParser.getListModifiedTimes(
        calendarActivities,
        DSLParser.parse(string)[1],
      );
  
      var newPath = path.join(
        "tmp",
        mbzFilePath.split("\\").pop().split("/").pop().split(".mbz")[0],
        "/",
      );
  
      console.log("Extracting .mbz file...");
      extractTar(mbzFilePath);
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
                activity.setAllowSubmissionsFromDate(`${obj.open.getTime() / 1000}`);
                activity.setCutoffDate(`${obj.cutoff.getTime() / 1000}`)
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
            if (activity instanceof MoodleQuiz && activity.title.toLowerCase().includes("exam")) {
              if (i == index) {
                activity.setTimeOpen(`${obj.open.getTime() / 1000}`);
                activity.setTimeClose(`${(obj.open.getTime() / 1000) + Number.parseInt(activity.getTimeLimit())}`)
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
      console.error(err.message)
    }
  });

program.parse(process.argv);
