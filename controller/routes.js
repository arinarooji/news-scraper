//DEPENDENCIES
const express    = require("express");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const cheerio    = require("cheerio");  // Parses our HTML and helps us find elements
const request    = require("request-promise"); // Wraps request with easy promises
const mongoose   = require("mongoose"); // Our newest addition to the dependency family
const Model      = require("../models/model.js");

//CONFIGURATION
const app = express(); //Initialize express
mongoose.Promise = Promise; //Leverage ES6 promises, mongoose

//ROUTES
//GET scraped data from NYTimes (no duplicates or empty objects)
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

        //For each result in results[] look for a matching headline in the DB (Synchronous)
        results.forEach( result => {
            Model.find({headline: result.headline.toString()}, (err, data) => {
                if (err) return handleError(err);
                //If no data is found and headline is not blank, create this new instance of news in the DB
                if (data == "" && result.headline !== "")
                    Model.create({headline: result.headline.toString(), summary: result.summary.toString(), url: result.url.toString()});
            });
        });

        //Find all documents in the DB (Asynchronous)
        Model.find({}, (err, data) => {
            if (err) return handleError(err);
            results = []; //Empty results
            results = data; //Store all database documents in results[]
            res.render("index", {results}); //Render the documents with handlebars
        });
    });
});

//GET all saved articles and render them on saved.handlebars
app.get('/saved', (req, res) => {
    //Find all SAVED documents in the DB (Asynchronous)
    Model.find({saved: true}, (err, data) => {
        if (err) return handleError(err);
        results = []; //Empty results
        results = data; //Store all database documents in results[]
        res.render("saved", {results}); //Render the documents with handlebars
    });
});

//GET the specified article's information (specified by _id)
app.get('/notes:id', (req, res) => {
    Model.findById({_id: req.params.id}, (err, article) => { res.json(article); });
});

//POST comment request
app.post('/comment', (req, res) => {
    //commentData object to push into the article's comments[] array
    let commentData = {comment: req.body.comment};

    //Find article ID in the database, push comment data to the comments[] array
    Model.updateOne({_id: req.body.id}, {$push: {comments: commentData}}).exec((err,result) => {
        if (err) throw err;
        console.log(result);
    });
});

//PUT saved status as true
app.put('/save:id', (req, res) => {
    let id = req.params.id;
    Model.findByIdAndUpdate({ _id: id }, { saved: true }, (err, result) => {
        if (err) throw err;
        console.log(result);
    });
});

//PUT saved status as false
app.put('/remove:id', (req, res) => {
    let id = req.params.id;
    Model.findByIdAndUpdate({ _id: id }, { saved: false }, (err, result) => {
        if (err) throw err;
        console.log(result);
    });
});

//DELETE notes
//...

module.exports = app; //Export for the server to use