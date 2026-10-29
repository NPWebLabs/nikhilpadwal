import Link from "next/link";
import { listPosts, type PostListItem } from "@/lib/postsRepo";
import { viewsBySlug } from "@/lib/analytics";
import { formatDate } from "@/lib/posts";
import DeletePostButton from "@/components/admin/DeletePostButton";

function seoScore(p: PostListItem) {
  const desc = p.metaDescription || p.excerpt || "";
  const title = p.seoTitle || p.title;
  const n = (desc.length >= 70 && desc.length <= 160 ? 1 : 0) + (title.length <= 50 ? 1 : 0) + (p.coverImage ? 1 : 0);
  return n === 3 ? "good" : n === 2 ? "ok" : "bad";
}

export default async function PostsAdmin({ searchParams }: { searchParams: Promise<{ deleted?: string; q?: string; status?: string }> }) {
  const sp = await searchParams;
  let posts: PostListItem[] = [];
  let views = new Map<string, number>();
  let dbError = "";
  try {
    [posts, views] = await Promise.all([listPosts(), viewsBySlug("post")]);
  } catch (e) {
    dbError = (e as Error).message.split("\n").slice(-2).join(" ").slice(0, 300);
  }
  const now = new Date();
  const q = (sp.q || "").trim().toLowerCase();
  const isScheduled = (p: PostListItem) => p.status === "PUBLISHED" && p.publishedAt && new Date(p.publishedAt) > now;
  const label = (p: PostListItem) => (isScheduled(p) ? "SCHEDULED" : p.status);
  const shown = posts.filter((p) => (!q || p.title.toLowerCase().includes(q) || (p.tags || "").toLowerCase().includes(q)) && (!sp.status || label(p) === sp.status));
  const tabs = [["", "All"], ["PUBLISHED", "Published"], ["DRAFT", "Drafts"], ["SCHEDULED", "Scheduled"]] as const;

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Blog posts</h1>
          <p>{posts.length} total · Markdown editor with images, scheduling and SEO.</p>
        </div>
        <Link href="/admin/posts/new" className="btn">+ New post</Link>
      </div>
      {sp.deleted && <div className="alert alert--ok" role="status">Post deleted.</div>}
      {dbError && <div className="alert alert--error" role="alert">Can&apos;t reach the database. Check DATABASE_URL. ({dbError})</div>}

      <form className="toolbar-row" role="search">
        <input className="input" name="q" defaultValue={sp.q} placeholder="Search title or tag" aria-label="Search posts" />
        {sp.status && <input type="hidden" name="status" value={sp.status} />}
        <nav className="seg" aria-label="Filter by status">
          {tabs.map(([v, l]) => (
            <Link key={v} href={`/admin/posts?${new URLSearchParams({ ...(q ? { q } : {}), ...(v ? { status: v } : {}) })}`} aria-current={(sp.status || "") === v ? "true" : undefined}>{l}</Link>
          ))}
        </nav>
      </form>

      {posts.length === 0 && !dbError ? (
        <div className="empty-state">
          <h2 className="h3">No posts yet</h2>
          <p>Write the first one. It stays a draft until you publish it.</p>
          <Link href="/admin/posts/new" className="btn" style={{ marginTop: 18 }}>Write a post</Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Title</th><th>Status</th><th>SEO</th><th className="num">Views</th><th>Published</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {shown.map((p) => {
                const l = label(p);
                const s = seoScore(p);
                return (
                  <tr key={p.id}>
                    <td>
                      <Link className="title" href={`/admin/posts/${p.id}`}>{p.title}</Link>
                      <div className="sub">/blog/{p.slug} · {p.readingMinutes} min{p.noindex ? " · noindex" : ""}</div>
                    </td>
                    <td><span className={`badge badge--${l}`}>{l.charAt(0) + l.slice(1).toLowerCase()}</span></td>
                    <td><span className={`seo-dot seo-dot--${s}`} title={`SEO: ${s}`} /> <span className="sr-only">{s}</span></td>
                    <td className="num">{(views.get(p.slug) || 0).toLocaleString("en-IN")}</td>
                    <td>{p.publishedAt ? formatDate(p.publishedAt) : "—"}</td>
                    <td>{formatDate(p.updatedAt)}</td>
                    <td>
                      <div className="row-actions">
                        <Link className="icon-btn" href={`/admin/posts/${p.id}`}>Edit</Link>
                        {l === "PUBLISHED" && <a className="icon-btn" href={`/blog/${p.slug}`} target="_blank" rel="noopener">View ↗</a>}
                        <DeletePostButton id={p.id} title={p.title} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {shown.length === 0 && <tr><td colSpan={7} className="muted">No posts match.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
