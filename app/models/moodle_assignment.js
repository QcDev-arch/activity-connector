const MoodleActivity = require("./moodle_activity");

class MoodleAssignment extends MoodleActivity{
    constructor(
        title, 
        moduleid, 
        sectionid,
        modulename, 
        directory,
        duedate,
        allowsubmissionsfromdate,
    ){
        super(title, moduleid, sectionid, modulename, directory)
        this.duedate = duedate
        this.allowsubmissionsfromdate = allowsubmissionsfromdate
    }

    setDueDate(dueDate){
        this.duedate = dueDate;
    }

    setAllowSubmissionsFromDate(allowSubmissionsFromDate){
        this.allowsubmissionsfromdate = allowSubmissionsFromDate;
    }
}

module.exports = MoodleAssignment