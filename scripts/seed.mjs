// Optional: adds three starter posts (skips any slug that already exists).
// Run once:   npm run db:seed
import nextEnv from "@next/env";
import mysql from "mysql2/promise";
import { SCHEMA } from "../lib/schema.mjs";

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL) { console.error("DATABASE_URL is not set."); process.exit(1); }
const db = await mysql.createConnection({ uri: process.env.DATABASE_URL, timezone: "Z", charset: "utf8mb4" });
for (const sql of SCHEMA) await db.query(sql);

const minutes = (md) => Math.max(1, Math.round(md.split(/\s+/).filter(Boolean).length / 220));
const daysAgo = (n) => new Date(Date.now() - n * 86400000);

const posts = [
  {
    title: "How I get WordPress sites to pass Core Web Vitals",
    slug: "wordpress-core-web-vitals-checklist",
    tags: "WordPress, Performance, SEO",
    excerpt: "The checklist I run on every WordPress build before launch: images, caching, fonts, scripts and the hosting layer.",
    metaDescription: "A practical Core Web Vitals checklist for WordPress: LCP, CLS and INP fixes for images, caching, fonts, scripts and hosting.",
    publishedAt: daysAgo(21),
    content: `Most slow WordPress sites aren't slow because of WordPress. They're slow because of what got piled on top of it. Here is the checklist I run before any site I build goes live.

## 1. Fix the biggest image first (LCP)

The Largest Contentful Paint is almost always the hero image or slider. I make sure it is:

- Served as **WebP or AVIF**, sized for the layout it actually sits in
- **Not lazy-loaded** (lazy-loading the hero is the most common LCP mistake)
- Given \`fetchpriority="high"\` so the browser grabs it first

## 2. Reserve space for everything (CLS)

Layout shift comes from images without dimensions, late-loading fonts and banners that push content down. Every image gets width and height, fonts use \`font-display: swap\` with a close fallback, and cookie bars overlay instead of pushing.

## 3. Cut JavaScript that blocks input (INP)

Page builders and plugins love to load scripts on every page. I audit what runs where, delay non-critical scripts (chat widgets, analytics extras) until interaction, and remove plugins that do one small job a few lines of code could do.

## 4. Cache at every layer

- Page cache for anonymous visitors
- Object cache for WooCommerce and logged-in traffic
- A CDN in front of static assets

## 5. Measure on real devices

Lab scores are a guide. The real test is field data in Search Console and GA4 after a week of real visitors on real phones.

> Speed is a feature your visitors feel before they read a single word.

If your site is failing Core Web Vitals, [send me the URL](mailto:nikhilpadwal.101@gmail.com) and I'll tell you the top three fixes.`,
  },
  {
    title: "WooCommerce or Shopify? How I choose for a client",
    slug: "woocommerce-vs-shopify-how-i-choose",
    tags: "eCommerce, WooCommerce, Shopify",
    excerpt: "I build on both. Here are the five questions that decide which one a store should run on.",
    metaDescription: "WooCommerce vs Shopify from a developer who builds both: content, control, cost, team skills and growth plans.",
    publishedAt: daysAgo(12),
    content: `I've shipped stores on both WooCommerce and Shopify, and neither is "better". They fit different businesses. These are the questions I ask before recommending one.

## Is the store the business, or part of it?

If the brand **is** the store (fashion drops, a single product line), Shopify keeps things focused. If the store sits next to a lot of content (a blog, guides, services, an association), WooCommerce keeps it all in one WordPress site.

## How much control do you need?

WooCommerce gives full control over code, data and hosting. Shopify trades some of that control for less maintenance.

## Who will run it day to day?

A small team without a developer usually does better on Shopify's admin. A team that already lives in WordPress will be faster on WooCommerce.

## What does it cost over three years?

Shopify: monthly plan + app subscriptions + transaction fees. WooCommerce: hosting + premium plugins + maintenance time. I put both in a simple sheet so the decision is about numbers, not feelings.

## Where is the business going?

Multi-currency, B2B pricing, subscriptions or custom checkout rules can tip the decision either way.

---

Not sure which fits your business? [Ask me](mailto:nikhilpadwal.101@gmail.com). I'll give you a straight answer, even if it's the one I won't build.`,
  },
  {
    title: "Adding an AI chatbot to a WordPress site without slowing it down",
    slug: "ai-chatbot-wordpress-without-slowing-it-down",
    tags: "AI, WordPress, OpenAI",
    excerpt: "A chatbot that answers from your own content, loads only when someone wants it, and keeps your API key off the browser.",
    metaDescription: "How to add an OpenAI-powered chatbot to WordPress that answers from your own content, keeps the API key server-side and doesn't hurt page speed.",
    publishedAt: daysAgo(4),
    content: `Most chatbot plugins add hundreds of kilobytes of JavaScript to every page. Here's the approach I use instead.

## Load it on intent

The page ships a tiny button. The chat widget code only loads when someone clicks it, so Core Web Vitals stay untouched for everyone who doesn't chat.

## Keep the API key on the server

The browser never talks to OpenAI directly. It calls a small WordPress REST endpoint, which adds the key, applies rate limits, and forwards the request.

\`\`\`php
register_rest_route('nik/v1', '/chat', [
  'methods'  => 'POST',
  'callback' => 'nik_chat_handler',
  'permission_callback' => '__return_true',
]);
\`\`\`

## Answer from your own content

Generic answers are useless to a business. I index the site's pages, FAQs and product data, and pass the most relevant passages to the model with each question, so answers stay grounded in what the business actually offers.

## Hand off to a human

Every good bot knows when to stop. If a question looks like a sales lead or a complaint, the bot collects contact details and sends them straight to the team on email or WhatsApp.

Want one on your site? [Let's talk](mailto:nikhilpadwal.101@gmail.com).`,
  },
];

for (const p of posts) {
  const [rows] = await db.query("SELECT id FROM posts WHERE slug = ? LIMIT 1", [p.slug]);
  if (rows.length) { console.log("skip ", p.slug); continue; }
  await db.query(
    `INSERT INTO posts (title, slug, excerpt, content, tags, meta_description, status, reading_minutes, published_at)
     VALUES (?, ?, ?, ?, ?, ?, 'PUBLISHED', ?, ?)`,
    [p.title, p.slug, p.excerpt, p.content, p.tags, p.metaDescription, minutes(p.content), p.publishedAt]
  );
  console.log("added", p.slug);
}
await db.end();
