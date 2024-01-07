/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "trungquandev.com" }],
  },
}

module.exports = nextConfig
