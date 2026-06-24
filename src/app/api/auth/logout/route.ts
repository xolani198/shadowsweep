import { NextResponse } from "next/server";
import { SESSION_COOKIE, getSession } from "@/lib/auth";
import { isSameOrigin } from "@/lib/security";
import { recordAudit, requestContext } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin request rejected" }, { status: 403 });
  }

  const session = getSession();
  if (session) {
    const ctx = requestContext(request);
    recordAudit({
      action: "logout",
      actor: session.userId,
      org: session.orgId,
      outcome: "success",
      ip: ctx.ip,
      userAgent: ctx.userAgent,
    });
  }

  const res = NextResponse.json({ ok: true });
  // Expire the session cookie immediately.
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
