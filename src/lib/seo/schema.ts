// SEO Schema.org Structured Data
// Otimizado para Google e ranking

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PrestaCerto",
    description: "Marketplace de freelancers com 27 produtos de monetização (CERTO Ecosystem)",
    url: "https://prestacerto.com.br",
    logo: "https://prestacerto.com.br/logo.png",
    sameAs: [
      "https://twitter.com/prestacerto",
      "https://instagram.com/prestacerto",
      "https://linkedin.com/company/prestacerto",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      telephone: "+55-11-99999-9999",
      email: "support@prestacerto.com.br",
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  price: number;
  category: string;
  rating?: number;
  reviews?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.description,
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: product.price.toString(),
      priceCurrency: "BRL",
    },
    aggregateRating: product.rating ? {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews || 1,
    } : undefined,
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "PrestaCerto",
    description: "Marketplace de Freelancers Brasil",
    url: "https://prestacerto.com.br",
    telephone: "+55-11-99999-9999",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Paulista, 1000",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      postalCode: "01311-100",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-23.561414",
      longitude: "-46.656139",
    },
  };
}
