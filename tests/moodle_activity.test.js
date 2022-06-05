const MoodleActivity = require('../app/models/moodle_activity')


test('instantiate MoodleActivity', () => {
    var activity = new MoodleActivity("test", "1", "1", "test_module", "file_path")
    expect(activity.title).toBe("test")
})