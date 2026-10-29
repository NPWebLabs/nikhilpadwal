import { sitemapXml } from "@/lib/siteFiles";

// Auto-generated from published pages, posts and case studies, or custom XML (admin → Site files).
export const revalidate = 3600;

export async function GET() {
  return new Response(await sitemapXml(), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
