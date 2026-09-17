/**
 * OpenAI Service Initialization
 * Run this at app startup to initialize the AI service
 */

import { initOpenAIService, type AIServiceConfig } from "@/lib/openai-service";

let isInitialized = false;

export function initializeAIService(): void {
  if (isInitialized) return;

  const config: AIServiceConfig = {
    apiKey: process.env.ANTHROPIC_API_KEY || "",
    redisUrl: process.env.UPSTASH_REDIS_REST_URL,
    redisToken: process.env.UPSTASH_REDIS_REST_TOKEN,
    cacheTTL: 3600, // 1 hour
  };

  if (!config.apiKey) {
    console.warn(
      "[OpenAI] ANTHROPIC_API_KEY not set - AI features will be disabled"
    );
    return;
  }

  initOpenAIService(config);
  isInitialized = true;

  console.log(
    "[OpenAI] Service initialized",
    config.redisUrl ? "with Redis caching" : "without caching"
  );
}

// Auto-initialize on module load
if (typeof window === "undefined") {
  initializeAIService();
}
