import { verifyToken } from "@/app/utils/handleToken";
import { Post, User } from "@/app/utils/models";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
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
      status: 404,
    });
  }

  const body = await request.formData();
  const backgroundImage = body.get("backgroundImage");
  const profileImage = body.get("profileImage");
  console.log(backgroundImage, profileImage);
  const updateUser = async (image, fieldName) => {
    connectToMongoDB();

    if (image) {
      try {
        const imageRef = ref(storage, `images/${fieldName}/${v4()}`);
        await uploadBytes(imageRef, image);
        const downloadURL = await getDownloadURL(imageRef);

        if (fieldName === "backgroundImage") {
          existUser.backgroundImage = downloadURL;
        } else if (fieldName === "profileImage") {
          existUser.profileImage = downloadURL;
          const userPosts = await Post.find({
            autherId: existUser._id.toString(),
          });
          for (const post of userPosts) {
            if (post?.autherId === existUser?._id.toString()) {
              post.autherImage = downloadURL;
              await post.save();
            }
          }
          const reposts = await Post.find({
            "repost.originalUserId": existUser._id.toString(),
          });

          for (const post of reposts) {
            if (post?.repost?.originalUserId === existUser?._id.toString()) {
              post.repost.originalUserImage = downloadURL;
              await post.save();
            }
          }
        }

        const updatedUser = await existUser.save();
        if (!updatedUser) {
          return Response.json({
            message: "Error updating image",
            status: 400,
          });
        }
        const data = {
          user: updatedUser,
          token: token.split(" ")[1],
        };
        return Response.json({
          message: `Your ${
            fieldName === "backgroundImage" ? "background" : "profile"
          } image was updated`,
          data: data,
          status: 200,
        });
      } catch (error) {
        console.error("Error uploading image:", error.code, error.message);
        return Response.json({
          message: "Error uploading image",
          status: 400,
        });
      }
    } else {
      return Response.json({
        message: `No ${
          fieldName === "backgroundImage" ? "background" : "profile"
        } image provided`,
        status: 400,
      });
    }
  };

  if (backgroundImage) {
    return await updateUser(backgroundImage, "backgroundImage");
  } else if (profileImage) {
    return await updateUser(profileImage, "profileImage");
  } else {
    return Response.json({
      message: "No image provided",
      status: 400,
    });
  }
};
