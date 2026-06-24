# ShadowSweep Security

ShadowSweep performs destructive, high-privilege actions (revoking app access, offboarding employees), so the safeguards below assume any request could be hostile or accidental. This document describes what is implemented and how it works. Operator setup steps are at the end.

## Reporting a vulnerability

Email security@shadowsweep.app with details and reproduction steps. Please do not open a public issue for undisclosed vulnerabilities.

---

## Authentication and sessions

- **Signed sessions.** Sessions are an HMAC-SHA256 signed cookie (`src/lib/auth.ts`) carrying `{ userId, orgId, email, role, exp }`. The signature is verified on every read with a constant-time comparison; a tampered or forged cookie is rejected. The signing key (`SESSION_SECRET`) is server-only. With no key configured the app fails closed: every request is unauthenticated.
- **Cookie hardening.** `HttpOnly`, `SameSite=Lax`, `Secure` in production, `Path=/`, and a 7-day `Max-Age`. No tokens or credentials are stored in `localStorage` or client code.
- **Expiry.** Sessions carry an `exp` claim and are rejected once expired, independent of the cookie lifetime.
- **Credential login** verifies a single configured admin (`AUTH_ADMIN_EMAIL` / `AUTH_ADMIN_PASSWORD`) with constant-time comparison. Real OAuth (Google/Microsoft) is a documented integration point; the SSO buttons currently issue a demo session.
- **Sign-out** clears the cookie server-side.

## Authorization (RBAC)

- Sessions carry a `role` of `admin` or `viewer`. **Least privilege:** anything not explicitly `admin` is treated as `viewer`.
- Destructive endpoints (`/api/offboard`, `/api/offboard/undo`) and the audit trail (`/api/audit`) re-check the role **server-side on every call** (`canPerformDestructiveActions`). The client is never trusted. Viewer and missing-role sessions get `403`.
- Because the role was added after launch, any session minted before it is automatically downgraded to `viewer` until the user signs in again. This is intentional (fail safe).

## Destructive-action safeguards

Revoking access cannot happen on an accidental click.

- **Typed confirmation.** The revoke CTA opens a blocking modal (`ConfirmDialog`) naming the employee. The confirm button stays disabled until the operator types the exact employee name.
- **Impact preview (dry run).** Opening the modal calls `POST /api/offboard` with `dryRun: true`, which returns the apps that would be revoked, the count, the monthly spend, and the data scopes, and logs an `offboard_preview` event without changing anything.
- **Idempotency.** Real revokes send an `Idempotency-Key` header. A retry with the same key replays the original result (`Idempotent-Replay: true`) instead of executing twice. Keys are validated, actor-scoped, and TTL-bounded (`src/lib/idempotency.ts`).
- **Undo window.** After a successful revoke an 8-second undo control appears. Undo calls `POST /api/offboard/undo` (admin-only, origin-checked, rate-limited, audit-logged) and restores the view, giving a soft-delete-style recovery path.
- **Clear feedback.** Success and failure are surfaced through toasts and explicit states.

## Input validation and API hardening

- **Schema validation.** Every mutating endpoint validates its body with Zod and a `.strict()` schema (unknown fields are rejected). Malformed requests return `400`; unknown employee IDs return `404`.
- **CSRF.** State-changing routes require same-origin (`src/lib/security.ts`): a request carrying an `Origin`/`Referer` that does not match the host is rejected with `403`. Combined with `SameSite=Lax` cookies and JSON-only bodies (which force a CORS preflight), cross-site forgery is blocked.
- **Rate limiting.** Login, offboard, offboard-undo, Stripe checkout, and Stripe portal are rate-limited per client (`src/lib/rateLimit.ts`). Returns `429` with `Retry-After`. In-memory and per-instance; for multi-instance production, back it with Redis / Vercel KV.
- **Idempotency** on offboard (above) prevents duplicate execution on retries.

## Route protection matrix

