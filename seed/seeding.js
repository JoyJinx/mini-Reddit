const Page = require("../models/pages.js");
const Comment = require("../models/comments.js");

async function deleteAll() {
  await Page.deleteMany({});
}
async function commentGone() {
  await Comment.deleteMany({});
}
async function seedData() {
  await Page.insertMany([
    {
      author: "Jack",
      body: "One ring to rule them all...Why??",
      img: "https://upload.wikimedia.org/wikipedia/commons/d/d4/One_Ring_Blender_Render.png",
      likes: 42,
    },
    {
      author: "Jill",
      body: "Is there a way to get a stronger mind??",
      img: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Phrenology1.jpg",
      likes: 12,
    },
    {
      author: "Blue",
      body: "why Patrick lived under a rock??",
      img: "https://upload.wikimedia.org/wikipedia/en/thumb/3/33/Patrick_Star.svg/1200px-Patrick_Star.svg.png",
      likes: 103,
    },
    {
      author: "Indri02",
      body: "Certain to die, possible to live...",
      img: "https://philosophyawayoflifecom.files.wordpress.com/2021/10/philosophy-a-way-of-life-ph.jpg?w=1000",
      likes: 1,
    },
    {
      author: "B00gey",
      body: "Reviews on Barbie movie...",
      img: "https://ychef.files.bbci.co.uk/976x549/p0g20fkv.jpg",
      likes: 69,
    },
  ]);
}
deleteAll().then(commentGone()).then(seedData());
