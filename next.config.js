/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'trungquandev.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
  },
}

module.exports = nextConfig
