import type { Metadata } from "next";
import Link from "next/link";
import { projects, sectors, profile } from "@/lib/data";
import WorkGrid from "@/components/WorkGrid";

export const metadata: Metadata = {
  title: "Case studies",
  description: `${projects.length} website case studies by ${profile.name}: corporate sites, colleges, online stores and manufacturers, built on WordPress, WooCommerce and Shopify.`,
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudies() {
  return (
    <>
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
