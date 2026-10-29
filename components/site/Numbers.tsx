"use client";
import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import Reveal from "./Reveal";

type Stat = { n: number; suffix?: string; label: string };

function Count({ n, suffix = "", delay }: { n: number; suffix?: string; delay: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView || reduce || !ref.current) return;
    const el = ref.current;
    const c = animate(0, n, { duration: 1.4, delay, ease: [0.2, 0.7, 0.1, 1], onUpdate: (v) => (el.textContent = `${Math.round(v)}${suffix}`) });
    return () => c.stop();
  }, [inView, reduce, n, suffix, delay]);
  return <b ref={ref}>{n}{suffix}</b>;
}

export default function Numbers({ sentence, stats, bio }: { sentence: React.ReactNode; stats: Stat[]; bio: string[] }) {
  return (
    <section className="sec band" id="numbers">
      <div className="wrap">
        <div className="num-label"><b>01</b><span className="label">The numbers</span></div>
        <Reveal as="p" className="big-sentence">{sentence}</Reveal>
        <div className="stats">
          {stats.map((s, i) => (
            <Reveal className="stat" key={s.label} delay={i * 0.08}>
              <Count n={s.n} suffix={s.suffix} delay={i * 0.12} />
              <span>{s.label}</span>
            </Reveal>
          ))}
        </div>
        <div className="bio">
          {bio.map((p, i) => <Reveal as="p" key={i} delay={i * 0.08}>{p}</Reveal>)}
        </div>
        <p className="src">SOURCE: RÉSUMÉ, 2026. LIVE SITES LINKED BELOW.</p>
      </div>
    </section>
  );
}
