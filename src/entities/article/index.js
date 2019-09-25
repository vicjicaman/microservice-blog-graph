const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
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

const Article = mongoose.model("Article", schema);
export { Article };
