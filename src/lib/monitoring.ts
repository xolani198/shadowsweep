// Vendor-neutral error reporting hook. By default it writes a structured line
// to the console (which Vercel forwards to its log drains). If
// MONITORING_WEBHOOK_URL is set on the server, errors are also POSTed there so
// you are alerted in production. To wire Sentry, call Sentry.captureException
// inside reportError. Never pass secrets or full PII in the context.

export interface ErrorContext {
  where?: string;
  digest?: string;
  [key: string]: unknown;
}

export function reportError(error: unknown, context: ErrorContext = {}): void {
  const message = error instanceof Error ? error.message : String(error);
  const entry = {
    level: "error" as const,
    message,
    ...context,
    ts: new Date().toISOString(),
  };

  // Structured log without the raw stack (kept out of JSON to avoid noise/leaks).
  console.error(`[monitor] ${JSON.stringify(entry)}`);
  if (error instanceof Error && error.stack) {
    console.error(error.stack);
  }

  // Optional server-side forwarding. process.env is only populated with this
  // (non-public) value on the server, so client calls simply skip it.
  const url = process.env.MONITORING_WEBHOOK_URL;
  if (url) {
    try {
      void fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Never let reporting throw.
    }
  }
}
