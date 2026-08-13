/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  // Performance optimizations
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