| Route | Method | Protection |
| --- | --- | --- |
| `/dashboard/*` | GET | Edge middleware: valid session required (demo mode auto-issues a demo session; otherwise redirect to `/auth`) |
| `/api/offboard` | POST | session + **admin role** + origin + rate-limit + idempotency + audit |
| `/api/offboard/undo` | POST | session + **admin role** + origin + rate-limit + audit |
| `/api/audit` | GET | session + **admin role** |
| `/api/auth/login` | POST | origin + rate-limit + audit (public by design) |
| `/api/auth/logout` | POST | origin + audit (public by design) |
| `/api/stripe/checkout` | POST | session + origin + rate-limit |
| `/api/stripe/portal` | POST | session + origin + rate-limit |
| `/api/stripe/subscription` | GET | session |
| `/api/stripe/webhook` | POST | Stripe signature verification (public by design) |

The middleware intentionally does not match `/api/*`, so API routes always enforce their own checks and fail closed even if the edge layer is bypassed.

## Audit logging

- Every sensitive action is recorded (`src/lib/audit.ts`): login, failed login, logout, offboard preview, offboard execution, offboard undo, and denied authorization.
- Entries capture **who** (actor), **what** (action, target), **when** (timestamp), and **from where** (IP, truncated user-agent), plus an outcome.
- **No secrets or full PII** are logged: passwords and tokens are never recorded, emails are redacted (`a***@domain.com`), and target references are IDs.
- Admins can read the recent trail at `GET /api/audit` and in Settings → Security. The store is an in-memory ring buffer plus structured console output (shipped to Vercel logs); forward it to a durable append-only store or SIEM in production.

## Secrets and data protection

- **No hardcoded secrets.** All keys come from environment variables, documented in `.env.example`. `NEXT_PUBLIC_*` is reserved for non-secret values only.
- **Pre-commit secret scan.** `scripts/secret-scan.mjs` (no dependencies) runs as a `.githooks/pre-commit` hook and blocks commits that introduce Stripe/AWS/Google/GitHub keys, private-key blocks, or hardcoded secret assignments. `npm run secret-scan` scans the whole tree. The hook is enabled by the npm `prepare` script (`git config core.hooksPath .githooks`).
- **History.** The tree and git history were scanned and are clean; `.env` / `.env.local` were never committed (they are gitignored).
- **Encryption at rest.** The demo uses no datastore. When real integration tokens are stored, encrypt them at rest (e.g. envelope encryption with a KMS-managed key) and keep them out of logs.

## HTTP and app-level hardening

- **Security headers** (`next.config.mjs`) on every response: Content-Security-Policy (`object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`), `Strict-Transport-Security` (2 years, preload), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive `Permissions-Policy`. `X-Powered-By` is removed.
- **XSS / injection.** Output is rendered through React (auto-escaped); there is no `dangerouslySetInnerHTML`. Inputs are schema-validated server-side.
- **Clickjacking** is blocked by `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'`.
- **No verbose errors in production.** Unhandled errors render branded `error` / `global-error` / `not-found` boundaries with a reference digest only; stack traces are not shown to users.

## Reliability and monitoring

- **Error boundaries** at the route and root level, plus branded 404/500 pages.
- **Error reporting.** `src/lib/monitoring.ts` (`reportError`) logs structured JSON and optionally forwards to `MONITORING_WEBHOOK_URL` (e.g. Slack or a Sentry tunnel). The error boundaries report through it. To use Sentry directly, call `Sentry.captureException` inside `reportError`.
- **Retries for external calls.** The Stripe client uses `maxNetworkRetries`; `src/lib/retry.ts` (`withRetry`, exponential backoff with jitter) is the helper for future identity/spend integration calls, paired with explicit error states in each route.

---

## Operator setup (what you must configure)

1. **`SESSION_SECRET`** (required) in Vercel for Production and Preview. Generate with `openssl rand -base64 32`. Without it, auth fails closed.
2. **`AUTH_ADMIN_EMAIL` / `AUTH_ADMIN_PASSWORD`** (optional) to enable credential sign-in. Use a strong, unique password.
3. **Stripe** keys and webhook secret (`STRIPE_*`); see `LAUNCH_CHECKLIST.md`. Test mode until you go live.
4. **`MONITORING_WEBHOOK_URL`** (optional) to receive production error alerts.
5. **Pre-commit hook**: run `npm install` (the `prepare` script sets it up) or `git config core.hooksPath .githooks` once per clone.
6. **Rate limiting at scale**: replace the in-memory limiter and idempotency store with Redis / Vercel KV if you run more than one instance.
7. **Vercel**: keep HTTPS-only (default) so `Secure` cookies and HSTS apply. Consider enabling Deployment Protection on preview URLs.
