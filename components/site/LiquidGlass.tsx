"use client";
import { useEffect } from "react";

/**
 * Liquid glass for every element marked `data-glass` (optionally `data-glass-radius="24"`).
 * Same model as iyinchao/liquid-glass-studio (MIT): the shape is a rounded-rect SDF, the bezel is a convex
 * squircle surface that bends what's behind it (refraction), the R/G/B channels bend by slightly different
 * amounts (dispersion), and a rim light plays the fresnel/glare role. That project renders a canvas with WebGL;
 * a web page can't hand its own DOM to WebGL, so here the refraction map drives an SVG displacement filter used
 * as `backdrop-filter`. Only Chromium supports that, so other browsers keep the frosted CSS fallback in `.glass`.
 */

const SVG_NS = "http://www.w3.org/2000/svg";
const maps = new Map<string, string>();

/** Displacement map: R = x shift, G = y shift (128 = none), only inside the bezel. */
function refractionMap(w: number, h: number, r: number, bezel: number) {
  const key = `${w}x${h}r${r}b${bezel}`;
  const hit = maps.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const hw = w / 2, hh = h / 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // signed distance to the rounded rect (negative inside) and its outward normal
      const px = x + 0.5 - hw, py = y + 0.5 - hh;
      const qx = Math.abs(px) - (hw - r), qy = Math.abs(py) - (hh - r);
      const ox = Math.max(qx, 0), oy = Math.max(qy, 0);
      const outside = Math.hypot(ox, oy);
      const d = outside + Math.min(Math.max(qx, qy), 0) - r;
      let nx = 0, ny = 0;
      if (outside > 0) { nx = (ox / outside) * Math.sign(px); ny = (oy / outside) * Math.sign(py); }
      else if (qx > qy) nx = Math.sign(px);
      else ny = Math.sign(py);
      const t = -d; // depth inside the shape
      let m = 0;
      if (t > 0 && t < bezel) {
        // slope of the squircle surface h(u) = (1 - (1-u)^4)^(1/4): steep at the rim, flat at the centre
        const u = t / bezel, v = 1 - u;
        m = Math.min(1, Math.pow(v, 3) / Math.pow(1 - Math.pow(v, 4) + 1e-4, 0.75) / 4);
      }
      const i = (y * w + x) * 4;
      img.data[i] = 128 - nx * m * 127;
      img.data[i + 1] = 128 - ny * m * 127;
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const url = c.toDataURL();
  maps.set(key, url);
  return url;
}

function el<K extends keyof SVGElementTagNameMap>(name: K, attrs: Record<string, string | number>) {
  const n = document.createElementNS(SVG_NS, name);
  for (const k in attrs) n.setAttribute(k, String(attrs[k]));
  return n;
}

/** One filter per element: refract each colour channel by a slightly different amount, then recombine. */
function buildFilter(id: string, w: number, h: number, href: string, scale: number) {
  const f = el("filter", { id, x: 0, y: 0, width: w, height: h, filterUnits: "userSpaceOnUse", "color-interpolation-filters": "sRGB" });
  f.append(el("feImage", { href, x: 0, y: 0, width: w, height: h, result: "map", preserveAspectRatio: "none" }));
  const channels = [
    ["r", 1, "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"],
    ["g", 1.06, "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"],
    ["b", 1.12, "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"],
  ] as const;
  for (const [c, k, matrix] of channels) {
    f.append(el("feDisplacementMap", { in: "SourceGraphic", in2: "map", scale: (scale * k).toFixed(1), xChannelSelector: "R", yChannelSelector: "G", result: `d${c}` }));
    f.append(el("feColorMatrix", { in: `d${c}`, type: "matrix", values: matrix, result: c }));
  }
  f.append(el("feBlend", { in: "r", in2: "g", mode: "screen", result: "rg" }));
  f.append(el("feBlend", { in: "rg", in2: "b", mode: "screen" }));
  return f;
}

export default function LiquidGlass() {
  useEffect(() => {
    // backdrop-filter: url() only renders in Chromium; navigator.userAgentData is a Chromium-only API.
    const chromium = "userAgentData" in navigator && !/Firefox/.test(navigator.userAgent);
    if (!chromium || matchMedia("(prefers-reduced-transparency: reduce)").matches) return;
    document.documentElement.classList.add("lg");

    const svg = el("svg", { width: 0, height: 0, "aria-hidden": "true" });
    svg.style.position = "absolute";
    const defs = el("defs", {});
    svg.append(defs);
    document.body.append(svg);

    let n = 0;
    const ids = new WeakMap<Element, string>();
    const sizes = new WeakMap<Element, string>();
    const apply = (node: HTMLElement) => {
      const w = Math.round(node.offsetWidth), h = Math.round(node.offsetHeight);
      if (!w || !h) return;
      const r = Math.min(Number(node.dataset.glassRadius) || h / 2, w / 2, h / 2);
      const size = `${w}x${h}r${r}`;
      if (sizes.get(node) === size) return;
      sizes.set(node, size);
      let id = ids.get(node);
      if (!id) { id = `lg${++n}`; ids.set(node, id); }
      const bezel = Math.max(6, Math.min(r, h / 2) * 0.9);
      const scale = Math.min(48, Math.max(14, h * 0.5));
      defs.querySelector(`#${id}`)?.remove();
      defs.append(buildFilter(id, w, h, refractionMap(w, h, r, bezel), scale));
      const bf = `url(#${id}) blur(1.2px) saturate(1.7) brightness(1.08)`;
      node.style.backdropFilter = bf;
      node.style.setProperty("-webkit-backdrop-filter", bf);
    };

    const ro = new ResizeObserver((entries) => entries.forEach((e) => apply(e.target as HTMLElement)));
    const watched = new WeakSet<Element>();
    const scan = () => document.querySelectorAll<HTMLElement>("[data-glass]").forEach((node) => {
      if (watched.has(node)) return;
      watched.add(node);
      ro.observe(node);
    });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      ro.disconnect();
      svg.remove();
      document.documentElement.classList.remove("lg");
    };
  }, []);
  return null;
}
