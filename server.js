"use strict";

const express = require("express");
const iCalParser = require("./utils/iCalParser");

// Constants
const PORT = 8080;
const HOST = "localhost";
const TEST_ICAL =
  "https://calendar.google.com/calendar/ical/etsmtl.net_2ke" +
  "m5ippvlh70v7pd6oo4ed9ig%40group.calendar.google.com/public/basic.ics";

const ALL_ACTIVITIES = "https://portail.etsmtl.ca/ICal/SeancesCours?Sigle=LOG210&Groupe=01&Session=20222";

// Fetch and parse calendar
let icsParser = new iCalParser(ALL_ACTIVITIES);
icsParser.parse();

// // App
// const app = express();
// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// app.listen(PORT, HOST);
// console.log(`Running on http://${HOST}:${PORT}`);
