const mongoose = require("mongoose");
const Comment = require("./comments");

const pageSchema = new mongoose.Schema({
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
});

pageSchema.post("findOneAndDelete", async (page) => {
  if (page.comments.length) {
    const res = await Comment.deleteMany({ _id: { $in: page.comments } });
    console.log(res);
  }
});

const Page = mongoose.model("Page", pageSchema);

module.exports = Page;
