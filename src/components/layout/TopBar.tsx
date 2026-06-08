"use client";
import { Bell, Search } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { METRICS } from "@/lib/mockData";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6">
      {/* Left: breadcrumb-style title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="h-5 w-[3px] rounded-full bg-[var(--color-accent)] flex-shrink-0" />
        <div className="min-w-0">
          <h1 className="text-[14px] font-bold text-[var(--color-text-primary)] leading-none">{title}</h1>
          {subtitle && (
            <p className="text-[11.5px] text-[var(--color-text-muted)] mt-0.5 leading-none">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: search + alerts + theme */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 h-8 text-[var(--color-text-muted)] text-[12.5px] w-48 transition focus-within:border-[var(--color-accent)]">
          <Search size={12} />
          <span className="opacity-50 select-none">Search…</span>
        </div>

        <Link
          href="/dashboard/alerts"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          <Bell size={14} />
          {METRICS.criticalAlerts > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white leading-none">
              {METRICS.criticalAlerts}
            </span>
          )}
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}
