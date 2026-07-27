"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, CreditCard, ExternalLink, Sparkles } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { BILLING_ENABLED } from "@/lib/config";

type Interval = "monthly" | "yearly";

interface SubscriptionState {
  configured: boolean;
  status: string;
  plan: string | null;
  currentPeriodEnd?: number | null;
  cancelAtPeriodEnd?: boolean;
}

const PLANS = [
  {
    id: "starter" as const,
    name: "Starter",
    monthly: 15,
    yearly: 50,
    desc: "For lean IT teams getting started with shadow-IT visibility.",
    features: ["Up to 25 employees", "3 integrations", "Email alerts", "7-day history"],
    checkout: true,
    highlighted: false,
  },
  {
    id: "pro" as const,
    name: "Pro",
    monthly: 49,
    yearly: 149,
    desc: "Full-power auditing and automated offboarding for growing orgs.",
    features: [
      "Up to 200 employees",
      "Unlimited integrations",
      "One-click offboarding",
      "Compliance email templates",
      "90-day audit log",
    ],
    checkout: true,
    highlighted: true,
  },
  {
    id: "enterprise" as const,
    name: "Enterprise",
    monthly: 149,
    yearly: 499,
    desc: "Custom policies, SSO, and dedicated support at scale.",
    features: ["Unlimited employees", "SAML SSO", "Dedicated CSM", "SLA guarantee"],
    checkout: false,
    highlighted: false,
  },
];

const ACTIVE = new Set(["active", "trialing"]);

function statusBadge(status: string): { variant: "success" | "high" | "critical" | "neutral"; label: string } {
  if (status === "active") return { variant: "success", label: "Active" };
  if (status === "trialing") return { variant: "success", label: "Trialing" };
  if (status === "past_due" || status === "unpaid") return { variant: "high", label: "Past due" };
  if (status === "canceled") return { variant: "critical", label: "Canceled" };
  return { variant: "neutral", label: "No subscription" };
}

