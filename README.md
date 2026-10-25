# Nik. — Portfolio + Blog (Next.js)

Personal site for **Nikhil Shivaji Padwal** with a built-in admin dashboard for writing blog posts.

- **Next.js 15 (App Router) + React 19 + TypeScript**
- **MySQL** via `mysql2` (pure JavaScript, works on Hostinger's MySQL). Tables are created automatically on first request.
- **Admin**: `/admin` — secure login (bcrypt + signed httpOnly cookie), dashboard, Markdown editor with live preview, image uploads (stored in MySQL), drafts, scheduling, SEO fields.
- **SEO**: metadata, Open Graph image, JSON-LD (Person + BlogPosting), `sitemap.xml`, `robots.txt`.
- **Design**: editorial "Nik, explained" layout — paper texture, Instrument Serif + Geist, colour chapters, real desktop screenshots of every client and company site.

---

## Where to edit content

| What | File |
| --- | --- |
| Name, bio, socials, projects, jobs, education, skills, services | `lib/data.ts` |
| Project / company screenshots (1440×900 WebP) | `public/shots/` |
| Photos (portrait, campus) | `public/images/` |
| Favicon / app icon | `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico` |
| Résumé PDF linked on the site | `public/nikhil-padwal-resume.pdf` |
| Colours, fonts, spacing | `app/globals.css` (tokens at the top) |

Blog posts are **not** in code: write them at `yourdomain.com/admin`.

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
| Node.js version | **20** or **22** |
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

- Sign-in rate-limited (5 failed attempts → 15-minute lock per IP)
- Dashboard: published / draft / scheduled counts, edit, view, delete
- Editor: title + auto slug, Markdown toolbar (headings, bold, italic, links, code, lists, quotes, divider), **paste or drag images straight into the text**, live preview, word count, `Ctrl/⌘ + S` to save, unsaved-changes warning
- Cover image upload or URL, excerpt, tags, SEO description with counter
- Draft / publish / schedule with a future publish date
- Published posts appear on `/blog` and the homepage within ~5 minutes (instantly after saving, via revalidation)

## Security notes
- Change the password any time: generate a new hash and update `ADMIN_PASSWORD_HASH`.
- Changing `AUTH_SECRET` signs everyone out.
- `/admin` and `/api/admin/*` are protected by middleware and marked `noindex`.
- Post HTML is sanitised before rendering.
