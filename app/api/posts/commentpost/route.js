import connectToMongoDB from "@/app/utils/connectDB";
import { verifyToken } from "@/app/utils/handleToken";
import { Post, User } from "@/app/utils/models";

export const POST = async (request) => {
  const { post, userImage, userName, content } = await request.json();
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
    const postCommented = await Post.findById(post);
    if (!postCommented) {
      return Response.json({
        message: "Post not found",
        status: 404,
      });
    }
    const newComment = {
      userId: autherId,
      userName,
      userImage: userImage,
      postId: post,
      content,
    };
    existUser.comments.push(newComment);
    postCommented.comments.push(newComment);
    await postCommented.save();
    await existUser.save();

    return Response.json({
      message: "You comment this post",
      status: 200,
    });
  } catch (err) {
    return Response.json({
      message: err,
      status: 400,
    });
  }
};
