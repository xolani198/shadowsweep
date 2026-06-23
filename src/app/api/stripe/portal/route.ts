import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isSameOrigin } from "@/lib/security";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin request rejected" }, { status: 403 });
  }

  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Billing is not configured." }, { status: 503 });
  }

  if (!session.email) {
    return NextResponse.json({ error: "No billing account on file." }, { status: 400 });
  }

  const origin = new URL(request.url).origin;

  try {
    const customers = await stripe.customers.list({ email: session.email, limit: 1 });
    const customer = customers.data[0];
    if (!customer) {
      return NextResponse.json({ error: "No billing account found for this email." }, { status: 404 });
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${origin}/dashboard/billing`,
    });

    return NextResponse.json({ url: portal.url });
  } catch {
    return NextResponse.json({ error: "Could not open the billing portal." }, { status: 502 });
  }
}
