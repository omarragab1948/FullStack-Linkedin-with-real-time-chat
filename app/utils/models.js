import mongoose, { models } from "mongoose";

const userSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
});
const postSchema = new mongoose.Schema({
  autherId: {
    type: Object,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  autherImage: {
    type: String,
  },
  autherTitle: {
    type: String,
  },
  content: {
    type: String,
  },
  image: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const User = models.User || mongoose.model("User", userSchema);
const Post = models.Post || mongoose.model("Post", postSchema);
export { User, Post };
