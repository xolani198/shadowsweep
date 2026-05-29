"use client";

import { useState } from "react";
import { Building2, Users, Plug } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import { INTEGRATIONS, Integration } from "@/lib/mockData";

export default function SettingsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);

  function toggleIntegration(id: string) {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i))
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Settings" />

      <div className="px-6 py-5 max-w-3xl space-y-8">
        {/* Section 1: Workspace */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Building2 size={15} className="text-[var(--color-accent)]" />
            <h2 className="text-[14px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
              Workspace
            </h2>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] divide-y divide-[var(--color-border)]">
            <Row label="Organization name">
              <input
                defaultValue="Acme Corp"
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-[13px] text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none w-56"
              />
            </Row>
            <Row label="Admin email">
              <input
                defaultValue="admin@acmecorp.io"
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-[13px] font-mono-data text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none w-56"
              />
            </Row>
            <Row label="Plan">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-3 py-1 text-[11.5px] font-bold text-white">
                Pro
              </span>
            </Row>
            <Row label="Members">
              <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
                <Users size={14} />
                <span>5 active members</span>
              </div>
            </Row>
          </div>
        </section>

        {/* Section 2: Integrations */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Plug size={15} className="text-[var(--color-accent)]" />
            <h2 className="text-[14px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
              Integrations
            </h2>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] divide-y divide-[var(--color-border)]">
            {integrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white text-[11px] font-bold"
                    style={{ backgroundColor: integration.logoColor }}
                  >
                    {integration.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[13.5px] font-semibold text-[var(--color-text-primary)]">
                      {integration.name}
                    </p>
                    <p className="text-[11.5px] text-[var(--color-text-muted)]">
                      {integration.category}
                      {integration.connected && integration.appsDiscovered
                        ? ` · ${integration.appsDiscovered} apps discovered`
                        : ""}
                    </p>
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={integration.connected}
                  onClick={() => toggleIntegration(integration.id)}
                  className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                    integration.connected
                      ? "bg-[var(--color-accent)]"
                      : "bg-[var(--color-border)]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      integration.connected ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <span className="text-[13.5px] text-[var(--color-text-secondary)]">{label}</span>
      {children}
    </div>
  );
}
