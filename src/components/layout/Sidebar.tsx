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
} from "lucide-react";
import { METRICS } from "@/lib/mockData";

const NAV = [
  { href: "/dashboard",           label: "Dashboard",  icon: LayoutDashboard, exact: true },
  { href: "/dashboard/discovery", label: "Discovery",  icon: Search },
  { href: "/dashboard/employees", label: "Employees",  icon: Users },
  { href: "/dashboard/alerts",    label: "Alerts",     icon: Bell, badge: METRICS.criticalAlerts },
  { href: "/dashboard/settings",  label: "Settings",   icon: Settings },
];

export default function Sidebar() {
  const path = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (href === "/dashboard/employees") return path.startsWith("/dashboard/employee");
    if (exact) return path === "/dashboard";
    return path.startsWith(href);
  }

  return (
    /* Sidebar is permanently navy regardless of light/dark theme */
    <aside
      className="relative flex h-screen w-56 flex-shrink-0 flex-col"
      style={{ background: "var(--color-nav-bg)", borderRight: "1px solid var(--color-nav-border)" }}
    >
      {/* ── Logo ─────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-5 py-[18px]"
        style={{ borderBottom: "1px solid var(--color-nav-border)" }}
      >
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
          style={{ background: "var(--color-nav-accent)" }}
        >
          <Shield size={15} strokeWidth={2.5} style={{ color: "#0A1929" }} />
        </div>
        <span
          className="text-[15px] font-extrabold tracking-tight"
          style={{ color: "var(--color-nav-text-active)" }}
        >
          Shadow<span style={{ color: "var(--color-nav-accent)" }}>Sweep</span>
        </span>
      </div>

      {/* ── Nav label ───────────────────────────────────── */}
      <div className="px-5 pt-5 pb-1.5">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ color: "var(--color-nav-text)" }}
        >
          Navigation
        </span>
      </div>

      {/* ── Nav items ───────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-4">
        {NAV.map(({ href, label, icon: Icon, exact, badge }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150"
              style={{
                color:      active ? "var(--color-nav-text-active)" : "var(--color-nav-text)",
                background: active ? "rgba(56,189,248,0.10)"        : "transparent",
                boxShadow:  active ? "inset 3px 0 0 var(--color-nav-accent)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-nav-text-active)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-nav-text)";
                }
              }}
            >
              <Icon
                size={15}
                strokeWidth={active ? 2.5 : 2}
                style={{ color: active ? "var(--color-nav-accent)" : "inherit", flexShrink: 0 }}
              />
              <span className="flex-1">{label}</span>
              {badge != null && badge > 0 && (
                <span
                  className="flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold"
                  style={{ background: "#DC2626", color: "#fff" }}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer: workspace ────────────────────────────── */}
      <div
        className="px-4 py-4"
        style={{ borderTop: "1px solid var(--color-nav-border)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-extrabold"
            style={{ background: "var(--color-nav-accent)", color: "#0A1929" }}
          >
            AC
          </div>
          <div className="min-w-0">
            <p
              className="truncate text-[12px] font-bold"
              style={{ color: "var(--color-nav-text-active)" }}
            >
              Acme Corp
            </p>
            <p
              className="truncate font-mono-data text-[10px]"
              style={{ color: "var(--color-nav-text)" }}
            >
              Pro plan
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
