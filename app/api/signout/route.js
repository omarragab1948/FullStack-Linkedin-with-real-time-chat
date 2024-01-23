import connectToMongoDB from "@/app/utils/connectDB";
import { verifyToken } from "@/app/utils/handleToken";
import { User } from "@/app/utils/models";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const token = request.cookies.get("token");

  const autherId = await verifyToken(token?.value);

  connectToMongoDB();
  const existUser = await User.findById(autherId);

  if (!existUser) {
    return Response.json({
      message: "User not found",
      status: 404,
    });
  }
  if (!token) {
    return Response.json({ status: 204 });
  }
  existUser.status = "offline";
  for (const connection of existUser.acceptedConnections) {
    if (connection?.receiverId === existUser?._id.toString()) {
      const connectedUser = await User.findById(connection.requesterId);
      for (const connectionTo of connectedUser?.acceptedConnections) {
        if (
          connectionTo?.receiverId === existUser?._id.toString() &&
          connectionTo?.requesterId === connectedUser?._id.toString()
        ) {
          connection.receiverStatus = "offline";
          connectionTo.receiverStatus = "offline";
          await existUser.save();
          await connectedUser.save();
        }
      }
    } else if (connection?.requesterId === existUser?._id.toString()) {
      const connectedUser = await User.findById(connection.receiverId);
      for (const connectionTo of connectedUser?.acceptedConnections) {
        if (
          connectionTo?.requesterId === existUser?._id.toString() &&
          connectionTo?.receiverId === connectedUser?._id.toString()
        ) {
          connection.requesterStatus = "offline";
          connectionTo.requesterStatus = "offline";
          await existUser.save();
          await connectedUser.save();
        }
      }
    }
  }
  await existUser.save();
  const response = NextResponse.json({
    message: "Log out successful",
    status: 200,
  });
  response.cookies.delete("token");
  return response;
};
