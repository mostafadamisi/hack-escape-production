/** @type {import('next').NextConfig} */
const BACKEND = (process.env.BACKEND_URL || 'http://localhost:5001').replace(/\/$/, '');

const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${BACKEND}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
