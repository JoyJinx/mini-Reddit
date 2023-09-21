const express = require("express");
const mongoose = require("mongoose");
const Comment = require("./comments");

const pageSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  body: String,
  img: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likes: { type: Number, default: 0 },
});

pageSchema.post("findOneAndDelete", async (page) => {
  if (page.comments.length) {
    const res = await Comment.deleteMany({ _id: { $in: page.comments } });
    console.log(res);
  }
});

const Page = mongoose.model("Page", pageSchema);

module.exports = Page;
