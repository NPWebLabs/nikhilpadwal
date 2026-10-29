import { NextResponse } from "next/server";
import { getCaseRow, updateCase, deleteCase, caseSlugTaken } from "@/lib/caseStudies";
import { caseSchema, toCaseData } from "@/lib/caseInput";
import { revalidateContent } from "@/lib/revalidate";

type Ctx = { params: Promise<{ id: string }> };
const idOf = async (params: Ctx["params"]) => Number((await params).id);

export async function PUT(req: Request, { params }: Ctx) {
  const id = await idOf(params);
  const parsed = caseSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  const existing = await getCaseRow(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const data = toCaseData(parsed.data);
  if (await caseSlugTaken(data.slug, id)) return NextResponse.json({ error: "Another case study already uses this URL slug." }, { status: 409 });
  const item = await updateCase(id, data);
  revalidateContent("case", [existing.slug, data.slug]);
  return NextResponse.json({ item });
}

export async function DELETE(_: Request, { params }: Ctx) {
  const row = await deleteCase(await idOf(params));
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateContent("case", [row.slug]);
  return NextResponse.json({ ok: true });
}
