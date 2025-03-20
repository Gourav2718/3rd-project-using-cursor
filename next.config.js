/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.holidify.com', 'upload.wikimedia.org', 'www.maharashtratourism.gov.in', 'www.tourismofmaharashtra.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Disable font loading optimization which is causing issues
  experimental: {
    optimizeFonts: false,
  },
  // Disable Turbopack since it's causing issues with font loading
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    });
    return config;
  },
}

module.exports = nextConfig; 