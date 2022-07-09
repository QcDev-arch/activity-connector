const MoodleAssignment = require("../../app/models/moodleAssignment");

test("edit moodle assignment", () => {
  const assignment = new MoodleAssignment(
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
  expect(assignment.dueDate).toBe("12345");

  assignment.setAllowSubmissionsFromDate("54321");
  expect(assignment.allowSubmissionsFromDate).toBe("54321");

  assignment.setCutoffDate("54321");
  expect(assignment.cutOffDate).toBe("54321");
});
