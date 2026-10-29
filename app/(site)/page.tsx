import type { Metadata } from "next";
import Hero from "@/components/site/Hero";
import Numbers from "@/components/site/Numbers";
import FeaturedWork from "@/components/site/FeaturedWork";
import Archive from "@/components/site/Archive";
import Services from "@/components/site/Services";
import Process from "@/components/site/Process";
import { BlogTeaser, Disciplines, Education, Experience, SecHead } from "@/components/site/Sections";
import { experience, profile, services, workProcess } from "@/lib/data";
import { getCaseStudies } from "@/lib/caseStudies";
import { getPublishedPosts } from "@/lib/posts";
import { DEFAULT_DESCRIPTION, graph, personSchema, staticPageMeta, websiteSchema } from "@/lib/seo";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return staticPageMeta({ description: DEFAULT_DESCRIPTION, path: "/" });
}

const RING = ["simitbhagat", "thinredline", "ccspune", "ezeecosmetics", "gyanamrit", "aquarius", "mahaarchives", "luxecaptures", "dionskywalk", "tilakayurved", "vruksha", "3below", "bnca", "jugaadstore", "dasagro", "ipmmi"];

export default async function Home() {
  const [projects, posts] = await Promise.all([getCaseStudies(), getPublishedPosts(3)]);
  const featured = projects.filter((p) => p.featured);
  const platforms = new Set(projects.map((p) => p.platform)).size;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph(personSchema(), websiteSchema()) }} />
      <Hero shots={RING.map((s) => `/shots/${s}.webp`)} />

      <Numbers
        sentence={<>In {profile.years} years, Nikhil has shipped {profile.clients} client sites across {platforms} platforms, for {experience.length} companies, <span>from Pune to Navi Mumbai.</span></>}
        stats={[
          { n: profile.years, suffix: "+", label: "years building for the web, since 2021" },
          { n: 50, suffix: "+", label: "client websites and stores in the portfolio" },
          { n: experience.length, label: "companies, from Navi Mumbai to Greater St. Louis" },
          { n: platforms, label: `platforms: ${[...new Set(projects.map((p) => p.platform))].join(", ")}` },
        ]}
        bio={[profile.intro, ...profile.summary]}
      />

      <section className="sec band" id="work" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="work-head">
            <div><div className="num-label"><b>02</b><span className="label">Build</span></div><h2 className="serif h2">Selected<br />work</h2></div>
            <div className="big-gold">
              <p>Colleges, manufacturers, creative studios, non-profits, a state archive and online stores. Every screenshot is the live site, on desktop.</p>
              <div className="w" aria-hidden="true"><span>Live</span><span>sites</span></div>
            </div>
          </div>
          <p className="lede" style={{ marginBottom: 56 }}>WordPress for content-heavy business sites, WooCommerce when the store lives next to the content, Shopify when the brand is the store.</p>
          <FeaturedWork items={featured} />
          <Archive items={projects.map(({ slug, name, platform, category, sector, image }) => ({ slug, name, platform, category, sector, image }))} />
        </div>
      </section>

      <div className="cream">
        <section className="sec band" id="services">
          <div className="wrap">
            <SecHead title={<>What I can<br />build for you</>} lede="Four things I do every week. Pick one, or all four." />
            <Services services={services} />
            <Process steps={workProcess} />
          </div>
        </section>
      </div>

      <Experience />
      <Education />
      <BlogTeaser posts={posts} />
      <Disciplines />
    </>
  );
}
