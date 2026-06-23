"use client";
import { Bell, Search, Menu } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { METRICS } from "@/lib/data";
import { useMobileNav } from "@/contexts/MobileNavContext";
import { useCommandPalette } from "@/components/command/CommandPalette";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const { setOpen } = useMobileNav();
  const { open: openPalette } = useCommandPalette();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 sm:px-6">
      {/* Left: hamburger (mobile) + breadcrumb-style title */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          className="-ml-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-2)] md:hidden"
        >
          <Menu size={18} />
        </button>
        <div className="h-5 w-[3px] flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
        <div className="min-w-0">
          <h1 className="truncate text-[14px] font-bold text-[var(--color-text-primary)] leading-none">{title}</h1>
          {subtitle && (
            <p className="truncate text-[11.5px] text-[var(--color-text-muted)] mt-0.5 leading-none">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: command palette + alerts + theme */}
      <div className="flex items-center gap-2">
        {/* Command palette trigger (full pill on md+, icon on mobile) */}
        <button
          onClick={openPalette}
          aria-label="Open command palette"
          className="hidden md:flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 h-8 text-[var(--color-text-muted)] text-[12.5px] w-52 transition hover:border-[var(--color-accent)] hover:text-[var(--color-text-secondary)]"
        >
          <Search size={12} />
          <span className="select-none">Search…</span>
          <kbd className="ml-auto flex items-center gap-0.5 font-mono-data text-[10px]">
            <span className="rounded border border-[var(--color-border-strong)] px-1">⌘</span>
            <span className="rounded border border-[var(--color-border-strong)] px-1">K</span>
          </kbd>
        </button>
        <button
          onClick={openPalette}
          aria-label="Open command palette"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:hidden"
        >
          <Search size={14} />
        </button>

        <Link
          href="/dashboard/alerts"
          aria-label="View alerts"
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
