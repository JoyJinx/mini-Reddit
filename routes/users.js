const express = require("express");
const User = require("../models/users");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

router.get("/register", (req, res) => {
  res.render("users/register");
});
router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      req.flash("success", "Welcome to mR!");
      res.redirect("/p");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

module.exports = router;
