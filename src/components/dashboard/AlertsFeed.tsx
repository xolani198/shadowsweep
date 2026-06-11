// FILE: src/components/dashboard/AlertsFeed.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Info,
  XCircle,
  UserMinus,
  CreditCard,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import { ALERTS, Alert } from "@/lib/mockData";
import Badge from "@/components/ui/Badge";

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TYPE_ICONS: Record<Alert["type"], React.ElementType> = {
  new_app:           PlusCircle,
  departed_employee: UserMinus,
  spend_anomaly:     CreditCard,
  data_access:       XCircle,
};

const SEV_STYLES: Record<Alert["severity"], string> = {
  critical: "border-l-[var(--color-danger)]",
  warning:  "border-l-[var(--color-warning)]",
  info:     "border-l-[var(--color-accent)]",
};

const SEV_ICON_COLOR: Record<Alert["severity"], string> = {
  critical: "text-[var(--color-danger)]",
  warning:  "text-[var(--color-warning)]",
  info:     "text-[var(--color-accent)]",
};

export default function AlertsFeed() {
  const [alerts, setAlerts] = useState(ALERTS);

  function markRead(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  }

  const unread = alerts.filter((a) => !a.read).length;

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <AlertTriangle size={16} className="text-[var(--color-accent)]" />
          <span className="text-[14px] font-bold text-[var(--color-text-primary)]">Recent Alerts</span>
          {unread > 0 && (
            <span className="flex h-5 items-center justify-center rounded-full bg-[var(--color-danger)] px-2 text-[10px] font-bold text-white">
              {unread} new
            </span>
          )}
        </div>
        <button
          onClick={() => setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))}
          className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
        >
          Mark all read
        </button>
      </div>

      {/* Rows */}
      <ul className="divide-y divide-[var(--color-border)]">
        {alerts.map((alert) => {
          const TypeIcon = TYPE_ICONS[alert.type];
          return (
            <li
              key={alert.id}
              className={`flex items-start gap-4 border-l-2 px-5 py-4 transition ${SEV_STYLES[alert.severity]} ${
                alert.read ? "opacity-50" : ""
              }`}
            >
              <div className={`mt-0.5 flex-shrink-0 ${SEV_ICON_COLOR[alert.severity]}`}>
                <TypeIcon size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-[13px] font-semibold ${alert.read ? "" : "text-[var(--color-text-primary)]"}`}>
                    {alert.title}
                  </p>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <Badge variant={alert.severity === "info" ? "info" : alert.severity === "warning" ? "medium" : "critical"}>
                      {alert.severity}
                    </Badge>
                    <span className="font-mono-data text-[11px] text-[var(--color-text-muted)]">
                      {timeAgo(alert.timestamp)}
                    </span>
                  </div>
                </div>
                <p className="mt-0.5 text-[12.5px] text-[var(--color-text-secondary)]">{alert.description}</p>
                <div className="mt-2 flex items-center gap-3">
                  {alert.employeeId && (
                    <Link
                      href={`/dashboard/employee/${alert.employeeId}`}
                      className="inline-flex items-center gap-1 text-[12px] text-[var(--color-accent)] hover:underline"
                    >
                      View employee <ExternalLink size={11} />
                    </Link>
                  )}
                  {!alert.read && (
                    <button
                      onClick={() => markRead(alert.id)}
                      className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
