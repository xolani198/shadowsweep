"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Users,
  Bell,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";
import { METRICS } from "@/lib/data";
import { BILLING_ENABLED } from "@/lib/config";
import { useMobileNav } from "@/contexts/MobileNavContext";
import Logo from "./Logo";

const NAV = [
  { href: "/dashboard",           label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/discovery", label: "Discovery", icon: Search },
  { href: "/dashboard/employees", label: "Employees", icon: Users },
  { href: "/dashboard/alerts",    label: "Alerts",    icon: Bell, badge: METRICS.criticalAlerts },
  // Billing only appears once billing is switched on.
  ...(BILLING_ENABLED
    ? [{ href: "/dashboard/billing", label: "Billing", icon: CreditCard }]
    : []),
  { href: "/dashboard/settings",  label: "Settings",  icon: Settings },
];

export default function Sidebar() {
  const path = usePathname();
  const { open, setOpen } = useMobileNav();

  async function signOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/";
    }
  }

  function isActive(href: string, exact?: boolean) {
    if (href === "/dashboard/employees") return path.startsWith("/dashboard/employee");
    if (exact) return path === "/dashboard";
    return path.startsWith(href);
  }

  return (
    /* Structural navy, constant across light/dark themes.
       Static column on md+, off-canvas drawer on mobile. */
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-screen w-56 flex-shrink-0 flex-col transition-transform duration-200 ease-out md:static md:translate-x-0 ${
        open ? "translate-x-0 shadow-elevated" : "-translate-x-full"
      }`}
      style={{ background: "var(--color-nav-bg)", borderRight: "1px solid var(--color-nav-border)" }}
    >
      {/* Logo */}
      <div
        className="flex items-center px-5 py-[17px]"
        style={{ borderBottom: "1px solid var(--color-nav-border)" }}
      >
        <Logo size={28} textClassName="text-[var(--color-nav-text-active)]" />
      </div>

      {/* Section label */}
      <div className="px-5 pt-5 pb-1.5">
        <span className="micro-label" style={{ color: "var(--color-nav-text)" }}>
          Platform
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-4">
        {NAV.map(({ href, label, icon: Icon, exact, badge }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`nav-item ${active ? "nav-item-active" : ""}`}
            >
              <Icon
                size={15}
                strokeWidth={active ? 2.25 : 1.75}
                style={{ color: active ? "#FFFFFF" : "inherit", flexShrink: 0 }}
              />
              <span className="flex-1">{label}</span>
              {badge != null && badge > 0 && (
                <span
                  className="font-mono-data flex h-4 min-w-[16px] items-center justify-center rounded px-1 text-[9.5px] font-semibold"
                  style={{ background: "rgba(180,35,24,0.9)", color: "#fff" }}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Workspace footer */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid var(--color-nav-border)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[10px] font-bold"
            style={{ background: "var(--color-nav-surface)", color: "var(--color-nav-accent)", border: "1px solid var(--color-nav-border)" }}
          >
            AC
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold" style={{ color: "var(--color-nav-text-active)" }}>
              Acme Corp
            </p>
            <p className="truncate font-mono-data text-[10px]" style={{ color: "var(--color-nav-text)" }}>
              {BILLING_ENABLED ? "Enterprise plan" : "Free plan"}
            </p>
          </div>
          <button
            onClick={signOut}
            aria-label="Sign out"
            title="Sign out"
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md transition hover:bg-white/10"
            style={{ color: "var(--color-nav-text)" }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
