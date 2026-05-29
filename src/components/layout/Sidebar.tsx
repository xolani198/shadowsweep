// FILE: src/components/layout/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Users,
  Bell,
  Settings,
  Shield,
  ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/dashboard",            label: "Command Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/discovery",  label: "Discovery Engine",  icon: Search },
  { href: "/dashboard/employees",  label: "Employees",          icon: Users },
  { href: "/dashboard/alerts",     label: "Alerts",             icon: Bell },
  { href: "/dashboard/settings",   label: "Settings",           icon: Settings },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[var(--color-border)]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]">
          <Shield size={16} className="text-white" />
        </div>
        <span className="text-[15px] font-bold tracking-tight text-[var(--color-text-primary)]">
          Shadow<span className="text-[var(--color-accent)]">Sweep</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            path === href ||
            (href === "/dashboard/employees" && path.startsWith("/dashboard/employee")) ||
            (href !== "/dashboard" && href !== "/dashboard/employees" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-all ${
                active
                  ? "bg-[var(--color-accent-subtle)] text-[var(--color-accent)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer: Workspace */}
      <div className="border-t border-[var(--color-border)] px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)] text-white text-xs font-bold flex-shrink-0">
            AC
          </div>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-[var(--color-text-primary)]">
              Acme Corp
            </p>
            <p className="truncate font-mono-data text-[10.5px] text-[var(--color-text-muted)]">
              admin@acmecorp.io
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
