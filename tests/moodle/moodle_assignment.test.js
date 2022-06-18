const MoodleAssignment = require('../../app/models/moodle_assignment')

test('edit moodle assignment', () => {
    var assignment = new MoodleAssignment("test", "1", "1", "test_module", "file_path" , "1234" , "4321")
    
    assignment.setDueDate("12345")
    expect(assignment.duedate).toBe("12345")

    assignment.setAllowSubmissionsFromDate("54321")
    expect(assignment.allowsubmissionsfromdate).toBe("54321")
})