import type { Metadata } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://www.prestacerto.com.br"
).replace(/\/$/, "");
const siteName = "PrestaCerto";
const siteDescription =
  "Marketplace brasileiro para encontrar freelancers, publicar projetos e contratar talentos com negociação transparente e sem comissões escondidas.";
const socialImage = `${siteUrl}/prestacerto-logo.svg`;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PrestaCerto — Contrate talentos. Sem comissões.",
    template: "%s | PrestaCerto",
  },
  description: siteDescription,
  keywords: [
    "freelancer",
    "freelancers no Brasil",
    "contratar freelancer",
    "prestador de serviço",
    "marketplace de serviços",
    "projetos freelance",
    "trabalho freelancer",
    "serviços profissionais",
    "sem comissão",
    "PrestaCerto",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  applicationName: siteName,
  category: "Business",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName,
    title: "PrestaCerto — Contrate talentos. Sem comissões.",
    description: siteDescription,
    images: [
      {
        url: socialImage,
        width: 512,
        height: 512,
        alt: "Logo do PrestaCerto",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "PrestaCerto — Contrate talentos. Sem comissões.",
    description: siteDescription,
    images: [socialImage],
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
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export function getPageMetadata(
  title: string,
  description: string,
  path = "/",
  image?: string,
): Metadata {
  const url = `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image.startsWith("/") ? image : `/${image}`}`
    : socialImage;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName,
      title,
      description,
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function getArticleMetadata(
  title: string,
  description: string,
  publishedTime: string,
  path = "/",
  image?: string,
): Metadata {
  const pageMetadata = getPageMetadata(title, description, path, image);
  return {
    ...pageMetadata,
    openGraph: {
      ...pageMetadata.openGraph,
      type: "article",
      publishedTime,
    },
  };
}
