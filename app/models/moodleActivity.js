module.exports = class MoodleActivity {
  constructor(title, moduleId, sectionId, moduleName, directory) {
    this.title = title;
    this.moduleId = moduleId;
    this.sectionid = sectionId;
    this.moduleName = moduleName;
    this.directory = directory;
  }
  getModuleId() {
    return this.moduleId;
  }
  getModuleName() {
    return this.moduleName;
  }
};
