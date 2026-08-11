import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://prestacerto.com.br";
const siteName = "PrestaCerto";
const siteDescription = "A plataforma que conecta freelancers e clientes com um modelo justo: assinatura fixa, pagamento direto, sem surpresas.";

export const defaultMetadata: Metadata = {
  title: {
    default: "PrestaCerto — Contrate talentos. Sem comissões.",
    template: "%s | PrestaCerto",
  },
  description: siteDescription,
  keywords: [
    "freelancer",
    "marketplace",
    "serviços",
    "projetos",
    "contratação",
    "Brasil",
    "sem comissão",
  ],
  authors: [{ name: "PrestaCerto" }],
  creator: "PrestaCerto",
  publisher: "PrestaCerto",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName,
    title: "PrestaCerto — Contrate talentos. Sem comissões.",
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteName,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrestaCerto — Contrate talentos. Sem comissões.",
    description: siteDescription,
    images: [`${siteUrl}/og-image.png`],
    creator: "@prestacerto",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Business",
};

export function getPageMetadata(
  title: string,
  description: string,
  path?: string,
  image?: string
): Metadata {
  const url = path ? `${siteUrl}${path}` : siteUrl;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName,
      title,
      description,
      images: image
        ? [
            {
              url: `${siteUrl}${image}`,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [
            {
              url: `${siteUrl}/og-image.png`,
              width: 1200,
              height: 630,
              alt: siteName,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [`${siteUrl}${image}`] : [`${siteUrl}/og-image.png`],
    },
    alternates: {
      canonical: url,
    },
  };
}

export function getArticleMetadata(
  title: string,
  description: string,
  publishedTime: string,
  path?: string,
  image?: string
): Metadata {
  const url = path ? `${siteUrl}${path}` : siteUrl;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      locale: "pt_BR",
      url,
      siteName,
      title,
      description,
      publishedTime,
      images: image
        ? [
            {
              url: `${siteUrl}${image}`,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [
            {
              url: `${siteUrl}/og-image.png`,
              width: 1200,
              height: 630,
              alt: siteName,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [`${siteUrl}${image}`] : [`${siteUrl}/og-image.png`],
    },
    alternates: {
      canonical: url,
    },
  };
}
