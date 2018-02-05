'use strict';

////////////////////////////////////////////////////////////////
/////////////////       server configs  //////////////////////
//////////////////////////////////////////////////////////////

//Created mongolab-dimensional-34075 as MONGODB_URI
//If deployed, use the deployed database. Otherwise use the local mongoHeadlines database    
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newscraper";

exports.port = process.env.PORT || 3000
exports.origin = process.env.ORIGIN || `http://localhost:${exports.port}`
exports.init = function() {return require('./config.json')}
