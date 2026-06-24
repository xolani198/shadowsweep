import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/legal/LegalDoc";

export const metadata: Metadata = {
  title: "Terms of Service · ShadowSweep",
  description: "The terms governing your use of the ShadowSweep platform.",
};

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of Service"
      updated="June 23, 2026"
      intro="These Terms of Service (the “Terms”) govern your access to and use of the ShadowSweep platform, websites, and related services (collectively, the “Service”). By creating an account or using the Service, you agree to these Terms. This is a template provided for launch readiness and should be reviewed by your legal counsel before going live."
    >
      <LegalSection heading="1. The Service">
        <p>
          ShadowSweep provides shadow-IT discovery, spend visibility, and offboarding tooling for
          organizations. We grant you a limited, non-exclusive, non-transferable right to access and
          use the Service for your internal business purposes, subject to these Terms and your
          subscription plan.
        </p>
      </LegalSection>

      <LegalSection heading="2. Accounts and eligibility">
        <p>
          You must provide accurate account information and are responsible for safeguarding your
          credentials and for all activity under your account. You must be authorized to bind your
          organization to these Terms.
        </p>
      </LegalSection>

      <LegalSection heading="3. Subscriptions and billing">
        <p>
          Paid plans are billed in advance on a monthly or annual basis through our payment
          processor, Stripe. Subscriptions renew automatically until cancelled. You authorize us to
          charge your payment method for recurring fees. Fees are exclusive of taxes unless stated
          otherwise. See our <a className="text-[var(--color-accent)] hover:underline" href="/legal/refund">Refund Policy</a> for cancellations and refunds.
        </p>
      </LegalSection>

      <LegalSection heading="4. Acceptable use">
        <p>
          You agree not to misuse the Service, including by attempting to gain unauthorized access,
          interfering with normal operation, reverse-engineering the Service, or using it to violate
          any law or third-party right. You are responsible for ensuring you have authorization to
          connect and scan the systems you integrate.
        </p>
      </LegalSection>

      <LegalSection heading="5. Customer data">
        <p>
          You retain all rights to data you submit to the Service. You grant us a limited license to
          process that data solely to provide and improve the Service, in accordance with our{" "}
          <a className="text-[var(--color-accent)] hover:underline" href="/legal/privacy">Privacy Policy</a>.
        </p>
      </LegalSection>

      <LegalSection heading="6. Service availability">
        <p>
          We strive for high availability but do not guarantee the Service will be uninterrupted or
          error-free. Planned maintenance and service levels, where applicable, are described in your
          order form or plan.
        </p>
      </LegalSection>

      <LegalSection heading="7. Disclaimers and limitation of liability">
        <p>
          The Service is provided “as is” without warranties of any kind to the maximum extent
          permitted by law. To the extent permitted by law, ShadowSweep’s aggregate liability arising
          out of these Terms will not exceed the amounts you paid in the twelve months preceding the
          claim.
        </p>
      </LegalSection>

      <LegalSection heading="8. Termination">
        <p>
          You may stop using the Service at any time. We may suspend or terminate access for breach
          of these Terms. Upon termination, your right to use the Service ends and we will handle your
          data as described in our Privacy Policy.
        </p>
      </LegalSection>

      <LegalSection heading="9. Changes to these Terms">
        <p>
          We may update these Terms from time to time. Material changes will be communicated through
          the Service or by email. Continued use after changes take effect constitutes acceptance.
        </p>
      </LegalSection>

      <LegalSection heading="10. Contact">
        <p>
          Questions about these Terms can be sent to{" "}
          <a className="text-[var(--color-accent)] hover:underline" href="mailto:legal@shadowsweep.app">
            legal@shadowsweep.app
          </a>
          .
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
