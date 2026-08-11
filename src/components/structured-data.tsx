export interface StructuredDataProps {
  type: "Organization" | "WebPage" | "LocalBusiness" | "BreadcrumbList";
  data: Record<string, any>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Organization Schema
export const organizationSchema = {
  name: "PrestaCerto",
  description:
    "A plataforma que conecta freelancers e clientes com um modelo justo: assinatura fixa, pagamento direto, sem surpresas.",
  url: "https://prestacerto.com.br",
  logo: "https://prestacerto.com.br/logo.png",
  sameAs: [
    "https://twitter.com/prestacerto",
    "https://linkedin.com/company/prestacerto",
    "https://instagram.com/prestacerto",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    email: "support@prestacerto.com.br",
    availableLanguage: ["pt-BR", "en"],
  },
};

// Breadcrumb Schema
export function getBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url || undefined,
    })),
  };
}

// LocalBusiness Schema
export const localBusinessSchema = {
  "@type": "LocalBusiness",
  name: "PrestaCerto",
  image: "https://prestacerto.com.br/logo.png",
  description:
    "Marketplace de freelancers sem comissões. Conectamos talentos com oportunidades.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "BR",
    addressLocality: "Brasil",
    addressRegion: "Brasil",
  },
  priceRange: "$$",
  telephone: "+55 (11) 9999-9999",
  email: "support@prestacerto.com.br",
  url: "https://prestacerto.com.br",
  sameAs: [
    "https://twitter.com/prestacerto",
    "https://linkedin.com/company/prestacerto",
  ],
};

// FAQPage Schema
export function getFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
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
