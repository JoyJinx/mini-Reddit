const AppError = require("./utils/AppError");
const Page = require("./models/pages");
const Comment = require("./models/comments");
const { pageSchema, commentSchema, registerSchema } = require("./joiSchemas");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.lastUrl = req.originalUrl;
    req.flash("error", "You Must Sign In First!");
    return res.redirect("/login");
  }
  next();
};

module.exports.validatePage = (req, res, next) => {
  const { error } = pageSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((x) => x.message).join(",");
    throw new AppError(400, msg);
  } else {
    next();
  }
};

module.exports.isAuthorized = async (req, res, next) => {
  const { id } = req.params;
  const foundPage = await Page.findById(id);
  if (!foundPage.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/p/${id}`);
  }
  next();
};

module.exports.validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((x) => x.message).join(",");
    throw new AppError(400, msg);
  } else {
    next();
  }
};

module.exports.isCommentAuthorized = async (req, res, next) => {
  const { id, commentId } = req.params;
  const foundComment = await Comment.findById(commentId);
  if (!foundComment.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/p/${id}`);
  }
  next();
};

module.exports.validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((x) => x.message).join(",");
    throw new AppError(400, msg);
  } else {
    next();
  }
};
