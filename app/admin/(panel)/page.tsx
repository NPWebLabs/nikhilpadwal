import Link from "next/link";
import { listPosts, type PostListItem } from "@/lib/postsRepo";
import { listCaseRows, type CaseRow } from "@/lib/caseStudies";
import { daily, topPaths, totals } from "@/lib/analytics";
import { formatDate } from "@/lib/posts";
import { BarList, DailyChart, Delta } from "@/components/admin/Charts";

export default async function Overview() {
  let posts: PostListItem[] = [];
  let cases: CaseRow[] = [];
  let stats = { views: 0, visitors: 0, prevViews: 0, prevVisitors: 0 };
  let days: Awaited<ReturnType<typeof daily>> = [];
  let top: Awaited<ReturnType<typeof topPaths>> = [];
  let dbError = "";
  try {
    [posts, cases, stats, days, top] = await Promise.all([listPosts(), listCaseRows(), totals(30), daily(30), topPaths(30, undefined, 8)]);
  } catch (e) {
    dbError = (e as Error).message.split("\n").slice(-2).join(" ").slice(0, 300);
  }
  const now = new Date();
  const live = posts.filter((p) => p.status === "PUBLISHED" && p.publishedAt && new Date(p.publishedAt) <= now).length;
  const drafts = posts.filter((p) => p.status === "DRAFT").length;
  const liveCases = cases.filter((c) => c.status === "PUBLISHED").length;
  const missingSeo = posts.filter((p) => !p.metaDescription && !p.excerpt).length + cases.filter((c) => !c.metaDescription && !c.summary).length;

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Overview</h1>
          <p>Last 30 days on nikhilpadwal.com.</p>
        </div>
        <div className="acts">
          <Link href="/admin/posts/new" className="btn">+ New post</Link>
          <Link href="/admin/case-studies/new" className="btn btn--ghost">+ Case study</Link>
        </div>
      </div>
      {dbError && <div className="alert alert--error" role="alert">Can&apos;t reach the database. Check DATABASE_URL in your environment variables. ({dbError})</div>}

      <div className="cards">
        <div className="card"><span className="t">Page views</span><span className="n">{stats.views.toLocaleString("en-IN")}</span><Delta cur={stats.views} prev={stats.prevViews} /></div>
        <div className="card"><span className="t">Unique visitors</span><span className="n">{stats.visitors.toLocaleString("en-IN")}</span><Delta cur={stats.visitors} prev={stats.prevVisitors} /></div>
        <div className="card"><span className="t">Published posts</span><span className="n">{live}</span><span className="t">{drafts} draft{drafts === 1 ? "" : "s"}</span></div>
        <div className="card"><span className="t">Live case studies</span><span className="n">{liveCases}</span><span className="t">{cases.length - liveCases} hidden</span></div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr)" }}>
        <section className="panel">
          <div className="panel-head"><h2>Traffic</h2><Link href="/admin/analytics">Full analytics →</Link></div>
          <DailyChart data={days} />
        </section>
        <section className="panel">
          <div className="panel-head"><h2>Top pages</h2></div>
          <BarList items={top.map((t) => ({ label: t.path, value: t.views }))} empty="Views show up here once people visit the site." />
        </section>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <section className="panel">
          <div className="panel-head"><h2>Recent posts</h2><Link href="/admin/posts">All posts →</Link></div>
          {posts.length === 0 ? (
            <p className="muted">No posts yet. <Link href="/admin/posts/new">Write the first one.</Link></p>
          ) : (
            <ul className="bars">
              {posts.slice(0, 6).map((p) => (
                <li key={p.id}>
                  <span><Link href={`/admin/posts/${p.id}`}>{p.title}</Link></span>
                  <span className={`badge badge--${p.status}`}>{p.status === "PUBLISHED" ? formatDate(p.publishedAt) : "Draft"}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="panel">
          <div className="panel-head"><h2>Health</h2><Link href="/admin/seo">SEO →</Link></div>
          <ul className="checklist">
            <li className={missingSeo ? "no" : ""}>{missingSeo ? `${missingSeo} item(s) have no description for search results` : "Every post and case study has a description"}</li>
            <li>sitemap.xml lists every published page automatically</li>
            <li>robots.txt and llms.txt are editable in <Link href="/admin/files">Site files</Link></li>
            <li className={stats.views ? "" : "no"}>{stats.views ? "Analytics is recording visits" : "No visits recorded yet in the last 30 days"}</li>
          </ul>
        </section>
      </div>
    </>
  );
}
