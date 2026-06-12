"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Search,
  Zap,
  Lock,
  TrendingDown,
  CheckCircle2,
  ArrowRight,
  Play,
  Users,
  Timer,
  Globe,
  DollarSign,
  Radar,
  FileCheck,
  ShieldCheck,
  Headphones,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Bell,
  Settings,
  Boxes,
  Aperture,
  Cloud,
  Compass,
  Feather,
} from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";

/* ── Content ─────────────────────────────────────────────────────────────── */

const SERVICES = [
  {
    icon: Search,
    title: "Instant App Discovery",
    desc: "Connect identity, spend, and billing systems to surface every unauthorized SaaS tool in minutes.",
  },
  {
    icon: TrendingDown,
    title: "Spend Forensics",
    desc: "Pinpoint exactly how much waste each shadow app is burning — real dollar figures, per employee.",
  },
  {
    icon: Zap,
    title: "One-Click Offboarding",
    desc: "Revoke all shadow IT access for departing employees with auto-generated compliance templates.",
  },
  {
    icon: Lock,
    title: "Continuous Monitoring",
    desc: "Real-time risk scoring and alerts when employees connect new apps with sensitive data scopes.",
  },
];

const STATS = [
  { icon: Users,      value: "500+",   label: "IT teams protected" },
  { icon: DollarSign, value: "$4.2M",  label: "Shadow spend recovered" },
  { icon: Timer,      value: "12 min", label: "Avg. discovery time" },
  { icon: Globe,      value: "99.9%",  label: "Uptime delivered" },
];

