import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { isSameOrigin } from "@/lib/security";
import { rateLimit, clientKey } from "@/lib/rateLimit";
import { getStripe, getPriceId, PLAN_CATALOG } from "@/lib/stripe";
import { BILLING_ENABLED } from "@/lib/config";

export const runtime = "nodejs";

const schema = z
  .object({
    plan: z.enum(["starter", "pro"]),
    interval: z.enum(["monthly", "yearly"]),
  })
  .strict();

export async function POST(request: Request) {
  // Billing is switched off: the product is free, so no checkout can start.
  if (!BILLING_ENABLED) {
    return NextResponse.json({ error: "Billing is disabled." }, { status: 404 });
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin request rejected" }, { status: 403 });
  }

  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = rateLimit(`checkout:${clientKey(request)}`, 10, 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  // Validate the request before checking server capability, so callers get a
  // precise 400 on bad input regardless of whether billing is configured.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!PLAN_CATALOG[parsed.data.plan].checkout) {
    return NextResponse.json({ error: "This plan is sales-led" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Billing is not configured yet. Set STRIPE_SECRET_KEY to enable checkout." },
      { status: 503 }
    );
  }

  const priceId = getPriceId(parsed.data.plan, parsed.data.interval);
  if (!priceId) {
    return NextResponse.json(
      { error: `No Stripe price configured for ${parsed.data.plan}/${parsed.data.interval}.` },
      { status: 503 }
    );
  }

  const origin = new URL(request.url).origin;

  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: session.email,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      client_reference_id: session.orgId,
      subscription_data: {
        metadata: { orgId: session.orgId, userId: session.userId, plan: parsed.data.plan },
      },
      metadata: { orgId: session.orgId, userId: session.userId, plan: parsed.data.plan },
      success_url: `${origin}/dashboard/billing?checkout=success`,
      cancel_url: `${origin}/dashboard/billing?checkout=cancelled`,
    });

    return NextResponse.json({ url: checkout.url });
  } catch {
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 502 });
  }
}
