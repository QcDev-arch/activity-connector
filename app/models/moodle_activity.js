module.exports = class MoodleActivity {
  constructor(title, moduleid, sectionid, modulename, directory) {
    this.title = title;
    this.moduleid = moduleid;
    this.sectionid = sectionid;
    this.modulename = modulename;
    this.directory = directory;
  }
  getModuleId() {
    return this.moduleid;
  }
  getModuleName() {
    return this.modulename;
  }
};
