// Lightweight in-memory rate limiter for the public API routes — a first line
// of defence against runaway token cost / abuse. Best-effort: state is
// per-instance, so on multi-instance hosting it's a soft cap, not a hard quota.
// Keyed by client IP (x-forwarded-for) with a fixed sliding window.

interface Hit {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Hit>();

export interface RateResult {
  ok: boolean;
  retryAfter: number; // seconds
}

export function rateLimit(
  req: Request,
  { limit = 30, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): RateResult {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";
  const now = Date.now();
  const key = `${ip}:${windowMs}:${limit}`;
  const b = buckets.get(key);

  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  b.count += 1;
  if (b.count > limit) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}
