const Page = require("../models/pages");

module.exports.getByNew = async (req, res) => {
  let pages = await Page.find({}).populate("author");
  function compareNewFn(a, b) {
    return b.date - a.date;
  }
  pages = pages.sort(compareNewFn);
  res.render("pages/index.ejs", { pages });
};

module.exports.getByBest = async (req, res) => {
  let pages = await Page.find({}).populate("author");
  function compareBestFn(a, b) {
    return b.likes.length - a.likes.length;
  }
  pages = pages.sort(compareBestFn);
  res.render("pages/index.ejs", { pages });
};
