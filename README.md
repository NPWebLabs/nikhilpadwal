# Nik. — Portfolio, Blog & Admin (Next.js)

Personal site for **Nikhil Shivaji Padwal** (Lead Web Engineer & AI Specialist) with a built-in admin for content, analytics and SEO.

- **Next.js 15 (App Router) + React 19 + TypeScript**, runs on Node 18.18+ (Hostinger's Node 18 works)
- **Motion** (`motion/react`, https://motion.dev) for the intro, scroll reveals, count-ups, the scroll-linked process line, filter layout animations and the services accordion
- **MySQL / MariaDB** via `mysql2`. Tables and new columns are created automatically on first request, so updating an existing database needs no manual migration.
- **Admin** at `/admin`: blog posts, case studies, analytics, SEO and site files (see below)
- **SEO**: per-page metadata and Open Graph, JSON-LD (Person, WebSite, BlogPosting, CreativeWork, Breadcrumbs), `sitemap.xml`, `robots.txt`, `llms.txt`, all editable in the admin
- **Design**: dark editorial layout, Bodoni Moda + Hanken Grotesk (self-hosted via Fontsource), real desktop screenshots of every client and company site

---

## Where to edit content

| What | File |
| --- | --- |
| Name, bio, socials, jobs, education, skills, services | `lib/data.ts` |
| Case studies | **Admin → Case studies** (seeded once from `lib/projects.ts`) |
| Project / company screenshots (1440×900 WebP) | `public/shots/` |
| Photos (portrait, campus) | `public/images/` |
| Favicon / app icon | `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico` |
| Résumé PDF linked on the site | `public/nikhil-padwal-resume.pdf` |
| Colours, fonts, spacing | `app/globals.css` (tokens at the top) |

Blog posts, case studies, SEO settings and site files are **not** in code: manage them at `yourdomain.com/admin`. If the database is unreachable, the public site falls back to the built-in case studies in `lib/projects.ts`.

---

## Run it on your computer

Requires **Node.js 20+** and a MySQL database (local MySQL/XAMPP, or your Hostinger database with Remote MySQL enabled).

```bash
npm install
cp .env.example .env          # Windows: copy .env.example .env
npm run hash-password -- "YourStrongPassword"   # paste the output into ADMIN_PASSWORD_HASH
# fill DATABASE_URL and AUTH_SECRET in .env
npm run db:setup              # creates tables (optional, the app also does it)
npm run db:seed               # optional: adds 3 starter blog posts
npm run dev                   # http://localhost:3000  ·  admin: http://localhost:3000/admin
```

Generate `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

---

## Deploy on Hostinger (Node.js Web App)

Hostinger's Node.js hosting (Business / Cloud plans) runs Next.js natively.

### 1. Create the MySQL database
hPanel → **Websites → Manage → Databases → MySQL Databases** → create a database + user.
Your connection string will look like:

```
mysql://u123456789_nik:YOUR_DB_PASSWORD@localhost:3306/u123456789_portfolio
```

> Use `localhost` as the host when the app runs on the same Hostinger account. If the password has special characters (`@ # : / ?`), URL-encode them (e.g. `@` → `%40`).

### 2. Put the code on GitHub (recommended) or upload a zip
- **GitHub:** push this folder to a private repo. `.env` is git-ignored, so secrets never leave your machine.
- **Zip:** zip the project **without** `node_modules`, `.next` and `.env`.

### 3. Add the Node.js app
hPanel → **Websites → Add website → Node.js Apps** (or *Deploy Node.js app*) → choose GitHub or upload the zip → pick your domain.

Build settings:

| Setting | Value |
| --- | --- |
| Framework / Application type | **Next.js** |
| Node.js version | **18.x**, 20 or 22 |
| Root directory | `/` (the folder with `package.json`) |
| Build script | `build` |
| Start script | `start` |
| Output directory | `.next` |
| Package manager | npm |

### 4. Environment variables
Add these in the deployment's **Environment variables** section:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | your MySQL connection string from step 1 |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |
| `ADMIN_EMAIL` | the email you'll sign in with |
| `ADMIN_PASSWORD_HASH` | output of `npm run hash-password -- "YourStrongPassword"` |
| `AUTH_SECRET` | a long random string (48+ characters) |

Deploy. Hostinger installs dependencies, builds and starts the app.

### 5. First login
Open `https://yourdomain.com/admin`, sign in, and write your first post. Tables are created on the first request. To add the three starter posts on the live database, run `npm run db:seed` locally with `DATABASE_URL` pointing at the Hostinger database (enable **Remote MySQL** for your IP in hPanel), or just write your own in the dashboard.

### Updating the site
Edit `lib/data.ts` (or anything else), push to GitHub → Hostinger redeploys. Blog posts and uploaded images live in MySQL, so redeploys never touch them.

---

## Admin features

**Overview** — page views and unique visitors (30 days, vs previous period), traffic chart, top pages, recent posts, a health checklist.

**Blog posts** — search and status filters, views per post, SEO status dot. Editor: title + auto slug, Markdown toolbar, paste/drag images, live preview, `Ctrl/⌘ + S`, unsaved-changes warning, cover image, excerpt, tags, draft / publish / schedule.

**Case studies** — add, edit, reorder, feature on the homepage, hide (draft), delete. Fields: live URL, platform, sector (drives the archive filter), industry, summary, highlights, the four-part story, optional extra Markdown, screenshot upload.

**SEO panel** (posts and case studies) — SEO title, meta description, focus keyword, social image, canonical URL (posts), noindex, a Google-style preview and a checklist.

**SEO** — titles/descriptions/share images for Home, Blog and Case-study index; site-wide default title, description and share image; Google Search Console and Bing verification codes; an audit of every post and case study.

**Analytics** — first-party and cookieless (a daily-rotating hash, no personal data). 7/30/90-day views and visitors, daily chart, top pages, posts and case studies, referrers, devices. Bots and the signed-in admin aren't counted.

**Site files** — `sitemap.xml` (auto, with extra/excluded URLs, or fully custom), `robots.txt` and `llms.txt` (auto or custom), plus any extra root file such as `/ads.txt`, `/humans.txt` or a Google verification `.html`.

Saving anything refreshes the affected pages and files immediately; otherwise pages refresh within 5 minutes.

## Security notes
- Change the password any time: generate a new hash and update `ADMIN_PASSWORD_HASH`.
- Changing `AUTH_SECRET` signs everyone out.
- `/admin` and `/api/admin/*` are protected by middleware and marked `noindex`.
- Post HTML is sanitised before rendering.
