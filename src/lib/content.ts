import "server-only";
import { db } from "@/db";
import {
  siteContent,
  portfolio,
  testimonials,
  admins,
  messages,
} from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import bcrypt from "bcryptjs";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type SectionKey =
  | "hero"
  | "about"
  | "workflow"
  | "journey"
  | "services"
  | "social"
  | "contact"
  | "footer"
  | "theme"
  | "background"
  | "seo"
  | "statistics"
  | "settings";

export interface SiteContent {
  [key: string]: Record<string, unknown>;
}

/* -------------------------------------------------------------------------- */
/*  Default CMS content (seeded into PostgreSQL on first run)                 */
/* -------------------------------------------------------------------------- */

function defaultSectionBackground(overrides: Record<string, unknown> = {}) {
  return {
    type: "gradient" as const,
    gradient:
      "radial-gradient(1200px 600px at 50% -10%, rgba(193,18,31,0.10), transparent 60%), linear-gradient(180deg, #08080a 0%, #0b0b0e 100%)",
    solid: "#08080a",
    imageUrl: "",
    videoUrl: "",
    grid: true,
    gridOpacity: 0.12,
    blur: 0,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    overlay: true,
    overlayColor: "#06060a",
    overlayOpacity: 0.55,
    parallax: 0.15,
    particles: true,
    animationSpeed: 1,
    desktopOnly: false,
    ...overrides,
  };
}

