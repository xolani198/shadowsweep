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
  ChevronRight,
} from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";

const FEATURES = [
  {
    icon: Search,
    title: "Instant App Discovery",
    desc: "Connect Google Workspace, Microsoft 365, Ramp, and Brex to automatically surface every unauthorized SaaS tool in minutes.",
    stat: "12 min",
    statLabel: "avg. discovery",
  },
  {
    icon: TrendingDown,
    title: "Shadow Spend Forensics",
    desc: "Pinpoint exactly how much waste each unauthorized app is burning. Real dollar figures, per employee, per month.",
    stat: "$4.2M",
    statLabel: "recovered",
  },
  {
    icon: Zap,
    title: "One-Click Offboarding",
    desc: "Revoke all shadow IT access for any departing employee in a single click, with auto-generated GDPR/CCPA compliance email templates.",
    stat: "7 steps",
    statLabel: "automated",
  },
  {
    icon: Lock,
    title: "Continuous Risk Monitoring",
    desc: "Real-time risk scoring and alerts when employees connect new apps with sensitive data scopes — before a breach happens.",
    stat: "24/7",
    statLabel: "monitoring",
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
  { value: "500+",  label: "IT teams protected" },
  { value: "$4.2M", label: "Shadow spend recovered" },
  { value: "12 min",label: "Avg. discovery time" },
  { value: "99.9%", label: "Uptime SLA" },
];

export default function LandingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <nav
        className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between px-6"
        style={{
          background: "rgba(10,25,41,0.97)",
          borderBottom: "1px solid rgba(56,189,248,0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "#38BDF8" }}>
            <Shield size={13} strokeWidth={2.5} style={{ color: "#0A1929" }} />
          </div>
          <span className="text-[15px] font-extrabold tracking-tight text-white">
            Shadow<span style={{ color: "#38BDF8" }}>Sweep</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "Features", href: "#features" },
            { label: "Pricing",  href: "#pricing" },
            { label: "Demo",     href: "/dashboard" },
          ].map(({ label, href }) => (
            <a key={label} href={href} className="text-[13px] font-medium text-slate-400 transition hover:text-white">
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/auth"
            className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-[13px] font-semibold text-[#0A1929] transition hover:opacity-90"
            style={{ background: "#38BDF8" }}
          >
            Sign in <ChevronRight size={13} />
          </Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden px-6 pt-36 pb-28 text-center"
        style={{ background: "#0A1929" }}
      >
        {/* Dot-grid texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(56,189,248,0.15) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-28"
          style={{ background: "linear-gradient(to bottom, transparent, #0A1929)" }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[12px] font-semibold"
            style={{ borderColor: "rgba(56,189,248,0.4)", color: "#38BDF8", background: "rgba(56,189,248,0.08)" }}
          >
            <Zap size={11} fill="currentColor" />
            AI-powered risk scoring — now live
          </div>

          <h1 className="mx-auto max-w-4xl text-[52px] font-extrabold leading-[1.08] tracking-tight text-white md:text-[68px]">
            Kill Shadow IT.{" "}
            <span
              className="block"
              style={{
                background: "linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Before It Kills You.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-slate-400">
            ShadowSweep connects to your identity, spend, and billing tools to discover
            every unauthorized SaaS app in your org — and lets you revoke all access in one click.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-[14px] font-bold text-[#0A1929] transition hover:opacity-90"
              style={{ background: "#38BDF8", boxShadow: "0 0 24px rgba(56,189,248,0.30)" }}
            >
              Get started free <ArrowRight size={16} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border px-7 py-3.5 text-[14px] font-semibold text-white transition hover:border-sky-400"
              style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)" }}
            >
              View live demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────────────────── */}
      <section style={{ background: "#0F2D52", borderTop: "1px solid rgba(56,189,248,0.15)", borderBottom: "1px solid rgba(56,189,248,0.15)" }}>
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-around gap-8 px-6 py-8">
          {STATS.map(({ value, label }) => (
            <div key={value} className="flex flex-col items-center gap-1 text-center">
              <span className="font-mono-data text-[28px] font-extrabold text-white">{value}</span>
              <span className="text-[12px] font-medium text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-3 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-accent)]">
            Platform capabilities
          </span>
        </div>
        <h2 className="mb-12 text-center text-[30px] font-extrabold tracking-tight text-[var(--color-text-primary)]">
          Everything you need to own your SaaS stack
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, desc, stat, statLabel }) => (
            <div
              key={title}
              className="group flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-200 hover:border-[var(--color-accent)] hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: "var(--color-accent-subtle)" }}
                >
                  <Icon size={18} style={{ color: "var(--color-accent)" }} />
                </div>
                <div className="text-right">
                  <p className="font-mono-data text-[20px] font-extrabold" style={{ color: "var(--color-accent)" }}>
                    {stat}
                  </p>
                  <p className="text-[10.5px] font-medium text-[var(--color-text-muted)]">{statLabel}</p>
                </div>
              </div>
              <div>
                <h3 className="mb-1.5 text-[15px] font-bold text-[var(--color-text-primary)]">{title}</h3>
                <p className="text-[13px] leading-relaxed text-[var(--color-text-secondary)]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section id="pricing" className="mx-auto max-w-5xl px-6 pb-28">
        <div className="mb-3 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-accent)]">
            Pricing
          </span>
        </div>
        <h2 className="mb-8 text-center text-[30px] font-extrabold tracking-tight text-[var(--color-text-primary)]">
          Simple, transparent pricing
        </h2>

        {/* Billing toggle */}
        <div className="mb-10 flex justify-center">
          <div className="flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
            {(["monthly", "yearly"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className="flex items-center gap-2 rounded-lg px-5 py-2 text-[13px] font-semibold transition"
                style={{
                  background: billing === b ? "var(--color-accent)" : "transparent",
                  color:      billing === b ? "#fff" : "var(--color-text-secondary)",
                }}
              >
                {b === "yearly" ? "Yearly" : "Monthly"}
                {b === "yearly" && (
                  <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[9.5px] font-bold text-white">
                    SAVE 66%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="relative flex flex-col rounded-2xl p-6 transition-all"
              style={
                plan.highlighted
                  ? { background: "#0A1929", border: "2px solid #38BDF8", boxShadow: "0 0 32px rgba(56,189,248,0.20)" }
                  : { background: "var(--color-surface)", border: "1px solid var(--color-border)" }
              }
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-[10.5px] font-bold tracking-wide"
                  style={{ background: "#38BDF8", color: "#0A1929" }}
                >
                  MOST POPULAR
                </div>
              )}

              <p
                className="text-[11px] font-bold uppercase tracking-[0.15em]"
                style={{ color: plan.highlighted ? "#38BDF8" : "var(--color-accent)" }}
              >
                {plan.name}
              </p>

              <div className="mt-3 flex items-end gap-1">
                <span
                  key={billing}
                  className="font-mono-data text-[38px] font-extrabold leading-none animate-fade-in"
                  style={{ color: plan.highlighted ? "#fff" : "var(--color-text-primary)" }}
                >
                  ${billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span
                  className="mb-1.5 text-[13px]"
                  style={{ color: plan.highlighted ? "rgba(255,255,255,0.4)" : "var(--color-text-muted)" }}
                >
                  /{billing === "monthly" ? "mo" : "yr"}
                </span>
              </div>

              <p
                className="mt-2 text-[12.5px] leading-relaxed"
                style={{ color: plan.highlighted ? "rgba(255,255,255,0.55)" : "var(--color-text-secondary)" }}
              >
                {plan.desc}
              </p>

              <ul className="my-5 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px]">
                    <CheckCircle2
                      size={14}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: plan.highlighted ? "#38BDF8" : "var(--color-accent)" }}
                    />
                    <span style={{ color: plan.highlighted ? "rgba(255,255,255,0.75)" : "var(--color-text-secondary)" }}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth"
                className="mt-auto block rounded-xl py-3 text-center text-[13.5px] font-bold transition hover:opacity-90"
                style={
                  plan.highlighted
                    ? { background: "#38BDF8", color: "#0A1929" }
                    : { border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        className="border-t px-6 py-10 text-center"
        style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
      >
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "var(--color-accent)" }}>
            <Shield size={13} strokeWidth={2.5} className="text-white" />
          </div>
          <span className="text-[14px] font-extrabold text-[var(--color-text-primary)]">
            Shadow<span style={{ color: "var(--color-accent)" }}>Sweep</span>
          </span>
        </div>
        <p className="text-[12px] text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} ShadowSweep · Built for IT Managers who ship fast and audit faster.
        </p>
      </footer>
    </div>
  );
}
