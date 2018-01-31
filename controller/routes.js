//DEPENDENCIES
const express    = require("express");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const cheerio    = require("cheerio");  // Parses our HTML and helps us find elements
const request    = require("request-promise"); // Wraps request with easy promises
const mongoose   = require("mongoose"); // Our newest addition to the dependency family
const Model      = require("../models/model.js");

//Initialize express
const app = express();
mongoose.Promise = Promise; //Leverage ES6 promises, mongoose

//ROUTES
app.get('/', (req, res) => {
    
    //Retrieve HTML data from NY Times
    request("https://www.nytimes.com/", (error, response, html) => {
        var $ = cheerio.load(html);
        var results = [];                                                                                                                                  

        // With cheerio, find each article tag with the "story theme-summary" classes
        $("article.story.theme-summary").each( (i, element) => {

            let headline = $(element).children("h2.story-heading").text();
            let summary  = ($(element).children("p.summary").text() == "")? $(element).children("ul").text() : $(element).children("p.summary").text()
            let url      = $(element).children("h2.story-heading").children("a").attr("href");

            // Save these results in an object that we'll push into the results[]
            results.push({ headline: headline.trim(), summary: summary.trim(), url: url });
        });

        //We only need the first 7 results scraped by cheerio
        //NY Times has additional articles with the same tag/classes but less info (no summary, etc)
        results.length = 7;

        //For each result in results[] look for a matching headline in the DB
        results.forEach( result => {
            Model.find({headline: result.headline.toString()}, (err, data) => {
                if (err) return handleError(err);
                //If no data is found and headline is not blank, create this new instance of news in the DB
                if (data == "" && result.headline !== "")
                    Model.create({headline: result.headline.toString(), summary: result.summary.toString(), url: result.url.toString()});
            });
        });

        //Find all documents in the DB
        Model.find({}, (err, data) => {
            if (err) return handleError(err);
            console.log(data);
            results = []; //Empty results
            results = data; //Store all database documents in results[]
            res.render("index", {results}); //Render the documents with handlebars
        });
    });
});

//POST comment request
//...
app.post('/comment', (req, res) => {
    
    console.log(req.body);

    //Find article ID in the database
    //..
    //Save the name and comment in the comments array
    //...

    //Note: handlebars must render all comments
});

module.exports = app; //Export for the server to use