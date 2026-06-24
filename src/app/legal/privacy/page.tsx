import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/legal/LegalDoc";

export const metadata: Metadata = {
  title: "Privacy Policy · ShadowSweep",
  description: "How ShadowSweep collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      updated="June 23, 2026"
      intro="This Privacy Policy explains how ShadowSweep collects, uses, discloses, and safeguards information when you use our Service. This is a template provided for launch readiness and should be reviewed by your legal counsel and adapted to your actual data practices before going live."
    >
      <LegalSection heading="1. Information we collect">
        <p>
          We collect account information you provide (such as name, work email, and organization),
          billing details processed by our payment provider, and data from integrations you connect
          (such as identity-provider app grants and spend records) to deliver shadow-IT discovery.
          We also collect usage and device data through standard logs and privacy-respecting
          analytics.
        </p>
      </LegalSection>

      <LegalSection heading="2. How we use information">
        <p>
          We use information to provide, secure, and improve the Service; to detect and surface
          shadow IT; to process payments; to communicate with you; and to comply with legal
          obligations. We do not sell your personal information.
        </p>
      </LegalSection>

      <LegalSection heading="3. Legal bases (GDPR)">
        <p>
          Where the GDPR applies, we process personal data on the basis of contract performance,
          legitimate interests (such as securing the Service), consent where required, and legal
          obligation.
        </p>
      </LegalSection>

      <LegalSection heading="4. Data sharing">
        <p>
          We share data with sub-processors that help us operate the Service (for example, cloud
          hosting and payment processing) under appropriate data-protection terms. We may disclose
          information where required by law.
        </p>
      </LegalSection>

      <LegalSection heading="5. Data retention">
        <p>
          We retain personal data for as long as needed to provide the Service and to meet legal,
          accounting, or reporting requirements. You can request deletion as described below.
        </p>
      </LegalSection>

      <LegalSection heading="6. Your rights">
        <p>
          Depending on your location, you may have rights to access, correct, delete, or port your
          personal data, and to object to or restrict certain processing (including under GDPR
          Article 17 and CCPA §1798.105). To exercise these rights, contact us at the address below.
        </p>
      </LegalSection>

      <LegalSection heading="7. Security">
        <p>
          We use technical and organizational measures including encryption in transit, signed
          sessions, hardened security headers, and least-privilege access controls. No method of
          transmission or storage is perfectly secure, but we work to protect your data.
        </p>
      </LegalSection>

      <LegalSection heading="8. International transfers">
        <p>
          Your information may be processed in countries other than your own. Where required, we use
          appropriate safeguards such as standard contractual clauses for cross-border transfers.
        </p>
      </LegalSection>

      <LegalSection heading="9. Changes and contact">
        <p>
          We may update this Policy from time to time and will note the effective date above. For
          privacy questions or requests, contact{" "}
          <a className="text-[var(--color-accent)] hover:underline" href="mailto:privacy@shadowsweep.app">
            privacy@shadowsweep.app
          </a>
          .
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
