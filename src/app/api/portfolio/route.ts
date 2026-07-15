import { NextRequest } from "next/server";
import { db } from "@/db";
import { portfolio } from "@/db/schema";
import { asc } from "drizzle-orm";
import { requireAdmin, isAllowedOrigin, getSession } from "@/lib/auth";
import { getPublishedPortfolio } from "@/lib/content";
import { revalidateAll, logAudit } from "@/lib/cms";
import { portfolioSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (session) {
    const items = await db
      .select()
      .from(portfolio)
      .orderBy(asc(portfolio.order), asc(portfolio.id));
    return Response.json(items);
  }
  return Response.json(await getPublishedPortfolio());
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

  const parsed = portfolioSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const [created] = await db
    .insert(portfolio)
    .values({
      title: parsed.data.title,
      description: parsed.data.description,
      imageUrl: parsed.data.imageUrl,
      publicId: parsed.data.publicId ?? null,
      tags: parsed.data.tags,
      category: parsed.data.category,
      order: parsed.data.order,
      featured: parsed.data.featured,
      published: parsed.data.published,
    })
    .returning();

  revalidateAll();
  await logAudit(guard.email, "portfolio.create", created?.title ?? "");

  return Response.json(created, { status: 201 });
}
