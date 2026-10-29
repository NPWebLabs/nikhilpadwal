import Image from "next/image";
import Link from "next/link";
import { disciplines, education, experience, type Job } from "@/lib/data";
import { formatDate, splitTags, type PublicPost } from "@/lib/posts";
import { isRemote } from "@/lib/url";
import { NeedLink } from "./FooterBits";
import Reveal from "./Reveal";
import Toolkit from "./Toolkit";
import { Shot } from "./ui";

export function SecHead({ num, label, title, lede }: { num?: string; label?: string; title: React.ReactNode; lede?: string }) {
  return (
    <div className="sec-head">
      <div>
        {num && <div className="num-label"><b>{num}</b><span className="label">{label}</span></div>}
        <h2 className="serif h2">{title}</h2>
      </div>
      {lede && <p className="lede">{lede}</p>}
    </div>
  );
}

function JobCard({ j, i }: { j: Job; i: number }) {
  return (
    <Reveal as="article" className="job">
      <div className="yr">{j.start}</div>
      <div>
        <h3>{j.company}</h3>
        <p className="role">{j.role}</p>
        <p className="when">{j.period.toUpperCase()} · {j.location.toUpperCase()}</p>
        <p className="about">{j.about}</p>
        <ul>{j.points.map((p) => <li key={p}>{p}</li>)}</ul>
        <div className="chips">{j.stack.map((s) => <span className="chip" key={s}>{s}</span>)}</div>
      </div>
      <div className="media">
        {j.url && j.image ? (
          <Shot url={j.url} image={j.image} alt={`${j.company} homepage`} href={j.url} sizes="(max-width: 760px) 100vw, 40vw" position={j.image.endsWith(".png") ? "15% 0" : undefined} />
        ) : (
          <div className="start-card">
            <span className="label">{i === experience.length - 1 ? "Where it started" : "On site"}</span>
            <b>First client sites, first deploys.</b>
            <p>Six months of custom themes, PHP, hosting and SSL that turned into a career.</p>
          </div>
        )}
      </div>
    </Reveal>
  );
}

export function Experience() {
  return (
    <section className="sec band" id="experience">
      <div className="wrap">
        <SecHead num="03" label="Work history" title={<>{["", "One", "Two", "Three", "Four", "Five", "Six", "Seven"][experience.length] || experience.length} teams,<br />one thread</>} lede="Make the website faster, findable and easier to run." />
        {experience.map((j, i) => <JobCard key={j.company} j={j} i={i} />)}
      </div>
    </section>
  );
}

export function Education() {
  return (
    <div className="cream">
      <section className="sec band" id="education">
        <div className="wrap">
          <SecHead num="04" label="Learn" title={<>Two Pune<br />campuses</>} lede="Five years of computer engineering, and a lot of late-night localhost." />
          <div className="edu-grid">
            {education.map((e, i) => (
              <Reveal as="article" className="edu" key={e.degree} delay={i * 0.08}>
                <div className="img"><Image src={e.image} alt={`${e.school} campus`} fill sizes="(max-width: 760px) 100vw, 50vw" style={i === 1 ? { objectPosition: "center 60%" } : undefined} /></div>
                <div className="in">
                  <span className="yrs">{e.period} · {e.place.toUpperCase()}</span>
                  <h3>{e.degree}</h3>
                  <p className="sch">{e.school}</p>
                  <p>{e.note}</p>
                  <div className="row"><span>{e.score.includes("CGPA") ? "CGPA" : "Score"}</span><b>{e.score.replace(" CGPA", "")}</b></div>
                </div>
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: "clamp(80px,10vw,120px)" }}>
            <div className="sec-head" style={{ marginBottom: 0 }}>
              <h2 className="serif h2">The toolkit</h2>
              <p className="lede">What&apos;s open on the screen on a normal day.</p>
            </div>
            <Toolkit />
          </div>
        </div>
      </section>
    </div>
  );
}

export function PostCard({ p, wide }: { p: PublicPost; wide?: boolean }) {
  const tag = splitTags(p.tags)[0];
  return (
    <Reveal>
      <Link className={`${wide ? "post" : "pcard"}${p.coverImage ? "" : " no-img"}`} href={`/blog/${p.slug}`}>
        {p.coverImage && (
          <div className="img">
            <Image src={p.coverImage} alt="" fill sizes={wide ? "(max-width: 1024px) 100vw, 640px" : "(max-width: 760px) 100vw, 50vw"} unoptimized={isRemote(p.coverImage)} />
          </div>
        )}
        <div className={wide ? undefined : "in"}>
          <span className="meta2">{[tag, formatDate(p.publishedAt), `${p.readingMinutes} min read`].filter(Boolean).join(" · ").toUpperCase()}</span>
          {wide ? <h3>{p.title}</h3> : <h2>{p.title}</h2>}
          {p.excerpt && <p>{p.excerpt}</p>}
          <span className="link" style={{ marginTop: 8 }}>Read the post →</span>
        </div>
      </Link>
    </Reveal>
  );
}

export function BlogTeaser({ posts }: { posts: PublicPost[] }) {
  return (
    <section className="sec band" id="blog">
      <div className="wrap">
        <SecHead num="05" label="Write" title="From the blog" lede="Notes from client work: WordPress speed, Shopify setups, SEO fixes and AI experiments." />
        {posts.length ? (
          <div className="stack-lg">{posts.slice(0, 1).map((p) => <PostCard key={p.slug} p={p} wide />)}</div>
        ) : (
          <p className="empty-note" style={{ marginBottom: 0 }}>New posts are on the way.</p>
        )}
        {posts.length > 1 && (
          <div className="post-list" style={{ paddingBottom: 0, marginTop: 24 }}>
            {posts.slice(1, 3).map((p) => <PostCard key={p.slug} p={p} />)}
          </div>
        )}
        <div style={{ marginTop: 24 }}><Link className="link" href="/blog">All posts →</Link></div>
      </div>
    </section>
  );
}

export function Disciplines() {
  return (
    <section className="sec band" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <h2 className="serif h2" style={{ marginBottom: 40 }}>Three disciplines.<br /><em style={{ color: "var(--gold)" }}>Pick where to start.</em></h2>
        <div className="disc">
          {disciplines.map((d) => (
            <NeedLink key={d.title} href={d.href} need={d.need}>
              <b>{d.title}</b><span>{d.body}</span><i aria-hidden="true">→</i>
            </NeedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
