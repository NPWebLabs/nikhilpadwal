import Image from "next/image";
import Link from "next/link";
import { isRemote } from "@/lib/seo";
import type { PublicPost } from "@/lib/posts";
import { formatDate, splitTags } from "@/lib/posts";

export default function PostCard({ post }: { post: PublicPost }) {
  const tag = splitTags(post.tags)[0];
  return (
    <Link href={`/blog/${post.slug}`} className="post-card reveal">
      <div className="post-card__img">
        {post.coverImage ? (
          <Image src={post.coverImage} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 980px) 50vw, 400px" unoptimized={isRemote(post.coverImage)} />
        ) : (
          <div className="post-card__ph" aria-hidden="true">{post.title}</div>
        )}
      </div>
      <div className="post-meta">
        {tag && <span>{tag}</span>}
        <span>{formatDate(post.publishedAt)}</span>
        <span>{post.readingMinutes} min read</span>
      </div>
      <h3>{post.title}</h3>
      {post.excerpt && <p>{post.excerpt}</p>}
    </Link>
  );
}
