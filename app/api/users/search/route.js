import connectToMongoDB from "@/app/utils/connectDB";
import { verifyToken } from "@/app/utils/handleToken";
import { User } from "@/app/utils/models";

export const POST = async (request) => {
  const { name } = await request.json();
  const token = request.cookies.get("token").value;
  const autherId = await verifyToken(token);
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
  const searchedUser = await User.find({
    $or: [
      { firstName: { $regex: new RegExp(name, "i") } },
      { lastName: { $regex: new RegExp(name, "i") } },
    ],
  });
  const data = {
    users: searchedUser,
  };
  const response = Response.json({
    data: data,
    status: 200,
  });
  return response;
};
