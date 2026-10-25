"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { marked } from "marked";
import DeletePostButton from "./DeletePostButton";

type Status = "DRAFT" | "PUBLISHED";
export type EditorPost = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string;
  metaDescription: string;
  status: Status;
  publishedAt: string | null;
};

const EMPTY: EditorPost = {
  title: "", slug: "", excerpt: "", content: "", coverImage: "", tags: "", metaDescription: "", status: "DRAFT", publishedAt: null,
};

function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 200);
}
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url as string;
}

export default function PostEditor({ initial, flash }: { initial?: EditorPost; flash?: string }) {
  const router = useRouter();
  const [post, setPost] = useState<EditorPost>(initial || EMPTY);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState<null | Status>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "error"; text: string } | null>(
    flash === "PUBLISHED" ? { type: "ok", text: "Published. It's live on the blog." } : flash === "DRAFT" ? { type: "ok", text: "Draft saved." } : null
  );
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const inlineInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof EditorPost>(k: K, v: EditorPost[K]) => {
    setPost((p) => ({ ...p, [k]: v }));
    setDirty(true);
  };

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const words = useMemo(() => post.content.trim().split(/\s+/).filter(Boolean).length, [post.content]);
  const previewHtml = useMemo(() => (tab === "preview" ? (marked.parse(post.content || "_Nothing to preview yet._", { async: false }) as string) : ""), [tab, post.content]);

  const save = useCallback(async (status: Status) => {
    setMsg(null);
    if (post.title.trim().length < 3) { setMsg({ type: "error", text: "Add a title (at least 3 characters)." }); return; }
    setSaving(status);
    try {
      const body = { ...post, status, slug: post.slug || slugify(post.title), publishedAt: post.publishedAt };
      const res = await fetch(post.id ? `/api/admin/posts/${post.id}` : "/api/admin/posts", {
        method: post.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      const saved = data.post;
      setPost((p) => ({ ...p, id: saved.id, slug: saved.slug, status: saved.status, publishedAt: saved.publishedAt }));
      setSlugTouched(true);
      setDirty(false);
      setMsg({ type: "ok", text: status === "PUBLISHED" ? "Published. It's live on the blog." : "Draft saved." });
      if (!post.id) router.replace(`/admin/posts/${saved.id}?saved=${status}`);
      router.refresh();
    } catch (e) {
      setMsg({ type: "error", text: (e as Error).message });
    } finally {
      setSaving(null);
    }
  }, [post, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); save(post.status); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save, post.status]);

  function wrap(before: string, after = before, placeholder = "text") {
    const el = areaRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const sel = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + sel + after + value.slice(e);
    set("content", next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + before.length, s + before.length + sel.length); });
  }
  function linePrefix(prefix: string) {
    const el = areaRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    const block = value.slice(lineStart, e) || "";
    const replaced = block.split("\n").map((l, i) => (prefix === "1. " ? `${i + 1}. ` : prefix) + l).join("\n");
    set("content", value.slice(0, lineStart) + replaced + value.slice(e));
    requestAnimationFrame(() => el.focus());
  }
  function insertAtCursor(text: string) {
    const el = areaRef.current;
    const value = post.content;
    const s = el ? el.selectionStart : value.length;
    set("content", value.slice(0, s) + text + value.slice(s));
    requestAnimationFrame(() => { if (el) { el.focus(); el.setSelectionRange(s + text.length, s + text.length); } });
  }
  async function handleInlineFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    setUploading(true);
    try {
      for (const f of list) {
        const url = await uploadImage(f);
        insertAtCursor(`\n![${f.name.replace(/\.[^.]+$/, "")}](${url})\n`);
      }
    } catch (e) {
      setMsg({ type: "error", text: (e as Error).message });
    } finally {
      setUploading(false);
    }
  }
  async function handleCover(file?: File) {
    if (!file) return;
    setUploading(true);
    try { set("coverImage", await uploadImage(file)); }
    catch (e) { setMsg({ type: "error", text: (e as Error).message }); }
    finally { setUploading(false); }
  }

  const isLive = post.status === "PUBLISHED";

  return (
    <>
      <div className="admin-top">
        <h1>{post.id ? "Edit post" : "New post"}</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {dirty && <span className="muted" style={{ fontSize: 13 }}>Unsaved changes</span>}
          {post.id && isLive && <a className="icon-btn" href={`/blog/${post.slug}`} target="_blank" rel="noopener">View live ↗</a>}
          {post.id && <DeletePostButton id={post.id} title={post.title} />}
        </div>
      </div>
      {msg && <div className={`alert alert--${msg.type}`} role={msg.type === "error" ? "alert" : "status"}>{msg.text}</div>}

      <div className="editor">
        <div className="panel">
          <label htmlFor="title" className="sr-only">Title</label>
          <input
            id="title" className="title-input" placeholder="Post title" value={post.title} maxLength={200}
            onChange={(e) => { set("title", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }}
          />
          <div className="slug-row">
            <label htmlFor="slug">/blog/</label>
            <input id="slug" value={post.slug} placeholder="post-url" onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} />
          </div>

          <div className="toolbar" role="toolbar" aria-label="Formatting">
            <button type="button" title="Heading 2" onClick={() => linePrefix("## ")}>H2</button>
            <button type="button" title="Heading 3" onClick={() => linePrefix("### ")}>H3</button>
            <span className="sep" />
            <button type="button" title="Bold" onClick={() => wrap("**")}><b>B</b></button>
            <button type="button" title="Italic" onClick={() => wrap("_")}><i>I</i></button>
            <button type="button" title="Link" onClick={() => wrap("[", "](https://)", "link text")}>Link</button>
            <button type="button" title="Inline code" onClick={() => wrap("`")}>{"</>"}</button>
            <button type="button" title="Code block" onClick={() => wrap("\n```\n", "\n```\n", "code")}>Code</button>
            <span className="sep" />
            <button type="button" title="Bulleted list" onClick={() => linePrefix("- ")}>• List</button>
            <button type="button" title="Numbered list" onClick={() => linePrefix("1. ")}>1. List</button>
            <button type="button" title="Quote" onClick={() => linePrefix("> ")}>❝</button>
            <button type="button" title="Divider" onClick={() => insertAtCursor("\n\n---\n\n")}>—</button>
            <button type="button" title="Insert image" onClick={() => inlineInput.current?.click()} disabled={uploading}>
              {uploading ? "Uploading…" : "Image"}
            </button>
            <input ref={inlineInput} type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files) handleInlineFiles(e.target.files); e.target.value = ""; }} />
            <div className="tabs">
              <button type="button" aria-pressed={tab === "write"} onClick={() => setTab("write")}>Write</button>
              <button type="button" aria-pressed={tab === "preview"} onClick={() => setTab("preview")}>Preview</button>
            </div>
          </div>
          {tab === "write" ? (
            <textarea
              ref={areaRef}
              className="textarea md-area"
              aria-label="Post content (Markdown)"
              placeholder={"Write in Markdown…\n\n## A heading\nSome **bold** text, a [link](https://example.com), and paste or drop images straight in."}
              value={post.content}
              onChange={(e) => set("content", e.target.value)}
              onPaste={(e) => { if (e.clipboardData.files.length) { e.preventDefault(); handleInlineFiles(e.clipboardData.files); } }}
              onDrop={(e) => { if (e.dataTransfer.files.length) { e.preventDefault(); handleInlineFiles(e.dataTransfer.files); } }}
            />
          ) : (
            <div className="md-preview prose" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          )}
          <div className="counter" style={{ marginTop: 8 }}>{words} words · ~{Math.max(1, Math.round(words / 220))} min read · Ctrl/⌘ + S to save</div>
        </div>

        <div>
          <div className="panel">
            <h2>Publish</h2>
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" className="select" value={post.status} onChange={(e) => set("status", e.target.value as Status)}>
                <option value="DRAFT">Draft (hidden)</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="date">Publish date</label>
              <input id="date" type="datetime-local" className="input" value={toLocalInput(post.publishedAt)}
                onChange={(e) => set("publishedAt", e.target.value ? new Date(e.target.value).toISOString() : null)} />
              <small>Leave empty to publish now. A future date schedules the post.</small>
            </div>
            <div className="save-bar">
              <button type="button" className="btn btn--ghost" onClick={() => save("DRAFT")} disabled={!!saving}>
                {saving === "DRAFT" ? "Saving…" : "Save draft"}
              </button>
              <button type="button" className="btn btn--orange" onClick={() => save("PUBLISHED")} disabled={!!saving}>
                {saving === "PUBLISHED" ? "Publishing…" : isLive && post.id ? "Update" : "Publish"}
              </button>
            </div>
          </div>

          <div className="panel">
            <h2>Cover image</h2>
            <div className="cover-box">
              {post.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.coverImage} alt="Cover preview" />
              ) : (
                <div className="empty">No cover yet. Recommended 1600 × 1000.</div>
              )}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              <button type="button" className="icon-btn" onClick={() => coverInput.current?.click()} disabled={uploading}>
                {uploading ? "Uploading…" : "Upload"}
              </button>
              {post.coverImage && <button type="button" className="icon-btn icon-btn--danger" onClick={() => set("coverImage", "")}>Remove</button>}
            </div>
            <input ref={coverInput} type="file" accept="image/*" hidden onChange={(e) => { handleCover(e.target.files?.[0]); e.target.value = ""; }} />
            <div className="field" style={{ marginTop: 12 }}>
              <label htmlFor="coverUrl">…or image URL</label>
              <input id="coverUrl" className="input" placeholder="https://" value={post.coverImage} onChange={(e) => set("coverImage", e.target.value)} />
            </div>
          </div>

          <div className="panel">
            <h2>Details</h2>
            <div className="field">
              <label htmlFor="excerpt">Excerpt</label>
              <textarea id="excerpt" className="textarea" rows={3} maxLength={600} value={post.excerpt} onChange={(e) => set("excerpt", e.target.value)}
                placeholder="One or two sentences shown on blog cards." />
            </div>
            <div className="field">
              <label htmlFor="tags">Tags</label>
              <input id="tags" className="input" value={post.tags} onChange={(e) => set("tags", e.target.value)} placeholder="WordPress, SEO, Shopify" />
              <small>Comma separated. The first tag shows on cards.</small>
            </div>
            <div className="field">
              <label htmlFor="meta">SEO description</label>
              <textarea id="meta" className="textarea" rows={3} maxLength={300} value={post.metaDescription} onChange={(e) => set("metaDescription", e.target.value)}
                placeholder="What Google shows under the title. Falls back to the excerpt." />
              <span className="counter">{post.metaDescription.length}/160 recommended</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
