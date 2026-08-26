import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://cadu-ai.kadusima.chatgpt.site/', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 }];
}
