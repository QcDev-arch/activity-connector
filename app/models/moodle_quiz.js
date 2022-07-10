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
    timelimit
  ) {
    super(title, moduleid, sectionid, modulename, directory);
    this.timeopen = timeopen;
    this.timeclose = timeclose;
    this.timelimit = timelimit;
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

  getTimeLimit() {
    return this.timelimit;
  }
  setTimeLimit(timelimit) {
    this.timelimit = timelimit;
  }
}

module.exports = MoodleQuiz;
