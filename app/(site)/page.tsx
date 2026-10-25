import Link from "next/link";
import { profile, projects, experience, education, skills, skillIcons, services, workProcess } from "@/lib/data";
import { getPublishedPosts } from "@/lib/posts";
import WorkGrid from "@/components/WorkGrid";
import BrowserFrame from "@/components/BrowserFrame";
import PostCard from "@/components/PostCard";
import ContactForm from "@/components/ContactForm";
import { whatsappUrl, WhatsAppIcon } from "@/components/WhatsAppButton";

export const revalidate = 300;

export default async function Home() {
  const posts = await getPublishedPosts(3);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nikhilpadwal.com";
  const platforms = new Set(projects.map((p) => p.platform)).size;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: "Nik",
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    url: siteUrl,
    image: `${siteUrl}/images/nik-portrait.webp`,
    address: { "@type": "PostalAddress", addressLocality: "Pune", addressCountry: "IN" },
    sameAs: Object.values(profile.socials).map((s) => s.url),
    knowsAbout: ["WordPress", "WooCommerce", "Shopify", "Next.js", "React", "Technical SEO", "Core Web Vitals", "OpenAI API"],
    alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ─────────────────────────────── */}
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero__grid">
          <div className="hero__copy">
            <span className="label" style={{ alignSelf: "flex-start" }}>Web · SaaS · AI</span>
            <h1 id="hero-title" className="display">
              One developer.<br />Three disciplines.<br />Endless possibilities.
            </h1>
            <p className="hero__sub">Web engineering, SaaS development, and AI innovation.</p>
            <div className="hero__actions">
              <Link href="#contact" className="btn">Contact me</Link>
              <a href={whatsappUrl()} className="btn btn--wa" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> WhatsApp</a>
              <Link href="#work" className="btn btn--ghost">See the work</Link>
            </div>
          </div>
          <figure className="polaroid">
            <span className="tape" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/nik-portrait.webp" alt="Portrait of Nikhil Padwal in an orange sweatshirt" width={1100} height={1473} fetchPriority="high" />
            <figcaption>Nikhil Padwal</figcaption>
            <span className="sticker" aria-hidden="true">
              <span><b>{profile.years}+</b>years<br />shipping</span>
            </span>
          </figure>
        </div>
        <div className="hero__foot">
          <a href="mailto:nikhilpadwal.101@gmail.com" className="paper-note">Open for projects · say hi →</a>
          <a href="#numbers" className="scroll-cue">Scroll to read <i aria-hidden="true">↓</i></a>
        </div>
      </section>

      {/* ── 01 The numbers ─────────────────────────────── */}
      <section className="chapter chapter--orange" aria-labelledby="ch-numbers">
        <div className="wrap reveal">
          <span className="chapter__num">01</span>
          <h2 id="ch-numbers" className="chapter__title">The<br />numbers</h2>
        </div>
      </section>

      <section id="numbers" className="section">
        <div className="wrap">
          <p className="statement reveal">
            In {profile.years} years, Nikhil has shipped <em>{profile.clients} client sites</em> across {platforms} platforms, for{" "}
            {experience.length} companies, from a desk in Pune.
          </p>
          <div className="stats">
            {[
              { v: `${profile.years}+`, l: "years building for the web, since 2021" },
              { v: profile.clients, l: "client websites and stores in the portfolio" },
              { v: String(experience.length), l: "companies, from Pune to Greater St. Louis" },
              { v: String(platforms), l: "platforms: WordPress, WooCommerce, Shopify" },
            ].map((s, i) => (
              <div key={s.l} className="stat reveal" style={{ ["--d" as string]: `${i * 90}ms` }}>
                <span className="stat__value">{s.v}</span>
                <span className="stat__label">{s.l}</span>
              </div>
            ))}
          </div>
          <div className="numbers-body">
            <div className="reveal">
              <p className="lead">{profile.intro}</p>
            </div>
            <div className="reveal">
              {profile.summary.map((p) => <p key={p}>{p}</p>)}
              <p className="source">Source: résumé, 2026. Live sites linked below.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 Build ─────────────────────────────── */}
      <section className="chapter chapter--black" aria-labelledby="ch-build">
        <div className="wrap reveal">
          <span className="chapter__num">02</span>
          <h2 id="ch-build" className="chapter__title">Build</h2>
          <p className="chapter__line">Colleges, manufacturers, creative studios, non-profits, a state archive and online stores. Every screenshot below is the live site, on desktop.</p>
        </div>
      </section>

      <section id="work" className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h2 reveal">Selected work</h2>
            <p className="muted reveal">WordPress for content-heavy business sites, WooCommerce when the store lives next to the content, Shopify when the brand is the store.</p>
          </div>
          <WorkGrid projects={projects.filter((p) => p.featured)} filters={false} />
          <div className="work-more reveal">
            <Link href="/case-studies" className="btn">All {projects.length} case studies <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="services-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <h2 id="services-title" className="h2 reveal">What I can build for you</h2>
            <p className="muted reveal">Four things I do every week. Pick one, or all four.</p>
          </div>
          <div className="services reveal">
            {services.map((s, i) => (
              <div key={s.title} className="service">
                <span className="service__n">0{i + 1}</span>
                <h3 className="h3">{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
          <ol className="process" style={{ padding: 0 }}>
            {workProcess.map((p, i) => (
              <li key={p.step} className="reveal" style={{ ["--d" as string]: `${i * 80}ms` }}>
                <strong>{p.step}</strong>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 03 Experience ─────────────────────────────── */}
      <section className="chapter chapter--blue" id="experience" aria-labelledby="ch-exp" style={{ paddingBottom: "clamp(40px, 6vw, 80px)" }}>
        <div className="wrap">
          <div className="reveal">
            <span className="chapter__num">03</span>
            <h2 id="ch-exp" className="chapter__title">Work<br />history</h2>
            <p className="chapter__line">Four teams, one thread: make the website faster, findable and easier to run.</p>
          </div>
          <div className="timeline" style={{ marginTop: "clamp(48px, 7vw, 96px)" }}>
            {experience.map((j) => (
              <article key={j.company} className="job reveal">
                <div className="job__year" aria-hidden="true">{j.start}</div>
                <div>
                  <h3 className="h3 job__company">{j.company}</h3>
                  <p className="job__role">{j.role}</p>
                  <p className="job__meta">{j.period} · {j.location}</p>
                  <p className="job__about">{j.about}</p>
                  <ul>{j.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  <div className="job__stack">{j.stack.map((s) => <span key={s} className="chip">{s}</span>)}</div>
                </div>
                <div>
                  {j.url ? (
                    <>
                      <BrowserFrame url={j.url} image={j.image} alt={`${j.company} official website`} href={j.url} emptyTitle={j.company} />
                      <a className="arrow-link visit" href={j.url} target="_blank" rel="noopener noreferrer">
                        {j.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")} <span aria-hidden="true">↗</span>
                      </a>
                    </>
                  ) : (
                    <div className="job__origin">
                      <span className="eyebrow" style={{ color: "rgba(243,243,241,.7)" }}>Where it started</span>
                      <strong>First client sites, first deploys.</strong>
                      <span style={{ opacity: 0.8 }}>Six months of custom themes, PHP, hosting and SSL that turned into a career.</span>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 Learn ─────────────────────────────── */}
      <section className="chapter chapter--yellow" aria-labelledby="ch-learn">
        <div className="wrap reveal">
          <span className="chapter__num">04</span>
          <h2 id="ch-learn" className="chapter__title">Learn</h2>
          <p className="chapter__line">Two Pune campuses, five years of computer engineering, and a lot of late-night localhost.</p>
        </div>
      </section>

      <section id="education" className="section">
        <div className="wrap">
          <div className="edu-grid">
            {education.map((e) => (
              <article key={e.school} className="edu reveal">
                <figure className="edu__photo" style={{ margin: 0 }}>
                  <span className="tape" aria-hidden="true" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={e.image} alt={`${e.school} campus, ${e.place}`} loading="lazy" />
                </figure>
                <div className="edu__body">
                  <span className="eyebrow">{e.period}</span>
                  <h3 className="h3">{e.degree}</h3>
                  <p className="edu__school">{e.school}</p>
                  <p className="edu__meta muted">{e.place}</p>
                  <span className="edu__score">{e.score}</span>
                  <p className="edu__note muted">{e.note}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="toolkit-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <hr className="rule" style={{ marginBottom: "clamp(48px, 6vw, 80px)" }} />
          <div className="section-head">
            <h2 id="toolkit-title" className="h2 reveal">The toolkit</h2>
            <p className="muted reveal">What&apos;s open on the screen on a normal day.</p>
          </div>
          <div className="skills">
            {skills.map((g, i) => (
              <div key={g.group} className="reveal" style={{ ["--d" as string]: `${(i % 4) * 70}ms` }}>
                <h3>{g.group}</h3>
                <ul>
                  {g.items.map((s) => (
                    <li key={s} className="tool">
                      {skillIcons[s] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`/icons/${skillIcons[s]}.svg`} alt="" width={20} height={20} loading="lazy" />
                      ) : (
                        <span className="tool__glyph" aria-hidden="true" />
                      )}
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 Write ─────────────────────────────── */}
      <section className="chapter chapter--red" aria-labelledby="ch-write">
        <div className="wrap reveal">
          <span className="chapter__num">05</span>
          <h2 id="ch-write" className="chapter__title">Write</h2>
          <p className="chapter__line">Notes from client work: WordPress speed, Shopify setups, SEO fixes and AI experiments.</p>
        </div>
      </section>

      <section className="section" aria-label="Latest posts">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h2 reveal">From the blog</h2>
            <Link href="/blog" className="arrow-link reveal">All posts <span aria-hidden="true">→</span></Link>
          </div>
          {posts.length ? (
            <div className="post-grid">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div>
          ) : (
            <div className="empty-state reveal">
              <h3 className="h3">First posts are on the way.</h3>
              <p>Follow along on Instagram at {profile.socials.instagram.handle} while the drafts get finished.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Close ─────────────────────────────── */}
      <section className="section section--tight" aria-labelledby="worlds-title">
        <div className="wrap">
          <h2 id="worlds-title" className="display reveal" style={{ marginBottom: "clamp(32px, 5vw, 56px)" }}>
            Three disciplines.<br />Pick where to start.
          </h2>
          <div className="worlds reveal">
            <a className="world" href="#work"><strong>Web engineering <span aria-hidden="true">→</span></strong><span>WordPress, WooCommerce and Shopify sites built to be fast and found</span></a>
            <a className="world" href="#contact"><strong>SaaS development <span aria-hidden="true">→</span></strong><span>React and Next.js web apps with APIs behind them</span></a>
            <a className="world" href="#contact"><strong>AI innovation <span aria-hidden="true">→</span></strong><span>Chatbots and automations on your site</span></a>
          </div>
        </div>
      </section>

      <section id="contact" className="contact" aria-labelledby="contact-title">
        <div className="wrap contact__grid">
          <div>
          <span className="eyebrow" style={{ color: "rgba(243,243,241,.6)" }}>Contact</span>
          <h2 id="contact-title" className="h2" style={{ margin: "14px 0 28px", maxWidth: "16ch" }}>
            Have a site that should be faster, or a store that should exist?
          </h2>
          <a className="contact__mail" href={`mailto:${profile.email}?subject=Project%20enquiry`}>{profile.email}</a>
          <div className="contact__actions">
            <a href={whatsappUrl()} className="btn btn--wa" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> WhatsApp {profile.phone}</a>
            <a href={`tel:+${profile.whatsapp}`} className="btn btn--light">Call {profile.phone}</a>
          </div>
          <div className="socials">
            {Object.values(profile.socials).map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label} <small>{s.handle}</small> <span aria-hidden="true">↗</span>
              </a>
            ))}
            <a href="/nikhil-padwal-resume.pdf" target="_blank" rel="noopener">Résumé <small>PDF</small> <span aria-hidden="true">↓</span></a>
          </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