export default function BillingPage() {
  const { toast } = useToast();
  const [interval, setInterval] = useState<Interval>("monthly");
  const [sub, setSub] = useState<SubscriptionState | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  // Surface the checkout return state and load current subscription.
  useEffect(() => {
    if (!BILLING_ENABLED) return;
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get("checkout");
    if (checkout === "success") {
      toast({ variant: "success", title: "Subscription started", description: "Your plan is being activated." });
    } else if (checkout === "cancelled") {
      toast({ variant: "info", title: "Checkout cancelled", description: "No charge was made." });
    }
    const preselect = params.get("plan");
    if (preselect === "pro" || preselect === "starter") {
      // Just scroll attention; user confirms with the button.
    }

    fetch("/api/stripe/subscription")
      .then((r) => r.json())
      .then((d) => setSub(d))
      .catch(() => setSub({ configured: false, status: "none", plan: null }));
  }, [toast]);

  async function startCheckout(plan: "starter" | "pro") {
    setPending(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      toast({
        variant: "error",
        title: "Couldn't start checkout",
        description: data.error || "Please try again.",
      });
    } catch {
      toast({ variant: "error", title: "Network error", description: "Please try again." });
    }
    setPending(null);
  }

  async function openPortal() {
    setPending("portal");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      toast({ variant: "error", title: "Couldn't open billing portal", description: data.error || "Please try again." });
    } catch {
      toast({ variant: "error", title: "Network error", description: "Please try again." });
    }
    setPending(null);
  }

  const badge = sub ? statusBadge(sub.status) : null;
  const isActive = sub ? ACTIVE.has(sub.status) : false;
  const notConfigured = sub ? sub.configured === false : false;

  // Billing is switched off: everything is free, so show that plainly instead
  // of plans and checkout. The page stays reachable so a direct link never 404s.
  if (!BILLING_ENABLED) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Billing" subtitle="Plan and payment" />
        <div className="px-4 py-5 sm:px-6 max-w-3xl space-y-5">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)]">
                <CheckCircle2 size={18} className="text-[var(--color-accent)]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-bold text-[var(--color-text-primary)]">Free plan</p>
                  <Badge variant="success">Active</Badge>
                </div>
                <p className="mt-0.5 text-[13px] text-[var(--color-text-secondary)]">
                  Every feature is enabled. No card on file, nothing to pay.
                </p>
              </div>
            </div>

            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {[
                "Unlimited employees monitored",
                "All integrations",
                "One-click offboarding",
                "Compliance email templates",
                "Full audit log",
                "Security events and alerts",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-[var(--color-text-secondary)]">
                  <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0 text-[var(--color-accent)]" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[12.5px] text-[var(--color-text-muted)]">
            Paid plans are not enabled yet. If that changes, existing teams get notice first. See the{" "}
            <Link href="/legal/terms" className="text-[var(--color-accent)] hover:underline">
              terms
            </Link>{" "}
            for details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Billing" subtitle="Subscription & payment" />

      <div className="px-4 py-5 sm:px-6 max-w-4xl space-y-6">
        {/* Current subscription */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)]">
                <CreditCard size={18} className="text-[var(--color-accent)]" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[var(--color-text-primary)]">Current plan</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-[13px] text-[var(--color-text-secondary)]">
                    {sub?.plan || (isActive ? "Active plan" : "No active subscription")}
                  </span>
                  {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
                </div>
              </div>
            </div>
            {isActive && (
              <button
                onClick={openPortal}
                disabled={pending === "portal"}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-strong)] px-4 py-2 text-[13px] font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-60"
              >
                {pending === "portal" ? "Opening…" : "Manage billing"} <ExternalLink size={13} />
              </button>
            )}
          </div>

          {notConfigured && (
            <div className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-[12.5px] text-[var(--color-text-secondary)]">
              <span className="font-semibold text-[var(--color-text-primary)]">Billing is in setup.</span>{" "}
              Add your Stripe test-mode keys (<span className="font-mono-data">STRIPE_SECRET_KEY</span>,
              price IDs) to enable checkout. See <span className="font-mono-data">LAUNCH_CHECKLIST.md</span>.
            </div>
          )}
        </div>

        {/* Plans */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
              Plans
            </h2>
            <div className="flex items-center rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-0.5">
              {(["monthly", "yearly"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setInterval(b)}
                  className={`rounded-md px-3.5 py-1.5 text-[12px] font-semibold capitalize transition ${
                    interval === b
                      ? "bg-[var(--color-accent)] text-white"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col rounded-xl border bg-[var(--color-surface)] p-5"
                style={{ borderColor: plan.highlighted ? "var(--color-accent)" : "var(--color-border)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="micro-label !text-[var(--color-accent)]">{plan.name}</span>
                  {plan.highlighted && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-white">
                      <Sparkles size={9} /> Popular
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-end gap-1">
                  <span className="font-mono-data text-[28px] font-semibold leading-none">
                    ${interval === "monthly" ? plan.monthly : plan.yearly}
                  </span>
                  <span className="mb-0.5 text-[12px] text-[var(--color-text-muted)]">
                    /{interval === "monthly" ? "mo" : "yr"}
                  </span>
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--color-text-secondary)]">{plan.desc}</p>
                <ul className="my-4 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[12.5px] text-[var(--color-text-secondary)]">
                      <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0 text-[var(--color-accent)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.checkout ? (
                  <button
                    onClick={() => startCheckout(plan.id as "starter" | "pro")}
                    disabled={pending !== null || notConfigured}
                    title={notConfigured ? "Billing not configured yet" : undefined}
                    className={`mt-auto rounded-lg py-2.5 text-center text-[13px] font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.highlighted
                        ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
                        : "border border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                    }`}
                  >
                    {pending === plan.id ? "Redirecting…" : isActive ? "Switch to this plan" : "Start free trial"}
                  </button>
                ) : (
                  <a
                    href="mailto:sales@shadowsweep.app?subject=ShadowSweep%20Enterprise"
                    className="mt-auto rounded-lg border border-[var(--color-border-strong)] py-2.5 text-center text-[13px] font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  >
                    Contact sales
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11.5px] text-[var(--color-text-muted)]">
          Payments are processed securely by Stripe. Manage or cancel anytime from the billing portal.
          See our <a className="text-[var(--color-accent)] hover:underline" href="/legal/refund">refund policy</a>.
        </p>
      </div>
    </div>
  );
}
