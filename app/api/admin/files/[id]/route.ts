import { NextResponse } from "next/server";
import { deleteFile } from "@/lib/filesRepo";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteFile(id);
  return NextResponse.json({ ok: true });
}
