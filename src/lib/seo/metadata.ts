import type { Metadata } from "next";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://prestacerto.com.br"
).replace(/\/$/, "");
export const siteName = "PrestaCerto";
export const siteDescription =
  "Marketplace brasileiro para encontrar freelancers, publicar projetos e contratar talentos com negociação transparente e sem comissões escondidas.";
export const defaultSocialImage = `${siteUrl}/images/banners/prestacerto-principal.png`;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PrestaCerto — Freelancers e prestadores de serviços",
    template: "%s | PrestaCerto",
  },
  description: siteDescription,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  applicationName: siteName,
  category: "Business",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName,
    title: "PrestaCerto — Freelancers e prestadores de serviços",
    description: siteDescription,
    images: [
      {
        url: defaultSocialImage,
        width: 1920,
        height: 1080,
        alt: "Profissional em destaque para encontrar e contratar talentos no PrestaCerto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrestaCerto — Freelancers e prestadores de serviços",
    description: siteDescription,
    images: [defaultSocialImage],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: Array.from(new Set([
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      // Public ownership token supplied by the signed-in Search Console owner.
      'LUQhgWrOAVm9cJfSvC3qYrPxRniLb41KsHQZNMwg3Qg',
    ].filter((value): value is string => Boolean(value)))),
  },
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
    : defaultSocialImage;
  const brandedTitle = /(?:\||—|–|-)\s*PrestaCerto\s*$/i.test(title) ? title : `${title} | ${siteName}`;

  return {
    title: { absolute: brandedTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName,
      title: brandedTitle,
      description,
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
      description,
      images: [imageUrl],
    },
  };
}

export function getNoIndexMetadata(title: string, description?: string): Metadata {
  return {
    title,
    ...(description ? { description } : {}),
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        "max-image-preview": "none",
        "max-snippet": 0,
      },
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

export function describePage(text: string | null | undefined, fallback: string): string {
  const plain = (text || fallback).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (plain.length <= 160) return plain;
  return `${plain.slice(0, 157).replace(/\s+\S*$/, '')}…`;
}
