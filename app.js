import express from "express";
import errorMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";

import { formatDate } from "./utils/date.js";
import startupRoute from "./routes/startup.routes.js";
import imageRoute from "./routes/image.routes.js";
import userRoute from "./routes/user.routes.js";
// Load environment variables
config();

const app = express();


// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
  origin: ["*", "http://localhost:5173","https://forge-admin-eight.vercel.app","http://127.0.0.1:5500","https://sujan14728.github.io"],
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT"],
}));
app.use(morgan("dev"));

// Routes
app.use("/api/v1/startup", startupRoute);
app.use("/api/v1/image", imageRoute);
app.use("/api/v1/auth", userRoute);


// Function to format the date


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Forge Backend ",
    author: "NeonShark",
    developer: "Sandip Sapkota",
    date: formatDate(new Date()), // Formatted date
    // Dynamic health status
  });
});


// Error handling middleware
app.use(errorMiddleware);

export default app;
