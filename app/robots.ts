import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/signin-with-chatgpt', '/signout-with-chatgpt'],
    },
    sitemap: 'https://caduai.com.br/sitemap.xml',
    host: 'https://caduai.com.br',
  };
}
