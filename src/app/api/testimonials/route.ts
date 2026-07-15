import { NextRequest } from "next/server";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { asc } from "drizzle-orm";
import { requireAdmin, isAllowedOrigin, getSession } from "@/lib/auth";
import { getPublishedTestimonials } from "@/lib/content";
import { revalidateAll, logAudit } from "@/lib/cms";
import { testimonialSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (session) {
    const items = await db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.order), asc(testimonials.id));
    return Response.json(items);
  }
  return Response.json(await getPublishedTestimonials());
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  if (!isAllowedOrigin(request)) {
    return Response.json({ error: "Forbidden origin" }, { status: 403 });
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

  const [created] = await db
    .insert(testimonials)
    .values({
      name: parsed.data.name,
      role: parsed.data.role,
      avatar: parsed.data.avatar ?? null,
      rating: parsed.data.rating,
      review: parsed.data.review,
      order: parsed.data.order,
      published: parsed.data.published,
    })
    .returning();

  revalidateAll();
  await logAudit(guard.email, "testimonial.create", created?.name ?? "");

  return Response.json(created, { status: 201 });
}
