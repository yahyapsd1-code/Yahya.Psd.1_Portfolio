import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  serial,
} from "drizzle-orm/pg-core";

/**
 * Admin accounts (Auth.js credentials provider authenticates against this table).
 */
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  // Bumping this invalidates every previously-issued session token (logout-all-devices).
  tokenVersion: integer("token_version").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Generic key/value store powering the CMS. Every editable section of the site
 * (Hero, About, Workflow, Journey, Services, Social, Contact, Footer, Theme,
 * Background, SEO, Statistics, Settings, Analytics) lives here as typed JSON.
 * PostgreSQL is the single source of truth — no hardcoded CMS content.
 */
export const siteContent = pgTable("site_content", {
  key: text("key").primaryKey(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Portfolio thumbnails. Cloudinary stores media only; the Cloudinary URL +
 * public id + metadata live here in PostgreSQL.
 */
export const portfolio = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  publicId: text("public_id"),
  tags: jsonb("tags").$type<string[]>().default([]).notNull(),
  order: integer("order").default(0).notNull(),
  featured: boolean("featured").default(false).notNull(),
  published: boolean("published").default(true).notNull(),
  category: text("category").default("YouTube Thumbnail"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Client testimonials / reviews.
 */
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").default("").notNull(),
  avatar: text("avatar"),
  rating: integer("rating").default(5).notNull(),
  review: text("review").notNull(),
  order: integer("order").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Contact form submissions + audit-friendly message log.
 */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Media library (Cloudinary-backed). Stores URL, public id, title and tags.
 */
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  publicId: text("public_id"),
  title: text("title").default("").notNull(),
  resourceType: text("resource_type").default("image").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Lightweight audit log for security-sensitive admin actions.
 */
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  actor: text("actor").default("system").notNull(),
  action: text("action").notNull(),
  detail: text("detail").default("").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Admin = typeof admins.$inferSelect;
export type SiteContentRow = typeof siteContent.$inferSelect;
export type PortfolioItem = typeof portfolio.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type MediaItem = typeof media.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
