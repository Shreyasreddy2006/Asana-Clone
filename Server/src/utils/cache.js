const { createClient } = require('redis');

let redisClient = null;
let isConnected = false;

// Initialize Redis connection
const initRedis = async () => {
  try {
    // Only use Redis in production or if explicitly enabled
    if (process.env.NODE_ENV !== 'production' && process.env.REDIS_ENABLED !== 'true') {
      console.log('Redis disabled in development mode');
      return null;
    }

    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    redisClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.log('Redis max reconnection attempts reached');
            return new Error('Redis max reconnection attempts reached');
          }
          return retries * 100;
        }
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
      isConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('Redis client connected');
      isConnected = true;
    });

    redisClient.on('disconnect', () => {
      console.log('Redis client disconnected');
      isConnected = false;
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error.message);
    redisClient = null;
    isConnected = false;
    return null;
  }
};

// Get cached data
const getCache = async (key) => {
  if (!redisClient || !isConnected) {
    return null;
  }

  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

// Set cached data with expiration (in seconds)
const setCache = async (key, data, expirationInSeconds = 3600) => {
  if (!redisClient || !isConnected) {
    return false;
  }

  try {
    await redisClient.setEx(key, expirationInSeconds, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
};

// Delete cached data
const deleteCache = async (key) => {
  if (!redisClient || !isConnected) {
    return false;
  }

  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
};

// Delete multiple keys matching a pattern
const deleteCachePattern = async (pattern) => {
  if (!redisClient || !isConnected) {
    return false;
  }

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    console.error('Cache pattern delete error:', error);
    return false;
  }
};

// Clear all cache
const clearCache = async () => {
  if (!redisClient || !isConnected) {
    return false;
  }

  try {
    await redisClient.flushAll();
    return true;
  } catch (error) {
    console.error('Cache clear error:', error);
    return false;
  }
};

// Cache middleware for Express routes
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    if (!redisClient || !isConnected) {
      return next();
    }

    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create cache key from URL and query params
    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedData = await getCache(key);

      if (cachedData) {
        return res.json(cachedData);
      }

      // Store original res.json function
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = (data) => {
        setCache(key, data, duration);
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Helper to invalidate cache for specific resources
const invalidateCache = {
  // Invalidate workspace-related cache
  workspace: async (workspaceId) => {
    await deleteCachePattern(`cache:*/workspaces/${workspaceId}*`);
    await deleteCachePattern(`cache:*/workspaces?*`);
  },

  // Invalidate project-related cache
  project: async (projectId, workspaceId) => {
    await deleteCachePattern(`cache:*/projects/${projectId}*`);
    await deleteCachePattern(`cache:*/projects?*`);
    if (workspaceId) {
      await deleteCachePattern(`cache:*/workspaces/${workspaceId}*`);
    }
  },

  // Invalidate task-related cache
  task: async (taskId, projectId) => {
    await deleteCachePattern(`cache:*/tasks/${taskId}*`);
    await deleteCachePattern(`cache:*/tasks?*`);
    if (projectId) {
      await deleteCachePattern(`cache:*/projects/${projectId}*`);
    }
  },

  // Invalidate team-related cache
  team: async (teamId, workspaceId) => {
    await deleteCachePattern(`cache:*/teams/${teamId}*`);
    await deleteCachePattern(`cache:*/teams?*`);
    if (workspaceId) {
      await deleteCachePattern(`cache:*/workspaces/${workspaceId}*`);
    }
  },

  // Invalidate user-related cache
  user: async (userId) => {
    await deleteCachePattern(`cache:*/users/${userId}*`);
    await deleteCachePattern(`cache:*/auth/me*`);
  }
};

// Close Redis connection
const closeRedis = async () => {
  if (redisClient && isConnected) {
    await redisClient.quit();
    console.log('Redis connection closed');
  }
};

module.exports = {
  initRedis,
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern,
  clearCache,
  cacheMiddleware,
  invalidateCache,
  closeRedis,
  getClient: () => redisClient,
  isConnected: () => isConnected
};
