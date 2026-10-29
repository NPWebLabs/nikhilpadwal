import "server-only";
import { dbConfigured } from "./db";
import { listPublished, getPostBySlug, type PostListItem } from "./postsRepo";

export type PublicPost = PostListItem;

/** Public queries never throw — the site stays up even if the database is unreachable. */
export async function getPublishedPosts(limit?: number): Promise<PublicPost[]> {
  if (!dbConfigured) return [];
  try {
    return await listPublished(limit);
  } catch (e) {
    console.error("[posts] list failed:", (e as Error).message);
    return [];
  }
}

export async function getPublishedPost(slug: string) {
  if (!dbConfigured) return null;
  try {
    return await getPostBySlug(slug, true);
  } catch (e) {
    console.error("[posts] get failed:", (e as Error).message);
    return null;
  }
}

export function splitTags(tags?: string | null) {
  return (tags || "").split(",").map((t) => t.trim()).filter(Boolean);
}

export function formatDate(d?: Date | string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}
