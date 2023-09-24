const Page = require("../models/pages");
const cloudinary = require("../cloudinary/index");

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
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      allowed_formats: ["jpeg", "jpg", "png"],
      upload_preset: "myPreset",
    });
    newPage.img.path = result.secure_url;
    newPage.img.filename = result.public_id;
  }
  newPage.author = req.user._id;
  await newPage.save();
  req.flash("success", "Created new post!");
  res.redirect("/p");
};

module.exports.postLike = async (req, res) => {
  const { id } = req.params;
  const foundPage = await Page.findById(id);
  const foundUserLike = foundPage.likes.some(function (like) {
    return like.equals(req.user._id);
  });
  if (foundUserLike) {
    foundPage.likes.pull(req.user._id);
    req.flash("success", "removed like!!");
  } else {
    foundPage.likes.unshift(req.user._id);
    req.flash("success", "liked!");
  }
  await foundPage.save();
  res.redirect(`/p/${id}`);
};

module.exports.getEdit = async (req, res) => {
  const { id } = req.params;
  const foundPage = await Page.findById(id);
  res.render("pages/edit.ejs", { foundPage });
};

module.exports.patchEdit = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const { title, body } = req.body.page;
  const updatedPage = await Page.findByIdAndUpdate(
    id,
    { title, body },
    {
      new: true,
    }
  );
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      allowed_formats: ["jpeg", "jpg", "png"],
      upload_preset: "myPreset",
    });
    console.log(result);
    if (updatedPage.img.filename) {
      await cloudinary.uploader.destroy(updatedPage.img.filename);
    }
    updatedPage.img.path = result.secure_url;
    updatedPage.img.filename = result.public_id;
  } else if (req.body.removeImg) {
    await cloudinary.uploader.destroy(updatedPage.img.filename);
    updatedPage.img = {};
  }
  updatedPage.save();
  req.flash("success", "Updated the post!");
  res.redirect(`/p/${id}`);
};

module.exports.pageDelete = async (req, res) => {
  const { id } = req.params;
  const foundPage = await Page.findByIdAndDelete(id);
  if (foundPage.img.filename) {
    await cloudinary.uploader.destroy(foundPage.img.filename);
  }
  req.flash("success", "Post deleted successfully!");
  res.redirect("/p");
};
