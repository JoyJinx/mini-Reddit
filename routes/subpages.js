const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Page = require("../models/pages.js");

router.get("/", async (req, res) => {
  const pages = await Page.find({});
  res.render("pages/index.ejs", { pages });
});
router.get("/new", (req, res) => {
  res.render("pages/new.ejs");
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const foundPage = await Page.findById(id);
  res.render("pages/show.ejs", { foundPage });
});
router.post("/", async (req, res) => {
  console.log(req.body);
  const newPage = await Page.create(req.body);
  res.redirect("pages/index.ejs");
});
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const foundPage = await Page.findById(id);
  res.render("pages/edit.ejs", { foundPage });
});
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedPage = await Page.findByIdAndUpdate(id, req.body, { new: true });
  res.redirect(`/p/${id}`);
});
module.exports = router;
