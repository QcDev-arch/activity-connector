const MoodleActivity = require('./moodle_activity');

class MoodleQuiz extends MoodleActivity {
  constructor(
    title,
    moduleid,
    sectionid,
    modulename,
    directory,
    timeopen,
    timeclose,
  ) {
    super(title, moduleid, sectionid, modulename, directory);
    this.timeopen = timeopen;
    this.timeclose = timeclose;
  }
  getTimeOpen() {
    return this.timeopen;
  }
  setTimeOpen(timeOpen) {
    this.timeopen = timeOpen;
  }
  getTimeClose() {
    return this.timeclose;
  }
  setTimeClose(timeClose) {
    this.timeclose = timeClose;
  }
}

module.exports = MoodleQuiz;
