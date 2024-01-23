import connectToMongoDB from "@/app/utils/connectDB";
import { User } from "@/app/utils/models";
import bcrypt from "bcryptjs";

export const POST = async (request) => {
  try {
    const { email, password, firstName, lastName } = await request.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format", status: 400 });
    }

    // Validate password strength (at least 8 characters)
    if (!password || password.length < 8) {
      return Response.json({
        error: "Password must be at least 8 characters long",
        status: 400,
      });
    }

    // Validate required fields
    if (!firstName || !lastName) {
      return Response.json({
        error: "Invalid first name or last name",
        status: 400,
      });
    }
    connectToMongoDB();

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return Response.json({
        error: "User with this email already exists",
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      status: "offline",
      profileImage:
        "https://firebasestorage.googleapis.com/v0/b/fullstack-linkedin.appspot.com/o/images%2FprofileImage%2F1ffc6940-9093-4999-aa5b-1ddbe76eff96?alt=media&token=d43c94cf-a130-4573-bf9a-246f71581744",
    };
    const createdUser = await User.create(user);
    const response = Response.json({
      data: "User created successfully",
      status: 201,
    });

    return response;
  } catch (error) {
    console.error("Error during signup:", error);

    // Respond with an error status and message
    const response = Response.json({
      error: "Error during signup",
      status: 500,
    });

    return response;
  }
};
