const Comment = require("../models/comments");
const Page = require("../models/pages");
const User = require("../models/users");

module.exports.postComment = async (req, res) => {
  const subpage = await Page.findById(req.params.id);
  const comment = new Comment(req.body.comment);
  const thisUser = User.findById(req.user._id);
  comment.author = req.user._id;
  subpage.comments.unshift(comment);
  thisUser.comments.unshift(comment);

  await thisUser.save();
  await comment.save();
  await subpage.save();
  res.redirect(`/p/${subpage._id}`);
};

module.exports.postCommentLike = async (req, res) => {
  const { id, commentId } = req.params;
  const foundComment = await Comment.findById(commentId);
  const thisUser = await User.findById(req.user._id);
  const foundUserCommentLike = foundComment.likes.some(function (like) {
    return like.equals(req.user._id);
  });
  if (foundUserCommentLike) {
    foundComment.likes.pull(req.user._id);
    thisUser.likes.pull(commentId);
    req.flash("success", "removed like!!");
  } else {
    foundComment.likes.unshift(req.user._id);
    thisUser.like.unshift(commentId);
    req.flash("success", "liked!");
  }
  await thisUser.save();
  await foundComment.save();
  res.redirect(`/p/${id}`);
};

module.exports.getEdit = async (req, res) => {
  const { id, commentId } = req.params;
  const foundComment = await Comment.findById(commentId);
  res.render("comments/edit.ejs", { foundComment, id });
};

module.exports.patchComment = async (req, res) => {
  const { id, commentId } = req.params;
  const subpage = await Page.findById(id);
  await Comment.findByIdAndUpdate(commentId, req.body.comment, { new: true });
  res.redirect(`/p/${id}`);
};

module.exports.commentDelete = async (req, res) => {
  const { id, commentId } = req.params;
  await Page.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { comments: commentId, likes: commentId },
  });
  await Comment.findByIdAndDelete(commentId);
  res.redirect(`/p/${id}`);
};
