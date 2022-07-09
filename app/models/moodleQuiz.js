const MoodleActivity = require('./moodleActivity');

class MoodleQuiz extends MoodleActivity {
  constructor(
    title,
    moduleId,
    sectionId,
    moduleName,
    directory,
    timeOpen,
    timeClose,
  ) {
    super(title, moduleId, sectionId, moduleName, directory);
    this.timeOpen = timeOpen;
    this.timeClose = timeClose;
  }
  getTimeOpen() {
    return this.timeOpen;
  }
  setTimeOpen(timeOpen) {
    this.timeOpen = timeOpen;
  }
  getTimeClose() {
    return this.timeClose;
  }
  setTimeClose(timeClose) {
    this.timeClose = timeClose;
  }
}

module.exports = MoodleQuiz;
