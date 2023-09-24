const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync.js");
const comments = require("../controllers/comments.js");
const {
  validateComment,
  isLoggedIn,
  isCommentAuthorized,
} = require("../middleware.js");

router.post("/", isLoggedIn, validateComment, catchAsync(comments.postComment));

router.get(
  "/:commentId/edit",
  isLoggedIn,
  isCommentAuthorized,
  catchAsync(comments.getEdit)
);
router.post("/:commentId", isLoggedIn, catchAsync(comments.postCommentLike));

router.patch(
  "/:commentId",
  isLoggedIn,
  isCommentAuthorized,
  validateComment,
  catchAsync(comments.patchComment)
);

router.delete(
  "/:commentId",
  isLoggedIn,
  isCommentAuthorized,
  catchAsync(comments.commentDelete)
);

module.exports = router;
