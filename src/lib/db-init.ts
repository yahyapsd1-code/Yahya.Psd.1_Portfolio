import "server-only";
import { pool } from "@/db";

/**
 * Idempotent DDL that creates every table the application needs.
 *
 * This runs ONCE per server instance (cold start) and is safe to run on an
 * already-populated database — every statement uses `IF NOT EXISTS`.
 *
 * Why this exists: on serverless hosts (Vercel) backed by Neon Postgres,
 * there is no deploy hook that runs `drizzle-kit push`, so the schema would
 * otherwise be missing on a fresh database and the very first query would
 * throw `relation "site_content" does not exist`. Running this DDL lazily,
 * before the first query, makes the app self-provisioning and crash-proof.
 *
 * Each statement is executed individually (rather than one multi-statement
 * batch) so it is compatible with Neon's connection pooler (PgBouncer,
 * transaction mode) which does not support multi-statement simple queries.
 */

const STATEMENTS: string[] = [
  `CREATE TABLE IF NOT EXISTS "admin" (
     "id" SERIAL PRIMARY KEY,
     "email" TEXT NOT NULL,
     "name" TEXT NOT NULL,
     "password_hash" TEXT NOT NULL,
     "token_version" INTEGER NOT NULL DEFAULT 0,
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     CONSTRAINT "admin_email_unique" UNIQUE ("email")
   )`,
  `CREATE TABLE IF NOT EXISTS "hero" (
     "id" SERIAL PRIMARY KEY,
     "data" JSONB NOT NULL,
     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
   )`,
  `CREATE TABLE IF NOT EXISTS "theme" (
     "id" SERIAL PRIMARY KEY,
     "data" JSONB NOT NULL,
     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
   )`,
  `CREATE TABLE IF NOT EXISTS "settings" (
     "id" SERIAL PRIMARY KEY,
     "data" JSONB NOT NULL,
     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
   )`,
  `CREATE TABLE IF NOT EXISTS "social_links" (
     "id" SERIAL PRIMARY KEY,
     "data" JSONB NOT NULL,
     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
   )`,
  `CREATE TABLE IF NOT EXISTS "backgrounds" (
     "id" SERIAL PRIMARY KEY,
     "data" JSONB NOT NULL,
     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
   )`,
  `CREATE TABLE IF NOT EXISTS "site_content" (
     "key" TEXT PRIMARY KEY,
     "data" JSONB NOT NULL,
     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
   )`,
  `CREATE TABLE IF NOT EXISTS "portfolio" (
     "id" SERIAL PRIMARY KEY,
     "title" TEXT NOT NULL,
     "description" TEXT NOT NULL,
     "image_url" TEXT NOT NULL,
     "public_id" TEXT,
     "tags" JSONB NOT NULL DEFAULT '[]',
     "order" INTEGER NOT NULL DEFAULT 0,
     "featured" BOOLEAN NOT NULL DEFAULT FALSE,
     "published" BOOLEAN NOT NULL DEFAULT TRUE,
     "category" TEXT DEFAULT 'YouTube Thumbnail',
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
   )`,
  `CREATE TABLE IF NOT EXISTS "testimonials" (
     "id" SERIAL PRIMARY KEY,
     "name" TEXT NOT NULL,
     "role" TEXT NOT NULL DEFAULT '',
     "avatar" TEXT,
     "rating" INTEGER NOT NULL DEFAULT 5,
     "review" TEXT NOT NULL,
     "order" INTEGER NOT NULL DEFAULT 0,
     "published" BOOLEAN NOT NULL DEFAULT TRUE,
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
   )`,
  `CREATE TABLE IF NOT EXISTS "media" (
     "id" SERIAL PRIMARY KEY,
     "url" TEXT NOT NULL,
     "public_id" TEXT,
     "title" TEXT NOT NULL DEFAULT '',
     "resource_type" TEXT NOT NULL DEFAULT 'image',
     "tags" JSONB NOT NULL DEFAULT '[]',
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
   )`,
  `CREATE TABLE IF NOT EXISTS "messages" (
     "id" SERIAL PRIMARY KEY,
     "name" TEXT NOT NULL,
     "email" TEXT NOT NULL,
     "subject" TEXT NOT NULL,
     "message" TEXT NOT NULL,
     "read" BOOLEAN NOT NULL DEFAULT FALSE,
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
   )`,
  `CREATE TABLE IF NOT EXISTS "audit_logs" (
     "id" SERIAL PRIMARY KEY,
     "actor" TEXT NOT NULL DEFAULT 'system',
     "action" TEXT NOT NULL,
     "detail" TEXT NOT NULL DEFAULT '',
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
   )`,
];

let initPromise: Promise<void> | null = null;

/** Ensure the full database schema exists. Runs once per instance. */
export async function ensureSchema(): Promise<void> {
  if (initPromise) return initPromise;
  const p = (async () => {
    try {
      for (const stmt of STATEMENTS) {
        await pool.query(stmt);
      }
    } catch (err) {
      // Allow a retry on the next request if this cold-start attempt failed.
      initPromise = null;
      throw err;
    }
  })();
  initPromise = p;
  return p;
}
