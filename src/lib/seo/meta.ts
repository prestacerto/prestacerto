// SEO Meta Tags & Open Graph
// Otimizado para ranking Google + social media

export const SEO_CONFIG = {
  // Site base
  siteName: "PrestaCerto",
  siteUrl: "https://prestacerto.com.br",
  
  // Keywords por página (long-tail para ranking)
  keywords: {
    home: "freelancer marketplace Brasil, ganhar dinheiro como freelancer, plataforma de freelancers, CERTO Ecosystem monetização",
    match: "matching freelancer projeto, encontrar projetos como freelancer, algoritmo matching IA",
    pricing: "calcular preço freelancer, dynamic pricing, quanto cobrar como freelancer",
    timing: "melhor hora enviar proposta, golden hour freelancer, timing análise",
    products: "produtos monetização freelancer, CERTO Match Preço Timing, 27 produtos freelancer",
  },

  // Meta descriptions (50-160 chars)
  descriptions: {
    home: "PrestaCerto: marketplace de freelancers com 27 produtos CERTO para monetizar. Ganhe até R$ 745k/mês com Match, Preço, Timing e mais.",
    match: "CERTO Match: IA que calcula sua chance de ganhar cada projeto. Score 0-100 + bid recomendado. R$ 2,90/proposta.",
    pricing: "CERTO Preço: dynamic pricing que recomenda o melhor valor. +35% no faturamento com ajustes de demanda, experiência e mercado.",
    timing: "CERTO Timing: descubra o melhor momento para enviar propostas. +40% de resposta analisando padrões do cliente.",
    products: "27 produtos CERTO para freelancer: Match, Preço, Timing, Insights, Badge, Certificação, Tax, Academy e mais. Ganhe mais.",
  },

  // Open Graph para social
  og: {
    type: "website",
    locale: "pt_BR",
    image: "https://prestacerto.com.br/og-image.png",
    imageWidth: 1200,
    imageHeight: 630,
  },

  // Twitter Card
  twitter: {
    handle: "@prestacerto",
    card: "summary_large_image",
  },

  // Canonical URLs
  canonical: (path: string) => `${SEO_CONFIG.siteUrl}${path}`,

  // Robots & Indexing
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  
  // Language
  language: "pt-BR",
};

export function generateMetaTags(pageData: {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  path: string;
}) {
  return {
    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords,
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      url: SEO_CONFIG.canonical(pageData.path),
      type: SEO_CONFIG.og.type,
      locale: SEO_CONFIG.og.locale,
      images: [
        {
          url: pageData.image || SEO_CONFIG.og.image,
          width: SEO_CONFIG.og.imageWidth,
          height: SEO_CONFIG.og.imageHeight,
          alt: pageData.title,
        },
      ],
      siteName: SEO_CONFIG.siteName,
    },
    twitter: {
      handle: SEO_CONFIG.twitter.handle,
      card: SEO_CONFIG.twitter.card,
      title: pageData.title,
      description: pageData.description,
      image: pageData.image || SEO_CONFIG.og.image,
    },
    robots: SEO_CONFIG.robots,
    canonical: SEO_CONFIG.canonical(pageData.path),
    alternates: {
      canonical: SEO_CONFIG.canonical(pageData.path),
    },
  };
}

// Sitemap entry
export function generateSitemapEntry(path: string, priority: number = 0.8) {
  return {
    url: SEO_CONFIG.canonical(path),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority,
  };
}
