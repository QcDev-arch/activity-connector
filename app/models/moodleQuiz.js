const MoodleActivity = require("./moodleActivity");

class MoodleQuiz extends MoodleActivity {
  constructor(
    title,
    moduleId,
    sectionId,
    moduleName,
    directory,
    timeOpen,
    timeClose,
    timeLimit,
  ) {
    super(title, moduleId, sectionId, moduleName, directory);
    this.timeOpen = timeOpen;
    this.timeClose = timeClose;
    this.timeLimit = timeLimit;
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

  getTimeLimit() {
    return this.timeLimit;
  }
  setTimeLimit(timeLimit) {
    this.timeLimit = timeLimit;
  }
}

module.exports = MoodleQuiz;
