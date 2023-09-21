const express = require("express");
const router = express.Router({ mergeParams: true });
// const mongoose = require("mongoose");
const Comment = require("../models/comments.js");
const Page = require("../models/pages.js");
// const AppError = require("../utils/AppError.js");
const catchAsync = require("../utils/catchAsync.js");
const {
  validateComment,
  isAuthorized,
  isLoggedIn,
} = require("../middleware.js");

router.post(
  "/",
  isLoggedIn,
  validateComment,
  catchAsync(async (req, res) => {
    const subpage = await Page.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    subpage.comments.unshift(comment);
    await comment.save();
    await subpage.save();
    res.redirect(`/p/${subpage._id}`);
  })
);

router.get(
  "/:commentId/edit",
  catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    const foundComment = await Comment.findById(commentId);
    res.render("comments/edit.ejs", { foundComment, id });
  })
);

router.patch(
  "/:commentId",
  validateComment,
  catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    const subpage = await Page.findById(id);
    await Comment.findByIdAndUpdate(commentId, req.body.comment, { new: true });
    res.redirect(`/p/${id}`);
  })
);

router.delete(
  "/:commentId",
  catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Page.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    res.redirect(`/p/${id}`);
  })
);

module.exports = router;
