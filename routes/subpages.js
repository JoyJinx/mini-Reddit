const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Page = require("../models/pages.js");
const AppError = require("../utils/AppError.js");
const catchAsync = require("../utils/catchAsync.js");
const { pageSchema } = require("../Joischemas.js");
const { isLoggedIn } = require("../middleware.js");

const validatePage = (req, res, next) => {
  const { error } = pageSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((x) => x.message).join(",");
    throw new AppError(400, msg);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const pages = await Page.find({});
    res.render("pages/index.ejs", { pages });
  })
);
router.get("/new", isLoggedIn, (req, res) => {
  res.render("pages/new.ejs");
});
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundPage = await Page.findById(id).populate("comments");
    res.render("pages/show.ejs", { foundPage });
  })
);
router.post(
  "/",
  isLoggedIn,
  validatePage,
  catchAsync(async (req, res) => {
    const newPage = await Page.create(req.body.page);
    req.flash("success", "Created new post!");
    res.redirect("/p");
  })
);
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundPage = await Page.findById(id);
    res.render("pages/edit.ejs", { foundPage });
  })
);
router.patch(
  "/:id",
  isLoggedIn,
  validatePage,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedPage = await Page.findByIdAndUpdate(id, req.body.page, {
      new: true,
    });
    req.flash("success", "Updated the post!");
    res.redirect(`/p/${id}`);
  })
);
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundPage = await Page.findByIdAndDelete(id);
    req.flash("success", "Post deleted successfully!");
    res.redirect("/p");
  })
);

module.exports = router;
