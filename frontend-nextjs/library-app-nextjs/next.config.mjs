/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // ensure css handling is on default pipeline
  },
  async rewrites() {
    return [
      // Map dữ liệu cũ (BooksImages) sang thư mục đúng (BookImages)
      { source: '/Images/BooksImages/:path*', destination: '/Images/BookImages/:path*' },
    ];
  },
};

export default nextConfig;


