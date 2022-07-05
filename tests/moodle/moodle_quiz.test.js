const MoodleQuiz = require("../../app/models/moodle_quiz");

test("edit moodle quiz", () => {
  var quiz = new MoodleQuiz(
    "test",
    "1",
    "1",
    "test_module",
    "file_path",
    "1234",
    "4321",
    "720",
  );

  quiz.setTimeOpen("12345");
  expect(quiz.getTimeOpen()).toBe("12345");

  quiz.setTimeClose("54321");
  expect(quiz.getTimeClose()).toBe("54321");

  quiz.setTimeLimit("721");
  expect(quiz.getTimeLimit()).toBe("721");
});
