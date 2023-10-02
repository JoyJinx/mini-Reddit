const Page = require("../models/pages");

module.exports.getByNew = async (req, res) => {
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

module.exports.getByBest = async (req, res) => {
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
  function compareBestFn(a, b) {
    return b.likes.length - a.likes.length;
  }
  pages = pages.sort(compareBestFn);
  res.render("pages/index.ejs", { pages });
};
