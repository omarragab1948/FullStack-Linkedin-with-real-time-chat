export const POST = async (request) => {
  console.log("Hello");
  return Response.json({
    data: "Hello",
    status: 200,
  });
};
