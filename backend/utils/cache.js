import redisClient from "../config/redis.js";

const CACHE_EXPIRY = 3600; // 1 hour default

export const setCacheData = async (key, data, expiry = CACHE_EXPIRY) => {
  try {
    if (!redisClient.isOpen) return false;
    await redisClient.setEx(key, expiry, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Cache set error:", error);
    return false;
  }
};

export const getCacheData = async (key) => {
  try {
    if (!redisClient.isOpen) return null;
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Cache get error:", error);
    return null;
  }
};

export const deleteCacheData = async (key) => {
  try {
    if (!redisClient.isOpen) return false;
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error("Cache delete error:", error);
    return false;
  }
};

export const invalidateCachePattern = async (pattern) => {
  try {
    if (!redisClient.isOpen) return false;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    console.error("Cache invalidation error:", error);
    return false;
  }
};

// Cache key generators
export const getCacheKeys = {
  ticketsList: (filters = "") => `tickets:list:${filters}`,
  ticketDetail: (id) => `ticket:${id}`,
  ticketComments: (id) => `ticket:${id}:comments`,
  ticketActivities: (id) => `ticket:${id}:activities`,
  analyticsStats: () => "analytics:stats",
  analyticsSLA: () => "analytics:sla",
  analyticsTrends: () => "analytics:trends",
  analyticsHeatmap: () => "analytics:heatmap",
  userProfile: (id) => `user:${id}`,
};
