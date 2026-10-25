import "server-only";
import { query, execute } from "./db";

export type PostStatus = "DRAFT" | "PUBLISHED";
export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  tags: string | null;
  metaDescription: string | null;
  status: PostStatus;
  readingMinutes: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
export type PostInput = Omit<Post, "id" | "createdAt" | "updatedAt">;

const COLS = `id, title, slug, excerpt, content, cover_image AS coverImage, tags, meta_description AS metaDescription,
  status, reading_minutes AS readingMinutes, published_at AS publishedAt, created_at AS createdAt, updated_at AS updatedAt`;
const LIST_COLS = `id, title, slug, excerpt, cover_image AS coverImage, tags, status, reading_minutes AS readingMinutes,
  published_at AS publishedAt, updated_at AS updatedAt`;

export type PostListItem = Pick<Post, "id" | "title" | "slug" | "excerpt" | "coverImage" | "tags" | "status" | "readingMinutes" | "publishedAt" | "updatedAt">;

export async function listPosts(): Promise<PostListItem[]> {
  return query<PostListItem>(`SELECT ${LIST_COLS} FROM posts ORDER BY updated_at DESC`);
}

export async function listPublished(limit?: number): Promise<PostListItem[]> {
  const lim = limit ? ` LIMIT ${Math.max(1, Math.floor(limit))}` : "";
  return query<PostListItem>(
    `SELECT ${LIST_COLS} FROM posts WHERE status = 'PUBLISHED' AND published_at <= UTC_TIMESTAMP() ORDER BY published_at DESC${lim}`
  );
}

export async function getPostById(id: number): Promise<Post | null> {
  const rows = await query<Post>(`SELECT ${COLS} FROM posts WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

export async function getPostBySlug(slug: string, onlyPublished = true): Promise<Post | null> {
  const extra = onlyPublished ? " AND status = 'PUBLISHED' AND published_at <= UTC_TIMESTAMP()" : "";
  const rows = await query<Post>(`SELECT ${COLS} FROM posts WHERE slug = ?${extra} LIMIT 1`, [slug]);
  return rows[0] || null;
}

export async function slugTaken(slug: string, exceptId?: number) {
  const rows = await query<{ id: number }>(`SELECT id FROM posts WHERE slug = ? ${exceptId ? "AND id <> ?" : ""} LIMIT 1`, exceptId ? [slug, exceptId] : [slug]);
  return rows.length > 0;
}

const values = (d: PostInput) => [
  d.title, d.slug, d.excerpt, d.content, d.coverImage, d.tags, d.metaDescription, d.status, d.readingMinutes, d.publishedAt,
];

export async function createPost(d: PostInput) {
  const res = await execute(
    `INSERT INTO posts (title, slug, excerpt, content, cover_image, tags, meta_description, status, reading_minutes, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    values(d)
  );
  return getPostById(res.insertId);
}

export async function updatePost(id: number, d: PostInput) {
  await execute(
    `UPDATE posts SET title = ?, slug = ?, excerpt = ?, content = ?, cover_image = ?, tags = ?, meta_description = ?, status = ?,
     reading_minutes = ?, published_at = ? WHERE id = ?`,
    [...values(d), id]
  );
  return getPostById(id);
}

export async function deletePost(id: number) {
  const post = await getPostById(id);
  if (!post) return null;
  await execute(`DELETE FROM posts WHERE id = ?`, [id]);
  return post;
}

export async function saveMedia(m: { id: string; filename: string; mime: string; size: number; data: Buffer }) {
  await execute(`INSERT INTO media (id, filename, mime, size, data) VALUES (?, ?, ?, ?, ?)`, [m.id, m.filename, m.mime, m.size, m.data]);
}

export async function getMedia(id: string) {
  const rows = await query<{ mime: string; size: number; data: Buffer }>(`SELECT mime, size, data FROM media WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}
