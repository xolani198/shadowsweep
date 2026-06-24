// Lightweight in-memory fixed-window rate limiter.
//
// NOTE: this is per-instance. On serverless/multi-instance hosting (Vercel) it
// is best-effort: each instance keeps its own counters. For hard, global
// limits in production, back this with a shared store such as Upstash Redis or
// Vercel KV. It is still a meaningful first line of defense against bursts and
// brute-force from a single client.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { ok: true, remaining: limit - existing.count, retryAfterSeconds: 0 };
}

/** Best-effort client identifier from proxy headers, falling back to a constant. */
export function clientKey(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

/** Periodically evict expired buckets to bound memory. */
function sweep() {
  const now = Date.now();
  buckets.forEach((b, k) => {
    if (now >= b.resetAt) buckets.delete(k);
  });
}
// Only schedule sweeping in long-lived (non-edge) runtimes.
if (typeof setInterval === "function") {
  const t = setInterval(sweep, 60_000);
  // Don't keep the process alive solely for the sweeper.
  (t as unknown as { unref?: () => void }).unref?.();
}
