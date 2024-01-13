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

    const existingConnection = existUser?.acceptedConnections?.find(
      (conn) =>
        conn.receiverId === userIdToConnect?.receiverId ||
        conn.requesterId === userIdToConnect?.requesterId
    );

    if (!existingConnection) {
      if (!userToConnect) {
        return Response.json({
          message: "User to connect not found",
          status: 404,
        });
      }

      userToConnect.acceptedConnections.push({
        receiverId: userToConnect?._id,
        requesterId: existUser?._id,
        status: "accepted",
        receiverBackgroundImage: userToConnect?.backgroundImage,
        receiverProfileImage: userToConnect?.profileImage,
        receiverFirstName: userToConnect?.firstName,
        receiverLastName: userToConnect?.lastName,
        receiverTitle: userToConnect?.title,
        requesterBackgroundImage: existUser?.backgroundImage,
        requesterProfileImage: existUser?.profileImage,
        requesterFirstName: existUser?.firstName,
        requesterLastName: existUser?.lastName,
        requesterTitle: existUser?.title,
      });

      await userToConnect.save();

      existUser.acceptedConnections.push({
        receiverId: userToConnect?._id,
        requesterId: existUser?._id,
        status: "accepted",
        receiverBackgroundImage: userToConnect?.backgroundImage,
        receiverProfileImage: userToConnect?.profileImage,
        receiverFirstName: userToConnect?.firstName,
        receiverLastName: userToConnect?.lastName,
        receiverTitle: userToConnect?.title,
        requesterBackgroundImage: existUser?.backgroundImage,
        requesterProfileImage: existUser?.profileImage,
        requesterFirstName: existUser?.firstName,
        requesterLastName: existUser?.lastName,
        requesterTitle: existUser?.title,
      });

      await existUser.save();
      console.log("existUser: " + existUser);
      console.log("userToConnect: " + userToConnect);

      return Response.json({ data: existUser, status: 200 });
    } else {
      return Response.json({
        data: existUser,
        message: "Connection already exists",
        status: 200,
      });
    }
  } catch (error) {
    return Response.json({
      message: "Internal Server Error",
      status: 500,
    });
  }
};
