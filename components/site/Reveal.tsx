"use client";
import { motion, type HTMLMotionProps } from "motion/react";

type Tag = "div" | "p" | "article" | "section" | "li" | "header";

/** Fades and lifts content in once it scrolls into view. Respects reduced motion via <MotionConfig reducedMotion="user">. */
export default function Reveal({ as = "div", delay = 0, y = 28, children, ...rest }: { as?: Tag; delay?: number; y?: number } & HTMLMotionProps<"div">) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.7, 0.1, 1] }}
      {...rest}
    >
      {children}
    </M>
  );
}
