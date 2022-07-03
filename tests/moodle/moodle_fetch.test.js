/* Requires for Moodle tests */
const MoodleActivity = require('../../app/models/moodleActivity');
const MoodleAssignment = require('../../app/models/moodleAssignment');
const MoodleQuiz = require('../../app/models/moodleQuiz');
const { extractTar, fetchActivities, updateActivities } = require("../../utils/xmlReader")
const PATH = "data/backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu.mbz"
const NEW_PATH = "tmp/backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu/"

/*-------MOODLE TESTS--------*/
describe('Moodle class instantiation test', () => {
    test('Instantiate a MoodleActivity object', () => {
        const activity = new MoodleActivity("test", "1", "1", "test_module", "file_path");
        expect(activity.title).toBe("test")
        expect(activity.moduleId).toBe("1")
        expect(activity.sectionid).toBe("1")
        expect(activity.moduleName).toBe("test_module")
        expect(activity.directory).toBe("file_path")
    })

    test('Instantiate a MoodleAssignment object', () => {
        const assignment = new MoodleAssignment("test", "1", "1", "test_module", "file_path", "08/06/2022", true);
        expect(assignment.title).toBe("test")
        expect(assignment.moduleId).toBe("1")
        expect(assignment.sectionid).toBe("1")
        expect(assignment.moduleName).toBe("test_module")
        expect(assignment.directory).toBe("file_path")
        expect(assignment.dueDate).toBe("08/06/2022")
        expect(assignment.allowSubmissionsFromDate).toBeTruthy()
    })

    test('Instantiate a MoodleQuiz object', () => {
        const quiz = new MoodleQuiz("test", "1", "1", "test_module", "file_path", "10:00", "15:00");
        expect(quiz.title).toBe("test")
        expect(quiz.moduleId).toBe("1")
        expect(quiz.sectionid).toBe("1")
        expect(quiz.moduleName).toBe("test_module")
        expect(quiz.directory).toBe("file_path")
        expect(quiz.timeOpen).toBe("10:00")
        expect(quiz.timeClose).toBe("15:00")
    })
})

// Test for XML Reader
describe('Test for XML Reader', () => {
    beforeAll(() => {
        // Extract moodle backup file before doing these tests
        return extractTar(PATH);
    });

    test('Modification of a quiz', () => {
        // Fetched from the demo.js file for modifications
        const time = "8888888888";
        let activities = fetchActivities(NEW_PATH);
        activities[1].setTimeOpen(time);
        
        updateActivities(NEW_PATH,activities)

        let newActivities = fetchActivities(NEW_PATH);
        expect(newActivities[1].getTimeOpen()).toBe(time);
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
