import { verifyToken } from "@/app/utils/handleToken";
import { Post, User } from "@/app/utils/models";
import {
  uploadBytes,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../../../utils/firebase";
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

  const connectAndCreatePost = async (post) => {
    connectToMongoDB();
    const createdPost = await Post.create(post);
    if (!createdPost) {
      return Response.json({
        message: "Error creating post",
        status: 400,
      });
    }
    console.log();
    existUser.posts.push(createdPost);
    console.log(existUser);

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
      const imageRef = ref(storage, `images/${v4()}`);
      await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(imageRef);

      const postWithImage = {
        autherId,
        firstName: existUser.firstName,
        lastName: existUser.lastName,
        content,
        image: downloadURL,
        autherImage: existUser.profileImage,
        autherTitle: "Front End",
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
      firstName: existUser.firstName,
      lastName: existUser.lastName,
      content,
      autherTitle: "Front End",
    };
    console.log(postWithoutImage);
    return await connectAndCreatePost(postWithoutImage);
  }
};
