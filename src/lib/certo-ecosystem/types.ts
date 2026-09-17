// TIPOS COMPARTILHADOS DO CERTO ECOSYSTEM (27 PRODUTOS)

export type ProductCategory =
  | 'intelligence'  // Fase 2: IA/dados
  | 'tools'         // Ferramentas
  | 'payments'      // Escrow, Milestones, Transações
  | 'community'     // Community, VIP, Academy
  | 'education'     // Cursos, Certificações
  | 'marketplace';  // Destaque, Candidato

export type ProductStatus = 'planned' | 'alpha' | 'beta' | 'live';

export interface CertoProduct {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category: ProductCategory;
  price_monthly: number;
  price_type: 'subscription' | 'one-time' | 'commission' | 'freemium';
  icon?: string;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface CertoUserProduct {
  id: string;
  user_id: string;
  product_id: string;
  subscription_status: 'active' | 'paused' | 'cancelled';
  started_at: string;
  renews_at?: string;
  cancelled_at?: string;
  last_used_at?: string;
}

export interface CertoProductUsage {
  id: string;
  user_id: string;
  product_id: string;
  action: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface CertoUserPoints {
  id: string;
  user_id: string;
  total_points: number;
  badges_earned: string[];
  level: number;
  created_at: string;
  updated_at: string;
}

export interface CertoTransaction {
  id: string;
  freelancer_id: string;
  client_id: string;
  project_id?: string;
  amount: number;
  currency: string;
  transaction_type: 'escrow' | 'milestone' | 'commission';
  status: 'pending' | 'released' | 'disputed' | 'completed';
  created_at: string;
  released_at?: string;
  disputed_at?: string;
}

// TIPOS POR PRODUTO (expandir conforme necessário)

// 1. CERTO MATCH
export interface CertoMatchResult {
  matchScore: number;
  winChance: number;
  recommendedBid: number;
  similarProposals: number;
  competitorAnalysis: {
    count: number;
    avgBid: number;
    avgRating: number;
  };
}

// 2. CERTO PREÇO
export interface CertoPricingRecommendation {
  recommendedPrice: number;
  marketAverage: number;
  yourCurrentPrice: number;
  potentialIncrease: number;
  demandLevel: 'low' | 'medium' | 'high' | 'very_high';
  skillSaturation: number;
}

// 3. CERTO TIMING
export interface CertoTimingData {
  bestHour: number;
  bestDayOfWeek: number;
  clientOnlinePattern: string;
  waitTimeRecommended: number;
  successRateBoost: number;
}

// 5. CERTO INSIGHTS
export interface CertoMarketInsight {
  skill: string;
  demandChange: number; // percentage
  salaryRange: {
    min: number;
    max: number;
    avg: number;
  };
  competitionLevel: number;
  futureOutlook: 'increasing' | 'stable' | 'decreasing';
}

// 13. CERTO ESCROW
export interface CertoEscrowData {
  projectId: string;
  amount: number;
  holdingDays: number;
  releaseCondition: string;
  disputeHistory: number;
  safetyScore: number;
}

// 27. CERTO PREMIUM
export interface CertoPremiumTier {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  badgeColor: string;
  benefits: string[];
  monthlyBoost: number; // percentage de visibilidade
  requiredServices: number;
  minRating: number;
}
