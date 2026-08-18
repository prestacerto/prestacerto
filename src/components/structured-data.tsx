type SchemaType =
  | "Organization"
  | "WebPage"
  | "WebSite"
  | "WebApplication"
  | "LocalBusiness"
  | "BreadcrumbList"
  | "FAQPage";

interface StructuredDataProps {
  type: SchemaType;
  data: Record<string, unknown>;
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

export const organizationSchema = {
  name: "PrestaCerto",
  description:
    "Marketplace brasileiro que conecta clientes a freelancers e prestadores de serviços com negociação transparente.",
  url: "https://www.prestacerto.com.br",
  logo: "https://www.prestacerto.com.br/prestacerto-logo.svg",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "contato@prestacerto.com.br",
    availableLanguage: "pt-BR",
  },
};

export const websiteSchema = {
  name: "PrestaCerto",
  url: "https://www.prestacerto.com.br",
  description:
    "Encontre freelancers, publique projetos e contrate talentos sem comissões escondidas.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://www.prestacerto.com.br/services?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export function getBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

export const localBusinessSchema = {
  "@type": "Organization",
  name: "PrestaCerto",
  image: "https://www.prestacerto.com.br/prestacerto-logo.svg",
  description:
    "Marketplace brasileiro de freelancers e serviços profissionais.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "BR",
  },
  url: "https://www.prestacerto.com.br",
};

export function getFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
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
