import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "ss_session";

export interface Session {
  userId: string;
  orgId: string;
}

/**
 * Verifies the HMAC-signed session cookie and returns the session, or null.
 *
 * Cookie format: `<base64url(JSON payload)>.<base64url(HMAC-SHA256 signature)>`.
 * SESSION_SECRET is server-only — it must never carry the NEXT_PUBLIC_ prefix.
 * With no secret configured, every request is treated as unauthenticated
 * (secure by default) rather than letting requests through unverified.
 */
export function getSession(): Session | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;

  const raw = cookies().get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;

  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const given = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) return null;

  try {
    const session: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (
      typeof session === "object" &&
      session !== null &&
      typeof (session as Session).userId === "string" &&
      typeof (session as Session).orgId === "string"
    ) {
      return { userId: (session as Session).userId, orgId: (session as Session).orgId };
    }
  } catch {
    // fall through — malformed payload is treated as no session
  }
  return null;
}
