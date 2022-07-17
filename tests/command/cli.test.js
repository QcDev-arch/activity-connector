let path = require("path");
let exec = require("child_process").exec;

function cli(args, cwd) {
  return new Promise(resolve => {
    let command = `node "${path.resolve(
      "./activity-connector.js",
    )}" ${args.join(" ")}`;
    // console.log(`Command: "${command}"`);
    exec(command, { cwd, env: {"JEST_TESTING": "True"} }, (error, stdout, stderr) => {
      resolve({
        code: error && error.code ? error.code : 0,
        error,
        stdout,
        stderr,
      });
    });
  });
}
const fs = require("fs-extra");
const TMP_PATH = "./tmp_tests";
const MBZ_PATH = "./mbzPackages_tests";

/*-------COMMANDER / CLI BASED TESTS--------*/
describe("Commander based tests", () => {
  test("Extract the mbz file", async () => {

    let result = await cli(
      [
        "extract-mbz", "-p", "./data/backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu.mbz",
      ],
      ".",
    );

    expect(result.code).toBe(0);
  });

  test("Outputs all activities from a mbz directory", async () => {
    let result = await cli(
      [
        "print-dir", "--path", `${TMP_PATH}/backup-moodle2-course-1677-s20143-log792-09-20151102-1508-nu`,
      ],
      ".",
    );
    expect(result.code).toBe(0);
  });

  test("Outputs dates for a course", async () => {
    let result = await cli(
      [
        "print-ics", "--acronym", "LOG210", "--group", "01", "--year", "2022", "--semester", "Summer",
      ],
      ".",
    );
    expect(result.code).toBe(0);
  });

  test("Outputs dates for a course with ics file", async () => {
    let result = await cli(
      [
        "print-ics", "-if", "data/Seances.ics"
      ],
      ".",
    );
    expect(result.code).toBe(0);
  });

  test("Parses a dsl file and outputs new dates based on a course", async () => {
    let result = await cli(
      [
        "parse-dsl", "-dp", "./data/test.dsl", "-a", "LOG210", "-g", "01", "-y", "2022", "-s", "Summer",
      ],
      ".",
    );
    expect(result.code).toBe(0);
  });

  test("Parses a dsl file and outputs new dates based on a course with ics file", async () => {
    let result = await cli(
      [
        "parse-dsl", "-dp", "./data/test.dsl", "-if", "./data/Seances.ics"
      ],
      ".",
    );
    expect(result.code).toBe(0);
  });

  test("Create a new updated mbz file", async () => {
    let result = await cli(
      [
        "create", "-mp", "./data/backup-moodle2-course-17014-s20222-log210-99-20220703-1253-nu.mbz", 
        "-dp", "./data/test.dsl", "-a", "LOG210", "-g", "01", "-y", "2022", "-s", "Summer",
      ],
      ".",
    );
    expect(result.code).toBe(0);
  });

  test("Create a new updated mbz file", async () => {
    let result = await cli(
      [
        "create", "-mp", "./data/backup-moodle2-course-17014-s20222-log210-99-20220703-1253-nu.mbz", 
        "-dp", "./data/test.dsl", "-if", "./data/Seances.ics"
      ],
      ".",
    );
    expect(result.code).toBe(0);
  });

  afterAll(() => {
    // delete the tmp folder and mbzPackages folder
    if (fs.existsSync(TMP_PATH)) {
      fs.rmSync(TMP_PATH, { recursive: true });
    }
    if (fs.existsSync(MBZ_PATH)) {
      fs.rmSync(MBZ_PATH, { recursive: true });
    }
  });
});
