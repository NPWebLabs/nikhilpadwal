import "server-only";
import { query, execute, dbConfigured } from "./db";

// SEO overrides for fixed pages (home, blog index, case-study index). Posts and case studies keep theirs on their own rows.
export const SEO_PAGES = [
  { path: "/", label: "Home" },
  { path: "/case-studies", label: "Case studies index" },
  { path: "/blog", label: "Blog index" },
] as const;

export type PageSeo = { path: string; title: string | null; description: string | null; ogImage: string | null; noindex: boolean };

export async function listPageSeo(): Promise<PageSeo[]> {
  const rows = await query<PageSeo>(`SELECT path, title, description, og_image AS ogImage, noindex = 1 AS noindex FROM seo_pages`);
  return SEO_PAGES.map((p) => { const r = rows.find((x) => x.path === p.path); return r ? { ...r, noindex: Boolean(Number(r.noindex)) } : null; }).map((r, i) => r || { path: SEO_PAGES[i].path, title: null, description: null, ogImage: null, noindex: false });
}

export async function savePageSeo(d: PageSeo) {
  await execute(
    `INSERT INTO seo_pages (path, title, description, og_image, noindex) VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), og_image = VALUES(og_image), noindex = VALUES(noindex)`,
    [d.path, d.title || null, d.description || null, d.ogImage || null, d.noindex ? 1 : 0]
  );
}

/** Public read, never throws. */
export async function getPageSeo(path: string): Promise<PageSeo | null> {
  if (!dbConfigured) return null;
  try {
    const rows = await query<PageSeo>(`SELECT path, title, description, og_image AS ogImage, noindex = 1 AS noindex FROM seo_pages WHERE path = ? LIMIT 1`, [path]);
    return rows[0] ? { ...rows[0], noindex: Boolean(Number(rows[0].noindex)) } : null;
  } catch {
    return null;
  }
}
