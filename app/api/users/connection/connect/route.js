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

    const existingConnection = existUser.pendingConnections.find((conn) => {
      return (
        conn.userId === userIdToConnect || conn.requesterId === userIdToConnect
      );
    });

    if (existingConnection) {
      return Response.json({
        data: existUser,
        message: "Connection already exists",
        status: 200,
      });
    } else {
      const userToConnect = await User.findById(userIdToConnect);
      if (!userToConnect) {
        return Response.json({
          message: "User to connect not found",
          status: 404,
        });
      }

      userToConnect.pendingConnections.push({
        receiverId: userToConnect?._id,
        requesterId: existUser?._id,
        status: "pending",
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
      existUser.pendingConnections.push({
        receiverId: userToConnect?._id,
        requesterId: existUser?._id,
        status: "pending",
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
      return Response.json({ data: existUser, status: 200 });
    }
  } catch (error) {
    return Response.json({
      message: "Internal Server Error",
      status: 500,
    });
  }
};
