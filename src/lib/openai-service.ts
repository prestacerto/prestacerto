/**
 * OpenAI Integration Service
 * Typed prompts, caching, error handling para Insights, Badge, Portfolio, Contrato
 *
 * Products:
 * - Insights: Market intelligence com trends de skills
 * - Badge: Badges verificados
 * - Portfolio: Portfolio showcase com IA
 * - Contrato: Geração de contra-propostas com IA
 */

import { Anthropic } from "@anthropic-ai/sdk";
import { Redis } from "@upstash/redis";
import { Logger } from "winston";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type AIProductType = "insights" | "badge" | "portfolio" | "contrato";

export interface AIServiceConfig {
  apiKey: string;
  redisUrl?: string;
  redisToken?: string;
  cacheTTL?: number; // seconds
  logger?: Logger;
}

export interface InsightsInput {
  userId: string;
  skills: string[];
  experience: number; // anos
  currentMarket?: string;
  topCompetitors?: string[];
}

export interface InsightsOutput {
  trendingSkills: Array<{
    skill: string;
    demand: "high" | "medium" | "low";
    avgRate: number;
    recommendedRate: number;
    growth: number; // percentual
  }>;
  marketAnalysis: string;
  recommendations: string[];
  opportunityScore: number;
}

export interface BadgeInput {
  userId: string;
  stats: {
    completedProjects: number;
    avgRating: number;
    responseTime: number; // horas
    isVerified: boolean;
    yearsExperience: number;
  };
  portfolio?: string;
}

export interface BadgeOutput {
  badges: Array<{
    type: "verified" | "top" | "quality" | "senior" | "expert";
    score: number;
    rationale: string;
  }>;
  nextMilestone: {
    badge: string;
    progress: number; // 0-100%
    recommendation: string;
  };
}

export interface PortfolioInput {
  userId: string;
  projects: Array<{
    title: string;
    description: string;
    skills: string[];
    result: string;
    budget?: number;
  }>;
  bio?: string;
  targetAudience?: string;
}

export interface PortfolioOutput {
  summary: string;
  highlights: string[];
  seoTags: string[];
  improvementSuggestions: string[];
}

export interface ContractInput {
  clientProposal: string;
  userProfile: {
    skills: string[];
    experience: number;
    avgRate: number;
  };
  projectContext?: string;
}

export interface ContractOutput {
  counterProposal: string;
  keyPoints: string[];
  riskAnalysis: string[];
  negotiationTips: string[];
}

// ============================================================================
// PROMPTS (Typed & Structured)
// ============================================================================

const SYSTEM_PROMPTS = {
  insights: `You are an expert market analyst specializing in freelance skills and trends.
Analyze market data and provide actionable insights for freelancers.
Focus on data-driven recommendations with specific metrics.
Respond in Portuguese (Brazil).`,

  badge: `You are an expert evaluator of freelancer quality and achievements.
Assess freelancer stats and determine earned badges.
Be fair but rigorous - badges must be well-deserved.
Respond in Portuguese (Brazil).`,

  portfolio: `You are a portfolio optimization expert.
Help freelancers showcase their best work and attract clients.
Provide specific, actionable improvements.
Respond in Portuguese (Brazil).`,

  contrato: `You are an expert negotiator and contract specialist.
Help freelancers craft professional counter-proposals.
Balance assertiveness with professionalism.
Respond in Portuguese (Brazil).`,
};

