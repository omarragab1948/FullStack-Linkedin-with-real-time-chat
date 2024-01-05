import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    // Replace 'YOUR_CONNECTION_STRING' with your actual MongoDB connection string
    const Url = process.env.MONGO_URL;

    await mongoose.connect(Url);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectToMongoDB;
