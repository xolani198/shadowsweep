import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, canPerformDestructiveActions } from "@/lib/auth";
import { rateLimit, clientKey } from "@/lib/rateLimit";
import { isSameOrigin } from "@/lib/security";
import { recordAudit, requestContext } from "@/lib/audit";
import { EMPLOYEES } from "@/lib/mockData";

export const runtime = "nodejs";

const undoSchema = z
  .object({
    employeeId: z.string().regex(/^emp-\d{3}$/, "employeeId must match emp-NNN"),
    auditLogId: z.string().uuid().optional(),
  })
  .strict();

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin request rejected" }, { status: 403 });
  }

  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canPerformDestructiveActions(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const limit = rateLimit(`offboard-undo:${clientKey(request)}`, 20, 60 * 1000);
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

  const parsed = undoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const employee = EMPLOYEES.find((e) => e.id === parsed.data.employeeId);
  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  const ctx = requestContext(request);
  const audit = recordAudit({
    action: "offboard_undo",
    actor: session.userId,
    org: session.orgId,
    targetType: "employee",
    targetId: employee.id,
    outcome: "success",
    ip: ctx.ip,
    userAgent: ctx.userAgent,
    metadata: { reversedAuditLogId: parsed.data.auditLogId ?? "unknown" },
  });

  return NextResponse.json({ ok: true, employeeId: employee.id, auditLogId: audit.id });
}
