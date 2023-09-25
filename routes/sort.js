const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const sorting = require("../controllers/sort.js");

router.get("/new", catchAsync(sorting.getByNew));
router.get("/best", catchAsync(sorting.getByBest));

module.exports = router;
