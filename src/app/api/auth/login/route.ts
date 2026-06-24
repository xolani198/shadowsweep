import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";
import { DEMO_MODE } from "@/lib/config";
import { rateLimit, clientKey } from "@/lib/rateLimit";
import { isSameOrigin } from "@/lib/security";

export const runtime = "nodejs";

const loginSchema = z.union([
  z.object({ mode: z.literal("demo") }).strict(),
  z
    .object({
      email: z.string().email().max(254),
      password: z.string().min(1).max(200),
    })
    .strict(),
]);

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin request rejected" }, { status: 403 });
  }

  // Throttle: 10 attempts / 5 min / client.
  const limit = rateLimit(`login:${clientKey(request)}`, 10, 5 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  if (!process.env.SESSION_SECRET) {
    return NextResponse.json(
      { error: "Authentication is not configured (missing SESSION_SECRET)." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  let token: string | null = null;

  if ("mode" in parsed.data) {
    // Demo sign-in, only available while the demo dataset is enabled.
    if (!DEMO_MODE) {
      return NextResponse.json({ error: "Demo sign-in is disabled" }, { status: 403 });
    }
    token = createSessionToken({
      userId: "demo-user",
      orgId: "demo-org",
      email: "demo@shadowsweep.app",
      demo: true,
    });
  } else {
    // Credential sign-in against the configured admin account.
    const adminEmail = process.env.AUTH_ADMIN_EMAIL;
    const adminPassword = process.env.AUTH_ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Credential sign-in is not configured." },
        { status: 503 }
      );
    }
    const emailOk = safeEqual(parsed.data.email.toLowerCase(), adminEmail.toLowerCase());
    const passwordOk = safeEqual(parsed.data.password, adminPassword);
    if (!emailOk || !passwordOk) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    token = createSessionToken({
      userId: "usr-admin",
      orgId: "org-acme",
      email: parsed.data.email,
      demo: false,
    });
  }

  if (!token) {
    return NextResponse.json({ error: "Could not establish a session." }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
