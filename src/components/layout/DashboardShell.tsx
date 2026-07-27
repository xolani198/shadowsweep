"use client";

import Sidebar from "./Sidebar";
import { CommandPaletteProvider } from "@/components/command/CommandPalette";
import { MobileNavProvider, useMobileNav } from "@/contexts/MobileNavContext";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <MobileNavProvider>
      <CommandPaletteProvider>
        <ShellInner>{children}</ShellInner>
      </CommandPaletteProvider>
    </MobileNavProvider>
  );
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useMobileNav();
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
      {/* Mobile scrim */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[var(--color-nav-bg)]/50 md:hidden"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      )}
      <Sidebar />
      <main id="main-content" className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
