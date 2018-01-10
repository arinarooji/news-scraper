//DEPENDENCIES
var mongoose = require("mongoose");

//Save the mongoose.Schema class as simply "Schema"
var Schema = mongoose.Schema;

// With our new Schema class, we instantiate a News object
// This is where we decide how our data must look before we accept it in the server, and how to format it in mongoDB
var News = new Schema({
  headline: {
    type: String,
    trim: true,
    required: "String is Required"
  },
  summary: {
    type: String,
    trim: true,
    required: "String is Required"
  },
  url: {
    type: String,
    trim: true,
    required: "String is Required"
  },
  img: {
    type: String,
    trim: true,
    required: "String is Required"
  }
});

// This creates our model from the above schema, using mongoose's model method
var News = mongoose.model("News", News);

// Finally, we export the module, allowing server.js to hook into it with a require statement
module.exports = News;