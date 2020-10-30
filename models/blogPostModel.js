const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const BlogPostSchema = new Schema({
  title: String,
  body: String,
  date: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model("BlogPost", BlogPostSchema);
