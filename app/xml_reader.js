var MoodleActivity = require('./models/moodle_activity')
var MoodleQuiz = require('./models/moodle_quiz')
var MoodleAssignment = require('./models/moodle_assignment')
var fs = require('fs')
var tar = require('tar')
var xml2js = require('xml2js')
var base_path = './tmp'

function extract_tar(file_path) {
    // Checks if tmp directory exists
    if (!fs.existsSync(base_path)) {
        fs.mkdirSync(base_path)
    }
    // Check if mbz file exists, then extract to tmp directory
    if (file_path.endsWith(".mbz")) {
        try {
            var new_directory = base_path + "/" + file_path.split("/").pop().replace(".mbz", "")
            if (!fs.existsSync(new_directory)) {
                fs.mkdirSync(new_directory)
            }
            tar.x({
                file: file_path,
                C: new_directory,
                sync: true
            })
        } catch (error) {
            // TODO add error handling with custom exception
            console.log(error)
        }
    }
}


function fetch_quiz_info(file_path, directory) {
    var data = fs.readFileSync(file_path + directory + "/quiz.xml", "utf-8")
    var quiz_info
    xml2js.parseString(data, function (err, data) {
        quiz_info = {
            timeopen: data['activity']['quiz'][0]['timeopen'][0],
            timeclose: data['activity']['quiz'][0]['timeopen'][0],
        }
    })

    return quiz_info
}


function fetch_assign_info(file_path, directory) {
    var data = fs.readFileSync(file_path + directory + "/assign.xml", "utf-8")
    var assign_info
    xml2js.parseString(data, function (err, data) {
        assign_info = {
            duedate: data['activity']['assign'][0]['duedate'][0],
            allowsubmissionsfromdate: data['activity']['assign'][0]['allowsubmissionsfromdate'][0],
        }
    })

    return assign_info
}

function fetch_activities(file_path) {
    var activities = []
    var xml_data = fs.readFileSync(file_path + "moodle_backup.xml", "utf-8")
    xml2js.parseString(xml_data, function (err, data) {
        for (var obj of data['moodle_backup']['information'][0]['contents'][0]['activities'][0]['activity']) {
            switch (obj.modulename[0]) {
                case 'quiz':
                    quiz_info = fetch_quiz_info(file_path, obj.directory[0])
                    activities.push(new MoodleQuiz(
                        obj.title[0], obj.moduleid[0], obj.sectionid[0], obj.modulename[0], obj.directory[0],
                        quiz_info.timeopen, quiz_info.timeclose
                    ))
                    break;
                case 'assign':
                    assign_info = fetch_assign_info(file_path, obj.directory[0])
                    activities.push(new MoodleAssignment(
                        obj.title[0], obj.moduleid[0], obj.sectionid[0], obj.modulename[0], obj.directory[0],
                        assign_info.duedate, assign_info.allowsubmissionsfromdate
                    ))
                    break;
                default:
                    activities.push(new MoodleActivity(obj.title[0], obj.moduleid[0], obj.sectionid[0], obj.modulename[0], obj.directory[0]))
                    break;

            }
        }
    })
    //console.log(activities)
    return activities
}
// var path = "data/backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu.mbz"
// var new_path = "tmp/backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu/"

// extract_tar(path)
// fetch_activities(new_path)

module.exports = {
    extract_tar: extract_tar,
    fetch_activities: fetch_activities
}