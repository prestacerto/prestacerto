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

  // Image optimization - AGGRESSIVE
  images: {
    // Avatares vêm do Supabase Storage / Google e não estão em remotePatterns;
    // ligar a otimização quebraria essas páginas em runtime.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.prestacerto.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    minimumCacheTTL: 3600, // 1 hour
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Production optimizations
  productionBrowserSourceMaps: false,

  // Enable experimental features
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
    optimizeCss: true,
    nextScriptWorkers: true,
  },

  // Headers for performance + security
  async headers() {
    return [
      {
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
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
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
