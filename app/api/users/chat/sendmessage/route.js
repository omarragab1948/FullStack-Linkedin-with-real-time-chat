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

    let commonChannel = null;

    for (const conn1 of existUser.acceptedConnections) {
      for (const conn2 of userToConnect.acceptedConnections) {
        if (conn1.channel === conn2.channel) {
          commonChannel = conn1.channel;

          // Add a new message to the chat array
          console.log("conn1", conn1);
          console.log("conn2", conn2);

          conn1.chat.push({
            senderId: existUser._id,
            receiverId: userToConnect._id,
            content: messageContent,
          });

          conn2.chat.push({
            senderId: existUser._id,
            receiverId: userToConnect._id,
            content: messageContent,
          });

          break;
        }
      }
      if (commonChannel) {
        break;
      }
    }

    if (!commonChannel) {
      return Response.json({
        message: "Common channel not found",
        status: 404,
      });
    }

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
