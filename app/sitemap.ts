import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{
    url: 'https://caduai.com.br/',
    lastModified: new Date('2026-08-28'),
    changeFrequency: 'weekly',
    priority: 1,
    images: [
      'https://caduai.com.br/og.png',
      'https://caduai.com.br/cadu-hero.jpg',
    ],
  }];
}
