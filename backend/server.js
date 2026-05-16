import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes Mount Matrix
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// Global Error Handling Middleware Wrapper
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res
    .status(statusCode)
    .json({ message: err.message || "Internal Server Error" });
});

//  Only open a port if this file is run directly, not imported by tests
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      app.listen(process.env.PORT || 5000, () => {
        console.log(
          ` Marketplace server running on port ${process.env.PORT || 5000}`,
        );
      });
    })
    .catch((err) => console.error("Database connection failed:", err));
}

// Export the app instance cleanly for Jest/Supertest
export default app;
