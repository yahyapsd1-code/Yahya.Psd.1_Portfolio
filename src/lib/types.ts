/* Typed shapes for the JSON content stored in PostgreSQL. */

export interface SettingsData {
  brandName: string;
  brandInitials: string;
  role: string;
  announcement: string;
  customCursor: boolean;
  smoothScroll: boolean;
  loader: boolean;
}

export interface HeroStat {
  value: string;
  label: string;
}
export interface HeroData {
  badge: string;
  line1: string;
  line2: string;
  highlight: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  rating: number;
  ratingText: string;
  profileImage: string;
  profileAlt: string;
  stats: HeroStat[];
}

export interface Skill {
  name: string;
  level: number;
}
export interface AboutData {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  signature: string;
  skills: Skill[];
}

export interface WorkflowStep {
  icon: string;
  number: string;
  title: string;
  description: string;
}
export interface WorkflowData {
  eyebrow: string;
  title: string;
  subtitle: string;
  steps: WorkflowStep[];
}

export interface JourneyItem {
  year: string;
  title: string;
  description: string;
}
export interface JourneyData {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: JourneyItem[];
}

export interface ServicesData {
  eyebrow: string;
  title: string;
  subtitle: string;
  name: string;
  description: string;
  features: string[];
  cta: string;
}

export interface SocialData {
  instagram: string;
  instagramLabel: string;
  x: string;
  xLabel: string;
  discord: string;
  discordLabel: string;
}

export interface ContactData {
  eyebrow: string;
  title: string;
  subtitle: string;
  email: string;
  discord: string;
  instagram: string;
  x: string;
  successTitle: string;
  successText: string;
}

export interface FooterData {
  tagline: string;
  copyright: string;
  signature: string;
  quickLinks: string[];
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}
export interface StatisticsData {
  eyebrow: string;
  title: string;
  items: StatItem[];
}

export interface ThemeData {
  primary: string;
  primarySoft: string;
  primaryGlow: string;
  accent: string;
  background: string;
  surface: string;
  surfaceLight: string;
  text: string;
  muted: string;
  border: string;
}

export interface SectionBg {
  type: "gradient" | "solid" | "image" | "video";
  gradient: string;
  solid: string;
  imageUrl: string;
  videoUrl: string;
  grid: boolean;
  gridOpacity: number;
  blur: number;
  brightness: number;
  contrast: number;
  saturation: number;
  overlay: boolean;
  overlayColor: string;
  overlayOpacity: number;
  parallax: number;
  particles: boolean;
  animationSpeed: number;
  desktopOnly: boolean;
}
export interface BackgroundData {
  global: { gradient: string };
  sections: Record<string, SectionBg>;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  publicId: string | null;
  tags: string[];
  order: number;
  featured: boolean;
  published: boolean;
  category: string | null;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string | null;
  rating: number;
  review: string;
  order: number;
  published: boolean;
}
