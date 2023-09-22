const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");

router.get("/register", users.getRegister);
router.post("/register", catchAsync(users.postRegister));
router.get("/login", users.getLogin);
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  catchAsync(users.postLogin)
);
router.get("/logout", users.getLogOut);

module.exports = router;
