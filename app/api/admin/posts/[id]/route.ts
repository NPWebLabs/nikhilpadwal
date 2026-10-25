import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPostById, updatePost, deletePost, slugTaken } from "@/lib/postsRepo";
import { postSchema, toPostData } from "@/lib/postInput";

type Ctx = { params: Promise<{ id: string }> };
const idOf = async (params: Ctx["params"]) => Number((await params).id);

export async function GET(_: Request, { params }: Ctx) {
  const post = await getPostById(await idOf(params));
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(req: Request, { params }: Ctx) {
  const id = await idOf(params);
  const parsed = postSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  const existing = await getPostById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const data = toPostData(parsed.data);
  if (data.status === "PUBLISHED" && !parsed.data.publishedAt && existing.publishedAt) data.publishedAt = existing.publishedAt;
  if (await slugTaken(data.slug, id)) return NextResponse.json({ error: "Another post already uses this URL slug." }, { status: 409 });
  const post = await updatePost(id, data);
  revalidatePath("/blog");
  revalidatePath(`/blog/${existing.slug}`);
  if (post) revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/");
  return NextResponse.json({ post });
}

export async function DELETE(_: Request, { params }: Ctx) {
  const post = await deletePost(await idOf(params));
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
