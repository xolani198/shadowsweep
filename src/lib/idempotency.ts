// Idempotency store for destructive endpoints. A client that retries an
// offboard with the same Idempotency-Key gets the original result back instead
// of executing the action twice. In-memory with a TTL; for multi-instance
// production, back this with a shared store (Redis / Vercel KV).

interface Stored {
  response: unknown;
  expiresAt: number;
}

const store = new Map<string, Stored>();
const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_KEYS = 5000;

/** Idempotency keys must be opaque, bounded, and safe to use in a map key. */
export const IDEMPOTENCY_KEY_PATTERN = /^[A-Za-z0-9_-]{8,200}$/;

export function isValidIdempotencyKey(key: string): boolean {
  return IDEMPOTENCY_KEY_PATTERN.test(key);
}

/** Namespaced so one actor's key can never collide with another's. */
function scoped(actor: string, key: string): string {
  return `${actor}:${key}`;
}

export function getIdempotentResult(actor: string, key: string): unknown | undefined {
  const hit = store.get(scoped(actor, key));
  if (!hit) return undefined;
  if (Date.now() > hit.expiresAt) {
    store.delete(scoped(actor, key));
    return undefined;
  }
  return hit.response;
}

export function storeIdempotentResult(actor: string, key: string, response: unknown): void {
  if (store.size >= MAX_KEYS) {
    // Evict the oldest key to bound memory.
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
  store.set(scoped(actor, key), { response, expiresAt: Date.now() + TTL_MS });
}
