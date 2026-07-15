import "server-only";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";

/**
 * The public pages render dynamically, so a layout revalidate guarantees
 * every visitor sees the latest content immediately (no redeploy needed).
 */
export function revalidateAll() {
  revalidatePath("/", "layout");
}

/**
 * saveSection / saveSections are defined in @/lib/content so they can route
 * each section to its dedicated table (hero, theme, settings, social_links,
 * backgrounds) or the generic site_content store. Re-exported here to keep the
 * existing API routes' imports stable.
 */
export { saveSection, saveSections } from "@/lib/content";

/** Security audit trail (never lets a logging failure break a request). */
export async function logAudit(actor: string, action: string, detail = "") {
  try {
    await db.insert(auditLogs).values({ actor, action, detail });
  } catch {
    /* ignore */
  }
}
