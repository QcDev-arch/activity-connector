# Activity connector
Activity connector for Moodle and SignETS

# Usage
```node activity-connector.js``` will show you the help section of every command available in the command-line tool. You can then use ```node activity-connectory.js -command_name- --help``` to see the help dialogue for every command.

For example, 
```bash
node activity-connector.js create -h
```
will output the following help dialogue:
```
Usage: activity-connector create [options]

Create a new updated mbz file using the mbz backup from
Moodle, the dsl file and informations about the course.

Example: create -mp ./path/to/file.mbz -dp ./path/to/file.dsl -a LOG210 -g 01 -y 2022 -s Summer
         create -mp ./path/to/file.mbz -dp ./path/to/file.dsl -if ./path/to/file.ics

Options:
  -mp --mbzpath <directory>   (required) the path of the mbz file
  -dp, --dslpath <directory>  (required) the path to the DSL file
  -if, --icsfile <directory>  the path to the ics file
  -a, --acronym <course>      the course's acronym (e.g. LOG210, GTI745, MEC200, ...)
  -g, --group <number>        the group number for the course (if the group is a single digit, add a 0 in front e.g. 01, 02, ...)
  -y --year <number>          the year of the course
  -s --semester <season>      the semester's season. The options are Winter, Summer or Fall
  -h, --help                  display help for command
```

Examples of command executions are provided in the help dialogue.

# Execute test on local machine
Install node JS on local machine [https://nodejs.org/en/](Node)

Run "npm install" on the project root folder

Run "npm test" on the project root folder

# Test lib
This project use the Jest library for his unit tests coverage. [https://jestjs.io/docs/](Jest)