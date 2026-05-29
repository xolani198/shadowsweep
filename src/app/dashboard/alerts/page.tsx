"use client";

import { useState } from "react";
import { Bell, AlertTriangle, Info, Zap, Users, DollarSign, Shield } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Badge from "@/components/ui/Badge";
import { ALERTS, Alert } from "@/lib/mockData";
import Link from "next/link";

const TYPE_ICONS: Record<Alert["type"], React.ElementType> = {
  new_app: Shield,
  departed_employee: Users,
  spend_anomaly: DollarSign,
  data_access: AlertTriangle,
};

const SEVERITY_ICONS: Record<Alert["severity"], React.ElementType> = {
  critical: Zap,
  warning: AlertTriangle,
  info: Info,
};

const PAGE_SIZE = 10;

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(alerts.length / PAGE_SIZE);
  const paged = alerts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function markAllRead() {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  }

  function formatTime(ts: string) {
    const d = new Date(ts);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Alerts" subtitle={`${alerts.filter((a) => !a.read).length} unread`} />

      <div className="px-6 py-5 max-w-4xl space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-[var(--color-accent)]" />
            <h2 className="text-[15px] font-bold text-[var(--color-text-primary)]">
              All Alerts ({alerts.length})
            </h2>
          </div>
          <button
            onClick={markAllRead}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Mark all read
          </button>
        </div>

        {/* Alert rows */}
        <div className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          {paged.map((alert) => {
            const TypeIcon = TYPE_ICONS[alert.type];
            return (
              <div
                key={alert.id}
                className={`flex items-start gap-4 px-5 py-4 transition ${
                  !alert.read ? "bg-[var(--color-accent-subtle)]/30" : ""
                }`}
              >
                {/* Type icon */}
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-border)]">
                  <TypeIcon size={15} className="text-[var(--color-text-secondary)]" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span
                      className={`text-[13.5px] font-semibold ${
                        alert.read
                          ? "text-[var(--color-text-secondary)]"
                          : "text-[var(--color-text-primary)]"
                      }`}
                    >
                      {alert.title}
                    </span>
                    <Badge variant={alert.severity === "info" ? "neutral" : alert.severity === "warning" ? "high" : "critical"}>
                      {alert.severity}
                    </Badge>
                    {!alert.read && (
                      <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                    )}
                  </div>
                  <p className="text-[12.5px] text-[var(--color-text-muted)] leading-relaxed">
                    {alert.description}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11.5px] text-[var(--color-text-muted)]">
                    <span className="font-mono-data">{formatTime(alert.timestamp)}</span>
                    {alert.employeeId && (
                      <Link
                        href={`/dashboard/employee/${alert.employeeId}`}
                        className="text-[var(--color-accent)] hover:underline"
                      >
                        {alert.employeeName}
                      </Link>
                    )}
                    {alert.appName && (
                      <span className="rounded-full bg-[var(--color-border)] px-2 py-0.5 font-mono-data">
                        {alert.appName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-1">
            <p className="text-[12.5px] text-[var(--color-text-muted)]">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
