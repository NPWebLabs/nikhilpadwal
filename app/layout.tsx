import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { profile, SITE_URL } from "@/lib/data";
import { OG_IMAGE, SITE_NAME } from "@/lib/seo";

// Site-wide defaults only. Canonical, Open Graph URL and Twitter tags are set per page via pageMeta() in lib/seo.ts.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | Web Developer in Pune: Web, SaaS & AI`, template: `%s | ${SITE_NAME}` },
  description:
    "Nikhil Padwal is a Pune-based web developer: web engineering, SaaS development and AI innovation. 5 years and 50+ client websites on WordPress, WooCommerce, Shopify and Next.js.",
  applicationName: SITE_NAME,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_IN", images: [OG_IMAGE] },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#f3f3f1", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
