import Logo from "./Logo";
import { profile } from "@/lib/data";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <Logo />
        <span>
          © {year} {profile.name} · Built with Next.js · {profile.location}
        </span>
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
