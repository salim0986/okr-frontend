/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_URL: "http://localhost:3133",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
