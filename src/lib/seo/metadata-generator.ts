// SEO Metadata Generator - MÁXIMA COBERTURA

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  robots?: string;
  author?: string;
  publishedDate?: string;
  updatedDate?: string;
}

export function generateMetadata(meta: PageMetadata) {
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords?.join(', '),
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: meta.ogType || 'website',
      images: meta.ogImage ? [{ url: meta.ogImage }] : undefined,
      url: meta.canonical,
    },
    twitter: {
      card: meta.twitterCard || 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: meta.ogImage ? [meta.ogImage] : undefined,
    },
    robots: meta.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    canonical: meta.canonical,
    alternates: {
      canonical: meta.canonical,
    },
    authors: meta.author ? [{ name: meta.author }] : undefined,
  };
}

export function generateJsonLd(type: string, data: Record<string, any>) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };
}
