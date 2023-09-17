const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");
const Comment = require("../models/comments.js");
const Page = require("../models/pages.js");

router.post("/", async (req, res) => {
  const subpage = await Page.findById(req.params.id);
  const comment = new Comment(req.body.comment);
  subpage.comments.push(comment);
  await comment.save();
  await subpage.save();
  res.redirect(`/p/${subpage._id}`);
});

module.exports = router;
