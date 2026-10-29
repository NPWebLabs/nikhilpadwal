import "server-only";
import { profile, sectors, services, skills, SITE_URL } from "./data";
import { getPublishedPosts } from "./posts";
import { getCaseStudies } from "./caseStudies";
import { getSettings } from "./settings";
import { getPageSeo } from "./seoRepo";

// robots.txt, sitemap.xml and llms.txt: generated from live content ("auto"), or replaced by text written in admin → Site files.

export function autoRobots() {
  return ["User-agent: *", "Allow: /", "Disallow: /admin", "Disallow: /api", "", `Sitemap: ${SITE_URL}/sitemap.xml`, ""].join("\n");
}

export async function robotsTxt() {
  const s = await getSettings(["robots_mode", "robots_custom"]);
  return s.robots_mode === "custom" && s.robots_custom ? s.robots_custom : autoRobots();
}

type Entry = { loc: string; lastmod?: Date | null; changefreq?: string; priority?: number };

const xmlEsc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);
const abs = (u: string) => (/^https?:\/\//.test(u) ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`);
const lines = (s?: string) => (s || "").split("\n").map((x) => x.trim()).filter(Boolean);

export async function sitemapEntries(): Promise<Entry[]> {
  const [posts, cases, s, home, blogIdx, caseIdx] = await Promise.all([
    getPublishedPosts(),
    getCaseStudies(),
    getSettings(["sitemap_extra", "sitemap_exclude"]),
    getPageSeo("/"),
    getPageSeo("/blog"),
    getPageSeo("/case-studies"),
  ]);
  const entries: Entry[] = [];
  if (!home?.noindex) entries.push({ loc: "/", changefreq: "monthly", priority: 1 });
  if (!caseIdx?.noindex) entries.push({ loc: "/case-studies", changefreq: "monthly", priority: 0.9 });
  entries.push(...cases.filter((p) => !p.noindex).map((p) => ({ loc: `/case-studies/${p.slug}`, lastmod: p.updatedAt, priority: 0.7 })));
  if (!blogIdx?.noindex) entries.push({ loc: "/blog", changefreq: "weekly", priority: 0.8 });
  entries.push(...posts.filter((p) => !p.noindex).map((p) => ({ loc: `/blog/${p.slug}`, lastmod: p.updatedAt || p.publishedAt, priority: 0.6 })));
  entries.push({ loc: "/nikhil-padwal-resume.pdf", changefreq: "yearly", priority: 0.5 });
  entries.push(...lines(s.sitemap_extra).map((loc) => ({ loc, priority: 0.5 })));
  const exclude = new Set(lines(s.sitemap_exclude).map((p) => abs(p).replace(/\/$/, "")));
  return entries.filter((e) => !exclude.has(abs(e.loc).replace(/\/$/, "")));
}

export async function autoSitemap() {
  const items = (await sitemapEntries()).map((e) =>
    [
      "  <url>",
      `    <loc>${xmlEsc(abs(e.loc))}</loc>`,
      e.lastmod ? `    <lastmod>${new Date(e.lastmod).toISOString()}</lastmod>` : "",
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : "",
      e.priority != null ? `    <priority>${e.priority.toFixed(1)}</priority>` : "",
      "  </url>",
    ].filter(Boolean).join("\n")
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.join("\n")}\n</urlset>\n`;
}

export async function sitemapXml() {
  const s = await getSettings(["sitemap_mode", "sitemap_custom"]);
  return s.sitemap_mode === "custom" && s.sitemap_custom ? s.sitemap_custom : autoSitemap();
}

export async function autoLlms() {
  const base = SITE_URL;
  const host = base.replace(/^https?:\/\//, "");
  const [posts, projects] = await Promise.all([getPublishedPosts(), getCaseStudies()]);
  const socials = Object.values(profile.socials);
  return [
    `# ${host}`,
    "",
    `> Portfolio of ${profile.name} ("Nik"), ${profile.role} at Claidroid, based in ${profile.location}. ${profile.years}+ years building websites, online stores and web apps on WordPress, WooCommerce, Shopify, React and Next.js, plus AI chatbots and automations.`,
    "",
    profile.intro,
    "",
    "## Contact",
    "",
    `- Email: ${profile.email}`,
    `- WhatsApp / phone: ${profile.phone} (https://wa.me/${profile.whatsapp})`,
    ...socials.map((s) => `- ${s.label}: ${s.url}`),
    `- Résumé (PDF): ${base}/nikhil-padwal-resume.pdf`,
    "",
    "## Services",
    "",
    ...services.map((s) => `- ${s.title}: ${s.body}`),
    "",
    "## Case studies",
    "",
    `- [All case studies](${base}/case-studies): ${projects.length} live client websites`,
    ...[...sectors, ...new Set(projects.map((p) => p.sector).filter((s) => !(sectors as readonly string[]).includes(s)))].flatMap((sector) => {
      const list = projects.filter((p) => p.sector === sector);
      return list.length
        ? ["", `### ${sector}`, "", ...list.map((p) => `- [${p.name}](${base}/case-studies/${p.slug}): ${p.category}, ${p.platform}. ${p.summary} Live site: ${p.url}`)]
        : [];
    }),
    "",
    "## Skills",
    "",
    ...skills.map((g) => `- ${g.group}: ${g.items.join(", ")}`),
    "",
    "## Blog",
    "",
    `- [All posts](${base}/blog)`,
    ...posts.map((p) => `- [${p.title}](${base}/blog/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ""}`),
    "",
  ].join("\n");
}

export async function llmsTxt() {
  const s = await getSettings(["llms_mode", "llms_custom"]);
  return s.llms_mode === "custom" && s.llms_custom ? s.llms_custom : autoLlms();
}
