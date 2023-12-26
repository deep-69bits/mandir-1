/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ["cdn.dribbble.com", "images.unsplash.com", "i.ytimg.com",],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    ACCESS_ID: process.env.ACCESS_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  },
};

module.exports = nextConfig;
