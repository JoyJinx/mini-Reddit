const Page = require("../models/pages");

module.exports.getByNew = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  // console.log(req.query);

  try {
    // execute query with page and limit values
    const pages = await Page.find({})
      .sort("-date")
      .populate("author")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

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

    const count = await Page.countDocuments();
    res.render("pages/index", {
      pages,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.getByBest = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  // console.log(req.query);

  try {
    let pages = await Page.find({})
      .populate("author")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
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
    const count = await Page.countDocuments();

    res.render("pages/index.ejs", {
      pages,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
  }
};
