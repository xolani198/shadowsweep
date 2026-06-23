// Edge-runtime session helpers. Next.js middleware runs on the Edge runtime,
// which exposes Web Crypto (crypto.subtle) rather than Node's `crypto`. These
// mirror the sign/verify scheme in lib/auth.ts so a token issued by either side
// validates on the other.

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

interface EdgeSession {
  userId: string;
  orgId: string;
  email?: string;
  demo?: boolean;
  exp?: number;
}

function base64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// crypto.subtle accepts a BufferSource; the cast sidesteps the stricter
// Uint8Array<ArrayBuffer> typing in recent TypeScript lib definitions.
function buf(bytes: Uint8Array): BufferSource {
  return bytes as unknown as BufferSource;
}

function base64urlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, buf(new TextEncoder().encode(payload)));
  return base64urlEncode(new Uint8Array(sig));
}

export async function createEdgeSessionToken(
  session: Omit<EdgeSession, "exp">,
  secret: string,
  maxAgeSeconds: number = SESSION_MAX_AGE_SECONDS
): Promise<string> {
  const withExp: EdgeSession = {
    ...session,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };
  const payload = base64urlEncode(new TextEncoder().encode(JSON.stringify(withExp)));
  return `${payload}.${await signPayload(payload, secret)}`;
}

/** Returns the verified session, or null if missing/forged/expired. */
export async function verifyEdgeSession(token: string, secret: string): Promise<EdgeSession | null> {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const key = await importKey(secret);
  let valid: boolean;
  try {
    valid = await crypto.subtle.verify(
      "HMAC",
      key,
      buf(base64urlToBytes(signature)),
      buf(new TextEncoder().encode(payload))
    );
  } catch {
    return null;
  }
  if (!valid) return null;

  try {
    const parsed = JSON.parse(new TextDecoder().decode(base64urlToBytes(payload))) as EdgeSession;
    if (typeof parsed.userId !== "string" || typeof parsed.orgId !== "string") return null;
    if (typeof parsed.exp === "number" && Date.now() / 1000 > parsed.exp) return null;
    return parsed;
  } catch {
    return null;
  }
}
