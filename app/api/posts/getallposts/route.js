import connectToMongoDB from "@/app/utils/connectDB";

const { Post } = require("@/app/utils/models");

export const GET = async (request) => {
  connectToMongoDB();
  const posts = await Post.find().sort({ _id: -1 });
  console.log(posts);
  if (posts.length === 0) {
    return Response.json({ message: "No posts found", status: 404 });
  }
  const response = Response.json({
    data: posts,
    status: 200,
  });
  return response;
};
