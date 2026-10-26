import Image from "next/image";

type Props = { url: string; image?: string; alt: string; href?: string; emptyTitle?: string; priority?: boolean; sizes?: string };

export default function BrowserFrame({ url, image, alt, href, emptyTitle, priority, sizes = "(max-width: 860px) 100vw, 50vw" }: Props) {
  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const inner = (
    <>
      <div className="browser__bar" aria-hidden="true">
        <span className="browser__dots"><i /><i /><i /></span>
        <span className="browser__url">{host}</span>
      </div>
      <div className="browser__screen">
        {image ? (
          <Image src={image} alt={alt} width={1440} height={900} sizes={sizes} priority={priority} />
        ) : (
          <div className="browser__empty">
            <div>
              <strong>{emptyTitle || host}</strong>
              <span>{host}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
  return href ? (
    <a className="browser" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${host} (opens in a new tab)`}>
      {inner}
    </a>
  ) : (
    <div className="browser">{inner}</div>
  );
}
