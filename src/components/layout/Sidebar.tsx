"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Users,
  Bell,
  Settings,
} from "lucide-react";
import { METRICS } from "@/lib/mockData";
import Logo from "./Logo";

const NAV = [
  { href: "/dashboard",           label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/discovery", label: "Discovery", icon: Search },
  { href: "/dashboard/employees", label: "Employees", icon: Users },
  { href: "/dashboard/alerts",    label: "Alerts",    icon: Bell, badge: METRICS.criticalAlerts },
  { href: "/dashboard/settings",  label: "Settings",  icon: Settings },
];

export default function Sidebar() {
  const path = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (href === "/dashboard/employees") return path.startsWith("/dashboard/employee");
    if (exact) return path === "/dashboard";
    return path.startsWith(href);
  }

  return (
    /* Structural navy — constant across light/dark themes */
    <aside
      className="flex h-screen w-56 flex-shrink-0 flex-col"
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
            <Link key={href} href={href} className={`nav-item ${active ? "nav-item-active" : ""}`}>
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
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold" style={{ color: "var(--color-nav-text-active)" }}>
              Acme Corp
            </p>
            <p className="truncate font-mono-data text-[10px]" style={{ color: "var(--color-nav-text)" }}>
              Enterprise plan
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
