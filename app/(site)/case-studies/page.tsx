import type { Metadata } from "next";
import Link from "next/link";
import Archive from "@/components/site/Archive";
import FeaturedWork from "@/components/site/FeaturedWork";
import Reveal from "@/components/site/Reveal";
import { getCaseStudies } from "@/lib/caseStudies";
import { absolute, breadcrumbSchema, graph, staticPageMeta } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const n = (await getCaseStudies()).length;
  return staticPageMeta({
    title: `Case Studies: ${n} Live Client Websites`,
    description: `Case studies of ${n} live client websites by Nikhil Padwal: corporate, education, e-commerce and industrial sites on WordPress, WooCommerce and Shopify.`,
    path: "/case-studies",
  });
}

export default async function CaseStudies({ searchParams }: { searchParams: Promise<{ sector?: string }> }) {
  const { sector } = await searchParams;
  const projects = await getCaseStudies();
  const featured = projects.filter((p) => p.featured).slice(0, 4);
  const jsonLd = graph(
    {
      "@type": "CollectionPage",
      name: "Case studies",
      url: absolute("/case-studies"),
      hasPart: projects.map((p) => ({ "@type": "CreativeWork", name: p.name, url: absolute(`/case-studies/${p.slug}`) })),
    },
    breadcrumbSchema([{ name: "Case studies", path: "/case-studies" }]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <header className="page-hero band">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Case studies</span></nav>
          <Reveal as="div">
            <h1 className="serif">{projects.length} live sites, <em>one desk.</em></h1>
            <p className="lede">Colleges, manufacturers, creative studios, non-profits, a state archive and online stores. Every screenshot is the live site, on desktop.</p>
          </Reveal>
        </div>
      </header>
      <section className="band case-index">
        <div className="wrap">
          {featured.length > 0 && <FeaturedWork items={featured} />}
          <Archive items={projects.map(({ slug, name, platform, category, sector, image }) => ({ slug, name, platform, category, sector, image }))} initialSector={sector} heading="h2" title="Every project" />
        </div>
      </section>
    </>
  );
}
