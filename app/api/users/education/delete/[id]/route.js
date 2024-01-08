import connectToMongoDB from "@/app/utils/connectDB";
import { verifyToken } from "@/app/utils/handleToken";
import { User } from "@/app/utils/models";

export const DELETE = async (request) => {
  const educationId = new URL(request.url).pathname.split("/")[5];

  console.log(educationId);
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

  // Use filter to create a new array excluding the education with the given ID
  existUser.education = existUser.education.filter(
    (edu) => edu._id.toString() !== educationId
  );

  // Save the updated user document
  await existUser.save();
  const data = {
    user: existUser,
    token: token.split(" ")[1],
  };

  return Response.json({
    message: "Education deleted successfully",
    data: data,
    status: 200,
  });
};
