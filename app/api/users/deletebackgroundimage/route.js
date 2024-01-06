import { verifyToken } from "@/app/utils/handleToken";
import { User } from "@/app/utils/models";

export const DELETE = async (request) => {
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
  const backgroundImageFilename = existUser.backgroundImage;

  if (backgroundImageFilename) {
    existUser.backgroundImage = "";
    await existUser.save();
    const data = {
      user: existUser,
      token: token.split(" ")[1],
    };
    return Response.json({
      message: "User background image deleted successfully",
      data: data,
      status: 200,
    });
  } else {
    return Response.json({
      message: "User does not have a background image",
      status: 404,
    });
  }
};
