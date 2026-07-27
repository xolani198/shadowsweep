import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/layout/Logo";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { BILLING_ENABLED } from "@/lib/config";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <nav className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link href="/" aria-label="ShadowSweep home">
            <Logo size={26} />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent)]"
            >
              <ArrowLeft size={14} /> Home
            </Link>
          </div>
        </div>
      </nav>

      <main id="main-content" className="mx-auto max-w-3xl px-6 py-14">{children}</main>

      <footer
        className="mt-10"
        style={{ background: "var(--color-nav-bg)", borderTop: "1px solid var(--color-nav-border)" }}
      >
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <Logo size={22} textClassName="text-white" />
          <div className="flex flex-wrap items-center gap-4 text-[12px]" style={{ color: "var(--color-nav-text)" }}>
            <Link href="/legal/terms" className="hover:text-white">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-white">Privacy</Link>
            {BILLING_ENABLED && (
              <Link href="/legal/refund" className="hover:text-white">Refunds</Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
