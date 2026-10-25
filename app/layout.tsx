import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { profile } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nikhilpadwal.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `Nik — ${profile.name} | WordPress, Shopify & AI Web Developer`, template: "%s · Nik." },
  description:
    "Nikhil Shivaji Padwal (Nik) is a Pune-based WordPress, WooCommerce, Shopify and Next.js developer with 5 years of building fast, SEO-ready websites and stores, now with AI integrations.",
  keywords: ["WordPress developer Pune", "Shopify developer", "WooCommerce developer", "Next.js developer", "Core Web Vitals", "AI chatbot integration", "Nikhil Padwal"],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Nik.",
    title: "Nik, explained — WordPress, Shopify & AI web developer",
    description: profile.intro,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "Nik — web developer" }],
  },
  twitter: { card: "summary_large_image", title: "Nik, explained", description: profile.intro, images: ["/images/og.jpg"] },
  alternates: { canonical: "/" },
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
