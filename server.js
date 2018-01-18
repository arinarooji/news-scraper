//DEPENDENCIES
const express    = require("express");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const cheerio    = require("cheerio");  // Parses our HTML and helps us find elements
const request    = require("request-promise"); // Wraps request with easy promises
const mongoose   = require("mongoose"); // Our newest addition to the dependency family

const config = require("./config").init();
const Model  = require("./models/model.js");
let port     = require("./config").port;

const results = [], length = 7; //Array to store results (will be relocated)
///////////////////////////////

//CONFIGURATION
//Express, Express-Handlebars
var app = express(); // Initialize Express
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static("public"));
    app.engine("handlebars", handlebars({ defaultLayout: "main" }));
    app.set("view engine", "handlebars");

//Mongoose
mongoose.Promise = Promise; //Leverage ES6 promises, mongoose
    //mLab connection
    //var db = mongoose.connect(config.db.uri, { useMongoClient: true });
    //local connection
    mongoose.connect("mongodb://localhost/newscraper", { useMongoClient: true });
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
app.get('/data', function(req, res) {
    
    //Retrieve HTML data from NY Times
    request("https://www.nytimes.com/", function(error, response, html) {
        var $ = cheerio.load(html);

        // With cheerio, find each article tag with the "story theme-summary" classes
        $("article.story.theme-summary").each(function(i, element) {

            var headline = $(element).children("h2.story-heading").text();
            var summary  = ($(element).children("p.summary").text() == "")? $(element).children("ul").text() : $(element).children("p.summary").text()
            var url      = $(element).children("h2.story-heading").children("a").attr("href");

            // Save these results in an object that we'll push into the results[]
            results.push({ headline: headline.trim(), summary: summary.trim(), url: url });
        });

        //We only need the first 7 results scraped by cheerio
        //NY Times has additional articles with the same tag/classes but less info (no summary, etc)
        results.length = length;

        //For each result in results[] look for a matching headline in the DB
        results.forEach(function(result){
            Model.find({headline: result.headline}, function(err, data) {
                if (err) return handleError(err);
                //If no data is found, create this new instance of news in the DB
                if (data == "") Model.create({headline: result.headline, summary: result.summary, url: result.url});
            });
        });

        //Find all documents in the DB
        Model.find({}, function(err, data) {
            if (err) return handleError(err);
            //Store all database documents in results[]
            results = data;
        });

        //Render the documents with handlebars
        res.render("index", {results});
    });
});

//SERVER
app.listen(port, function() {
    console.log("App running on port " + port);
});