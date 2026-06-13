// FILE: src/app/dashboard/page.tsx
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import MetricsBanner from "@/components/dashboard/MetricsBanner";
import AlertsFeed from "@/components/dashboard/AlertsFeed";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { EMPLOYEES, DISCOVERY_ROWS, DiscoveryRow } from "@/lib/mockData";

const RISK_RANK: Record<DiscoveryRow["riskLevel"], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export default function DashboardPage() {
  const departing = EMPLOYEES.filter((e) => e.status === "departing" || e.status === "offboarded");

  const surfaced = [...DISCOVERY_ROWS]
    .sort((a, b) => RISK_RANK[a.riskLevel] - RISK_RANK[b.riskLevel] || b.monthlySpend - a.monthlySpend)
    .slice(0, 6);

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Command Dashboard" subtitle="Real-time shadow IT overview" />

      {/* Metrics */}
      <MetricsBanner />

      {/* Tiered Horizon Stack — three-column layout */}
      <div className="grid flex-1 gap-5 px-6 pb-8 lg:grid-cols-[300px_1fr_340px]">
        {/* Left: core directories — at-risk employees */}
        <div className="flex flex-col gap-4">
          {/* Departing employees */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="border-b border-[var(--color-border)] px-5 py-4">
              <h3 className="text-[14px] font-bold text-[var(--color-text-primary)]">
                Departing / Offboarded
              </h3>
              <p className="text-[12px] text-[var(--color-text-muted)]">Immediate action required</p>
            </div>
            <ul className="divide-y divide-[var(--color-border)]">
              {departing.map((emp) => (
                <li key={emp.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-white text-[13px] font-bold">
                    {emp.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[13px] font-semibold text-[var(--color-text-primary)]">{emp.name}</p>
                    <p className="font-mono-data truncate text-[11px] text-[var(--color-text-muted)]">{emp.email}</p>
                  </div>
                  <Badge variant={emp.status === "departing" ? "high" : "critical"}>
                    {emp.status}
                  </Badge>
                </li>
              ))}
            </ul>
            <div className="border-t border-[var(--color-border)] px-5 py-3">
              <Link
                href="/dashboard/employees"
                className="text-[12.5px] text-[var(--color-accent)] hover:underline"
              >
                View all employees →
              </Link>
            </div>
          </div>

          {/* Top shadow spenders */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="border-b border-[var(--color-border)] px-5 py-4">
              <h3 className="text-[14px] font-bold text-[var(--color-text-primary)]">Top Shadow Spenders</h3>
            </div>
            <ul className="divide-y divide-[var(--color-border)]">
              {EMPLOYEES.sort(
                (a, b) =>
                  b.shadowApps.reduce((s, x) => s + x.monthlySpend, 0) -
                  a.shadowApps.reduce((s, x) => s + x.monthlySpend, 0)
              )
                .slice(0, 4)
                .map((emp) => {
                  const spend = emp.shadowApps.reduce((s, x) => s + x.monthlySpend, 0);
                  return (
                    <li key={emp.id} className="flex items-center justify-between gap-3 px-5 py-3">
                      <Link
                        href={`/dashboard/employee/${emp.id}`}
                        className="flex min-w-0 items-center gap-2.5 group"
                      >
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent)] text-[11px] font-bold">
                          {emp.avatar}
                        </div>
                        <span className="truncate text-[12.5px] font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition">
                          {emp.name}
                        </span>
                      </Link>
                      <span className="font-mono-data text-[12px] font-semibold text-[var(--color-danger)]">
                        ${spend}/mo
                      </span>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>

        {/* Center: surfaced shadow IT apps */}
        <div>
          <div className="mb-3">
            <h3 className="text-[14px] font-bold text-[var(--color-text-primary)]">Surfaced Shadow IT</h3>
            <p className="text-[12px] text-[var(--color-text-muted)]">Unmapped apps, ranked by risk and spend</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {surfaced.map((row) => (
              <Card
                key={row.id}
                elevated={row.riskLevel === "critical" || row.riskLevel === "high"}
                className="flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-bold text-[var(--color-text-primary)]">{row.appName}</p>
                    <p className="text-[11.5px] text-[var(--color-text-muted)]">{row.category}</p>
                  </div>
                  <Badge variant={row.riskLevel}>{row.riskLevel}</Badge>
                </div>
                <p className="text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
                  Used by <span className="font-semibold text-[var(--color-text-primary)]">{row.employeeName}</span>
                  {" "}· via {row.discoveredVia}
                </p>
                <div className="mt-auto flex items-center justify-between pt-1">
                  <span className={`font-mono-data text-[15px] font-semibold ${row.monthlySpend > 0 ? "text-[var(--color-danger)]" : "text-[var(--color-text-muted)]"}`}>
                    {row.monthlySpend > 0 ? `$${row.monthlySpend}/mo` : "Free"}
                  </span>
                  <Link
                    href={`/dashboard/employee/${row.employeeId}`}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-accent)] hover:underline"
                  >
                    Review <ExternalLink size={11} />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: action hub / alerts */}
        <div>
          <AlertsFeed />
        </div>
      </div>
    </div>
  );
}
