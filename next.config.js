/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,

  // Image optimization
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    domains: ['cdn.prestacerto.com', 'images.unsplash.com'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // Production optimizations
  productionBrowserSourceMaps: false,
  swcMinify: true,

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
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=120' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
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

  // Webpack optimization
  webpack: (config, { isServer }) => {
    config.optimization = {
      ...config.optimization,
      minimize: true,
      usedExports: true,
      sideEffects: false,
    };

    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        common: {
          minChunks: 2,
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;
