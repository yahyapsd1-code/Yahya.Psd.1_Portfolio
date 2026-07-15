import { NextRequest } from "next/server";
import { db } from "@/db";
import { portfolio } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin, isAllowedOrigin } from "@/lib/auth";
import { revalidateAll, logAudit } from "@/lib/cms";
import { portfolioSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function PUT(
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = portfolioSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const [updated] = await db
    .update(portfolio)
    .set({
      title: parsed.data.title,
      description: parsed.data.description,
      imageUrl: parsed.data.imageUrl,
      publicId: parsed.data.publicId ?? null,
      tags: parsed.data.tags,
      category: parsed.data.category,
      order: parsed.data.order,
      featured: parsed.data.featured,
      published: parsed.data.published,
      updatedAt: new Date(),
    })
    .where(eq(portfolio.id, numericId))
    .returning();

  revalidateAll();
  await logAudit(guard.email, "portfolio.update", String(numericId));

  return Response.json(updated ?? { ok: true });
}

export async function DELETE(
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

  await db.delete(portfolio).where(eq(portfolio.id, numericId));
  revalidateAll();
  await logAudit(guard.email, "portfolio.delete", String(numericId));

  return Response.json({ ok: true });
}
