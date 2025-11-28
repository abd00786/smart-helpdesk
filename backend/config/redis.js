import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

let redisClient = null;
let redisConnected = false;

const createRedisClient = async () => {
  try {
    const redisUrl = process.env.REDIS_URL;
    
    // Support both Upstash URL format and traditional Redis config
    if (redisUrl) {
      // Upstash format: rediss://default:password@host:port
      redisClient = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => Math.min(retries * 50, 500),
          tls: redisUrl.startsWith("rediss://") ? true : false,
        },
      });
    } else {
      // Fallback to traditional Redis connection
      const host = process.env.REDIS_HOST || "localhost";
      const port = parseInt(process.env.REDIS_PORT || "6379");
      const password = process.env.REDIS_PASSWORD;

      redisClient = createClient({
        socket: {
          host,
          port,
          reconnectStrategy: (retries) => Math.min(retries * 50, 500),
        },
        password,
      });
    }

    redisClient.on("error", (err) => {
      console.error("Redis Client Error", err);
      redisConnected = false;
    });

    redisClient.on("connect", () => {
      console.log("✓ Redis connected successfully");
      redisConnected = true;
    });

    redisClient.on("ready", () => {
      console.log("✓ Redis ready");
    });

    redisClient.on("reconnecting", () => {
      console.warn("⚠ Redis reconnecting...");
    });

    await redisClient.connect();
    redisConnected = true;
  } catch (error) {
    console.warn("⚠ Redis connection failed:", error.message);
    console.warn("⚠ Proceeding without Redis caching");
    redisConnected = false;
    // Don't throw - allow app to run without Redis
  }
};

const getRedisClient = () => {
  return redisClient;
};

const isRedisConnected = () => {
  return redisConnected;
};

export { createRedisClient, getRedisClient, isRedisConnected };
