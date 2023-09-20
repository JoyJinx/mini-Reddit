const express = require("express");
const mongoose = require("mongoose");

// if (mongoose.connection.readyState !== 1) {
//   mongoose.connect("mongodb://localhost:27017/miniR");

//   const db = mongoose.connection;
//   db.on("error", console.error.bind(console, "connection error: "));
//   db.once("open", function () {
//     console.log("Connected successfully");
//   });
// }

const commentsSchema = new mongoose.Schema({
  author: String,
  body: String,
  post: mongoose.Schema.Types.ObjectId,
  comment: mongoose.Schema.Types.ObjectId,
  likes: { type: Number, default: 0 },
});

const Comment = mongoose.model("Comment", commentsSchema);

module.exports = Comment;
