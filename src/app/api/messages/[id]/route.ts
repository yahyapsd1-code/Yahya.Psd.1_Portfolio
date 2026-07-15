import { NextRequest } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin, isAllowedOrigin } from "@/lib/auth";
import { logAudit } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  if (!isAllowedOrigin(request)) {
    return Response.json({ error: "Forbidden origin" }, { status: 403 });
  }

  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: { read?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    /* allow empty body */
  }

  const [updated] = await db
    .update(messages)
    .set({ read: Boolean(body.read) })
    .where(eq(messages.id, numericId))
    .returning();

  await logAudit(guard.email, "message.read", String(numericId));
  return Response.json(updated ?? { ok: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  if (!isAllowedOrigin(request)) {
    return Response.json({ error: "Forbidden origin" }, { status: 322 });
  }

  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  await db.delete(messages).where(eq(messages.id, numericId));
  await logAudit(guard.email, "message.delete", String(numericId));
  return Response.json({ ok: true });
}
