import { NextRequest } from "next/server";
import {
  getSiteContent,
  getPublishedPortfolio,
  getPublishedTestimonials,
  getAdminPortfolio,
  getAdminTestimonials,
} from "@/lib/content";
import { requireAdmin, isAllowedOrigin } from "@/lib/auth";
import { saveSections, logAudit } from "@/lib/cms";
import { contentBulkSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

const ALLOWED_KEYS = new Set([
  "hero", "about", "workflow", "journey", "services", "social",
  "contact", "footer", "theme", "background", "seo", "statistics", "settings",
]);

export async function GET() {
  const session = await getSessionSafe();
  const content = await getSiteContent();
  const portfolio = session
    ? await getAdminPortfolio()
    : await getPublishedPortfolio();
  const testimonials = session
    ? await getAdminTestimonials()
    : await getPublishedTestimonials();
  return Response.json({ content, portfolio, testimonials, authed: Boolean(session) });
}

// tiny local import to avoid a circular dependency warning in some bundlers
async function getSessionSafe() {
  const { getSession } = await import("@/lib/auth");
  return getSession();
}

export async function PUT(request: NextRequest) {
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

  const parsed = contentBulkSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const filtered: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(parsed.data.sections)) {
    if (ALLOWED_KEYS.has(key)) filtered[key] = value;
  }

  if (Object.keys(filtered).length === 0) {
    return Response.json({ error: "No valid sections" }, { status: 400 });
  }

  await saveSections(filtered);
  await logAudit(guard.email, "content.update", Object.keys(filtered).join(", "));

  return Response.json({ ok: true, updated: Object.keys(filtered) });
}
