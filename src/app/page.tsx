// FILE: src/app/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Search,
  Zap,
  Lock,
  TrendingDown,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";

const FEATURES = [
  {
    icon: Search,
    title: "Instant App Discovery",
    desc: "Connect Google Workspace, Microsoft 365, Ramp, and Brex to automatically surface every unauthorized SaaS tool in minutes.",
  },
  {
    icon: TrendingDown,
    title: "Shadow Spend Forensics",
    desc: "Pinpoint exactly how much waste each unauthorized app is burning. Real dollar figures, per employee.",
  },
  {
    icon: Zap,
    title: "One-Click Offboarding",
    desc: "Revoke all shadow IT access for any departing employee in a single click, with auto-generated compliance email templates.",
  },
  {
    icon: Lock,
    title: "Continuous Risk Monitoring",
    desc: "Real-time risk scoring and alerts when employees connect new apps with sensitive data scopes.",
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

export default function LandingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 px-6 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent)]">
            <Shield size={14} className="text-white" />
          </div>
          <span className="text-[15px] font-bold tracking-tight">
            Shadow<span className="text-[var(--color-accent)]">Sweep</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/auth"
            className="rounded-lg bg-[var(--color-accent)] px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center px-6 pt-36 pb-24 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent-subtle)] px-4 py-1.5 text-[12px] font-semibold text-[var(--color-accent)]">
          <Zap size={12} />
          Now with AI-powered risk scoring
        </div>
        <h1 className="mx-auto max-w-3xl text-[48px] font-extrabold leading-tight tracking-tight md:text-[64px]">
          Kill Shadow IT.{" "}
          <span className="text-[var(--color-accent)]">Before It Kills You.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-[var(--color-text-secondary)]">
          ShadowSweep connects to your identity, spend, and billing tools to discover
          every unauthorized SaaS app in your org — and lets you revoke all access in
          one click.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3 text-[14px] font-bold text-white shadow-purple-glow transition hover:bg-[var(--color-accent-hover)]"
          >
            Get started free <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-[14px] font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)]"
          >
            View live demo
          </Link>
        </div>

        {/* Trust stat strip */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-[13px] text-[var(--color-text-muted)]">
          {[
            ["500+", "IT teams protected"],
            ["$4.2M", "Shadow spend recovered"],
            ["12 min", "Avg. discovery time"],
          ].map(([stat, label]) => (
            <div key={stat} className="flex flex-col items-center gap-0.5">
              <span className="text-[22px] font-extrabold text-[var(--color-text-primary)]">{stat}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <h2 className="mb-10 text-center text-[28px] font-bold">
          Everything you need to own your SaaS stack
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-accent)]/50"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent-subtle)]">
                <Icon size={20} className="text-[var(--color-accent)]" />
              </div>
              <h3 className="mb-1.5 text-[15px] font-bold">{title}</h3>
              <p className="text-[13.5px] leading-relaxed text-[var(--color-text-secondary)]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-28" id="pricing">
        <div className="mb-8 flex flex-col items-center gap-4">
          <h2 className="text-[28px] font-bold">Simple, transparent pricing</h2>
          {/* Billing toggle */}
          <div className="flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition ${
                billing === "monthly"
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold transition ${
                billing === "yearly"
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              Yearly
              <span className="rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white">
                BEST VALUE
              </span>
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-6 transition ${
                plan.highlighted
                  ? "border-[var(--color-accent)] shadow-purple-glow bg-[var(--color-surface)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)]"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-accent)] px-4 py-1 text-[11px] font-bold text-white tracking-wide">
                  MOST POPULAR
                </div>
              )}
              <p className="text-[13px] font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                {plan.name}
              </p>
              <div className="mt-2 flex items-end gap-1">
                <span key={billing} className="font-mono-data text-[36px] font-extrabold leading-none text-[var(--color-text-primary)] animate-fade-in">
                  ${billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span className="mb-1 text-[13px] text-[var(--color-text-muted)]">
                  /{billing === "monthly" ? "mo" : "yr"}
                </span>
              </div>
              <p className="mt-2 text-[12.5px] text-[var(--color-text-secondary)]">{plan.desc}</p>
              <ul className="my-5 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px]">
                    <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-[var(--color-accent)]" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth"
                className={`mt-auto block rounded-xl py-2.5 text-center text-[13.5px] font-bold transition ${
                  plan.highlighted
                    ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-purple-glow-sm"
                    : "border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--color-border)] px-6 py-8 text-center text-[12px] text-[var(--color-text-muted)]">
        © {new Date().getFullYear()} ShadowSweep · Built for IT Managers who ship fast and audit faster.
      </footer>
    </div>
  );
}
