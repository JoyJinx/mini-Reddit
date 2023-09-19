const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");
const Comment = require("../models/comments.js");
const Page = require("../models/pages.js");
const AppError = require("../utils/AppError.js");
const catchAsync = require("../utils/catchAsync.js");
const { commentSchema } = require("../Joischemas.js");

const validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((x) => x.message).join(",");
    throw new AppError(400, msg);
  } else {
    next();
  }
};

router.post(
  "/",
  validateComment,
  catchAsync(async (req, res) => {
    const subpage = await Page.findById(req.params.id);
    const comment = new Comment(req.body.comment);
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
