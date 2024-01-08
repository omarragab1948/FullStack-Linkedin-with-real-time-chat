import connectToMongoDB from "@/app/utils/connectDB";
import { verifyToken } from "@/app/utils/handleToken";
import { User } from "@/app/utils/models";

export const DELETE = async (request) => {
  const skillId = new URL(request.url).pathname.split("/")[5];

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
  existUser.skills = existUser.skills.filter(
    (edu) => edu._id.toString() !== skillId
  );

  // Save the updated user document
  await existUser.save();
  const data = {
    user: existUser,
    token: token.split(" ")[1],
  };

  return Response.json({
    message: "Skill deleted successfully",
    data: data,
    status: 200,
  });
};
