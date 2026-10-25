"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../Logo";

export default function AdminNav({ email }: { email: string }) {
  const path = usePathname();
  const items = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/posts/new", label: "New post" },
  ];
  return (
    <aside className="admin-side" aria-label="Admin">
      <Logo href="/admin" />
      {items.map((i) => (
        <Link key={i.href} href={i.href} aria-current={path === i.href ? "page" : undefined}>{i.label}</Link>
      ))}
      <a href="/blog" target="_blank" rel="noopener">View blog ↗</a>
      <a href="/" target="_blank" rel="noopener">View site ↗</a>
      <span className="spacer" />
      <span className="who">{email}</span>
      <form action="/api/auth/logout" method="post">
        <button className="linklike" type="submit">Sign out</button>
      </form>
    </aside>
  );
}
