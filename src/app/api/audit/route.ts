import { NextResponse } from "next/server";
import { getSession, canPerformDestructiveActions } from "@/lib/auth";
import { getRecentAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Audit trail is admin-only.
  if (!canPerformDestructiveActions(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ entries: getRecentAudit(50) });
}
