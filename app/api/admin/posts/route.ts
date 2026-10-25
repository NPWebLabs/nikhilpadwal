import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { listPosts, createPost, slugTaken } from "@/lib/postsRepo";
import { postSchema, toPostData } from "@/lib/postInput";

export async function GET() {
  return NextResponse.json({ posts: await listPosts() });
}

export async function POST(req: Request) {
  const parsed = postSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  const data = toPostData(parsed.data);
  if (await slugTaken(data.slug)) data.slug = `${data.slug}-${Date.now().toString(36)}`;
  try {
    const post = await createPost(data);
    revalidatePath("/blog");
    revalidatePath("/");
    return NextResponse.json({ post }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Couldn't save the post. Check the database connection." }, { status: 500 });
  }
}
