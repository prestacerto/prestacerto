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
      "Suporte por e-mail",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 49,
    description: "Para freelancers que querem crescer",
    features: [
      "Tudo do Grátis",
      "Propostas ilimitadas",
      "Destaque nos resultados",
      "Badge de verificado",
      "Suporte prioritário",
    ],
    popular: true,
    comingSoon: true,
  },
  {
    id: "business",
    name: "Business",
    priceMonthly: 129,
    description: "Para equipes e agências",
    features: [
      "Tudo do Pro",
      "Até 5 membros na equipe",
      "Projetos privados",
      "Gerente de conta dedicado",
    ],
    comingSoon: true,
  },
];
