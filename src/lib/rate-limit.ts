import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createLocalLimiter } from "@/lib/local-rate-limit";

type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

type RateLimiterLike = {
  limit: (key: string) => Promise<RateLimitResult>;
};

type RateLimitWindow = Parameters<typeof Ratelimit.slidingWindow>[1];

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

function createLimiter(prefix: string, requests: number, window: RateLimitWindow, windowMs = 3600000): RateLimiterLike {
  const local = createLocalLimiter(requests, windowMs);
  if (!redis) return local;
  const distributed = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
    prefix,
  });
  return { async limit(key) {
    const fallback = await local.limit(key);
    if (!fallback.success) return fallback;
    try { return await distributed.limit(key); }
    catch { console.error('Distributed rate limit unavailable; local limit applied.'); return fallback; }
  } };
}

// Redis enforces across instances; the bounded local fallback protects each
// instance when Redis is absent or unavailable. It is not a global quota.
export const rateLimiters = {
  login: createLimiter("rl:login", 10, "1 m", 60000),
  register: createLimiter("rl:register", 5, "1 h"),
  recovery: createLimiter("rl:recovery", 3, "1 h"),
  checkout: createLimiter("rl:checkout", 12, "1 h"),
  projects: createLimiter("rl:projects", 12, "1 h"),
  leads: createLimiter("rl:leads", 5, "1 h"),
  contact: createLimiter("rl:contact", 3, "1 h"),
  proposals: createLimiter("rl:proposals", 20, "1 h"),
  messages: createLimiter("rl:messages", 100, "1 h"),
  ai: createLimiter("rl:ai", 20, "1 h"),
};

/** Extract IP from request headers, including proxies such as Vercel. */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0].trim().slice(0, 80) || "unknown";
}

/** Never allow an unexpected limiter failure to bypass the write limit. */
export async function checkRateLimit(
  limiter: RateLimiterLike,
  key: string,
): Promise<RateLimitResult> {
  try {
    return await limiter.limit(key);
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return { success: false, remaining: 0, reset: Date.now() + 60000 };
  }
}

export function rateLimitResponse(reset: number) {
  return Response.json(
    {
      error: "Muitas tentativas. Aguarde um pouco e tente novamente.",
      retry_after_seconds: Math.max(0, Math.ceil((reset - Date.now()) / 1000)),
    },
    { status: 429, headers: { 'Retry-After': String(Math.max(1, Math.ceil((reset - Date.now()) / 1000))), 'Cache-Control': 'no-store' } },
  );
}
