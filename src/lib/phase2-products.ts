/**
 * FASE 2 — 8 PRODUTOS DE INTELIGÊNCIA
 * Implementação direto no Assinify
 * Data: 17/set/2026
 */

export type Phase2ProductId =
  | 'dashboard-ia'
  | 'insights'
  | 'badge'
  | 'certificacao'
  | 'biblioteca-proposta'
  | 'portfolio-ia'
  | 'followup-ia'
  | 'contra-proposta-ia';

export interface Phase2Product {
  id: Phase2ProductId;
  name: string;
  description: string;
  price: number;
  billingType: 'monthly' | 'one-time';
  assinifyProductId?: string; // Preenchido após criar no Assinify
  checkoutUrl?: string; // https://pay.assiny.com.br/{account_id}/node/{product_id}
  features: string[];
  icon: string;
}

export const PHASE2_PRODUCTS: Phase2Product[] = [
  {
    id: 'dashboard-ia',
    name: 'Dashboard IA',
    description: 'Analytics completo com recomendações inteligentes',
    price: 49.90,
    billingType: 'monthly',
    features: [
      'Analytics em tempo real',
      'Recomendações de propostas',
      'ROI por skill',
      'Relatórios mensais',
      'Exportar dados',
    ],
    icon: '📊',
  },
  {
    id: 'insights',
    name: 'Certo Insights',
    description: 'Market intelligence com trends de skills',
    price: 24.90,
    billingType: 'monthly',
    features: [
      'Skills em alta demanda',
      'Análise de competição',
      'Preços recomendados',
      'Alertas de oportunidades',
      'Relatório semanal',
    ],
    icon: '🔍',
  },
  {
    id: 'badge',
    name: 'Certo Badge',
    description: 'Badges verificados (Verified, Top, Quality)',
    price: 19.90,
    billingType: 'monthly',
    features: [
      'Badge Verified Developer',
      'Badge Top Developer',
      'Badge Quality Work',
      'Destaque no perfil',
      'Validação mensal',
    ],
    icon: '✨',
  },
  {
    id: 'certificacao',
    name: 'Certo Certificação',
    description: 'Certificação permanente de skills',
    price: 29.90,
    billingType: 'one-time',
    features: [
      'Certificado verificado',
      'Visível por 24 meses',
      'Emitido por PrestaCerto',
      'Compartilhável em redes',
      'Sem renovação necessária',
    ],
    icon: '🎓',
  },
  {
    id: 'biblioteca-proposta',
    name: 'Biblioteca de Propostas IA',
    description: 'Arquivo de propostas vencedoras + templates',
    price: 19.90,
    billingType: 'monthly',
    features: [
      'Propostas vencedoras por skill',
      '500+ templates',
      'Busca por cliente/projeto',
      'Análise de sucesso',
      'Download em PDF',
    ],
    icon: '📚',
  },
  {
    id: 'portfolio-ia',
    name: 'Certo Portfolio IA',
    description: 'Portfolio automático baseado em IA',
    price: 12.90,
    billingType: 'monthly',
    features: [
      'Geração automática',
      'Atualização contínua',
      'Temas profissionais',
      'URL customizada',
      'Analytics de visitantes',
    ],
    icon: '🎨',
  },
  {
    id: 'followup-ia',
    name: 'Certo Follow-up IA',
    description: 'Sequência automática de contatos inteligente',
    price: 12.90,
    billingType: 'monthly',
    features: [
      'Automação de seguimentos',
      'Timing inteligente',
      'Personalisação por IA',
      'Rastreamento de respostas',
      'Relatório de conversão',
    ],
    icon: '💬',
  },
  {
    id: 'contra-proposta-ia',
    name: 'Certo Contra-proposta IA',
    description: 'Gerador de contra-ofertas inteligentes',
    price: 9.90,
    billingType: 'monthly',
    features: [
      'Análise de mercado',
      'Contra-ofertas sugeridas',
      'Negociação assistida',
      'Histórico de negociações',
      'Tática de preço IA',
    ],
    icon: '🤝',
  },
];

/**
 * Obter link de checkout do produto
 * Padrão: https://pay.assiny.com.br/{account_id}/node/{product_id}
 */
export function getPhase2CheckoutUrl(product: Phase2Product): string | null {
  const override =
    process.env[`NEXT_PUBLIC_ASSINIFY_${product.id.toUpperCase().replace(/-/g, '_')}`];

  return override?.trim() || product.checkoutUrl || null;
}

/**
 * Total de receita estimada FASE 2
 * 8 produtos x preços
 */
export const PHASE2_ESTIMATED_MRR = PHASE2_PRODUCTS.filter(
  (p) => p.billingType === 'monthly'
).reduce((sum, p) => sum + p.price, 0);

export const PHASE2_ONE_TIME_REVENUE = PHASE2_PRODUCTS.filter(
  (p) => p.billingType === 'one-time'
)
  .reduce((sum, p) => sum + p.price, 0)
  .toFixed(2);
