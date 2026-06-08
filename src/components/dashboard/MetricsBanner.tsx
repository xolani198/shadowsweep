"use client";
import { useState, useEffect } from "react";
import { Users, ShieldAlert, DollarSign, Activity } from "lucide-react";
import { METRICS } from "@/lib/mockData";

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  accentColor: string;
  iconBg: string;
  iconColor: string;
  loading: boolean;
}

function MetricCard({ icon: Icon, label, value, sub, accentColor, iconBg, iconColor, loading }: MetricCardProps) {
  return (
    <div className="relative flex flex-1 flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 min-w-[190px] overflow-hidden">
      {/* top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: accentColor }} />

      {loading ? (
        <>
          <div className="skeleton h-9 w-9 rounded-lg" />
          <div className="space-y-1.5">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-7 w-28 rounded" />
            <div className="skeleton h-2.5 w-24 rounded" />
          </div>
        </>
      ) : (
        <>
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon size={17} className={iconColor} />
          </div>
          <div>
            <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">{label}</p>
            <p className="font-mono-data mt-0.5 text-[26px] font-extrabold leading-tight tracking-tight text-[var(--color-text-primary)]">
              {value}
            </p>
            <p className="mt-0.5 text-[11.5px] text-[var(--color-text-muted)]">{sub}</p>
          </div>
        </>
      )}
    </div>
  );
}

const CARDS = [
  {
    icon: Users,
    label: "Monitored Employees",
    value: String(METRICS.monitoredEmployees),
    sub: "+2 since last week",
    accentColor: "#38BDF8",
    iconBg: "bg-sky-50 dark:bg-sky-950/40",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    icon: ShieldAlert,
    label: "Vulnerability Score",
    value: `${METRICS.vulnerabilityScore}/100`,
    sub: "High — action required",
    accentColor: "#F87171",
    iconBg: "bg-red-50 dark:bg-red-950/40",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    icon: DollarSign,
    label: "Wasted Monthly Spend",
    value: `$${METRICS.wastedMonthlySpend.toLocaleString()}`,
    sub: `Across ${METRICS.shadowAppsTotal} shadow apps`,
    accentColor: "#FCD34D",
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: Activity,
    label: "Critical Alerts",
    value: String(METRICS.criticalAlerts),
    sub: "Unread — needs review",
    accentColor: "#F87171",
    iconBg: "bg-red-50 dark:bg-red-950/40",
    iconColor: "text-red-600 dark:text-red-400",
  },
];

export default function MetricsBanner() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-wrap gap-4 px-6 py-5">
      {CARDS.map((card) => (
        <MetricCard key={card.label} {...card} loading={loading} />
      ))}
    </div>
  );
}
