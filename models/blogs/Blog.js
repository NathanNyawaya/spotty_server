import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
  {
    title: { type: String },
    club: { type: String },
    author: { type: String },
    summaryText: { type: String },
    imageFiles: { type: Array },
    paragraphs: { type: Array, required: true },
    views: { type: Number, default: 0 },
    user_id: { type: String, required: true },
  },
  { timestamps: true }
);

var Blog = mongoose.model("Blog", blogSchema);
export default Blog;
