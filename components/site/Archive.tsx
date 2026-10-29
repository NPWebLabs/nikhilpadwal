"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { isRemote } from "@/lib/url";

export type Tile = { slug: string; name: string; platform: string; category: string; sector: string; image?: string };

/** Case-study grid with a sector filter. Tiles re-flow with Motion layout animations. */
export default function Archive({ items, title = "All case studies", initialSector = "All", heading = "h3" }: {
  items: Tile[]; title?: string; initialSector?: string; heading?: "h2" | "h3";
}) {
  const sectors = useMemo(() => ["All", ...Array.from(new Set(items.map((p) => p.sector)))], [items]);
  const [sector, setSector] = useState(sectors.includes(initialSector) ? initialSector : "All");
  const shown = sector === "All" ? items : items.filter((p) => p.sector === sector);
  const H = heading;

  return (
    <div className="archive" id="archive">
      <div className="arch-top">
        <H>{title}<sup>{shown.length}</sup></H>
        <div className="filters" role="group" aria-label="Filter by sector">
          {sectors.map((s) => (
            <button key={s} type="button" aria-pressed={sector === s} onClick={() => setSector(s)}>
              {s}<span>{s === "All" ? items.length : items.filter((p) => p.sector === s).length}</span>
            </button>
          ))}
        </div>
      </div>
      <motion.div className="arch-grid" layout>
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, delay: Math.min(i, 12) * 0.03, ease: [0.2, 0.7, 0.1, 1] }}
            >
              <Link className="tile" href={`/case-studies/${p.slug}`}>
                <div className="img">
                  {p.image && <Image src={p.image} alt="" fill sizes="(max-width: 760px) 50vw, 25vw" unoptimized={isRemote(p.image)} />}
                </div>
                <div className="t"><b>{p.name}</b><em>{p.platform}</em></div>
                <small>{p.category}</small>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
