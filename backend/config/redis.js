import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("Redis max retries exceeded");
        return new Error("Redis max retries exceeded");
      }
      return retries * 50;
    },
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.on("connect", () => console.log("✓ Redis connected"));
redisClient.on("ready", () => console.log("✓ Redis ready"));

// Connect to Redis
await redisClient.connect().catch((err) => {
  console.warn("⚠️ Redis connection failed. Running without cache:", err.message);
});

export default redisClient;
