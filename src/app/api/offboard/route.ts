import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, canPerformDestructiveActions } from "@/lib/auth";
import { rateLimit, clientKey } from "@/lib/rateLimit";
import { isSameOrigin } from "@/lib/security";
import { EMPLOYEES } from "@/lib/mockData";

export const runtime = "nodejs";

const offboardSchema = z
  .object({
    employeeId: z.string().regex(/^emp-\d{3}$/, "employeeId must match emp-NNN"),
    scope: z.enum(["shadow", "all"]).default("shadow"),
  })
  .strict();

export async function POST(request: Request) {
  // Reject obvious cross-site forgeries before doing any work.
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin request rejected" }, { status: 403 });
  }

  // Authorization gate runs before any body parsing.
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Re-check authorization server-side on every destructive call. Never trust
  // the client: only the admin role may revoke or offboard.
  if (!canPerformDestructiveActions(session)) {
    return NextResponse.json(
      { error: "Forbidden: the admin role is required to offboard." },
      { status: 403 }
    );
  }

  // Throttle: 20 offboard actions / minute / client.
  const limit = rateLimit(`offboard:${clientKey(request)}`, 20, 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Slow down." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = offboardSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const employee = EMPLOYEES.find((e) => e.id === parsed.data.employeeId);
  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  const apps =
    parsed.data.scope === "all"
      ? [...employee.shadowApps, ...employee.sanctionedApps]
      : employee.shadowApps;

  return NextResponse.json({
    ok: true,
    employeeId: employee.id,
    revokedApps: apps.map((a) => a.name),
    auditLogId: randomUUID(),
    actor: session.userId,
  });
}
