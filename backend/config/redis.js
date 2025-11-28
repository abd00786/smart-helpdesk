import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

// If no REDIS_URL exists, run without redis
const redisUrl = process.env.REDIS_URL;

let redisClient = null;

try {
  if (redisUrl) {
    redisClient = createClient({ url: redisUrl });

    redisClient.on("error", (err) => {
      console.error("Redis Error:", err.message);
    });

    await redisClient.connect().catch((err) => {
      console.warn("⚠️ Redis failed, continuing without cache:", err.message);
      redisClient = null; // disable redis safely
    });

    if (redisClient) {
      console.log("✓ Redis Connected");
    }
  } else {
    console.warn("⚠️ No REDIS_URL found. Running without Redis cache.");
  }
} catch (err) {
  console.warn("⚠️ Redis init failed:", err.message);
  redisClient = null;
}

export default redisClient;
