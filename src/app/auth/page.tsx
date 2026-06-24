// FILE: src/app/auth/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Logo from "@/components/layout/Logo";
import { useToast } from "@/components/ui/Toast";
import { DEMO_MODE } from "@/lib/config";

type Provider = "google" | "microsoft" | "credentials";

function nextPath(): string {
  if (typeof window === "undefined") return "/dashboard";
  const p = new URLSearchParams(window.location.search).get("next");
  // Only allow internal, absolute-path redirects (no open redirect).
  return p && p.startsWith("/") && !p.startsWith("//") ? p : "/dashboard";
}

export default function AuthPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<Provider | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function login(body: Record<string, unknown>): Promise<boolean> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      window.location.href = nextPath();
      return true;
    }
    const data = await res.json().catch(() => ({}));
    const message = (data as { error?: string }).error || "Sign-in failed. Please try again.";
    setError(message);
    toast({ variant: "error", title: "Sign-in failed", description: message });
    return false;
  }

  async function handleSso(provider: "google" | "microsoft") {
    setError(null);
    setLoading(provider);
    // The marketing demo issues a real (demo-flagged) session via SSO buttons.
    // Wire real OAuth here in production. See README.
    const ok = await login({ mode: "demo" });
    if (!ok) setLoading(null);
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading("credentials");
    const ok = await login({ email, password });
    if (!ok) setLoading(null);
  }

  const busy = loading !== null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="fixed right-5 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[380px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo showText={false} size={48} />
          <div>
            <h1 className="text-[20px] font-extrabold tracking-tight">
              Shadow<span className="text-[var(--color-accent)]">Sweep</span>
            </h1>
            <p className="mt-0.5 text-[12.5px] text-[var(--color-text-muted)]">
              Sign in to your IT workspace
            </p>
          </div>
        </div>

        {DEMO_MODE && (
          <div className="mb-5 rounded-lg border border-[var(--color-accent-muted)] bg-[var(--color-accent-subtle)] px-3 py-2 text-center text-[11.5px] text-[var(--color-accent)]">
            Demo workspace. Single sign-on issues an instant demo session.
          </div>
        )}

        {/* Divider */}
        <div className="mb-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--color-border)]" />
          <span className="text-[11px] text-[var(--color-text-muted)]">Continue with</span>
          <div className="h-px flex-1 bg-[var(--color-border)]" />
        </div>

        {/* Google */}
        <button
          onClick={() => handleSso("google")}
          disabled={busy}
          className="mb-3 flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 text-[13.5px] font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading === "google" ? (
            <Spinner />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {loading === "google" ? "Signing in…" : "Sign in with Google"}
        </button>

        {/* Microsoft */}
        <button
          onClick={() => handleSso("microsoft")}
          disabled={busy}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 text-[13.5px] font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading === "microsoft" ? (
            <Spinner />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 21 21" aria-hidden>
              <rect width="10" height="10" fill="#F25022" />
              <rect x="11" width="10" height="10" fill="#7FBA00" />
              <rect y="11" width="10" height="10" fill="#00A4EF" />
              <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
            </svg>
          )}
          {loading === "microsoft" ? "Signing in…" : "Sign in with Microsoft"}
        </button>

        {/* Email / password */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--color-border)]" />
          <span className="text-[11px] text-[var(--color-text-muted)]">or with email</span>
          <div className="h-px flex-1 bg-[var(--color-border)]" />
        </div>

        <form onSubmit={handleCredentials} className="space-y-3">
          <div>
            <label htmlFor="email" className="sr-only">Work email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
              className="font-mono-data w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-[13px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none disabled:opacity-60"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-[13px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none disabled:opacity-60"
            />
          </div>

          {error && (
            <p className="text-[12px] text-[var(--color-danger)]" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-[var(--color-accent-hover)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading === "credentials" ? <Spinner light /> : <Lock size={14} />}
            {loading === "credentials" ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-[11.5px] leading-relaxed text-[var(--color-text-muted)]">
          By signing in, you agree to ShadowSweep&apos;s{" "}
          <Link href="/legal/terms" className="text-[var(--color-accent)] hover:underline">Terms of Service</Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="text-[var(--color-accent)] hover:underline">Privacy Policy</Link>.
        </p>

        <Link
          href="/"
          className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition"
        >
          <ArrowLeft size={12} />
          Back to home
        </Link>
      </div>
    </div>
  );
}

function Spinner({ light = false }: { light?: boolean }) {
  return (
    <svg
      className={`h-5 w-5 animate-spin ${light ? "text-white" : "text-[var(--color-accent)]"}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
