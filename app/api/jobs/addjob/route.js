import { verifyToken } from "@/app/utils/handleToken";
import { Job, User } from "@/app/utils/models";

export const POST = async (request) => {
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
      status: 401,
    });
  }

  const job = await request.json();
  console.log(job);
  // Validate the job data
  if (
    !job ||
    !job.title ||
    !job.providerId ||
    !job.date ||
    !job.place ||
    !job.providerName ||
    !job.providerImage ||
    !job.description ||
    !job.providerTitle
  ) {
    return Response.json({
      error: "Invalid job data. Please provide all required fields.",
      status: 400,
    });
  }

  try {
    await Job.create(job);
    return Response.json({
      message: "Job successfully created",
      status: 201,
    });
  } catch (err) {
    // Log the error to the console for debugging purposes
    console.error("Error creating job:", err);

    return Response.json({
      error: "Unable to add job",
      status: 500, // Internal Server Error
    });
  }
};
