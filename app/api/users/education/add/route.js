import connectToMongoDB from "@/app/utils/connectDB";
import { verifyToken } from "@/app/utils/handleToken";
import { User } from "@/app/utils/models";

export const POST = async (request) => {
  const body = await request.formData();
  const institution = body.get("institution");
  const department = body.get("department");
  const startDate = body.get("startDate");
  const endDate = body.get("endDate");
  const grade = body.get("grade");

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

  const education = {
    institution,
    department,
    startDate,
    endDate,
    grade,
  };
  existUser.education.push(education);
  await existUser.save();
  const data = {
    user: existUser,
    token: token.split(" ")[1],
  };

  return Response.json({
    message: "Eduacation added successfully",
    data: data,
    status: 200,
  });
};