const USER_PROMPTS = {
  insights: (input: InsightsInput) => `
Analise o mercado para este freelancer:

Skills: ${input.skills.join(", ")}
Experiência: ${input.experience} anos
Mercado: ${input.currentMarket || "Brasil"}
Competidores principais: ${input.topCompetitors?.join(", ") || "não especificado"}

Forneça:
1. 5 skills em alta demanda (demand, avgRate, recommendedRate, growth%)
2. Análise do mercado (max 200 palavras)
3. 3 recomendações práticas
4. Opportunity Score (0-100)

Responda em JSON valido.`,

  badge: (input: BadgeInput) => `
Avalie este freelancer para badges:

Projetos completos: ${input.stats.completedProjects}
Rating médio: ${input.stats.avgRating}/5
Tempo de resposta: ${input.stats.responseTime}h
Verificado: ${input.stats.isVerified}
Anos de experiência: ${input.stats.yearsExperience}
Portfolio: ${input.portfolio || "não informado"}

Badges possíveis: verified, top, quality, senior, expert

Retorne:
1. Badges conquistadas com score (0-100) e justificativa
2. Próximo milestone com progresso (0-100%)
3. Recomendação para atingir

Responda em JSON valido.`,

  portfolio: (input: PortfolioInput) => `
Otimize este portfólio:

Bio: ${input.bio || "não informada"}
Público-alvo: ${input.targetAudience || "não especificado"}
Projetos: ${input.projects.map((p) => `${p.title} (${p.skills.join(", ")})`).join("\n")}

Retorne:
1. Resumo profissional (max 150 palavras)
2. 3 highlights principais
3. 5 tags SEO
4. 3 sugestões de melhoria

Responda em JSON valido.`,

  contrato: (input: ContractInput) => `
Elabore uma contra-proposta profissional:

Proposta do cliente:
${input.clientProposal}

Perfil do freelancer:
- Skills: ${input.userProfile.skills.join(", ")}
- Experiência: ${input.userProfile.experience} anos
- Taxa média: R$ ${input.userProfile.avgRate}/h
- Contexto: ${input.projectContext || "não especificado"}

Retorne:
1. Contra-proposta completa e profissional
2. 3 pontos-chave a destacar
3. 2-3 análises de risco
4. 3 dicas de negociação

Responda em JSON valido.`,
};

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class OpenAIService {
  private client: Anthropic;
  private redis?: Redis;
  private cacheTTL: number = 3600; // 1 hora
  private logger?: Logger;

  constructor(config: AIServiceConfig) {
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });

    if (config.redisUrl && config.redisToken) {
      this.redis = new Redis({
        url: config.redisUrl,
        token: config.redisToken,
      });
    }

    if (config.cacheTTL) {
      this.cacheTTL = config.cacheTTL;
    }

    this.logger = config.logger;
  }

  private getCacheKey(product: AIProductType, userId: string, hash: string): string {
    return `ai:${product}:${userId}:${hash}`;
  }

  private async getCached<T>(key: string): Promise<T | null> {
    if (!this.redis) return null;

    try {
      const cached = await this.redis.get(key);
      return cached as T | null;
    } catch (error) {
      this.logger?.warn(`Cache read failed: ${error}`);
      return null;
    }
  }

  private async setCached<T>(key: string, value: T): Promise<void> {
    if (!this.redis) return;

    try {
      await this.redis.setex(key, this.cacheTTL, JSON.stringify(value));
    } catch (error) {
      this.logger?.warn(`Cache write failed: ${error}`);
    }
  }

  /**
   * Gera Insights de mercado para freelancer
   */
  async generateInsights(input: InsightsInput): Promise<InsightsOutput> {
    const cacheKey = this.getCacheKey("insights", input.userId, JSON.stringify(input.skills));

    // Check cache
    const cached = await this.getCached<InsightsOutput>(cacheKey);
    if (cached) {
      this.logger?.info(`Insights cache hit for ${input.userId}`);
      return cached;
    }

    try {
      const response = await this.client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2000,
        system: SYSTEM_PROMPTS.insights,
        messages: [
          {
            role: "user",
            content: USER_PROMPTS.insights(input),
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== "text") {
        throw new Error("Unexpected response type");
      }

      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not parse JSON from response");
      }

      const result = JSON.parse(jsonMatch[0]) as InsightsOutput;

      // Cache result
      await this.setCached(cacheKey, result);

      return result;
    } catch (error) {
      this.logger?.error(`generateInsights error: ${error}`);
      throw new Error(`Failed to generate insights: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Avalia e gera Badges para freelancer
   */
  async evaluateBadges(input: BadgeInput): Promise<BadgeOutput> {
    const cacheKey = this.getCacheKey("badge", input.userId, JSON.stringify(input.stats));

    // Check cache
    const cached = await this.getCached<BadgeOutput>(cacheKey);
    if (cached) {
      this.logger?.info(`Badge cache hit for ${input.userId}`);
      return cached;
    }

    try {
      const response = await this.client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1500,
        system: SYSTEM_PROMPTS.badge,
        messages: [
          {
            role: "user",
            content: USER_PROMPTS.badge(input),
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== "text") {
        throw new Error("Unexpected response type");
      }

      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not parse JSON from response");
      }

      const result = JSON.parse(jsonMatch[0]) as BadgeOutput;

      // Cache result
      await this.setCached(cacheKey, result);

      return result;
    } catch (error) {
      this.logger?.error(`evaluateBadges error: ${error}`);
      throw new Error(`Failed to evaluate badges: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Otimiza Portfolio do freelancer
   */
  async optimizePortfolio(input: PortfolioInput): Promise<PortfolioOutput> {
    const cacheKey = this.getCacheKey("portfolio", input.userId, JSON.stringify(input.projects.map((p) => p.title)));

    // Check cache
    const cached = await this.getCached<PortfolioOutput>(cacheKey);
    if (cached) {
      this.logger?.info(`Portfolio cache hit for ${input.userId}`);
      return cached;
    }

    try {
      const response = await this.client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1500,
        system: SYSTEM_PROMPTS.portfolio,
        messages: [
          {
            role: "user",
            content: USER_PROMPTS.portfolio(input),
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== "text") {
        throw new Error("Unexpected response type");
      }

      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not parse JSON from response");
      }

      const result = JSON.parse(jsonMatch[0]) as PortfolioOutput;

      // Cache result
      await this.setCached(cacheKey, result);

      return result;
    } catch (error) {
      this.logger?.error(`optimizePortfolio error: ${error}`);
      throw new Error(`Failed to optimize portfolio: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Gera Contra-proposta profissional
   */
  async generateCounterProposal(input: ContractInput): Promise<ContractOutput> {
    // No cache for contracts - sempre fresco
    try {
      const response = await this.client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2000,
        system: SYSTEM_PROMPTS.contrato,
        messages: [
          {
            role: "user",
            content: USER_PROMPTS.contrato(input),
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== "text") {
        throw new Error("Unexpected response type");
      }

      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not parse JSON from response");
      }

      const result = JSON.parse(jsonMatch[0]) as ContractOutput;

      return result;
    } catch (error) {
      this.logger?.error(`generateCounterProposal error: ${error}`);
      throw new Error(`Failed to generate counter-proposal: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Limpa cache manualmente
   */
  async clearCache(product: AIProductType, userId: string): Promise<void> {
    if (!this.redis) return;

    try {
      // Remove pattern-based cache entries
      const pattern = `ai:${product}:${userId}:*`;
      await this.redis.del(pattern);
      this.logger?.info(`Cache cleared for ${product}:${userId}`);
    } catch (error) {
      this.logger?.warn(`Cache clear failed: ${error}`);
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let instance: OpenAIService | null = null;

export function initOpenAIService(config: AIServiceConfig): OpenAIService {
  instance = new OpenAIService(config);
  return instance;
}

export function getOpenAIService(): OpenAIService {
  if (!instance) {
    throw new Error("OpenAI service not initialized. Call initOpenAIService first.");
  }
  return instance;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Parse JSON from LLM response with error handling
 */
export function parseJSONResponse<T>(text: string): T {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    return JSON.parse(jsonMatch[0]) as T;
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Hash input for cache key
 */
export function hashInput(input: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(input)).toString("base64").substring(0, 32);
}
