import Link from "next/link";
import { Arrow } from "@/components/site/ui";

export default function NotFound() {
  return (
    <section className="band">
      <div className="wrap nf">
        <b>404</b>
        <h1 className="serif h2">This page took a different route.</h1>
        <p className="lede">The link may be old, or the page moved. The work and the blog are still here.</p>
        <div className="cta-row">
          <Link href="/" className="btn"><span className="ic"><Arrow /></span>Back home</Link>
          <Link href="/case-studies" className="btn ghost"><span className="ic"><Arrow /></span>Case studies</Link>
        </div>
      </div>
    </section>
  );
}
