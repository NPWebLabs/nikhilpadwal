// Server-rendered SVG charts for the admin. No client JavaScript needed.

type Day = { d: string; views: number; visitors: number };

export function DailyChart({ data, height = 220 }: { data: Day[]; height?: number }) {
  const W = 760, H = height, padL = 34, padB = 22, padT = 10;
  const max = Math.max(4, ...data.map((d) => d.views));
  const step = (W - padL) / Math.max(1, data.length);
  const bw = Math.max(2, step * 0.62);
  const y = (v: number) => padT + (H - padT - padB) * (1 - v / max);
  const ticks = [0, Math.round(max / 2), max];
  const labelEvery = Math.ceil(data.length / 8);
  const line = data.map((d, i) => `${i ? "L" : "M"}${(padL + i * step + step / 2).toFixed(1)} ${y(d.visitors).toFixed(1)}`).join(" ");
  return (
    <figure style={{ margin: 0 }}>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Daily views over the last ${data.length} days`}>
        {ticks.map((t) => (
          <g key={t}>
            <line className="grid" x1={padL} x2={W} y1={y(t)} y2={y(t)} />
            <text x={padL - 6} y={y(t) + 3.5} textAnchor="end">{t}</text>
          </g>
        ))}
        {data.map((d, i) => (
          <g key={d.d}>
            <rect className="bar" x={padL + i * step + (step - bw) / 2} y={y(d.views)} width={bw} height={Math.max(0, H - padB - y(d.views))} rx={2}>
              <title>{`${d.d}: ${d.views} views, ${d.visitors} visitors`}</title>
            </rect>
            {i % labelEvery === 0 && (
              <text x={padL + i * step + step / 2} y={H - 6} textAnchor="middle">
                {new Date(d.d + "T00:00:00Z").toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" })}
              </text>
            )}
          </g>
        ))}
        <path className="line" d={line} />
      </svg>
      <figcaption className="legend">
        <span><i style={{ background: "#d8c7a6" }} />Views</span>
        <span><i style={{ background: "#15130f", height: 2, verticalAlign: 3 }} />Unique visitors</span>
      </figcaption>
    </figure>
  );
}

export function BarList({ items, empty = "No data yet." }: { items: { label: string; value: number; href?: string }[]; empty?: string }) {
  if (!items.length) return <p className="bars empty">{empty}</p>;
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="bars">
      {items.map((i) => (
        <li key={i.label} style={{ ["--w" as string]: `${(i.value / max) * 100}%` }}>
          <span title={i.label}>{i.href ? <a href={i.href} target="_blank" rel="noopener">{i.label}</a> : i.label}</span>
          <b>{i.value.toLocaleString("en-IN")}</b>
        </li>
      ))}
    </ul>
  );
}

export function Delta({ cur, prev }: { cur: number; prev: number }) {
  if (!prev && !cur) return <span className="delta delta--flat">No data yet</span>;
  if (!prev) return <span className="delta delta--up">New</span>;
  const pct = Math.round(((cur - prev) / prev) * 100);
  const cls = pct > 0 ? "up" : pct < 0 ? "down" : "flat";
  return <span className={`delta delta--${cls}`}>{pct > 0 ? "▲" : pct < 0 ? "▼" : "•"} {Math.abs(pct)}% vs previous period</span>;
}
