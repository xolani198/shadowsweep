import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] px-6 text-center">
      <div className="mb-8">
        <Logo size={32} />
      </div>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)]">
        <Compass size={26} className="text-[var(--color-accent)]" strokeWidth={1.75} />
      </div>
      <p className="font-mono-data mt-6 text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
        Error 404
      </p>
      <h1 className="mt-2 text-[28px] font-extrabold tracking-tight text-[var(--color-text-primary)]">
        This page went dark
      </h1>
      <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get
        you back to safety.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
        >
          <ArrowLeft size={14} /> Back to home
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-strong)] px-5 py-2.5 text-[13px] font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          Open the dashboard
        </Link>
      </div>
    </div>
  );
}
