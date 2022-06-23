#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const dslDateParser = require('./utils/dslDateParser')
const DSLParser = require('./utils/dsl-parser')
const path = require('path')
const MoodleQuiz = require('./app/models/moodle_quiz')
const { extractTar, fetchActivities, updateActivities, repackageToMBZ } = require("./utils/xmlReader")
const iCalParser = require("./utils/iCalParser")
const TEST_URL = "https://portail.etsmtl.ca/ICal/SeancesCours?typeact=C&Sigle=LOG210&Groupe=01&Session=20222";

program
    .command('get')
    .description("Retrieves activities and outputs on console")
    .argument('<directory-path>', 'The directory to the extracted Moodle files.')
    .action(function (directoryPath) {
        console.log(fetchActivities(directoryPath))
    })

program
    .command('extract')
    .description("The extract function will extract a .mbz file to the tmp directory")
    .argument('<file-path>', "The path to the .mbz file to extract")
    .action(function (filePath) {
        console.log("Extracting .mbz file...")
        extractTar(filePath)
        console.log("Done!")
    })

program
    .command('dates')
    .description("display all dates for specified [Sigle][Groupe][Annee + # de session]")
    .argument('<typeact>', "")
    .argument('<symbol>', "")
    .argument('<group>', "")
    .argument('<year>', "")
    .argument('<semesterSeason>', "")
    .action(function (typeact, symbol, group, year, semesterSeason) {
        let icsParser = new iCalParser(
            typeact, symbol, group, year, semesterSeason);
        icsParser.parse();
    })

    
// Tested command: ./activity-connector.js parse-dsl ./data/test.dsl "" LOG210 01 2022 2
program
    .command('parse-dsl')
    .description("parses a DSL file based on all dates for specified [Sigle][Groupe][Annee + # de session]")
    .argument('<dsl-file-path>', "")
    .argument('<typeact>', "")
    .argument('<symbol>', "")
    .argument('<group>', "")
    .argument('<year>', "")
    .argument('<semesterSeason>', "")
    .action(async function (dslFilePath, typeact, symbol, group, year, semesterSeason) {
        string = fs.readFileSync(dslFilePath, { encoding: 'utf8' })
        ical = new iCalParser(typeact, symbol, group, year, semesterSeason)
        calendarActivities = await ical.parse()
        console.log(dslDateParser.getListModifiedTimes(calendarActivities, DSLParser.parse(string)[1]))
    })

// ./activity-connector.js update data/backup-moodle2-course-17014-s20222-log210-99-20220619-1506-nu.mbz data/test.dsl "" LOG210 01 2022 2
program
    .command('update')
    .description("extracts a .mbz file and update its activities dates based on DSL and calendar information")
    .argument("<mbz-file-path>", "the path of the mbz file")
    .argument("<dsl-file-path>", "the path of the dsl file")
    .argument('<typeact>', "")
    .argument('<symbol>', "")
    .argument('<group>', "")
    .argument('<year>', "")
    .argument('<semesterSeason>', "")
    .action(async function(mbzFilePath, dslFilePath, typeact, symbol, group, year, semesterSeason){
        var string = fs.readFileSync(dslFilePath, { encoding: 'utf8' })
        var ical = new iCalParser(typeact, symbol, group, year, semesterSeason)
        var calendarActivities = await ical.parse()
        var newTimes = dslDateParser.getListModifiedTimes(calendarActivities, DSLParser.parse(string)[1])
        var newPath = path.join("tmp", mbzFilePath.split("/").pop().split(".mbz")[0], "/") // TODO refactor
        var activities = fetchActivities(newPath)

        // TODO Refactor into another file
        // TODO only modifies quiz so far, have to cover the other classes
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
    
        updateActivities(newPath, activities)
        repackageToMBZ(newPath)
    })

program.parse(process.argv)
