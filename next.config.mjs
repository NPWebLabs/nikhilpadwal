/** @type {import('next').NextConfig} */
const nextConfig = {
  // Images go through the Next.js optimizer (sharp): resized per device and served as WebP.
  images: { formats: ["image/webp"], minimumCacheTTL: 2678400 },
  poweredByHeader: false,
  devIndicators: false,
  // Hostinger builds Next.js in standalone mode automatically; set STANDALONE=1 to test that locally.
  output: process.env.STANDALONE ? "standalone" : undefined,
  serverExternalPackages: ["mysql2"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};
export default nextConfig;
