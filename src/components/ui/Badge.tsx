import React from "react";

type Variant = "low" | "medium" | "high" | "critical" | "info" | "success" | "neutral";

/* Navy-toned badge palette — crisper, less generic than the default Tailwind colors */
const STYLES: Record<Variant, string> = {
  low:      "bg-emerald-50  text-emerald-700  border border-emerald-200  dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50",
  medium:   "bg-amber-50    text-amber-700    border border-amber-200    dark:bg-amber-950/40   dark:text-amber-400   dark:border-amber-800/50",
  high:     "bg-orange-50   text-orange-700   border border-orange-200   dark:bg-orange-950/40  dark:text-orange-400  dark:border-orange-800/50",
  critical: "bg-red-50      text-red-700      border border-red-200      dark:bg-red-950/40     dark:text-red-400     dark:border-red-800/50",
  info:     "bg-sky-50      text-sky-700      border border-sky-200      dark:bg-sky-950/40     dark:text-sky-400     dark:border-sky-800/50",
  success:  "bg-emerald-50  text-emerald-700  border border-emerald-200  dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50",
  neutral:  "bg-slate-100   text-slate-600    border border-slate-200    dark:bg-slate-800/40   dark:text-slate-400   dark:border-slate-700/50",
};

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide ${STYLES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
