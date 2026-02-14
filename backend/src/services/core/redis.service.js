import Redis from "ioredis";
import { conf } from "../../configs/env.js";
import logger from "../../utils/logger.js";

class InMemoryRedis {
  constructor() {
    this.store = new Map();
    this.status = "ready";
    logger.info("In-Memory Cache initialized (Redis fallback)");
  }

  async get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key, value, mode, duration) {
    const expiry = mode === "EX" ? Date.now() + duration * 1000 : null;
    this.store.set(key, { value, expiry });
    return "OK";
  }

  async del(key) {
    if (Array.isArray(key)) {
      key.forEach((k) => this.store.delete(k));
    } else {
      this.store.delete(key);
    }
    return 1;
  }

  async keys(pattern) {
    if (!pattern) return [];
    const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
    const keys = [];
    for (const key of this.store.keys()) {
      if (regex.test(key)) keys.push(key);
    }
    return keys;
  }
}

class RedisService {
  constructor() {
    // Check for explicit memory mode or missing URL
    if (conf.redisUrl === "memory") {
      this.client = new InMemoryRedis();
      return;
    }

    // Only initialize if a URL is provided (default is localhost)
    if (conf.redisUrl) {
      this.client = new Redis(conf.redisUrl, {
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 1, // Fail fast if invoked while disconnected
      });

      this.client.on("connect", () => {
        logger.info("Redis connected");
      });

      this.client.on("error", (err) => {
        // Suppress connection refused logs to 1 per minute or just warn once
        if (err.code === "ECONNREFUSED") {
          const now = Date.now();
          if (!this.lastLog || now - this.lastLog > 60000) {
            logger.warn(
              "Redis connection failed (switching to in-memory mode temporarily)",
              { error: err.message },
            );
            try {
              this.client.disconnect();
            } catch (e) {
              /* ignore */
            }
            this.client = new InMemoryRedis();
            this.lastLog = now;
          }
        } else {
          logger.error("Redis error:", { error: err.message });
        }
      });
    } else {
      logger.warn("Redis URL not provided. Caching disabled.");
    }
  }

  /**
   * Get cached data or fetch fresh data and cache it
   * @param {string} key Cache key
   * @param {function} fetchCallback Function to fetch data if cache miss
   * @param {number} ttl Time to live in seconds (default 60)
   */
  async getOrSetCache(key, fetchCallback, ttl = 60) {
    if (!this.client || this.client.status !== "ready") {
      return await fetchCallback();
    }

    try {
      const cachedData = await this.client.get(key);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const freshData = await fetchCallback();
      if (freshData !== undefined && freshData !== null) {
        await this.client.set(key, JSON.stringify(freshData), "EX", ttl);
      }
      return freshData;
    } catch (error) {
      logger.error(`Redis Error for key ${key}:`, { error: error.message });
      // Fallback to fetching fresh data if Redis fails
      return await fetchCallback();
    }
  }

  /**
   * Clear cache for a specific key
   */
  async clearCache(key) {
    if (this.client) {
      await this.client.del(key);
    }
  }

  /**
   * Clear multiple keys by pattern (SLOW operation, use carefully)
   */
  async clearPattern(pattern) {
    if (this.client) {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    }
  }
}

export default new RedisService();
