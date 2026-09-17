/**
 * FASE 4 - Community Products
 * 7 produtos + CERTO PREMIUM
 * Cada um com: API + Dashboard + Link Assinify
 */

export type CommunityProductId =
  | "academy"
  | "templates"
  | "invoice"
  | "cold-email"
  | "tax"
  | "destaque"
  | "candidato"
  | "certo-premium";

export interface CommunityProduct {
  id: CommunityProductId;
  name: string;
  slug: string;
  category: "course" | "tool" | "addon" | "free";
  priceType: "one-time" | "monthly" | "free";
  price: number; // 0 for free
  currency: "BRL";
  description: string;
  shortDescription: string;
  features: string[];
  targetAudience: string;
  icon: string; // emoji or icon name
  color: string; // tailwind color for UI

  // Assinify integration
  assinyProductId?: string; // ID no Assinify
  checkoutUrl?: string; // Link de checkout gerado no Assinify

  // Status
  launchDate?: string; // ISO date
  status: "live" | "beta" | "coming-soon";

  // Dashboard info
  hasDashboard: boolean;
  dashboardPath?: string;

  // API endpoint
  apiPath?: string;
}

export const COMMUNITY_PRODUCTS: CommunityProduct[] = [
  {
    id: "academy",
    name: "Academy",
    slug: "academy",
    category: "course",
    priceType: "one-time",
    price: 297,
    currency: "BRL",
    description: "Cursos online para freelancers e empresas sobre proposta, negociação, law e operações.",
    shortDescription: "Cursos por demanda",
    features: [
      "Acesso vitalício aos cursos",
      "Certificado de conclusão",
      "Suporte por email",
      "Atualizações futuras incluídas",
    ],
    targetAudience: "Freelancers e empresas buscando upskilling",
    icon: "🎓",
    color: "purple",
    status: "beta",
    hasDashboard: true,
    dashboardPath: "/dashboard/academy",
    apiPath: "/api/products/academy",
    launchDate: "2026-09-17",
  },
  {
    id: "templates",
    name: "Templates",
    slug: "templates",
    category: "tool",
    priceType: "monthly",
    price: 29.90,
    currency: "BRL",
    description: "Biblioteca de templates de propostas, contratos, CVs e documentos profissionais.",
    shortDescription: "Templates prontos para usar",
    features: [
      "80+ templates personalizáveis",
      "Atualizações mensais",
      "Sincronização com Certo AI",
      "Exportar em Word, PDF e Google Docs",
      "Acesso prioritário a novos templates",
    ],
    targetAudience: "Freelancers que querem economizar tempo",
    icon: "📋",
    color: "blue",
    status: "live",
    hasDashboard: true,
    dashboardPath: "/dashboard/templates",
    apiPath: "/api/products/templates",
    launchDate: "2026-09-17",
  },
  {
    id: "invoice",
    name: "Invoice",
    slug: "invoice",
    category: "tool",
    priceType: "monthly",
    price: 19.90,
    currency: "BRL",
    description: "Gerador de notas fiscais e recibos integrado com a plataforma.",
    shortDescription: "Notas fiscais em segundos",
    features: [
      "Gerar NF automaticamente",
      "Rastreamento de pagamentos",
      "Histórico de notas emitidas",
      "Integração com propostas do PrestaCerto",
      "Suporte a múltiplas moedas",
    ],
    targetAudience: "Freelancers PJ e MEI",
    icon: "🧾",
    color: "green",
    status: "live",
    hasDashboard: true,
    dashboardPath: "/dashboard/invoice",
    apiPath: "/api/products/invoice",
    launchDate: "2026-09-17",
  },
  {
    id: "cold-email",
    name: "Cold Email",
    slug: "cold-email",
    category: "tool",
    priceType: "monthly",
    price: 79.90,
    currency: "BRL",
    description: "Ferramenta para prospecção e automação de cold email com IA.",
    shortDescription: "Prospecção automatizada",
    features: [
      "1.000 sequências de email/mês",
      "Templates de cold email",
      "IA para personalizar mensagens",
      "Rastreamento de aberturas",
      "Integração com CRM",
      "Agendamento inteligente",
    ],
    targetAudience: "Sales e prospectores",
    icon: "📧",
    color: "yellow",
    status: "beta",
    hasDashboard: true,
    dashboardPath: "/dashboard/cold-email",
    apiPath: "/api/products/cold-email",
  },
  {
    id: "tax",
    name: "Tax",
    slug: "tax",
    category: "tool",
    priceType: "monthly",
    price: 49.90,
    currency: "BRL",
    description: "Assistente de impostos para freelancers. Cálculo de alíquotas, deduções e planejamento fiscal.",
    shortDescription: "Imposto fiscal simplificado",
    features: [
      "Cálculo automático de impostos",
      "Deduções otimizadas",
      "Alerta de vencimentos",
      "Planejamento anual",
      "Suporte por chat",
    ],
    targetAudience: "Freelancers PJ e autônomos",
    icon: "💰",
    color: "red",
    status: "live",
    hasDashboard: true,
    dashboardPath: "/dashboard/tax",
    apiPath: "/api/products/tax",
    launchDate: "2026-09-17",
  },
  {
    id: "destaque",
    name: "Destaque",
    slug: "destaque",
    category: "addon",
    priceType: "monthly",
    price: 99.90,
    currency: "BRL",
    description: "Realce seu perfil nos resultados de busca e em recomendações da plataforma.",
    shortDescription: "Visibilidade premium",
    features: [
      "Perfil em destaque na busca",
      "Insígnia de profissional em destaque",
      "Analytics detalhado de views",
      "Prioridade em recomendações",
      "Validação de perfil prioritária",
    ],
    targetAudience: "Freelancers que querem mais visibilidade",
    icon: "⭐",
    color: "indigo",
    status: "live",
    hasDashboard: true,
    dashboardPath: "/dashboard/destaque",
    apiPath: "/api/products/destaque",
    launchDate: "2026-09-17",
  },
  {
    id: "candidato",
    name: "Candidato",
    slug: "candidato",
    category: "free",
    priceType: "free",
    price: 0,
    currency: "BRL",
    description: "Perfil para candidatos a oportunidades de emprego e vagas diretas.",
    shortDescription: "Perfil para candidatos",
    features: [
      "Criar perfil de candidato",
      "Inscrição em vagas abertas",
      "Recomendação de vagas por IA",
      "Suporte por email",
    ],
    targetAudience: "Pessoas buscando novas oportunidades",
    icon: "👤",
    color: "slate",
    status: "live",
    hasDashboard: true,
    dashboardPath: "/dashboard/candidato",
    apiPath: "/api/products/candidato",
    launchDate: "2026-09-17",
  },
  {
    id: "certo-premium",
    name: "Certo Premium",
    slug: "certo-premium",
    category: "tool",
    priceType: "monthly",
    price: 199.90,
    currency: "BRL",
    description: "Suite completa: Tax + Invoice + Templates + Cold Email + Destaque.",
    shortDescription: "Bundle completo all-in-one",
    features: [
      "Tudo: Tax + Invoice + Templates + Cold Email",
      "Destaque automático",
      "Limite de uso ampliado",
      "Suporte prioritário 24h",
      "API access para integrações",
      "Consulta trimestral com especialista",
    ],
    targetAudience: "Freelancers sérios buscando solução completa",
    icon: "🚀",
    color: "pink",
    status: "live",
    hasDashboard: true,
    dashboardPath: "/dashboard/certo-premium",
    apiPath: "/api/products/certo-premium",
    launchDate: "2026-09-17",
  },
];

/**
 * Retorna um produto por ID
 */
export function getProductById(id: CommunityProductId): CommunityProduct | undefined {
  return COMMUNITY_PRODUCTS.find(p => p.id === id);
}

/**
 * Retorna o URL de checkout do Assinify para um produto
 * Usando env var com fallback para checkoutUrl hardcoded
 */
export function getCheckoutUrl(product: CommunityProduct): string | null {
  const envKey = `NEXT_PUBLIC_ASSINIFY_CHECKOUT_${product.id.toUpperCase().replace(/-/g, '_')}`;
  const envUrl = process.env[envKey]?.trim();

  return envUrl || product.checkoutUrl || null;
}

/**
 * Retorna todos os produtos filtrados por status
 */
export function getProductsByStatus(status: "live" | "beta" | "coming-soon"): CommunityProduct[] {
  return COMMUNITY_PRODUCTS.filter(p => p.status === status);
}

/**
 * Retorna todos os produtos live ou beta
 */
export function getAvailableProducts(): CommunityProduct[] {
  return COMMUNITY_PRODUCTS.filter(p => p.status !== "coming-soon");
}
