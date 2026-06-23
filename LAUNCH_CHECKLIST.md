# ShadowSweep — Launch Checklist (things only you can do)

This is the manual handoff. The app is built and deployed, but these steps require **your accounts, payment details, and domain** — they cannot be automated. Work top to bottom. Each item says exactly where each value goes.

Legend: 🔑 secret (never commit) · 🌐 public · ⏱️ time estimate

---

## 1. Generate the session secret (required — 2 min)

The app fails closed without this.

1. Generate a key:
   ```bash
   openssl rand -base64 32
   ```
2. Local: put it in `.env.local` as `SESSION_SECRET=<value>` 🔑
3. Vercel: **Project → Settings → Environment Variables → Add** → `SESSION_SECRET` = `<value>`, scope **Production + Preview**. 🔑

---

## 2. Stripe — accept payments (⏱️ 30–45 min)

### 2a. Create the account
1. Sign up at https://dashboard.stripe.com. Start in **Test mode** (toggle, top-right).
2. You do **not** need to finish business verification to test with `sk_test_…` keys, but you **do** need it before charging real cards in live mode (see 2f).

### 2b. Get API keys
1. **Developers → API keys.**
2. Copy the **Secret key** (`sk_test_…`). 🔑
   - Vercel env: `STRIPE_SECRET_KEY` = `sk_test_…` (Production + Preview).
   - Local `.env.local`: same.

### 2c. Create products & prices
1. **Product catalog → Add product.** Create two products:
   - **Starter** with two recurring prices: **$15/month** and **$50/year**.
   - **Pro** with two recurring prices: **$49/month** and **$149/year**.
   - (Enterprise is sales-led — no Stripe price needed; the button opens an email.)
2. Open each price and copy its **Price ID** (`price_…`). Map them to env vars:
   | Env var | Price |
   | --- | --- |
   | `STRIPE_PRICE_STARTER_MONTHLY` | Starter $15/mo |
   | `STRIPE_PRICE_STARTER_YEARLY` | Starter $50/yr |
   | `STRIPE_PRICE_PRO_MONTHLY` | Pro $49/mo |
   | `STRIPE_PRICE_PRO_YEARLY` | Pro $149/yr |
   Add all four in Vercel (Production + Preview) and `.env.local`. 🌐 (these are not secret, but keep them in env for cleanliness)

### 2d. Configure the webhook
1. **Developers → Webhooks → Add endpoint.**
2. Endpoint URL: `https://<your-domain>/api/stripe/webhook` (use your Vercel URL or custom domain).
3. Select events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.
4. After creating it, copy the **Signing secret** (`whsec_…`). 🔑
   - Vercel env: `STRIPE_WEBHOOK_SECRET` = `whsec_…` (Production + Preview).
5. Test locally (optional) with the Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Use the `whsec_…` it prints as your local `STRIPE_WEBHOOK_SECRET`.

### 2e. Enable the customer billing portal
1. **Settings → Billing → Customer portal → Activate.** Choose what customers can do (cancel, switch plans, update card). The app's "Manage billing" button opens this portal.

### 2f. Go live (only when ready to charge real money)
1. Complete **business verification** (Stripe → Settings → Business) — legal entity, bank account, tax info. Required before live charges.
2. Switch the dashboard to **Live mode** and repeat 2b–2d to get **live** keys, prices, and a **live** webhook secret.
3. In Vercel, swap the `STRIPE_*` values for the live ones (Production scope). No code changes needed — the app flips to live by env values alone.

---

## 3. Vercel — environment & promotion (⏱️ 10 min)

1. **Project → Settings → Environment Variables.** Confirm these are set (Production + Preview):
   - `SESSION_SECRET` 🔑
   - `NEXT_PUBLIC_SITE_URL` = your final URL (e.g. `https://shadowsweep.com`) 🌐
   - `NEXT_PUBLIC_DEMO_MODE` = `true` to keep the public demo, or `false` for a locked-down real tenant 🌐
   - `AUTH_ADMIN_EMAIL` / `AUTH_ADMIN_PASSWORD` if you want email/password sign-in 🔑
   - all `STRIPE_*` from section 2
