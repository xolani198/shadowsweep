// FILE: src/components/dashboard/MetricsBanner.tsx
"use client";
import { useEffect, useState } from "react";
import { Users, ShieldAlert, DollarSign, TrendingUp } from "lucide-react";
import { METRICS } from "@/lib/mockData";

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
  danger?: boolean;
  loading?: boolean;
}

function MetricCard({ icon: Icon, label, value, sub, accent, danger, loading }: MetricCardProps) {
  const iconBg = danger
    ? "bg-red-100 dark:bg-red-900/20"
    : accent
    ? "bg-[var(--color-accent-subtle)]"
    : "bg-[var(--color-border)]";
  const iconColor = danger
    ? "text-[var(--color-danger)]"
    : accent
    ? "text-[var(--color-accent)]"
    : "text-[var(--color-text-secondary)]";

  return (
    <div className="flex flex-1 items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 min-w-[200px]">
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        {loading ? (
          <div className="skeleton h-5 w-5 rounded" />
        ) : (
          <Icon size={20} className={iconColor} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-[var(--color-text-muted)]">{label}</p>
        {loading ? (
          <>
            <div className="skeleton mt-1 h-7 w-20 rounded" />
            <div className="skeleton mt-1.5 h-3 w-28 rounded" />
          </>
        ) : (
          <>
            <p className="font-mono-data text-[24px] font-extrabold leading-tight text-[var(--color-text-primary)]">
              {value}
            </p>
            <p className="text-[11.5px] text-[var(--color-text-muted)]">{sub}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function MetricsBanner() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-wrap gap-4 px-6 py-5">
      <MetricCard
        icon={Users}
        label="Monitored Employees"
        value={String(METRICS.monitoredEmployees)}
        sub="+2 since last week"
        loading={!ready}
      />
      <MetricCard
        icon={ShieldAlert}
        label="Vulnerability Score"
        value={`${METRICS.vulnerabilityScore}/100`}
        sub="High — action required"
        danger
        loading={!ready}
      />
      <MetricCard
        icon={DollarSign}
        label="Wasted Monthly Spend"
        value={`$${METRICS.wastedMonthlySpend.toLocaleString()}`}
        sub={`Across ${METRICS.shadowAppsTotal} shadow apps`}
        accent
        loading={!ready}
      />
      <MetricCard
        icon={TrendingUp}
        label="Critical Alerts"
        value={String(METRICS.criticalAlerts)}
        sub="Unread — needs review"
        danger
        loading={!ready}
      />
    </div>
  );
}
