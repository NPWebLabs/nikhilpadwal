"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { SERVICE_ARTS } from "./ServiceArt";

type Service = { title: string; body: string };
const CAPS = ["BUSINESS WEBSITES · WORDPRESS, ELEMENTOR, NEXT.JS", "ECOMMERCE · WOOCOMMERCE, SHOPIFY", "PERFORMANCE · CORE WEB VITALS, TECHNICAL SEO", "AI · CHATBOTS, CONTENT, AUTOMATIONS"];

/** Accordion of services. The open one shows its animated SVG, which replays every 9s while in view. */
export default function Services({ services }: { services: Service[] }) {
  const [open, setOpen] = useState(0);
  const [run, setRun] = useState(0); // bump to remount (= replay) the illustration
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { amount: 0.3 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce) return;
    setRun((r) => r + 1);
    const id = setInterval(() => setRun((r) => r + 1), 9000);
    return () => clearInterval(id);
  }, [inView, reduce, open]);

  // The speed illustration counts its score up
  useEffect(() => {
    const n = frameRef.current?.querySelector<SVGTextElement>(".svc-art.on [data-to]");
    if (!n || reduce || !run) return;
    const to = Number(n.dataset.to);
    const t0 = performance.now() + 300;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - t0) / 1900));
      n.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, open, reduce]);

  const playing = inView && !reduce && run > 0;

  return (
    <div className="services-grid">
      <div className="svc-media">
        <div className="frame" ref={frameRef}>
          {SERVICE_ARTS.map((Art, i) => (
            <Art key={i === open ? `on-${run}` : `off-${i}`} cls={`svc-art${i === open ? " on" : ""}${i === open && playing ? " play" : ""}`} />
          ))}
        </div>
        <span className="cap">{CAPS[open]}</span>
      </div>
      <div className="acc">
        {services.map((s, i) => {
          const isOpen = open === i;
          return (
            <div className="acc-item" data-open={isOpen || undefined} key={s.title}>
              <h3>
                <button type="button" aria-expanded={isOpen} aria-controls={`svc-${i}`} onClick={() => setOpen(i)}>
                  <small>{String(i + 1).padStart(2, "0")}</small>{s.title}<span className="pm" aria-hidden="true">+</span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`svc-${i}`}
                    className="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.2, 0.7, 0.1, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <p>{s.body}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
