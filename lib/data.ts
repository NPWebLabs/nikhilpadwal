// All portfolio content lives here — edit this file to update the site. Projects and case studies are in ./projects.ts.

export const profile = {
  name: "Nikhil Shivaji Padwal",
  short: "Nik",
  role: "WordPress, Shopify & AI-integrated web developer",
  location: "Pune, India",
  email: "nikhilpadwal.101@gmail.com",
  phone: "+91 99219 52205",
  whatsapp: "919921952205",
  years: 5,
  clients: "50+",
  socials: {
    instagram: { label: "Instagram", handle: "@buildwithnik", url: "https://www.instagram.com/buildwithnik/" },
    linkedin: { label: "LinkedIn", handle: "nikhil-x-padwal", url: "https://www.linkedin.com/in/nikhil-x-padwal/" },
    github: { label: "GitHub", handle: "NPWebLabs", url: "https://github.com/NPWebLabs" },
  },
  intro:
    "Results-driven web developer with five years of building fast, SEO-ready websites, eCommerce stores and web apps on WordPress, WooCommerce, Shopify, React and Next.js.",
  summary: [
    "I build custom themes and plugins, tune Core Web Vitals until pages feel instant, and wire up the technical SEO that helps people actually find a business.",
    "I work closely with marketing, design and product teams, so a website ships as a business tool, not just a set of pages. Lately that includes AI: OpenAI-powered chatbots, content automation and workflow integrations.",
  ],
};

export * from "./projects";

export type Job = {
  company: string;
  url?: string;
  role: string;
  period: string;
  start: string;
  location: string;
  about: string;
  points: string[];
  stack: string[];
  image?: string;
};

export const experience: Job[] = [
  {
    company: "CTI",
    url: "https://www.cti.com/",
    role: "WordPress Developer",
    period: "Mar 2025 – Feb 2026",
    start: "2025",
    location: "Greater St. Louis (Remote)",
    about: "An audio-visual company that designs, builds and supports AV systems and event productions.",
    points: [
      "Developed and maintained WordPress and WooCommerce websites for business and marketing teams.",
      "Built custom themes, plugins and site functionality.",
      "Improved speed and Core Web Vitals through caching, image optimisation and code improvements.",
      "Implemented technical SEO and structured content; monitored performance in GA4.",
      "Managed hosting, SSL and deployments, and supported campaign launches with marketing.",
    ],
    stack: ["WordPress", "WooCommerce", "PHP", "GA4", "Technical SEO"],
    image: "/shots/cti.webp",
  },
  {
    company: "vSplash Techlabs",
    url: "https://www.vsplash.com/",
    role: "WordPress & WooCommerce Developer",
    period: "Aug 2023 – Dec 2024",
    start: "2023",
    location: "Hyderabad (Remote)",
    about: "A digital agency building websites and online presence for small businesses.",
    points: [
      "Developed and customised WooCommerce eCommerce stores.",
      "Built reusable WordPress components for faster, scalable site builds.",
      "Integrated secure payment gateways and optimised checkout.",
      "Improved performance and managed hosting, SSL and deployments.",
    ],
    stack: ["WooCommerce", "WordPress", "Payments", "Performance"],
    image: "/shots/vsplash.webp",
  },
  {
    company: "ShubhChintak Technology",
    url: "https://shubhchintak.co/",
    role: "Web Developer (React / Next.js / Express.js)",
    period: "Jan 2022 – May 2023",
    start: "2022",
    location: "Mumbai",
    about: "A software engineering studio building web products and infrastructure.",
    points: [
      "Developed responsive web applications using React.js and Next.js.",
      "Built backend APIs with Express.js.",
      "Improved application performance and loading speed.",
      "Worked with QA and backend teams to ship stable, optimised releases.",
    ],
    stack: ["React", "Next.js", "Express.js", "Node.js"],
    image: "/shots/shubhchintak.webp",
  },
  {
    company: "HN Web Marketing",
    role: "WordPress Developer (Internship)",
    period: "Jun 2021 – Dec 2021",
    start: "2021",
    location: "Pune",
    about: "A Pune web and digital marketing agency, where I started building for real clients.",
    points: [
      "Built WordPress websites with custom themes and plugins.",
      "Created responsive UI with HTML, CSS, JavaScript and Bootstrap.",
      "Implemented backend functionality in PHP.",
      "Managed hosting, domains, SSL certificates and backups; used GitHub for version control.",
    ],
    stack: ["WordPress", "PHP", "Bootstrap", "GitHub"],
  },
];

