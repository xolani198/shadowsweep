// FILE: src/components/ui/Badge.tsx
import React from "react";

type Variant = "low" | "medium" | "high" | "critical" | "info" | "success" | "neutral";

const STYLES: Record<Variant, string> = {
  low:      "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400",
  medium:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  high:     "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  critical: "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400",
  info:     "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400",
  success:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  neutral:  "bg-[var(--color-border)] text-[var(--color-text-secondary)]",
};

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${STYLES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
