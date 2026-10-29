"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import Reveal from "./Reveal";

/** "How a project runs": the connecting line fills as the steps scroll past. Vertical below 1024px. */
export default function Process({ steps }: { steps: { step: string; body: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const [vertical, setVertical] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width:1024px)");
    const on = () => setVertical(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return (
    <div className="process">
      <span className="label dot">How a project runs</span>
      <div className="steps" ref={ref}>
        <div className="track" aria-hidden="true">
          <motion.i style={vertical ? { scaleY: progress, scaleX: 1, transformOrigin: "50% 0" } : { scaleX: progress, scaleY: 1, transformOrigin: "0 50%" }} />
        </div>
        {steps.map((s, i) => (
          <Reveal className="step" key={s.step} delay={i * 0.06}>
            <span className="n">{i + 1}</span>
            <div><h4>{s.step}</h4><p>{s.body}</p></div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
