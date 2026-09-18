/**
 * FASE 3: 8 produtos client tools com APIs, Dashboards e Links Assinify
 * Estrutura de dados para produtos pagos para clientes (não freelancers)
 */

export type PricingModel = 'monthly' | 'commission' | 'free';
export type ProductTier = 'free' | 'monthly' | 'commission' | 'premium';

export interface ClientProduct {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  description: string;
  pricing: {
    model: PricingModel;
    monthlyPrice?: number;
    commissionRate?: number; // e.g., 0.05 for 5%
    currency: 'BRL';
  };
  features: string[];
  apiEndpoint: string;
  dashboardRoute: string;
  assinifyCheckoutUrl?: string; // Will be populated from env vars
  tier: ProductTier;
  comingSoon?: boolean;
}

export const CLIENT_PRODUCTS: ClientProduct[] = [
  // PRODUTO 1: Currículo (Free)
  {
    id: 'curriculo',
    name: 'Currículo IA',
    slug: 'curriculo',
    emoji: '📄',
    description: 'Gerador de currículos com IA',
    pricing: {
      model: 'free',
      currency: 'BRL',
    },
    features: [
      'Geração automática de currículo',
      'Múltiplos templates',
      'Export PDF/DOCX',
      'Otimização para ATS',
      'Sugestões de IA',
    ],
    apiEndpoint: '/api/client-products/curriculo',
    dashboardRoute: '/client-dashboard/curriculo',
    tier: 'free',
  },

  // PRODUTO 2: Escrow (5% comissão)
  {
    id: 'escrow',
    name: 'Escrow Seguro',
    slug: 'escrow',
    emoji: '🔒',
    description: 'Sistema de escrow para transações seguras',
    pricing: {
      model: 'commission',
      commissionRate: 0.05, // 5%
      currency: 'BRL',
    },
    features: [
      'Transações seguras entre partes',
      'Proteção de ambos os lados',
      'Liberação condicional',
      'Suporte 24/7',
      'Taxa de 5% por transação',
      'Sem taxa mínima',
    ],
    apiEndpoint: '/api/client-products/escrow',
    dashboardRoute: '/client-dashboard/escrow',
    assinifyCheckoutUrl: process.env.NEXT_PUBLIC_ASSINIFY_CHECKOUT_ESCROW,
    tier: 'commission',
  },

  // PRODUTO 3: Milestones (2% comissão)
  {
    id: 'milestones',
    name: 'Milestones',
    slug: 'milestones',
    emoji: '🎯',
    description: 'Gerenciador de milestones de projeto',
    pricing: {
      model: 'commission',
      commissionRate: 0.02, // 2%
      currency: 'BRL',
    },
    features: [
      'Criação de milestones automático',
      'Rastreamento de progresso',
      'Alertas inteligentes',
      'Relatórios detalhados',
      'Taxa de 2% por milestone',
      'Integração com escrow',
    ],
    apiEndpoint: '/api/client-products/milestones',
    dashboardRoute: '/client-dashboard/milestones',
    assinifyCheckoutUrl: process.env.NEXT_PUBLIC_ASSINIFY_CHECKOUT_MILESTONES,
    tier: 'commission',
  },

  // PRODUTO 4: Analytics Cliente (R$ 49,90/mês)
  {
    id: 'analytics-cliente',
    name: 'Analytics Cliente',
    slug: 'analytics-cliente',
    emoji: '📊',
    description: 'Dashboard de analytics para clientes',
    pricing: {
      model: 'monthly',
      monthlyPrice: 49.90,
      currency: 'BRL',
    },
    features: [
      'Dashboard em tempo real',
      'Métricas de projeto',
      'ROI por projeto',
      'Comparativo com mercado',
      'Exportação de relatórios',
      'API de dados',
      'Alertas automáticos',
    ],
    apiEndpoint: '/api/client-products/analytics-cliente',
    dashboardRoute: '/client-dashboard/analytics-cliente',
    assinifyCheckoutUrl: process.env.NEXT_PUBLIC_ASSINIFY_CHECKOUT_ANALYTICS_CLIENTE,
    tier: 'monthly',
  },

  // PRODUTO 5: Contrato IA (R$ 24,90/mês)
  {
    id: 'contrato-ia',
    name: 'Contrato IA',
    slug: 'contrato-ia',
    emoji: '⚖️',
    description: 'Geração de contratos com IA',
    pricing: {
      model: 'monthly',
      monthlyPrice: 24.90,
      currency: 'BRL',
    },
    features: [
      'Geração automática de contratos',
      'Templates customizáveis',
      'Análise de cláusulas',
      'Revisão por IA',
      'Assinatura eletrônica',
      'Histórico de versões',
      'Suporte jurídico',
    ],
    apiEndpoint: '/api/client-products/contrato-ia',
    dashboardRoute: '/client-dashboard/contrato-ia',
    assinifyCheckoutUrl: process.env.NEXT_PUBLIC_ASSINIFY_CHECKOUT_CONTRATO_IA,
    tier: 'monthly',
  },

  // PRODUTO 6: QA Automático (R$ 34,90/mês)
  {
    id: 'qa-automatico',
    name: 'QA Automático',
    slug: 'qa-automatico',
    emoji: '✅',
    description: 'Testes automatizados e QA',
    pricing: {
      model: 'monthly',
      monthlyPrice: 34.90,
      currency: 'BRL',
    },
    features: [
      'Testes automáticos',
      'Cobertura de código',
      'Integração CI/CD',
      'Relatórios de bugs',
      'Performance monitoring',
      'Sugestões de melhoria',
      'Histórico de execuções',
    ],
    apiEndpoint: '/api/client-products/qa-automatico',
    dashboardRoute: '/client-dashboard/qa-automatico',
    assinifyCheckoutUrl: process.env.NEXT_PUBLIC_ASSINIFY_CHECKOUT_QA_AUTOMATICO,
    tier: 'monthly',
  },

  // PRODUTO 7: VIP Network (R$ 999,90/mês)
  {
    id: 'vip-network',
    name: 'VIP Network',
    slug: 'vip-network',
    emoji: '👑',
    description: 'Rede exclusiva de professionals VIP',
    pricing: {
      model: 'monthly',
      monthlyPrice: 999.90,
      currency: 'BRL',
    },
    features: [
      'Acesso à rede VIP exclusiva',
      'Encontros mensais',
      'Masterclasses',
      'Consultoria 1-1',
      'Oportunidades de investimento',
      'Due diligence support',
      'Personal account manager',
      'Priority support 24/7',
    ],
    apiEndpoint: '/api/client-products/vip-network',
    dashboardRoute: '/client-dashboard/vip-network',
    assinifyCheckoutUrl: process.env.NEXT_PUBLIC_ASSINIFY_CHECKOUT_VIP_NETWORK,
    tier: 'premium',
  },

  // PRODUTO 8: Community (R$ 39,90/mês)
  {
    id: 'community',
    name: 'Community Pro',
    slug: 'community',
    emoji: '👥',
    description: 'Comunidade profissional com benefícios',
    pricing: {
      model: 'monthly',
      monthlyPrice: 39.90,
      currency: 'BRL',
    },
    features: [
      'Acesso à comunidade',
      'Fóruns de discussão',
      'Eventos mensais',
      'Networking',
      'Conteúdo exclusivo',
      'Biblioteca de recursos',
      'Certificados de participação',
      'Job board com prioridade',
    ],
    apiEndpoint: '/api/client-products/community',
    dashboardRoute: '/client-dashboard/community',
    assinifyCheckoutUrl: process.env.NEXT_PUBLIC_ASSINIFY_CHECKOUT_COMMUNITY,
    tier: 'monthly',
  },
];

