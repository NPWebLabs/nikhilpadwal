import Link from "next/link";
import type { PublicPost } from "@/lib/posts";
import { formatDate, splitTags } from "@/lib/posts";

export default function PostCard({ post }: { post: PublicPost }) {
  const tag = splitTags(post.tags)[0];
  return (
    <Link href={`/blog/${post.slug}`} className="post-card reveal">
      <div className="post-card__img">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt="" loading="lazy" />
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
