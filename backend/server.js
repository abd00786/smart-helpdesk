import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import redisClient from "./config/redis.js";

import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import diagnosticsRoutes from "./routes/diagnostics.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

dotenv.config();
connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(",") || [
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// 🔥 REQUIRED FOR BACK4APP — handles preflight (OPTIONS)
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 🔥 BACK4APP CORS PATCH (adds correct headers manually)
app.use((req, res, next) => {
  const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/diagnostics", diagnosticsRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful shutdown
process.on("SIGINT", async () => {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
  }
  process.exit(0);
});
