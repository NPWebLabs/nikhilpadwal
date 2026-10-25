type Props = { url: string; image?: string; alt: string; href?: string; emptyTitle?: string; priority?: boolean };

export default function BrowserFrame({ url, image, alt, href, emptyTitle, priority }: Props) {
  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const inner = (
    <>
      <div className="browser__bar" aria-hidden="true">
        <span className="browser__dots"><i /><i /><i /></span>
        <span className="browser__url">{host}</span>
      </div>
      <div className="browser__screen">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" width={1440} height={900} />
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
