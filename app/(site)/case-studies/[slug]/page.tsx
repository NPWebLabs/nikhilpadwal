import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/site/Reveal";
import { Arrow, Ico, Shot, host } from "@/components/site/ui";
import { getCaseStudies, getCaseStudy } from "@/lib/caseStudies";
import { profile, whatsappUrl } from "@/lib/data";
import { renderMarkdown } from "@/lib/markdown";
import { projects as builtIn } from "@/lib/projects";
import { absolute, breadcrumbSchema, graph, pageMeta, PERSON_ID } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;
export const dynamicParams = true; // new case studies from the admin render on first request
export const generateStaticParams = () => builtIn.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getCaseStudy((await params).slug);
  if (!p) return { title: "Case study not found" };
  return pageMeta({
    title: p.seoTitle || `${p.name} Case Study`,
    description: p.metaDescription || p.summary,
    path: `/case-studies/${p.slug}`,
    image: p.ogImage || p.image,
    type: "article",
    modifiedTime: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined,
    noindex: p.noindex,
    keywords: [p.platform, p.category, p.sector, ...p.highlights],
  });
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const all = await getCaseStudies();
  const p = all.find((x) => x.slug === slug);
  if (!p) notFound();
  const i = all.indexOf(p);
  const next = all[(i + 1) % all.length];
  const related = all.filter((x) => x.sector === p.sector && x.slug !== p.slug).slice(0, 3);
  const path = `/case-studies/${p.slug}`;
  const jsonLd = graph(
    {
      "@type": "CreativeWork",
      name: `${p.name} website`,
      headline: `${p.name} case study`,
      abstract: p.summary,
      url: absolute(path),
      image: p.image ? absolute(p.image) : undefined,
      creator: { "@type": "Person", "@id": PERSON_ID, name: profile.name },
      about: { "@type": "Organization", name: p.name, url: p.url },
      keywords: [p.platform, p.category, p.sector, ...p.highlights].join(", "),
    },
    breadcrumbSchema([{ name: "Case studies", path: "/case-studies" }, { name: p.name, path }]),
  );
  const cs = p.caseStudy;

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <header className="page-hero band">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/case-studies">Case studies</Link><span aria-hidden="true">/</span><span>{p.name}</span></nav>
          <Reveal as="div">
            <h1 className="serif">{p.name}</h1>
            <p className="lede">{p.summary}</p>
          </Reveal>
          <dl className="cs-facts">
            <div><dt>Sector</dt><dd>{p.sector}</dd></div>
            <div><dt>Industry</dt><dd>{p.category}</dd></div>
            <div><dt>Platform</dt><dd>{p.platform}</dd></div>
            <div><dt>Live site</dt><dd>{p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer">{host(p.url)} ↗</a> : "—"}</dd></div>
          </dl>
        </div>
      </header>

      <div className="band">
        <div className="wrap">
          <Reveal className="cs-shot">
            <Shot url={p.url || p.name} image={p.image} alt={`${p.name} website homepage, desktop view`} href={p.url || undefined} priority sizes="(max-width: 1240px) 100vw, 1200px" />
          </Reveal>

          <div className="cs-body">
            {cs.overview && <Reveal as="section"><h2>The client</h2><p>{cs.overview}</p></Reveal>}
            {cs.challenge && <Reveal as="section" delay={0.06}><h2>The challenge</h2><p>{cs.challenge}</p></Reveal>}
            {cs.approach.length > 0 && (
              <Reveal as="section">
                <h2>What was built</h2>
                <ul className="cs-list">{cs.approach.map((a) => <li key={a}>{a}</li>)}</ul>
                {p.highlights.length > 0 && <div className="chips" style={{ marginTop: 8 }}>{p.highlights.map((h) => <span key={h} className="chip">{h}</span>)}</div>}
              </Reveal>
            )}
            {cs.outcome && (
              <Reveal as="section" delay={0.06}>
                <h2>The result</h2>
                <p>{cs.outcome}</p>
                {p.url && <a className="link" href={p.url} target="_blank" rel="noopener noreferrer">See it live at {host(p.url)} ↗</a>}
              </Reveal>
            )}
          </div>

          {p.body && <div className="cs-extra"><div className="prose" style={{ marginLeft: 0 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(p.body) }} /></div>}

          <Reveal className="cs-cta">
            <h2>Need a {p.sector === "E-commerce" ? "store" : "website"} like this?</h2>
            <div className="cta-row">
              <Link href="/#contact" className="btn"><span className="ic"><Arrow /></span>Contact me</Link>
              <a href={whatsappUrl(`Hi Nikhil, I saw the ${p.name} case study and would like something similar.`)} className="btn ghost wa" target="_blank" rel="noopener noreferrer">
                <span className="ic"><Ico name="whatsapp-white" size={18} style={{ color: "#fff" }} /></span>WhatsApp
              </a>
            </div>
          </Reveal>

          {related.length > 0 && (
            <section className="cs-related" aria-labelledby="related-title">
              <h2 id="related-title">More {p.sector.toLowerCase()} work</h2>
              <div className="arch-grid">
                {related.map((r) => (
                  <Link className="tile" key={r.slug} href={`/case-studies/${r.slug}`}>
                    <div className="img">{/* eslint-disable-next-line @next/next/no-img-element */}{r.image && <img src={r.image} alt="" loading="lazy" />}</div>
                    <div className="t"><b>{r.name}</b><em>{r.platform}</em></div>
                    <small>{r.category}</small>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {next && next.slug !== p.slug && (
            <Link href={`/case-studies/${next.slug}`} className="cs-next" style={{ marginBottom: "clamp(80px,12vw,140px)" }}>
              <span className="label">Next case study</span>
              <b>{next.name} <span aria-hidden="true">→</span></b>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
