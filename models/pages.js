const express = require("express");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/miniR");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const miniSchema = new mongoose.Schema({
  author: String,
  body: String,
  img: String,
  likes: Number,
});

const Page = mongoose.model("Page", miniSchema);

module.exports = Page;
