"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Sends one page-view beacon per route change to /api/track (first-party, cookieless). */
export default function Tracker() {
  const path = usePathname();
  const first = useRef(true);
  useEffect(() => {
    const ref = first.current ? document.referrer : "";
    first.current = false;
    const body = JSON.stringify({ path, ref });
    try {
      if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
        fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
      }
    } catch {}
  }, [path]);
  return null;
}
