// FILE: src/app/dashboard/employee/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Mail,
  RotateCcw,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { EMPLOYEES, Employee, AppRecord } from "@/lib/data";

interface OffboardPreview {
  appCount: number;
  monthlySpend: number;
  wouldRevoke: { name: string; riskLevel: string; monthlySpend: number; dataAccess: string[] }[];
}

// ── Revoke animation steps ────────────────────────────────────────────────

const REVOKE_STEPS = [
  { id: 1, label: "Authenticating admin credentials" },
  { id: 2, label: "Fetching active OAuth tokens" },
  { id: 3, label: "Revoking Google Workspace tokens" },
  { id: 4, label: "Cancelling Ramp and Brex subscriptions" },
  { id: 5, label: "Invalidating Stripe billing seats" },
  { id: 6, label: "Generating compliance email template" },
  { id: 7, label: "Writing to 90-day audit log" },
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
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-2)] text-[12px] font-bold text-[var(--color-text-secondary)]">
          {app.name.slice(0, 2).toUpperCase()}
        </span>
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

  const emailBody = `Subject: Data Deletion and Access Revocation Request (GDPR/CCPA Compliance)

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
${employee.shadowApps.map((a) => `  • ${a.name}: ${a.dataAccess.join(", ")}`).join("\n")}

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
          <Mail size={14} className="text-[var(--color-accent)]" />
          <p className="text-[13px] font-bold text-[var(--color-accent)]">
            Compliance Deletion Email Template
          </p>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-accent)]/40 px-3 py-1.5 text-[12px] font-semibold text-[var(--color-accent)] transition hover:bg-[var(--color-accent)] hover:text-white"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy template"}
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

  const { toast } = useToast();
  const [revokeStatus, setRevokeStatus] = useState<RevokeStatus>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  // Outcome of the real /api/offboard call, resolved independently of the
  // step animation. The success state is gated on BOTH completing.
  const [apiOutcome, setApiOutcome] = useState<null | "ok" | "error">(null);

  // Typed-confirmation modal + server-computed impact preview (dry run).
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [preview, setPreview] = useState<OffboardPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [executing, setExecuting] = useState(false);

  // Undo window after a successful revoke.
  const [undoLeft, setUndoLeft] = useState(0);
  const lastAuditRef = useRef<string | null>(null);

  // Step animation, gated on the real API outcome.
  useEffect(() => {
    if (revokeStatus !== "running") return;

    if (currentStep >= REVOKE_STEPS.length) {
      if (apiOutcome === "ok") {
        setRevokeStatus("done");
        setUndoLeft(8); // open the undo window
        toast({
          variant: "success",
          title: "Access revoked",
          description: "Audit log updated. Compliance template generated.",
        });
      } else if (apiOutcome === "error") {
        setRevokeStatus("idle");
        setExecuting(false);
        toast({
          variant: "error",
          title: "Revocation failed",
          description: "We couldn't complete offboarding. Please try again.",
        });
      }
      return;
    }

    const t = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep((s) => s + 1);
    }, 900);
    return () => clearTimeout(t);
  }, [revokeStatus, currentStep, apiOutcome, toast]);

  // Undo countdown.
  useEffect(() => {
    if (undoLeft <= 0) return;
    const t = setTimeout(() => setUndoLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [undoLeft]);

  // Open the confirmation modal and load the impact preview via a dry run.
  function requestRevoke() {
    if (!employee) return;
    setConfirmOpen(true);
    setPreview(null);
    setPreviewLoading(true);
    fetch("/api/offboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: employee.id, scope: "shadow", dryRun: true }),
    })
      .then(async (r) => {
        if (r.ok) setPreview(await r.json());
      })
      .catch(() => {})
      .finally(() => setPreviewLoading(false));
  }

  // Execute the real revoke with an idempotency key so retries are safe.
  function executeRevoke() {
    if (!employee) return;
    setExecuting(true);
    const idempotencyKey =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `idem-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    setRevokeStatus("running");
    setCurrentStep(0);
    setCompletedSteps([]);
    setApiOutcome(null);
    setConfirmOpen(false);

    fetch("/api/offboard", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
      body: JSON.stringify({ employeeId: employee.id, scope: "shadow" }),
    })
      .then(async (r) => {
        if (r.ok) {
          const b = await r.json().catch(() => ({}));
          lastAuditRef.current = b.auditLogId ?? null;
          setApiOutcome("ok");
        } else if (r.status === 401) {
          window.location.href = `/auth?next=${encodeURIComponent(window.location.pathname)}`;
        } else {
          setApiOutcome("error");
        }
      })
      .catch(() => setApiOutcome("error"));
  }

  // Undo the offboard within the window: restore the view and log the reversal.
  function undoRevoke() {
    if (!employee) return;
    setUndoLeft(0);
    fetch("/api/offboard/undo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: employee.id, auditLogId: lastAuditRef.current ?? undefined }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("undo failed");
        setRevokeStatus("idle");
        setApiOutcome(null);
        setCompletedSteps([]);
        setCurrentStep(0);
        setExecuting(false);
        toast({ variant: "info", title: "Offboarding undone", description: "Access has been restored." });
      })
      .catch(() => toast({ variant: "error", title: "Undo failed", description: "Could not reverse the action." }));
  }

  // Show the standard 404 page rather than a bespoke message. This is a client
  // component, so the response status stays 200; that is fine here because the
  // route sits behind auth and is excluded from indexing.
  if (!employee) {
    notFound();
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
                onClick={requestRevoke}
                disabled={revokeStatus === "running"}
                className={`flex-shrink-0 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[14px] font-extrabold text-white transition-all ${
                  revokeStatus === "running"
                    ? "bg-[var(--color-accent)]/50 cursor-not-allowed"
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
                      <span className="font-mono-data w-5 flex-shrink-0 text-[11px] tabular-nums">
                        {String(step.id).padStart(2, "0")}
                      </span>
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

      {/* Typed-confirmation modal with a real (dry-run) impact preview */}
      <ConfirmDialog
        open={confirmOpen}
        title="Revoke all shadow IT access"
        confirmPhrase={employee.name}
        confirmLabel="Revoke access"
        loading={executing}
        onConfirm={executeRevoke}
        onClose={() => setConfirmOpen(false)}
      >
        <p className="text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
          This revokes OAuth tokens and cancels subscriptions for{" "}
          <span className="font-semibold text-[var(--color-text-primary)]">{employee.name}</span>{" "}
          <span className="font-mono-data text-[12px]">({employee.email})</span>. You will have a few
          seconds to undo before it is final.
        </p>

        <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
          <p className="micro-label mb-2">Impact preview</p>
          {previewLoading && (
            <div className="space-y-1.5">
              <div className="skeleton h-3 w-40" />
              <div className="skeleton h-3 w-32" />
            </div>
          )}
          {!previewLoading && preview && (
            <>
              <p className="text-[12.5px] text-[var(--color-text-secondary)]">
                <span className="font-mono-data font-semibold text-[var(--color-danger)]">{preview.appCount}</span>{" "}
                apps will be revoked ·{" "}
                <span className="font-mono-data font-semibold text-[var(--color-danger)]">${preview.monthlySpend}/mo</span>{" "}
                recovered
              </p>
              <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto">
                {preview.wouldRevoke.map((a) => (
                  <li key={a.name} className="flex items-center justify-between gap-2 text-[12px]">
                    <span className="truncate text-[var(--color-text-primary)]">{a.name}</span>
                    <Badge variant={a.riskLevel as "low" | "medium" | "high" | "critical"}>{a.riskLevel}</Badge>
                  </li>
                ))}
              </ul>
            </>
          )}
          {!previewLoading && !preview && (
            <p className="text-[12.5px] text-[var(--color-text-muted)]">Could not load the impact preview.</p>
          )}
        </div>
      </ConfirmDialog>

      {/* Undo window */}
      {revokeStatus === "done" && undoLeft > 0 && (
        <div className="fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-elevated">
          <CheckCircle2 size={16} className="text-[var(--color-success)]" />
          <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">Access revoked.</span>
          <button
            onClick={undoRevoke}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border-strong)] px-3 py-1 text-[12.5px] font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <RotateCcw size={12} /> Undo ({undoLeft}s)
          </button>
        </div>
      )}
    </div>
  );
}
