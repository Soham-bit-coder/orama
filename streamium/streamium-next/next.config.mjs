/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevents iframes embedded on your page from navigating the top-level window
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'; navigate-to 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
