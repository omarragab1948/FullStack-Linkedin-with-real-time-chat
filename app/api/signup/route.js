// import connectToMongoDB from "@/app/utils/connectDB";
// import { User } from "@/app/utils/models";
// import bcrypt from "bcryptjs";

// export const POST = async (request) => {
//   try {
//     const { email, password, firstName, lastName } = await request.json();

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email || !emailRegex.test(email)) {
//       return Response.json({ error: "Invalid email format", status: 400 });
//     }

//     // Validate password strength (at least 8 characters)
//     if (!password || password.length < 8) {
//       return Response.json({
//         error: "Password must be at least 8 characters long",
//         status: 400,
//       });
//     }

//     // Validate required fields
//     if (!firstName || !lastName) {
//       return Response.json({
//         error: "Invalid first name or last name",
//         status: 400,
//       });
//     }
//     connectToMongoDB();
//     console.log(email, password, firstName, lastName);

//     const existingUser = await User.findOne({ email: email });
//     console.log(existingUser);
//     if (existingUser) {
//       return Response.json({
//         error: "User with this email already exists",
//         status: 400,
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = {
//       email: email,
//       password: hashedPassword,
//       firstName: firstName,
//       lastName: lastName,
//     };
//     const createdUser = await User.create(user);
//     const response = Response.json({
//       data: "User created successfully",
//       status: 201,
//     });

//     return response;
//   } catch (error) {
//     console.error("Error during signup:", error);

//     // Respond with an error status and message
//     const response = Response.json({
//       error: "Error during signup",
//       status: 500,
//     });

//     return response;
//   }
// };
import connectToMongoDB from "@/app/utils/connectDB";
import { User } from "@/app/utils/models";
import bcrypt from "bcryptjs";

export const POST = async (request) => {
  try {
    const { email, password, firstName, lastName, google, profileImage } =
      await request.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format", status: 400 });
    }

    // Validate password strength (at least 8 characters)
    if (!google && (!password || password.length < 8)) {
      return Response.json({
        error: "Password must be at least 8 characters long",
        status: 400,
      });
    }

    // Validate required fields
    if (!google && (!firstName || !lastName)) {
      return Response.json({
        error: "Invalid first name or last name",
        status: 400,
      });
    }

    connectToMongoDB();
    console.log(email, password, firstName, lastName);

    const existingUser = await User.findOne({ email: email });
    console.log(existingUser);

    if (existingUser) {
      return Response.json({
        data: "User with this email already exists",
        status: 400,
      });
    }

    let user;

    if (google) {
      // If signing up with Google, create a user without a password
      user = {
        email: email,
        firstName: firstName,
        profileImage: profileImage,
        // Add other Google-related fields if needed
      };
    } else {
      // If signing up with email/password, hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      user = {
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
      };
    }

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
