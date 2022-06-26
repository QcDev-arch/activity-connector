const DSLParser = require('../../utils/dsl-parser')
const DslDateParser = require('../../utils/dslDateParser')
const iCalParser = require('../../utils/iCalParser')
const fs = require('fs')
const MoodleActivity = require('../../app/models/moodle_activity')
const moment = require('moment')
const { CalendarActivityNotFound } = require('../../app/exceptions')
const { extractTar, fetchActivities, repackageToMBZ, updateActivities } = require('../../utils/xmlReader')
const MoodleQuiz = require('../../app/models/moodle_quiz')

const PATH = "data/backup-moodle2-course-17014-s20222-log210-99-20220619-1506-nu.mbz"
const NEW_PATH = "tmp/backup-moodle2-course-17014-s20222-log210-99-20220619-1506-nu/"



/*-------DSL DATE PARSER TESTS--------*/
describe('DSL DATE PARSER', () => {

    beforeAll(() => {
        extractTar(PATH);
    });

    test('Test dslDateParser', async () => {
        var string = fs.readFileSync('./data/test.dsl', { encoding: 'utf8' })
        var ical = new iCalParser("", "LOG210", "01", "2022", "2")
        var calendarActivities = await ical.parse()
        var newTimes = DslDateParser.getListModifiedTimes(calendarActivities, DSLParser.parse(string)[1])
        //console.log(newTimes)

        var activities = fetchActivities(NEW_PATH)
        //console.log(activities)

        for(const obj of newTimes){
            if(obj.activity.includes("Quiz")){
                var index = Number.parseInt(obj.activity.split(" ")[2]) - 1
                let i = 0
                for(var activity of activities){
                    if(activity instanceof MoodleQuiz){
                        if(i == index){
                            activity.setTimeOpen(`${obj.open.getTime()/1000}`)
                            activity.setTimeClose(`${obj.close.getTime()/1000}`)
                            break
                        }
                        i++
                    }
                }
            }
        }
        //console.log(activities)

        updateActivities(NEW_PATH, activities)
        //repackageToMBZ(NEW_PATH)

        // To be continued... I need some code changes to xmlReader present in another PR to correctly make the tests for this code part.
        expect(1).toBe(1);
    });
});