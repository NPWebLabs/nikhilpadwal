import Link from "next/link";
import { listCaseRows, type CaseRow } from "@/lib/caseStudies";
import { viewsBySlug } from "@/lib/analytics";

export default async function CasesAdmin({ searchParams }: { searchParams: Promise<{ deleted?: string; q?: string; sector?: string }> }) {
  const sp = await searchParams;
  let rows: CaseRow[] = [];
  let views = new Map<string, number>();
  let dbError = "";
  try {
    [rows, views] = await Promise.all([listCaseRows(), viewsBySlug("case")]);
  } catch (e) {
    dbError = (e as Error).message.split("\n").slice(-2).join(" ").slice(0, 300);
  }
  const q = (sp.q || "").trim().toLowerCase();
  const sectors = [...new Set(rows.map((r) => r.sector))];
  const shown = rows.filter((r) => (!q || `${r.name} ${r.category} ${r.platform}`.toLowerCase().includes(q)) && (!sp.sector || r.sector === sp.sector));

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Case studies</h1>
          <p>{rows.length} projects · {rows.filter((r) => r.featured).length} featured on the homepage.</p>
        </div>
        <Link href="/admin/case-studies/new" className="btn">+ New case study</Link>
      </div>
      {sp.deleted && <div className="alert alert--ok" role="status">Case study deleted.</div>}
      {dbError && <div className="alert alert--error" role="alert">Can&apos;t reach the database. Check DATABASE_URL. ({dbError})</div>}

      <form className="toolbar-row" role="search">
        <input className="input" name="q" defaultValue={sp.q} placeholder="Search name, industry, platform" aria-label="Search case studies" />
        <nav className="seg" aria-label="Filter by sector">
          {["", ...sectors].map((s) => (
            <Link key={s} href={`/admin/case-studies?${new URLSearchParams({ ...(q ? { q } : {}), ...(s ? { sector: s } : {}) })}`} aria-current={(sp.sector || "") === s ? "true" : undefined}>{s || "All"}</Link>
          ))}
        </nav>
      </form>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Project</th><th>Sector</th><th>Platform</th><th>Status</th><th className="num">Views</th><th className="num">Order</th><th><span className="sr-only">Actions</span></th></tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id}>
                <td>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {r.image ? <img className="thumb" src={r.image} alt="" loading="lazy" /> : <span className="thumb" />}
                    <div>
                      <Link className="title" href={`/admin/case-studies/${r.id}`}>{r.name}</Link>
                      <div className="sub">{r.category} · /case-studies/{r.slug}</div>
                    </div>
                  </div>
                </td>
                <td>{r.sector}</td>
                <td>{r.platform}</td>
                <td>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span className={`badge badge--${r.status}`}>{r.status === "PUBLISHED" ? "Published" : "Draft"}</span>
                    {r.featured && <span className="badge badge--FEATURED">Featured</span>}
                    {r.noindex && <span className="badge badge--NOINDEX">noindex</span>}
                  </div>
                </td>
                <td className="num">{(views.get(r.slug) || 0).toLocaleString("en-IN")}</td>
                <td className="num">{r.sortOrder}</td>
                <td>
                  <div className="row-actions">
                    <Link className="icon-btn" href={`/admin/case-studies/${r.id}`}>Edit</Link>
                    {r.status === "PUBLISHED" && <a className="icon-btn" href={`/case-studies/${r.slug}`} target="_blank" rel="noopener">View ↗</a>}
                  </div>
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={7} className="muted">{rows.length ? "No case studies match." : "No case studies yet."}</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
