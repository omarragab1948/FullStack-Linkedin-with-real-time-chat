export const dynamic = "force-dynamic"; // defaults to auto

import connectToMongoDB from "@/app/utils/connectDB";
import { Job } from "@/app/utils/models";

export const GET = async (request) => {
  connectToMongoDB();
  const jobs = await Job.find().sort({ _id: -1 });
  if (jobs.length === 0) {
    return Response.json({ message: "No Jobs found", status: 200 });
  }
  const response = Response.json({
    data: jobs,
    status: 200,
  });
  return response;
};
