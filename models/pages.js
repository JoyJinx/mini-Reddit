const express = require("express");
const { ref } = require("joi");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/miniR");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const pageSchema = new mongoose.Schema({
  author: String,
  body: String,
  img: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likes: { type: Number, default: 0 },
});

const Page = mongoose.model("Page", pageSchema);

module.exports = Page;
