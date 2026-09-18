// Open Graph + Schema.org - SEO MÁXIMO

export const siteConfig = {
  name: 'PrestaCerto',
  description: 'Marketplace de freelancers com IA - Encontre profissionais verificados',
  url: 'https://prestacerto.com.br',
  ogImage: 'https://prestacerto.com.br/og-image.jpg',
  twitter: '@prestacerto',
};

export function getOGImage(title: string) {
  return `${siteConfig.url}/og?title=${encodeURIComponent(title)}`;
}

export const schemas = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PrestaCerto',
    description: 'Marketplace de freelancers com IA',
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: ['https://twitter.com/prestacerto', 'https://linkedin.com/company/prestacerto'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'suporte@prestacerto.com.br',
    },
  },
  
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PrestaCerto',
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/services?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },

  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  product: (product: any) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    price: product.price,
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
    rating: product.rating || { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '500' },
  }),
};
