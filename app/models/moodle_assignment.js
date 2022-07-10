const MoodleActivity = require('./moodle_activity');

class MoodleAssignment extends MoodleActivity {
  constructor(
    title,
    moduleid,
    sectionid,
    modulename,
    directory,
    duedate,
    allowsubmissionsfromdate,
    cutoffdate
  ) {
    super(title, moduleid, sectionid, modulename, directory);
    this.duedate = duedate;
    this.allowsubmissionsfromdate = allowsubmissionsfromdate;
    this.cutoffdate = cutoffdate
  }
  getDueDate() {
    return this.duedate;
  }
  setDueDate(dueDate) {
    this.duedate = dueDate;
  }
  setAllowSubmissionsFromDate(allowSubmissionsFromDate) {
    this.allowsubmissionsfromdate = allowSubmissionsFromDate;
  }
  getAllowSubmissionsFromDate() {
    return this.allowsubmissionsfromdate;
  }

  getCutoffDate() {
    return this.cutoffdate
  }

  setCutoffDate(cutoffdate) {
    this.cutoffdate = cutoffdate
  }
}

module.exports = MoodleAssignment;
