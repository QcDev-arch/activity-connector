var MoodleQuiz = require('./app/models/moodle_quiz')
var XMLReader = require('./app/xml_reader')
var path = "data/backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu.mbz"
var new_path = "tmp/backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu/"

XMLReader.extract_tar(path)

//Editing moodle quiz openDate
let quiz = new MoodleQuiz();

console.log("Quiz before editing :", XMLReader.fetch_activities(new_path)[1])

quiz = XMLReader.fetch_activities(new_path)[1];
quiz.setTimeOpen("000000");
console.log("Quiz after editing :", quiz);