const WHY_US = [
  {
    icon: Radar,
    title: "Expert-Grade Discovery",
    desc: "OAuth grants, card statements, and billing data correlated automatically.",
  },
  {
    icon: FileCheck,
    title: "Compliance Built-In",
    desc: "GDPR Article 17 and CCPA deletion templates generated for every offboarding.",
  },
  {
    icon: ShieldCheck,
    title: "SOC 2 & GDPR Ready",
    desc: "Hardened security headers, signed sessions, and full audit logging.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "A named CSM and same-day response on every enterprise plan.",
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

const TRUSTED_BY = [
  { icon: Boxes,    name: "Altivon" },
  { icon: Aperture, name: "Pinnacle" },
  { icon: Cloud,    name: "CloudSphere" },
  { icon: Compass,  name: "Vertexa" },
  { icon: Feather,  name: "BrightPath" },
];

/* ── Motion presets — restrained, easing out, run once ───────────────────── */

const sectionReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

/* ── Hero dashboard mockup (pure HTML, no screenshot) ────────────────────── */

function DashboardMockup() {
  const MOCK_NAV = [
    { icon: LayoutDashboard, label: "Overview", active: true },
    { icon: Search,          label: "Discovery" },
    { icon: Users,           label: "Employees" },
    { icon: Bell,            label: "Alerts" },
    { icon: Settings,        label: "Settings" },
  ];
  const ACTIVITY = [
    { dot: "#DC2626", text: "Mailchimp detected — critical",   time: "2m" },
    { dot: "#1D63ED", text: "Cloudflare tokens revoked",        time: "15m" },
    { dot: "#067647", text: "Audit log updated",                time: "1h" },
    { dot: "#B54708", text: "Spend anomaly: +34% this month",   time: "2h" },
  ];
  const BARS = [38, 52, 44, 60, 48, 72, 64, 80, 70, 88];

  return (
    <div aria-hidden className="flex overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-md">
      {/* Mock sidebar */}
      <div className="hidden w-36 flex-shrink-0 flex-col gap-0.5 p-2.5 sm:flex" style={{ background: "#081A33" }}>
        <div className="mb-2 flex items-center gap-1.5 px-1.5 py-1.5">
          <div className="flex h-4 w-4 items-center justify-center rounded" style={{ background: "#2D6BEF" }}>
            <Shield size={9} className="text-white" />
          </div>
          <span className="text-[9px] font-bold text-white">ShadowSweep</span>
        </div>
        {MOCK_NAV.map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5"
            style={active ? { background: "#2D6BEF" } : undefined}
          >
            <Icon size={9} style={{ color: active ? "#fff" : "#8CA3C4" }} />
            <span className="text-[8.5px] font-medium" style={{ color: active ? "#fff" : "#8CA3C4" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Mock main panel */}
      <div className="flex-1 bg-[#F6F8FB] p-3">
        <div className="mb-2.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#0B1F3A]">Welcome back, Alex</p>
            <p className="text-[7.5px] text-[#7186A0]">Here&apos;s what changed in your SaaS stack today.</p>
          </div>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#081A33] text-[7px] font-bold text-white">
            AM
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Vulnerability ring */}
          <div className="rounded-lg border border-[#E2E8F2] bg-white p-2.5">
            <p className="text-[7.5px] font-bold uppercase tracking-wide text-[#7186A0]">Vulnerability score</p>
            <div className="mt-1.5 flex items-center gap-2">
              <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#E2E8F2" strokeWidth="4" />
                <circle
                  cx="18" cy="18" r="15" fill="none" stroke="#1D63ED" strokeWidth="4"
                  strokeDasharray="94.2" strokeDashoffset="24.5" strokeLinecap="round"
                />
              </svg>
              <div>
                <p className="font-mono-data text-[13px] font-semibold text-[#0B1F3A]">74<span className="text-[8px] text-[#7186A0]">/100</span></p>
                <p className="text-[7px] text-[#B42318]">High — action required</p>
              </div>
            </div>
          </div>

          {/* Shadow spend + trend bars */}
          <div className="rounded-lg border border-[#E2E8F2] bg-white p-2.5">
            <p className="text-[7.5px] font-bold uppercase tracking-wide text-[#7186A0]">Shadow spend</p>
            <p className="font-mono-data mt-1 text-[13px] font-semibold text-[#0B1F3A]">$907<span className="text-[8px] text-[#7186A0]">/mo</span></p>
            <div className="mt-1.5 flex h-6 items-end gap-[3px]">
              {BARS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{ height: `${h}%`, background: i === BARS.length - 1 ? "#1D63ED" : "#C3D7F9" }}
                />
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="col-span-2 rounded-lg border border-[#E2E8F2] bg-white p-2.5">
            <p className="mb-1.5 text-[7.5px] font-bold uppercase tracking-wide text-[#7186A0]">Recent activity</p>
            <div className="space-y-1.5">
              {ACTIVITY.map(({ dot, text, time }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: dot }} />
                  <span className="flex-1 truncate text-[8px] text-[#3D5573]">{text}</span>
                  <span className="font-mono-data text-[7px] text-[#7186A0]">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]">
              <Shield size={15} strokeWidth={2.5} className="text-white" />
            </div>
            <span className="text-[15px] font-extrabold tracking-tight">
              Shadow<span className="text-[var(--color-accent)]">Sweep</span>
            </span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            {[
              { label: "Services",  href: "#services" },
              { label: "Why us",    href: "#why-us" },
              { label: "Pricing",   href: "#pricing" },
              { label: "Live demo", href: "/dashboard" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-[13.5px] font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent)]"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
            >
              Get a Free Audit <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero — copy left, product mockup right ──────────────────────── */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-32 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="micro-label mb-4 !text-[var(--color-accent)]">
            Smart Shadow IT control for a digital world
          </p>
          <h1 className="text-[38px] font-extrabold leading-[1.12] tracking-tight md:text-[46px]">
            Total SaaS Visibility.
            <br />
            Built Around Your <span className="text-[var(--color-accent)]">Control.</span>
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            From discovery to offboarding, ShadowSweep connects your identity, spend, and
            billing tools to find every unauthorized app — and revoke it in one click.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-3 text-[13.5px] font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
            >
              Explore the Platform <ArrowRight size={15} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-strong)] px-6 py-3 text-[13.5px] font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <Play size={13} className="fill-current" /> Watch the Demo
            </Link>
          </div>

          {/* Trusted-by strip */}
          <div className="mt-12">
            <p className="micro-label mb-4">Trusted by forward-thinking IT teams</p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              {TRUSTED_BY.map(({ icon: Icon, name }) => (
                <span key={name} className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--color-text-muted)]">
                  <Icon size={15} strokeWidth={1.75} /> {name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        >
          <DashboardMockup />
        </motion.div>
      </section>

      {/* ── Services ────────────────────────────────────────────────────── */}
      <section id="services" className="bg-[var(--color-surface-2)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...sectionReveal} className="mb-12 text-center">
            <p className="micro-label mb-3 !text-[var(--color-accent)]">What we do</p>
            <h2 className="text-[28px] font-extrabold tracking-tight">End-to-End Shadow IT Control</h2>
            <p className="mx-auto mt-3 max-w-lg text-[13.5px] text-[var(--color-text-secondary)]">
              Comprehensive coverage designed to expose your full SaaS footprint and keep it governed.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.08 }}
                className="flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-accent)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-subtle)]">
                  <Icon size={20} strokeWidth={1.75} className="text-[var(--color-accent)]" />
                </div>
                <h3 className="mb-2 text-[14.5px] font-bold">{title}</h3>
                <p className="flex-1 text-[12.5px] leading-relaxed text-[var(--color-text-secondary)]">{desc}</p>
                <Link
                  href="/dashboard"
                  className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--color-accent)] hover:underline"
                >
                  Learn More <ArrowRight size={12} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats band — navy rounded container ─────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          {...sectionReveal}
          className="grid grid-cols-2 overflow-hidden rounded-2xl md:grid-cols-4"
          style={{ background: "var(--color-nav-bg)" }}
        >
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <div
              key={value}
              className="flex items-center gap-4 px-7 py-8"
              style={{ borderLeft: i > 0 ? "1px solid var(--color-nav-border)" : "none" }}
            >
              <Icon size={22} strokeWidth={1.5} style={{ color: "var(--color-nav-accent)" }} className="hidden flex-shrink-0 sm:block" />
              <div>
                <p className="font-mono-data text-[24px] font-semibold leading-tight text-white">{value}</p>
                <p className="text-[11.5px]" style={{ color: "var(--color-nav-text)" }}>{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Why choose us + case study ──────────────────────────────────── */}
      <section id="why-us" className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 lg:grid-cols-2">
        <motion.div {...sectionReveal}>
          <p className="micro-label mb-3 !text-[var(--color-accent)]">Why choose us</p>
          <h2 className="text-[26px] font-extrabold tracking-tight">Visibility. Compliance. Control.</h2>
          <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-[var(--color-text-secondary)]">
            We combine deep discovery coverage with a security-first architecture to deliver
            governance IT leaders can stand behind.
          </p>
          <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-subtle)]">
                  <Icon size={16} strokeWidth={1.75} className="text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="text-[13.5px] font-bold">{title}</h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-text-secondary)]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Case study card */}
        <motion.div
          {...sectionReveal}
          className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-xs"
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2 text-[14px] font-bold">
              <Aperture size={16} className="text-[var(--color-text-muted)]" /> Pinnacle
            </span>
            <div className="flex items-center gap-3">
              <span className="micro-label">Case study</span>
              <div className="flex gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)]">
                  <ChevronLeft size={13} />
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)]">
                  <ChevronRight size={13} />
                </span>
              </div>
            </div>
          </div>

          <blockquote className="text-[16px] font-semibold leading-relaxed">
            &ldquo;ShadowSweep surfaced 64 unsanctioned apps in our first scan and helped us
            cut SaaS waste by 40% in a single quarter — with zero offboarding gaps.&rdquo;
          </blockquote>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-nav-bg)] text-[11px] font-bold text-white">
              SM
            </div>
            <div>
              <p className="text-[13px] font-bold">Sarah Mitchell</p>
              <p className="text-[11.5px] text-[var(--color-text-muted)]">CTO, Pinnacle Solutions</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[var(--color-border)] pt-6">
            {[
              { icon: TrendingDown, value: "40%",  label: "Cost savings" },
              { icon: Search,       value: "64",   label: "Apps discovered" },
              { icon: ShieldCheck,  value: "100%", label: "Offboarding coverage" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <Icon size={16} strokeWidth={1.75} className="mx-auto mb-1.5 text-[var(--color-accent)]" />
                <p className="font-mono-data text-[18px] font-semibold">{value}</p>
                <p className="text-[10.5px] text-[var(--color-text-muted)]">{label}</p>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-[var(--color-accent)] hover:underline"
          >
            Read Full Case Study <ArrowRight size={12} />
          </Link>
        </motion.div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-[var(--color-surface-2)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...sectionReveal} className="mb-10 text-center">
            <p className="micro-label mb-3 !text-[var(--color-accent)]">Pricing</p>
            <h2 className="text-[28px] font-extrabold tracking-tight">Simple, transparent pricing</h2>
          </motion.div>

          {/* Billing toggle */}
          <div className="mb-10 flex justify-center">
            <div className="flex items-center rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-0.5">
              {(["monthly", "yearly"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className={`flex items-center gap-2 rounded-md px-5 py-2 text-[12.5px] font-semibold transition ${
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

          <div className="grid gap-5 md:grid-cols-3">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.08 }}
                className="flex flex-col overflow-hidden rounded-2xl border bg-[var(--color-surface)]"
                style={{
                  borderColor: plan.highlighted ? "var(--color-accent)" : "var(--color-border)",
                }}
              >
                {/* Plan header */}
                <div
                  className="border-b border-[var(--color-border)] px-6 py-5"
                  style={plan.highlighted ? { background: "var(--color-nav-bg)", borderColor: "var(--color-nav-border)" } : undefined}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="micro-label"
                      style={{ color: plan.highlighted ? "var(--color-nav-accent)" : "var(--color-accent)" }}
                    >
                      {plan.name}
                    </span>
                    {plan.highlighted && (
                      <span className="rounded-full bg-[var(--color-accent)] px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-white">
                        Most popular
                      </span>
                    )}
                  </div>
                  <div className="mt-2.5 flex items-end gap-1">
                    <span
                      key={billing}
                      className="font-mono-data animate-fade-in text-[34px] font-semibold leading-none"
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
                        <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-[var(--color-accent)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/auth"
                    className={`mt-auto block rounded-lg py-2.5 text-center text-[13px] font-semibold transition ${
                      plan.highlighted
                        ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
                        : "border border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band — navy rounded container ───────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          {...sectionReveal}
          className="flex flex-wrap items-center justify-between gap-6 rounded-2xl px-8 py-10"
          style={{ background: "var(--color-nav-bg)" }}
        >
          <div className="flex items-center gap-5">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ background: "var(--color-nav-accent)" }}
            >
              <Shield size={22} strokeWidth={2} className="text-white" />
            </div>
            <div>
              <h2 className="text-[22px] font-extrabold tracking-tight text-white">
                Ready to take back your SaaS stack?
              </h2>
              <p className="mt-1 text-[13px]" style={{ color: "var(--color-nav-text)" }}>
                Run your first discovery scan in under 12 minutes — no agents to install.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-3 text-[13.5px] font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
            >
              Get a Free Audit <ArrowRight size={15} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-[13.5px] font-semibold text-[#081A33] transition hover:bg-slate-100"
            >
              View Live Demo
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{ background: "var(--color-nav-bg)", borderTop: "1px solid var(--color-nav-border)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-6 w-6 items-center justify-center rounded"
              style={{ background: "var(--color-nav-accent)" }}
            >
              <Shield size={12} strokeWidth={2.5} className="text-white" />
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