export const DEFAULT_CONTENT: SiteContent = {
  settings: {
    brandName: "ALEX RIVERA",
    brandInitials: "AR",
    role: "YouTube Thumbnail Designer",
    announcement: "Booking new creators for 2026 — limited slots available.",
    customCursor: true,
    smoothScroll: true,
    loader: true,
  },
  hero: {
    badge: "YouTube Thumbnail Specialist",
    line1: "Professional",
    line2: "YouTube",
    highlight: "Thumbnail Designer",
    description:
      "I design scroll-stopping YouTube thumbnails engineered to dominate the feed — blending cinematic composition, bold typography and color psychology to maximize click-through rate and turn viewers into subscribers.",
    primaryCta: "View Portfolio",
    secondaryCta: "Contact Me",
    rating: 5,
    ratingText: "Trusted by creators worldwide",
    profileImage: "/images/hero-portrait.jpg",
    profileAlt: "Alex Rivera — YouTube Thumbnail Designer",
    stats: [
      { value: "10K+", label: "Thumbnails Delivered" },
      { value: "58%", label: "Average CTR Increase" },
      { value: "6+", label: "Years Experience" },
    ],
  },
  about: {
    eyebrow: "About",
    title: "Designing the click that changes everything",
    paragraphs: [
      "For over six years I've lived and breathed the YouTube feed. Every thumbnail I create is a calculated blend of emotion, contrast and clarity — built to earn the click in the first 0.3 seconds.",
      "My obsession is CTR. I study audience psychology, trending palettes and the exact geometry of attention to craft thumbnails that don't just look premium — they perform at scale.",
    ],
    signature: "Alex Rivera",
    skills: [
      { name: "CTR Optimization", level: 96 },
      { name: "Composition", level: 94 },
      { name: "Typography", level: 92 },
      { name: "Color Psychology", level: 90 },
      { name: "Photoshop", level: 98 },
    ],
  },
  workflow: {
    eyebrow: "Workflow",
    title: "A process engineered for performance",
    subtitle: "Four refined stages that turn a brief into a high-CTR thumbnail.",
    steps: [
      { icon: "search", number: "01", title: "Research", description: "Analyze the audience, niche and competing thumbnails to find the winning angle." },
      { icon: "concept", number: "02", title: "Concept", description: "Plan composition, focal point and emotion before a single pixel is placed." },
      { icon: "design", number: "03", title: "Design", description: "Craft a premium thumbnail with cinematic lighting and bold typography." },
      { icon: "rocket", number: "04", title: "Optimization", description: "Refine contrast and clarity to maximize CTR and stand out in the feed." },
    ],
  },
  journey: {
    eyebrow: "Journey",
    title: "Six years of obsessive growth",
    subtitle: "From first client to 10,000+ delivered thumbnails.",
    items: [
      { year: "2019", title: "Started Thumbnail Design", description: "Designed my first thumbnails for small gaming and vlog channels." },
      { year: "2021", title: "Freelance Full-Time", description: "Went all-in and began partnering with growing creators daily." },
      { year: "2023", title: "International Clients", description: "Worked with creators and brands across 20+ countries worldwide." },
      { year: "2025", title: "10K+ Thumbnails Delivered", description: "Crossed ten thousand high-performing thumbnails delivered." },
    ],
  },
  services: {
    eyebrow: "Service",
    title: "One Service. Perfected.",
    subtitle:
      "Every thumbnail is designed with one goal: maximize CTR and attract more clicks.",
    name: "YouTube Thumbnail Design",
    description:
      "A premium, end-to-end thumbnail design service tailored to your channel. From concept to a polished, high-converting composition — every detail is crafted to stop the scroll and win the click.",
    features: [
      "High-converting compositions",
      "Advanced Photoshop editing",
      "CTR optimization",
      "Bold typography",
      "Premium color grading",
      "Fast turnaround",
      "Unlimited revisions (optional)",
      "Professional channel branding",
    ],
    cta: "Start Your Project",
  },
  social: {
    instagram: "https://instagram.com",
    instagramLabel: "@alexthumbnails",
    x: "https://x.com",
    xLabel: "@alexrva",
    discord: "https://discord.com",
    discordLabel: "Join the studio",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's create your next click magnet",
    subtitle: "Tell me about your channel and goals. I reply to every serious inquiry within 24 hours.",
    email: "hello@alexrivera.studio",
    discord: "https://discord.com",
    instagram: "https://instagram.com",
    x: "https://x.com",
    successTitle: "Message sent.",
    successText: "Thanks — I'll get back to you within 24 hours.",
  },
  footer: {
    tagline: "High-CTR YouTube thumbnails, crafted with obsessive attention to detail.",
    copyright: "Alex Rivera Studio",
    signature: "Designed & built with precision.",
    quickLinks: ["Home", "About", "Services", "Portfolio", "Reviews", "Contact"],
  },
  theme: {
    primary: "#C1121F",
    primarySoft: "#e11d2e",
    primaryGlow: "rgba(193,18,31,0.55)",
    accent: "#ff5a6a",
    background: "#08080a",
    surface: "#101015",
    surfaceLight: "#17171d",
    text: "#f6f6f8",
    muted: "#9a9aa6",
    border: "rgba(255,255,255,0.08)",
  },
  background: {
    global: {
      gradient:
        "radial-gradient(1400px 800px at 50% -10%, rgba(193,18,31,0.12), transparent 55%), radial-gradient(900px 600px at 90% 110%, rgba(193,18,31,0.06), transparent 60%), #08080a",
    },
    sections: {
      hero: defaultSectionBackground({ particles: true, grid: true, gridOpacity: 0.16, parallax: 0.25 }),
      about: defaultSectionBackground({ gridOpacity: 0.08 }),
      workflow: defaultSectionBackground({ gridOpacity: 0.08 }),
      journey: defaultSectionBackground({ gridOpacity: 0.08 }),
      services: defaultSectionBackground({ gridOpacity: 0.1, particles: true }),
      portfolio: defaultSectionBackground({ gridOpacity: 0.06 }),
      statistics: defaultSectionBackground({ gridOpacity: 0.1, particles: true }),
      testimonials: defaultSectionBackground({ gridOpacity: 0.06 }),
      social: defaultSectionBackground({ gridOpacity: 0.08 }),
      contact: defaultSectionBackground({ gridOpacity: 0.1, particles: true }),
      footer: defaultSectionBackground({ gridOpacity: 0.12 }),
    },
  },
  seo: {
    title: "Alex Rivera — Professional YouTube Thumbnail Designer",
    description:
      "Premium YouTube thumbnail design engineered for maximum CTR. Cinematic compositions, bold typography and color psychology that stop the scroll.",
    keywords: ["youtube thumbnail designer", "thumbnail design", "ctr optimization", "thumbnail artist"],
    ogImage: "/images/hero-portrait.jpg",
  },
  statistics: {
    eyebrow: "By the numbers",
    title: "Results that speak for themselves",
    items: [
      { value: 10000, suffix: "+", label: "Thumbnails Created" },
      { value: 300, suffix: "+", label: "Happy Creators" },
      { value: 58, suffix: "%", label: "Average CTR Increase" },
      { value: 6, suffix: "+", label: "Years Experience" },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Default portfolio + testimonials (seeded)                                 */
/* -------------------------------------------------------------------------- */

export const DEFAULT_PORTFOLIO = [
  {
    title: "Insane 100K Win",
    description: "Gaming channel thumbnail engineered for maximum drama and click-through.",
    imageUrl: "/images/thumbs/01-gaming.jpg",
    category: "Gaming",
    tags: ["Gaming", "High Energy", "3D Text"],
    featured: true,
    order: 1,
  },
  {
    title: "Best Phone 2025?",
    description: "Premium tech review thumbnail with futuristic lighting and bold hierarchy.",
    imageUrl: "/images/thumbs/02-tech.jpg",
    category: "Tech",
    tags: ["Tech", "Minimal", "Premium"],
    featured: true,
    order: 2,
  },
  {
    title: "I Made $10K",
    description: "Finance thumbnail with a confident red CTR arrow and money motif.",
    imageUrl: "/images/thumbs/03-finance.jpg",
    category: "Finance",
    tags: ["Finance", "Bold Text", "CTR"],
    featured: true,
    order: 3,
  },
  {
    title: "I Quit My Job",
    description: "Cinematic travel vlog thumbnail built around emotion and golden light.",
    imageUrl: "/images/thumbs/06-travel.jpg",
    category: "Vlog",
    tags: ["Travel", "Cinematic", "Storytelling"],
    featured: false,
    order: 4,
  },
  {
    title: "Build This App",
    description: "Coding channel thumbnail with neon energy and clean focal hierarchy.",
    imageUrl: "/images/thumbs/07-coding.jpg",
    category: "Tech",
    tags: ["Coding", "Neon", "Clean"],
    featured: false,
    order: 5,
  },
  {
    title: "He Revealed Everything",
    description: "Podcast thumbnail crafted around reaction, contrast and curiosity.",
    imageUrl: "/images/thumbs/08-podcast.jpg",
    category: "Podcast",
    tags: ["Podcast", "Reaction", "Curiosity"],
    featured: false,
    order: 6,
  },
];

export const DEFAULT_TESTIMONIALS = [
  {
    name: "Marcus Lee",
    role: "Tech Creator · 1.2M subs",
    rating: 5,
    review:
      "Alex's thumbnails doubled my CTR in two weeks. The compositions are unreal — every detail is intentional and my videos finally look premium.",
    order: 1,
  },
  {
    name: "Sofia Marin",
    role: "Finance Channel · 800K subs",
    rating: 5,
    review:
      "Easily the best thumbnail designer I've worked with. Fast, professional, and obsessed with performance. My click-through has never been higher.",
    order: 2,
  },
  {
    name: "Devon Carter",
    role: "Gaming · 2.4M subs",
    rating: 5,
    review:
      "These thumbnails literally print views. The bold text and color grading make my videos impossible to scroll past. Worth every penny.",
    order: 3,
  },
  {
    name: "Aisha Khan",
    role: "Lifestyle Vlog · 540K subs",
    rating: 5,
    review:
      "Cinematic, clean and incredibly clickable. Alex understood my brand instantly and the results speak for themselves. Highly recommend.",
    order: 4,
  },
  {
    name: "Ryan Cole",
    role: "Podcast Host · 320K subs",
    rating: 5,
    review:
      "The reaction thumbnails Alex designs drive insane curiosity clicks. Professional from brief to delivery. My channel has never grown faster.",
    order: 5,
  },
];

/* -------------------------------------------------------------------------- */
/*  Idempotent seeding                                                        */
/* -------------------------------------------------------------------------- */

let seedingPromise: Promise<void> | null = null;

export async function ensureSeeded(): Promise<void> {
  if (seedingPromise) return seedingPromise;
  seedingPromise = (async () => {
    const existing = await db
      .select({ key: siteContent.key })
      .from(siteContent);

    if (existing.length === 0) {
      await db.insert(siteContent).values(
        Object.entries(DEFAULT_CONTENT).map(([key, data]) => ({
          key,
          data: data as Record<string, unknown>,
        })),
      );

      await db
        .insert(portfolio)
        .values(DEFAULT_PORTFOLIO);

      await db
        .insert(testimonials)
        .values(DEFAULT_TESTIMONIALS);

      const adminEmail =
        process.env.ADMIN_EMAIL?.trim() || "admin@alexrivera.studio";
      const adminPassword =
        process.env.ADMIN_PASSWORD?.trim() || "admin12345";
      const existingAdmin = await db
        .select({ id: admins.id })
        .from(admins)
        .where(eq(admins.email, adminEmail));
      if (existingAdmin.length === 0) {
        const passwordHash = await bcrypt.hash(adminPassword, 12);
        await db.insert(admins).values({
          email: adminEmail,
          name: "Alex Rivera",
          passwordHash,
        });
      }
    }
  })();
  return seedingPromise;
}

/* -------------------------------------------------------------------------- */
/*  Read helpers                                                              */
/* -------------------------------------------------------------------------- */

export async function getSiteContent(): Promise<SiteContent> {
  await ensureSeeded();
  const rows = await db.select().from(siteContent);
  const out: SiteContent = {};
  for (const row of rows) out[row.key] = row.data as Record<string, unknown>;
  return out;
}

export async function getPublishedPortfolio() {
  await ensureSeeded();
  return db
    .select()
    .from(portfolio)
    .where(eq(portfolio.published, true))
    .orderBy(asc(portfolio.order), asc(portfolio.id));
}

export async function getPublishedTestimonials() {
  await ensureSeeded();
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.published, true))
    .orderBy(asc(testimonials.order), asc(testimonials.id));
}

/** Raw (admin) reads — never cached. */
export async function getAdminPortfolio() {
  await ensureSeeded();
  return db.select().from(portfolio).orderBy(asc(portfolio.order), asc(portfolio.id));
}

export async function getAdminTestimonials() {
  await ensureSeeded();
  return db.select().from(testimonials).orderBy(asc(testimonials.order), asc(testimonials.id));
}

export async function getMessages() {
  await ensureSeeded();
  return db.select().from(messages);
}
