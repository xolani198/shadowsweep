import Stripe from "stripe";

// Server-side Stripe client. Lazily constructed so the app builds, tests, and
// runs the demo with NO Stripe keys configured. Every billing route degrades
// to a clear "not configured" response until test-mode keys are supplied.

let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!cached) {
    const config: Stripe.StripeConfig = {
      appInfo: { name: "ShadowSweep" },
      // Stripe automatically retries idempotent requests on transient failures.
      maxNetworkRetries: 2,
    };
    // Pin via env if you need a specific version; otherwise use the account default.
    if (process.env.STRIPE_API_VERSION) {
      config.apiVersion = process.env.STRIPE_API_VERSION as Stripe.StripeConfig["apiVersion"];
    }
    cached = new Stripe(key, config);
  }
  return cached;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export type PlanId = "starter" | "pro" | "enterprise";
export type Interval = "monthly" | "yearly";

export interface PlanCatalogEntry {
  id: PlanId;
  name: string;
  /** Enterprise is sales-led, with no self-serve checkout. */
  checkout: boolean;
}

export const PLAN_CATALOG: Record<PlanId, PlanCatalogEntry> = {
  starter: { id: "starter", name: "Starter", checkout: true },
  pro: { id: "pro", name: "Pro", checkout: true },
  enterprise: { id: "enterprise", name: "Enterprise", checkout: false },
};

/** Resolves the configured Stripe Price ID for a plan + billing interval. */
export function getPriceId(plan: PlanId, interval: Interval): string | null {
  const key = `STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}`;
  return process.env[key] || null;
}

export interface SubscriptionSummary {
  status: Stripe.Subscription.Status | "none";
  plan: string | null;
  currentPeriodEnd: number | null;
  cancelAtPeriodEnd: boolean;
}

/**
 * Best-effort subscription lookup by customer email. With no application
 * database, this queries Stripe directly. Returns null only when Stripe is
 * unconfigured or the lookup fails.
 */
export async function getSubscriptionForEmail(email: string): Promise<SubscriptionSummary | null> {
  const stripe = getStripe();
  if (!stripe) return null;

  try {
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0];
    if (!customer) {
      return { status: "none", plan: null, currentPeriodEnd: null, cancelAtPeriodEnd: false };
    }

    const subs = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      limit: 1,
    });
    const sub = subs.data[0];
    if (!sub) {
      return { status: "none", plan: null, currentPeriodEnd: null, cancelAtPeriodEnd: false };
    }

    const price = sub.items.data[0]?.price;
    const planName =
      (price?.nickname as string | undefined) ||
      (typeof price?.product === "string" ? null : (price?.product as Stripe.Product)?.name) ||
      null;

    return {
      status: sub.status,
      plan: planName,
      currentPeriodEnd: sub.current_period_end ?? null,
      cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
    };
  } catch {
    return null;
  }
}

/** Whether a subscription status grants access to paid features. */
export function isActiveStatus(status: SubscriptionSummary["status"]): boolean {
  return status === "active" || status === "trialing";
}
