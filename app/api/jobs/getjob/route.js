import connectToMongoDB from "@/app/utils/connectDB";
import { verifyToken } from "@/app/utils/handleToken";
import { Job, User } from "@/app/utils/models";

export const POST = async (request) => {
  const { id } = await request.json();
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
  const job = await Job.findById(id);
  const data = {
    job,
  };
  console.log(job);
  const response = Response.json({
    data: data,
    status: 200,
  });
  return response;
};
