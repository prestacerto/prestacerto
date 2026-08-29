import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://caduai.com.br/',
      lastModified: new Date('2026-08-29'),
      changeFrequency: 'weekly',
      priority: 1,
      images: [
        'https://caduai.com.br/og.png',
        'https://caduai.com.br/cadu-hero.jpg',
      ],
    },
    {
      url: 'https://caduai.com.br/privacidade',
      lastModified: new Date('2026-08-29'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: 'https://caduai.com.br/termos',
      lastModified: new Date('2026-08-29'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];
}
