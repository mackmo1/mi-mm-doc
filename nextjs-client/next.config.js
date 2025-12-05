/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for development
  reactStrictMode: true,

  // SCSS/Sass configuration is built-in with Next.js
  // Just install 'sass' package and it works automatically

  // Sass options for customization
  sassOptions: {
    // Include paths for @import statements
    includePaths: ['./styles'],
    // Silence deprecation warnings for legacy sass features
    silenceDeprecations: ['legacy-js-api'],
  },

  // Image optimization configuration
  images: {
    // Allow base64 images and remote images if needed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Disable image optimization for base64 images
    unoptimized: false,
  },

  // Environment variables that should be available on the client
  // Note: NEXT_PUBLIC_ prefix makes them available in browser
  env: {
    // Internal API URL (for BFF routes)
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  },

  // Experimental features (if needed)
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },

  // Webpack configuration for additional customization
  webpack: (config, { isServer }) => {
    // Add any custom webpack configurations here
    return config;
  },

  // Redirects (if needed for migration)
  async redirects() {
    return [];
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
