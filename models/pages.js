const mongoose = require("mongoose");
const Comment = require("./comments");
const User = require("./users");

const pageSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: String,
    body: String,
    img: { path: String, filename: String },
    date: Number,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

pageSchema.post("findOneAndDelete", async (page) => {
  if (page.comments.length) {
    const res = await Comment.deleteMany({ _id: { $in: page.comments } });
    console.log(res);
  } else if (page.likes.length) {
    await User.deleteMany({ _id: { $in: page.likes } });
  }
});

const Page = mongoose.model("Page", pageSchema);

module.exports = Page;
