import { NextRequest } from "next/server";
import { getSiteContent } from "@/lib/content";
import { requireAdmin, isAllowedOrigin } from "@/lib/auth";
import { saveSection, logAudit } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getSiteContent();
  return Response.json(content.theme ?? {});
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
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Invalid theme object" }, { status: 400 });
  }
  await saveSection("theme", body);
  await logAudit(guard.email, "theme.update");
  return Response.json({ ok: true });
}
