import connectToMongoDB from "@/app/utils/connectDB";
import { verifyToken } from "@/app/utils/handleToken";
import { Post, User } from "@/app/utils/models";

export const POST = async (request) => {
  const { post, userName, userImage } = await request.json();

  const token = request.headers.get("Authorization");
  if (!token?.startsWith("Bearer ")) {
    return Response.json({
      message: "Unauthorized access",
      status: 401,
    });
  }

  const autherId = await verifyToken(token.split(" ")[1]);
  if (!autherId) {
    return Response.json({
      message: "Unauthorized access",
      status: 401,
    });
  }

  connectToMongoDB();
  try {
    const existUser = await User.findById(autherId);

    if (!existUser) {
      return Response.json({
        message: "User not found",
        status: 404,
      });
    }
    const postLiked = await Post.findById(post);
    if (!postLiked) {
      return Response.json({
        message: "Post not found",
        status: 404,
      });
    }
    const newLike = {
      userId: autherId,
      userName,
      userImage: userImage,
    };
    postLiked.likes.push(newLike);
    await postLiked.save();
    return Response.json({
      message: "You liked this post",
      status: 404,
    });
  } catch (err) {}
};
