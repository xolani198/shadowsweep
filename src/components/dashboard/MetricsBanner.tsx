"use client";
import { useState, useEffect } from "react";
import { Users, ShieldAlert, DollarSign, Activity, ArrowUp, ArrowDown } from "lucide-react";
import { METRICS } from "@/lib/data";

type Tone = "positive" | "negative" | "neutral";

function Sparkline({ data, colorVar }: { data: number[]; colorVar: string }) {
  const w = 72;
  const h = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const x = (i: number) => (i / (data.length - 1)) * w;
  const y = (d: number) => h - ((d - min) / range) * (h - 3) - 1.5;
  const points = data.map((d, i) => `${x(i).toFixed(1)},${y(d).toFixed(1)}`).join(" ");
  const lastX = x(data.length - 1);
  const lastY = y(data[data.length - 1]);

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ color: colorVar }}
      className="overflow-visible"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r={2} fill="currentColor" />
    </svg>
  );
}

function DeltaChip({ tone, label }: { tone: Tone; label: string }) {
  const color =
    tone === "negative"
      ? "var(--color-danger)"
      : tone === "positive"
      ? "var(--color-success)"
      : "var(--color-text-muted)";
  const Arrow = tone === "negative" ? ArrowUp : tone === "positive" ? ArrowUp : ArrowDown;
  return (
    <span
      className="inline-flex items-center gap-0.5 font-mono-data text-[11px] font-semibold"
      style={{ color }}
    >
      <Arrow size={11} strokeWidth={2.5} />
      {label}
    </span>
  );
}

interface MetricCellProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  valueClass?: string;
  series: number[];
  seriesColor: string;
  deltaTone: Tone;
  deltaLabel: string;
  loading: boolean;
}

function MetricCell({
  icon: Icon,
  label,
  value,
  sub,
  valueClass = "",
  series,
  seriesColor,
  deltaTone,
  deltaLabel,
  loading,
}: MetricCellProps) {
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
      <div className="mt-2 flex items-end justify-between gap-2">
        <p
          className={`font-mono-data text-[26px] font-semibold leading-none tracking-tight text-[var(--color-text-primary)] ${valueClass}`}
        >
          {value}
        </p>
        <Sparkline data={series} colorVar={seriesColor} />
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <DeltaChip tone={deltaTone} label={deltaLabel} />
        <span className="text-[11.5px] text-[var(--color-text-muted)]">{sub}</span>
      </div>
    </div>
  );
}

const CELLS = [
  {
    icon: Users,
    label: "Monitored employees",
    value: String(METRICS.monitoredEmployees),
    sub: "since last week",
    series: [3, 3, 4, 4, 4, 5, 5],
    seriesColor: "var(--color-accent)",
    deltaTone: "positive" as Tone,
    deltaLabel: "+2",
  },
  {
    icon: ShieldAlert,
    label: "Vulnerability score",
    value: `${METRICS.vulnerabilityScore}/100`,
    sub: "High — action required",
    valueClass: "!text-[var(--color-danger)]",
    series: [58, 61, 60, 66, 69, 71, 74],
    seriesColor: "var(--color-danger)",
    deltaTone: "negative" as Tone,
    deltaLabel: "6 pts",
  },
  {
    icon: DollarSign,
    label: "Wasted monthly spend",
    value: `$${METRICS.wastedMonthlySpend.toLocaleString()}`,
    sub: `across ${METRICS.shadowAppsTotal} shadow apps`,
    series: [520, 560, 540, 610, 670, 780, METRICS.wastedMonthlySpend || 900],
    seriesColor: "var(--color-danger)",
    deltaTone: "negative" as Tone,
    deltaLabel: "34%",
  },
  {
    icon: Activity,
    label: "Critical alerts",
    value: String(METRICS.criticalAlerts),
    sub: "unread — needs review",
    valueClass: "!text-[var(--color-danger)]",
    series: [1, 1, 2, 1, 2, 3, METRICS.criticalAlerts || 3],
    seriesColor: "var(--color-danger)",
    deltaTone: "negative" as Tone,
    deltaLabel: "+2",
  },
];

export default function MetricsBanner() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="px-4 py-5 sm:px-6">
      {/* Single divided container — gap-px over border colour renders hairline rules */}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
        {CELLS.map((cell) => (
          <MetricCell key={cell.label} {...cell} loading={loading} />
        ))}
      </div>
    </div>
  );
}
