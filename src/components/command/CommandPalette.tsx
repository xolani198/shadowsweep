"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Users,
  Bell,
  Settings,
  CreditCard,
  Home,
  Moon,
  Sun,
  LogOut,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { EMPLOYEES } from "@/lib/data";
import { BILLING_ENABLED } from "@/lib/config";

interface CommandItem {
  id: string;
  label: string;
  group: string;
  keywords: string;
  icon: React.ElementType;
  hint?: string;
  run: () => void;
}

interface CommandPaletteContextValue {
  open: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | undefined>(undefined);

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  async function signOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/";
    }
  }

  const items = useMemo<CommandItem[]>(() => {
    const go = (href: string) => () => {
      close();
      router.push(href);
    };
    const nav: CommandItem[] = [
      { id: "nav-dashboard", label: "Dashboard", group: "Navigation", keywords: "overview home command", icon: LayoutDashboard, run: go("/dashboard") },
      { id: "nav-discovery", label: "Discovery", group: "Navigation", keywords: "integrations apps scan shadow", icon: Search, run: go("/dashboard/discovery") },
      { id: "nav-employees", label: "Employees", group: "Navigation", keywords: "people personnel staff", icon: Users, run: go("/dashboard/employees") },
      { id: "nav-alerts", label: "Alerts", group: "Navigation", keywords: "notifications warnings", icon: Bell, run: go("/dashboard/alerts") },
      ...(BILLING_ENABLED
        ? [
            {
              id: "nav-billing",
              label: "Billing",
              group: "Navigation",
              keywords: "subscription plan payment invoice upgrade",
              icon: CreditCard,
              run: go("/dashboard/billing"),
            },
          ]
        : []),
      { id: "nav-settings", label: "Settings", group: "Navigation", keywords: "workspace integrations config", icon: Settings, run: go("/dashboard/settings") },
    ];
    const people: CommandItem[] = EMPLOYEES.map((e) => ({
      id: `emp-${e.id}`,
      label: e.name,
      group: "Employees",
      keywords: `${e.email} ${e.department} ${e.role} offboard`,
      icon: Users,
      hint: e.department,
      run: go(`/dashboard/employee/${e.id}`),
    }));
    const actions: CommandItem[] = [
      {
        id: "action-theme",
        label: isDark ? "Switch to light mode" : "Switch to dark mode",
        group: "Actions",
        keywords: "theme dark light appearance",
        icon: isDark ? Sun : Moon,
        run: () => {
          toggleTheme();
          close();
        },
      },
      { id: "action-home", label: "Go to marketing site", group: "Actions", keywords: "landing home public", icon: Home, run: go("/") },
      {
        id: "action-signout",
        label: "Sign out",
        group: "Actions",
        keywords: "logout leave exit",
        icon: LogOut,
        run: () => {
          close();
          signOut();
        },
      },
    ];
    return [...nav, ...people, ...actions];
  }, [router, close, isDark, toggleTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) => i.label.toLowerCase().includes(q) || i.keywords.toLowerCase().includes(q)
    );
  }, [items, query]);

  // Reset highlight when the result set changes.
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Global ⌘K / Ctrl+K to toggle the palette.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus the input when opened.
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Keep the active row in view.
  useEffect(() => {
    if (!isOpen) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen]);

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIndex]?.run();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  // Render groups in order while keeping a single flat index for keyboard nav.
  let runningIndex = -1;
  const groups = ["Navigation", "Employees", "Actions"].map((g) => ({
    name: g,
    rows: filtered.filter((i) => i.group === g),
  })).filter((g) => g.rows.length > 0);

  return (
    <CommandPaletteContext.Provider value={{ open }}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[12vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <div className="absolute inset-0 bg-[var(--color-nav-bg)]/40 backdrop-blur-[2px]" onClick={close} />
          <div className="relative w-full max-w-[560px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-elevated animate-slide-up">
            {/* Search field */}
            <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] px-4">
              <Search size={16} className="flex-shrink-0 text-[var(--color-text-muted)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search pages, employees, actions…"
                aria-label="Search commands"
                className="h-12 w-full bg-transparent text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
              />
              <kbd className="hidden flex-shrink-0 rounded border border-[var(--color-border-strong)] px-1.5 py-0.5 font-mono-data text-[10px] text-[var(--color-text-muted)] sm:block">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
              {groups.length === 0 && (
                <p className="px-3 py-8 text-center text-[13px] text-[var(--color-text-muted)]">
                  No results for &ldquo;{query}&rdquo;
                </p>
              )}
              {groups.map((group) => (
                <div key={group.name} className="mb-1">
                  <p className="px-3 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                    {group.name}
                  </p>
                  {group.rows.map((item) => {
                    runningIndex += 1;
                    const idx = runningIndex;
                    const active = idx === activeIndex;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        data-index={idx}
                        onClick={item.run}
                        onMouseMove={() => setActiveIndex(idx)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13.5px] transition ${
                          active
                            ? "bg-[var(--color-accent)] text-white"
                            : "text-[var(--color-text-primary)]"
                        }`}
                      >
                        <Icon size={15} className={active ? "text-white" : "text-[var(--color-text-muted)]"} />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.hint && (
                          <span className={`text-[11px] ${active ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
                            {item.hint}
                          </span>
                        )}
                        {active && <CornerDownLeft size={13} className="text-white/80" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer hints */}
            <div className="flex items-center gap-4 border-t border-[var(--color-border)] px-4 py-2 text-[11px] text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1"><ArrowUp size={11} /><ArrowDown size={11} /> navigate</span>
              <span className="flex items-center gap-1"><CornerDownLeft size={11} /> select</span>
              <span className="ml-auto flex items-center gap-1">
                <kbd className="rounded border border-[var(--color-border-strong)] px-1 font-mono-data">⌘</kbd>
                <kbd className="rounded border border-[var(--color-border-strong)] px-1 font-mono-data">K</kbd>
              </span>
            </div>
          </div>
        </div>
      )}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette(): CommandPaletteContextValue {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) throw new Error("useCommandPalette must be used inside <CommandPaletteProvider>");
  return ctx;
}
