/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    env: {
        API_URL: process.env.NEXT_PUBLIC_API_URL,
        ENVIRONMENT: process.env.NEXT_PUBLIC_ENV,
      },
};

module.exports = nextConfig;
