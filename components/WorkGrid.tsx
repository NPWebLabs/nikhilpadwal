"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { sectors, type Project } from "@/lib/projects";
import BrowserFrame from "./BrowserFrame";

const FILTERS = ["All", ...sectors] as const;

export default function WorkGrid({ projects, filters = true }: { projects: Project[]; filters?: boolean }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const list = useMemo(() => (filter === "All" ? projects : projects.filter((p) => p.sector === filter)), [filter, projects]);
  const count = (f: string) => (f === "All" ? projects.length : projects.filter((p) => p.sector === f).length);

  return (
    <>
      {filters && (
        <div className="filters" role="group" aria-label="Filter projects by sector" style={{ marginBottom: 40 }}>
          {FILTERS.map((f) => (
            <button key={f} className="filter" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f} <small>{count(f)}</small>
            </button>
          ))}
        </div>
      )}
      <div className="work-grid" aria-live="polite">
        {list.map((p, i) => {
          const wide = filter === "All" && i === 0;
          return (
            <article key={p.slug} className={`work-card${wide ? " work-card--wide" : ""}`}>
              <BrowserFrame url={p.url} image={p.image} alt={`${p.name} website homepage, desktop view`} href={p.status === "offline" ? undefined : p.url} emptyTitle={p.name} priority={i < 2} />
              <div>
                <div className="work-card__meta">
                  <span className={`platform-dot platform-dot--${p.platform}`} aria-hidden="true" />
                  <span className="eyebrow">{p.platform} · {p.category}</span>
                  {p.status === "offline" && <span className="chip">Store currently offline</span>}
                </div>
                <h3 className="h3">{p.name}</h3>
                <p>{p.summary}</p>
                <div className="work-card__hl">
                  {p.highlights.map((h) => <span key={h} className="chip">{h}</span>)}
                </div>
                <div className="work-card__links">
                  <Link className="arrow-link" href={`/case-studies/${p.slug}`}>
                    Read case study <span aria-hidden="true">→</span>
                  </Link>
                  {p.status !== "offline" && (
                    <a className="arrow-link arrow-link--muted" href={p.url} target="_blank" rel="noopener noreferrer">
                      Visit site <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
