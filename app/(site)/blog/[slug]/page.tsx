import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedPost, getPublishedPosts, formatDate, splitTags } from "@/lib/posts";
import { getCaseStudies } from "@/lib/caseStudies";
import { renderMarkdown } from "@/lib/markdown";
import { profile } from "@/lib/data";
import { absolute, breadcrumbSchema, graph, isRemote, pageMeta, PERSON_ID } from "@/lib/seo";

export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);
  if (!post) return { title: "Post not found" };
  return pageMeta({
    title: post.seoTitle || post.title,
    description: post.metaDescription || post.excerpt || `${post.title}, notes from client work by Nikhil Padwal.`,
    path: `/blog/${post.slug}`,
    image: post.ogImage || post.coverImage || undefined,
    type: "article",
    publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    modifiedTime: new Date(post.updatedAt).toISOString(),
    canonical: post.canonicalUrl || undefined,
    noindex: post.noindex,
    keywords: [...splitTags(post.tags), ...(post.focusKeyword ? [post.focusKeyword] : [])],
  });
}

export default async function BlogPost({ params }: Props) {
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();
  const html = renderMarkdown(post.content);
  const tags = splitTags(post.tags);
  const path = `/blog/${post.slug}`;
  const url = absolute(path);
  const [more, cases] = await Promise.all([getPublishedPosts(4), getCaseStudies()]);
  const morePosts = more.filter((p) => p.slug !== post.slug).slice(0, 3);
  const featured = cases.filter((p) => p.featured).slice(0, 3);
  const jsonLd = graph(
    {
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription || post.excerpt,
      image: absolute(post.ogImage || post.coverImage || "/images/og-share.jpg"),
      datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      dateModified: new Date(post.updatedAt).toISOString(),
      author: { "@type": "Person", "@id": PERSON_ID, name: profile.name, url: absolute("/") },
      publisher: { "@id": PERSON_ID },
      mainEntityOfPage: url,
      wordCount: post.content.split(/\s+/).filter(Boolean).length,
      keywords: tags.join(", ") || undefined,
    },
    breadcrumbSchema([{ name: "Blog", path: "/blog" }, { name: post.title, path }]),
  );

  return (
    <article className="article band">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <header className="article-head">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/blog">Blog</Link></nav>
        <h1 className="serif">{post.title}</h1>
        <div className="post-meta">
          <span>{formatDate(post.publishedAt)}</span>
          <span>{post.readingMinutes} min read</span>
          {tags.map((t) => <span key={t}>#{t}</span>)}
        </div>
      </header>
      {post.coverImage && (
        <figure className="article-cover" style={{ marginTop: 0 }}>
          <Image src={post.coverImage} alt="" width={1600} height={900} priority sizes="(max-width: 1100px) 100vw, 1080px" unoptimized={isRemote(post.coverImage)} />
        </figure>
      )}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      <footer className="article-foot">
        <div className="author">
          <Image src="/images/nik-avatar.webp" alt="" width={52} height={52} />
          <div><b>{profile.name}</b><span>{profile.role}</span></div>
        </div>
        <a className="btn ghost sm" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}>
          <span className="ic">in</span>Share
        </a>
        <a className="btn ghost sm wa" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + url)}`}>
          <span className="ic">↗</span>WhatsApp
        </a>
      </footer>
      <nav className="article-more" aria-label="Keep reading">
        {morePosts.length > 0 && (
          <div>
            <h2>More from the blog</h2>
            <ul>{morePosts.map((p) => <li key={p.slug}><Link href={`/blog/${p.slug}`}>{p.title}</Link></li>)}</ul>
          </div>
        )}
        <div>
          <h2>Case studies</h2>
          <ul>
            {featured.map((p) => <li key={p.slug}><Link href={`/case-studies/${p.slug}`}>{p.name}: {p.category}</Link></li>)}
            <li><Link href="/case-studies">All {cases.length} case studies →</Link></li>
          </ul>
        </div>
      </nav>
    </article>
  );
}
