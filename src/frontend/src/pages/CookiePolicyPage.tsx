import { ArrowLeft, Cookie } from "lucide-react";

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

export default function CookiePolicyPage() {
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
            data-ocid="cookie_policy.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Cookie className="w-4 h-4 text-primary" />
            <span className="font-serif font-bold text-primary text-sm tracking-widest uppercase">
              MSTC GLOBAL
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-3">
            Cookie Policy
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

        <Section title="1. What Are Cookies">
          <p>
            Cookies are small text files placed on your device when you visit a
            website. They are widely used to make websites work efficiently,
            improve user experience, and provide information to website owners.
          </p>
          <p>
            MSTC GLOBAL uses cookies and similar technologies (such as web
            beacons, pixels, and local storage) to deliver a better, more
            personalized service on our platform at{" "}
            <strong className="text-primary/90">
              mstcglobal-kh8.caffeine.xyz
            </strong>
            .
          </p>
        </Section>

        <Section title="2. Types of Cookies We Use">
          <div className="space-y-5">
            <div className="p-4 rounded-xl border border-primary/15 bg-card">
              <h3 className="font-serif font-semibold text-primary mb-2">
                Essential Cookies
              </h3>
              <p>
                These cookies are strictly necessary for the website to
                function. They enable core features such as security, session
                management, and access control. You cannot opt out of these
                cookies.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Examples: session tokens, CSRF protection, login state
              </p>
            </div>
            <div className="p-4 rounded-xl border border-primary/15 bg-card">
              <h3 className="font-serif font-semibold text-primary mb-2">
                Analytics Cookies
              </h3>
              <p>
                These cookies help us understand how visitors interact with our
                website by collecting anonymous information. They help us
                improve site performance and user experience.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Examples: page views, session duration, bounce rate, traffic
                sources
              </p>
            </div>
            <div className="p-4 rounded-xl border border-primary/15 bg-card">
              <h3 className="font-serif font-semibold text-primary mb-2">
                Preference Cookies
              </h3>
              <p>
                These cookies allow the website to remember your preferences and
                settings, such as language preferences, display settings, and
                previously viewed properties.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Examples: language settings, recently viewed listings, display
                preferences
              </p>
            </div>
            <div className="p-4 rounded-xl border border-primary/15 bg-card">
              <h3 className="font-serif font-semibold text-primary mb-2">
                Marketing Cookies
              </h3>
              <p>
                These cookies track your browsing activity to deliver targeted
                advertising relevant to your interests. They may be set by us or
                third-party advertising partners.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Examples: retargeting, interest-based advertising, campaign
                tracking
              </p>
            </div>
          </div>
        </Section>

        <Section title="3. How to Manage Cookies">
          <p>You have several options to manage or disable cookies:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong className="text-primary/90">Browser Settings:</strong>{" "}
              Most browsers allow you to refuse or delete cookies.
              <ul className="list-disc pl-6 mt-1 space-y-1 text-sm">
                <li>
                  Chrome: Settings &rarr; Privacy and Security &rarr; Cookies
                </li>
                <li>
                  Firefox: Options &rarr; Privacy &amp; Security &rarr; Cookies
                </li>
                <li>Safari: Preferences &rarr; Privacy &rarr; Cookies</li>
                <li>Edge: Settings &rarr; Cookies and Site Permissions</li>
              </ul>
            </li>
            <li>
              <strong className="text-primary/90">Opt-Out Links:</strong> For
              analytics cookies, you can opt out through the respective
              provider&apos;s opt-out tools.
            </li>
            <li>
              <strong className="text-primary/90">Mobile Devices:</strong> You
              can manage cookies through your device settings under Privacy or
              Security.
            </li>
          </ul>
          <p className="mt-3 p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 text-yellow-200/80 text-sm">
            Note: Disabling essential cookies may prevent you from using certain
            features of our website, including secure login to internal
            applications.
          </p>
        </Section>

        <Section title="4. Third-Party Cookies">
          <p>
            We may use third-party services that set their own cookies on your
            device:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong className="text-primary/90">Google Analytics:</strong> For
              website traffic analysis and user behavior insights
            </li>
            <li>
              <strong className="text-primary/90">Google Maps:</strong> For
              property location mapping and directions
            </li>
            <li>
              <strong className="text-primary/90">
                WhatsApp Business API:
              </strong>{" "}
              For customer communication features
            </li>
          </ul>
          <p className="mt-3">
            These third parties have their own privacy policies. We do not
            control how they use data collected via their cookies.
          </p>
        </Section>

        <Section title="5. Updates to This Policy">
          <p>
            We may update this Cookie Policy from time to time to reflect
            changes in technology, law, or our business practices. When we make
            material changes, we will update the &ldquo;Last updated&rdquo; date
            at the top of this page and, where appropriate, notify you by email
            or through a notice on our website.
          </p>
          <p>
            Continued use of our website after any changes constitutes your
            acceptance of the updated policy.
          </p>
        </Section>

        <Section title="6. Contact Us">
          <p>If you have any questions about our use of cookies:</p>
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
