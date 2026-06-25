import { ArrowLeft, Shield } from "lucide-react";

const Section = ({
  title,
  children,
}: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="font-serif text-xl md:text-2xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">
      {title}
    </h2>
    <div className="font-sans text-sm md:text-base text-foreground/80 leading-relaxed space-y-3">
      {children}
    </div>
  </div>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen" style={{ background: "#06090f" }}>
      <div className="sticky top-0 z-40 border-b border-primary/20 bg-card/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = "/";
              }
            }}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-sans text-sm transition-colors"
            data-ocid="privacy_policy.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-serif font-bold text-primary text-sm tracking-widest uppercase">
              MSTC GLOBAL
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-3">
            Privacy Policy
          </h1>
          <p className="font-sans text-sm text-muted-foreground">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="mb-6 p-4 rounded-xl border border-primary/20 bg-card">
          <p className="font-sans text-xs text-muted-foreground">
            <strong className="text-primary/80">Effective Date:</strong> June 1,
            2026 &nbsp;&nbsp;|&nbsp;&nbsp;
            <strong className="text-primary/80">Company:</strong> MSTC GLOBAL,
            Ahmedabad, Gujarat, India &nbsp;&nbsp;|&nbsp;&nbsp;
            <strong className="text-primary/80">Contact:</strong>{" "}
            <a
              href="mailto:mstc.gbl@gmail.com"
              className="text-primary hover:text-primary/80"
            >
              mstc.gbl@gmail.com
            </a>
          </p>
        </div>

        <Section title="1. Introduction">
          <p>
            MSTC GLOBAL (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
            &ldquo;our&rdquo;) is committed to protecting and respecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your personal information when you visit our website
            or use our services.
          </p>
          <p>
            We are headquartered at{" "}
            <strong className="text-primary/90">
              5, ShwetShikhar Society, Shantivan, Ahmedabad, Gujarat 380054,
              India
            </strong>
            . By using our website or services, you consent to the practices
            described in this policy. This policy is effective from{" "}
            <strong className="text-primary/90">June 1, 2026</strong> and
            complies with India&apos;s Personal Data Protection Bill (PDPB) and
            applicable data protection laws.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>
            We may collect and process the following categories of personal
            information:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong className="text-primary/90">
                Personal Identification:
              </strong>{" "}
              Full name, date of birth, PAN number, Aadhaar number (where
              required), passport details for NRI clients.
            </li>
            <li>
              <strong className="text-primary/90">Contact Information:</strong>{" "}
              Email address, phone number, residential and correspondence
              address.
            </li>
            <li>
              <strong className="text-primary/90">
                Property Enquiry Data:
              </strong>{" "}
              Property preferences, budget range, location preferences, intended
              use, financing requirements.
            </li>
            <li>
              <strong className="text-primary/90">
                Financial Information:
              </strong>{" "}
              Income details, existing loan obligations, investment preferences
              &mdash; collected only for finance and loan consultation purposes.
            </li>
            <li>
              <strong className="text-primary/90">Usage Data:</strong> IP
              address, browser type, pages visited, time spent on pages,
              referral sources, device information.
            </li>
            <li>
              <strong className="text-primary/90">Communication Data:</strong>{" "}
              Messages, emails, and WhatsApp communications you initiate with
              us.
            </li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use the information we collect for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong className="text-primary/90">Service Delivery:</strong> To
              provide real estate, financial, legal, and consultancy services
              you request.
            </li>
            <li>
              <strong className="text-primary/90">Communication:</strong> To
              respond to enquiries, send appointment confirmations, and provide
              updates on your transactions.
            </li>
            <li>
              <strong className="text-primary/90">Legal Compliance:</strong> To
              fulfill obligations under RERA, Income Tax Act, GST laws, and
              other applicable Indian regulations.
            </li>
            <li>
              <strong className="text-primary/90">
                Marketing (with your consent):
              </strong>{" "}
              To send newsletters, property updates, and promotional offers. You
              can opt out at any time.
            </li>
            <li>
              <strong className="text-primary/90">Platform Improvement:</strong>{" "}
              To analyze usage patterns and improve our website and services.
            </li>
            <li>
              <strong className="text-primary/90">Security:</strong> To detect
              and prevent fraud, unauthorized access, and other security
              incidents.
            </li>
          </ul>
        </Section>

        <Section title="4. Data Sharing and Disclosure">
          <p>
            We do not sell, rent, or trade your personal information to third
            parties. We may share your data only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong className="text-primary/90">Legal Authorities:</strong>{" "}
              When required by law, court order, or government regulation (e.g.,
              RERA authorities, Income Tax Department, SEBI).
            </li>
            <li>
              <strong className="text-primary/90">Service Partners:</strong>{" "}
              Trusted partners such as banks, NBFCs, legal professionals, and
              registration authorities &mdash; strictly for completing your
              transactions.
            </li>
            <li>
              <strong className="text-primary/90">Property Developers:</strong>{" "}
              Details shared with builders/developers only with your explicit
              consent.
            </li>
            <li>
              <strong className="text-primary/90">Business Transfers:</strong>{" "}
              In the event of a merger, acquisition, or business restructuring,
              with appropriate data protection agreements in place.
            </li>
          </ul>
          <p className="mt-3 font-medium text-primary/80">
            We do not sell your personal data under any circumstances.
          </p>
        </Section>

        <Section title="5. Data Security">
          <p>
            We implement industry-standard security measures to protect your
            personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>End-to-end encryption for all data transmissions (SSL/TLS)</li>
            <li>
              Access controls limiting data access to authorized personnel only
            </li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>
              Secure storage with encryption at rest for sensitive documents
            </li>
            <li>Staff training on data protection and privacy practices</li>
          </ul>
          <p className="mt-3">
            Despite these measures, no internet transmission is 100% secure. If
            you suspect unauthorized use of your information, please contact us
            immediately.
          </p>
        </Section>

        <Section title="6. Your Rights (PDPB India and GDPR)">
          <p>
            Under the Personal Data Protection Bill (India) and GDPR (for EU
            residents), you have the following rights:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong className="text-primary/90">Right to Access:</strong>{" "}
              Request a copy of the personal data we hold about you.
            </li>
            <li>
              <strong className="text-primary/90">Right to Correction:</strong>{" "}
              Request correction of inaccurate or incomplete data.
            </li>
            <li>
              <strong className="text-primary/90">Right to Deletion:</strong>{" "}
              Request deletion of your data (&ldquo;right to be
              forgotten&rdquo;), subject to legal retention requirements.
            </li>
            <li>
              <strong className="text-primary/90">Right to Portability:</strong>{" "}
              Receive your data in a structured, machine-readable format.
            </li>
            <li>
              <strong className="text-primary/90">Right to Object:</strong>{" "}
              Object to processing of your data for marketing purposes at any
              time.
            </li>
            <li>
              <strong className="text-primary/90">
                Right to Withdraw Consent:
              </strong>{" "}
              Withdraw consent for data processing at any time without affecting
              prior lawful processing.
            </li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us at{" "}
            <strong className="text-primary">mstc.gbl@gmail.com</strong>. We
            will respond within 30 days.
          </p>
        </Section>

        <Section title="7. Cookies Policy">
          <p>
            We use cookies and similar tracking technologies to enhance your
            browsing experience. Please refer to our{" "}
            <a
              href="/cookie-policy"
              className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
            >
              Cookie Policy
            </a>{" "}
            for detailed information on how we use cookies and how you can
            manage your preferences.
          </p>
        </Section>

        <Section title="8. Data Retention">
          <p>
            We retain personal data for as long as necessary to fulfill the
            purposes for which it was collected, or as required by applicable
            laws. Property transaction records are retained for a minimum of 7
            years as required under Indian law. Marketing data is retained until
            you opt out.
          </p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>
            We reserve the right to update or modify this Privacy Policy at any
            time. When we make material changes, we will update the effective
            date at the top of this page. We encourage you to review this policy
            periodically. Continued use of our services after any changes
            constitutes acceptance of the updated policy.
          </p>
          <p>
            Significant changes will be communicated via email (if you have
            provided one) or through a prominent notice on our website.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>For any privacy-related queries, requests, or complaints:</p>
          <div className="mt-4 p-5 rounded-xl border border-primary/20 bg-card space-y-2">
            <p>
              <strong className="text-primary/90">MSTC GLOBAL</strong>
            </p>
            <p>
              5, ShwetShikhar Society, Shantivan, Ahmedabad, Gujarat 380054,
              India
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:mstc.gbl@gmail.com"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                mstc.gbl@gmail.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a
                href="tel:+919512609016"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                +91 9512609016
              </a>
            </p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="font-sans text-xs text-muted-foreground">
              Data Protection Officer: Love Vijaybhai Parekh (MD)
            </p>
            <p className="font-sans text-xs text-muted-foreground">
              Response time: Within 30 business days of receipt of your request.
            </p>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            This policy is governed by the laws of India. Disputes shall be
            subject to the exclusive jurisdiction of courts in Ahmedabad,
            Gujarat.
          </p>
        </Section>
      </div>

      <div className="border-t border-primary/10 py-6">
        <p className="text-center font-sans text-xs text-muted-foreground/50">
          &copy; {new Date().getFullYear()} MSTC GLOBAL. All rights reserved.
        </p>
      </div>
    </div>
  );
}
