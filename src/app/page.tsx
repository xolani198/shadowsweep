"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Search,
  Zap,
  Lock,
  TrendingDown,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Badge from "@/components/ui/Badge";
import { DISCOVERY_ROWS } from "@/lib/mockData";

const FEATURES = [
  {
    n: "01",
    icon: Search,
    title: "Instant App Discovery",
    desc: "Connect Google Workspace, Microsoft 365, Ramp, and Brex to surface every unauthorized SaaS tool across the organization in minutes.",
  },
  {
    n: "02",
    icon: TrendingDown,
    title: "Shadow Spend Forensics",
    desc: "Pinpoint exactly how much waste each unauthorized app is burning. Real dollar figures, per employee, per month.",
  },
  {
    n: "03",
    icon: Zap,
    title: "One-Click Offboarding",
    desc: "Revoke all shadow IT access for any departing employee in a single click, with auto-generated GDPR/CCPA compliance email templates.",
  },
  {
    n: "04",
    icon: Lock,
    title: "Continuous Risk Monitoring",
    desc: "Real-time risk scoring and alerts when employees connect new apps with sensitive data scopes — before a breach happens.",
  },
];

const PLANS = [
  {
    name: "Starter",
    monthlyPrice: 15,
    yearlyPrice: 50,
    desc: "For lean IT teams getting started with Shadow IT visibility.",
    features: ["Up to 25 employees", "3 integrations", "Email alerts", "7-day history"],
    highlighted: false,
    cta: "Start free trial",
  },
  {
    name: "Pro",
    monthlyPrice: 49,
    yearlyPrice: 149,
    desc: "Full-power auditing and automated offboarding for growing orgs.",
    features: [
      "Up to 200 employees",
      "Unlimited integrations",
      "One-click offboarding",
      "Compliance email templates",
      "Slack & Teams alerts",
      "90-day audit log",
    ],
    highlighted: true,
    cta: "Start free trial",
  },
  {
    name: "Enterprise",
    monthlyPrice: 149,
    yearlyPrice: 499,
    desc: "Custom policies, SSO, and dedicated support at scale.",
    features: [
      "Unlimited employees",
      "Custom integrations",
      "SAML SSO",
      "Dedicated CSM",
      "SLA guarantee",
      "Unlimited history",
    ],
    highlighted: false,
    cta: "Contact sales",
  },
];

const STATS = [
  { value: "500+",   label: "IT teams protected" },
  { value: "$4.2M",  label: "Shadow spend recovered" },
  { value: "12 min", label: "Avg. discovery time" },
  { value: "99.9%",  label: "Uptime SLA" },
];

const PREVIEW_ROWS = [...DISCOVERY_ROWS]
  .sort((a, b) => b.monthlySpend - a.monthlySpend)
  .slice(0, 5);

