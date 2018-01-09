//Declare dependencies
var express    = require("express");
var bodyParser = require("body-parser");
var cheerio    = require("cheerio");  // Parses our HTML and helps us find elements
var request    = require("request");  // Makes HTTP request for HTML page
var mongoose   = require("mongoose"); // Our newest addition to the dependency family

const config = require("./config").init();
var Example  = require("./exampleModel.js");
let port     = require("./config").port;
////////////////////////////////////////

//CONFIGURATION
//Express
var app = express(); // Initialize Express
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static("public"));
//Mongoose
mongoose.Promise = Promise;   //Leverage ES6 promises, mongoose
mongoose.connect("mongodb://localhost/week18day3mongoose");
var db = mongoose.connection; // Save our mongoose connection to db

// If there's a mongoose error, log it to console
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});
// Once we "open" a connection to mongoose, tell the console we're in
db.once("open", function() {
    console.log("Mongoose connection successful.");
});
///////////////////////////////////////////////////

//ROUTES
//...

//SERVER
app.listen(port, function() {
    console.log("App running on port " + port);
});
