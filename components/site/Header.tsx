"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, profile } from "@/lib/data";
import { Arrow } from "./ui";

const MENU = [
  { href: "/#numbers", label: "Numbers" },
  { href: "/case-studies", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#experience", label: "Experience" },
  { href: "/#education", label: "Education" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const current = (href: string) => (!href.includes("#") && (path === href || path.startsWith(`${href}/`)) ? "page" : undefined);

  return (
    <>
      <header className={`nav band${scrolled || path !== "/" ? " scrolled" : ""}`} id="nav">
        <div className="wrap">
          <Link href="/" className="logo" aria-label="Nik., home">Nik<i>.</i></Link>
          <div className="meta m1"><small>Status</small><span><i className="live" aria-hidden="true" />Open for projects</span></div>
          <div className="meta m2"><small>Based in</small><span>{profile.location}</span></div>
          <nav className="links" aria-label="Primary">
            {nav.map((n) => <Link key={n.href} href={n.href} aria-current={current(n.href)}>{n.label}</Link>)}
          </nav>
          <Link href="/#contact" className="btn ghost"><span className="ic"><Arrow /></span>Let&apos;s talk</Link>
          <button className="menu-btn" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobileMenu" onClick={() => setOpen((o) => !o)}>
            <span /><span />
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            id="mobileMenu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {MENU.map((m, i) => (
              <motion.div key={m.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i + 0.05, duration: 0.45, ease: [0.2, 0.7, 0.1, 1] }}>
                <Link href={m.href} onClick={() => setOpen(false)}>{m.label}</Link>
              </motion.div>
            ))}
            <p>{profile.location.toUpperCase()} · {profile.email.toUpperCase()}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
