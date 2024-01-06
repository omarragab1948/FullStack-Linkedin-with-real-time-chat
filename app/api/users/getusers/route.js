import { verifyToken } from "@/app/utils/handleToken";
import { User } from "@/app/utils/models";

export const GET = async (request) => {
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
  const users = await User.find({ _id: { $ne: autherId } });
  return Response.json({
    data: users,
    status: 200,
  });
};