export default function LandingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">

      {/* ── Navbar — white, hairline border ─────────────────────────────── */}
      <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 px-6 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-nav-bg)]">
            <Shield size={13} strokeWidth={2.5} className="text-white" />
          </div>
          <span className="text-[14.5px] font-bold tracking-tight">
            Shadow<span className="text-[var(--color-accent)]">Sweep</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-7">
          {[
            { label: "Platform", href: "#features" },
            { label: "Pricing",  href: "#pricing" },
            { label: "Live demo", href: "/dashboard" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-[13px] font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/auth"
            className="rounded-md bg-[var(--color-accent)] px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* ── Hero — crisp white, type-led ────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pt-32 pb-16">
        <div className="max-w-2xl">
          <p className="micro-label mb-4 !text-[var(--color-accent)]">
            Shadow IT governance platform
          </p>
          <h1 className="text-[40px] font-bold leading-[1.12] tracking-tight md:text-[52px]">
            Every unauthorized app in your org.
            <br />
            Found, priced, and revocable.
          </h1>
          <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-[var(--color-text-secondary)]">
            ShadowSweep connects to your identity, spend, and billing systems to give IT
            complete visibility over unsanctioned SaaS — and one-click offboarding when
            people leave.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent)] px-6 py-3 text-[13.5px] font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
            >
              Get started free <ArrowRight size={15} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border-strong)] px-6 py-3 text-[13.5px] font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              View live demo
            </Link>
          </div>
        </div>

        {/* Product proof — a real discovery table, not a screenshot */}
        <div className="mt-14 overflow-hidden rounded-lg border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2.5">
            <span className="micro-label">Live discovery feed — Acme Corp</span>
            <span className="font-mono-data text-[11px] text-[var(--color-text-muted)]">
              {DISCOVERY_ROWS.length} unsanctioned apps detected
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {["Application", "Employee", "Detected via", "Monthly", "Risk"].map((h) => (
                    <th key={h} className="micro-label whitespace-nowrap px-4 py-2.5 font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {PREVIEW_ROWS.map((row) => (
                  <tr key={row.id} className="bg-[var(--color-surface)]">
                    <td className="whitespace-nowrap px-4 py-3 text-[13px] font-semibold">
                      {row.appName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[13px] text-[var(--color-text-secondary)]">
                      {row.employeeName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono-data text-[12px] text-[var(--color-text-muted)]">
                      {row.discoveredVia}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono-data text-[13px] font-semibold">
                      ${row.monthlySpend}/mo
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge variant={row.riskLevel}>{row.riskLevel}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Stats band — structural navy, hairline rules ────────────────── */}
      <section style={{ background: "var(--color-nav-bg)" }}>
        <div className="mx-auto grid max-w-5xl grid-cols-2 md:grid-cols-4">
          {STATS.map(({ value, label }, i) => (
            <div
              key={value}
              className="flex flex-col gap-1 px-6 py-8"
              style={{ borderLeft: i > 0 ? "1px solid var(--color-nav-border)" : "none" }}
            >
              <span className="font-mono-data text-[26px] font-semibold text-white">{value}</span>
              <span className="text-[12px]" style={{ color: "var(--color-nav-text)" }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features — numbered grid, shared hairlines ──────────────────── */}
      <section id="features" className="mx-auto max-w-5xl px-6 py-20">
        <p className="micro-label mb-3 !text-[var(--color-accent)]">Platform capabilities</p>
        <h2 className="mb-10 max-w-lg text-[28px] font-bold leading-tight tracking-tight">
          Everything you need to own your SaaS stack
        </h2>
        <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2">
          {FEATURES.map(({ n, icon: Icon, title, desc }) => (
            <div key={n} className="bg-[var(--color-surface)] p-7">
              <div className="mb-5 flex items-center justify-between">
                <Icon size={17} className="text-[var(--color-accent)]" strokeWidth={1.75} />
                <span className="font-mono-data text-[12px] font-medium text-[var(--color-text-muted)]">{n}</span>
              </div>
              <h3 className="mb-2 text-[15px] font-bold">{title}</h3>
              <p className="text-[13px] leading-relaxed text-[var(--color-text-secondary)]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing — structured columns ────────────────────────────────── */}
      <section id="pricing" className="mx-auto max-w-5xl px-6 pb-24">
        <p className="micro-label mb-3 !text-[var(--color-accent)]">Pricing</p>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-[28px] font-bold leading-tight tracking-tight">
            Simple, transparent pricing
          </h2>
          {/* Segmented billing control */}
          <div className="flex items-center rounded-md border border-[var(--color-border-strong)] p-0.5">
            {(["monthly", "yearly"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={`flex items-center gap-2 rounded px-4 py-1.5 text-[12.5px] font-semibold transition ${
                  billing === b
                    ? "bg-[var(--color-accent)] text-white"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {b === "yearly" ? "Yearly" : "Monthly"}
                {b === "yearly" && (
                  <span className={`text-[10px] font-bold ${billing === b ? "text-white/80" : "text-[var(--color-success)]"}`}>
                    −66%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-3">
          {PLANS.map((plan) => (
            <div key={plan.name} className="flex flex-col bg-[var(--color-surface)]">
              {/* Plan header band */}
              <div
                className="border-b border-[var(--color-border)] px-6 py-4"
                style={plan.highlighted ? { background: "var(--color-nav-bg)" } : undefined}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="micro-label"
                    style={plan.highlighted ? { color: "var(--color-nav-accent)" } : { color: "var(--color-accent)" }}
                  >
                    {plan.name}
                  </span>
                  {plan.highlighted && (
                    <span className="micro-label" style={{ color: "var(--color-nav-text)" }}>
                      Recommended
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-end gap-1">
                  <span
                    key={billing}
                    className="font-mono-data animate-fade-in text-[32px] font-semibold leading-none"
                    style={plan.highlighted ? { color: "#FFFFFF" } : undefined}
                  >
                    ${billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span
                    className="mb-0.5 text-[12.5px]"
                    style={{ color: plan.highlighted ? "var(--color-nav-text)" : "var(--color-text-muted)" }}
                  >
                    /{billing === "monthly" ? "mo" : "yr"}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="text-[12.5px] leading-relaxed text-[var(--color-text-secondary)]">{plan.desc}</p>
                <ul className="my-5 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-[var(--color-text-secondary)]">
                      <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-[var(--color-accent)]" strokeWidth={2} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth"
                  className={`mt-auto block rounded-md py-2.5 text-center text-[13px] font-semibold transition ${
                    plan.highlighted
                      ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
                      : "border border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer — structural navy ────────────────────────────────────── */}
      <footer style={{ background: "var(--color-nav-bg)", borderTop: "1px solid var(--color-nav-border)" }}>
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-6 w-6 items-center justify-center rounded"
              style={{ background: "var(--color-nav-accent)" }}
            >
              <Shield size={12} strokeWidth={2.5} style={{ color: "#081A33" }} />
            </div>
            <span className="text-[13px] font-bold text-white">
              Shadow<span style={{ color: "var(--color-nav-accent)" }}>Sweep</span>
            </span>
          </div>
          <p className="text-[12px]" style={{ color: "var(--color-nav-text)" }}>
            © {new Date().getFullYear()} ShadowSweep · SOC 2 Type II · GDPR & CCPA ready
          </p>
        </div>
      </footer>
    </div>
  );
}
