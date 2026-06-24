# ShadowSweep Launch Checklist (things only you can do)

This is the manual handoff. The app is built and deployed, but these steps need your accounts, payment details, and domain, so they cannot be automated. Work top to bottom. Each item says exactly where each value goes.

Notation: "(secret)" means never commit it. "(public)" values are safe to expose. Times are rough estimates.

---

## 1. Generate the session secret (required, ~2 min)

The app fails closed without this.

1. Generate a key:
   ```bash
   openssl rand -base64 32
   ```
2. Local: put it in `.env.local` as `SESSION_SECRET=<value>` (secret).
3. Vercel: Project, then Settings, then Environment Variables, then Add. Set `SESSION_SECRET` = `<value>`, scope Production and Preview (secret).

---

## 2. Stripe, to accept payments (~30 to 45 min)

### 2a. Create the account
1. Sign up at https://dashboard.stripe.com. Start in Test mode (toggle, top-right).
2. You do not need to finish business verification to test with `sk_test_…` keys, but you do need it before charging real cards in live mode (see 2f).

### 2b. Get API keys
1. Developers, then API keys.
2. Copy the Secret key (`sk_test_…`) (secret).
   - Vercel env: `STRIPE_SECRET_KEY` = `sk_test_…` (Production and Preview).
   - Local `.env.local`: same.

### 2c. Create products and prices
1. Product catalog, then Add product. Create two products:
   - Starter with two recurring prices: $15/month and $50/year.
   - Pro with two recurring prices: $49/month and $149/year.
   - (Enterprise is sales-led. No Stripe price needed; the button opens an email.)
2. Open each price and copy its Price ID (`price_…`). Map them to env vars:
   | Env var | Price |
   | --- | --- |
   | `STRIPE_PRICE_STARTER_MONTHLY` | Starter $15/mo |
   | `STRIPE_PRICE_STARTER_YEARLY` | Starter $50/yr |
   | `STRIPE_PRICE_PRO_MONTHLY` | Pro $49/mo |
   | `STRIPE_PRICE_PRO_YEARLY` | Pro $149/yr |
   Add all four in Vercel (Production and Preview) and `.env.local`.

### 2d. Configure the webhook
1. Developers, then Webhooks, then Add endpoint.
2. Endpoint URL: `https://<your-domain>/api/stripe/webhook` (use your Vercel URL or custom domain).
3. Select events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.
4. After creating it, copy the Signing secret (`whsec_…`) (secret).
   - Vercel env: `STRIPE_WEBHOOK_SECRET` = `whsec_…` (Production and Preview).
5. Test locally (optional) with the Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Use the `whsec_…` it prints as your local `STRIPE_WEBHOOK_SECRET`.

### 2e. Enable the customer billing portal
1. Settings, then Billing, then Customer portal, then Activate. Choose what customers can do (cancel, switch plans, update card). The app's "Manage billing" button opens this portal.

### 2f. Go live (only when ready to charge real money)
1. Complete business verification (Stripe, then Settings, then Business): legal entity, bank account, tax info. Required before live charges.
2. Switch the dashboard to Live mode and repeat 2b to 2d to get live keys, prices, and a live webhook secret.
3. In Vercel, swap the `STRIPE_*` values for the live ones (Production scope). No code changes needed. The app flips to live by env values alone.

---

## 3. Vercel, environment and promotion (~10 min)

1. Project, then Settings, then Environment Variables. Confirm these are set (Production and Preview):
   - `SESSION_SECRET` (secret)
   - `NEXT_PUBLIC_SITE_URL` = your final URL, e.g. `https://shadowsweep.com` (public)
   - `NEXT_PUBLIC_DEMO_MODE` = `true` to keep the public demo, or `false` for a locked-down real tenant (public)
   - `AUTH_ADMIN_EMAIL` and `AUTH_ADMIN_PASSWORD` if you want email/password sign-in (secret)
   - all `STRIPE_*` from section 2
2. Redeploy after changing env vars. Vercel does not apply env changes to an existing build.
3. To promote a preview to production: open the deployment in Vercel, then the overflow menu, then Promote to Production. Or merge the PR into `main` (Production tracks `main` by default).

---

## 4. Custom domain and SSL (~15 min plus DNS propagation)

1. Vercel, then Project, then Settings, then Domains, then Add your domain (e.g. `shadowsweep.com`).
2. At your DNS registrar, add the records Vercel shows:
   - Apex `@`: an A record to Vercel's IP (Vercel will display it), or an ALIAS/ANAME if supported.
   - `www`: a CNAME to `cname.vercel-dns.com`.
3. Vercel provisions SSL automatically once DNS resolves. No action needed.
4. Update `NEXT_PUBLIC_SITE_URL` to the custom domain and redeploy. Update the Stripe webhook URL (2d) to the custom domain.

---

## 5. Business and legal for taking payments (varies, get counsel)

The app ships template Terms, Privacy, and Refund pages at `/legal/terms`, `/legal/privacy`, `/legal/refund`. Before charging real customers:
1. Have a lawyer review and customize all three to your actual entity, data practices, and jurisdiction. The templates are a starting point, not legal advice.
2. Confirm your Privacy Policy matches what you actually collect and process, and your sub-processors (Vercel, Stripe).
3. Confirm your Refund Policy matches what you configure in the Stripe customer portal.
4. Complete Stripe business verification (2f). Required before live charges.
5. Consider sales tax and VAT: enable Stripe Tax if you need automatic tax calculation and collection.

---

## 6. Email deliverability for outbound marketing (~20 min plus DNS propagation)

So your outreach lands in inboxes instead of spam, authenticate your sending domain. Set these at your DNS registrar, or in your email provider's onboarding (Google Workspace, Resend, SendGrid):
1. SPF: a `TXT` record on your domain authorizing your sender, e.g. `v=spf1 include:_spf.google.com ~all` (use your provider's include).
2. DKIM: add the `CNAME`/`TXT` keys your email provider generates. This enables cryptographic signing.
3. DMARC: a `TXT` record at `_dmarc.yourdomain.com`. Start gentle: `v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com`, then tighten to `p=quarantine` or `p=reject` after monitoring.
4. Warm up the sending domain gradually. Verify with https://www.mail-tester.com before a big send.

---

## 7. Final pre-launch checks

- [ ] `SESSION_SECRET` set in Vercel (Production and Preview).
- [ ] Stripe test checkout completes end to end on the preview URL (use test card `4242 4242 4242 4242`).
- [ ] Stripe webhook shows successful deliveries (Stripe, then Webhooks, then your endpoint, then recent events).
- [ ] Custom domain resolves with valid SSL.
- [ ] `NEXT_PUBLIC_SITE_URL` matches the live domain; OG preview renders (test at https://www.opengraph.xyz).
- [ ] Legal pages reviewed by counsel.
- [ ] SPF, DKIM, DMARC pass (mail-tester score 10/10).
- [ ] Switched Stripe to live keys only when ready to charge real money.

---

## Optional but recommended

- Error monitoring: add Sentry (`@sentry/nextjs`). The error boundaries already log to `console.error`; wire them to Sentry for production visibility.
- Analytics: add Vercel Analytics or Plausible for traffic insight.
- Shared rate-limit store: swap the in-memory limiter in `src/lib/rateLimit.ts` for Upstash Redis or Vercel KV so limits hold across serverless instances.
- Real integrations: set `NEXT_PUBLIC_DEMO_MODE=false` and wire the data seam in `src/lib/data.ts` to your real identity and spend providers, plus real Google and Microsoft OAuth in `src/app/auth/page.tsx`.
