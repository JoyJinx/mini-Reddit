const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const pageRoutes = require("./routes/subpages.js");
const commentRoutes = require("./routes/comments.js");
const AppError = require("./utils/AppError.js");
const session = require("express-session");
const flash = require("connect-flash");

mongoose.connect("mongodb://localhost:27017/miniR");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.engine("ejs", engine);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const sessionConfig = {
  secret: "thereisnotomorrow",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 900000,
    maxAge: 900000,
  },
};
app.use(session(sessionConfig));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/p", pageRoutes);
app.use("/p/:id/comments", commentRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("pages/error.ejs", { err });
});

app.listen(3000, () => {
  console.log("Listening on port 3000:");
});
