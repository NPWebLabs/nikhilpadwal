"use client";
import { motion, useReducedMotion } from "motion/react";
import { skills, skillIcons } from "@/lib/data";
import { Ico } from "./ui";
import Reveal from "./Reveal";

/** Logo marquee (Motion, infinite) and the grouped skill list. */
export default function Toolkit() {
  const reduce = useReducedMotion();
  const icons = Array.from(new Set(Object.values(skillIcons)));
  return (
    <>
      <div className="marquee" aria-hidden="true">
        <motion.div className="mtrack" animate={reduce ? undefined : { x: ["0%", "-50%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
          {[...icons, ...icons].map((ic, i) => <Ico key={i} name={ic} />)}
        </motion.div>
      </div>
      <div className="kit">
        {skills.map((g, i) => (
          <Reveal key={g.group} delay={(i % 4) * 0.05}>
            <h4>{g.group.toUpperCase()}</h4>
            <ul>
              {g.items.map((it) => (
                <li key={it}>{skillIcons[it] && <Ico name={skillIcons[it]} />}{it}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </>
  );
}
