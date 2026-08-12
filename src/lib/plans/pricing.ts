export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number; // em centavos (R$ 29,90 = 2990)
  billingPeriod: "monthly" | "yearly" | "lifetime";
  features: Record<string, boolean | number>;
  highlighted?: boolean;
  discount?: number; // % de desconto
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: "monthly" | "one-time";
}

// PLANOS PRINCIPAIS
export const PLANS: Record<string, Plan> = {
  // FREE
  free: {
    id: "free",
    name: "Grátis",
    description: "Comece gratuitamente",
    price: 0,
    billingPeriod: "monthly",
    features: {
      projects: 2,
      proposals: 5,
      jobMatching: false,
      analytics: false,
      featured: false,
      priority: false,
      apiAccess: false,
      customDomain: false,
      teamMembers: 1,
    },
  },

  // STARTER
  starter: {
    id: "starter",
    name: "Iniciante",
    description: "Para quem está começando",
    price: 1490, // R$ 14,90
    billingPeriod: "monthly",
    features: {
      projects: 5,
      proposals: 20,
      jobMatching: false,
      analytics: true,
      featured: false,
      priority: false,
      apiAccess: false,
      customDomain: false,
      teamMembers: 1,
    },
  },

  // PRO
  pro: {
    id: "pro",
    name: "Pro",
    description: "Para profissionais",
    price: 2990, // R$ 29,90
    billingPeriod: "monthly",
    highlighted: true,
    features: {
      projects: 20,
      proposals: 100,
      jobMatching: true,
      analytics: true,
      featured: false,
      priority: false,
      apiAccess: true,
      customDomain: false,
      teamMembers: 3,
    },
  },

  // PREMIUM
  premium: {
    id: "premium",
    name: "Premium",
    description: "Acesso total com suporte",
    price: 9990, // R$ 99,90
    billingPeriod: "monthly",
    features: {
      projects: -1, // unlimited
      proposals: -1,
      jobMatching: true,
      analytics: true,
      featured: true,
      priority: true,
      apiAccess: true,
      customDomain: true,
      teamMembers: 10,
    },
  },

  // ENTERPRISE
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    description: "Solução customizada",
    price: 29990, // R$ 299,90
    billingPeriod: "monthly",
    features: {
      projects: -1,
      proposals: -1,
      jobMatching: true,
      analytics: true,
      featured: true,
      priority: true,
      apiAccess: true,
      customDomain: true,
      teamMembers: -1, // unlimited
      dedicatedSupport: true,
      customIntegrations: true,
      sso: true,
    },
  },
};

// PLANOS ANUAIS COM DESCONTO
export const YEARLY_PLANS: Record<string, Plan> = {
  starter_yearly: {
    ...PLANS.starter,
    id: "starter_yearly",
    price: 14900, // R$ 149,00 (20% desconto)
    billingPeriod: "yearly",
    discount: 20,
  },
  pro_yearly: {
    ...PLANS.pro,
    id: "pro_yearly",
    price: 28900, // R$ 289,00 (20% desconto)
    billingPeriod: "yearly",
    discount: 20,
  },
  premium_yearly: {
    ...PLANS.premium,
    id: "premium_yearly",
    price: 89900, // R$ 899,00 (25% desconto)
    billingPeriod: "yearly",
    discount: 25,
  },
};

// ADD-ONS (complementos)
export const ADD_ONS: Record<string, AddOn> = {
  extra_projects_5: {
    id: "extra_projects_5",
    name: "5 Projetos Adicionais",
    description: "Aumente seu limite em 5 projetos",
    price: 490, // R$ 4,90/mês
    billingPeriod: "monthly",
  },

  extra_projects_monthly: {
    id: "extra_projects_monthly",
    name: "Projetos Ilimitados (1 mês)",
    description: "Acesso a projetos ilimitados por 30 dias",
    price: 1990, // R$ 19,90
    billingPeriod: "one-time",
  },

  featured_boost: {
    id: "featured_boost",
    name: "Destaque Premium (30 dias)",
    description: "Coloque um projeto em destaque",
    price: 2990, // R$ 29,90
    billingPeriod: "one-time",
  },

  priority_support: {
    id: "priority_support",
    name: "Suporte Prioritário",
    description: "Suporte via email/chat com resposta em 1 hora",
    price: 1990, // R$ 19,90/mês
    billingPeriod: "monthly",
  },

  portfolio_premium: {
    id: "portfolio_premium",
    name: "Portfólio Premium",
    description: "Domínio customizado + design avançado",
    price: 4990, // R$ 49,90/mês
    billingPeriod: "monthly",
  },

  cv_maker: {
    id: "cv_maker",
    name: "CV/Portfólio Profissional",
    description: "Gerador de CV com templates premium",
    price: 1490, // R$ 14,90 (lifetime)
    billingPeriod: "one-time",
  },

  showcase_featured: {
    id: "showcase_featured",
    name: "Destaque Anual (365 dias)",
    description: "1 projeto em destaque por 1 ano",
    price: 29900, // R$ 299,00
    billingPeriod: "one-time",
  },

  analytics_advanced: {
    id: "analytics_advanced",
    name: "Analytics Avançado",
    description: "Relatórios personalizados + previsões com IA",
    price: 3990, // R$ 39,90/mês
    billingPeriod: "monthly",
  },

  api_premium: {
    id: "api_premium",
    name: "API Premium",
    description: "Limite elevado de requisições (100k/mês)",
    price: 4990, // R$ 49,90/mês
    billingPeriod: "monthly",
  },
};

// BUNDLES (promoções)
export const BUNDLES = {
  pro_boost: {
    name: "Pro + Suporte",
    description: "Pro + Suporte Prioritário",
    basePrice: PLANS.pro.price + ADD_ONS.priority_support.price,
    bundlePrice: 4490, // R$ 44,90 (economiza R$ 7,90)
    plans: ["pro"],
    addOns: ["priority_support"],
    savings: 790,
  },

  portfolio_pro: {
    name: "Pro + Portfólio",
    description: "Pro + Portfólio Premium",
    basePrice: PLANS.pro.price + ADD_ONS.portfolio_premium.price,
    bundlePrice: 7490, // R$ 74,90 (economiza R$ 19,90)
    plans: ["pro"],
    addOns: ["portfolio_premium"],
    savings: 1990,
  },

  ultimate_setup: {
    name: "Premium Total",
    description: "Premium + Suporte + Analytics + Portfólio",
    basePrice:
      PLANS.premium.price +
      ADD_ONS.priority_support.price +
      ADD_ONS.analytics_advanced.price +
      ADD_ONS.portfolio_premium.price,
    bundlePrice: 16990, // R$ 169,90 (economiza R$ 28,80)
    plans: ["premium"],
    addOns: ["priority_support", "analytics_advanced", "portfolio_premium"],
    savings: 2880,
  },
};

export function formatPrice(priceInCents: number): string {
  return (priceInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function calculateDiscount(basePrice: number, discountedPrice: number): number {
  return Math.round(((basePrice - discountedPrice) / basePrice) * 100);
}

export function getAllPlans(): Plan[] {
  return [...Object.values(PLANS), ...Object.values(YEARLY_PLANS)];
}

export function getPlanById(planId: string): Plan | undefined {
  return PLANS[planId] || YEARLY_PLANS[planId];
}

export function getAddOnById(addOnId: string): AddOn | undefined {
  return ADD_ONS[addOnId];
}

export function getMonthlyEquivalent(price: number, period: "monthly" | "yearly" | "one-time"): number {
  if (period === "yearly") return Math.round(price / 12);
  if (period === "one-time") return 0;
  return price;
}
