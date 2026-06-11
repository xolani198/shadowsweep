"use client";
import { useState, useEffect } from "react";
import { Users, ShieldAlert, DollarSign, Activity } from "lucide-react";
import { METRICS } from "@/lib/mockData";

interface MetricCellProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  valueClass?: string;
  loading: boolean;
}

function MetricCell({ icon: Icon, label, value, sub, valueClass = "", loading }: MetricCellProps) {
  if (loading) {
    return (
      <div className="space-y-2 bg-[var(--color-surface)] p-5">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-7 w-28" />
        <div className="skeleton h-2.5 w-32" />
      </div>
    );
  }
  return (
    <div className="bg-[var(--color-surface)] p-5">
      <div className="flex items-center gap-1.5">
        <Icon size={12} className="text-[var(--color-text-muted)]" strokeWidth={2} />
        <span className="micro-label">{label}</span>
      </div>
      <p className={`font-mono-data mt-2 text-[26px] font-semibold leading-none tracking-tight text-[var(--color-text-primary)] ${valueClass}`}>
        {value}
      </p>
      <p className="mt-1.5 text-[11.5px] text-[var(--color-text-muted)]">{sub}</p>
    </div>
  );
}

const CELLS = [
  {
    icon: Users,
    label: "Monitored employees",
    value: String(METRICS.monitoredEmployees),
    sub: "+2 since last week",
  },
  {
    icon: ShieldAlert,
    label: "Vulnerability score",
    value: `${METRICS.vulnerabilityScore}/100`,
    sub: "High — action required",
    valueClass: "!text-[var(--color-danger)]",
  },
  {
    icon: DollarSign,
    label: "Wasted monthly spend",
    value: `$${METRICS.wastedMonthlySpend.toLocaleString()}`,
    sub: `Across ${METRICS.shadowAppsTotal} shadow apps`,
  },
  {
    icon: Activity,
    label: "Critical alerts",
    value: String(METRICS.criticalAlerts),
    sub: "Unread — needs review",
    valueClass: "!text-[var(--color-danger)]",
  },
];

export default function MetricsBanner() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="px-6 py-5">
      {/* Single divided container — gap-px over border colour renders hairline rules */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-border)] lg:grid-cols-4">
        {CELLS.map((cell) => (
          <MetricCell key={cell.label} {...cell} loading={loading} />
        ))}
      </div>
    </div>
  );
}
