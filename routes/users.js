const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");
const { isLoggedIn, validateRegister } = require("../middleware");
const upload = require("../utils/multer");

router.get("/register", users.getRegister);
router.post("/register", validateRegister, catchAsync(users.postRegister));
router.get("/login", users.getLogin);
router.get("/setup", isLoggedIn, catchAsync(users.getSetup));
router.get("/edit", isLoggedIn, catchAsync(users.getEdit));
router.patch(
  "/profile",
  isLoggedIn,
  upload.single("img"),
  catchAsync(users.patchEdit)
);

router.post(
  "/profile",
  isLoggedIn,
  upload.single("img"),
  catchAsync(users.postSetup)
);
router.get("/profile", isLoggedIn, catchAsync(users.getUser));
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  catchAsync(users.postLogin)
);
router.get("/logout", users.getLogOut);
router.get("/:username/view", catchAsync(users.getOverview));

module.exports = router;
