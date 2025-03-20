/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'www.holidify.com',
      'www.maharashtratourism.gov.in',
      'upload.wikimedia.org',
      'www.tourismofmaharashtra.com',
    ],
  },
  // Disable font loading optimization which is causing issues
  experimental: {
    optimizeFonts: false,
  },
  // Disable Turbopack since it's causing issues with font loading
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig; 