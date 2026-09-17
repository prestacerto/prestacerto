// CERTO AI - IA Central de Todos os Produtos
// Mais inteligente, precisa, com caching e contexto rico

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIContext {
  userId: string;
  userProfile: {
    skills: string[];
    yearsExperience: number;
    successRate: number;
    averageRating: number;
  };
  projectContext?: {
    title: string;
    description: string;
    budget: number;
    skills: string[];
  };
  previousResponses?: string[];
}

export interface AIResponse {
  content: string;
  confidence: number;
  actionItems: string[];
  metadata: {
    model: string;
    tokensUsed: number;
    cacheHit: boolean;
  };
}

// Cache simples (em produção usar Redis)
const aiCache = new Map<string, AIResponse>();

function getCacheKey(context: AIContext, prompt: string): string {
  return `${context.userId}:${prompt.substring(0, 50)}`;
}

export async function generateAIInsight(
  prompt: string,
  context: AIContext,
  options?: {
    maxTokens?: number;
    temperature?: number;
    useCache?: boolean;
  }
): Promise<AIResponse> {
  const useCache = options?.useCache !== false;
  const cacheKey = getCacheKey(context, prompt);

  // Check cache
  if (useCache && aiCache.has(cacheKey)) {
    return { ...aiCache.get(cacheKey)!, metadata: { ...aiCache.get(cacheKey)!.metadata, cacheHit: true } };
  }

  // Build rich context prompt
  const enrichedPrompt = `
CONTEXTO DO FREELANCER:
- Skills: ${context.userProfile.skills.join(", ")}
- Experiência: ${context.userProfile.yearsExperience} anos
- Taxa de sucesso: ${context.userProfile.successRate}%
- Rating: ${context.userProfile.averageRating}/5

${context.projectContext ? `CONTEXTO DO PROJETO:
- Título: ${context.projectContext.title}
- Budget: R$ ${context.projectContext.budget}
- Skills requeridas: ${context.projectContext.skills.join(", ")}
` : ""}

PERGUNTA:
${prompt}

Responda em português, de forma concisa e acionável. Inclua 2-3 insights principais.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: enrichedPrompt,
        },
      ],
      max_tokens: options?.maxTokens || 300,
      temperature: options?.temperature || 0.7,
    });

    const content = response.choices[0]?.message?.content || "";
    
    // Parse action items (linhas que começam com -)
    const actionItems = content
      .split("\n")
      .filter((line) => line.trim().startsWith("-"))
      .map((line) => line.replace(/^-\s*/, "").trim());

    const aiResponse: AIResponse = {
      content,
      confidence: 0.85,
      actionItems,
      metadata: {
        model: "gpt-4-turbo",
        tokensUsed: response.usage?.total_tokens || 0,
        cacheHit: false,
      },
    };

    // Cache response
    if (useCache) {
      aiCache.set(cacheKey, aiResponse);
    }

    return aiResponse;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error(`Falha ao gerar insight IA: ${error}`);
  }
}

// Análise de Mercado (para INSIGHTS)
export async function analyzeMarketTrends(skills: string[], context: AIContext): Promise<AIResponse> {
  const prompt = `
Analise tendências de mercado para: ${skills.join(", ")}

Inclua:
1. Demanda atual (alta/média/baixa)
2. Preço médio esperado
3. Oportunidades principais
4. Competição
`;

  return generateAIInsight(prompt, context, { maxTokens: 400 });
}

// Geração de Propostas (para BIBLIOTECA)
export async function generateProposalTemplate(
  projectTitle: string,
  freelancerProfile: AIContext["userProfile"],
  context: AIContext
): Promise<AIResponse> {
  const prompt = `
Gere uma proposta profissional para: ${projectTitle}

Perfil do freelancer: ${freelancerProfile.skills.join(", ")}, ${freelancerProfile.yearsExperience}a exp, ${freelancerProfile.averageRating}/5

Formato:
1. Introdução (1 parágrafo)
2. Proposta técnica (2 parágrafos)
3. Timeline e preço
4. Próximos passos
`;

  return generateAIInsight(prompt, context, { maxTokens: 500 });
}

// Geração de Contrato (para CONTRATO IA)
export async function generateContract(
  projectTitle: string,
  scope: string,
  budget: number,
  context: AIContext
): Promise<AIResponse> {
  const prompt = `
Gere termo de contrato profissional para:
- Projeto: ${projectTitle}
- Escopo: ${scope}
- Valor: R$ ${budget}

Inclua: escopo, timeline, pagamento, direitos autorais, confidencialidade.
Use formato Markdown com seções claras.
`;

  return generateAIInsight(prompt, context, { maxTokens: 800 });
}

// Detecção de Badges (para BADGE)
export function detectAvailableBadges(profile: AIContext["userProfile"]): string[] {
  const badges = [];

  if (profile.averageRating >= 4.8) badges.push("⭐ Top Rated");
  if (profile.successRate >= 95) badges.push("✅ High Success");
  if (profile.yearsExperience >= 5) badges.push("🏆 Expert");
  if (profile.skills.length >= 8) badges.push("🎯 Versatile");

  return badges;
}

// Clear cache periodicamente
export function clearAICache() {
  aiCache.clear();
}
