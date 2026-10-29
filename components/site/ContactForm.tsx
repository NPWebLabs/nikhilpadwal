"use client";
import { useEffect, useMemo, useState } from "react";
import { profile, whatsappUrl } from "@/lib/data";
import { Arrow, Ico } from "./ui";

const NEEDS = ["Business website", "eCommerce store", "SaaS / web app", "AI integration", "Speed & SEO", "Something else"];

/** Builds a WhatsApp / email message from the form. Nothing is stored or sent to a server. */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [reach, setReach] = useState("");
  const [need, setNeed] = useState(NEEDS[0]);
  const [msg, setMsg] = useState("");
  const [hint, setHint] = useState("Opens WhatsApp or your email app with the message filled in.");

  // "Pick where to start" links on the homepage preselect a need.
  useEffect(() => {
    const on = (e: Event) => {
      const v = (e as CustomEvent<string>).detail;
      if (NEEDS.includes(v)) setNeed(v);
    };
    window.addEventListener("nik:need", on);
    return () => window.removeEventListener("nik:need", on);
  }, []);

  const text = useMemo(() => {
    const lines = [`Hi Nikhil, I'm ${name.trim() || "—"}.`, `I need: ${need}.`];
    if (msg.trim()) lines.push(msg.trim());
    if (reach.trim()) lines.push(`Reach me at: ${reach.trim()}`);
    return lines.join("\n");
  }, [name, reach, need, msg]);

  const guard = (e: React.MouseEvent, kind: "wa" | "mail") => {
    if (!name.trim()) {
      e.preventDefault();
      setHint("Add your name first, then send.");
      document.getElementById("fName")?.focus();
      return;
    }
    setHint(kind === "mail" ? "If no email app opened, copy the address and write to it directly." : "Opening WhatsApp with your message.");
  };

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="field"><label htmlFor="fName">Name</label><input id="fName" autoComplete="name" required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div className="field"><label htmlFor="fReach">Email or phone (optional)</label><input id="fReach" autoComplete="email" placeholder="So I can reply" value={reach} onChange={(e) => setReach(e.target.value)} /></div>
      <fieldset className="needs">
        <legend>What do you need?</legend>
        {NEEDS.map((n) => (
          <label key={n}><input type="radio" name="need" value={n} checked={need === n} onChange={() => setNeed(n)} /><span>{n}</span></label>
        ))}
      </fieldset>
      <div className="field"><label htmlFor="fMsg">Message</label><textarea id="fMsg" placeholder="A few lines about the project" value={msg} onChange={(e) => setMsg(e.target.value)} /></div>
      <div className="form-acts">
        <a className="btn wa" href={whatsappUrl(text)} target="_blank" rel="noopener noreferrer" onClick={(e) => guard(e, "wa")}>
          <span className="ic"><Ico name="whatsapp-white" size={18} style={{ color: "#fff" }} /></span>Send on WhatsApp
        </a>
        <a className="btn ghost" href={`mailto:${profile.email}?subject=${encodeURIComponent(`Project enquiry: ${need}`)}&body=${encodeURIComponent(text)}`} onClick={(e) => guard(e, "mail")}>
          <span className="ic"><Arrow /></span>Send by email
        </a>
      </div>
      <p className="hint" role="status">{hint}</p>
    </form>
  );
}
