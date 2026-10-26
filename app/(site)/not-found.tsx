import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };
export default function NotFound() {
  return (
    <section className="wrap" style={{ padding: "clamp(80px,12vw,160px) var(--gutter)" }}>
      <span className="label">404</span>
      <h1 className="display" style={{ margin: "18px 0" }}>This page took a wrong turn.</h1>
      <div className="hero__actions">
        <Link href="/" className="btn">Back home</Link>
        <Link href="/case-studies" className="btn btn--ghost">See case studies</Link>
      </div>
    </section>
  );
}
