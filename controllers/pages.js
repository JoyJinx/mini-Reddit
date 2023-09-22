const Page = require("../models/pages");

module.exports.getPages = async (req, res) => {
  const pages = await Page.find({}).populate("author");
  res.render("pages/index.ejs", { pages });
};

module.exports.getNew = (req, res) => {
  res.render("pages/new.ejs");
};

module.exports.getPageId = async (req, res) => {
  const { id } = req.params;
  const foundPage = await Page.findById(id)
    .populate({ path: "comments", populate: { path: "author" } })
    .populate("author");
  res.render("pages/show.ejs", { foundPage });
};

module.exports.postPage = async (req, res) => {
  const newPage = new Page(req.body.page);
  newPage.author = req.user._id;
  await newPage.save();
  req.flash("success", "Created new post!");
  res.redirect("/p");
};

module.exports.getEdit = async (req, res) => {
  const { id } = req.params;
  const foundPage = await Page.findById(id);
  res.render("pages/edit.ejs", { foundPage });
};

module.exports.patchEdit = async (req, res) => {
  const { id } = req.params;
  const updatedPage = await Page.findByIdAndUpdate(id, req.body.page, {
    new: true,
  });
  req.flash("success", "Updated the post!");
  res.redirect(`/p/${id}`);
};

module.exports.pageDelete = async (req, res) => {
  const { id } = req.params;
  const foundPage = await Page.findByIdAndDelete(id);
  req.flash("success", "Post deleted successfully!");
  res.redirect("/p");
};
