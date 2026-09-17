/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Enable compression
  compress: true,

  async redirects() {
    return [
      { source: '/privacy', destination: '/privacidade', permanent: true },
      { source: '/certo-ai/pricing', destination: '/ferramentas/calculadora', permanent: true },
    ];
  },

  // Image optimization
  images: {
    // A configuração de serviços da Vercel roteia imagens estáticas, mas não
    // expõe o endpoint /_next/image. Servir as imagens diretamente evita
    // banners, avatares e portfólios quebrados em produção.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.prestacerto.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    minimumCacheTTL: 600,
  },

  // Production optimizations
  productionBrowserSourceMaps: false,

  // Enable experimental features
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
    optimizeCss: true,
    nextScriptWorkers: true,
  },

  // Headers for performance
  async headers() {
    return [
      {
        // These files are versioned; update the directory when changing bytes.
        source: '/images/marketing/v1/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },

  // Environmental variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://prestacerto.com.br',
  },

  // Turbopack config
  turbopack: {
    root: __dirname,
  },

  // Never ship a production build that hides type errors.
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
