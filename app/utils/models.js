import mongoose, { models } from "mongoose";

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
const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
});

const skillSchema = new mongoose.Schema({
  skill: {
    type: String,
  },
});
const languageSchema = new mongoose.Schema({
  language: {
    type: String,
  },
});
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
    trim: true,
  },
  password: {
    type: String,
  },
  title: {
    type: String,
  },
  posts: [postSchema],
  education: [educationSchema],
  about: {
    type: String,
  },
  skills: [skillSchema],
  languages: [languageSchema],
});

const User = models.User || mongoose.model("User", userSchema);
const Post = models.Post || mongoose.model("Post", postSchema);
export { User, Post };
