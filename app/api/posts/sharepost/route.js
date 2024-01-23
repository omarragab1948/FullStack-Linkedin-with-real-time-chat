import { verifyToken } from "@/app/utils/handleToken";
import { Post, User } from "@/app/utils/models";
import connectToMongoDB from "@/app/utils/connectDB";

export const POST = async (request) => {
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

  const existUser = await User.findById(autherId);
  if (!existUser) {
    return Response.json({
      message: "User not found",
      status: 401,
    });
  }

  const body = await request.formData();
  const content = body.get("content");
  const image = body.get("image");
  const originalUserId = body.get("originalUserId");
  const originalUserImage = body.get("originalUserImage");
  const originalUserFirstName = body.get("originalUserFirstName");
  const originalUserLastName = body.get("originalUserLastName");
  const originalDate = body.get("originalDate");
  const originalUserTitle = body.get("originalUserTitle");
  const connectAndCreatePost = async (post) => {
    connectToMongoDB();
    const createdPost = await Post.create(post);
    if (!createdPost) {
      return Response.json({
        message: "Error creating post",
        status: 400,
      });
    }
    existUser.posts.push(createdPost);

    const user = await existUser.save();

    const data = {
      user,
      token: token.split(" ")[1],
    };
    const posts = await Post.find().sort({ _id: -1 });
    return Response.json({
      message: "Your article was added",
      data,
      posts,
      status: 201,
    });
  };

  if (image !== "null") {
    try {
      const postWithImage = {
        autherId,
        firstName: existUser?.firstName,
        lastName: existUser?.lastName,
        content,
        image,
        autherImage: existUser?.profileImage,
        autherTitle: existUser?.title || "",
        repost: {
          originalUserFirstName,
          originalUserLastName,
          originalUserId,
          originalUserImage,
          originalUserTitle,
          originalDate,
        },
      };
      return await connectAndCreatePost(postWithImage);
    } catch (error) {
      console.error("Error uploading image:", error.code, error.message);
      return Response.json({
        message: "Error uploading image",
        status: 400,
      });
    }
  } else {
    const postWithoutImage = {
      autherId,
      firstName: existUser?.firstName,
      lastName: existUser?.lastName,
      content,
      autherTitle: existUser?.title || "",
      repost: {
        originalUserFirstName,
        originalUserLastName,
        originalUserId,
        originalUserImage,
        originalUserTitle,
        originalDate,
      },
    };
    return await connectAndCreatePost(postWithoutImage);
  }
};
