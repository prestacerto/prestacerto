import { Redis } from "@upstash/redis";

let redisClient: Redis | null = null;

function getRedis(): Redis | null {
  const url = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.REDIS_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;
  return (redisClient ??= new Redis({ url, token }));
}

// Rate limiting helper. Without Redis, fail open until the production cache is configured.
export async function checkRateLimit(key: string, limit: number = 100, window: number = 60) {
  const redis = getRedis();
  if (!redis) return true;

  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, window);
    return count <= limit;
  } catch (error) {
    console.error("Redis rate limit failed:", error);
    return true;
  }
}

// Cache helper. Without Redis, execute the fallback directly.
export async function getOrSet<T>(
  key: string,
  fallback: () => Promise<T>,
  ttl: number = 300,
): Promise<T> {
  const redis = getRedis();
  if (!redis) return fallback();

  try {
    const cached = await redis.get<T>(key);
    if (cached) return cached;

    const data = await fallback();
    await redis.setex(key, ttl, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Redis cache failed:", error);
    return fallback();
  }
}

export async function clearPattern(pattern: string) {
  const redis = getRedis();
  if (!redis) return;

  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  } catch (error) {
    console.error("Redis clear pattern failed:", error);
  }
}
