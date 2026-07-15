import { NextRequest } from "next/server";
import { signToken, setSessionCookie, verifyCredentials } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { logAudit } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit(`login:${ip}`, 5, 15 * 60_000);
  if (!limited.ok) {
    return Response.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "retry-after": String(limited.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const admin = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!admin) {
    await logAudit(parsed.data.email, "login.failed", `ip=${ip}`);
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signToken({
    email: admin.email,
    name: admin.name,
    ver: admin.tokenVersion,
  });
  await setSessionCookie(token);
  await logAudit(admin.email, "login.success", `ip=${ip}`);

  return Response.json({ ok: true, session: { email: admin.email, name: admin.name } });
}
