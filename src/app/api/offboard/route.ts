import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { EMPLOYEES } from "@/lib/mockData";

const offboardSchema = z
  .object({
    employeeId: z.string().regex(/^emp-\d{3}$/, "employeeId must match emp-NNN"),
    scope: z.enum(["shadow", "all"]).default("shadow"),
  })
  .strict();

export async function POST(request: Request) {
  // Authorization gate runs before any body parsing.
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
