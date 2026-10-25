import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { projects } from "@/lib/projects";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://nikhilpadwal.com";
  const posts = await getPublishedPosts();
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/case-studies`, changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((p) => ({ url: `${base}/case-studies/${p.slug}`, priority: 0.7 })),
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.publishedAt ?? undefined, priority: 0.6 })),
    { url: `${base}/nikhil-padwal-resume.pdf`, changeFrequency: "yearly", priority: 0.5 },
  ];
}
