import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { savePageSeo, SEO_PAGES } from "@/lib/seoRepo";
import { setSettings } from "@/lib/settings";

const s = (max: number) => z.string().trim().max(max).optional().default("");
const schema = z.object({
  pages: z
    .array(z.object({ path: z.string(), title: s(200), description: s(300), ogImage: s(500), noindex: z.boolean().default(false) }))
    .default([]),
  global: z
    .object({ siteTitle: s(200), siteDescription: s(300), defaultOgImage: s(500), googleVerification: s(200), bingVerification: s(200) })
    .optional(),
});

export async function PUT(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  const known = new Set<string>(SEO_PAGES.map((p) => p.path));
  try {
    for (const p of parsed.data.pages) if (known.has(p.path)) await savePageSeo({ ...p, title: p.title || null, description: p.description || null, ogImage: p.ogImage || null });
    const g = parsed.data.global;
    if (g)
      await setSettings({
        site_title: g.siteTitle || null,
        site_description: g.siteDescription || null,
        default_og_image: g.defaultOgImage || null,
        google_verification: g.googleVerification || null,
        bing_verification: g.bingVerification || null,
      });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Couldn't save. Check the database connection." }, { status: 500 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
