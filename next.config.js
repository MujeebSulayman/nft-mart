/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { 
            key: 'Access-Control-Allow-Origin', 
            value: process.env.NODE_ENV === 'production'
              ? 'https://nft-mart-seven.vercel.app'
              : 'http://localhost:3000, https://nft-mart-seven.vercel.app' 
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
