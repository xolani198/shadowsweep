// FILE: src/components/layout/TopBar.tsx
"use client";
import { Bell, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { METRICS } from "@/lib/mockData";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg)] px-6">
      <div>
        <h1 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{title}</h1>
        {subtitle && (
          <p className="text-[12px] text-[var(--color-text-muted)]">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 h-9 text-[var(--color-text-muted)] text-[13px] w-52">
          <Search size={13} />
          <span className="opacity-60">Search…</span>
        </div>
        {/* Alerts badge */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
          <Bell size={16} />
          {METRICS.criticalAlerts > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-danger)] text-[9px] font-bold text-white">
              {METRICS.criticalAlerts}
            </span>
          )}
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
