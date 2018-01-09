//DEPENDENCIES
var express    = require("express");
var bodyParser = require("body-parser");
var cheerio    = require("cheerio");  // Parses our HTML and helps us find elements
var request    = require("request");  // Makes HTTP request for HTML page
var mongoose   = require("mongoose"); // Our newest addition to the dependency family

const config = require("./config").init();
var model    = require("./model.js");
let port     = require("./config").port;
////////////////////////////////////////

//CONFIGURATION
//Express
var app = express(); // Initialize Express
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static("public"));
//Mongoose
mongoose.Promise = Promise; //Leverage ES6 promises, mongoose
    //mLab connection
    //var db = mongoose.connect(config.db.uri, { useMongoClient: true });
    //local connection
    mongoose.connect("mongodb://localhost/newscraper");
    var db = mongoose.connection;

//Log mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});
//Log connection success
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
