import "server-only";

import { createServiceClient } from "@/lib/supabase/service";

export type AiMeteringContext = {
  project?: string;
  product: string;
  organizationId?: string | null;
  accountId?: string | null;
  userId?: string | null;
  metadata?: Record<string, unknown>;
};

export type AiTokenUsage = {
  inputTokens: number;
  cachedInputTokens?: number;
  outputTokens: number;
  totalTokens?: number;
};

type Price = {
  inputUsdPerMillion: number;
  cachedInputUsdPerMillion: number;
  outputUsdPerMillion: number;
  source: string;
};

const DEFAULT_PRICES: Array<{ provider: string; pattern: RegExp; price: Price }> = [
  { provider: "openai", pattern: /^gpt-4o-mini(?:-|$)/, price: { inputUsdPerMillion: 0.15, cachedInputUsdPerMillion: 0.075, outputUsdPerMillion: 0.6, source: "built-in" } },
  { provider: "anthropic", pattern: /^claude-(?:3-5-)?sonnet(?:-|$)/, price: { inputUsdPerMillion: 3, cachedInputUsdPerMillion: 3, outputUsdPerMillion: 15, source: "built-in" } },
];

let priceCache: { expiresAt: number; rows: Array<Record<string, unknown>> } | null = null;

function finiteTokenCount(value: unknown) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
}

function wildcardMatches(pattern: string, model: string) {
  if (pattern.endsWith("%")) return model.startsWith(pattern.slice(0, -1));
  return pattern === model;
}

async function resolvePrice(provider: string, model: string): Promise<Price | null> {
  const envPrices = process.env.AI_MODEL_PRICES_JSON;
  if (envPrices) {
    try {
      const configured = JSON.parse(envPrices) as Record<string, Partial<Price>>;
      const candidate = configured[`${provider}:${model}`] ?? configured[model];
      if (candidate && Number.isFinite(candidate.inputUsdPerMillion) && Number.isFinite(candidate.outputUsdPerMillion)) {
        return {
          inputUsdPerMillion: Number(candidate.inputUsdPerMillion),
          cachedInputUsdPerMillion: Number(candidate.cachedInputUsdPerMillion ?? candidate.inputUsdPerMillion),
          outputUsdPerMillion: Number(candidate.outputUsdPerMillion),
          source: "environment",
        };
      }
    } catch (error) {
      console.error("[ai-metering] AI_MODEL_PRICES_JSON inválido:", error);
    }
  }

  try {
    if (!priceCache || priceCache.expiresAt < Date.now()) {
      const service = createServiceClient();
      const { data, error } = await service
        .from("ai_model_prices")
        .select("provider, model_pattern, input_usd_per_million, cached_input_usd_per_million, output_usd_per_million, effective_from")
        .is("effective_to", null)
        .lte("effective_from", new Date().toISOString())
        .order("effective_from", { ascending: false });
      if (error) throw error;
      priceCache = { rows: (data ?? []) as Array<Record<string, unknown>>, expiresAt: Date.now() + 5 * 60_000 };
    }

    const row = priceCache.rows.find((item) => item.provider === provider && wildcardMatches(String(item.model_pattern), model));
    if (row) {
      return {
        inputUsdPerMillion: Number(row.input_usd_per_million),
        cachedInputUsdPerMillion: Number(row.cached_input_usd_per_million),
        outputUsdPerMillion: Number(row.output_usd_per_million),
        source: "database",
      };
    }
  } catch (error) {
    console.error("[ai-metering] Não foi possível consultar preços; usando fallback:", error);
  }

  return DEFAULT_PRICES.find((entry) => entry.provider === provider && entry.pattern.test(model))?.price ?? null;
}

export async function recordAiUsage(input: {
  provider: "openai" | "anthropic" | string;
  model: string;
  requestId: string;
  usage: AiTokenUsage;
  context: AiMeteringContext;
  metadata?: Record<string, unknown>;
}) {
  const inputTokens = finiteTokenCount(input.usage.inputTokens);
  const cachedInputTokens = Math.min(inputTokens, finiteTokenCount(input.usage.cachedInputTokens));
  const outputTokens = finiteTokenCount(input.usage.outputTokens);
  const totalTokens = finiteTokenCount(input.usage.totalTokens) || inputTokens + outputTokens;
  const price = await resolvePrice(input.provider, input.model);
  const uncachedInputTokens = inputTokens - cachedInputTokens;
  const estimatedCostUsd = price
    ? (uncachedInputTokens * price.inputUsdPerMillion + cachedInputTokens * price.cachedInputUsdPerMillion + outputTokens * price.outputUsdPerMillion) / 1_000_000
    : 0;

  try {
    const service = createServiceClient();
    const { error } = await service.from("ai_usage_events").upsert({
      project: input.context.project ?? "prestacerto",
      product: input.context.product,
      organization_id: input.context.organizationId ?? null,
      account_id: input.context.accountId ?? null,
      user_id: input.context.userId ?? null,
      request_id: input.requestId,
      provider: input.provider,
      model: input.model,
      input_tokens: inputTokens,
      cached_input_tokens: cachedInputTokens,
      output_tokens: outputTokens,
      total_tokens: totalTokens,
      estimated_cost_usd: estimatedCostUsd,
      pricing_source: price?.source ?? "unpriced",
      metadata: { ...input.context.metadata, ...input.metadata },
    }, { onConflict: "provider,request_id", ignoreDuplicates: true });
    if (error) throw error;
  } catch (error) {
    // Observabilidade nunca deve derrubar a funcionalidade paga pelo usuário.
    console.error("[ai-metering] Falha ao persistir uso:", error);
  }

  return { estimatedCostUsd, pricingSource: price?.source ?? "unpriced" };
}

export function openAiUsage(response: {
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number; prompt_tokens_details?: { cached_tokens?: number } };
}): AiTokenUsage {
  return {
    inputTokens: response.usage?.prompt_tokens ?? 0,
    cachedInputTokens: response.usage?.prompt_tokens_details?.cached_tokens ?? 0,
    outputTokens: response.usage?.completion_tokens ?? 0,
    totalTokens: response.usage?.total_tokens,
  };
}

export function anthropicUsage(message: {
  usage?: { input_tokens?: number | null; output_tokens?: number | null; cache_read_input_tokens?: number | null; cache_creation_input_tokens?: number | null };
}): AiTokenUsage {
  const cached = message.usage?.cache_read_input_tokens ?? 0;
  const cacheCreation = message.usage?.cache_creation_input_tokens ?? 0;
  return {
    inputTokens: (message.usage?.input_tokens ?? 0) + cached + cacheCreation,
    cachedInputTokens: cached,
    outputTokens: message.usage?.output_tokens ?? 0,
  };
}
