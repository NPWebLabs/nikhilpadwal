import type { Metadata } from "next";
import Link from "next/link";
import { projects, sectors } from "@/lib/data";
import { absolute, breadcrumbSchema, graph, pageMeta, PERSON_ID } from "@/lib/seo";
import WorkGrid from "@/components/WorkGrid";

export const metadata: Metadata = pageMeta({
  title: "Case Studies: Websites, Stores & Web Apps",
  description: `${projects.length} website case studies by Nikhil Padwal: corporate sites, colleges, online stores and manufacturers built on WordPress, WooCommerce and Shopify.`,
  path: "/case-studies",
});

export default function CaseStudies() {
  const jsonLd = graph(
    {
      "@type": "CollectionPage",
      name: "Case studies",
      url: absolute("/case-studies"),
      author: { "@id": PERSON_ID },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: projects.length,
        itemListElement: projects.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: absolute(`/case-studies/${p.slug}`) })),
      },
    },
    breadcrumbSchema([{ name: "Case studies", path: "/case-studies" }]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <section className="chapter chapter--black" aria-labelledby="cs-title">
        <div className="wrap">
          <span className="chapter__num">Portfolio</span>
          <h1 id="cs-title" className="chapter__title">Case<br />studies</h1>
          <p className="chapter__line">
            {projects.length} live websites across {sectors.length} sectors: {sectors.join(", ").replace(/, ([^,]*)$/, " and $1")}. Each one starts with the
            client, the problem the site had to solve, and what was built.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <WorkGrid projects={projects} />
        </div>
      </section>

      <section className="section section--tight" style={{ paddingTop: 0 }}>
        <div className="wrap cs-cta">
          <h2 className="h3">Want your project to be the next one here?</h2>
          <Link href="/#contact" className="btn">Start a project <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </>
  );
}
