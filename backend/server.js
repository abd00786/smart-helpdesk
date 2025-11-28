import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { createRedisClient, getRedisClient, isRedisConnected } from "./config/redis.js";

import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import diagnosticsRoutes from "./routes/diagnostics.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

dotenv.config();

// Initialize services
connectDB();
await createRedisClient();

const app = express();

// CORS Configuration - read from environment variable
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:5173").split(",").map(origin => origin.trim());

const corsOptions = {
  origin: corsOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

console.log("✓ CORS configured for origins:", corsOrigins);

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  const mongodbStatus = 
    mongoose.connection.readyState === 1 ? "connected" : 
    mongoose.connection.readyState === 0 ? "disconnected" :
    mongoose.connection.readyState === 2 ? "connecting" :
    "unknown";

  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      mongodb: mongodbStatus,
      redis: isRedisConnected() ? "connected" : "disconnected",
    },
  };

  res.status(200).json(health);
});

// Cache diagnostics endpoint
app.get("/api/cache-stats", async (req, res) => {
  if (!isRedisConnected()) {
    return res.status(503).json({ error: "Redis not connected", status: "unavailable" });
  }

  try {
    const redis = getRedisClient();
    const stats = await redis.info("stats");
    const keys = await redis.keys("*");
    res.json({
      connected: true,
      keyCount: keys.length,
      sampleKeys: keys.slice(0, 10),
      stats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/diagnostics", diagnosticsRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`✓ API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`✓ Cache Stats: http://localhost:${PORT}/api/cache-stats\n`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n⏸ Shutting down gracefully...");
  
  if (isRedisConnected()) {
    const redis = getRedisClient();
    await redis.quit();
    console.log("✓ Redis disconnected");
  }

  server.close(() => {
    console.log("✓ Server closed");
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.error("✗ Forced shutdown");
    process.exit(1);
  }, 10000);
});
