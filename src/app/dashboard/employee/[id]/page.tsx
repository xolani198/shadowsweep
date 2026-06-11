// FILE: src/app/dashboard/employee/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { EMPLOYEES, Employee, AppRecord } from "@/lib/mockData";

// ── Revoke animation steps ────────────────────────────────────────────────

const REVOKE_STEPS = [
  { id: 1, label: "Authenticating admin credentials…",       icon: "🔐" },
  { id: 2, label: "Fetching active OAuth tokens…",            icon: "🔍" },
  { id: 3, label: "Revoking Google Workspace tokens…",        icon: "🔴" },
  { id: 4, label: "Cancelling Ramp / Brex subscriptions…",   icon: "💳" },
  { id: 5, label: "Invalidating Stripe billing seats…",       icon: "❌" },
  { id: 6, label: "Generating compliance email templates…",   icon: "📧" },
  { id: 7, label: "Writing to 90-day audit log…",             icon: "📝" },
];

type RevokeStatus = "idle" | "running" | "done";

// ── App Row ───────────────────────────────────────────────────────────────

function AppRow({ app, revoked }: { app: AppRecord; revoked: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-xl border transition ${
        revoked
          ? "border-[var(--color-border)] opacity-40"
          : app.riskLevel === "critical"
          ? "border-red-400/50 dark:border-red-700/50"
          : "border-[var(--color-border)]"
      } bg-[var(--color-surface)]`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 px-4 py-3.5 text-left"
      >
        <span className="text-[20px]">{app.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13.5px] font-semibold text-[var(--color-text-primary)]">{app.name}</span>
            <Badge variant={app.riskLevel}>{app.riskLevel}</Badge>
            {revoked && <Badge variant="success">Revoked</Badge>}
          </div>
          <p className="font-mono-data text-[11.5px] text-[var(--color-text-muted)]">
            {app.category} · Last accessed: {app.lastAccessed}
            {app.monthlySpend > 0 && ` · $${app.monthlySpend}/mo`}
          </p>
        </div>
        <div className="text-[var(--color-text-muted)]">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </button>
      {open && (
        <div className="border-t border-[var(--color-border)] px-4 py-3 space-y-2">
          <p className="text-[12px] text-[var(--color-text-muted)]">
            <span className="font-semibold text-[var(--color-text-secondary)]">Discovered via:</span>{" "}
            {app.discoveredVia}
          </p>
          <div>
            <p className="text-[12px] font-semibold text-[var(--color-text-secondary)]">Data access scopes:</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {app.dataAccess.map((scope) => (
                <span
                  key={scope}
                  className="rounded-full bg-[var(--color-border)] px-2.5 py-0.5 font-mono-data text-[11px] text-[var(--color-text-secondary)]"
                >
                  {scope}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Email Template ────────────────────────────────────────────────────────

function EmailTemplate({ employee }: { employee: Employee }) {
  const [copied, setCopied] = useState(false);

  const emailBody = `Subject: Data Deletion & Access Revocation Request — GDPR/CCPA Compliance

To Whom It May Concern,

We are writing on behalf of Acme Corp to formally request the immediate deletion 
of all data associated with the following former employee:

  Name:   ${employee.name}
  Email:  ${employee.email}
  Dept:   ${employee.department}

The employee's access has been terminated effective today. Please:

1. Permanently delete all personal and organizational data from your systems.
2. Revoke any active API keys, OAuth tokens, or session credentials.
3. Confirm deletion in writing within 30 days per GDPR Article 17 / CCPA §1798.105.

Apps requiring action:
${employee.shadowApps.map((a) => `  • ${a.name} — ${a.dataAccess.join(", ")}`).join("\n")}

Please direct confirmation to: it-security@acmecorp.io

Thank you for your prompt compliance.

Acme Corp IT Security Team`;

  function copy() {
    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="mt-5 rounded-xl border border-[var(--color-accent)]/50 bg-[var(--color-accent-subtle)]">
      <div className="flex items-center justify-between border-b border-[var(--color-accent)]/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[14px]">📧</span>
          <p className="text-[13px] font-bold text-[var(--color-accent)]">
            Compliance Deletion Email Template
          </p>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-accent)]/40 px-3 py-1.5 text-[12px] font-semibold text-[var(--color-accent)] transition hover:bg-[var(--color-accent)] hover:text-white"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy template"}
        </button>
      </div>
      <pre className="font-mono-data overflow-x-auto whitespace-pre-wrap px-4 py-4 text-[11.5px] leading-relaxed text-[var(--color-text-secondary)]">
        {emailBody}
      </pre>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────

export default function EmployeeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const employee = EMPLOYEES.find((e) => e.id === id);

  const [revokeStatus, setRevokeStatus] = useState<RevokeStatus>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (revokeStatus !== "running") return;
    if (currentStep >= REVOKE_STEPS.length) {
      setRevokeStatus("done");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      return;
    }
    const t = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep((s) => s + 1);
    }, 900);
    return () => clearTimeout(t);
  }, [revokeStatus, currentStep]);

  function handleRevoke() {
    setRevokeStatus("running");
    setCurrentStep(0);
    setCompletedSteps([]);
  }

  if (!employee) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Employee Not Found" />
        <div className="flex flex-1 items-center justify-center text-[var(--color-text-muted)]">
          <p>Employee ID <span className="font-mono-data">{id}</span> does not exist.</p>
        </div>
      </div>
    );
  }

  const shadowTotal = employee.shadowApps.reduce((s, a) => s + a.monthlySpend, 0);
  const isRevoked = revokeStatus === "done";

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Offboarding Profile" subtitle={employee.name} />

      <div className="px-6 py-5 max-w-4xl space-y-6">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* Profile header */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[var(--color-nav-bg)] text-white text-[20px] font-bold">
                {employee.avatar}
              </div>
              <div>
                <h2 className="text-[20px] font-extrabold text-[var(--color-text-primary)]">{employee.name}</h2>
                <p className="font-mono-data text-[12.5px] text-[var(--color-text-muted)]">{employee.email}</p>
                <p className="mt-0.5 text-[12.5px] text-[var(--color-text-secondary)]">
                  {employee.role} · {employee.department}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5 items-center">
              <Badge
                variant={
                  employee.status === "active"
                    ? "success"
                    : employee.status === "departing"
                    ? "high"
                    : "critical"
                }
              >
                {employee.status}
              </Badge>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5">
                <p className="text-[10.5px] text-[var(--color-text-muted)]">Risk Score</p>
                <p className={`font-mono-data text-[18px] font-extrabold ${employee.riskScore >= 75 ? "text-[var(--color-danger)]" : employee.riskScore >= 50 ? "text-yellow-500" : "text-[var(--color-success)]"}`}>
                  {employee.riskScore}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5">
                <p className="text-[10.5px] text-[var(--color-text-muted)]">Shadow Spend</p>
                <p className="font-mono-data text-[18px] font-extrabold text-[var(--color-danger)]">
                  ${shadowTotal}/mo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Revoke All Access CTA */}
        {!isRevoked && (
          <div className="rounded-2xl border border-red-400/40 bg-red-50 dark:bg-red-950/20 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={17} className="text-[var(--color-danger)]" />
                  <h3 className="text-[15px] font-bold text-[var(--color-text-primary)]">
                    Revoke All Shadow IT Access
                  </h3>
                </div>
                <p className="mt-1 max-w-md text-[13px] text-[var(--color-text-secondary)]">
                  This will revoke OAuth tokens, cancel subscriptions, and generate a GDPR/CCPA compliance
                  email template for {employee.shadowApps.length} unauthorized apps.
                </p>
              </div>
              <button
                onClick={handleRevoke}
                disabled={revokeStatus === "running"}
                className={`flex-shrink-0 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[14px] font-extrabold text-white transition-all ${
                  revokeStatus === "running"
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]"
                }`}
              >
                {revokeStatus === "running" ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Revoking…
                  </>
                ) : (
                  <>
                    <ShieldX size={17} />
                    Revoke All Access
                  </>
                )}
              </button>
            </div>

            {/* Step animation */}
            {(revokeStatus === "running") && (
              <div className="mt-4 space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                {REVOKE_STEPS.map((step, idx) => {
                  const done = completedSteps.includes(idx);
                  const active = idx === currentStep && !done;
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 text-[13px] transition-all duration-300 ${
                        done
                          ? "text-[var(--color-success)]"
                          : active
                          ? "text-[var(--color-text-primary)] step-active"
                          : "text-[var(--color-text-muted)] opacity-40"
                      }`}
                    >
                      <span className="text-[15px]">{step.icon}</span>
                      <span className="flex-1">{step.label}</span>
                      {done && <CheckCircle2 size={14} />}
                      {active && (
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Success state + email template */}
        {isRevoked && (
          <div className="rounded-2xl border border-[var(--color-success)]/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-[var(--color-success)]" />
              <div>
                <p className="text-[15px] font-bold text-[var(--color-text-primary)]">
                  All shadow IT access revoked successfully
                </p>
                <p className="text-[12.5px] text-[var(--color-text-secondary)]">
                  {employee.shadowApps.length} apps deauthorized · Event written to audit log
                </p>
              </div>
            </div>
            <EmailTemplate employee={employee} />
          </div>
        )}

        {/* Two column: Sanctioned + Shadow apps */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Sanctioned */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck size={15} className="text-[var(--color-success)]" />
              <h3 className="text-[13.5px] font-bold text-[var(--color-text-primary)]">
                Sanctioned Apps ({employee.sanctionedApps.length})
              </h3>
            </div>
            <div className="space-y-2.5">
              {employee.sanctionedApps.map((app) => (
                <AppRow key={app.id} app={app} revoked={false} />
              ))}
            </div>
          </div>

          {/* Shadow IT */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <ShieldX size={15} className="text-[var(--color-danger)]" />
              <h3 className="text-[13.5px] font-bold text-[var(--color-text-primary)]">
                Shadow IT Apps ({employee.shadowApps.length})
              </h3>
              {shadowTotal > 0 && (
                <span className="font-mono-data text-[11.5px] font-bold text-[var(--color-danger)]">
                  ${shadowTotal}/mo
                </span>
              )}
            </div>
            <div className="space-y-2.5">
              {employee.shadowApps.map((app) => (
                <AppRow key={app.id} app={app} revoked={isRevoked} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revoke toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-[var(--color-success)]/40 bg-[var(--color-surface)] px-4 py-3 shadow-lg animate-fade-in">
          <span className="text-[16px]">✅</span>
          <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">
            Access fully revoked — audit log updated
          </p>
        </div>
      )}
    </div>
  );
}
