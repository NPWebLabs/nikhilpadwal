import "server-only";
import { query, execute, dbConfigured } from "./db";

// Extra files served from the site root, e.g. /ads.txt, /humans.txt, /google1234abcd.html, /security.txt
export type SiteFile = { id: number; name: string; mime: string; content: string; updatedAt: Date };

// robots.txt, sitemap.xml and llms.txt have their own editors, so they can't be shadowed by a custom file.
export const RESERVED_FILES = ["robots.txt", "sitemap.xml", "llms.txt", "favicon.ico", "icon.png", "apple-icon.png"];
export const FILE_NAME_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,120}\.(txt|xml|html|json|webmanifest)$/;

export const MIME_BY_EXT: Record<string, string> = {
  txt: "text/plain; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  html: "text/html; charset=utf-8",
  json: "application/json; charset=utf-8",
  webmanifest: "application/manifest+json; charset=utf-8",
};
export const mimeFor = (name: string) => MIME_BY_EXT[name.split(".").pop()!.toLowerCase()] || MIME_BY_EXT.txt;

export async function listFiles(): Promise<SiteFile[]> {
  return query<SiteFile>(`SELECT id, name, mime, content, updated_at AS updatedAt FROM site_files ORDER BY name`);
}

export async function saveFile(name: string, content: string, id?: number) {
  if (id) await execute(`UPDATE site_files SET name = ?, mime = ?, content = ? WHERE id = ?`, [name, mimeFor(name), content, id]);
  else await execute(`INSERT INTO site_files (name, mime, content) VALUES (?, ?, ?)`, [name, mimeFor(name), content]);
}

export async function deleteFile(id: number) {
  await execute(`DELETE FROM site_files WHERE id = ?`, [id]);
}

export async function getFileByName(name: string): Promise<SiteFile | null> {
  if (!dbConfigured) return null;
  try {
    const rows = await query<SiteFile>(`SELECT id, name, mime, content, updated_at AS updatedAt FROM site_files WHERE name = ? LIMIT 1`, [name]);
    return rows[0] || null;
  } catch {
    return null;
  }
}
