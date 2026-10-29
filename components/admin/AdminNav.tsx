"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const I = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  posts: <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" />,
  cases: <path d="M3 7h18v13H3zM8 7V4h8v3M3 12h18" />,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  seo: <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5" />,
  files: <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  out: <path d="M10 17l5-5-5-5M15 12H3M21 4v16" />,
  ext: <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />,
};
const Icon = ({ d }: { d: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);

const SECTIONS = [
  { group: "Content", items: [
    { href: "/admin", label: "Overview", icon: I.home, exact: true },
    { href: "/admin/posts", label: "Blog posts", icon: I.posts },
    { href: "/admin/case-studies", label: "Case studies", icon: I.cases },
  ] },
  { group: "Growth", items: [
    { href: "/admin/analytics", label: "Analytics", icon: I.chart },
    { href: "/admin/seo", label: "SEO", icon: I.seo },
    { href: "/admin/files", label: "Site files", icon: I.files },
  ] },
];

export default function AdminNav({ email }: { email: string }) {
  const path = usePathname();
  const active = (href: string, exact?: boolean) => (exact ? path === href : path === href || path.startsWith(`${href}/`));
  return (
    <aside className="admin-side" aria-label="Admin">
      <Link href="/admin" className="brand"><b>Nik<i>.</i></b><span>Admin</span></Link>
      {SECTIONS.map((s) => (
        <div key={s.group} style={{ display: "contents" }}>
          <span className="group">{s.group}</span>
          {s.items.map((i) => (
            <Link key={i.href} href={i.href} aria-current={active(i.href, i.exact) ? "page" : undefined}>
              <Icon d={i.icon} />{i.label}
            </Link>
          ))}
        </div>
      ))}
      <span className="group">Quick</span>
      <Link href="/admin/posts/new"><Icon d={I.plus} />New post</Link>
      <Link href="/admin/case-studies/new"><Icon d={I.plus} />New case study</Link>
      <a href="/" target="_blank" rel="noopener"><Icon d={I.ext} />View site</a>
      <span className="spacer" />
      <span className="who">{email}</span>
      <form action="/api/auth/logout" method="post">
        <button className="linklike" type="submit"><Icon d={I.out} />Sign out</button>
      </form>
    </aside>
  );
}
