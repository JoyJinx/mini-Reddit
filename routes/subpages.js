const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Page = require("../seed/seeding.js");

router.get("/", async (req, res) => {
  console.log(Page.find({}));
  const pages = await Page.find({});
  console.log(pages);
  res.render("index.ejs", { pages });
});
router.get("/:id", (req, res) => {
  res.render("show.ejs");
});
router.post("/", (req, res) => {
  res.redirect("index.ejs");
});

module.exports = router;
