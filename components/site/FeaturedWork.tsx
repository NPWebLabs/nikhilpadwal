"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Project } from "@/lib/projects";
import { Shot, host } from "./ui";
import Reveal from "./Reveal";

/** One featured project. The screenshot drifts slightly as it scrolls past (Motion scroll-linked transform). */
function Card({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [24, -24]);
  return (
    <Reveal as="article" className="proj" delay={(i % 2) * 0.08}>
      <motion.div ref={ref} style={{ y }}>
        <Shot url={p.url} image={p.image} alt={`${p.name} homepage`} href={p.url} />
      </motion.div>
      <span className="label dot">{p.platform} · {p.category}</span>
      <h3>{p.name}</h3>
      <p>{p.summary}</p>
      <div className="chips">{p.highlights.map((h) => <span className="chip" key={h}>{h}</span>)}</div>
      <div className="acts">
        <Link className="link" href={`/case-studies/${p.slug}`}>Read case study →</Link>
        <a className="link" href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${host(p.url)}`}>Visit site ↗</a>
      </div>
    </Reveal>
  );
}

export default function FeaturedWork({ items }: { items: Project[] }) {
  return <div className="grid-work">{items.map((p, i) => <Card key={p.slug} p={p} i={i} />)}</div>;
}
