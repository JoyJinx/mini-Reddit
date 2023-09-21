const Page = require("../models/pages.js");
const Comment = require("../models/comments.js");
const mongoose = require("mongoose");

async function deleteAll() {
  await Page.deleteMany({});
}
async function commentGone() {
  await Comment.deleteMany({});
}
async function seedData() {
  await Page.insertMany([
    {
      author: "650bfd6283e6080b8c4afd9d",
      title: "One ring to rule them all...Why??",
      body: "This happens when you are either an absolute or relative path to reference the bootstrap file. When the path to the bootstrap file is not correct, bootstrap functions will not work To know whether you have an incorrect link to the bootstrap files, copy the link and test it in the browser and check the result it will bring. To fix the error of incorrect link to bootstrap files, follow the path specified and ensure that it is pointing to the correct link.",
      img: "https://upload.wikimedia.org/wikipedia/commons/d/d4/One_Ring_Blender_Render.png",
      comments: [],
      likes: 42,
    },
    {
      author: "650bfd6283e6080b8c4afd9d",
      title: "Is there a way to get a stronger mind??",
      body: "This happens when you are either an absolute or relative path to reference the bootstrap file. When the path to the bootstrap file is not correct, bootstrap functions will not work To know whether you have an incorrect link to the bootstrap files, copy the link and test it in the browser and check the result it will bring. To fix the error of incorrect link to bootstrap files, follow the path specified and ensure that it is pointing to the correct link.",
      img: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Phrenology1.jpg",
      comments: [],
      likes: 12,
    },
    {
      author: "650bfd6283e6080b8c4afd9d",
      title: "why Patrick lived under a rock??",
      body: "This happens when you are either an absolute or relative path to reference the bootstrap file. When the path to the bootstrap file is not correct, bootstrap functions will not work To know whether you have an incorrect link to the bootstrap files, copy the link and test it in the browser and check the result it will bring. To fix the error of incorrect link to bootstrap files, follow the path specified and ensure that it is pointing to the correct link.",
      img: "https://upload.wikimedia.org/wikipedia/en/thumb/3/33/Patrick_Star.svg/1200px-Patrick_Star.svg.png",
      comments: [],
      likes: 103,
    },
    {
      author: "650bfd6283e6080b8c4afd9d",
      title: "Certain to die, possible to live...",
      body: "This happens when you are either an absolute or relative path to reference the bootstrap file. When the path to the bootstrap file is not correct, bootstrap functions will not work To know whether you have an incorrect link to the bootstrap files, copy the link and test it in the browser and check the result it will bring. To fix the error of incorrect link to bootstrap files, follow the path specified and ensure that it is pointing to the correct link.",
      img: "https://philosophyawayoflifecom.files.wordpress.com/2021/10/philosophy-a-way-of-life-ph.jpg?w=1000",
      comments: [],
      likes: 1,
    },
    {
      author: "650bfd6283e6080b8c4afd9d",
      title: "Reviews on Barbie movie...",
      body: "This happens when you are either an absolute or relative path to reference the bootstrap file. When the path to the bootstrap file is not correct, bootstrap functions will not work To know whether you have an incorrect link to the bootstrap files, copy the link and test it in the browser and check the result it will bring. To fix the error of incorrect link to bootstrap files, follow the path specified and ensure that it is pointing to the correct link.",
      img: "https://ychef.files.bbci.co.uk/976x549/p0g20fkv.jpg",
      comments: [],
      likes: 69,
    },
  ]);
}
mongoose.connect("mongodb://localhost:27017/miniR");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
  deleteAll().then(commentGone()).then(seedData()).then(console.log("Done!"));
});
