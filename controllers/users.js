const User = require("../models/users");
const cloudinary = require("../cloudinary/index");

module.exports.getRegister = (req, res) => {
  res.render("users/register");
};

module.exports.getEdit = (req, res) => {
  res.render("users/edit");
};

module.exports.patchEdit = async (req, res) => {
  // console.log(req.body);
  const { bio } = req.body;
  const updatedUser = await User.findById(req.user._id);
  updatedUser.optional.bio = bio;
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      allowed_formats: ["jpeg", "jpg", "png"],
      upload_preset: "myPreset",
    });
    console.log(result);
    if (updatedUser.optional.filename) {
      await cloudinary.uploader.destroy(updatedUser.optional.filename);
    }
    updatedUser.optional.path = result.secure_url;
    updatedUser.optional.realPath = result.secure_url.replace(
      "upload/",
      "upload/c_fill,g_face,h_40,w_40/f_png/r_max/"
    );
    updatedUser.optional.filename = result.public_id;
  }
  updatedUser.save();
  req.flash("success", "Updated user info!");
  res.redirect(`/profile`);
};

module.exports.postRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      registeredUser.date = Date.now();
      registeredUser.save();
      req.flash("success", "Welcome to mR!");
      res.redirect("/setup");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.getLogin = (req, res) => {
  res.render("users/login");
};

module.exports.getSetup = async (req, res) => {
  const thisUser = await User.findById(req.user._id);
  res.render("users/setup", { thisUser });
};

module.exports.postSetup = async (req, res) => {
  const thisUser = await User.findById(req.user._id);
  const { bio } = req.body;
  console.log(req.body);
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      allowed_formats: ["jpeg", "jpg", "png"],
      upload_preset: "myPreset",
    });
    thisUser.optional.bio = bio;
    thisUser.optional.path = result.secure_url;
    thisUser.optional.realPath = result.secure_url.replace(
      "upload/",
      "upload/c_fill,g_face,h_40,w_40/f_png/r_max/"
    );
    thisUser.optional.filename = result.public_id;
  }
  await thisUser.save();
  req.flash("success", "uploaded!");
  res.redirect("/profile");
};

module.exports.getUser = async (req, res) => {
  const thisUser = await User.findById(req.user._id)
    .populate("pages")
    .populate("comments")
    .populate("likes");
  res.render("users/profile", { thisUser });
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

module.exports.getOverview = async (req, res) => {
  const { username } = req.params;
  const watchUser = await User.findByUsername(username);
  res.render("users/show", { watchUser });
};
