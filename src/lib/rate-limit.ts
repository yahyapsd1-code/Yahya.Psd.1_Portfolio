/* Lightweight in-memory token-bucket rate limiter (per-instance). */

interface Bucket {
  count: number;
  reset: number;
}

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit = 8,
  windowMs = 60_000,
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (entry.count >= limit) {
    return {
      ok: false,
      retryAfter: Math.ceil((entry.reset - now) / 1000),
    };
  }
  entry.count += 1;
  return { ok: true, retryAfter: 0 };
}

export function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") || "local";
}
