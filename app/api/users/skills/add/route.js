import connectToMongoDB from "@/app/utils/connectDB";
import { verifyToken } from "@/app/utils/handleToken";
import { User } from "@/app/utils/models";

export const POST = async (request) => {
  const body = await request.formData();
  const skill = body.get("skill");

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
  const createSkill = {
    skill,
  };
  existUser.skills.push(createSkill);
  await existUser.save();
  const data = {
    user: existUser,
    token: token.split(" ")[1],
  };

  return Response.json({
    message: "Skill added successfully",
    data: data,
    status: 200,
  });
};
