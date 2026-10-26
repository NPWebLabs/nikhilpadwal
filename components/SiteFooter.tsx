import Link from "next/link";
import Logo from "./Logo";
import { nav, profile } from "@/lib/data";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <Logo />
        <span>
          © {year} {profile.name} · Built with Next.js · {profile.location}
        </span>
        <nav aria-label="Footer" className="site-footer__nav">
          {nav.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
        </nav>
        <span style={{ display: "flex", gap: 16 }}>
          {Object.values(profile.socials).map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
        </span>
      </div>
    </footer>
  );
}
