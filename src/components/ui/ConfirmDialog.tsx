"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  /** The exact text the operator must type to enable confirmation. */
  confirmPhrase: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Blocking confirmation for irreversible actions. The confirm button stays
 * disabled until the operator types the exact phrase (e.g. the employee name),
 * so destruction can never happen on an accidental click.
 */
export default function ConfirmDialog({
  open,
  title,
  confirmPhrase,
  confirmLabel = "Confirm",
  loading = false,
  onConfirm,
  onClose,
  children,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTyped("");
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onClose]);

  if (!open) return null;

  const matches = typed.trim() === confirmPhrase;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-[var(--color-nav-bg)]/50 backdrop-blur-[2px]"
        onClick={() => !loading && onClose()}
      />
      <div className="relative w-full max-w-[460px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-elevated animate-slide-up">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/30">
              <AlertTriangle size={16} className="text-[var(--color-danger)]" />
            </div>
            <h2 className="text-[15px] font-bold text-[var(--color-text-primary)]">{title}</h2>
          </div>
          <button
            onClick={() => !loading && onClose()}
            aria-label="Close"
            className="-mr-1 rounded p-1 text-[var(--color-text-muted)] transition hover:text-[var(--color-text-primary)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>

        <div className="px-5 pb-5">
          <label htmlFor="confirm-phrase" className="text-[12.5px] text-[var(--color-text-secondary)]">
            Type{" "}
            <span className="font-mono-data font-semibold text-[var(--color-text-primary)]">{confirmPhrase}</span>{" "}
            to confirm.
          </label>
          <input
            id="confirm-phrase"
            ref={inputRef}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={loading}
            autoComplete="off"
            className="mt-1.5 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[13px] text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none disabled:opacity-60"
          />

          <div className="mt-4 flex justify-end gap-2.5">
            <button
              onClick={() => !loading && onClose()}
              disabled={loading}
              className="rounded-lg border border-[var(--color-border-strong)] px-4 py-2 text-[13px] font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-2)] disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!matches || loading}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-danger)] px-4 py-2 text-[13px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading && (
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
