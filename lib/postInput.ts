import { z } from "zod";
import { readingMinutes, slugify } from "./markdown";
import type { PostInput } from "./postsRepo";

export const postSchema = z.object({
  title: z.string().trim().min(3, "Title needs at least 3 characters").max(200),
  slug: z.string().trim().max(220).optional().default(""),
  excerpt: z.string().trim().max(600).optional().default(""),
  content: z.string().max(2_000_000).default(""),
  coverImage: z.string().trim().max(500).optional().default(""),
  tags: z.string().trim().max(300).optional().default(""),
  metaDescription: z.string().trim().max(300).optional().default(""),
  seoTitle: z.string().trim().max(200).optional().default(""),
  ogImage: z.string().trim().max(500).optional().default(""),
  canonicalUrl: z.string().trim().max(500).optional().default(""),
  focusKeyword: z.string().trim().max(120).optional().default(""),
  noindex: z.boolean().optional().default(false),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  publishedAt: z.string().optional().nullable(),
});

export function toPostData(input: z.infer<typeof postSchema>): PostInput {
  const slug = slugify(input.slug || input.title) || `post-${Date.now()}`;
  const parsedDate = input.publishedAt ? new Date(input.publishedAt) : null;
  const validDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null;
  return {
    title: input.title,
    slug,
    excerpt: input.excerpt || null,
    content: input.content,
    coverImage: input.coverImage || null,
    tags: input.tags ? input.tags.split(",").map((t) => t.trim()).filter(Boolean).join(", ") : null,
    metaDescription: input.metaDescription || null,
    seoTitle: input.seoTitle || null,
    ogImage: input.ogImage || null,
    canonicalUrl: input.canonicalUrl || null,
    focusKeyword: input.focusKeyword || null,
    noindex: input.noindex,
    status: input.status,
    readingMinutes: readingMinutes(input.content),
    publishedAt: input.status === "PUBLISHED" ? validDate || new Date() : validDate,
  };
}
