const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const { isLoggedIn, isAuthorized, validatePage } = require("../middleware.js");
const pages = require("../controllers/pages.js");
const upload = require("../utils/multer.js");

router.get("/", catchAsync(pages.getPages));
router.get("/new", isLoggedIn, pages.getNew);
router.get("/:id", catchAsync(pages.getPageId));
router.post(
  "/",
  isLoggedIn,
  upload.single("page[img]"),
  validatePage,
  catchAsync(pages.postPage)
);
router.post("/:id/like", isLoggedIn, catchAsync(pages.postLike));
router.get("/:id/edit", isLoggedIn, isAuthorized, catchAsync(pages.getEdit));
router.patch(
  "/:id",
  isLoggedIn,
  isAuthorized,
  upload.single("page[img]"),
  validatePage,
  catchAsync(pages.patchEdit)
);
router.delete("/:id", isLoggedIn, isAuthorized, catchAsync(pages.pageDelete));

module.exports = router;
