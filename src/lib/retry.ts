// Retry wrapper for transient failures in outbound calls (identity/spend
// integrations, etc.). Exponential backoff with jitter. Use a `shouldRetry`
// predicate to avoid retrying on deterministic client errors (4xx).

export interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  shouldRetry?: (error: unknown) => boolean;
}

export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const retries = opts.retries ?? 2;
  const base = opts.baseDelayMs ?? 200;
  const max = opts.maxDelayMs ?? 2000;

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const retryable = opts.shouldRetry ? opts.shouldRetry(error) : true;
      if (attempt === retries || !retryable) break;
      const backoff = Math.min(max, base * 2 ** attempt);
      const jitter = Math.random() * base;
      await new Promise((r) => setTimeout(r, backoff + jitter));
    }
  }
  throw lastError;
}
