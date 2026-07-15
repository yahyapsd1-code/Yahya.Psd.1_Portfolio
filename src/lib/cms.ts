import "server-only";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { siteContent, auditLogs } from "@/db/schema";

/** The public pages render dynamically, so a layout revalidate guarantees
 *  every visitor sees the latest content immediately (no redeploy needed). */
export function revalidateAll() {
  revalidatePath("/", "layout");
}

/** Upsert one or more content sections and propagate instantly. */
export async function saveSections(sections: Record<string, unknown>) {
  for (const [key, data] of Object.entries(sections)) {
    await db
      .insert(siteContent)
      .values({ key, data: data as Record<string, unknown> })
      .onConflictDoUpdate({
        target: siteContent.key,
        set: { data: data as Record<string, unknown>, updatedAt: new Date() },
      });
  }
  revalidateAll();
}

export async function saveSection(key: string, data: unknown) {
  await saveSections({ [key]: data });
}

/** Security audit trail. */
export async function logAudit(actor: string, action: string, detail = "") {
  try {
    await db.insert(auditLogs).values({ actor, action, detail });
  } catch {
    /* never let audit logging break a request */
  }
}
