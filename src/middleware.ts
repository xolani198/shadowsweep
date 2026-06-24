import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyEdgeSession, createEdgeSessionToken } from "@/lib/edgeSession";

const SESSION_COOKIE = "ss_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

/**
 * Gates the product surface (/dashboard/*).
 *
 * - With a valid signed session: pass through.
 * - In DEMO mode without one: silently mint a demo session so the public
 *   marketing demo is browsable, while the session machinery stays fully real.
 * - Otherwise: redirect to /auth, preserving the intended destination.
 *
 * The API routes are intentionally NOT matched here. They enforce their own
 * session checks, so an unauthenticated API call still fails closed.
 */
export async function middleware(req: NextRequest) {
  const secret = process.env.SESSION_SECRET;
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  const session = secret && token ? await verifyEdgeSession(token, secret) : null;
  if (session) return NextResponse.next();

  if (DEMO_MODE) {
    const res = NextResponse.next();
    if (secret) {
      const demoToken = await createEdgeSessionToken(
        { userId: "demo-user", orgId: "demo-org", email: "demo@shadowsweep.app", demo: true },
        secret
      );
      res.cookies.set(SESSION_COOKIE, demoToken, cookieOptions());
    }
    return res;
  }

  const url = req.nextUrl.clone();
  url.pathname = "/auth";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
