"use client";
import { useEffect, useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [label, setLabel] = useState("COPY");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setLabel("COPIED");
    } catch {
      const r = document.createRange();
      const el = document.getElementById("mail");
      if (el) {
        r.selectNodeContents(el);
        const s = getSelection();
        s?.removeAllRanges();
        s?.addRange(r);
      }
      setLabel("SELECTED");
    }
    setTimeout(() => setLabel("COPY"), 1600);
  };
  return <button type="button" className="copy" onClick={copy}>{label}</button>;
}

export function Clock() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="clock">IST {t}</span>;
}

/** Link that also preselects a need in the contact form. */
export function NeedLink({ need, href, className, children }: { need?: string; href: string; className?: string; children: React.ReactNode }) {
  return (
    <a href={href} className={className} onClick={() => need && window.dispatchEvent(new CustomEvent("nik:need", { detail: need }))}>
      {children}
    </a>
  );
}
