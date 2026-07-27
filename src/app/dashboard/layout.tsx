// FILE: src/app/dashboard/layout.tsx
import type { Metadata } from "next";
import DashboardShell from "@/components/layout/DashboardShell";

// A title template only applies one segment down, so the dashboard restates it
// for its own children; otherwise nested pages lose the brand suffix.
export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · ShadowSweep" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
