import type { Metadata } from "next";
import { profile, SITE_URL } from "./data";
import { getPageSeo } from "./seoRepo";

export const SITE_NAME = "Nikhil Padwal";
export const DEFAULT_TITLE = `${SITE_NAME} | Lead Web Engineer & AI Specialist`;
export const DEFAULT_DESCRIPTION =
  "Nikhil Padwal is a lead web engineer and AI specialist: web engineering, SaaS development and AI innovation. 5 years and 50+ client websites on WordPress, WooCommerce, Shopify and Next.js.";
export const OG_IMAGE = { url: "/images/og-share.jpg", width: 1200, height: 630, alt: "Nikhil Padwal — web engineering, SaaS development and AI" };

export type PageMeta = {
  title?: string; // omitted on the homepage, which uses the root default title
  description: string;
  path: string; // "/case-studies/x"
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  canonical?: string; // absolute or site-relative; defaults to path
  keywords?: string[];
};

// Every page sets its own canonical, Open Graph and Twitter tags; Next.js replaces (not merges) these objects per page.
export function pageMeta({ title, description, path, image, type = "website", publishedTime, modifiedTime, noindex, canonical, keywords }: PageMeta): Metadata {
  const images = image ? [{ url: image }] : [OG_IMAGE];
  const ogTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: canonical || path },
    ...(keywords && keywords.length ? { keywords } : {}),
    openGraph: {
      type, url: path, siteName: SITE_NAME, locale: "en_IN", title: ogTitle, description, images,
      ...(publishedTime ? { publishedTime } : {}), ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: images.map((i) => i.url) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Fixed pages (home, indexes): defaults from code, overridden by admin → SEO. */
export async function staticPageMeta(defaults: PageMeta): Promise<Metadata> {
  const o = await getPageSeo(defaults.path);
  return pageMeta({
    ...defaults,
    title: o?.title || defaults.title,
    description: o?.description || defaults.description,
    image: o?.ogImage || defaults.image,
    noindex: o?.noindex || defaults.noindex,
  });
}

export { isRemote } from "./url";

export const absolute = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function personSchema() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name,
    alternateName: ["Nikhil Padwal", "Nik"],
    jobTitle: "Lead Web Engineer & AI Specialist",
    worksFor: { "@type": "Organization", name: "Claidroid", url: "https://claidroid.com/" },
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
