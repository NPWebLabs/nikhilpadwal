import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({ gfm: true, breaks: false });

export function renderMarkdown(md: string) {
  const raw = marked.parse(md || "", { async: false }) as string;
  return sanitizeHtml(raw, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3", "figure", "figcaption", "video", "iframe", "del", "input"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height", "loading"],
      a: ["href", "title", "target", "rel"],
      code: ["class"],
      iframe: ["src", "width", "height", "allow", "allowfullscreen", "frameborder", "title"],
      video: ["src", "controls", "poster", "width", "height"],
      input: ["type", "checked", "disabled"],
      "*": ["id"],
    },
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com", "player.vimeo.com", "codepen.io"],
    transformTags: {
      a: (tagName, attribs) => {
        const external = /^https?:\/\//.test(attribs.href || "");
        return { tagName, attribs: external ? { ...attribs, target: "_blank", rel: "noopener noreferrer" } : attribs };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
      // sanitize-html < 2.18 doesn't scheme-check `poster` (GHSA-vccv-cmxp-4j9h); 2.18 needs Node 22.
      video: (tagName, attribs) => {
        const { poster, ...rest } = attribs;
        return { tagName, attribs: poster && /^(https?:\/\/|\/)/i.test(poster.trim()) ? { ...rest, poster } : rest };
      },
    },
  });
}

export function readingMinutes(md: string) {
  const words = (md || "").replace(/[#*_`>\-\[\]()!]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}
