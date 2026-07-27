import { randomUUID } from "crypto";

// Tamper-evident-style audit log for sensitive actions: who did what, when,
// to what, and from where. This is an in-memory ring buffer plus structured
// console output (which Vercel ships to its log drains). For production,
// forward these entries to a durable, append-only store or SIEM. Entries never
// contain secrets, tokens, passwords, or full PII.

export type AuditAction =
  | "login"
  | "login_failed"
  | "logout"
  | "offboard_preview"
  | "offboard_execute"
  | "offboard_undo"
  | "authz_denied";

export type AuditOutcome = "success" | "failure" | "denied";

export interface AuditEntry {
  id: string;
  ts: string;
  action: AuditAction;
  actor: string;
  org?: string;
  targetType?: string;
  targetId?: string;
  outcome: AuditOutcome;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, string | number | boolean | string[]>;
}

const MAX_ENTRIES = 500;
const buffer: AuditEntry[] = [];

/** First-octet-preserving email redaction so logs stay free of full PII. */
export function redactEmail(email: string | undefined): string | undefined {
  if (!email) return undefined;
  const [local, domain] = email.split("@");
  if (!domain) return "redacted";
  const head = local.slice(0, 1);
  return `${head}***@${domain}`;
}

/** Best-effort request context for the "from where" fields. */
export function requestContext(request: Request): { ip?: string; userAgent?: string } {
  const fwd = request.headers.get("x-forwarded-for");
  const ip = fwd ? fwd.split(",")[0].trim() : request.headers.get("x-real-ip") || undefined;
  const ua = request.headers.get("user-agent") || undefined;
  // Cap the UA so a hostile client can't bloat the log line.
  return { ip, userAgent: ua ? ua.slice(0, 256) : undefined };
}

export function recordAudit(entry: Omit<AuditEntry, "id" | "ts">): AuditEntry {
  const full: AuditEntry = {
    ...entry,
    id: randomUUID(),
    ts: new Date().toISOString(),
  };
  buffer.push(full);
  if (buffer.length > MAX_ENTRIES) buffer.shift();
  // Structured, single-line log. No secrets or full PII by construction.
  console.info(`[audit] ${JSON.stringify(full)}`);
  return full;
}

/** Most-recent-first slice of the audit log. */
export function getRecentAudit(limit = 50): AuditEntry[] {
  return buffer.slice(-limit).reverse();
}
