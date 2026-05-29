// FILE: src/app/dashboard/page.tsx
import TopBar from "@/components/layout/TopBar";
import MetricsBanner from "@/components/dashboard/MetricsBanner";
import AlertsFeed from "@/components/dashboard/AlertsFeed";
import { EMPLOYEES } from "@/lib/mockData";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

export default function DashboardPage() {
  const departing = EMPLOYEES.filter((e) => e.status === "departing" || e.status === "offboarded");

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Command Dashboard" subtitle="Real-time shadow IT overview" />

      {/* Metrics */}
      <MetricsBanner />

      {/* Two-column layout */}
      <div className="grid flex-1 gap-5 px-6 pb-8 lg:grid-cols-3">
        {/* Alerts feed — 2/3 width */}
        <div className="lg:col-span-2">
          <AlertsFeed />
        </div>

        {/* At-risk employees — 1/3 width */}
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
      </div>
    </div>
  );
}
