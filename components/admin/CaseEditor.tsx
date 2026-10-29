"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SeoPanel, { type SeoValues } from "./SeoPanel";

type Status = "DRAFT" | "PUBLISHED";
export type EditorCase = {
  id?: number;
  name: string;
  slug: string;
  url: string;
  platform: string;
  sector: string;
  category: string;
  summary: string;
  highlights: string;
  image: string;
  featured: boolean;
  status: Status;
  sortOrder: number;
  overview: string;
  challenge: string;
  approach: string;
  outcome: string;
  body: string;
  seoTitle: string;
  metaDescription: string;
  ogImage: string;
  noindex: boolean;
};

const EMPTY: EditorCase = {
  name: "", slug: "", url: "", platform: "WordPress", sector: "Corporate", category: "", summary: "", highlights: "", image: "",
  featured: false, status: "DRAFT", sortOrder: 0, overview: "", challenge: "", approach: "", outcome: "", body: "",
  seoTitle: "", metaDescription: "", ogImage: "", noindex: false,
};

const PLATFORMS = ["WordPress", "WooCommerce", "Shopify", "Next.js", "React", "Custom"];
const SECTORS = ["Corporate", "Education", "E-commerce", "Industrial"];

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 200);

export default function CaseEditor({ initial, flash }: { initial?: EditorCase; flash?: string }) {
  const router = useRouter();
  const [c, setC] = useState<EditorCase>(initial || EMPTY);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [saving, setSaving] = useState<null | Status>(null);
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "error"; text: string } | null>(flash ? { type: "ok", text: flash === "PUBLISHED" ? "Published." : "Saved as draft." } : null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof EditorCase>(k: K, v: EditorCase[K]) => {
    setC((p) => ({ ...p, [k]: v }));
    setDirty(true);
  };

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save(status: Status) {
    setMsg(null);
    if (c.name.trim().length < 2) return setMsg({ type: "error", text: "Add the client or project name." });
    setSaving(status);
    try {
      const res = await fetch(c.id ? `/api/admin/case-studies/${c.id}` : "/api/admin/case-studies", {
        method: c.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...c, status, slug: c.slug || slugify(c.name) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      setC((p) => ({ ...p, id: data.item.id, slug: data.item.slug, status: data.item.status }));
      setSlugTouched(true);
      setDirty(false);
      setMsg({ type: "ok", text: status === "PUBLISHED" ? "Published. It's live on the site." : "Saved as draft." });
      if (!c.id) router.replace(`/admin/case-studies/${data.item.id}?saved=${status}`);
      router.refresh();
    } catch (e) {
      setMsg({ type: "error", text: (e as Error).message });
    } finally {
      setSaving(null);
    }
  }

  async function remove() {
    if (!c.id || !window.confirm(`Delete the "${c.name}" case study? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/case-studies/${c.id}`, { method: "DELETE" });
    if (!res.ok) return setMsg({ type: "error", text: "Couldn't delete. Try again." });
    setDirty(false);
    router.push("/admin/case-studies?deleted=1");
    router.refresh();
  }

  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");
      set("image", data.url);
    } catch (e) {
      setMsg({ type: "error", text: (e as Error).message });
    } finally {
      setUploading(false);
    }
  }

  const text = (k: keyof EditorCase, label: string, rows: number, hint?: string, placeholder?: string) => (
    <div className="field">
      <label htmlFor={k}>{label}</label>
      <textarea id={k} className="textarea" rows={rows} value={String(c[k] ?? "")} placeholder={placeholder} onChange={(e) => set(k, e.target.value as never)} />
      {hint && <small>{hint}</small>}
    </div>
  );

  return (
    <>
      <div className="admin-top">
        <h1>{c.id ? "Edit case study" : "New case study"}</h1>
        <div className="acts" style={{ alignItems: "center" }}>
          {dirty && <span className="muted" style={{ fontSize: 13 }}>Unsaved changes</span>}
          {c.id && c.status === "PUBLISHED" && <a className="icon-btn" href={`/case-studies/${c.slug}`} target="_blank" rel="noopener">View live ↗</a>}
          {c.id && <button type="button" className="icon-btn icon-btn--danger" onClick={remove}>Delete</button>}
        </div>
      </div>
      {msg && <div className={`alert alert--${msg.type}`} role={msg.type === "error" ? "alert" : "status"}>{msg.text}</div>}

      <div className="editor">
        <div className="stack">
          <div className="panel">
            <label htmlFor="name" className="sr-only">Project name</label>
            <input id="name" className="title-input" placeholder="Client or project name" value={c.name} maxLength={200}
              onChange={(e) => { set("name", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} />
            <div className="slug-row">
              <label htmlFor="slug">/case-studies/</label>
              <input id="slug" value={c.slug} placeholder="project-url" onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="url">Live site URL</label>
                <input id="url" className="input" type="url" value={c.url} placeholder="https://" onChange={(e) => set("url", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="category">Industry / category</label>
                <input id="category" className="input" value={c.category} placeholder="e.g. Real estate" onChange={(e) => set("category", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="platform">Platform</label>
                <input id="platform" className="input" list="platforms" value={c.platform} onChange={(e) => set("platform", e.target.value)} />
                <datalist id="platforms">{PLATFORMS.map((p) => <option key={p} value={p} />)}</datalist>
              </div>
              <div className="field">
                <label htmlFor="sector">Sector (archive filter)</label>
                <input id="sector" className="input" list="sectors" value={c.sector} onChange={(e) => set("sector", e.target.value)} />
                <datalist id="sectors">{SECTORS.map((p) => <option key={p} value={p} />)}</datalist>
              </div>
            </div>
            {text("summary", "Summary", 3, "Shown on cards and as the page intro.")}
            {text("highlights", "Highlights", 3, "One per line. Shown as chips.", "Member directory\nEvents & expo pages")}
          </div>

          <div className="panel">
            <h2>The story</h2>
            {text("overview", "The client", 3, "Who they are.")}
            {text("challenge", "The challenge", 3, "What the website had to do.")}
            {text("approach", "What was built", 5, "One point per line.")}
            {text("outcome", "The result", 3, "What the client has now.")}
            {text("body", "Extra content (Markdown, optional)", 6, "Longer write-up, images or results shown under the story.")}
          </div>
        </div>

        <aside>
          <div className="panel">
            <h2>Publish</h2>
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" className="select" value={c.status} onChange={(e) => set("status", e.target.value as Status)}>
                <option value="DRAFT">Draft (hidden)</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
            <label className="check">
              <input type="checkbox" checked={c.featured} onChange={(e) => set("featured", e.target.checked)} />
              <span>Feature on the homepage<small>Shown in “Selected work”.</small></span>
            </label>
            <div className="field">
              <label htmlFor="sortOrder">Order</label>
              <input id="sortOrder" className="input" type="number" value={c.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value) || 0)} />
              <small>Lower numbers come first.</small>
            </div>
            <div className="save-bar">
              <button type="button" className="btn btn--ghost" onClick={() => save("DRAFT")} disabled={!!saving}>{saving === "DRAFT" ? "Saving…" : "Save draft"}</button>
              <button type="button" className="btn btn--accent" onClick={() => save("PUBLISHED")} disabled={!!saving}>{saving === "PUBLISHED" ? "Publishing…" : c.id && c.status === "PUBLISHED" ? "Update" : "Publish"}</button>
            </div>
          </div>

          <div className="panel">
            <h2>Screenshot</h2>
            <div className="cover-box">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {c.image ? <img src={c.image} alt="Screenshot preview" /> : <div className="empty">Desktop screenshot, 1440 × 900.</div>}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              <button type="button" className="icon-btn" onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? "Uploading…" : "Upload"}</button>
              {c.image && <button type="button" className="icon-btn icon-btn--danger" onClick={() => set("image", "")}>Remove</button>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ""; }} />
            <div className="field" style={{ marginTop: 12 }}>
              <label htmlFor="image">…or image path / URL</label>
              <input id="image" className="input" value={c.image} placeholder="/shots/example.webp" onChange={(e) => set("image", e.target.value)} />
            </div>
          </div>

          <SeoPanel
            values={c}
            onChange={(k, v) => set(k as keyof SeoValues & keyof EditorCase, v as never)}
            path={`/case-studies/${c.slug || slugify(c.name) || "project-url"}`}
            fallbackTitle={c.name ? `${c.name} Case Study` : ""}
            fallbackDescription={c.summary}
            fallbackImage={c.image}
          />
        </aside>
      </div>
    </>
  );
}
