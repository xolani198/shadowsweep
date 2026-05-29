// FILE: src/app/dashboard/discovery/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  ExternalLink,
  Wifi,
  WifiOff,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  INTEGRATIONS,
  DISCOVERY_ROWS,
  DiscoveryRow,
  Integration,
} from "@/lib/mockData";

// ── Integration Card ───────────────────────────────────────────────────────

function IntegrationCard({ int: i }: { int: Integration }) {
  const [syncing, setSyncing] = useState(false);
  const [connected, setConnected] = useState(i.connected);

  function handleConnect() {
    setSyncing(true);
    setTimeout(() => {
      setConnected(true);
      setSyncing(false);
    }, 2000);
  }

  function formatSync(ts?: string) {
    if (!ts) return "—";
    const diff = Date.now() - new Date(ts).getTime();
    const h = Math.floor(diff / 3600000);
    return h < 1 ? "Just now" : `${h}h ago`;
  }

  return (
    <Card className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white text-[15px] font-black"
            style={{ backgroundColor: i.logoColor }}
          >
            {i.name.charAt(0)}
          </div>
          <div>
            <p className="text-[14px] font-bold text-[var(--color-text-primary)]">{i.name}</p>
            <p className="text-[11px] text-[var(--color-text-muted)]">{i.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {connected ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-success)]">
              <Wifi size={12} /> Connected
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-text-muted)]">
              <WifiOff size={12} /> Not connected
            </span>
          )}
        </div>
      </div>

      <p className="text-[12.5px] leading-relaxed text-[var(--color-text-secondary)]">{i.description}</p>

      {/* Stats */}
      {connected && (
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-[var(--color-bg)] p-3 border border-[var(--color-border)]">
          <div>
            <p className="text-[10.5px] text-[var(--color-text-muted)]">Apps discovered</p>
            <p className="font-mono-data text-[18px] font-bold text-[var(--color-accent)]">
              {i.appsDiscovered ?? 0}
            </p>
          </div>
          <div>
            <p className="text-[10.5px] text-[var(--color-text-muted)]">Last sync</p>
            <p className="font-mono-data text-[13px] font-semibold text-[var(--color-text-primary)]">
              {formatSync(i.lastSync)}
            </p>
          </div>
        </div>
      )}

      {/* Action */}
      {connected ? (
        <Button
          variant="secondary"
          size="sm"
          loading={syncing}
          icon={<RefreshCw size={13} />}
          onClick={() => {
            setSyncing(true);
            setTimeout(() => setSyncing(false), 1500);
          }}
        >
          {syncing ? "Syncing…" : "Sync now"}
        </Button>
      ) : (
        <Button variant="primary" size="sm" loading={syncing} onClick={handleConnect}>
          {syncing ? "Connecting…" : "Connect"}
        </Button>
      )}
    </Card>
  );
}

// ── Risk dot ──────────────────────────────────────────────────────────────

const RISK_DOT: Record<DiscoveryRow["riskLevel"], string> = {
  low:      "bg-green-500",
  medium:   "bg-yellow-500",
  high:     "bg-orange-500",
  critical: "bg-red-500",
};

// ── Main Page ─────────────────────────────────────────────────────────────

export default function DiscoveryPage() {
  const [filter, setFilter] = useState<DiscoveryRow["riskLevel"] | "all">("all");
  const [sortField, setSortField] = useState<keyof DiscoveryRow>("monthlySpend");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = DISCOVERY_ROWS.filter(
    (r) => filter === "all" || r.riskLevel === filter
  ).sort((a, b) => {
    const av = a[sortField];
    const bv = b[sortField];
    const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
    return sortDir === "desc" ? -cmp : cmp;
  });

  function toggleSort(field: keyof DiscoveryRow) {
    if (field === sortField) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  }

  const totalSpend = filtered.reduce((s, r) => s + r.monthlySpend, 0);

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Discovery Engine" subtitle="Integrations + parsed shadow IT data" />

      <div className="px-6 py-5 space-y-6">
        {/* Integrations grid */}
        <div>
          <h2 className="mb-3 text-[13px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            Connected Integrations
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {INTEGRATIONS.map((int) => (
              <IntegrationCard key={int.id} int={int} />
            ))}
          </div>
        </div>

        {/* Shadow IT Table */}
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[13px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                Discovered Shadow IT
              </h2>
              <p className="mt-0.5 text-[12px] text-[var(--color-text-muted)]">
                {filtered.length} records · <span className="font-mono-data font-semibold text-[var(--color-danger)]">${totalSpend}/mo</span> total waste
              </p>
            </div>
            {/* Filter pills */}
            <div className="flex items-center gap-2">
              <Filter size={13} className="text-[var(--color-text-muted)]" />
              {(["all", "critical", "high", "medium", "low"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilter(lvl)}
                  className={`rounded-full px-3 py-1 text-[11.5px] font-semibold capitalize transition ${
                    filter === lvl
                      ? "bg-[var(--color-accent)] text-white"
                      : "bg-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <tr>
                  {[
                    { label: "Employee", field: "employeeName" as keyof DiscoveryRow },
                    { label: "App", field: "appName" as keyof DiscoveryRow },
                    { label: "Category", field: "category" as keyof DiscoveryRow },
                    { label: "Monthly Spend", field: "monthlySpend" as keyof DiscoveryRow },
                    { label: "Discovered Via", field: "discoveredVia" as keyof DiscoveryRow },
                    { label: "Risk", field: "riskLevel" as keyof DiscoveryRow },
                    { label: "Last Access", field: "lastAccessed" as keyof DiscoveryRow },
                    { label: "", field: "id" as keyof DiscoveryRow },
                  ].map(({ label, field }) => (
                    <th
                      key={field}
                      onClick={() => label && toggleSort(field)}
                      className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)] ${
                        label ? "cursor-pointer hover:text-[var(--color-text-primary)]" : ""
                      }`}
                    >
                      {label}
                      {sortField === field && label && (
                        <span className="ml-1">{sortDir === "desc" ? "↓" : "↑"}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-bg)]">
                {filtered.map((row) => (
                  <tr key={row.id} className="group hover:bg-[var(--color-surface)] transition">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-[var(--color-text-primary)]">{row.employeeName}</p>
                        <p className="font-mono-data text-[11px] text-[var(--color-text-muted)]">{row.employeeEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--color-text-primary)]">{row.appName}</td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{row.category}</td>
                    <td className="px-4 py-3">
                      <span className={`font-mono-data font-bold ${row.monthlySpend > 0 ? "text-[var(--color-danger)]" : "text-[var(--color-text-muted)]"}`}>
                        {row.monthlySpend > 0 ? `$${row.monthlySpend}/mo` : "Free"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{row.discoveredVia}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${RISK_DOT[row.riskLevel]}`} />
                        <Badge variant={row.riskLevel}>{row.riskLevel}</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono-data text-[11.5px] text-[var(--color-text-muted)]">
                      {row.lastAccessed}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/employee/${row.employeeId}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--color-text-secondary)] opacity-0 group-hover:opacity-100 transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                      >
                        Offboard <ExternalLink size={11} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-14 text-[var(--color-text-muted)]">
                <CheckCircle2 size={28} className="text-[var(--color-success)]" />
                <p className="text-[14px] font-semibold">No shadow apps found for this filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
