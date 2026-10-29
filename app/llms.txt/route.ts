import { llmsTxt } from "@/lib/siteFiles";

// /llms.txt — a plain-markdown site summary for AI assistants (https://llmstxt.org). Auto or custom (admin → Site files).
export const revalidate = 3600;

export async function GET() {
  return new Response(await llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
