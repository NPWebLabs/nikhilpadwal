import { z } from "zod";
import { slugify } from "./markdown";
import type { CaseInput } from "./caseStudies";

const text = (max: number) => z.string().trim().max(max).optional().default("");

export const caseSchema = z.object({
  name: z.string().trim().min(2, "Name needs at least 2 characters").max(200),
  slug: text(220),
  url: text(500),
  platform: z.string().trim().min(1).max(40).default("WordPress"),
  sector: z.string().trim().min(1).max(40).default("Corporate"),
  category: text(120),
  summary: text(1000),
  highlights: text(2000),
  image: text(500),
  featured: z.boolean().optional().default(false),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  sortOrder: z.coerce.number().int().min(-100000).max(100000).default(0),
  overview: text(3000),
  challenge: text(3000),
  approach: text(5000),
  outcome: text(3000),
  body: z.string().max(1_000_000).optional().default(""),
  seoTitle: text(200),
  metaDescription: text(300),
  ogImage: text(500),
  noindex: z.boolean().optional().default(false),
});

export function toCaseData(i: z.infer<typeof caseSchema>): CaseInput {
  const orNull = (s: string) => s || null;
  return {
    slug: slugify(i.slug || i.name) || `case-${Date.now()}`,
    name: i.name,
    url: i.url,
    platform: i.platform,
    sector: i.sector,
    category: i.category,
    summary: orNull(i.summary),
    highlights: orNull(i.highlights),
    image: orNull(i.image),
    featured: i.featured,
    status: i.status,
    sortOrder: i.sortOrder,
    overview: orNull(i.overview),
    challenge: orNull(i.challenge),
    approach: orNull(i.approach),
    outcome: orNull(i.outcome),
    body: orNull(i.body),
    seoTitle: orNull(i.seoTitle),
    metaDescription: orNull(i.metaDescription),
    ogImage: orNull(i.ogImage),
    noindex: i.noindex,
  };
}
