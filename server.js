"use strict";
require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");

var apiRoutes = require("./routes/api.js");
var fccTestingRoutes = require("./routes/fcctesting.js");
var runner = require("./test-runner");

var app = express();

try {
  mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log("connected to database");
} catch (e) {
  console.error(e);
  throw new Error("Unable to Connect to Database");
}

app.use("/public", express.static(process.cwd() + "/public"));

app.use(cors({ origin: "*" })); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(helmet());

//Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (e) {
        var error = e;
        console.log("Tests are not valid:");
        console.log(error);
      }
    }, 1500);
  }
  console.log("Listening on port " + process.env.PORT);
});

module.exports = app; //for unit/functional testing
