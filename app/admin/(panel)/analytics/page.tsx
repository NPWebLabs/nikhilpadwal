import Link from "next/link";
import { daily, devices, topPaths, topReferrers, totals } from "@/lib/analytics";
import { listPosts } from "@/lib/postsRepo";
import { listCaseRows } from "@/lib/caseStudies";
import { BarList, DailyChart, Delta } from "@/components/admin/Charts";

const RANGES = [7, 30, 90] as const;

export default async function Analytics({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const sp = await searchParams;
  const days = RANGES.includes(Number(sp.days) as (typeof RANGES)[number]) ? Number(sp.days) : 30;
  try {
    const [t, series, pages, posts, cases, refs, devs, postList, caseList] = await Promise.all([
      totals(days), daily(days), topPaths(days, "page", 10), topPaths(days, "post", 10), topPaths(days, "case", 10),
      topReferrers(days, 10), devices(days), listPosts(), listCaseRows(),
    ]);
    const postTitle = new Map(postList.map((p) => [p.slug, p.title]));
    const caseTitle = new Map(caseList.map((c) => [c.slug, c.name]));
    const perDay = t.views / days;
    const devTotal = devs.reduce((n, d) => n + d.views, 0) || 1;

    return (
      <>
        <div className="admin-top">
          <div>
            <h1>Analytics</h1>
            <p>Cookieless, first-party page views. Bots and your own admin visits aren&apos;t counted.</p>
          </div>
          <nav className="seg" aria-label="Date range">
            {RANGES.map((r) => <Link key={r} href={`/admin/analytics?days=${r}`} aria-current={r === days ? "true" : undefined}>{r} days</Link>)}
          </nav>
        </div>

        <div className="cards">
          <div className="card"><span className="t">Page views</span><span className="n">{t.views.toLocaleString("en-IN")}</span><Delta cur={t.views} prev={t.prevViews} /></div>
          <div className="card"><span className="t">Unique visitors</span><span className="n">{t.visitors.toLocaleString("en-IN")}</span><Delta cur={t.visitors} prev={t.prevVisitors} /></div>
          <div className="card"><span className="t">Views per day</span><span className="n">{perDay < 10 ? perDay.toFixed(1) : Math.round(perDay)}</span><span className="t">average</span></div>
          <div className="card"><span className="t">Pages per visitor</span><span className="n">{t.visitors ? (t.views / t.visitors).toFixed(1) : "0"}</span><span className="t">daily visitors</span></div>
        </div>

        <section className="panel">
          <div className="panel-head"><h2>Daily traffic</h2></div>
          <DailyChart data={series} height={240} />
        </section>

        <div className="grid-3" style={{ marginTop: 16 }}>
          <section className="panel">
            <h2>Top pages</h2>
            <BarList items={pages.map((p) => ({ label: p.path, value: p.views, href: p.path }))} />
          </section>
          <section className="panel">
            <h2>Top blog posts</h2>
            <BarList items={posts.map((p) => ({ label: postTitle.get(p.path) || p.path, value: p.views, href: `/blog/${p.path}` }))} empty="No post views yet." />
          </section>
          <section className="panel">
            <h2>Top case studies</h2>
            <BarList items={cases.map((p) => ({ label: caseTitle.get(p.path) || p.path, value: p.views, href: `/case-studies/${p.path}` }))} empty="No case-study views yet." />
          </section>
        </div>

        <div className="grid-2" style={{ marginTop: 16 }}>
          <section className="panel">
            <h2>Where visitors come from</h2>
            <BarList items={refs.map((r) => ({ label: r.referrer, value: r.views }))} empty="No referrers yet. Direct visits and searches without a referrer don't show here." />
          </section>
          <section className="panel">
            <h2>Devices</h2>
            <BarList items={devs.map((d) => ({ label: `${d.device.charAt(0).toUpperCase()}${d.device.slice(1)} · ${Math.round((d.views / devTotal) * 100)}%`, value: d.views }))} />
          </section>
        </div>
      </>
    );
  } catch (e) {
    return (
      <>
        <div className="admin-top"><h1>Analytics</h1></div>
        <div className="alert alert--error" role="alert">Can&apos;t load analytics. Check DATABASE_URL. ({(e as Error).message.slice(0, 200)})</div>
      </>
    );
  }
}
