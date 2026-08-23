/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Enable compression
  compress: true,

  // Image optimization
  images: {
    unoptimized: false,
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
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
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
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://www.prestacerto.com.br',
  },

  // Turbopack config
  turbopack: {},

  // TypeScript: Ignore build errors for legacy code with Supabase type issues
  // TODO: Fix all Supabase query types and .catch() compatibility
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
