import { profile, projects, sectors, services, skills } from "@/lib/data";
import { getPublishedPosts } from "@/lib/posts";

// /llms.txt — a plain-markdown site summary for AI assistants (https://llmstxt.org). Built from the same data as the site.
export const revalidate = 3600;

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://nikhilpadwal.com";
  const host = base.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const posts = await getPublishedPosts();
  const socials = Object.values(profile.socials);

  const lines = [
    `# ${host}`,
    "",
    `> Portfolio of ${profile.name} ("Nik"), a ${profile.role} based in ${profile.location}. ${profile.years}+ years building websites, online stores and web apps on WordPress, WooCommerce, Shopify, React and Next.js, plus AI chatbots and automations.`,
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
    ...sectors.flatMap((sector) => [
      "",
      `### ${sector}`,
      "",
      ...projects
        .filter((p) => p.sector === sector)
        .map((p) => `- [${p.name}](${base}/case-studies/${p.slug}): ${p.category}, ${p.platform}. ${p.summary} Live site: ${p.url}`),
    ]),
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
  ];

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
