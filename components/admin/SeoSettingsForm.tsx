"use client";
import { useState } from "react";

type Page = { path: string; label: string; title: string; description: string; ogImage: string; noindex: boolean; defTitle: string; defDescription: string };
type Global = { siteTitle: string; siteDescription: string; defaultOgImage: string; googleVerification: string; bingVerification: string };

export default function SeoSettingsForm({ pages: initialPages, global: initialGlobal, defaults }: { pages: Page[]; global: Global; defaults: { title: string; description: string } }) {
  const [pages, setPages] = useState(initialPages);
  const [global, setGlobal] = useState(initialGlobal);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const setPage = (i: number, k: keyof Page, v: string | boolean) => setPages((ps) => ps.map((p, j) => (j === i ? { ...p, [k]: v } : p)));
  const setG = (k: keyof Global, v: string) => setGlobal((g) => ({ ...g, [k]: v }));

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages: pages.map(({ path, title, description, ogImage, noindex }) => ({ path, title, description, ogImage, noindex })), global }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMsg({ type: "ok", text: "SEO settings saved. Pages refresh within a few seconds." });
    } catch (e) {
      setMsg({ type: "error", text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack">
      {msg && <div className={`alert alert--${msg.type}`} role={msg.type === "error" ? "alert" : "status"} style={{ marginBottom: 0 }}>{msg.text}</div>}
      <section className="panel">
        <h2>Site defaults</h2>
        <div className="field-row">
          <div className="field">
            <label htmlFor="siteTitle">Default title</label>
            <input id="siteTitle" className="input" value={global.siteTitle} placeholder={defaults.title} onChange={(e) => setG("siteTitle", e.target.value)} />
            <small>Used on the homepage and anywhere a page has no title.</small>
          </div>
          <div className="field">
            <label htmlFor="defaultOgImage">Default share image</label>
            <input id="defaultOgImage" className="input" value={global.defaultOgImage} placeholder="/images/og-share.jpg" onChange={(e) => setG("defaultOgImage", e.target.value)} />
            <small>1200 × 630, shown when a link is shared.</small>
          </div>
        </div>
        <div className="field">
          <label htmlFor="siteDescription">Default description</label>
          <textarea id="siteDescription" className="textarea" rows={2} maxLength={300} value={global.siteDescription} placeholder={defaults.description} onChange={(e) => setG("siteDescription", e.target.value)} />
          <span className="counter">{(global.siteDescription || defaults.description).length}/160</span>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="google">Google Search Console verification</label>
            <input id="google" className="input" value={global.googleVerification} placeholder="content value of the meta tag" onChange={(e) => setG("googleVerification", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="bing">Bing Webmaster verification</label>
            <input id="bing" className="input" value={global.bingVerification} placeholder="msvalidate.01 value" onChange={(e) => setG("bingVerification", e.target.value)} />
          </div>
        </div>
      </section>

      {pages.map((p, i) => (
        <section className="panel" key={p.path}>
          <div className="panel-head"><h2>{p.label} · {p.path}</h2><a href={p.path} target="_blank" rel="noopener">Open ↗</a></div>
          <div className="field-row">
            <div className="field">
              <label htmlFor={`t${i}`}>Title</label>
              <input id={`t${i}`} className="input" maxLength={200} value={p.title} placeholder={p.defTitle} onChange={(e) => setPage(i, "title", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor={`o${i}`}>Share image</label>
              <input id={`o${i}`} className="input" maxLength={500} value={p.ogImage} placeholder="Default share image" onChange={(e) => setPage(i, "ogImage", e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor={`d${i}`}>Description</label>
            <textarea id={`d${i}`} className="textarea" rows={2} maxLength={300} value={p.description} placeholder={p.defDescription} onChange={(e) => setPage(i, "description", e.target.value)} />
            <span className="counter">{(p.description || p.defDescription).length}/160</span>
          </div>
          <label className="check">
            <input type="checkbox" checked={p.noindex} onChange={(e) => setPage(i, "noindex", e.target.checked)} />
            <span>Hide from search engines</span>
          </label>
        </section>
      ))}

      <div><button type="button" className="btn btn--accent" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save SEO settings"}</button></div>
    </div>
  );
}
