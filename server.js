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

//Retrieve HTML data (test)
request("https://www.nytimes.com/", function(error, response, html) {
    var $ = cheerio.load(html);
    
    // An empty array to save the data that we'll scrape
    var results = [];
    var length  = 7;

    // With cheerio, find each article tag with the "story theme-summary" classes
    $("article.story.theme-summary").each(function(i, element) {

        var headline = $(element).children("h2.story-heading").text();
        var summary  = ($(element).children("p.summary").text() == "")? $(element).children("ul").text() : $(element).children("p.summary").text()

        // Save these results in an object that we'll push into the results[]
        results.push({
            headline: headline,
            summary: summary
        });
    });

    results.length = length; //Fixed length
    console.log(results);
});
/////////////////////////

//ROUTES
//...

//SERVER
app.listen(port, function() {
    console.log("App running on port " + port);
});
