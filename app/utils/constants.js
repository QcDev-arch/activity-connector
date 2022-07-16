const ACTIVITY_TYPES = {
  SEMINAR: "Seminar",
  LABORATORY: "Laboratory",
  PRACTICUM: "Practicum",
};

const ASSIGNMENT_TYPES = {
  QUIZ: "Quiz",
  HOMEWORK: "Homework",
  EXAM: "Exam",
};

const ACTIVITY_MODULE_TYPES = {
  QUIZ: "quiz",
  ASSIGNMENT: "assign",
};

const DATES = {
  START_DATE: "start",
  END_DATE: "end",
};

const OPERATION_TYPES = {
  ADD: "+",
  SUBTRACT: "-",
};

const SPLITTER_TYPE = {
  COLON: ":",
  WHITESPACE: " ",
  DATA: "data",
};

const MBZ_FILE_EXTENSION = ".mbz";

const EMPTY = "";

const ENCODING_TYPE = "utf-8";

const INPUT_XML_FILES = {
  QUIZ: "quiz.xml",
  ASSIGNMENT: "assign.xml",
  MOODLE_BACKUP: "moodle_backup.xml",
};

const ICAL_ACTIVITY_TYPES = {
  SEMINAR: "C        ", // literally the output
  PRACTICUM: "TP",
  LABORATORY: "Labo",
  FINAL_EXAM: "F"
};

const SEMESTERS = {
  WINTER: "Winter",
  SUMMER: "Summer",
  FALL: "Fall",
};

module.exports = {
  ACTIVITY_TYPES: ACTIVITY_TYPES,
  ASSIGNMENT_TYPES: ASSIGNMENT_TYPES,
  ACTIVITY_MODULE_TYPES: ACTIVITY_MODULE_TYPES,
  DATES: DATES,
  OPERATION_TYPES: OPERATION_TYPES,
  SPLITTER_TYPE: SPLITTER_TYPE,
  MBZ_FILE_EXTENSION: MBZ_FILE_EXTENSION,
  EMPTY: EMPTY,
  ENCODING_TYPE: ENCODING_TYPE,
  INPUT_XML_FILES: INPUT_XML_FILES,
  ICAL_ACTIVITY_TYPES: ICAL_ACTIVITY_TYPES,
  SEMESTERS: SEMESTERS,
};
