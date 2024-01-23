import connectToMongoDB from "@/app/utils/connectDB";
import { verifyToken } from "@/app/utils/handleToken";
import { Post, User } from "@/app/utils/models";

export const POST = async (request) => {
  const { firstName, lastName, title, country, emailToContact } =
    await request.json();

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
  const existUser = await User.findById(autherId);
  if (!existUser) {
    return Response.json({
      message: "User not found",
      status: 401,
    });
  }

  existUser.firstName = firstName || "";
  existUser.lastName = lastName || "";
  existUser.emailToContact = emailToContact || "";
  existUser.country = country || "";
  existUser.title = title || "";

  await existUser.save();

  const userPosts = await Post.find({
    autherId: existUser._id.toString(),
  });
  for (const post of userPosts) {
    if (post?.autherId === existUser?._id.toString()) {
      post.firstName = firstName;
      post.lastName = lastName;
      post.title = title;
      await post.save();
    }
  }
  const reposts = await Post.find({
    "repost.originalUserId": existUser._id.toString(),
  });

  for (const post of reposts) {
    if (post?.repost?.originalUserId === existUser?._id.toString()) {
      post.repost.originalUserFirstName = firstName;
      post.repost.originalUserLastName = lastName;
      post.repost.originalUserTitle = title;

      await post.save();
    }
  }
  const data = {
    user: existUser,
    token: token.split(" ")[1],
  };

  return Response.json({
    message: "Mode changed successfully",
    data: data,
    status: 200,
  });
};
