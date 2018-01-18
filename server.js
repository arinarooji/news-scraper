//DEPENDENCIES
const express    = require("express");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const mongoose   = require("mongoose");

const config = require("./config").init();
const routes = require("./controller/routes.js");
let port     = require("./config").port;
////////////////////////////////////////

//CONFIGURATION
//Express
const app = express();
    app.use(express.static(__dirname + "/public"));
    //Body-Parser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    //Express-Handlebars
    app.engine("handlebars", handlebars({ defaultLayout: "main" }));
    app.set("view engine", "handlebars");

//Mongoose
mongoose.Promise = Promise; //Leverage ES6 promises, mongoose
//mLab connection
//var db = mongoose.connect(config.db.uri, { useMongoClient: true });
//local connection
mongoose.connect("mongodb://localhost/newscraper", { useMongoClient: true });
const db = mongoose.connection;

//Log mongoose errors
db.on("error", error => console.log("Mongoose Error: ", error));
//Log connection success
db.once("open", () => console.log("Mongoose connection successful."));
//////////////////////////////////////////////////////////////////////

//USE CONTROLLER ROUTES
app.use("/", routes);

//SERVER
app.listen(port, () => console.log("App running on port " + port));