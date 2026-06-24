"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import Badge from "@/components/ui/Badge";

interface AuditEntry {
  id: string;
  ts: string;
  action: string;
  actor: string;
  targetType?: string;
  targetId?: string;
  outcome: "success" | "failure" | "denied";
  ip?: string;
}

const ACTION_LABEL: Record<string, string> = {
  login: "Sign in",
  login_failed: "Failed sign in",
  logout: "Sign out",
  offboard_preview: "Offboard preview",
  offboard_execute: "Offboard executed",
  offboard_undo: "Offboard undone",
  authz_denied: "Permission denied",
};

function outcomeVariant(outcome: AuditEntry["outcome"]): "success" | "high" | "critical" {
  if (outcome === "denied") return "critical";
  if (outcome === "failure") return "high";
  return "success";
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function SecurityEvents() {
  const [entries, setEntries] = useState<AuditEntry[] | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "forbidden" | "error">("loading");

  useEffect(() => {
    let active = true;
    fetch("/api/audit")
      .then(async (r) => {
        if (!active) return;
        if (r.status === 403) return setState("forbidden");
        if (!r.ok) return setState("error");
        const data = await r.json();
        setEntries(data.entries ?? []);
        setState("ready");
      })
      .catch(() => active && setState("error"));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-5 py-3.5">
        <ShieldCheck size={15} className="text-[var(--color-accent)]" />
        <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">Recent security events</p>
      </div>

      {state === "loading" && (
        <div className="space-y-2 p-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-9 w-full" />
          ))}
        </div>
      )}

      {state === "forbidden" && (
        <p className="px-5 py-6 text-[12.5px] text-[var(--color-text-muted)]">
          The audit trail is visible to admins only.
        </p>
      )}

      {state === "error" && (
        <p className="px-5 py-6 text-[12.5px] text-[var(--color-text-muted)]">
          Could not load security events.
        </p>
      )}

      {state === "ready" && entries && entries.length === 0 && (
        <p className="px-5 py-6 text-[12.5px] text-[var(--color-text-muted)]">No events recorded yet.</p>
      )}

      {state === "ready" && entries && entries.length > 0 && (
        <ul className="divide-y divide-[var(--color-border)]">
          {entries.map((e) => (
            <li key={e.id} className="flex items-center gap-3 px-5 py-3">
              <Badge variant={outcomeVariant(e.outcome)}>{e.outcome}</Badge>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-medium text-[var(--color-text-primary)]">
                  {ACTION_LABEL[e.action] ?? e.action}
                  {e.targetId ? <span className="text-[var(--color-text-muted)]"> · {e.targetId}</span> : null}
                </p>
                <p className="truncate font-mono-data text-[11px] text-[var(--color-text-muted)]">
                  {e.actor}
                  {e.ip ? ` · ${e.ip}` : ""}
                </p>
              </div>
              <span className="flex-shrink-0 font-mono-data text-[11px] text-[var(--color-text-muted)]">
                {timeAgo(e.ts)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
