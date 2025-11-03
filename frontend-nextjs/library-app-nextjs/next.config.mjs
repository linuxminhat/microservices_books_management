/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  async rewrites() {
    return [
      { source: '/Images/BooksImages/:path*', destination: '/Images/BookImages/:path*' },
    ];
  },
};

export default nextConfig;


