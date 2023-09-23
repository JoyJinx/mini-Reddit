const User = require("../models/users");

module.exports.getRegister = (req, res) => {
  res.render("users/register");
};

module.exports.postRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to mR!");
      res.redirect("/p");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.getLogin = (req, res) => {
  res.render("users/login");
};

module.exports.postLogin = async (req, res) => {
  req.flash("success", `Welcome back ${req.user.username}!`);
  const redirectUrl = req.session.lastUrl || "/p";
  delete req.session.lastUrl;
  res.redirect(redirectUrl);
};

module.exports.getLogOut = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Successfully logged out!");
    res.redirect("/p");
  });
};
