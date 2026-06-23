"use client";

import { useState } from "react";
import { Building2, Users, Plug, Save } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { INTEGRATIONS, Integration } from "@/lib/data";

const ORG_DEFAULTS = { name: "Acme Corp", email: "admin@acmecorp.io" };

export default function SettingsPage() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);

  const [orgName, setOrgName] = useState(ORG_DEFAULTS.name);
  const [adminEmail, setAdminEmail] = useState(ORG_DEFAULTS.email);
  const [saving, setSaving] = useState(false);

  const dirty = orgName !== ORG_DEFAULTS.name || adminEmail !== ORG_DEFAULTS.email;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail);

  function saveWorkspace() {
    if (!emailValid) {
      toast({ variant: "error", title: "Invalid admin email", description: "Enter a valid email address." });
      return;
    }
    setSaving(true);
    // Demo persistence: simulate a save round-trip. Wire to a real API in production.
    setTimeout(() => {
      setSaving(false);
      ORG_DEFAULTS.name = orgName;
      ORG_DEFAULTS.email = adminEmail;
      toast({ variant: "success", title: "Workspace saved", description: "Your changes have been applied." });
    }, 700);
  }

  function toggleIntegration(integration: Integration) {
    const next = !integration.connected;
    setIntegrations((prev) =>
      prev.map((i) => (i.id === integration.id ? { ...i, connected: next } : i))
    );
    toast({
      variant: next ? "success" : "info",
      title: next ? `${integration.name} connected` : `${integration.name} disconnected`,
      description: next
        ? "Discovery will include this source on the next sync."
        : "This source will no longer be scanned.",
    });
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
            <Row label="Organization name" htmlFor="org-name">
              <input
                id="org-name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-56 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-[13px] text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
              />
            </Row>
            <Row label="Admin email" htmlFor="admin-email">
              <input
                id="admin-email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                aria-invalid={!emailValid}
                className={`font-mono-data w-56 rounded-lg border bg-[var(--color-bg)] px-3 py-1.5 text-[13px] text-[var(--color-text-primary)] focus:outline-none ${
                  emailValid ? "border-[var(--color-border)] focus:border-[var(--color-accent)]" : "border-[var(--color-danger)]"
                }`}
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
          <div className="mt-3 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              icon={<Save size={13} />}
              loading={saving}
              disabled={!dirty || saving}
              onClick={saveWorkspace}
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
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
                  aria-label={`${integration.connected ? "Disconnect" : "Connect"} ${integration.name}`}
                  onClick={() => toggleIntegration(integration)}
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

function Row({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <label htmlFor={htmlFor} className="text-[13.5px] text-[var(--color-text-secondary)]">
        {label}
      </label>
      {children}
    </div>
  );
}
