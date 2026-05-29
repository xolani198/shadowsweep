// FILE: src/app/dashboard/employees/page.tsx
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import Badge from "@/components/ui/Badge";
import { EMPLOYEES } from "@/lib/mockData";
import { ShieldX, ExternalLink } from "lucide-react";

export default function EmployeesPage() {
  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Employees" subtitle="All monitored personnel" />
      <div className="px-6 py-5">
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
              <tr>
                {["Employee", "Department", "Role", "Status", "Risk Score", "Shadow Apps", "Shadow Spend", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-bg)]">
              {EMPLOYEES.map((emp) => {
                const spend = emp.shadowApps.reduce((s, a) => s + a.monthlySpend, 0);
                return (
                  <tr key={emp.id} className="group hover:bg-[var(--color-surface)] transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)] text-white text-[12px] font-bold flex-shrink-0">
                          {emp.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--color-text-primary)]">{emp.name}</p>
                          <p className="font-mono-data text-[11px] text-[var(--color-text-muted)]">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{emp.department}</td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{emp.role}</td>
                    <td className="px-4 py-3">
                      <Badge variant={emp.status === "active" ? "success" : emp.status === "departing" ? "high" : "critical"}>
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-mono-data font-bold ${emp.riskScore >= 75 ? "text-[var(--color-danger)]" : emp.riskScore >= 50 ? "text-yellow-500" : "text-[var(--color-success)]"}`}>
                        {emp.riskScore}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 font-mono-data font-semibold text-[var(--color-text-secondary)]">
                        <ShieldX size={12} className="text-[var(--color-danger)]" />
                        {emp.shadowApps.length}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-mono-data font-semibold ${spend > 0 ? "text-[var(--color-danger)]" : "text-[var(--color-text-muted)]"}`}>
                        {spend > 0 ? `$${spend}/mo` : "$0"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/employee/${emp.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--color-text-secondary)] opacity-0 group-hover:opacity-100 transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                      >
                        Offboard <ExternalLink size={11} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
