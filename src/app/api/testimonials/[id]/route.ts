import { NextRequest } from "next/server";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin, isAllowedOrigin } from "@/lib/auth";
import { revalidateAll, logAudit } from "@/lib/cms";
import { testimonialSchema } from "@/lib/validation";

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

  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const [updated] = await db
    .update(testimonials)
    .set({
      name: parsed.data.name,
      role: parsed.data.role,
      avatar: parsed.data.avatar ?? null,
      rating: parsed.data.rating,
      review: parsed.data.review,
      order: parsed.data.order,
      published: parsed.data.published,
    })
    .where(eq(testimonials.id, numericId))
    .returning();

  revalidateAll();
  await logAudit(guard.email, "testimonial.update", String(numericId));

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

  await db.delete(testimonials).where(eq(testimonials.id, numericId));
  revalidateAll();
  await logAudit(guard.email, "testimonial.delete", String(numericId));

  return Response.json({ ok: true });
}
