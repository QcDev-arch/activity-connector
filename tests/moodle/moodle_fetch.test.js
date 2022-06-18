/* Requires for Moodle tests */
const MoodleActivity = require('../../app/models/moodle_activity');
const MoodleAssignement = require('../../app/models/moodle_assignment');
const MoodleQuiz = require('../../app/models/moodle_quiz');


/* Function called only once before all the tests in this file */
beforeAll(() => {
    // Use returns if the function your going to call returns a promess
    return true;
});

/* Function called only once after all the tests in this file */
afterAll(() => {
    // Use returns if the function your going to call returns a promess
    return true;
});

/* Function called before each of the tests in this file */
beforeEach(() => {
    true;
});

/* Function called after each of the tests in this file */
afterEach(() => {
    true;
});

/*-------MOODLE TESTS--------*/

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

// Test for XML Reader
// To be written