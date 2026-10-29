import "server-only";
import { createHash } from "crypto";
import { query, execute } from "./db";

// First-party, cookieless page-view analytics. A visitor is a daily-rotating hash of IP + user agent,
// so the same person counts once per day and nothing personal is stored.
export type ViewKind = "page" | "post" | "case";

const BOT_RE = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|headless|lighthouse|pingdom|uptime|curl|wget|python|axios|node-fetch/i;

export function classify(path: string): { kind: ViewKind; slug: string | null } {
  const post = path.match(/^\/blog\/([^/?#]+)/);
  if (post) return { kind: "post", slug: decodeURIComponent(post[1]) };
  const cs = path.match(/^\/case-studies\/([^/?#]+)/);
  if (cs) return { kind: "case", slug: decodeURIComponent(cs[1]) };
  return { kind: "page", slug: null };
}

export function isBot(ua: string) {
  return !ua || BOT_RE.test(ua);
}

export async function recordView(v: { path: string; referrer: string | null; ua: string; ip: string; siteHost: string }) {
  const { kind, slug } = classify(v.path);
  const day = new Date().toISOString().slice(0, 10);
  const visitor = createHash("sha256").update(`${v.ip}|${v.ua}|${day}|${process.env.AUTH_SECRET || "nik"}`).digest("hex").slice(0, 16);
  const device = /mobile|android|iphone|ipod/i.test(v.ua) ? "mobile" : /ipad|tablet/i.test(v.ua) ? "tablet" : "desktop";
  let ref: string | null = null;
  try {
    if (v.referrer) {
      const h = new URL(v.referrer).hostname.replace(/^www\./, "");
      if (h && h !== v.siteHost.replace(/^www\./, "")) ref = h.slice(0, 200);
    }
  } catch {}
  await execute(`INSERT INTO page_views (path, kind, slug, referrer, device, visitor) VALUES (?, ?, ?, ?, ?, ?)`, [
    v.path.slice(0, 300), kind, slug, ref, device, visitor,
  ]);
}

const since = (days: number) => `created_at >= UTC_TIMESTAMP() - INTERVAL ${Math.max(1, Math.min(366, Math.floor(days)))} DAY`;

export async function totals(days: number) {
  const [cur] = await query<{ views: number; visitors: number }>(
    `SELECT COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors FROM page_views WHERE ${since(days)}`
  );
  const [prev] = await query<{ views: number; visitors: number }>(
    `SELECT COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors FROM page_views
     WHERE created_at >= UTC_TIMESTAMP() - INTERVAL ${days * 2} DAY AND created_at < UTC_TIMESTAMP() - INTERVAL ${days} DAY`
  );
  return { views: Number(cur.views), visitors: Number(cur.visitors), prevViews: Number(prev.views), prevVisitors: Number(prev.visitors) };
}

export async function daily(days: number) {
  const rows = await query<{ d: string; views: number; visitors: number }>(
    `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS d, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors
     FROM page_views WHERE ${since(days)} GROUP BY d ORDER BY d`
  );
  const map = new Map(rows.map((r) => [r.d, r]));
  const out: { d: string; views: number; visitors: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    const r = map.get(d);
    out.push({ d, views: r ? Number(r.views) : 0, visitors: r ? Number(r.visitors) : 0 });
  }
  return out;
}

export async function topPaths(days: number, kind?: ViewKind, limit = 10) {
  const rows = await query<{ path: string; slug: string | null; views: number; visitors: number }>(
    `SELECT ${kind && kind !== "page" ? "slug AS path, slug" : "path, slug"}, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors
     FROM page_views WHERE ${since(days)} ${kind ? "AND kind = ?" : ""}
     GROUP BY ${kind && kind !== "page" ? "slug" : "path, slug"} ORDER BY views DESC LIMIT ${Math.floor(limit)}`,
    kind ? [kind] : []
  );
  return rows.map((r) => ({ ...r, views: Number(r.views), visitors: Number(r.visitors) }));
}

export async function topReferrers(days: number, limit = 10) {
  const rows = await query<{ referrer: string; views: number }>(
    `SELECT referrer, COUNT(*) AS views FROM page_views WHERE ${since(days)} AND referrer IS NOT NULL
     GROUP BY referrer ORDER BY views DESC LIMIT ${Math.floor(limit)}`
  );
  return rows.map((r) => ({ ...r, views: Number(r.views) }));
}

export async function devices(days: number) {
  const rows = await query<{ device: string; views: number }>(
    `SELECT device, COUNT(*) AS views FROM page_views WHERE ${since(days)} GROUP BY device ORDER BY views DESC`
  );
  return rows.map((r) => ({ ...r, views: Number(r.views) }));
}

/** All-time views per slug, used for the view counts in the posts and case-study tables. */
export async function viewsBySlug(kind: "post" | "case") {
  const rows = await query<{ slug: string; views: number }>(`SELECT slug, COUNT(*) AS views FROM page_views WHERE kind = ? GROUP BY slug`, [kind]);
  return new Map(rows.map((r) => [r.slug, Number(r.views)]));
}

export async function pruneViews(olderThanDays = 400) {
  await execute(`DELETE FROM page_views WHERE created_at < UTC_TIMESTAMP() - INTERVAL ${Math.floor(olderThanDays)} DAY`);
}
