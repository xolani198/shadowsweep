import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isStripeConfigured, getSubscriptionForEmail } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json({ configured: false, status: "none", plan: null });
  }

  const summary = session.email ? await getSubscriptionForEmail(session.email) : null;
  return NextResponse.json({
    configured: true,
    status: summary?.status ?? "none",
    plan: summary?.plan ?? null,
    currentPeriodEnd: summary?.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: summary?.cancelAtPeriodEnd ?? false,
  });
}