/**
 * Resolver ID do plano Assinify baseado no nome do produto
 */
export function resolveClientProductPlan(
  productName: string | null
): (typeof CLIENT_PRODUCTS)[number]['id'] | null {
  if (!productName) return null;

  const normalized = productName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

  const product = CLIENT_PRODUCTS.find(
    (p) =>
      normalized.includes(p.name.toLowerCase()) ||
      normalized.includes(p.slug) ||
      normalized === p.id
  );

  return product?.id ?? null;
}

/**
 * Obter checkout URL de um produto cliente
 */
export function getClientProductCheckoutUrl(
  productId: string
): string | null {
  const product = CLIENT_PRODUCTS.find((p) => p.id === productId);
  if (!product) return null;

  if (product.pricing.model === 'free') {
    return null; // Produtos grátis não precisam checkout
  }

  return product.assinifyCheckoutUrl || null;
}

/**
 * Formatar preço de um produto
 */
export function formatProductPrice(product: ClientProduct): string {
  if (product.pricing.model === 'free') {
    return 'Grátis';
  }

  if (product.pricing.model === 'commission') {
    return `${(product.pricing.commissionRate! * 100).toFixed(0)}% por transação`;
  }

  return `R$ ${product.pricing.monthlyPrice?.toFixed(2)}/mês`;
}

/**
 * Obter todos os produtos por tier
 */
export function getProductsByTier(
  tier: ProductTier
): (typeof CLIENT_PRODUCTS)[number][] {
  return CLIENT_PRODUCTS.filter((p) => p.tier === tier);
}

/**
 * Obter resumo de MRR potencial dos produtos cliente
 */
export function calculateClientProductsMRR(): {
  monthlyProducts: number;
  totalMonthlyMRR: number;
  commissionProducts: number;
} {
  const monthlyProducts = CLIENT_PRODUCTS.filter(
    (p) => p.pricing.model === 'monthly'
  ).length;
  const monthlyCount = monthlyProducts; // Assuming 1 subscriber per product for calc

  const totalMonthlyMRR = CLIENT_PRODUCTS.filter(
    (p) => p.pricing.model === 'monthly'
  ).reduce((acc, p) => acc + (p.pricing.monthlyPrice || 0), 0);

  const commissionProducts = CLIENT_PRODUCTS.filter(
    (p) => p.pricing.model === 'commission'
  ).length;

  return {
    monthlyProducts,
    totalMonthlyMRR,
    commissionProducts,
  };
}
