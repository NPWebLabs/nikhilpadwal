import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { setSettings } from "@/lib/settings";

// robots.txt / sitemap.xml / llms.txt editors (admin → Site files)
const mode = z.enum(["auto", "custom"]).default("auto");
const schema = z.object({
  file: z.enum(["robots", "sitemap", "llms"]),
  mode,
  custom: z.string().max(500_000).optional().default(""),
  extra: z.string().max(100_000).optional().default(""),
  exclude: z.string().max(100_000).optional().default(""),
});

const PATHS = { robots: "/robots.txt", sitemap: "/sitemap.xml", llms: "/llms.txt" } as const;

export async function PUT(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  const { file, mode, custom, extra, exclude } = parsed.data;
  if (mode === "custom" && !custom.trim()) return NextResponse.json({ error: "Custom content is empty. Write it, or switch back to Auto." }, { status: 400 });
  try {
    if (file === "robots") await setSettings({ robots_mode: mode, robots_custom: custom || null });
    if (file === "llms") await setSettings({ llms_mode: mode, llms_custom: custom || null });
    if (file === "sitemap") await setSettings({ sitemap_mode: mode, sitemap_custom: custom || null, sitemap_extra: extra || null, sitemap_exclude: exclude || null });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Couldn't save. Check the database connection." }, { status: 500 });
  }
  revalidatePath(PATHS[file]);
  return NextResponse.json({ ok: true });
}
