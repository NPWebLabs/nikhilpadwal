import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import { profile } from "@/lib/data";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Blog",
  description: "Notes from client work by Nik: WordPress speed, WooCommerce and Shopify setups, technical SEO and AI integrations.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndex() {
  const posts = await getPublishedPosts();
  return (
    <div className="wrap">
      <header className="article-head">
        <span className="label">Blog</span>
        <h1>Notes from the build</h1>
        <p className="lead muted" style={{ margin: 0 }}>
          WordPress speed, Shopify setups, SEO fixes and AI experiments, written up after the client work is done.
        </p>
      </header>
      <section className="section" style={{ paddingTop: 16 }} aria-label="All posts">
        {posts.length ? (
          <div className="post-grid">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div>
        ) : (
          <div className="empty-state">
            <h2 className="h3">No posts yet.</h2>
            <p>The first write-ups are being drafted. Meanwhile, follow {profile.socials.instagram.handle} on Instagram.</p>
          </div>
        )}
      </section>
    </div>
  );
}
