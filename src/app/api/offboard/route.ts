import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, canPerformDestructiveActions } from "@/lib/auth";
import { rateLimit, clientKey } from "@/lib/rateLimit";
import { isSameOrigin } from "@/lib/security";
import { recordAudit, requestContext } from "@/lib/audit";
import {
  getIdempotentResult,
  storeIdempotentResult,
  isValidIdempotencyKey,
} from "@/lib/idempotency";
import { EMPLOYEES } from "@/lib/mockData";

export const runtime = "nodejs";

const offboardSchema = z
  .object({
    employeeId: z.string().regex(/^emp-\d{3}$/, "employeeId must match emp-NNN"),
    scope: z.enum(["shadow", "all"]).default("shadow"),
    // When true, compute and return the impact without revoking anything.
    dryRun: z.boolean().optional().default(false),
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
    const ctx = requestContext(request);
    recordAudit({
      action: "authz_denied",
      actor: session.userId,
      org: session.orgId,
      targetType: "offboard",
      outcome: "denied",
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      metadata: { role: session.role },
    });
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

  const ctx = requestContext(request);

  // Dry run: preview the impact without revoking anything or consuming an
  // idempotency key. Returns enough detail for the UI to show what will change.
  if (parsed.data.dryRun) {
    recordAudit({
      action: "offboard_preview",
      actor: session.userId,
      org: session.orgId,
      targetType: "employee",
      targetId: employee.id,
      outcome: "success",
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      metadata: { scope: parsed.data.scope, appCount: apps.length },
    });
    return NextResponse.json({
      ok: true,
      dryRun: true,
      employeeId: employee.id,
      employeeName: employee.name,
      appCount: apps.length,
      monthlySpend: apps.reduce((sum, a) => sum + a.monthlySpend, 0),
      wouldRevoke: apps.map((a) => ({
        name: a.name,
        riskLevel: a.riskLevel,
        monthlySpend: a.monthlySpend,
        dataAccess: a.dataAccess,
      })),
    });
  }

  // Idempotency: an explicit key makes retries safe (no double execution).
  const idempotencyKey = request.headers.get("idempotency-key");
  if (idempotencyKey !== null) {
    if (!isValidIdempotencyKey(idempotencyKey)) {
      return NextResponse.json(
        { error: "Invalid Idempotency-Key (expected 8-200 chars of [A-Za-z0-9_-])." },
        { status: 400 }
      );
    }
    const cached = getIdempotentResult(session.userId, idempotencyKey);
    if (cached !== undefined) {
      return NextResponse.json(cached, { headers: { "Idempotent-Replay": "true" } });
    }
  }

  const audit = recordAudit({
    action: "offboard_execute",
    actor: session.userId,
    org: session.orgId,
    targetType: "employee",
    targetId: employee.id,
    outcome: "success",
    ip: ctx.ip,
    userAgent: ctx.userAgent,
    metadata: {
      scope: parsed.data.scope,
      revokedCount: apps.length,
      idempotencyKey: idempotencyKey ?? "none",
    },
  });

  const response = {
    ok: true,
    employeeId: employee.id,
    revokedApps: apps.map((a) => a.name),
    auditLogId: audit.id,
    actor: session.userId,
  };

  if (idempotencyKey !== null) {
    storeIdempotentResult(session.userId, idempotencyKey, response);
  }

  return NextResponse.json(response);
}
