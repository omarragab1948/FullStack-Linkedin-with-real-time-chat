import jwt from "jsonwebtoken";

const jwtKey = process.env.JWT_SECRET_KEY;

export const handleToken = async (userId) => {
  const token = jwt.sign({ userId }, jwtKey, {
    expiresIn: "1d",
  });
  return token;
};

export const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, jwtKey);
    return decoded.userId;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
};
