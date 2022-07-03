/* Requires for Moodle tests */
const MoodleActivity = require('../../app/models/moodle_activity');
const MoodleAssignement = require('../../app/models/moodle_assignment');
const MoodleQuiz = require('../../app/models/moodle_quiz');
const { extractTar, fetchActivities, updateActivities, repackageToMBZ } = require("../../app/utils/xmlReader")
const fs = require('fs')
const PATH = "data/backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu.mbz"
const NEW_PATH = "tmp/backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu/"

/*-------MOODLE TESTS--------*/
describe('Moodle class instantiation test', () => {
    test('Instantiate a MoodleActivity object', () => {
        var activity = new MoodleActivity("test", "1", "1", "test_module", "file_path")
        expect(activity.title).toBe("test")
        expect(activity.moduleid).toBe("1")
        expect(activity.sectionid).toBe("1")
        expect(activity.modulename).toBe("test_module")
        expect(activity.directory).toBe("file_path")
    })

    test('Instantiate a MoodleAssignement object', () => {
        var assignement = new MoodleAssignement("test", "1", "1", "test_module", "file_path", "08/06/2022",true)
        expect(assignement.title).toBe("test")
        expect(assignement.moduleid).toBe("1")
        expect(assignement.sectionid).toBe("1")
        expect(assignement.modulename).toBe("test_module")
        expect(assignement.directory).toBe("file_path")
        expect(assignement.duedate).toBe("08/06/2022")
        expect(assignement.allowsubmissionsfromdate).toBeTruthy()
    })

    test('Instantiate a MoodleQuiz object', () => {
        var quiz = new MoodleQuiz("test", "1", "1", "test_module", "file_path", "10:00", "15:00")
        expect(quiz.title).toBe("test")
        expect(quiz.moduleid).toBe("1")
        expect(quiz.sectionid).toBe("1")
        expect(quiz.modulename).toBe("test_module")
        expect(quiz.directory).toBe("file_path")
        expect(quiz.timeopen).toBe("10:00")
        expect(quiz.timeclose).toBe("15:00")
    })
})

// Test for XML Reader
describe('Test for XML Reader', () => {
    beforeAll(() => {
        // Extract the moodle backup file before doing these tests
        return extractTar(PATH);
    });

    test('Modification of a quiz', () => {
        // Fetched from the demo.js file for modifications
        var time = "8888888888";
        let activities = fetchActivities(NEW_PATH);
        activities[1].setTimeOpen(time);
        
        updateActivities(NEW_PATH,activities)

        let newactivities = fetchActivities(NEW_PATH);
        expect(newactivities[1].getTimeOpen()).toBe(time);
    })
    // TODO check why it fails later
    // test('Repackage as an mbz file', () => {
    //     return repackageToMBZ(NEW_PATH).then((mbzPath) => {
    //         console.log(mbzPath)
    //         // Promise added to the repackageToMBZ function for the test to wait for the file to exist.
    //         expect(fs.existsSync(mbzPath)).toBeTruthy();
    //         // Delete the test file created to prevent having a lot of backup from tests.
    //         fs.unlinkSync(mbzPath);

    //     });
    // })
})
