const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const pageRoutes = require("./routes/subpages.js");
const commentRoutes = require("./routes/comments.js");

app.engine("ejs", engine);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);
app.use(
  "/fa",
  express.static(path.join(__dirname, "node_modules/font-awesome/css"))
);

app.use("/p", pageRoutes);
app.use("/p/:id/comments", commentRoutes);

app.listen(3000, () => {
  console.log("Listening on port 3000:");
});
