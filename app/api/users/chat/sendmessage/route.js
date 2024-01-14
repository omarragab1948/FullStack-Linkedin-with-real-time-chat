import connectToMongoDB from "@/app/utils/connectDB";
import { verifyToken } from "@/app/utils/handleToken";
import { User } from "@/app/utils/models";

export const POST = async (request) => {
  const { userIdToConnect, messageContent } = await request.json();

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

    const userToConnect = await User.findById(userIdToConnect);
    if (!userToConnect) {
      return Response.json({
        message: "User to connect not found",
        status: 404,
      });
    }
    console.log(existUser);
    console.log(userToConnect);
    // Find the connection with the specified receiverId
    const connectionToModify = existUser.acceptedConnections.find(
      (connection) =>
        connection.receiverId === userIdToConnect ||
        connection.requesterId === userIdToConnect
    );
    const connectionToModify2 = userToConnect.acceptedConnections.find(
      (connection) =>
        connection.receiverId === userIdToConnect ||
        connection.requesterId === userIdToConnect
    );
    console.log("connectionToModify", connectionToModify);
    console.log("connectionToModify2", connectionToModify2);

    if (!connectionToModify) {
      return Response.json({
        message: "Connection not found",
        status: 404,
      });
    }
    connectionToModify2.chat.push({
      senderId: existUser._id,
      receiverId: userToConnect._id,
      content: messageContent,
    });
    connectionToModify.chat.push({
      senderId: existUser._id,
      receiverId: userToConnect._id,
      content: messageContent,
    });

    await existUser.save();
    await userToConnect.save();

    return Response.json({ data: existUser, status: 200 });
  } catch (error) {
    return Response.json({
      message: "Internal Server Error",
      status: 500,
    });
  }
};
