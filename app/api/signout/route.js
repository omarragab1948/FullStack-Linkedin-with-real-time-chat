import { NextResponse } from "next/server";

export const POST = async (request) => {
  const cookiesStore = request.cookies.get("token");
  if (!cookiesStore) {
    return Response.json({ status: 204 });
  }
  const response = NextResponse.json({
    message: "Log out successful",
    status: 200,
  });
  response.cookies.delete("token");
  return response;
};