export const education = [
  {
    degree: "BE, Computer Engineering",
    school: "ISB&M College of Engineering",
    place: "Pune, India",
    period: "2018 – 2021",
    score: "7.4 / 10 CGPA",
    image: "/images/edu-isbm.webp",
    note: "Where I went from writing programs to shipping websites for real people.",
  },
  {
    degree: "Diploma, Computer Technology",
    school: "Ekalavya Shikshan Sanstha's Polytechnic",
    place: "Pune, India",
    period: "2016 – 2018",
    score: "66%",
    image: "/images/edu-polytechnic.webp",
    note: "The first HTML page, the first database, and the habit of building things to see how they work.",
  },
];

export const skills = [
  { group: "Frontend", items: ["HTML5", "CSS3", "JavaScript", "React.js", "Next.js", "Tailwind CSS", "Bootstrap"] },
  { group: "Backend", items: ["PHP", "Express.js", "Node.js", "REST APIs", "MySQL"] },
  { group: "Platforms", items: ["WordPress", "ACF", "Custom themes & plugins", "WooCommerce", "Shopify", "Elementor"] },
  { group: "Performance", items: ["Core Web Vitals", "Caching", "CDN", "Image optimisation", "Lazy loading"] },
  { group: "SEO", items: ["Technical SEO", "Structured data", "Semantic HTML", "Internal linking", "GA4"] },
  { group: "AI", items: ["OpenAI API", "AI chatbots", "Content automation", "Workflow automation"] },
  { group: "Infrastructure", items: ["cPanel", "hPanel", "DNS", "SSL", "Deployments", "Backups"] },
  { group: "Tools", items: ["Git", "GitHub", "Jira", "Trello", "Canva", "Photoshop"] },
];

// Logo files live in /public/icons; items without one fall back to a generic glyph.
export const skillIcons: Record<string, string> = {
  HTML5: "html5", CSS3: "css", JavaScript: "javascript", "React.js": "react", "Next.js": "nextdotjs",
  "Tailwind CSS": "tailwindcss", Bootstrap: "bootstrap", PHP: "php", "Express.js": "express", "Node.js": "nodedotjs",
  MySQL: "mysql", WordPress: "wordpress", "Custom themes & plugins": "wordpress", WooCommerce: "woocommerce",
  Shopify: "shopify", Elementor: "elementor", CDN: "cloudflare", "Technical SEO": "googlesearchconsole",
  "Semantic HTML": "html5", GA4: "googleanalytics", "OpenAI API": "openai", "AI chatbots": "openai",
  cPanel: "cpanel", hPanel: "hostinger", DNS: "cloudflare", SSL: "letsencrypt", Git: "git", GitHub: "github",
  Jira: "jira", Trello: "trello", Canva: "canva", Photoshop: "photoshop",
};

export const services = [
  {
    title: "Business websites",
    body: "Custom WordPress themes and Elementor builds that load fast, rank well and are easy for your team to edit.",
  },
  {
    title: "eCommerce stores",
    body: "WooCommerce and Shopify stores with clean product pages, payment gateways and a checkout that doesn't leak sales.",
  },
  {
    title: "Speed & SEO rescue",
    body: "Core Web Vitals audits and fixes, caching, image pipelines, structured data and technical SEO clean-ups.",
  },
  {
    title: "AI integrations",
    body: "OpenAI-powered chatbots, content workflows and automations plugged into the site you already have.",
  },
];

export const workProcess = [
  { step: "Listen", body: "Goals, audience, what success looks like. One call, one page of notes." },
  { step: "Plan", body: "Sitemap, content and the tech choice: WordPress, Shopify or custom Next.js." },
  { step: "Build", body: "Custom theme or components, built mobile-first with real content." },
  { step: "Tune", body: "Core Web Vitals, SEO, analytics and accessibility checks before launch." },
  { step: "Launch & care", body: "Hosting, SSL, deployment, backups and a handover your team can use." },
];

export const nav = [
  { href: "/case-studies", label: "Case studies" },
  { href: "/#experience", label: "Experience" },
  { href: "/#education", label: "Education" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

// Public site address with no trailing slash, so `${SITE_URL}/path` never produces "//".
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://nikhilpadwal.com").trim().replace(/\/+$/, "");
