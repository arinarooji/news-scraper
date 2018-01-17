//DEPENDENCIES
const mongoose = require("mongoose");

//Save the mongoose.Schema class as simply "Schema"
const Schema = mongoose.Schema;

// With our new Schema class, we instantiate a News object
// This is where we decide how our data must look before we accept it in the server, and how to format it in mongoDB
const News = new Schema({
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
  date: {
    type: Date,
    default: Date.now
  }
});

// This creates our model from the above schema, using mongoose's model method
const collection = "stories"
const Model = mongoose.model("Model", News, collection);

// Finally, we export the module, allowing server.js to hook into it with a require statement
module.exports = Model;