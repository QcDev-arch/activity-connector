const MoodleActivity = require("./moodleActivity");

class MoodleAssignment extends MoodleActivity {
  constructor(
    title,
    moduleId,
    sectionId,
    moduleName,
    directory,
    dueDate,
    allowSubmissionsFromDate,
    cutOffDate,
  ) {
    super(title, moduleId, sectionId, moduleName, directory);
    this.dueDate = dueDate;
    this.allowSubmissionsFromDate = allowSubmissionsFromDate;
    this.cutOffDate = cutOffDate;
  }
  getDueDate() {
    return this.dueDate;
  }
  setDueDate(dueDate) {
    this.dueDate = dueDate;
  }
  setAllowSubmissionsFromDate(allowSubmissionsFromDate) {
    this.allowSubmissionsFromDate = allowSubmissionsFromDate;
  }
  getAllowSubmissionsFromDate() {
    return this.allowSubmissionsFromDate;
  }

  getCutoffDate() {
    return this.cutOffDate;
  }

  setCutoffDate(cutOffDate) {
    this.cutOffDate = cutOffDate;
  }
}

module.exports = MoodleAssignment;
