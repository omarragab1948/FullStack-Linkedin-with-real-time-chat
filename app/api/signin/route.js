import connectToMongoDB from "@/app/utils/connectDB";
import { handleToken } from "@/app/utils/handleToken";
import { User } from "@/app/utils/models";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const { email, password } = await request.json();

    // Validate email and password
    if (!email || !password) {
      const response = Response.json({
        error: "Invalid email or password",
        status: 400,
      });
      return response;
    }
    connectToMongoDB();

    const existedUser = await User.findOne({ email: email });
    if (!existedUser) {
      return Response.json({ error: "User doesn't exist", status: 404 });
    }
    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, existedUser.password);

    if (!passwordMatch) {
      const response = Response.json({
        error: "Invalid email or password",
        status: 401,
      });
      return response;
    }
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
    const response = Response.json({
      error: "Error during login",
      status: 500,
    });
    return response;
  }
};
