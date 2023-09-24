const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  body: String,
  page: { type: mongoose.Schema.Types.ObjectId, ref: "Page" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Comment = mongoose.model("Comment", commentsSchema);

module.exports = Comment;
