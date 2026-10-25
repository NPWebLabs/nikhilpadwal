import Link from "next/link";
export default function NotFound() {
  return (
    <section className="wrap" style={{ padding: "clamp(80px,12vw,160px) var(--gutter)" }}>
      <span className="label">404</span>
      <h1 className="display" style={{ margin: "18px 0" }}>This page took a wrong turn.</h1>
      <Link href="/" className="btn">Back home</Link>
    </section>
  );
}
