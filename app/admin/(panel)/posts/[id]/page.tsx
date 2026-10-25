import { notFound } from "next/navigation";
import { getPostById } from "@/lib/postsRepo";
import PostEditor from "@/components/admin/PostEditor";

export default async function EditPost({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const post = await getPostById(id);
  if (!post) notFound();
  return (
    <PostEditor
      flash={saved}
      initial={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content,
        coverImage: post.coverImage || "",
        tags: post.tags || "",
        metaDescription: post.metaDescription || "",
        status: post.status,
        publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : null,
      }}
    />
  );
}
