import connectToMongoDB from "@/app/utils/connectDB";
import { verifyToken } from "@/app/utils/handleToken";
import { User } from "@/app/utils/models";

export const PUT = async (request) => {
  const educationId = new URL(request.url).pathname.split("/")[5];

  const body = await request.formData();
  const token = request.headers.get("Authorization");

  if (!token?.startsWith("Bearer ")) {
    return Response.json({
      message: "Unauthorized access",
      status: 401,
    });
  }

  const userId = await verifyToken(token.split(" ")[1]);
  if (!userId) {
    return Response.json({
      message: "Unauthorized access",
      status: 401,
    });
  }

  connectToMongoDB();

  const existUser = await User.findById(userId);
  if (!existUser) {
    return Response.json({
      message: "User not found",
      status: 404,
    });
  }

  const updatedEducation = {
    institution: body.get("institution"),
    department: body.get("department"),
    startDate: body.get("startDate"),
    endDate: body.get("endDate"),
    grade: body.get("grade"),
  };

  // Find the education in the user's array and update only the provided fields
  const educationToUpdate = existUser.education.id(educationId);
  if (!educationToUpdate) {
    return Response.json({
      message: "Education not found",
      status: 404,
    });
  }

  Object.keys(updatedEducation).forEach((key) => {
    if (updatedEducation[key] !== undefined) {
      educationToUpdate[key] = updatedEducation[key];
    }
  });

  await existUser.save();

  const data = {
    user: existUser,
    token: token.split(" ")[1],
  };

  return Response.json({
    message: "Education updated successfully",
    data: data,
    status: 200,
  });
};
