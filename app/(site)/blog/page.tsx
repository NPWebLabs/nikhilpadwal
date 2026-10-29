import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import { PostCard } from "@/components/site/Sections";
import { getPublishedPosts } from "@/lib/posts";
import { absolute, breadcrumbSchema, graph, PERSON_ID, staticPageMeta } from "@/lib/seo";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return staticPageMeta({
    title: "Blog: WordPress, Shopify, SEO & AI Notes",
    description: "Notes from client work by Nikhil Padwal: WordPress speed, Shopify setups, technical SEO fixes and AI experiments.",
    path: "/blog",
  });
}

export default async function Blog() {
  const posts = await getPublishedPosts();
  const jsonLd = graph(
    {
      "@type": "Blog",
      name: "Nikhil Padwal — Blog",
      url: absolute("/blog"),
      author: { "@id": PERSON_ID },
      blogPost: posts.slice(0, 20).map((p) => ({ "@type": "BlogPosting", headline: p.title, url: absolute(`/blog/${p.slug}`), datePublished: p.publishedAt ? new Date(p.publishedAt).toISOString() : undefined })),
    },
    breadcrumbSchema([{ name: "Blog", path: "/blog" }]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <header className="page-hero band">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Blog</span></nav>
          <Reveal as="div">
            <h1 className="serif">Notes from <em>client work.</em></h1>
            <p className="lede">WordPress speed, Shopify setups, SEO fixes and AI experiments, written up after the job is done.</p>
          </Reveal>
        </div>
      </header>
      <section className="band">
        <div className="wrap">
          {posts.length ? (
            <div className="post-list">{posts.map((p) => <PostCard key={p.slug} p={p} />)}</div>
          ) : (
            <p className="empty-note">No posts yet. The first one is on its way.</p>
          )}
        </div>
      </section>
    </>
  );
}
