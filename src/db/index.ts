import mongoose from "mongoose";

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error("❌ MongoDB URI is not defined in environment variables.");
  }

  await mongoose.connect(mongoURI);

  console.log("✅ MongoDB connected successfully");
};

export default connectDB;
