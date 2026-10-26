import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedPost, getPublishedPosts, formatDate, splitTags } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import { profile, projects } from "@/lib/data";
import { absolute, breadcrumbSchema, graph, isRemote, pageMeta, PERSON_ID } from "@/lib/seo";

export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);
  if (!post) return { title: "Post not found" };
  return pageMeta({
    title: post.title,
    description: post.metaDescription || post.excerpt || `${post.title}, notes from client work by Nikhil Padwal.`,
    path: `/blog/${post.slug}`,
    image: post.coverImage || undefined,
    type: "article",
    publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
  });
}

export default async function BlogPost({ params }: Props) {
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();
  const html = renderMarkdown(post.content);
  const tags = splitTags(post.tags);
  const path = `/blog/${post.slug}`;
  const url = absolute(path);
  const morePosts = (await getPublishedPosts(4)).filter((p) => p.slug !== post.slug).slice(0, 3);
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const jsonLd = graph(
    {
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription || post.excerpt,
      image: post.coverImage ? absolute(post.coverImage) : absolute("/images/og-share.jpg"),
      datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      dateModified: new Date(post.updatedAt).toISOString(),
      author: { "@type": "Person", "@id": PERSON_ID, name: profile.name, url: absolute("/") },
      publisher: { "@id": PERSON_ID },
      mainEntityOfPage: url,
      keywords: tags.join(", ") || undefined,
    },
    breadcrumbSchema([{ name: "Blog", path: "/blog" }, { name: post.title, path }]),
  );

  return (
    <article className="wrap" style={{ paddingBottom: "clamp(64px, 9vw, 120px)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
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
          <Image src={post.coverImage} alt="" width={1600} height={900} priority sizes="(max-width: 1300px) 100vw, 1240px" unoptimized={isRemote(post.coverImage)} />
        </figure>
      )}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      <footer className="article-foot">
        <div className="author">
          <Image src="/images/nik-avatar.webp" alt="" width={52} height={52} />
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

      <nav className="article-more" aria-label="Keep reading">
        {morePosts.length > 0 && (
          <div>
            <h2 className="eyebrow">More from the blog</h2>
            <ul>{morePosts.map((p) => <li key={p.slug}><Link href={`/blog/${p.slug}`}>{p.title}</Link></li>)}</ul>
          </div>
        )}
        <div>
          <h2 className="eyebrow">Case studies</h2>
          <ul>
            {featured.map((p) => <li key={p.slug}><Link href={`/case-studies/${p.slug}`}>{p.name}: {p.category}</Link></li>)}
            <li><Link href="/case-studies">All {projects.length} case studies →</Link></li>
          </ul>
        </div>
      </nav>
    </article>
  );
}
