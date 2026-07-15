import { NextRequest } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { contactSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!limited.ok) {
    return Response.json(
      { error: "Too many messages. Please wait a moment." },
      { status: 429, headers: { "retry-after": String(limited.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Please complete all fields correctly.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await db.insert(messages).values({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  return Response.json({ ok: true });
}
