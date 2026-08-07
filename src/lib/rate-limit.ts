import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Rate limiters for different endpoints
export const rateLimiters = {
  // 5 submissions per hour per IP (public leads capture)
  leads: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: true,
    prefix: "rl:leads",
  }),

  // 3 submissions per hour per IP (contact form)
  contact: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    analytics: true,
    prefix: "rl:contact",
  }),

  // 20 proposals per hour per user (authenticated)
  proposals: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(20, "1 h"),
    analytics: true,
    prefix: "rl:proposals",
  }),

  // 100 messages per hour per user (authenticated)
  messages: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(100, "1 h"),
    analytics: true,
    prefix: "rl:messages",
  }),
};

/**
 * Extract IP from request headers (handles proxies like Vercel)
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(", ")[0] : "unknown";
  return ip;
}

/**
 * Check if request is rate limited
 * Returns { success: boolean, remaining: number, reset: number }
 */
export async function checkRateLimit(
  limiter: Ratelimit,
  key: string
): Promise<{ success: boolean; remaining: number; reset: number }> {
  try {
    const result = await limiter.limit(key);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // Fail open: if Redis is down, allow request but log it
    return { success: true, remaining: -1, reset: 0 };
  }
}

/**
 * Middleware helper: return 429 if rate limited
 */
export function rateLimitResponse(reset: number) {
  return Response.json(
    {
      error: "Too many requests. Please try again later.",
      retry_after_seconds: Math.ceil((reset - Date.now()) / 1000),
    },
    { status: 429 }
  );
}
