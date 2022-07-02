var MoodleQuiz = require('./app/models/moodle_quiz');
const {
  extractTar,
  fetchActivities,
  updateActivities,
  repackageToMBZ,
} = require('./utils/xmlReader');

var path =
  'data/backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu.mbz';
var new_path =
  'tmp/backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu/';

extractTar(path);

//Editing moodle quiz openDate
// let quiz = new MoodleQuiz();

// console.log("Quiz before editing :",fetchActivities(new_path)[1])

// quiz = fetchActivities(new_path)[1];
// quiz.setTimeOpen("000000");
// console.log("Quiz after editing :", quiz);

let quiz = new MoodleQuiz();

/* Modification d'un quiz et repackage en mbz */
let actvities = fetchActivities(new_path);
console.log('Activities', actvities[1]);

actvities[1].setTimeOpen('8888888888');
console.log(actvities[1]);

updateActivities(new_path, actvities);

let newactvities = fetchActivities(new_path);
console.log('Updated Activities', newactvities[1]);

repackageToMBZ(new_path);
