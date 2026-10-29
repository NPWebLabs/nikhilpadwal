"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode = "auto" | "custom";
type Msg = { type: "ok" | "error"; text: string } | null;

async function put(url: string, body: unknown, method = "PUT") {
  const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Save failed");
}

/** robots.txt / sitemap.xml / llms.txt: auto (generated) or custom text. */
export function GeneratedFileEditor(props: {
  file: "robots" | "sitemap" | "llms";
  publicPath: string;
  hint: string;
  mode: Mode;
  custom: string;
  auto: string;
  extra?: string;
  exclude?: string;
}) {
  const [mode, setMode] = useState<Mode>(props.mode);
  const [custom, setCustom] = useState(props.custom || props.auto);
  const [extra, setExtra] = useState(props.extra || "");
  const [exclude, setExclude] = useState(props.exclude || "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      await put("/api/admin/site-files", { file: props.file, mode, custom: mode === "custom" ? custom : props.custom, extra, exclude });
      setMsg({ type: "ok", text: `Saved. ${props.publicPath} is updated.` });
    } catch (e) {
      setMsg({ type: "error", text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>{props.publicPath}</h2>
        <a href={props.publicPath} target="_blank" rel="noopener">Open ↗</a>
      </div>
      <p className="muted" style={{ fontSize: 14, marginBottom: 12 }}>{props.hint}</p>
      <div className="seg" role="group" aria-label={`${props.publicPath} mode`} style={{ marginBottom: 14 }}>
        <button type="button" aria-pressed={mode === "auto"} onClick={() => setMode("auto")}>Auto</button>
        <button type="button" aria-pressed={mode === "custom"} onClick={() => setMode("custom")}>Custom</button>
      </div>
      {msg && <div className={`alert alert--${msg.type}`} role={msg.type === "error" ? "alert" : "status"}>{msg.text}</div>}
      {mode === "auto" ? (
        <>
          {props.file === "sitemap" && (
            <div className="field-row">
              <div className="field">
                <label htmlFor="sm-extra">Extra URLs</label>
                <textarea id="sm-extra" className="textarea code" style={{ minHeight: 110 }} value={extra} onChange={(e) => setExtra(e.target.value)} placeholder={"/landing/offer\nhttps://nikhilpadwal.com/some-page"} />
                <small>One per line. Added to the generated sitemap.</small>
              </div>
              <div className="field">
                <label htmlFor="sm-exclude">Exclude URLs</label>
                <textarea id="sm-exclude" className="textarea code" style={{ minHeight: 110 }} value={exclude} onChange={(e) => setExclude(e.target.value)} placeholder={"/nikhil-padwal-resume.pdf"} />
                <small>One per line. Removed from the generated sitemap.</small>
              </div>
            </div>
          )}
          <span className="lbl" style={{ fontSize: 13, fontWeight: 600 }}>Generated now</span>
          <pre className="pre-out" style={{ marginTop: 6 }}>{props.auto}</pre>
        </>
      ) : (
        <div className="field">
          <label htmlFor={`custom-${props.file}`}>Custom {props.publicPath}</label>
          <textarea id={`custom-${props.file}`} className="textarea code" value={custom} onChange={(e) => setCustom(e.target.value)} spellCheck={false} />
          <small>Replaces the generated file completely. Switch back to Auto any time.</small>
        </div>
      )}
      <div style={{ marginTop: 14 }}>
        <button type="button" className="btn btn--accent" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</button>
      </div>
    </section>
  );
}

type FileRow = { id: number; name: string; content: string };

/** Extra root files: ads.txt, humans.txt, Google/Bing verification HTML, security.txt … */
export function CustomFiles({ files }: { files: FileRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<FileRow | { id?: undefined; name: string; content: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  async function save() {
    if (!editing) return;
    setBusy(true);
    setMsg(null);
    try {
      await put("/api/admin/files", { id: editing.id, name: editing.name, content: editing.content }, "POST");
      setMsg({ type: "ok", text: `Saved /${editing.name.trim().toLowerCase()}` });
      setEditing(null);
      router.refresh();
    } catch (e) {
      setMsg({ type: "error", text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function remove(f: FileRow) {
    if (!window.confirm(`Delete /${f.name}?`)) return;
    const res = await fetch(`/api/admin/files/${f.id}`, { method: "DELETE" });
    if (!res.ok) return setMsg({ type: "error", text: "Couldn't delete. Try again." });
    setMsg({ type: "ok", text: `Deleted /${f.name}` });
    router.refresh();
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Custom root files</h2>
        {!editing && <button type="button" className="icon-btn" onClick={() => setEditing({ name: "", content: "" })}>+ Add file</button>}
      </div>
      <p className="muted" style={{ fontSize: 14, marginBottom: 12 }}>
        Served at the site root, e.g. <code>/ads.txt</code>, <code>/humans.txt</code> or a <code>google…html</code> verification file. Allowed: .txt, .xml, .html, .json, .webmanifest.
      </p>
      {msg && <div className={`alert alert--${msg.type}`} role={msg.type === "error" ? "alert" : "status"}>{msg.text}</div>}
      {editing && (
        <div className="panel" style={{ background: "#fcfbf8", marginBottom: 14 }}>
          <div className="field">
            <label htmlFor="fname">File name</label>
            <input id="fname" className="input" value={editing.name} placeholder="ads.txt" onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="fcontent">Content</label>
            <textarea id="fcontent" className="textarea code" style={{ minHeight: 180 }} value={editing.content} spellCheck={false} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="btn btn--accent btn--sm" onClick={save} disabled={busy || !editing.name.trim()}>{busy ? "Saving…" : "Save file"}</button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
      <div className="files-list">
        {files.length === 0 && !editing && <p className="muted" style={{ fontSize: 14 }}>No custom files yet.</p>}
        {files.map((f) => (
          <div className="file-item" key={f.id}>
            <code>/{f.name}</code>
            <span className="muted" style={{ fontSize: 12.5 }}>{f.content.length.toLocaleString("en-IN")} characters</span>
            <div className="row-actions">
              <a className="icon-btn" href={`/${f.name}`} target="_blank" rel="noopener">Open ↗</a>
              <button type="button" className="icon-btn" onClick={() => setEditing(f)}>Edit</button>
              <button type="button" className="icon-btn icon-btn--danger" onClick={() => remove(f)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
