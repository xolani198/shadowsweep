import React from "react";

type Variant = "low" | "medium" | "high" | "critical" | "info" | "success" | "neutral";

/* Muted enterprise semantics — thin border, restrained tint */
const STYLES: Record<Variant, string> = {
  low:      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900",
  medium:   "bg-amber-50   text-amber-800   border-amber-200   dark:bg-amber-950/30   dark:text-amber-400   dark:border-amber-900",
  high:     "bg-orange-50  text-orange-800  border-orange-200  dark:bg-orange-950/30  dark:text-orange-400  dark:border-orange-900",
  critical: "bg-red-50     text-red-800     border-red-200     dark:bg-red-950/30     dark:text-red-400     dark:border-red-900",
  info:     "bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border-[var(--color-accent-muted)]",
  success:  "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900",
  neutral:  "bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border-[var(--color-border)]",
};

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-px text-[10px] font-semibold uppercase tracking-[0.06em] ${STYLES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
