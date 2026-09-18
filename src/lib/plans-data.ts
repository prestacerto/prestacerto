// Fonte única dos planos — usada na Home e em /plans. O protótipo anterior
// (Base44) tinha listas de benefícios DIFERENTES pra Home e pra /plans pro
// mesmo plano; aqui os dois lugares importam deste mesmo arquivo, então não
// tem como divergir.
export type PlanId = "free" | "pro" | "business";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  priceMonthly: number;
  description: string;
  features: string[];
  popular?: boolean;
  comingSoon?: boolean;
  /**
   * Link de checkout de recorrência no Assiny (pay.assiny.com.br). A
   * confirmação da assinatura volta pelo webhook em /api/webhooks/assiny, que
   * é quem promove o plano do usuário.
   */
  checkoutUrl?: string;
}

export const PLANS: PlanDefinition[] = [
  {
    id: "free",
    name: "Grátis",
    priceMonthly: 0,
    description: "Para começar e testar a plataforma",
    features: [
      "Criar perfil de freelancer",
      "Até 3 propostas por mês",
      "Acesso a projetos abertos",
      "Certo Propostas: PDF e biblioteca no navegador",
      "Certo AI: 3 reescritas de proposta por mês",
      "Certo Oportunidades com projetos personalizados",
      "Total semanal de visualizações do perfil",
      "Suporte por e-mail",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 59.9,
    description: "Para quem quer mais visibilidade e propostas ilimitadas",
    features: [
      "Tudo do Grátis",
      "Propostas ilimitadas",
      "Destaque nos resultados de busca",
      "Certo AI para montar propostas",
      "Certo Propostas: PDF com sua marca e cores",
      "Filtros e projetos salvos no Certo Oportunidades",
      "Evolução diária das visualizações do perfil",
      "Suporte prioritário",
    ],
    popular: true,
    checkoutUrl: "https://pay.assiny.com.br/ba2d4a/node/rtlXli",
  },
  {
    id: "business",
    name: "Business",
    priceMonthly: 139.9,
    description: "Para quem usa o Certo AI com mais frequência",
    features: [
      "Tudo do Pro",
      "Maior capacidade mensal de uso do Certo AI",
      "Certo AI com limite de uso ampliado conforme o plano",
      "Job Matching com IA para priorizar oportunidades relevantes",
      "Destaque de serviços e projetos elegíveis",
      "Fila e suporte prioritários",
      "Propostas ilimitadas",
      "PDF de propostas com sua marca e cores",
      "Filtros e projetos salvos no Certo Oportunidades",
    ],
    checkoutUrl: "https://pay.assiny.com.br/e7ab2f/node/nS2aYi",
  },
];

/**
 * Link de checkout do plano, se houver. Uma env var por plano permite trocar a
 * oferta no Assiny sem novo deploy; sem link o CTA cai no formulário de lista
 * de interesse em vez de apontar para um endereço quebrado.
 */
export function getCheckoutUrl(plan: PlanDefinition): string | null {
  const override =
    plan.id === "pro"
      ? process.env.NEXT_PUBLIC_ASSINIFY_CHECKOUT_PRO
      : plan.id === "business"
        ? process.env.NEXT_PUBLIC_ASSINIFY_CHECKOUT_BUSINESS
        : undefined;

  return override?.trim() || plan.checkoutUrl || null;
}
