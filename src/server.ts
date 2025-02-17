import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import userRoutes from "./routes/users";
import postRoutes from "./routes/posts";
import authRoutes from "./routes/auth";
import connectDB from "./db";

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/auth", authRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("❌ Failed to start server: ", error);
    process.exit(1);
  }
};

startServer();
