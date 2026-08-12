import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

// Rate limiting helper
export async function checkRateLimit(key: string, limit: number = 100, window: number = 60) {
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, window);
  }

  return count <= limit;
}

// Cache helper
export async function getOrSet<T>(
  key: string,
  fallback: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  const cached = await redis.get<T>(key);

  if (cached) {
    return cached;
  }

  const data = await fallback();
  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
}

// Clear cache pattern
export async function clearPattern(pattern: string) {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
