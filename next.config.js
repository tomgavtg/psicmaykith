/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel's Next.js build adapter packages the server output itself. Keeping
  // `standalone` enabled there makes Next.js 16.3 try to copy tracing files
  // after the adapter has already consumed them. Docker still needs the
  // standalone server, so only enable it outside Vercel builds.
  output: process.env.VERCEL ? undefined : "standalone",
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "psicologamayumikitahara.com",
          },
        ],
        destination:
          "https://www.psicologamayumikitahara.com/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
