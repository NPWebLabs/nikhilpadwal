/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
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
