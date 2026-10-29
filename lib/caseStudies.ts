import "server-only";
import { query, execute, dbConfigured } from "./db";
import { projects as staticProjects, type Project } from "./projects";
import { getSetting, setSetting } from "./settings";

export type CaseStatus = "DRAFT" | "PUBLISHED";
export type CaseRow = {
  id: number;
  slug: string;
  name: string;
  url: string;
  platform: string;
  sector: string;
  category: string;
  summary: string | null;
  highlights: string | null; // one per line
  image: string | null;
  featured: boolean;
  status: CaseStatus;
  sortOrder: number;
  overview: string | null;
  challenge: string | null;
  approach: string | null; // one per line
  outcome: string | null;
  body: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  noindex: boolean;
  createdAt: Date;
  updatedAt: Date;
};
export type CaseInput = Omit<CaseRow, "id" | "createdAt" | "updatedAt">;

const COLS = `id, slug, name, url, platform, sector, category, summary, highlights, image, featured = 1 AS featured, status,
  sort_order AS sortOrder, overview, challenge, approach, outcome, body, seo_title AS seoTitle, meta_description AS metaDescription,
  og_image AS ogImage, noindex = 1 AS noindex, created_at AS createdAt, updated_at AS updatedAt`;
const FIELDS = `slug, name, url, platform, sector, category, summary, highlights, image, featured, status, sort_order, overview,
  challenge, approach, outcome, body, seo_title, meta_description, og_image, noindex`;
const values = (d: CaseInput) => [
  d.slug, d.name, d.url, d.platform, d.sector, d.category, d.summary, d.highlights, d.image, d.featured ? 1 : 0, d.status, d.sortOrder,
  d.overview, d.challenge, d.approach, d.outcome, d.body, d.seoTitle, d.metaDescription, d.ogImage, d.noindex ? 1 : 0,
];

const bools = (r: CaseRow): CaseRow => ({ ...r, featured: Boolean(Number(r.featured)), noindex: Boolean(Number(r.noindex)) });

const lines = (s?: string | null) => (s || "").split("\n").map((x) => x.trim()).filter(Boolean);

export function rowToProject(r: CaseRow): Project {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    url: r.url,
    platform: r.platform,
    sector: r.sector,
    category: r.category,
    summary: r.summary || "",
    highlights: lines(r.highlights),
    image: r.image || undefined,
    featured: Boolean(r.featured),
    caseStudy: { overview: r.overview || "", challenge: r.challenge || "", approach: lines(r.approach), outcome: r.outcome || "" },
    body: r.body,
    seoTitle: r.seoTitle,
    metaDescription: r.metaDescription,
    ogImage: r.ogImage,
    noindex: Boolean(r.noindex),
    updatedAt: r.updatedAt,
  };
}

function projectToInput(p: Project, i: number): CaseInput {
  return {
    slug: p.slug, name: p.name, url: p.url, platform: p.platform, sector: p.sector, category: p.category, summary: p.summary,
    highlights: p.highlights.join("\n"), image: p.image || null, featured: Boolean(p.featured), status: "PUBLISHED", sortOrder: i * 10,
    overview: p.caseStudy.overview, challenge: p.caseStudy.challenge, approach: p.caseStudy.approach.join("\n"), outcome: p.caseStudy.outcome,
    body: null, seoTitle: null, metaDescription: null, ogImage: null, noindex: false,
  };
}

/** First run: copy the built-in projects into the table once, so the admin can edit them. */
let seeding: Promise<void> | null = null;
async function ensureSeeded() {
  if (!seeding) {
    seeding = (async () => {
      if (await getSetting("case_studies_seeded")) return;
      const [{ n }] = await query<{ n: number }>(`SELECT COUNT(*) AS n FROM case_studies`);
      if (Number(n) === 0) {
        for (const [i, p] of staticProjects.entries()) {
          await execute(`INSERT IGNORE INTO case_studies (${FIELDS}) VALUES (${FIELDS.split(",").map(() => "?").join(", ")})`, values(projectToInput(p, i)));
        }
      }
      await setSetting("case_studies_seeded", "1");
    })().catch((e) => {
      seeding = null;
      throw e;
    });
  }
  return seeding;
}

// ── Admin ───────────────────────────────────────────
export async function listCaseRows(): Promise<CaseRow[]> {
  await ensureSeeded();
  return (await query<CaseRow>(`SELECT ${COLS} FROM case_studies ORDER BY sort_order ASC, id ASC`)).map(bools);
}

export async function getCaseRow(id: number): Promise<CaseRow | null> {
  const rows = await query<CaseRow>(`SELECT ${COLS} FROM case_studies WHERE id = ? LIMIT 1`, [id]);
  return rows[0] ? bools(rows[0]) : null;
}

export async function caseSlugTaken(slug: string, exceptId?: number) {
  const rows = await query<{ id: number }>(`SELECT id FROM case_studies WHERE slug = ? ${exceptId ? "AND id <> ?" : ""} LIMIT 1`, exceptId ? [slug, exceptId] : [slug]);
  return rows.length > 0;
}

export async function createCase(d: CaseInput) {
  const res = await execute(`INSERT INTO case_studies (${FIELDS}) VALUES (${FIELDS.split(",").map(() => "?").join(", ")})`, values(d));
  return getCaseRow(res.insertId);
}

export async function updateCase(id: number, d: CaseInput) {
  const set = FIELDS.split(",").map((f) => `${f.trim()} = ?`).join(", ");
  await execute(`UPDATE case_studies SET ${set} WHERE id = ?`, [...values(d), id]);
  return getCaseRow(id);
}

export async function deleteCase(id: number) {
  const row = await getCaseRow(id);
  if (!row) return null;
  await execute(`DELETE FROM case_studies WHERE id = ?`, [id]);
  return row;
}

// ── Public (never throws; falls back to the built-in list) ──
export async function getCaseStudies(): Promise<Project[]> {
  if (!dbConfigured) return staticProjects;
  try {
    await ensureSeeded();
    const rows = await query<CaseRow>(`SELECT ${COLS} FROM case_studies WHERE status = 'PUBLISHED' ORDER BY sort_order ASC, id ASC`);
    return rows.map(bools).map(rowToProject);
  } catch (e) {
    console.error("[case-studies] list failed:", (e as Error).message);
    return staticProjects;
  }
}

export async function getCaseStudy(slug: string): Promise<Project | null> {
  const all = await getCaseStudies();
  return all.find((p) => p.slug === slug) || null;
}
