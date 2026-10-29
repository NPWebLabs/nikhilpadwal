import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { FILE_NAME_RE, RESERVED_FILES, saveFile } from "@/lib/filesRepo";

// Create or update a custom root file such as /ads.txt or /google1234.html
const schema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().trim().toLowerCase(),
  content: z.string().max(500_000),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  const { id, name, content } = parsed.data;
  if (!FILE_NAME_RE.test(name)) return NextResponse.json({ error: "Use a simple file name ending in .txt, .xml, .html, .json or .webmanifest (e.g. ads.txt)." }, { status: 400 });
  if (RESERVED_FILES.includes(name)) return NextResponse.json({ error: `${name} has its own editor above.` }, { status: 400 });
  try {
    await saveFile(name, content, id);
  } catch (e) {
    const dup = /Duplicate/i.test((e as Error).message);
    return NextResponse.json({ error: dup ? `A file named ${name} already exists.` : "Couldn't save. Check the database connection." }, { status: dup ? 409 : 500 });
  }
  revalidatePath(`/api/files/${name}`);
  return NextResponse.json({ ok: true });
}
