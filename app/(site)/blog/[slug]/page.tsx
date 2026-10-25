import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedPost, formatDate, splitTags } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import { profile } from "@/lib/data";

export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);
  if (!post) return { title: "Post not found" };
  const description = post.metaDescription || post.excerpt || undefined;
  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : ["/images/og.jpg"],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();
  const html = renderMarkdown(post.content);
  const tags = splitTags(post.tags);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${siteUrl}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: post.coverImage ? new URL(post.coverImage, siteUrl).toString() : undefined,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: new Date(post.updatedAt).toISOString(),
    author: { "@type": "Person", name: profile.name, url: siteUrl },
    mainEntityOfPage: url,
  };

  return (
    <article className="wrap" style={{ paddingBottom: "clamp(64px, 9vw, 120px)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="article-head">
        <Link href="/blog" className="eyebrow" style={{ textDecoration: "none" }}>← All posts</Link>
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>{formatDate(post.publishedAt)}</span>
          <span>{post.readingMinutes} min read</span>
          {tags.map((t) => <span key={t}>#{t}</span>)}
        </div>
      </header>
      {post.coverImage && (
        <figure className="article-cover" style={{ margin: "0 0 clamp(32px,5vw,56px)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage} alt="" />
        </figure>
      )}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      <footer className="article-foot">
        <div className="author">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/nik-avatar.webp" alt="" />
          <div>
            <strong>{profile.name}</strong>
            <span className="muted" style={{ fontSize: 14 }}>{profile.role}</span>
          </div>
        </div>
        <span style={{ flex: 1 }} />
        <a className="btn btn--ghost btn--sm" target="_blank" rel="noopener noreferrer"
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}>Share on LinkedIn</a>
        <a className="btn btn--ghost btn--sm" target="_blank" rel="noopener noreferrer"
          href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + url)}`}>Share on WhatsApp</a>
      </footer>
    </article>
  );
}
