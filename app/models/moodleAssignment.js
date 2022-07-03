const MoodleActivity = require('./moodleActivity');

class MoodleAssignment extends MoodleActivity {
  constructor(
    title,
    moduleId,
    sectionId,
    moduleName,
    directory,
    dueDate,
    allowSubmissionsFromDate,
  ) {
    super(title, moduleId, sectionId, moduleName, directory);
    this.dueDate = dueDate;
    this.allowSubmissionsFromDate = allowSubmissionsFromDate;
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
}

module.exports = MoodleAssignment;
