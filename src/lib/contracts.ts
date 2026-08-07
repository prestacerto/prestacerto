// Sistema de contratos automáticos por categoria

export type ContractTier = 'free' | 'premium' | 'pro';

export interface ContractTemplate {
  id: string;
  category: string;
  name: string;
  description: string;
  sections: ContractSection[];
  tier: ContractTier;
  price?: number;
  includes: string[];
}

export interface ContractSection {
  title: string;
  content: string;
  editable: boolean;
}

export const CONTRACT_TEMPLATES: Record<string, ContractTemplate> = {
  'desenvolvimento-web': {
    id: 'dev-web-free',
    category: 'desenvolvimento-web',
    name: 'Contrato de Desenvolvimento Web',
    description: 'Template padrão para projetos de desenvolvimento web',
    tier: 'free',
    includes: ['Escopo do projeto', 'Prazos e entregas', 'Termos de pagamento', 'Responsabilidades'],
    sections: [
      {
        title: 'Escopo do Projeto',
        content: `1. DESCRIÇÃO DO PROJETO
O Cliente contrata o Freelancer para realizar os seguintes serviços:
- [Detalhe os serviços aqui]

2. DELIVERABLES
Os seguintes entregáveis são esperados:
- [Liste os deliverables]`,
        editable: true,
      },
      {
        title: 'Prazos e Entregas',
        content: `1. CRONOGRAMA
- Data de início: [DATA]
- Data de conclusão: [DATA]
- Entregas intermediárias: [DATAS]

2. ATRASOS
Em caso de atraso não justificado, será cobrada multa de [VALOR] por dia útil.`,
        editable: true,
      },
      {
        title: 'Pagamento',
        content: `1. VALOR DO PROJETO
Valor total: R$ [VALOR]
Forma de pagamento: [MEIO]
Parcelamento: [CONDIÇÕES]

2. CONDIÇÕES
- 50% na assinatura deste contrato
- 50% na entrega final`,
        editable: true,
      },
      {
        title: 'Propriedade Intelectual',
        content: `Todos os direitos sobre o trabalho desenvolvido serão transferidos ao Cliente após a confirmação do pagamento integral.`,
        editable: false,
      },
    ],
  },
  'design-grafico': {
    id: 'design-free',
    category: 'design-grafico',
    name: 'Contrato de Design Gráfico',
    description: 'Template para projetos de design',
    tier: 'free',
    includes: ['Briefing', 'Revisões', 'Entrega', 'Uso de ativos'],
    sections: [
      {
        title: 'Briefing e Conceito',
        content: `1. BRIEFING
O Cliente fornecerá as seguintes informações:
- [Detalhes do projeto]

2. CONCEITOS
O Freelancer apresentará [NÚMERO] conceitos iniciais.`,
        editable: true,
      },
      {
        title: 'Revisões e Ajustes',
        content: `1. RODADAS DE REVISÃO
Número de rodadas incluídas: [NÚMERO]
Cada rodada inclui ajustes menores no conceito aprovado.

2. REVISÕES ADICIONAIS
Revisões além do incluso serão cobradas em R$ [VALOR].`,
        editable: true,
      },
    ],
  },
};

// Premium templates com cláusulas avançadas
export const PREMIUM_ADDONS = [
  {
    name: 'NDA (Non-Disclosure Agreement)',
    description: 'Proteção de confidencialidade',
    price: 29,
  },
  {
    name: 'Cláusula de IP Transfer Completo',
    description: 'Transferência total de propriedade intelectual',
    price: 49,
  },
  {
    name: 'Escrow + Garantia de Entrega',
    description: 'Proteção com depósito intermediário',
    price: 99,
  },
  {
    name: 'Contrato de Manutenção (1 ano)',
    description: 'Suporte e manutenção pós-projeto',
    price: 199,
  },
];
