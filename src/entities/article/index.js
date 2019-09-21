const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  title: String,
  abstract: String,
  content: String,
  authorid: String,
  created_at: Date
});

schema.post("find", function(docs) {});

schema.pre("save", async function(next) {
  this.created_at = new Date();
  next();
});

const Article = mongoose.model("Article", schema);
export { Article };
