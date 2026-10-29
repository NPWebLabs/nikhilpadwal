"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, type Transition } from "motion/react";
import { profile, whatsappUrl } from "@/lib/data";
import { Arrow, Ico } from "./ui";

// Runs while the HTML is parsed, before first paint: decides whether the intro video plays (every load, as in the original page).
const INTRO_JS = `try{var d=document.documentElement,v=document.createElement('video');if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&(v.canPlayType('video/mp4')||v.canPlayType('video/webm')))d.classList.add('is-intro')}catch(e){}`;

// Where the cut-out photo sits in the last video frame (1280×720): 440×576 at (432, 32).
const CX = 432, CY = 32, CH = 576;
const EASE: Transition["ease"] = [0.2, 0.7, 0.1, 1];

export default function Hero({ shots }: { shots: string[] }) {
  const [phase, setPhase] = useState<"wait" | "intro" | "done">("wait");
  const [flash, setFlash] = useState(false);
  const [openerGone, setOpenerGone] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const done = useRef(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const finish = useCallback((skipped: boolean) => {
    if (done.current) return;
    done.current = true;
    document.documentElement.classList.remove("is-intro");
    if (!skipped) setFlash(true);
    setPhase("done");
    openerRef.current?.classList.add("out");
    setTimeout(() => { setOpenerGone(true); setFlash(false); }, 1500);
  }, []);

  // Intro video → photo → site
  useEffect(() => {
    if (!document.documentElement.classList.contains("is-intro")) {
      setPhase("done");
      setOpenerGone(true);
      return;
    }
    setPhase("intro");
    window.scrollTo(0, 0);
    const v = vidRef.current!;
    const place = () => {
      const r = imgRef.current?.getBoundingClientRect();
      if (!r?.height) return;
      const k = r.height / CH;
      v.style.width = `${1280 * k}px`;
      v.style.height = `${720 * k}px`;
      v.style.transform = `translate(${r.left - CX * k}px, ${r.top - CY * k}px)`;
    };
    const onTime = () => {
      if (!v.duration) return;
      if (barRef.current) barRef.current.style.width = `${(v.currentTime / v.duration) * 100}%`;
      if (v.currentTime >= v.duration - 0.06) finish(false);
    };
    const start = () => { place(); v.play()?.catch(() => finish(true)); };
    const onEnd = () => finish(false);
    const onErr = () => finish(true);
    place();
    window.addEventListener("resize", place);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    v.addEventListener("error", onErr, true);
    if (v.readyState >= 3) start(); else v.addEventListener("canplay", start, { once: true });
    const t1 = setTimeout(() => { if (v.paused && !done.current) finish(true); }, 3500);
    const t2 = setTimeout(() => finish(true), 9000);
    return () => {
      window.removeEventListener("resize", place);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnd);
      v.removeEventListener("error", onErr, true);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [finish]);

  // Screenshot ring: slow spin that speeds up as the hero scrolls away
  useEffect(() => {
    if (reduce) return;
    let angle = 0, last = performance.now(), raf = 0;
    const spin = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      angle -= ((4 + scrollYProgress.get() * 40) * dt) / 1000;
      if (ringRef.current) ringRef.current.style.transform = `rotateY(${angle}deg)`;
      raf = requestAnimationFrame(spin);
    };
    raf = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(raf);
  }, [reduce, scrollYProgress]);

  const show = phase === "done";
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: show ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.8, delay, ease: EASE },
  });
  const lines = ["One developer.", "Three disciplines.", "Endless possibilities."];

  return (
    <section className="hero band" aria-label="Introduction" ref={heroRef}>
      <script dangerouslySetInnerHTML={{ __html: INTRO_JS }} />
      {!openerGone && (
        <div className="opener" ref={openerRef} aria-hidden="true">
          <video ref={vidRef} muted playsInline preload="auto" width={1280} height={720}>
            <source src="/video/intro.webm" type="video/webm" />
            <source src="/video/intro.mp4" type="video/mp4" />
          </video>
          <div className="fade" />
          <div className="bar" ref={barRef} />
          <button className="skip glass" data-glass type="button" onClick={() => { vidRef.current?.pause(); finish(true); }}>SKIP INTRO</button>
        </div>
      )}

      <motion.div
        className="scene"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 1.12, y: 30 }}
        animate={show ? { opacity: 1, scale: 1, y: 0 } : undefined}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <div className="ring" ref={ringRef}>
          {shots.map((s, i) => (
            <div className="card3d" key={s} style={{ "--i": i } as React.CSSProperties}>
              <Image src={s} alt="" fill sizes="360px" />
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="hero-badge glass"
        data-glass
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={show ? { opacity: 1, scale: 1 } : undefined}
        transition={{ delay: 1.1, type: "spring", bounce: 0.35, duration: 0.6 }}
      >
        <b>{profile.years}+</b><span>YEARS<br />SHIPPING</span>
      </motion.div>

      {/* Layout from the original page: centred portrait, copy across the full width underneath. The title (left) and the
          blurb (right) sit over the faded lower part of the photo and share one bottom edge. */}
      <div className="wrap hero-grid">
        <div className={`portrait${flash ? " flash" : ""}`}>
          <Image ref={imgRef} src="/images/nik-cutout.webp" alt="Nikhil Padwal" width={1098} height={1433} priority sizes="(max-width: 760px) 92vw, 500px" />
        </div>

        <div className="hero-copy">
          <div className="hero-main">
            <h1 className="serif">
              {lines.map((l, i) => (
                <span className="ln" key={l}>
                  <motion.span initial={{ y: "105%" }} animate={show ? { y: "0%" } : undefined} transition={{ duration: 1.1, delay: 0.35 + i * 0.1, ease: EASE }}>
                    {i === 2 ? <em>{l}</em> : l}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p className="sub" {...fade(0.68)}>Web engineering, SaaS development, and AI innovation.</motion.p>
            <motion.div className="cta-row" {...fade(0.76)}>
              <Link href="/#contact" className="btn"><span className="ic"><Arrow /></span>Contact me</Link>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn ghost wa glass" data-glass>
                <span className="ic"><Ico name="whatsapp-white" size={18} style={{ color: "#fff" }} /></span>WhatsApp
              </a>
            </motion.div>
          </div>

          <motion.div className="hero-aside" {...fade(0.84)}>
            <p>{profile.role} at <b>Claidroid</b>. Fast, SEO-ready websites, stores and web apps on <b>WordPress, WooCommerce, Shopify, React and Next.js</b>.</p>
            <Link href="/#work" className="link">See the work ↓</Link>
            <div className="sig" aria-hidden="true">Nikhil Padwal</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
