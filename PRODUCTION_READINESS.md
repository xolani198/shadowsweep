# ShadowSweep — Production Readiness Audit

**Audited:** 2026-06-23 · **Branch:** `production-ready` · **Target:** ship to paying enterprise security teams; enable outbound marketing + payments.

This document is the source of truth for launch blockers. Each item is ranked **P0** (blocks launch), **P1** (fix before scaling outbound), or **P2** (polish). Status is updated as work lands.

**Baseline (commit `0e3acb6`):** TypeScript strict ✓ · Production build ✓ · ESLint **was not configured** (fixed) · Playwright tests present (security + revoke flow).

Legend: ☐ open · ◐ in progress · ☑ resolved

---

## Executive summary

ShadowSweep is a visually polished Next.js 14 (App Router) marketing site + product demo. The UI is well-built and the offboard API already has signed-session auth, Zod validation, and security headers — better than the brief implied. The gaps that actually block launch are: **(1) the product is unauthenticated** — every `/dashboard` route prerenders as a public static page and the "login" is a fake `setTimeout` redirect that never establishes a session; **(2) no payments**; **(3) no real auth/session issuance**; **(4) no error/404/500/loading route boundaries**; and **(5) marketing/SEO essentials** (OG tags, sitemap, robots, real favicon, legal pages) are missing. The data layer is 100% mock with no demo/real separation.

---

## ✅ Final status — all engineering phases complete

Every P0 and P1 item below is **resolved in code** on the `production-ready` branch. The only remaining items are **P2 polish** (tracked below) and the **manual account/legal steps** that require the owner's credentials — those are documented step-by-step in [`LAUNCH_CHECKLIST.md`](LAUNCH_CHECKLIST.md). Each phase shipped with `tsc` strict + ESLint + `next build` + Playwright all green (**19/19 tests**).

| Phase | Outcome |
| --- | --- |
| 0 — Audit | This document + ESLint config (lint previously hung CI). |
| 2 — Correctness | 404/500/loading/error boundaries, app-wide toasts, working Settings save, functional testimonial carousel, legal pages, dead-code cleanup, empty states, keyboard-accessible table sort. |
| 3 — Security & data | Real HMAC sessions w/ expiry, login/logout, middleware-protected `/dashboard`, cookie hardening, CSRF origin checks, rate limiting, `DEMO_MODE` data seam, `.env.example`, +auth/expiry/CSRF tests. |
| 1 — UX/UI | ⌘K command palette, KPI sparklines + trend deltas, responsive mobile sidebar drawer, landing pricing wired to checkout. |
| 4 — Payments | Stripe Checkout + billing portal + signature-verified webhooks + subscription status; test-mode env keys only; graceful "not configured" fallback. |
| 5 — Ship | next/font (no render-blocking @import), full SEO metadata, dynamic OG image, SVG favicon, robots.txt, sitemap.xml, README, this doc, LAUNCH_CHECKLIST. |

**Deferred to handoff (need owner credentials, see LAUNCH_CHECKLIST):** Stripe account/keys/products/webhook, Vercel env values + prod promotion, custom domain + DNS/SSL, legal review of templates, email auth (SPF/DKIM/DMARC). **Deferred P2 polish:** shared-store rate limiter, error monitoring (Sentry), analytics, real OAuth + live integrations.

---

## P0 — Blocks launch

### Security & auth
- ☐ **`/dashboard/*` is completely unprotected.** No `middleware.ts`; all dashboard pages prerender as static (`○` in build output). Anyone can read the product without authenticating. → Add edge middleware gating `/dashboard` on a valid session, redirect to `/auth`.
- ☐ **Login is fake.** `src/app/auth/page.tsx` runs `setTimeout(() => window.location.href = "/dashboard", 1500)` and never sets the `ss_session` cookie. The HMAC session machinery in `src/lib/auth.ts` is therefore never exercised by the UI — the offboard API can never be called successfully from the app. → Add a real login route that issues a signed, `HttpOnly` + `Secure` + `SameSite` cookie; wire a "demo sign-in" for the marketing demo.
- ☐ **No sign-out.** No way to clear a session.
- ☐ **Session cookie has no expiry / issued-at.** `Session` payload is `{ userId, orgId }` only — sessions never expire and can't be revoked by age. → Add `exp` and reject expired sessions.

### Payments
- ☐ **No payment integration of any kind.** Pricing CTAs link to `/auth`. No Stripe, no checkout, no billing portal, no webhooks, no subscription gating. This blocks "accept payments." → Phase 4.

### Routing robustness
- ☐ **No `not-found.tsx`, no `error.tsx`, no `global-error.tsx`, no `loading.tsx`.** An unhandled render error shows the raw Next default; there is no branded 404/500 and no error boundary. → Phase 2.

---

## P1 — Fix before scaling outbound

### Technical correctness / dead or non-functional UI
- ☐ **Settings form does nothing.** Org name / admin email are uncontrolled `defaultValue` inputs with no save action; integration toggles mutate local state only and are lost on reload. → Add a working save with toast + persistence (demo: client/localStorage; real: API stub).
- ☐ **Offboard happens only client-side.** `employee/[id]` "Revoke All Access" is a pure 7-step CSS animation; it never calls `POST /api/offboard`. The real authorized API exists but is unused by the UI. → Wire the button to the API (with the demo session).
- ☐ **Decorative buttons that do nothing:** landing "Watch the Demo" (no video/modal), case-study `ChevronLeft/Right` carousel arrows, "Read Full Case Study". → Make functional or remove.
- ☐ **Terms / Privacy are dead `<span>`s.** `auth/page.tsx` references ToS & Privacy with `cursor-pointer` but no `href`; the pages don't exist. Required for taking payments. → Add `/legal/terms`, `/legal/privacy`, `/legal/refund`.
- ☐ **TopBar "Search…" is a non-functional placeholder** (a `<span>`, not an input). Brief asks for a ⌘K command palette. → Phase 1.
- ☐ **Dead code:** `SEVERITY_ICONS` (+ `Zap`, `Info` imports) in `alerts/page.tsx` is declared and never used; `Clock`/`XCircle` imported but unused in `discovery/page.tsx`. ESLint `core-web-vitals` doesn't flag these; "no dead code" still requires cleanup.

