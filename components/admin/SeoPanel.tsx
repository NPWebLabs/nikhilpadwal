"use client";

export type SeoValues = {
  seoTitle: string;
  metaDescription: string;
  ogImage: string;
  canonicalUrl?: string;
  focusKeyword?: string;
  noindex: boolean;
};

type Props = {
  values: SeoValues;
  onChange: <K extends keyof SeoValues>(k: K, v: SeoValues[K]) => void;
  path: string; // "/blog/my-post"
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackImage?: string;
  body?: string; // content used for keyword checks
  showCanonical?: boolean;
  showKeyword?: boolean;
};

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://nikhilpadwal.com").replace(/\/+$/, "");
const SUFFIX = " | Nikhil Padwal";

/** SEO fields with a Google-style preview and a quick checklist. */
export default function SeoPanel({ values, onChange, path, fallbackTitle, fallbackDescription, fallbackImage, body = "", showCanonical, showKeyword }: Props) {
  const title = (values.seoTitle || fallbackTitle || "Untitled") + SUFFIX;
  const desc = values.metaDescription || fallbackDescription;
  const kw = (values.focusKeyword || "").trim().toLowerCase();
  const has = (s: string) => kw && s.toLowerCase().includes(kw);
  const checks = [
    { ok: title.length >= 30 && title.length <= 65, text: `Title is ${title.length} characters (aim for 30–65)` },
    { ok: desc.length >= 70 && desc.length <= 160, text: desc ? `Description is ${desc.length} characters (aim for 70–160)` : "Add a description" },
    { ok: Boolean(values.ogImage || fallbackImage), text: "Has a social share image" },
    ...(showKeyword && kw
      ? [
          { ok: Boolean(has(title)), text: "Focus keyword appears in the title" },
          { ok: Boolean(has(desc)), text: "Focus keyword appears in the description" },
          { ok: Boolean(has(path.replace(/-/g, " "))), text: "Focus keyword appears in the URL" },
          { ok: Boolean(has(body.slice(0, 1200))), text: "Focus keyword appears early in the content" },
        ]
      : []),
    { ok: !values.noindex, text: values.noindex ? "Hidden from search engines (noindex)" : "Indexable by search engines" },
  ];

  return (
    <div className="panel">
      <h2>SEO</h2>
      <div className="serp" aria-label="Search result preview">
        <div className="u">{SITE.replace(/^https?:\/\//, "")}{path}</div>
        <div className="t">{title}</div>
        <div className="d">{desc || "Add a description so search engines don't have to guess."}</div>
      </div>
      <div className="field" style={{ marginTop: 14 }}>
        <label htmlFor="seoTitle">SEO title</label>
        <input id="seoTitle" className="input" maxLength={200} value={values.seoTitle} placeholder={fallbackTitle} onChange={(e) => onChange("seoTitle", e.target.value)} />
        <span className={`counter${title.length > 65 ? " counter--warn" : ""}`}>{title.length}/65 with “{SUFFIX.trim()}”</span>
      </div>
      <div className="field">
        <label htmlFor="metaDescription">Meta description</label>
        <textarea id="metaDescription" className="textarea" rows={3} maxLength={300} value={values.metaDescription} placeholder={fallbackDescription}
          onChange={(e) => onChange("metaDescription", e.target.value)} />
        <span className={`counter${desc.length > 160 ? " counter--warn" : ""}`}>{desc.length}/160</span>
      </div>
      {showKeyword && (
        <div className="field">
          <label htmlFor="focusKeyword">Focus keyword</label>
          <input id="focusKeyword" className="input" maxLength={120} value={values.focusKeyword || ""} placeholder="e.g. shopify speed optimisation"
            onChange={(e) => onChange("focusKeyword", e.target.value)} />
        </div>
      )}
      <div className="field">
        <label htmlFor="ogImage">Social share image</label>
        <input id="ogImage" className="input" maxLength={500} value={values.ogImage} placeholder={fallbackImage || "/images/og-share.jpg"}
          onChange={(e) => onChange("ogImage", e.target.value)} />
        <small>1200 × 630. Empty uses the cover / screenshot.</small>
      </div>
      {showCanonical && (
        <div className="field">
          <label htmlFor="canonicalUrl">Canonical URL</label>
          <input id="canonicalUrl" className="input" maxLength={500} value={values.canonicalUrl || ""} placeholder={`${SITE}${path}`}
            onChange={(e) => onChange("canonicalUrl", e.target.value)} />
          <small>Only set this if the post was first published somewhere else.</small>
        </div>
      )}
      <label className="check">
        <input type="checkbox" checked={values.noindex} onChange={(e) => onChange("noindex", e.target.checked)} />
        <span>Hide from search engines<small>Adds noindex and removes it from sitemap.xml.</small></span>
      </label>
      <ul className="checklist" aria-label="SEO checklist">
        {checks.map((c) => <li key={c.text} className={c.ok ? "" : "no"}>{c.text}</li>)}
      </ul>
    </div>
  );
}