2. Redeploy after changing env vars (Vercel does not apply env changes to an existing build).
3. **Promote a preview to production:** open the deployment in Vercel → **⋯ → Promote to Production**, or merge the PR into `main` (Production tracks `main` by default).

---

## 4. Custom domain + SSL (⏱️ 15 min + DNS propagation)

1. **Vercel → Project → Settings → Domains → Add** your domain (e.g. `shadowsweep.com`).
2. At your DNS registrar, add the records Vercel shows:
   - Apex `@` → **A** record to Vercel's IP (Vercel will display it), or an `ALIAS`/`ANAME` if supported.
   - `www` → **CNAME** to `cname.vercel-dns.com`.
3. Vercel provisions SSL automatically once DNS resolves (no action needed).
4. Update `NEXT_PUBLIC_SITE_URL` to the custom domain and redeploy. Update the Stripe webhook URL (2d) to the custom domain.

---

## 5. Business & legal for taking payments (⏱️ varies — get counsel)

The app ships **template** Terms, Privacy, and Refund pages at `/legal/terms`, `/legal/privacy`, `/legal/refund`. Before charging real customers:
1. **Have a lawyer review and customize** all three to your actual entity, data practices, and jurisdiction. The templates are a starting point, not legal advice.
2. Confirm your **Privacy Policy** matches what you actually collect/process and your sub-processors (Vercel, Stripe).
3. Confirm your **Refund Policy** matches what you configure in the Stripe customer portal.
4. Complete **Stripe business verification** (2f) — required before live charges.
5. Consider **sales tax / VAT**: enable **Stripe Tax** if you need automatic tax calculation/collection.

---

## 6. Email deliverability for outbound marketing (⏱️ 20 min + DNS propagation)

So your outreach lands in inboxes (not spam), authenticate your sending domain. Set these at your DNS registrar (or in your email provider's onboarding — e.g. Google Workspace, Resend, SendGrid):
1. **SPF** — a `TXT` record on your domain authorizing your sender, e.g.
   `v=spf1 include:_spf.google.com ~all` (use your provider's include).
2. **DKIM** — add the `CNAME`/`TXT` keys your email provider generates (enables cryptographic signing).
3. **DMARC** — a `TXT` record at `_dmarc.yourdomain.com`, start gentle:
   `v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com` then tighten to `p=quarantine`/`p=reject` after monitoring.
4. Warm up the sending domain gradually; verify with https://www.mail-tester.com before a big send.

---

## 7. Final pre-launch checks

- [ ] `SESSION_SECRET` set in Vercel (Production + Preview).
- [ ] Stripe test checkout completes end-to-end on the preview URL (use test card `4242 4242 4242 4242`).
- [ ] Stripe webhook shows successful deliveries (Stripe → Webhooks → your endpoint → recent events).
- [ ] Custom domain resolves with valid SSL.
- [ ] `NEXT_PUBLIC_SITE_URL` matches the live domain; OG preview renders (test at https://www.opengraph.xyz).
- [ ] Legal pages reviewed by counsel.
- [ ] SPF/DKIM/DMARC pass (mail-tester score 10/10).
- [ ] Switched Stripe to **live** keys only when ready to charge real money.

---

## Optional but recommended

- **Error monitoring:** add Sentry (`@sentry/nextjs`) — the error boundaries already log to `console.error`; wire them to Sentry for production visibility.
- **Analytics:** add Vercel Analytics or Plausible for traffic insight.
- **Shared rate-limit store:** swap the in-memory limiter in `src/lib/rateLimit.ts` for Upstash Redis / Vercel KV so limits hold across serverless instances.
- **Real integrations:** set `NEXT_PUBLIC_DEMO_MODE=false` and wire the data seam in `src/lib/data.ts` to your real identity/spend providers, plus real Google/Microsoft OAuth in `src/app/auth/page.tsx`.
