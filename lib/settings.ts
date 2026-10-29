import "server-only";
import { query, execute, dbConfigured } from "./db";

// Key/value site settings edited in admin → SEO and admin → Site files.
export type SettingKey =
  | "site_title"
  | "site_description"
  | "default_og_image"
  | "google_verification"
  | "bing_verification"
  | "robots_mode" // "auto" | "custom"
  | "robots_custom"
  | "llms_mode"
  | "llms_custom"
  | "sitemap_mode"
  | "sitemap_custom"
  | "sitemap_extra" // one URL or path per line, added to the auto sitemap
  | "sitemap_exclude" // one path per line, removed from the auto sitemap
  | "case_studies_seeded";

export async function getSetting(k: SettingKey): Promise<string | null> {
  const rows = await query<{ v: string | null }>(`SELECT v FROM settings WHERE k = ? LIMIT 1`, [k]);
  return rows[0]?.v ?? null;
}

export async function setSetting(k: SettingKey, v: string | null) {
  await execute(`INSERT INTO settings (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)`, [k, v]);
}

export async function setSettings(map: Partial<Record<SettingKey, string | null>>) {
  for (const [k, v] of Object.entries(map)) await setSetting(k as SettingKey, v ?? null);
}

/** Public read: returns {} when the database is missing or down, so pages fall back to defaults. */
export async function getSettings(keys: SettingKey[]): Promise<Partial<Record<SettingKey, string>>> {
  if (!dbConfigured || keys.length === 0) return {};
  try {
    const rows = await query<{ k: SettingKey; v: string | null }>(`SELECT k, v FROM settings WHERE k IN (${keys.map(() => "?").join(",")})`, keys);
    return Object.fromEntries(rows.filter((r) => r.v != null && r.v !== "").map((r) => [r.k, r.v as string]));
  } catch (e) {
    console.error("[settings] read failed:", (e as Error).message);
    return {};
  }
}
