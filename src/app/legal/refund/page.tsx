import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/legal/LegalDoc";

export const metadata: Metadata = {
  title: "Refund Policy · ShadowSweep",
  description: "ShadowSweep's cancellation and refund terms.",
};

export default function RefundPage() {
  return (
    <LegalDoc
      title="Refund & Cancellation Policy"
      updated="June 23, 2026"
      intro="This policy describes how cancellations and refunds work for paid ShadowSweep subscriptions. This is a template provided for launch readiness and should be reviewed by your legal counsel before going live."
    >
      <LegalSection heading="1. Free trial">
        <p>
          Paid plans may include a free trial. You will not be charged until the trial ends, and you
          can cancel any time before then from your billing settings to avoid charges.
        </p>
      </LegalSection>

      <LegalSection heading="2. Cancellations">
        <p>
          You can cancel your subscription at any time through the customer billing portal.
          Cancellation stops future renewals; your plan remains active until the end of the current
          billing period, after which paid features are disabled.
        </p>
      </LegalSection>

      <LegalSection heading="3. Refunds">
        <p>
          Monthly plans are generally non-refundable for the current period. For annual plans, you
          may request a pro-rated refund of the unused, prepaid portion within 30 days of a renewal
          charge. Refunds are issued to the original payment method through Stripe.
        </p>
      </LegalSection>

      <LegalSection heading="4. Failed payments">
        <p>
          If a payment fails, we will attempt to recharge and notify you. If payment cannot be
          collected, paid features may be suspended until billing is restored.
        </p>
      </LegalSection>

      <LegalSection heading="5. How to request a refund">
        <p>
          Email{" "}
          <a className="text-[var(--color-accent)] hover:underline" href="mailto:billing@shadowsweep.app">
            billing@shadowsweep.app
          </a>{" "}
          from your account email with your organization name and the charge in question. We aim to
          respond within two business days.
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
