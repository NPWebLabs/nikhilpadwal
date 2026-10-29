import { NextResponse } from "next/server";
import { createCase, caseSlugTaken } from "@/lib/caseStudies";
import { caseSchema, toCaseData } from "@/lib/caseInput";
import { revalidateContent } from "@/lib/revalidate";

export async function POST(req: Request) {
  const parsed = caseSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  const data = toCaseData(parsed.data);
  if (await caseSlugTaken(data.slug)) data.slug = `${data.slug}-${Date.now().toString(36)}`;
  try {
    const item = await createCase(data);
    revalidateContent("case", [data.slug]);
    return NextResponse.json({ item }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Couldn't save the case study. Check the database connection." }, { status: 500 });
  }
}
