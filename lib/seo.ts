import type { Metadata } from "next";
import { profile, SITE_URL } from "./data";

export const SITE_NAME = "Nikhil Padwal";
export const OG_IMAGE = { url: "/images/og-share.jpg", width: 1200, height: 630, alt: "Nikhil Padwal — web engineering, SaaS development and AI" };

type PageMeta = {
  title?: string; // omitted on the homepage, which uses the root default title
  description: string;
  path: string; // "/case-studies/x"
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
};

// Every page sets its own canonical, Open Graph and Twitter tags; Next.js replaces (not merges) these objects per page.
export function pageMeta({ title, description, path, image, type = "website", publishedTime, noindex }: PageMeta): Metadata {
  const images = image ? [{ url: image }] : [OG_IMAGE];
  const ogTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Web Developer in Pune: Web, SaaS & AI`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { type, url: path, siteName: SITE_NAME, locale: "en_IN", title: ogTitle, description, images, ...(publishedTime ? { publishedTime } : {}) },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: images.map((i) => i.url) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

// Blog covers can be pasted URLs from any host; those skip the optimizer instead of needing remotePatterns.
export const isRemote = (src: string) => /^https?:\/\//i.test(src);

export const absolute =(path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function personSchema() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name,
    alternateName: ["Nikhil Padwal", "Nik"],
    jobTitle: "Web Developer — Web Engineering, SaaS Development & AI",
    description: profile.intro,
    email: `mailto:${profile.email}`,
    telephone: profile.phone.replace(/\s/g, ""),
    url: `${SITE_URL}/`,
    image: absolute("/images/nik-portrait.webp"),
    address: { "@type": "PostalAddress", addressLocality: "Pune", addressRegion: "Maharashtra", addressCountry: "IN" },
    sameAs: Object.values(profile.socials).map((s) => s.url),
    knowsAbout: ["WordPress", "WooCommerce", "Shopify", "Next.js", "React", "SaaS development", "Technical SEO", "Core Web Vitals", "OpenAI API", "AI chatbots"],
  };
}

export function websiteSchema() {
  return { "@type": "WebSite", "@id": WEBSITE_ID, url: `${SITE_URL}/`, name: SITE_NAME, inLanguage: "en", publisher: { "@id": PERSON_ID } };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absolute(it.path) })),
  };
}

export const graph = (...nodes: object[]) => JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
