// CERTO PREÇO - Dynamic Pricing Engine
// Recomenda preço ótimo baseado em mercado, experiência e demanda

export interface PricingInput {
  skill: string;
  yearsExperience: number;
  marketDemand: "low" | "medium" | "high" | "very_high";
  projectBudget: number;
  competitorAverageBid: number;
  userHistoricalRate: number;
}

export interface PricingRecommendation {
  recommendedPrice: number;
  minPrice: number;
  maxPrice: number;
  marketAverage: number;
  upside: number;
  confidence: number;
  reasoning: string;
}

export function calculateDynamicPrice(input: PricingInput): PricingRecommendation {
  // Base: histórico do user
  const basePrice = input.userHistoricalRate;

  // Fator de experiência (0.8x a 1.3x)
  const experienceFactor = Math.min(1.3, 0.8 + (input.yearsExperience / 10) * 0.5);

  // Fator de demanda (1x a 1.5x)
  const demandFactor = {
    low: 0.95,
    medium: 1.0,
    high: 1.2,
    very_high: 1.5,
  }[input.marketDemand];

  // Fator de orçamento (comparar com budget do projeto)
  const hourlyBudgetRate = input.projectBudget / 40;
  const budgetFactor = Math.min(1.2, Math.max(0.8, hourlyBudgetRate / basePrice));

  // Recomendação
  const recommended = Math.round(basePrice * experienceFactor * demandFactor * budgetFactor);
  const minPrice = Math.round(basePrice * 0.8);
  const maxPrice = Math.round(basePrice * 1.5);

  // Upside: quanto você pode ganhar extra
  const upside = Math.round(((recommended - basePrice) / basePrice) * 100);

  // Confiança na recomendação (0-100)
  const confidence = Math.min(
    95,
    50 + input.yearsExperience * 5 + (input.marketDemand === "very_high" ? 20 : 0)
  );

  const reasoning = `Baseado em: experiência (${input.yearsExperience}a), demanda ${input.marketDemand}, budget do projeto (R$ ${input.projectBudget})`;

  return {
    recommendedPrice: recommended,
    minPrice,
    maxPrice,
    marketAverage: input.competitorAverageBid,
    upside,
    confidence,
    reasoning,
  };
}

// Estimar preço competitivo baseado em skill
export function getMarketAveragePrice(skill: string): number {
  const skillPrices: Record<string, number> = {
    "React": 150,
    "Node.js": 140,
    "TypeScript": 155,
    "Python": 130,
    "Java": 145,
    "Design": 120,
    "Marketing": 110,
    "SEO": 100,
    "DevOps": 160,
    "Mobile": 135,
  };

  return skillPrices[skill] || 120;
}
