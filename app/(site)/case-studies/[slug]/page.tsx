import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, profile } from "@/lib/data";
import BrowserFrame from "@/components/BrowserFrame";
import { whatsappUrl, WhatsAppIcon } from "@/components/WhatsAppButton";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

const find = async (params: Props["params"]) => {
  const { slug } = await params;
  return projects.find((p) => p.slug === slug);
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await find(params);
  if (!p) return { title: "Case study not found" };
  return {
    title: `${p.name} case study`,
    description: p.summary,
    alternates: { canonical: `/case-studies/${p.slug}` },
    openGraph: { type: "article", title: `${p.name}: ${p.category} website`, description: p.summary, images: p.image ? [{ url: p.image }] : ["/images/og.jpg"] },
  };
}

export default async function CaseStudy({ params }: Props) {
  const p = await find(params);
  if (!p) notFound();
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];
  const related = projects.filter((x) => x.sector === p.sector && x.slug !== p.slug).slice(0, 3);
  const host = p.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nikhilpadwal.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${p.name} website`,
    abstract: p.summary,
    url: `${siteUrl}/case-studies/${p.slug}`,
    image: p.image ? `${siteUrl}${p.image}` : undefined,
    creator: { "@type": "Person", name: profile.name, url: siteUrl },
    about: { "@type": "Organization", name: p.name, url: p.url },
  };

  return (
    <article style={{ paddingBottom: "clamp(64px, 9vw, 120px)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="wrap cs-head">
        <Link href="/case-studies" className="eyebrow" style={{ textDecoration: "none" }}>← All case studies</Link>
        <h1>{p.name}</h1>
        <p className="lead" style={{ maxWidth: "60ch", margin: 0 }}>{p.summary}</p>
        <dl className="cs-facts">
          <div><dt>Sector</dt><dd>{p.sector}</dd></div>
          <div><dt>Industry</dt><dd>{p.category}</dd></div>
          <div><dt>Platform</dt><dd><span className={`platform-dot platform-dot--${p.platform}`} aria-hidden="true" /> {p.platform}</dd></div>
          <div><dt>Live site</dt><dd><a href={p.url} target="_blank" rel="noopener noreferrer">{host} ↗</a></dd></div>
        </dl>
      </header>

      <div className="wrap cs-shot">
        <BrowserFrame url={p.url} image={p.image} alt={`${p.name} website homepage, desktop view`} href={p.url} emptyTitle={p.name} priority />
      </div>

      <div className="wrap cs-body">
        <section>
          <h2 className="eyebrow">The client</h2>
          <p>{p.caseStudy.overview}</p>
        </section>
        <section>
          <h2 className="eyebrow">The challenge</h2>
          <p>{p.caseStudy.challenge}</p>
        </section>
        <section>
          <h2 className="eyebrow">What was built</h2>
          <ul className="cs-list">{p.caseStudy.approach.map((a) => <li key={a}>{a}</li>)}</ul>
          <div className="work-card__hl">{p.highlights.map((h) => <span key={h} className="chip">{h}</span>)}</div>
        </section>
        <section>
          <h2 className="eyebrow">The result</h2>
          <p>{p.caseStudy.outcome}</p>
          <a className="arrow-link" href={p.url} target="_blank" rel="noopener noreferrer">See it live at {host} <span aria-hidden="true">↗</span></a>
        </section>
      </div>

      <div className="wrap">
        <div className="cs-cta cs-cta--dark">
          <h2 className="h3">Need a {p.sector === "E-commerce" ? "store" : "website"} like this?</h2>
          <div className="contact__actions" style={{ marginTop: 0 }}>
            <Link href="/#contact" className="btn btn--light">Contact me</Link>
            <a href={whatsappUrl(`Hi Nikhil, I saw the ${p.name} case study and would like something similar.`)} className="btn btn--wa" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> WhatsApp</a>
          </div>
        </div>

        {related.length > 0 && (
          <section className="cs-related" aria-labelledby="related-title">
            <h2 id="related-title" className="h3">More {p.sector.toLowerCase()} work</h2>
            <ul>
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/case-studies/${r.slug}`}>
                    <strong>{r.name}</strong>
                    <span className="muted">{r.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Link href={`/case-studies/${next.slug}`} className="cs-next">
          <span className="eyebrow">Next case study</span>
          <strong>{next.name} <span aria-hidden="true">→</span></strong>
        </Link>
      </div>
    </article>
  );
}
