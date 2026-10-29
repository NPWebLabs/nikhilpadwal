import { robotsTxt } from "@/lib/siteFiles";

// Auto-generated or custom (admin → Site files). Saving in admin revalidates this path.
export const revalidate = 3600;

export async function GET() {
  return new Response(await robotsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
