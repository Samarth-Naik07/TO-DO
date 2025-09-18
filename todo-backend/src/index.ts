import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import dotenv from "dotenv"; // ✅ import dotenv




import taskRoutes from "./routes/taskRoutes.js";

dotenv.config(); // ✅ load .env file

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/tasks", taskRoutes);

// MongoDB connection
const mongoUrl = process.env.MONGO_URL as string; // ✅ cast to string

if (!mongoUrl) {
  throw new Error("❌ MONGO_URL is not defined in .env file");
}

mongoose
  .connect(mongoUrl)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

