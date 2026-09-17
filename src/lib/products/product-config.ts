// Configuração dos produtos com links Assinify
export const PRODUCTS = {
  match: {
    id: 'certo-match',
    name: 'Certo Match',
    description: 'IA que compara suas habilidades com projetos e encontra as melhores oportunidades',
    icon: '⚡',
    color: 'blue',
    plans: {
      oneTime: {
        price: 2900, // R$ 29,00
        type: 'one-time',
        label: 'Acesso Único',
        assinifyLink: 'https://assinify.com.br/certo-match?price=2900&type=one-time',
      },
      monthly: {
        price: 1490, // R$ 14,90/mês
        type: 'monthly',
        label: 'Assinatura Mensal',
        assinifyLink: 'https://assinify.com.br/certo-match?price=1490&type=monthly',
      },
    },
  },
  preço: {
    id: 'certo-preço',
    name: 'Certo Preço',
    description: 'Engine de preços com IA que recomenda o valor ideal para seus projetos',
    icon: '💰',
    color: 'emerald',
    plans: {
      monthly: {
        price: 1490, // R$ 14,90/mês
        type: 'monthly',
        label: 'Assinatura Mensal',
        assinifyLink: 'https://assinify.com.br/certo-preço?price=1490&type=monthly',
      },
    },
  },
  timing: {
    id: 'certo-timing',
    name: 'Certo Timing',
    description: 'Recomendações com IA sobre o melhor momento para publicar seus projetos',
    icon: '⏰',
    color: 'orange',
    plans: {
      monthly: {
        price: 990, // R$ 9,90/mês
        type: 'monthly',
        label: 'Assinatura Mensal',
        assinifyLink: 'https://assinify.com.br/certo-timing?price=990&type=monthly',
      },
    },
  },
};

export const PRODUCT_ROUTES = {
  match: '/dashboard/products/match',
  preço: '/dashboard/products/preço',
  timing: '/dashboard/products/timing',
};

export type ProductKey = keyof typeof PRODUCTS;
export type Product = (typeof PRODUCTS)[ProductKey];

export function getProduct(key: ProductKey): Product {
  return PRODUCTS[key];
}

export function getAllProducts(): Product[] {
  return Object.values(PRODUCTS);
}
