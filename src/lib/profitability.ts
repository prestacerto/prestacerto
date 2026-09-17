// Profitability & Business Metrics
// Track ARR, LTV, CAC, margins, and growth

export interface ProfitabilityMetrics {
  // Revenue
  arr: number; // Annual Recurring Revenue
  mrr: number; // Monthly Recurring Revenue
  monthlyRevenue: number;

  // Costs
  monthlyInfrastructureCosts: number; // Vercel, Supabase, etc
  monthlyPaymentProcessingFees: number; // Stripe/MercadoPago fees ~2.9%
  monthlyOperationalCosts: number; // Team, support, etc

  // Profitability
  grossMargin: number; // %
  netMargin: number; // %
  monthlyProfit: number;

  // SaaS Metrics
  ltv: number; // Lifetime Value
  cac: number; // Customer Acquisition Cost
  paybackPeriod: number; // months
  ltv_cac_ratio: number; // LTV/CAC - target: 3:1+

  // Growth
  cagr: number; // Compound Annual Growth Rate
  churnRate: number; // Monthly churn %
  retention: number; // Retention rate %
}

export function calculateProfitability(
  activeUsers: number,
  subscriptionPrice: number = 49, // R$ 49/mês Pro plan
  referralRevenuePerUser: number = 25, // R$ 25 avg
  featuredProposalsRevenue: number = 5000,
  assessmentRevenue: number = 3000,
  partnersRevenue: number = 2000,
  monthlyChurn: number = 0.05 // 5% monthly churn
): ProfitabilityMetrics {
  // Calculate MRR
  const subscriptionMRR = activeUsers * subscriptionPrice * 0.3; // 30% conversion
  const referralMRR = activeUsers * referralRevenuePerUser * 0.2; // 20% active
  const otherMRR = (featuredProposalsRevenue + assessmentRevenue + partnersRevenue) / 12;

  const mrr = subscriptionMRR + referralMRR + otherMRR;
  const arr = mrr * 12;

  // Costs (estimated)
  const vercelCosts = 200; // ~R$ 200/mês
  const supabaseCosts = 150; // ~R$ 150/mês
  const stripeFeesPercent = 0.029; // 2.9%
  const monthlyInfrastructureCosts = vercelCosts + supabaseCosts;
  const monthlyPaymentProcessingFees = mrr * stripeFeesPercent;
  const monthlyOperationalCosts = 1000; // Team, marketing, support

  const totalMonthlyCosts =
    monthlyInfrastructureCosts +
    monthlyPaymentProcessingFees +
    monthlyOperationalCosts;

  // Profitability
  const monthlyProfit = mrr - totalMonthlyCosts;
  const grossMargin = ((mrr - monthlyPaymentProcessingFees) / mrr) * 100;
  const netMargin = (monthlyProfit / mrr) * 100;

  // SaaS Metrics
  const cac = monthlyOperationalCosts / (activeUsers * 0.05); // Assume 5% new user rate
  const ltv = (subscriptionPrice * 12 * 0.3) / monthlyChurn; // Revenue/monthly churn
  const paybackPeriod = cac > 0 ? cac / (subscriptionPrice * 0.3) : 0;
  const ltv_cac_ratio = cac > 0 ? ltv / cac : 0;

  // Growth
  const retention = 1 - monthlyChurn;
  const cagr = Math.pow(1 + (monthlyProfit / (arr / 12 || 1)) * 0.5, 12) - 1; // Rough estimate

  return {
    arr,
    mrr,
    monthlyRevenue: mrr,
    monthlyInfrastructureCosts,
    monthlyPaymentProcessingFees,
    monthlyOperationalCosts,
    grossMargin,
    netMargin,
    monthlyProfit,
    ltv,
    cac,
    paybackPeriod,
    ltv_cac_ratio,
    cagr,
    churnRate: monthlyChurn * 100,
    retention: retention * 100,
  };
}

// Pricing strategy for maximizing LTV
export const PRICING_STRATEGY = {
  freemium: {
    name: "Free",
    price: 0,
    features: ["5 proposals/mês", "Basic profile"],
    conversionRate: 0.02, // 2% convert to Pro
  },
  pro: {
    name: "Pro",
    price: 49,
    features: [
      "Propostas ilimitadas",
      "Badge verificado",
      "Prioridade em buscas",
      "Analytics básico",
      "Suporte prioritário",
    ],
    conversionRate: 0.15, // 15% of free users
    churnRate: 0.05, // 5% monthly churn
  },
  business: {
    name: "Business",
    price: 129,
    features: [
      "Tudo do Pro",
      "Equipe (até 5 membros)",
      "Projetos privados",
      "Analytics avançado",
      "Gerente de conta dedicado",
    ],
    conversionRate: 0.02, // 2% of Pro users upgrade
    churnRate: 0.02, // 2% monthly churn - lower because higher commitment
  },
};

// Monetization levers (in priority order)
export const MONETIZATION_LEVERS = [
  {
    name: "Subscription (Pro/Business)",
    priority: 1,
    effort: "low",
    impact: "R$ 40-80k/mês @ 1k active users",
  },
  {
    name: "Referral Program",
    priority: 2,
    effort: "low",
    impact: "R$ 10-20k/mês @ 2k referrals/mês",
  },
  {
    name: "Skill Assessments",
    priority: 3,
    effort: "medium",
    impact: "R$ 5-15k/mês @ 50-100 assessments/mês",
  },
  {
    name: "Featured Proposals",
    priority: 4,
    effort: "low",
    impact: "R$ 3-8k/mês @ 30-50 featured/mês",
  },
  {
    name: "Partner Marketplace",
    priority: 5,
    effort: "high",
    impact: "R$ 20-50k/mês @ scaled",
  },
  {
    name: "Freelancer Certification",
    priority: 6,
    effort: "high",
    impact: "R$ 15-30k/mês @ scaled",
  },
];
