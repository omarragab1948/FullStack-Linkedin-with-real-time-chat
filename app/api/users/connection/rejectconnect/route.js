import connectToMongoDB from "@/app/utils/connectDB";
import { verifyToken } from "@/app/utils/handleToken";
import { User } from "@/app/utils/models";

export const POST = async (request) => {
  const { userIdToConnect } = await request.json();

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
  try {
    const existUser = await User.findById(autherId);

    if (!existUser) {
      return Response.json({
        message: "User not found",
        status: 404,
      });
    }
    const userToConnect = await User.findById(userIdToConnect?.requesterId);

    const existingConnectionIndex = existUser?.pendingConnections?.findIndex(
      (conn) =>
        conn.receiverId === userIdToConnect?.receiverId ||
        conn.requesterId === userIdToConnect?.requesterId
    );
    const existingConnectionIndex2 =
      userToConnect?.pendingConnections?.findIndex(
        (conn) =>
          conn.receiverId === userToConnect?.receiverId ||
          conn.requesterId === userToConnect?.requesterId
      );
    if (existingConnectionIndex !== -1 || existingConnectionIndex2 !== -1) {
      // Remove the connection from pendingConnections
      existUser.pendingConnections.splice(existingConnectionIndex, 1);
      userToConnect.pendingConnections.splice(existingConnectionIndex2, 1);

      await existUser.save();
      await userToConnect.save();
    } else {
      return Response.json({
        message: "Connection not found in pending connections",
        status: 404,
      });
    }

    return Response.json({ data: existUser, status: 200 });
  } catch (error) {
    return Response.json({
      message: "Internal Server Error",
      status: 500,
    });
  }
};
