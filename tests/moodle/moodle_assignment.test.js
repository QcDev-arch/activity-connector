const MoodleAssignment = require('../../app/models/moodleAssignment');

test("edit moodle assignment", () => {
  var assignment = new MoodleAssignment(
    "test",
    "1",
    "1",
    "test_module",
    "file_path",
    "1234",
    "4321",
    "4321",
  );

  assignment.setDueDate("12345");
  expect(assignment.duedate).toBe("12345");

  assignment.setAllowSubmissionsFromDate("54321");
  expect(assignment.allowsubmissionsfromdate).toBe("54321");

  assignment.setCutoffDate("54321");
  expect(assignment.cutoffdate).toBe("54321");
});
