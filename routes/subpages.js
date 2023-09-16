const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Page = require("../models/pages.js");

router.get("/", async (req, res) => {
  const pages = await Page.find({});
  res.render("pages/index.ejs", { pages });
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const foundPage = await Page.findById(id);
  res.render("pages/show.ejs", { foundPage });
});
router.post("/", async (req, res) => {
  console.log(req.body);
  const newPage = await Page.insertOne({ ...req.body });
  res.redirect("pages/index.ejs");
});

module.exports = router;
