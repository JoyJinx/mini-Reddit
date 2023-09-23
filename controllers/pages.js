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
  const result = await cloudinary.uploader.upload(req.file.path, {
    allowed_formats: ["jpeg", "jpg", "png"],
    upload_preset: "myPreset",
  });
  newPage.img.path = result.secure_url;
  newPage.img.filename = result.public_id;
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
  const updatedPage = await Page.findByIdAndUpdate(
    id,
    { ...req.body.page },
    {
      new: true,
    }
  );
  const result = await cloudinary.uploader.upload(req.file.path, {
    allowed_formats: ["jpeg", "jpg", "png"],
    upload_preset: "myPreset",
  });
  await cloudinary.uploader.destroy(updatedPage.img.filename);
  updatedPage.img.path = result.secure_url;
  updatedPage.img.filename = result.public_id;
  updatedPage.save();
  req.flash("success", "Updated the post!");
  res.redirect(`/p/${id}`);
};

module.exports.pageDelete = async (req, res) => {
  const { id } = req.params;
  const foundPage = await Page.findByIdAndDelete(id);
  await cloudinary.uploader.destroy(foundPage.img.filename);
  req.flash("success", "Post deleted successfully!");
  res.redirect("/p");
};
