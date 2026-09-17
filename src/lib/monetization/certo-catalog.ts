export type CertoModuleStatus = "base" | "premium" | "planned";

export type CertoModule = {
  id: string;
  name: string;
  shortDescription: string;
  priceLabel: string;
  category: string;
  status: CertoModuleStatus;
  access: string;
  href: string;
};

export const CERTO_MODULES: CertoModule[] = [
  {
    id: "certo-ai",
    name: "Certo AI",
    shortDescription: "Organiza e melhora propostas sem inventar sua experiência.",
    priceLabel: "Incluído no Pro",
    category: "Propostas",
    status: "base",
    access: "Rascunho grátis; limites ampliados no Pro",
    href: "/certo-ai",
  },
  {
    id: "certo-match",
    name: "Certo Match",
    shortDescription: "Mostra compatibilidade entre seu perfil e cada projeto.",
    priceLabel: "R$ 2,90 por análise",
    category: "Propostas",
    status: "premium",
    access: "Análises avulsas e pacote mensal",
    href: "/dashboard/match",
  },
  {
    id: "certo-timing",
    name: "Certo Timing",
    shortDescription: "Sugere janelas de envio com base nos sinais disponíveis.",
    priceLabel: "R$ 9,90/mês",
    category: "Propostas",
    status: "premium",
    access: "Alertas e histórico no plano premium",
    href: "/dashboard/timing",
  },
  {
    id: "certo-negotiation",
    name: "Certo Negotiation",
    shortDescription: "Cria alternativas de escopo para você negociar com clareza.",
    priceLabel: "R$ 9,90/mês",
    category: "Propostas",
    status: "premium",
    access: "Sugestão básica grátis; histórico no premium",
    href: "/dashboard/pricing",
  },
  {
    id: "certo-preco",
    name: "Certo Preço",
    shortDescription: "Ajuda a estimar uma faixa de preço com base no escopo informado.",
    priceLabel: "R$ 14,90/mês",
    category: "Mercado",
    status: "premium",
    access: "Uma análise grátis por mês",
    href: "/dashboard/pricing",
  },
  {
    id: "certo-insights",
    name: "Certo Insights",
    shortDescription: "Transforma sinais agregados do marketplace em decisões de carreira.",
    priceLabel: "R$ 24,90/mês",
    category: "Mercado",
    status: "planned",
    access: "Insights básicos grátis; alertas no premium",
    href: "/dashboard/insights",
  },
  {
    id: "certo-trending",
    name: "Certo Trending",
    shortDescription: "Entrega alertas de habilidades com crescimento de demanda.",
    priceLabel: "R$ 9,90/mês",
    category: "Mercado",
    status: "premium",
    access: "Resumo semanal grátis; alertas filtrados no premium",
    href: "/dashboard/trending",
  },
  {
    id: "certo-dashboard",
    name: "Certo Dashboard",
    shortDescription: "Compara sua performance, preço, resposta e evolução por skill.",
    priceLabel: "R$ 14,90/mês",
    category: "Mercado",
    status: "planned",
    access: "Últimos 30 dias grátis; histórico completo no premium",
    href: "/dashboard/insights",
  },
  {
    id: "certo-badge",
    name: "Certo Badge",
    shortDescription: "Exibe conquistas verificáveis de reputação no perfil público.",
    priceLabel: "R$ 19,90/mês",
    category: "Reputação",
    status: "planned",
    access: "Badge básico grátis; destaque e verificações no premium",
    href: "/dashboard/premium",
  },
  {
    id: "certo-portfolio",
    name: "Certo Portfolio",
    shortDescription: "Organiza cases e resultados aprovados pelo freelancer.",
    priceLabel: "R$ 12,90/mês",
    category: "Reputação",
    status: "planned",
    access: "Portfólio básico grátis; analytics no premium",
    href: "/dashboard/portfolio",
  },
  {
    id: "certo-archive",
    name: "Certo Archive",
    shortDescription: "Biblioteca privada de estruturas de propostas autorizadas e anonimizadas.",
    priceLabel: "R$ 19,90/mês",
    category: "Reputação",
    status: "planned",
    access: "Amostra aberta; biblioteca completa no premium",
    href: "/certo-ai",
  },
  {
    id: "certo-certification",
    name: "Certo Certification",
    shortDescription: "Avaliações de habilidade com critérios, versão e validade visíveis.",
    priceLabel: "R$ 29,90 por certificação",
    category: "Reputação",
    status: "planned",
    access: "Certificação avulsa após avaliação",
    href: "/dashboard/premium",
  },
  {
    id: "certo-follow-up",
    name: "Certo Follow-up",
    shortDescription: "Sugere uma sequência respeitosa para retomar conversas sem spam.",
    priceLabel: "R$ 12,90/mês",
    category: "Crescimento",
    status: "planned",
    access: "Mensagens manuais grátis; sequência editável no premium",
    href: "/dashboard/messages",
  },
  {
    id: "certo-mentorship",
    name: "Certo Mentorship",
    shortDescription: "Conecta freelancers a mentores com experiência verificável.",
    priceLabel: "25% por sessão",
    category: "Crescimento",
    status: "planned",
    access: "Marketplace de mentorias com comissão por venda",
    href: "/community",
  },
  {
    id: "certo-network",
    name: "Certo Network",
    shortDescription: "Rede curada para projetos de maior escopo e profissionais elegíveis.",
    priceLabel: "R$ 49,90/mês",
    category: "Crescimento",
    status: "planned",
    access: "Convite e critérios objetivos de reputação",
    href: "/register?role=freelancer",
  },
  {
    id: "certo-escrow",
    name: "Certo Escrow",
    shortDescription: "Pagamento protegido com liberação por etapa e regras de disputa.",
    priceLabel: "5% por transação",
    category: "Transações",
    status: "planned",
    access: "Ativação após integração financeira e operação de suporte",
    href: "/como-funciona",
  },
];

export const CERTO_CATEGORIES = ["Propostas", "Mercado", "Reputação", "Crescimento", "Transações"] as const;

export function getCertoStatusLabel(status: CertoModuleStatus) {
  if (status === "base") return "Disponível na base";
  if (status === "premium") return "Oferta premium";
  return "Próxima onda";
}
