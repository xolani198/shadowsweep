import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "ss_session";

// Sessions are valid for 7 days. Real logins always stamp `exp`; the cookie's
// own Max-Age mirrors this so the browser drops it at the same time.
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/**
 * Session schema version. Bump whenever a claim becomes security-relevant so
 * older cookies stop validating instead of being silently reinterpreted.
 * Version 1 introduced the `role` claim: a pre-v1 cookie has no role, and
 * treating it as a viewer would leave existing users stuck on 403s. Rejecting
 * it instead means the session is cleanly re-issued (demo) or the user signs
 * in again.
 */
export const SESSION_VERSION = 1;

/**
 * Authorization roles. `admin` can perform destructive actions (revoke,
 * offboard); `viewer` is read-only. Least privilege: anything that is not
 * explicitly `admin` is treated as `viewer`.
 */
export type Role = "admin" | "viewer";

export interface Session {
  userId: string;
  orgId: string;
  email?: string;
  role: Role;
  /** Session schema version; sessions below SESSION_VERSION are rejected. */
  v?: number;
  /** Demo sessions (issued for the public marketing demo) are flagged. */
  demo?: boolean;
  /** Unix epoch seconds after which the session is invalid. */
  exp?: number;
}

/** Normalizes any value to a role, defaulting to the least-privileged viewer. */
function normalizeRole(value: unknown): Role {
  return value === "admin" ? "admin" : "viewer";
}

/** True when the session may perform destructive actions. */
export function canPerformDestructiveActions(session: Session | null): boolean {
  return session?.role === "admin";
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/**
 * Builds a signed session token: `<base64url(JSON)>.<base64url(HMAC-SHA256)>`.
 * Returns null when SESSION_SECRET is not configured.
 */
export function createSessionToken(
  session: Omit<Session, "exp" | "v">,
  maxAgeSeconds: number = SESSION_MAX_AGE_SECONDS
): string | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  const withExp: Session = {
    ...session,
    v: SESSION_VERSION,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };
  const payload = Buffer.from(JSON.stringify(withExp)).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

/** Cookie attributes for the session cookie. Secure in production only. */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

/**
 * Verifies the HMAC-signed session cookie and returns the session, or null.
 *
 * SESSION_SECRET is server-only. It must never carry the NEXT_PUBLIC_ prefix.
 * With no secret configured, every request is treated as unauthenticated
 * (secure by default) rather than letting requests through unverified.
 * Sessions carrying an `exp` claim are rejected once expired.
 */
export function getSession(): Session | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;

  const raw = cookies().get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;

  const given = Buffer.from(signature);
  const wanted = Buffer.from(sign(payload, secret));
  if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) return null;

  try {
    const parsed: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as Session).userId === "string" &&
      typeof (parsed as Session).orgId === "string"
    ) {
      const session = parsed as Session;
      if (typeof session.exp === "number" && Date.now() / 1000 > session.exp) {
        return null; // expired
      }
      if ((session.v ?? 0) < SESSION_VERSION) {
        return null; // outdated schema; force a clean re-issue
      }
      return {
        userId: session.userId,
        orgId: session.orgId,
        email: typeof session.email === "string" ? session.email : undefined,
        role: normalizeRole(session.role),
        v: session.v,
        demo: session.demo === true,
        exp: session.exp,
      };
    }
  } catch {
    // malformed payload is treated as no session
  }
  return null;
}
