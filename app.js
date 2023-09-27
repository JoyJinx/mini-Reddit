if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");
const userRoutes = require("./routes/users.js");
const sortRoutes = require("./routes/sort.js");
const helmet = require("helmet");

const MongoStore = require("connect-mongo");

const mongoSanitize = require("express-mongo-sanitize");

const dbUrl = process.env.DB_URI || "mongodb://localhost:27017/miniR";

mongoose.connect(dbUrl);

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
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));

app.use("/public", express.static(path.join(__dirname, "public")));

const secret = process.env.SECRET || "thereisnotomorrow";

const store = new MongoStore({
  mongoUrl: dbUrl,
  secret: secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("Session Store Error", e);
});

const sessionConfig = {
  store: store,
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1800000,
    secure: true,
    maxAge: 900000,
    sameSite: "Lax",
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  if (!["/login", "/"].includes(req.originalUrl)) {
    req.session.lastUrl = req.originalUrl;
  }
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/p", pageRoutes);
app.use("/p/popular", sortRoutes);
app.use("/p/:id/comments", commentRoutes);

app.get("/", (req, res) => {
  res.render("pages/home.ejs");
});

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
