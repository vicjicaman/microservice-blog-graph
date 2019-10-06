const mongoose = require("mongoose");
import * as Serialize from './serialize'

var schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  abstract: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  authorid: {
    type: String,
    required: true
  },
  created_at: Date
});

schema.post("find", function(docs) {});

schema.pre("save", async function(next) {
  this.created_at = new Date();
  next();
});



const Model = mongoose.model("Article", schema);
export { Model, Serialize };
