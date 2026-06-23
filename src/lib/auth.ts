import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "ss_session";

// Sessions are valid for 7 days. Real logins always stamp `exp`; the cookie's
// own Max-Age mirrors this so the browser drops it at the same time.
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface Session {
  userId: string;
  orgId: string;
  email?: string;
  /** Demo sessions (issued for the public marketing demo) are flagged. */
  demo?: boolean;
  /** Unix epoch seconds after which the session is invalid. */
  exp?: number;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/**
 * Builds a signed session token: `<base64url(JSON)>.<base64url(HMAC-SHA256)>`.
 * Returns null when SESSION_SECRET is not configured.
 */
export function createSessionToken(
  session: Omit<Session, "exp">,
  maxAgeSeconds: number = SESSION_MAX_AGE_SECONDS
): string | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  const withExp: Session = {
    ...session,
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
 * SESSION_SECRET is server-only — it must never carry the NEXT_PUBLIC_ prefix.
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
      return {
        userId: session.userId,
        orgId: session.orgId,
        email: typeof session.email === "string" ? session.email : undefined,
        demo: session.demo === true,
        exp: session.exp,
      };
    }
  } catch {
    // malformed payload is treated as no session
  }
  return null;
}
