import { AlertTriangle, ArrowLeft } from "lucide-react";

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

export default function DisclaimerPage() {
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
            data-ocid="disclaimer.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-primary" />
            <span className="font-serif font-bold text-primary text-sm tracking-widest uppercase">
              MSTC GLOBAL
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-3">
            Disclaimer
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

        <div className="mb-10 p-5 rounded-xl border border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
            <p className="font-sans text-sm text-yellow-200/80 leading-relaxed">
              The information provided on this website is for general
              informational purposes only. MSTC GLOBAL makes no representations
              or warranties of any kind, express or implied, about the
              completeness, accuracy, reliability, suitability, or availability
              of the information, products, services, or related graphics
              contained herein.
            </p>
          </div>
        </div>

        <Section title="1. Property Information Disclaimer">
          <p>
            All property listings, project details, pricing information,
            specifications, amenities, floor plans, and possession dates
            published on this platform are:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Indicative only and subject to change without prior notice</li>
            <li>
              Provided by respective developers/builders and reproduced in good
              faith
            </li>
            <li>
              Not verified independently by MSTC GLOBAL for accuracy or
              completeness
            </li>
            <li>
              Not a substitute for independent legal, technical, or financial
              due diligence
            </li>
          </ul>
          <p className="mt-3">
            <strong className="text-primary/90">RERA Compliance:</strong> All
            real estate projects in Gujarat are required to be registered under
            RERA. Buyers are advised to independently verify RERA registration
            status at{" "}
            <a
              href="https://gujrera.gujarat.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline"
            >
              gujrera.gujarat.gov.in
            </a>{" "}
            before making any purchase decision.
          </p>
        </Section>

        <Section title="2. Financial Information Disclaimer">
          <p className="font-medium text-primary/80">
            IMPORTANT: This is not financial or investment advice.
          </p>
          <p>
            Any financial information, investment projections, return estimates,
            EMI calculations, rental yield figures, or market analysis provided
            on this platform are for illustrative and educational purposes only.
            They should not be construed as:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Investment advice or recommendations</li>
            <li>Guaranteed returns or performance predictions</li>
            <li>Endorsement of any specific investment product or strategy</li>
            <li>A substitute for professional financial planning advice</li>
          </ul>
          <p className="mt-3">
            Real estate investments are subject to market risks. Past
            performance is not indicative of future results. Consult a
            SEBI-registered financial advisor before making investment
            decisions.
          </p>
        </Section>

        <Section title="3. General Website Disclaimer">
          <p>
            While MSTC GLOBAL endeavors to keep the information on this website
            current and accurate:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              We cannot guarantee the accuracy, completeness, timeliness, or
              fitness for purpose of any information
            </li>
            <li>
              The website may contain technical inaccuracies or typographical
              errors, which will be corrected as they are identified
            </li>
            <li>
              Market conditions, regulatory requirements, and other factors may
              change rapidly
            </li>
          </ul>
          <p className="mt-3">
            <strong className="text-primary/90">External Links:</strong> This
            website may contain links to third-party websites provided for your
            convenience only. MSTC GLOBAL has no control over the content of
            those sites and accepts no responsibility for them.
          </p>
        </Section>

        <Section title="4. Legal Disclaimer">
          <p className="font-medium text-primary/80">
            IMPORTANT: Information on this website is not legal advice.
          </p>
          <p>
            Any legal information, templates, guides, RERA procedures,
            regulatory updates, or legal explanations provided on this platform
            are for general informational purposes only. They:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              Do not constitute legal advice or create a lawyer-client
              relationship
            </li>
            <li>May not reflect the most current legal developments</li>
            <li>May not be applicable to your specific circumstances</li>
            <li>Are not a substitute for professional legal counsel</li>
          </ul>
          <p className="mt-3">
            Always seek the advice of a qualified legal professional before
            taking any legal action or making decisions that have legal
            implications.
          </p>
        </Section>

        <Section title="5. Limitation of Liability">
          <p>
            In no event shall MSTC GLOBAL, its directors, officers, employees,
            partners, or agents be liable for any direct, indirect, incidental,
            special, consequential, or punitive damages, including but not
            limited to loss of profits, data, goodwill, or other intangible
            losses, resulting from your access to or use of this website or any
            content thereon.
          </p>
        </Section>

        <Section title="6. Contact Us">
          <p>For any queries regarding this disclaimer:</p>
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

      <div className="border-t border-primary/10 py-6">
        <p className="text-center font-sans text-xs text-muted-foreground/50">
          &copy; {new Date().getFullYear()} MSTC GLOBAL. All rights reserved.
        </p>
      </div>
    </div>
  );
}
