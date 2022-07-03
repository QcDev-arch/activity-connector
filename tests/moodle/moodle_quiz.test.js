const MoodleQuiz = require('../../app/models/moodleQuiz');

test('edit moodle quiz', () => {
  var quiz = new MoodleQuiz(
    'test',
    '1',
    '1',
    'test_module',
    'file_path',
    '1234',
    '4321',
  );

  quiz.setTimeOpen('12345');
  expect(quiz.timeOpen).toBe('12345');

  quiz.setTimeClose('54321');
  expect(quiz.timeClose).toBe('54321');
});
