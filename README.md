# ShadowSweep

Shadow-IT discovery, spend forensics, and one-click offboarding for enterprise security teams. Connect identity, spend, and billing systems to surface every unauthorized SaaS app, quantify wasted spend, and revoke access for departing employees with GDPR/CCPA compliance built in.

Built with **Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · Stripe · Playwright**.

- **Live demo:** https://shadowsweep-rho.vercel.app
- **Marketing demo mode** is on by default, so `/dashboard` is fully browsable without sign-in.

---

## Features

- Marketing site with hero, proof metrics, rotating case studies, and a real pricing section wired to Stripe Checkout.
- Product dashboard: KPI banner with sparklines + trend deltas, surfaced shadow-IT, alerts feed, discovery integrations, employee directory, and an offboarding flow that calls a secured API.
- **⌘K command palette** for navigating pages, jumping to employees, and running actions.
- Light/dark mode, fully responsive down to mobile (off-canvas sidebar drawer).
- Real auth: HMAC-signed sessions with expiry, middleware-protected `/dashboard`, sign-out, demo + credential sign-in.
- Hardened: CSP/HSTS/X-Frame-Options security headers, CSRF origin checks, per-client rate limiting, Zod-validated APIs.
- Stripe subscriptions: Checkout, customer billing portal, and signature-verified webhooks.
- SEO: per-page metadata, OpenGraph/Twitter cards, dynamic OG image, favicon, `robots.txt`, `sitemap.xml`.
- Error/404/loading boundaries, toasts, empty states, accessible components.

---

## Getting started

### Prerequisites
- Node.js 18.18+ (20+ recommended)
- npm

### Install & run

```bash
git clone https://github.com/xolani198/shadowsweep.git
cd shadowsweep
npm install

# Configure environment
cp .env.example .env.local
# At minimum set SESSION_SECRET (generate one):
#   openssl rand -base64 32

npm run dev          # http://localhost:3000
```

> Without `SESSION_SECRET` the app fails closed (treats every request as unauthenticated). Set it in `.env.local` for local development.

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npx playwright test` | Run the Playwright suite (`npx playwright install chromium` first) |

---

## Environment variables

All variables are documented in [`.env.example`](.env.example). Summary:

| Variable | Required | Purpose |
| --- | --- | --- |
| `SESSION_SECRET` | Yes | HMAC key for signing session cookies (32+ random bytes) |
| `AUTH_ADMIN_EMAIL` / `AUTH_ADMIN_PASSWORD` | Optional | Enables email/password sign-in for a single admin account |
| `NEXT_PUBLIC_DEMO_MODE` | No (default `true`) | `true` serves the demo dataset and auto-issues a demo session; `false` requires sign-in and starts empty |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Absolute base URL for canonical/OG/sitemap |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key (use `sk_test_…` until going live) |
| `STRIPE_WEBHOOK_SECRET` | For payments | Webhook signing secret (`whsec_…`) |
| `STRIPE_PRICE_{STARTER,PRO}_{MONTHLY,YEARLY}` | For payments | Recurring Stripe Price IDs |
| `STRIPE_API_VERSION` | Optional | Pin a Stripe API version |

> `NEXT_PUBLIC_*` variables are inlined into the client bundle — never put a secret behind that prefix. Billing degrades to a clear "not configured" state when Stripe keys are unset, so the app still builds and runs.

---

## Architecture notes

- **Auth** (`src/lib/auth.ts`, `src/lib/edgeSession.ts`): HMAC-SHA256 signed cookie carrying `{ userId, orgId, email, exp }`. Verified with Node crypto in API routes and Web Crypto in edge middleware.
- **Middleware** (`src/middleware.ts`): protects `/dashboard/*`. In demo mode it auto-issues a demo session; otherwise it redirects to `/auth?next=`. API routes are not matched, so they enforce their own session checks and fail closed.
- **Data seam** (`src/lib/data.ts`, `src/lib/config.ts`): the front end reads data through a `DEMO_MODE` flag so the marketing demo works while a real tenant starts empty, ready for live integrations.
- **Security** (`next.config.mjs`, `src/lib/security.ts`, `src/lib/rateLimit.ts`): security headers (CSP, HSTS, X-Frame-Options, etc.), same-origin CSRF checks, and in-memory per-client rate limiting. For multi-instance hosting, back the rate limiter with a shared store (Upstash/Vercel KV).
- **Payments** (`src/lib/stripe.ts`, `src/app/api/stripe/*`): lazy Stripe client, env-driven price IDs, Checkout + billing portal + signature-verified webhooks.

---

## Deployment (Vercel)

1. Import the GitHub repo into Vercel (framework auto-detected as Next.js).
2. Add the environment variables above in **Project → Settings → Environment Variables** (at minimum `SESSION_SECRET` and `NEXT_PUBLIC_SITE_URL`; add `STRIPE_*` to enable billing).
3. Every push to a branch creates a **Preview** deployment; merging to `main` promotes to **Production** (or use Vercel's "Promote to Production").
4. Configure the Stripe webhook endpoint at `https://<your-domain>/api/stripe/webhook` and paste the signing secret into `STRIPE_WEBHOOK_SECRET`.

A full go-live checklist (Stripe, domain/DNS, legal, email auth) is in [`LAUNCH_CHECKLIST.md`](LAUNCH_CHECKLIST.md). The production-readiness audit is in [`PRODUCTION_READINESS.md`](PRODUCTION_READINESS.md).

---

## Testing

```bash
npx playwright install chromium   # one-time
npx playwright test
```

Covers security headers, the offboard API (auth/validation/expiry/CSRF/rate-limit), the auth flow (login/logout/rate-limit/protected dashboard), the Stripe routes (auth gates + graceful unconfigured behavior), and the end-to-end revoke flow.
