import { getRedisClient, isRedisConnected } from "../config/redis.js";

// Cache key constants
export const CACHE_KEYS = {
  TICKETS_ALL: "tickets:all",
  TICKET_BY_ID: (id) => `ticket:${id}`,
  TICKETS_BY_USER: (userId) => `tickets:user:${userId}`,
  TICKETS_BY_STATUS: (status) => `tickets:status:${status}`,
  ANALYTICS: "analytics:all",
  ANALYTICS_USER: (userId) => `analytics:user:${userId}`,
};

// Cache key generator functions
export const getCacheKeys = {
  ticketsList: (filterString) => `tickets:list:${filterString}`,
  ticketDetail: (id) => `ticket:${id}`,
  userTickets: (userId) => `tickets:user:${userId}`,
  ticketsByStatus: (status) => `tickets:status:${status}`,
  analytics: () => `analytics:all`,
  userAnalytics: (userId) => `analytics:user:${userId}`,
};

// Default TTL values (in seconds)
const DEFAULT_TTL = {
  TICKETS: 300, // 5 minutes
  SINGLE_TICKET: 600, // 10 minutes
  ANALYTICS: 900, // 15 minutes
  USER_DATA: 1800, // 30 minutes
};

/**
 * Set cache data with TTL
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in seconds (optional)
 * @returns {Promise<boolean>} - Success status
 */
export const setCacheData = async (key, data, ttl = DEFAULT_TTL.TICKETS) => {
  if (!isRedisConnected()) {
    return false;
  }

  try {
    const redis = getRedisClient();
    const serializedData = JSON.stringify(data);
    await redis.setEx(key, ttl, serializedData);
    return true;
  } catch (error) {
    console.warn(`⚠ Cache set error for key ${key}:`, error.message);
    return false;
  }
};

/**
 * Get cache data
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} - Cached data or null
 */
export const getCacheData = async (key) => {
  if (!isRedisConnected()) {
    return null;
  }

  try {
    const redis = getRedisClient();
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn(`⚠ Cache get error for key ${key}:`, error.message);
    return null;
  }
};

/**
 * Delete cache data
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} - Success status
 */
export const deleteCacheData = async (key) => {
  if (!isRedisConnected()) {
    return false;
  }

  try {
    const redis = getRedisClient();
    await redis.del(key);
    return true;
  } catch (error) {
    console.warn(`⚠ Cache delete error for key ${key}:`, error.message);
    return false;
  }
};

/**
 * Delete cache data by pattern (e.g., "tickets:*")
 * @param {string} pattern - Cache key pattern
 * @returns {Promise<number>} - Number of keys deleted
 */
export const invalidateCachePattern = async (pattern) => {
  if (!isRedisConnected()) {
    return 0;
  }

  try {
    const redis = getRedisClient();
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
    return keys.length;
  } catch (error) {
    console.warn(`⚠ Cache pattern invalidation error for ${pattern}:`, error.message);
    return 0;
  }
};

/**
 * Clear all cache
 * @returns {Promise<boolean>} - Success status
 */
export const clearAllCache = async () => {
  if (!isRedisConnected()) {
    return false;
  }

  try {
    const redis = getRedisClient();
    await redis.flushDb();
    console.log("✓ All cache cleared");
    return true;
  } catch (error) {
    console.warn("⚠ Cache clear error:", error.message);
    return false;
  }
};

/**
 * Get cache statistics
 * @returns {Promise<object>} - Cache stats
 */
export const getCacheStats = async () => {
  if (!isRedisConnected()) {
    return { connected: false, stats: null };
  }

  try {
    const redis = getRedisClient();
    const info = await redis.info("stats");
    const keys = await redis.keys("*");
    return {
      connected: true,
      keyCount: keys.length,
      info,
    };
  } catch (error) {
    console.warn("⚠ Cache stats error:", error.message);
    return { connected: false, error: error.message };
  }
};
