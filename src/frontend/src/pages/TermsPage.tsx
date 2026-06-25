import { ArrowLeft, FileText } from "lucide-react";

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

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: "#06090f" }}>
      {/* Header */}
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
            data-ocid="terms.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="font-serif font-bold text-primary text-sm tracking-widest uppercase">
              MSTC GLOBAL
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-3">
            Terms &amp; Conditions
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

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using the website{" "}
            <strong className="text-primary/90">
              mstcglobal-kh8.caffeine.xyz
            </strong>{" "}
            and any associated services provided by MSTC GLOBAL, you agree to be
            bound by these Terms &amp; Conditions. If you do not agree with any
            part of these terms, please discontinue use of our services
            immediately.
          </p>
          <p>
            These terms constitute a legally binding agreement between you and{" "}
            <strong className="text-primary/90">MSTC GLOBAL</strong>, registered
            at 5, ShwetShikhar Society, Shantivan, Ahmedabad, Gujarat 380054,
            India.
          </p>
        </Section>

        <Section title="2. Services Description">
          <p>
            MSTC GLOBAL is a diversified business conglomerate offering services
            across eight core divisions:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong className="text-primary/90">
                Infrastructure &amp; Property Development:
              </strong>{" "}
              Residential, commercial, and industrial property development and
              advisory.
            </li>
            <li>
              <strong className="text-primary/90">
                RERA &amp; PR Consulting:
              </strong>{" "}
              RERA registration, compliance, promoter and agent consultation for
              Gujarat projects.
            </li>
            <li>
              <strong className="text-primary/90">
                Property Purchase, Rent &amp; Redevelopment:
              </strong>{" "}
              Buying, selling, leasing, and redevelopment of residential and
              commercial properties.
            </li>
            <li>
              <strong className="text-primary/90">
                Finance &amp; Investment:
              </strong>{" "}
              Home loans, business loans, equity funding, investment portfolio
              advisory.
            </li>
            <li>
              <strong className="text-primary/90">
                Music &amp; Cultural Services:
              </strong>{" "}
              Artist management, music production, cultural event organization.
            </li>
            <li>
              <strong className="text-primary/90">
                Hospitality &amp; Events:
              </strong>{" "}
              Corporate events, venue booking, hospitality management.
            </li>
            <li>
              <strong className="text-primary/90">
                NGO &amp; CSR Initiatives:
              </strong>{" "}
              Social impact programs, CSR fund management, community development
              projects.
            </li>
            <li>
              <strong className="text-primary/90">
                Media, Sports &amp; Tourism:
              </strong>{" "}
              Sports event management, travel itineraries, media production.
            </li>
          </ul>
        </Section>

        <Section title="3. User Obligations">
          <p>By using our services, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              Provide accurate, complete, and current information at all times
            </li>
            <li>
              Not use the platform for any unlawful purpose or in violation of
              any applicable laws
            </li>
            <li>
              Not attempt to gain unauthorized access to any part of our systems
              or data
            </li>
            <li>
              Not reproduce, distribute, or commercially exploit any content
              without written permission
            </li>
            <li>
              Not submit false, misleading, or fraudulent property or financial
              information
            </li>
            <li>
              Comply with all applicable Indian laws including RERA, FEMA (for
              NRI clients), and Income Tax Act
            </li>
          </ul>
        </Section>

        <Section title="4. Property Information Disclaimer">
          <p className="font-medium text-primary/80">
            IMPORTANT: Please read carefully.
          </p>
          <p>
            All property information, listings, prices, specifications,
            availability, and project details published on this platform are
            provided for{" "}
            <strong className="text-primary/90">
              reference and general informational purposes only
            </strong>
            . They are subject to change without notice and do not constitute a
            legal offer, binding agreement, or guarantee.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              Property prices are indicative and may vary based on floor, unit,
              and negotiation
            </li>
            <li>
              All projects listed must independently verify RERA registration
              status
            </li>
            <li>
              Possession dates and project timelines are developer estimates
            </li>
            <li>
              MSTC GLOBAL does not guarantee investment returns on any property
            </li>
            <li>
              Site visits and due diligence are strongly recommended before any
              transaction
            </li>
          </ul>
        </Section>

        <Section title="5. Enquiry and Data Submission">
          <p>
            When you submit an enquiry, form, or request through our platform:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              You grant MSTC GLOBAL permission to contact you regarding your
              enquiry
            </li>
            <li>
              You confirm that the information provided is accurate and that you
              are authorized to submit it
            </li>
            <li>
              You acknowledge that MSTC GLOBAL may share your enquiry details
              with relevant property developers, financial institutions, or
              service partners to fulfill your request
            </li>
            <li>
              Submitting an enquiry does not create any binding obligation on
              either party
            </li>
          </ul>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            All content on this platform including but not limited to text,
            graphics, logos, images, audio clips, digital downloads, data
            compilations, and software is the exclusive property of MSTC GLOBAL
            or its content suppliers and is protected by Indian and
            international copyright laws.
          </p>
          <p>
            You may not reproduce, distribute, display, sell, or exploit any
            content without prior written consent from MSTC GLOBAL.
          </p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>To the maximum extent permitted by applicable law:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              MSTC GLOBAL shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages
            </li>
            <li>
              Our total liability for any claim shall not exceed the fees paid
              by you for the specific service giving rise to the claim
            </li>
            <li>
              We are not responsible for third-party websites or services linked
              from our platform
            </li>
            <li>
              We disclaim all warranties, express or implied, regarding
              accuracy, reliability, or fitness for a particular purpose
            </li>
          </ul>
        </Section>

        <Section title="8. Governing Law">
          <p>
            These Terms &amp; Conditions are governed by and construed in
            accordance with the laws of India. Any disputes arising from or
            relating to these terms or the use of our services shall be subject
            to the{" "}
            <strong className="text-primary/90">
              exclusive jurisdiction of the courts in Ahmedabad, Gujarat, India
            </strong>
            .
          </p>
          <p>
            Any disputes shall first be attempted to be resolved through mutual
            negotiation. If unresolved within 30 days, disputes shall be
            referred to arbitration under the Arbitration and Conciliation Act,
            1996, with the seat of arbitration in Ahmedabad.
          </p>
        </Section>

        <Section title="9. Contact Information">
          <p>For any queries regarding these Terms &amp; Conditions:</p>
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
        </Section>
      </div>

      {/* Footer strip */}
      <div className="border-t border-primary/10 py-6">
        <p className="text-center font-sans text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} MSTC GLOBAL. All rights reserved.
        </p>
      </div>
    </div>
  );
}
