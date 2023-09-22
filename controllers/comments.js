const Comment = require("../models/comments");
const Page = require("../models/pages");

module.exports.postComment = async (req, res) => {
  const subpage = await Page.findById(req.params.id);
  const comment = new Comment(req.body.comment);
  comment.author = req.user._id;
  subpage.comments.unshift(comment);
  await comment.save();
  await subpage.save();
  res.redirect(`/p/${subpage._id}`);
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
  await Comment.findByIdAndDelete(commentId);
  res.redirect(`/p/${id}`);
};
