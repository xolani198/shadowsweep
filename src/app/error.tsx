"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, ShieldAlert } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { reportError } from "@/lib/monitoring";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, { where: "app/error", digest: error.digest });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] px-6 text-center">
      <div className="mb-8">
        <Logo size={32} />
      </div>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30">
        <ShieldAlert size={26} className="text-[var(--color-danger)]" strokeWidth={1.75} />
      </div>
      <p className="font-mono-data mt-6 text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
        Something broke
      </p>
      <h1 className="mt-2 text-[28px] font-extrabold tracking-tight text-[var(--color-text-primary)]">
        We hit an unexpected error
      </h1>
      <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
        Our team has been notified. You can retry the action or head back to the dashboard.
      </p>
      {error.digest && (
        <p className="font-mono-data mt-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1.5 text-[11px] text-[var(--color-text-muted)]">
          Reference: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
        >
          <RotateCcw size={14} /> Try again
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-strong)] px-5 py-2.5 text-[13px] font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
