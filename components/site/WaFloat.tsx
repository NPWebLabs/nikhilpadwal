"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/data";
import { Ico } from "./ui";

/** Floating WhatsApp button. Hidden over the homepage hero, which has its own WhatsApp button. */
export default function WaFloat() {
  const path = usePathname();
  const [past, setPast] = useState(false);
  useEffect(() => {
    const on = () => setPast(window.scrollY > window.innerHeight * 0.8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const show = path !== "/" || past;
  return (
    <a className={`wa-float glass${show ? "" : " is-hidden"}`} href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" data-glass tabIndex={show ? undefined : -1} aria-hidden={show ? undefined : true}>
      <Ico name="whatsapp-white" />
    </a>
  );
}
