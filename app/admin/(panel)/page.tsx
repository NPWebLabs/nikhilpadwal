import Link from "next/link";
import { listPosts, type PostListItem } from "@/lib/postsRepo";
import { formatDate } from "@/lib/posts";
import DeletePostButton from "@/components/admin/DeletePostButton";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const sp = await searchParams;
  let posts: PostListItem[] = [];
  let dbError = "";
  try {
    posts = await listPosts();
  } catch (e) {
    dbError = (e as Error).message.split("\n").slice(-2).join(" ").slice(0, 300);
  }
  const now = new Date();
  const published = posts.filter((p) => p.status === "PUBLISHED" && p.publishedAt && p.publishedAt <= now).length;
  const scheduled = posts.filter((p) => p.status === "PUBLISHED" && p.publishedAt && p.publishedAt > now).length;
  const drafts = posts.filter((p) => p.status === "DRAFT").length;

  return (
    <>
      <div className="admin-top">
        <h1>Posts</h1>
        <Link href="/admin/posts/new" className="btn">+ New post</Link>
      </div>
      {sp.deleted && <div className="alert alert--ok" role="status">Post deleted.</div>}
      {dbError && (
        <div className="alert alert--error" role="alert">
          Can&apos;t reach the database. Check DATABASE_URL in your environment variables. ({dbError})
        </div>
      )}
      <div className="cards">
        <div className="card"><span className="n">{published}</span><span className="t">Published</span></div>
        <div className="card"><span className="n">{drafts}</span><span className="t">Drafts</span></div>
        <div className="card"><span className="n">{scheduled}</span><span className="t">Scheduled</span></div>
      </div>
      {posts.length === 0 && !dbError ? (
        <div className="empty-state" style={{ background: "#fff" }}>
          <h2 className="h3">No posts yet</h2>
          <p>Write the first one. It stays a draft until you publish it.</p>
          <Link href="/admin/posts/new" className="btn" style={{ marginTop: 18 }}>Write a post</Link>
        </div>
      ) : posts.length > 0 ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Title</th><th>Status</th><th>Published</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {posts.map((p) => {
                const isScheduled = p.status === "PUBLISHED" && p.publishedAt && p.publishedAt > now;
                const label = isScheduled ? "SCHEDULED" : p.status;
                return (
                  <tr key={p.id}>
                    <td>
                      <Link className="title" href={`/admin/posts/${p.id}`}>{p.title}</Link>
                      <div className="post-meta" style={{ marginTop: 4 }}>/blog/{p.slug} · {p.readingMinutes} min</div>
                    </td>
                    <td><span className={`badge badge--${label}`}>{label.charAt(0) + label.slice(1).toLowerCase()}</span></td>
                    <td>{p.publishedAt ? formatDate(p.publishedAt) : "—"}</td>
                    <td>{formatDate(p.updatedAt)}</td>
                    <td>
                      <div className="row-actions">
                        <Link className="icon-btn" href={`/admin/posts/${p.id}`}>Edit</Link>
                        {p.status === "PUBLISHED" && !isScheduled && (
                          <a className="icon-btn" href={`/blog/${p.slug}`} target="_blank" rel="noopener">View ↗</a>
                        )}
                        <DeletePostButton id={p.id} title={p.title} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}
