var MoodleActivity = require("../models/moodle_activity");
var MoodleQuiz = require("../models/moodle_quiz");
var MoodleAssignment = require("../models/moodle_assignment");
var archiver = require("archiver");
var fs = require("fs");
var path = require("path");
var tar = require("tar");
var xml2js = require("xml2js");
var base_path = "./tmp";

function extractTar(file_path) {
  // Checks if tmp directory exists
  if (!fs.existsSync(base_path)) {
    fs.mkdirSync(base_path);
  }
  // Check if mbz file exists, then extract to tmp directory
  if (file_path.endsWith(".mbz")) {
    try {
      var new_directory = path.join(
        base_path,
        file_path.split("data").pop().replace(".mbz", ""),
      );
      if (!fs.existsSync(new_directory)) {
        fs.mkdirSync(new_directory);
      }
      tar.x({
        file: file_path,
        C: new_directory,
        sync: true,
      });
    } catch (error) {
      throw error
    }
  }
}

function fetchQuizInfo(file_path, directory) {
  const quizPath = path.join(file_path, directory, "quiz.xml");
  var data = fs.readFileSync(quizPath, "utf-8");
  var quiz_info;
  xml2js.parseString(data, function (err, data) {
    if(err){
      throw err
    }
    quiz_info = {
      timeopen: data["activity"]["quiz"][0]["timeopen"][0],
      timeclose: data["activity"]["quiz"][0]["timeclose"][0],
    };
  });

  return quiz_info;
}

function fetchAssignInfo(file_path, directory) {
  const assignPath = path.join(file_path, directory, "assign.xml");
  var data = fs.readFileSync(assignPath, "utf-8");
  var assign_info;
  xml2js.parseString(data, function (err, data) {
    if(err){
      throw err
    }
    assign_info = {
      duedate: data["activity"]["assign"][0]["duedate"][0],
      allowsubmissionsfromdate:
        data["activity"]["assign"][0]["allowsubmissionsfromdate"][0],
    };
  });

  return assign_info;
}

function fetchActivities(file_path) {
  var activities = [];

  var xml_data = fs.readFileSync(
    path.join(file_path, "moodle_backup.xml"),
    "utf-8",
  );
  xml2js.parseString(xml_data, function (err, data) {
    if (err) {
      throw err;
    }
    for (var obj of data["moodle_backup"]["information"][0]["contents"][0][
      "activities"
    ][0]["activity"]) {
      switch (obj.modulename[0]) {
        case "quiz":
          quiz_info = fetchQuizInfo(file_path, obj.directory[0]);
          activities.push(
            new MoodleQuiz(
              obj.title[0],
              obj.moduleid[0],
              obj.sectionid[0],
              obj.modulename[0],
              obj.directory[0],
              quiz_info.timeopen,
              quiz_info.timeclose,
            ),
          );
          break;
        case "assign":
          assign_info = fetchAssignInfo(file_path, obj.directory[0]);
          activities.push(
            new MoodleAssignment(
              obj.title[0],
              obj.moduleid[0],
              obj.sectionid[0],
              obj.modulename[0],
              obj.directory[0],
              assign_info.duedate,
              assign_info.allowsubmissionsfromdate,
            ),
          );
          break;
        default:
          activities.push(
            new MoodleActivity(
              obj.title[0],
              obj.moduleid[0],
              obj.sectionid[0],
              obj.modulename[0],
              obj.directory[0],
            ),
          );
          break;
      }
    }
  });
  return activities;
}

function updateActivities(file_path, activities) {
  for (let i = 0; i < activities.length; i++) {
    let updatePath = path.join(file_path, activities[i].directory, activities[i].getModuleName() + ".xml");
    var xml_data = fs.readFileSync(updatePath);
    xml2js.parseString(xml_data, function (err, data) {
      if(err){
        throw err
      }
      switch (activities[i].getModuleName()) {
        case "quiz":
          data["activity"]["quiz"][0].timeopen = [activities[i].getTimeOpen()];
          data["activity"]["quiz"][0].timeclose = [
            activities[i].getTimeClose(),
          ];

          const quizBuilder = new xml2js.Builder();
          const xmlQuiz = quizBuilder.buildObject(data);

          fs.writeFileSync(updatePath, xmlQuiz, err => {
            if (err) {
              throw err;
            }
          });
          break;
        case "assign":
          data["activity"]["assign"][0].duedate = [activities[i].getDueDate()];
          data["activity"]["assign"][0].allowsubmissionsfromdate = [
            activities[i].getAllowSubmissionsFromDate(),
          ];

          const assignBuilder = new xml2js.Builder();
          const xmlAssign = assignBuilder.buildObject(data);

          fs.writeFileSync(updatePath, xmlAssign, err => {
            if (err) {
              throw err;
            }
          });
          break;
      }
    });
  }
}

async function repackageToMBZ(file_path) {
  var updatedate = new Date();
  var datestring =
    updatedate.getDay() +
    "-" +
    (updatedate.getMonth() + 1) +
    "_" +
    updatedate.getHours() +
    "_" +
    updatedate.getMinutes();
  var mbzPath = path.join(
    "mbzPackages",
    "moodle-backup-" + datestring + ".mbz",
  );
  var output = fs.createWriteStream(mbzPath);
  var archive = archiver("zip");

  output.on("close", function () {
    // console.log(archive.pointer() + ' total bytes');
  });

  archive.on("error", function (err) {
    throw err;
  });

  archive.pipe(output);

  archive.directory(file_path, false);

  archive.finalize();

  return mbzPath;
}

module.exports = {
  extractTar: extractTar,
  fetchActivities: fetchActivities,
  updateActivities: updateActivities,
  repackageToMBZ: repackageToMBZ,
};
