import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { saveMedia } from "@/lib/postsRepo";

const MAX = 4 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"];

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") return NextResponse.json({ error: "No file received." }, { status: 400 });
  if (!TYPES.includes(file.type)) return NextResponse.json({ error: "Use JPG, PNG, WebP, GIF, AVIF or SVG." }, { status: 415 });
  if (file.size > MAX) return NextResponse.json({ error: "Image must be under 4 MB." }, { status: 413 });
  const id = randomBytes(12).toString("hex");
  try {
    await saveMedia({ id, filename: file.name.slice(0, 250), mime: file.type, size: file.size, data: Buffer.from(await file.arrayBuffer()) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed. Check the database connection." }, { status: 500 });
  }
  return NextResponse.json({ url: `/media/${id}` }, { status: 201 });
}
