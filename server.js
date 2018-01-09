//Declare dependencies
var express    = require("express");
var bodyParser = require("body-parser");
var cheerio    = require("cheerio");  // Parses our HTML and helps us find elements
var request    = require("request");  // Makes HTTP request for HTML page
var mongoose   = require("mongoose"); // Our newest addition to the dependency family

const config   = require("./config").init()
var Example    = require("./exampleModel.js");

//CONFIGURATION
//Express
var app = express(); // Initialize Express
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static("public"));
//Mongoose
mongoose.Promise = Promise;
