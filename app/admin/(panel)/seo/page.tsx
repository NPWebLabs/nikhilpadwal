import Link from "next/link";
import { listPageSeo, SEO_PAGES } from "@/lib/seoRepo";
import { getSetting } from "@/lib/settings";
import { listPosts } from "@/lib/postsRepo";
import { listCaseRows } from "@/lib/caseStudies";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/seo";
import SeoSettingsForm from "@/components/admin/SeoSettingsForm";

const PAGE_DEFAULTS: Record<string, { title: string; description: string }> = {
  "/": { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  "/case-studies": { title: "Case Studies: 26 Live Client Websites", description: "Case studies of live client websites by Nikhil Padwal: corporate, education, e-commerce and industrial sites." },
  "/blog": { title: "Blog: WordPress, Shopify, SEO & AI Notes", description: "Notes from client work: WordPress speed, Shopify setups, SEO fixes and AI experiments." },
};

type Issue = { kind: "Post" | "Case study"; name: string; href: string; problems: string[] };

export default async function SeoAdmin() {
  try {
    const [pages, posts, cases, ...g] = await Promise.all([
      listPageSeo(), listPosts(), listCaseRows(),
      getSetting("site_title"), getSetting("site_description"), getSetting("default_og_image"), getSetting("google_verification"), getSetting("bing_verification"),
    ]);
    const issues: Issue[] = [];
    const check = (title: string, desc: string, img: string | null, noindex: boolean) => {
      const p: string[] = [];
      if (!desc) p.push("No description");
      else if (desc.length > 160) p.push(`Description ${desc.length} chars`);
      else if (desc.length < 70) p.push(`Description only ${desc.length} chars`);
      if (title.length + 16 > 65) p.push(`Title ${title.length + 16} chars`);
      if (!img) p.push("No share image");
      if (noindex) p.push("noindex");
      return p;
    };
    for (const p of posts) {
      const probs = check(p.seoTitle || p.title, p.metaDescription || p.excerpt || "", p.coverImage, Boolean(p.noindex));
      if (probs.length) issues.push({ kind: "Post", name: p.title, href: `/admin/posts/${p.id}`, problems: probs });
    }
    for (const c of cases) {
      const probs = check(c.seoTitle || `${c.name} Case Study`, c.metaDescription || c.summary || "", c.ogImage || c.image, Boolean(c.noindex));
      if (probs.length) issues.push({ kind: "Case study", name: c.name, href: `/admin/case-studies/${c.id}`, problems: probs });
    }

    return (
      <>
        <div className="admin-top">
          <div>
            <h1>SEO</h1>
            <p>Titles, descriptions and share images for every page. Each post and case study also has its own SEO panel in its editor. Structured data (Person, BlogPosting, Breadcrumbs) is added automatically.</p>
          </div>
          <div className="acts">
            <Link className="btn btn--ghost" href="/admin/files">robots.txt & sitemap →</Link>
          </div>
        </div>

        <div className="editor" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,420px)" }}>
          <SeoSettingsForm
            defaults={{ title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION }}
            global={{ siteTitle: g[0] || "", siteDescription: g[1] || "", defaultOgImage: g[2] || "", googleVerification: g[3] || "", bingVerification: g[4] || "" }}
            pages={pages.map((p) => ({
              path: p.path,
              label: SEO_PAGES.find((s) => s.path === p.path)?.label || p.path,
              title: p.title || "",
              description: p.description || "",
              ogImage: p.ogImage || "",
              noindex: Boolean(p.noindex),
              defTitle: PAGE_DEFAULTS[p.path]?.title || "",
              defDescription: PAGE_DEFAULTS[p.path]?.description || "",
            }))}
          />
          <aside>
            <section className="panel">
              <div className="panel-head"><h2>Audit</h2><span className="muted" style={{ fontSize: 13 }}>{issues.length} to review</span></div>
              {issues.length === 0 ? (
                <p className="muted">Every post and case study has a title, description and share image in range.</p>
              ) : (
                <ul className="bars">
                  {issues.slice(0, 40).map((i) => (
                    <li key={i.href} style={{ flexDirection: "column", gap: 2 }}>
                      <span><Link href={i.href}><b>{i.name}</b></Link> <span className="muted" style={{ fontSize: 12 }}>· {i.kind}</span></span>
                      <span className="muted" style={{ fontSize: 12.5, whiteSpace: "normal" }}>{i.problems.join(" · ")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </aside>
        </div>
      </>
    );
  } catch (e) {
    return (
      <>
        <div className="admin-top"><h1>SEO</h1></div>
        <div className="alert alert--error" role="alert">Can&apos;t load SEO settings. Check DATABASE_URL. ({(e as Error).message.slice(0, 200)})</div>
      </>
    );
  }
}
