const Page = require("../models/pages");
const cloudinary = require("../cloudinary/index");
const User = require("../models/users");

module.exports.getPages = async (req, res) => {
  let pages = await Page.find({}).populate("author");
  for (let page of pages) {
    const timePosted = Date.now() - page.date;

    if (timePosted < 60 * 60 * 1000) {
      page.humanDate = `${Math.floor(timePosted / (60 * 1000))} mins ago.`;
    } else if (timePosted < 24 * 60 * 60 * 1000) {
      page.humanDate = `${Math.floor(
        timePosted / (60 * 60 * 1000)
      )} hours ago.`;
    } else {
      page.humanDate = `${Math.floor(
        timePosted / (24 * 60 * 60 * 1000)
      )} days ago.`;
    }
  }
  function compareNewFn(a, b) {
    return b.date - a.date;
  }
  pages = pages.sort(compareNewFn);
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

  const pagePosted = Date.now() - foundPage.date;

  if (pagePosted < 60 * 60 * 1000) {
    foundPage.humanDate = `${Math.floor(pagePosted / (60 * 1000))} mins ago.`;
  } else if (pagePosted < 24 * 60 * 60 * 1000) {
    foundPage.humanDate = `${Math.floor(
      pagePosted / (60 * 60 * 1000)
    )} hours ago.`;
  } else {
    foundPage.humanDate = `${Math.floor(
      pagePosted / (24 * 60 * 60 * 1000)
    )} days ago.`;
  }

  for (let comment of foundPage.comments) {
    const timePosted = Date.now() - comment.date;

    if (timePosted < 60 * 60 * 1000) {
      comment.humanDate = `${Math.floor(timePosted / (60 * 1000))} mins ago.`;
    } else if (timePosted < 24 * 60 * 60 * 1000) {
      comment.humanDate = `${Math.floor(
        timePosted / (60 * 60 * 1000)
      )} hours ago.`;
    } else {
      comment.humanDate = `${Math.floor(
        timePosted / (24 * 60 * 60 * 1000)
      )} days ago.`;
    }
  }
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
  newPage.date = Date.now();
  newPage.author = req.user._id;
  const thisUser = await User.findById(req.user._id);
  thisUser.pages.unshift(newPage._id);
  await thisUser.save();
  await newPage.save();
  req.flash("success", "Created new Subpage!");
  res.redirect("/p");
};

module.exports.postLike = async (req, res) => {
  const { id } = req.params;
  const foundPage = await Page.findById(id);
  const thisUser = await User.findById(req.user._id);
  const foundUserLike = foundPage.likes.some(function (like) {
    return like.equals(req.user._id);
  });
  if (foundUserLike) {
    thisUser.likes.pull(id);
    foundPage.likes.pull(req.user._id);
    req.flash("success", "like removed!!");
  } else {
    thisUser.likes.unshift(id);
    foundPage.likes.unshift(req.user._id);
    req.flash("success", "liked!");
  }
  await thisUser.save();
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
  // console.log(req.body);
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
  await User.findByIdAndUpdate(req.user._id, { $pull: { pages: id } });
  if (foundPage.img.filename) {
    await cloudinary.uploader.destroy(foundPage.img.filename);
  }
  req.flash("success", "Subpage deleted successfully!");
  res.redirect("/p");
};
