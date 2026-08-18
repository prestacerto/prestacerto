/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output for better Vercel compatibility
  output: 'standalone',

  // Enable compression
  compress: true,

  // Image optimization
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    domains: ['cdn.prestacerto.com', 'images.unsplash.com'],
    minimumCacheTTL: 0, // no cache
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
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
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
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
    ];
  },

  // Rewrites
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/health',
      },
    ];
  },

  // Environmental variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://prestacerto.com.br',
  },

  // Turbopack config
  turbopack: {},

  // Disable type checking in build for speed
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
