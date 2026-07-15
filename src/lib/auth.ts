import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";

export const SESSION_COOKIE = "studio_session";

const SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "dev-only-fallback-secret-please-set-AUTH_SECRET-32+chars-min";

const encoder = new TextEncoder();
const secretKey = encoder.encode(SECRET);

export interface SessionPayload {
  email: string;
  name: string;
  ver: number;
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email, name: payload.name, ver: payload.ver })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

async function decode(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return {
      email: payload.email as string,
      name: payload.name as string,
      ver: (payload.ver as number) ?? 0,
    };
  } catch {
    return null;
  }
}

export async function verifyCredentials(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const rows = await db
    .select()
    .from(admins)
    .where(eq(admins.email, normalized));
  const admin = rows[0];
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return null;
  return {
    email: admin.email,
    name: admin.name,
    tokenVersion: admin.tokenVersion,
  };
}

/** Returns the active session (validates token + server-side token version). */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await decode(token);
  if (!payload) return null;

  const rows = await db
    .select({ ver: admins.tokenVersion })
    .from(admins)
    .where(eq(admins.email, payload.email));
  const admin = rows[0];
  // Token version mismatch => session revoked (logout from all devices).
  if (!admin || admin.ver !== payload.ver) return null;
  return payload;
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

/** Route-handler guard. Returns the session or a 401 Response. */
export async function requireAdmin(): Promise<SessionPayload | Response> {
  const session = await getSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  return session;
}

export function unauthorizedBody() {
  return { error: "Unauthorized" };
}

/**
 * CSRF defence for state-changing requests: when a browser Origin header is
 * present it must match the request host. Same-site cookies already neutralise
 * cross-site form posts; this is the belt-and-braces check.
 */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // server-to-server / server action (no browser origin)
  const host = request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
