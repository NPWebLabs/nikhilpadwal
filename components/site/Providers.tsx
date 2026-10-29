"use client";
import { MotionConfig } from "motion/react";

/** Motion follows the visitor's "reduce motion" setting site-wide. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
