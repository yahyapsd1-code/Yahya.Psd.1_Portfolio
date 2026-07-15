import { NextRequest } from "next/server";
import { clearSessionCookie, getSession } from "@/lib/auth";
import { logAudit } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getSession();
  await clearSessionCookie();
  if (session) await logAudit(session.email, "logout", "");
  return Response.json({ ok: true });
}