### Auth / data
- ☐ **Data is 100% hardcoded mock with no demo/real flag.** `src/lib/mockData.ts` is imported directly by pages. Brief wants demo data behind a flag so marketing works while the app is wired for real integrations. → Introduce a data-source seam + `NEXT_PUBLIC_DEMO_MODE`.
- ☐ **Offboard API has no rate limiting.** Brief explicitly requires it. → Add a lightweight per-IP/session limiter.
- ☐ **`.env.example` documents only `SESSION_SECRET`.** Needs Stripe keys, app URL, demo flag, etc. → Expand + document in README.

### Accessibility
- ☐ **Sortable table headers are `<th onClick>`** (discovery) — not keyboard-operable and no `aria-sort`. → Use buttons + `aria-sort`.
- ☐ **ToS/Privacy spans** aren't focusable/operable by keyboard (become real links).
- ☐ **No skip-to-content link**; dashboard has no landmark `<main>` labelling beyond the element.
- ☐ **Risk conveyed by color + a tiny dot**; ensure text label always present (mostly OK via `Badge`, verify contrast in dark mode).

### SEO / marketing meta
- ☐ **Emoji `🔍` data-URI favicon** — not enterprise-credible; no real `favicon.ico`/PNG/apple-touch-icon.
- ☐ **No OpenGraph or Twitter card, no `metadataBase`, no canonical, no per-page titles.** Links shared in outreach render with no preview card.
- ☐ **No `robots.txt`, no `sitemap.xml`.**
- ☐ **No social preview image (OG card).**

### Responsiveness
- ☐ **Dashboard sidebar is a fixed `w-56` always-on column** with no mobile collapse/hamburger; on small screens it eats ~224px and there's no toggle. Brief requires "fully responsive down to mobile." → Add a responsive drawer.

---

## P2 — Polish

- ☐ **Fonts loaded via CSS `@import` from Google Fonts** (render-blocking, layout-shift risk). → Migrate to `next/font` (self-hosted, no CLS, better Lighthouse) and drop the `googleapis`/`gstatic` CSP/font allowances.
- ☐ **No KPI sparklines / trend visuals** beyond static sub-text deltas (brief asks for sparklines/trend deltas).
- ☐ **`EMPLOYEES.sort(...)` mutates the shared array in render** (`dashboard/page.tsx` "Top Shadow Spenders") — in-place sort on the imported module array; works now but is a latent ordering bug. → Sort a copy.
- ☐ **Empty states missing** on Employees and Alerts tables (Discovery has one).
- ☐ **CSP allows `script-src 'unsafe-inline'`** (documented as required for Next hydration without a nonce strategy). Acceptable for launch; revisit with a nonce middleware later.
- ☐ **No analytics / error monitoring** (e.g., Vercel Analytics + a Sentry stub) for post-launch visibility.
- ☐ **`metadataBase` + absolute OG URLs** depend on a configured site URL env.

---

## Resolution plan (phase order)

The brief defines five phases. To de-risk, foundational correctness and security land before the visual redesign and payments build on top:

1. **Phase 0 — Audit (this doc).** + ESLint config so lint runs in CI. ☑
2. **Phase 2 — Technical correctness.** Route boundaries (404/500/loading/error), toasts, functional settings, wire offboard to API, legal pages, remove dead code, empty states.
3. **Phase 3 — Security & data.** Real login + session issuance + sign-out + expiry, middleware protecting `/dashboard`, cookie hardening, offboard rate limiting, demo-data flag + seam, `.env.example`, expand Playwright tests.
4. **Phase 1 — UX/UI redesign.** Design-system pass on existing navy/royal tokens, ⌘K command palette, KPI sparklines/deltas, responsive mobile sidebar, landing proof metrics + product visual + real pricing wired to checkout.
5. **Phase 4 — Payments.** Stripe Checkout + billing portal + webhooks + subscription gating (test-mode keys via env only).
6. **Phase 5 — Ship & verify.** SEO/OG/favicon/sitemap/robots, `next/font`, Lighthouse 90+, README, `LAUNCH_CHECKLIST.md`, push branch, open PR, confirm Vercel preview green.

Each phase ends with: **build + lint + Playwright green**, a focused commit, and a push so Vercel produces a fresh preview deploy. Nothing is marked resolved here until its build/lint/test gate passes.

---

## Decisions made (where the brief left it open)

- **Branch + PR over committing to `main`.** All work lands on `production-ready`; Vercel builds a preview per push; the user promotes to production by merging. Most enterprise-credible and matches Phase 5's "open a PR / confirm preview."
- **Auth approach:** real HMAC-signed session cookie (extending the existing `src/lib/auth.ts`) issued by a server route, plus a one-click **demo session** so the marketing demo at `/dashboard` works without real SSO. Real Google/Microsoft OAuth requires the user's own OAuth app credentials and is documented as a handoff step rather than hard-coded.
- **Demo vs real data** separated behind `NEXT_PUBLIC_DEMO_MODE` with a data-access seam, so the public demo keeps working while real integrations can be wired later.
