import Image from "next/image";
import type React from "react";
import { isRemote } from "@/lib/url";

export const Arrow = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M1 6h10M7 2l4 4-4 4" /></svg>
);

/** Brand icon drawn with a CSS mask from /public/icons, so it takes the current text colour. */
export const Ico = ({ name, size, style }: { name: string; size?: number; style?: React.CSSProperties }) => (
  <span className="ico" aria-hidden="true" style={{ "--m": `url(/icons/${name}.svg)`, ...(size ? { width: size, height: size } : {}), ...style } as React.CSSProperties} />
);

export const host = (u: string) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/** Desktop screenshot in a browser chrome. Links out when href is set. */
export function Shot({ url, image, alt, href, sizes = "(max-width: 760px) 100vw, 50vw", priority, position }: {
  url: string; image?: string | null; alt: string; href?: string; sizes?: string; priority?: boolean; position?: string;
}) {
  const inner = (
    <>
      <div className="chrome"><i /><i /><i /><span>{host(url)}{href ? " ↗" : ""}</span></div>
      <div className="img">
        {image ? (
          <Image src={image} alt={alt} fill sizes={sizes} priority={priority} unoptimized={isRemote(image)} style={position ? { objectPosition: position } : undefined} />
        ) : (
          <div className="shot-empty">{host(url)}</div>
        )}
      </div>
    </>
  );
  return href ? (
    <a className="shot" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${host(url)}`}>{inner}</a>
  ) : (
    <div className="shot">{inner}</div>
  );
}
