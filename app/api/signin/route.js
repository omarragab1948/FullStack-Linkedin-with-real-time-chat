import connectToMongoDB from "@/app/utils/connectDB";
import { handleToken } from "@/app/utils/handleToken";
import { User } from "@/app/utils/models";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (request) => {
  try {
    const { email, password, google, profileImage, firstName, lastName } =
      await request.json();

    // Validate email and password for non-Google login
    if (!google && (!email || !password)) {
      return NextResponse.json({
        error: "Invalid email or password",
        status: 400,
      });
    }
    connectToMongoDB();

    let existedUser;

    if (google) {
      // Handle Google sign-in without password
      existedUser = await User.findOne({ email });
      console.log(existedUser);

      if (!existedUser) {
        // If the user doesn't exist, create a new user with Google information
        existedUser = await User.create({
          email,
          profileImage,
          firstName,
          status: "online",
          lastName,
          // Add other Google-related fields if needed
        });
      } else {
        for (const connection of existedUser?.acceptedConnections) {
          if (connection?.receiverId === existedUser?._id.toString()) {
            const connectedUser = await User.findById(connection?.requesterId);
            for (const connectionTo of connectedUser?.acceptedConnections) {
              if (
                connectionTo?.receiverId === existedUser?._id.toString() &&
                connectionTo?.requesterId === connectedUser?._id.toString()
              ) {
                connection.receiverStatus = "online";
                connectionTo.receiverStatus = "online";
                await existedUser.save();
                await connectedUser.save();
              }
            }
          } else if (connection?.requesterId === existedUser?._id.toString()) {
            const connectedUser = await User.findById(connection?.receiverId);
            for (const connectionTo of connectedUser?.acceptedConnections) {
              if (
                connectionTo?.requesterId === existedUser?._id.toString() &&
                connectionTo?.receiverId === connectedUser?._id.toString()
              ) {
                connection.requesterStatus = "online";
                connectionTo.requesterStatus = "online";
                await existedUser.save();
                await connectedUser.save();
              }
            }
          }
        }
      }
    } else {
      // Handle regular email/password login
      existedUser = await User.findOne({ email });
      if (!existedUser) {
        return NextResponse.json({ error: "User doesn't exist", status: 404 });
      }
      if (password) {
        const passwordMatch = await bcrypt.compare(
          password,
          existedUser.password
        );
        if (!passwordMatch) {
          return NextResponse.json({
            error: "Invalid email or password",
            status: 401,
          });
        }
      }
      // Compare the provided password with the hashed password

      for (const connection of existedUser?.acceptedConnections) {
        if (connection?.receiverId === existedUser?._id.toString()) {
          const connectedUser = await User.findById(connection?.requesterId);
          for (const connectionTo of connectedUser?.acceptedConnections) {
            if (
              connectionTo?.receiverId === existedUser?._id.toString() &&
              connectionTo?.requesterId === connectedUser?._id.toString()
            ) {
              connection.receiverStatus = "online";
              connectionTo.receiverStatus = "online";
              await existedUser.save();
              await connectedUser.save();
            }
          }
        } else if (connection?.requesterId === existedUser?._id.toString()) {
          const connectedUser = await User.findById(connection?.receiverId);
          for (const connectionTo of connectedUser?.acceptedConnections) {
            if (
              connectionTo?.requesterId === existedUser?._id.toString() &&
              connectionTo?.receiverId === connectedUser?._id.toString()
            ) {
              connection.requesterStatus = "online";
              connectionTo.requesterStatus = "online";
              await existedUser.save();
              await connectedUser.save();
            }
          }
        }
      }
      existedUser.status = "online";
      await existedUser.save();
    }
    // Generate token and prepare response
    const token = await handleToken(existedUser._id);
    const data = {
      user: existedUser,
      token,
    };

    const response = NextResponse.json({
      message: "Login successful",
      data,
      status: 200,
    });

    response.cookies.set({ name: "token", value: token });

    return response;
  } catch (error) {
    console.error("Error during login:", error);

    // Respond with an error status and message
    return NextResponse.json({
      error: "Error during login",
      status: 500,
    });
  }
};
