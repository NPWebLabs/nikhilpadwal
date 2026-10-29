import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bodoni-moda/opsz.css";
import "@fontsource-variable/bodoni-moda/opsz-italic.css";
import "@fontsource-variable/hanken-grotesk/index.css";
import "@fontsource/mrs-saint-delafield/400.css";
import "./globals.css";
import { profile, SITE_URL } from "@/lib/data";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, OG_IMAGE, SITE_NAME } from "@/lib/seo";
import { getSettings } from "@/lib/settings";

// Site-wide defaults (editable in admin → SEO). Canonical, Open Graph URL and Twitter tags are set per page via pageMeta().
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings(["site_title", "site_description", "default_og_image", "google_verification", "bing_verification"]);
  const ogImage = s.default_og_image ? { url: s.default_og_image } : OG_IMAGE;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: s.site_title || DEFAULT_TITLE, template: `%s | ${SITE_NAME}` },
    description: s.site_description || DEFAULT_DESCRIPTION,
    applicationName: SITE_NAME,
    authors: [{ name: profile.name, url: SITE_URL }],
    creator: profile.name,
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_IN", images: [ogImage] },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false },
    verification: {
      ...(s.google_verification ? { google: s.google_verification } : {}),
      ...(s.bing_verification ? { other: { "msvalidate.01": s.bing_verification } } : {}),
    },
  };
}

export const viewport: Viewport = { themeColor: "#0e0d0b", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
