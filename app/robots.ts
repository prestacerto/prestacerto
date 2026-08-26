import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/dashboard', '/signin-with-chatgpt'] }, sitemap: 'https://cadu-ai.kadusima.chatgpt.site/sitemap.xml' };
}
