import { serializeJsonLd } from '@/lib/seo/discovery';

type SchemaType =
  | "Organization"
  | "WebPage"
  | "WebSite"
  | "WebApplication"
  | "ProfilePage"
  | "Service"
  | "Article"
  | "LocalBusiness"
  | "BreadcrumbList"
  | "FAQPage"
  | "CollectionPage"
  | "ContactPage"
  | "ItemList";

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
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  );
}

export const organizationSchema = {
  name: "PrestaCerto",
  taxID: "68.949.661/0001-00",
  description:
    "Marketplace brasileiro que conecta clientes a freelancers e prestadores de serviços com negociação transparente.",
  url: "https://prestacerto.com.br",
  logo: "https://prestacerto.com.br/prestacerto-logo.svg",
  sameAs: ["https://www.instagram.com/prestacerto/"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "contato@prestacerto.com.br",
    availableLanguage: "pt-BR",
  },
};

export const websiteSchema = {
  name: "PrestaCerto",
  url: "https://prestacerto.com.br",
  description:
    "Encontre freelancers, publique projetos e contrate talentos sem comissões escondidas.",
  inLanguage: "pt-BR",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://prestacerto.com.br/services?q={search_term_string}",
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
  image: "https://prestacerto.com.br/prestacerto-logo.svg",
  description:
    "Marketplace brasileiro de freelancers e serviços profissionais.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "BR",
  },
  url: "https://prestacerto.com.br",
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

export function getCollectionPageSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    inLanguage: "pt-BR",
  };
}

export function getContactPageSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name,
    description,
    url,
    inLanguage: "pt-BR",
  };
}
