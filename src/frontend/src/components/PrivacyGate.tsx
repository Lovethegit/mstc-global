import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

const TERMS_TEXT = `TERMS AND CONDITIONS
MSTC GLOBAL — Last Updated: May 2026

1. ACCEPTANCE OF TERMS
By accessing, browsing, or using the MSTC GLOBAL platform ("Platform"), you agree to be legally bound by these Terms and Conditions, our Privacy Policy, Cookie Policy, Disclaimer, and Indemnity Agreement. If you do not agree, please discontinue use immediately.

2. ABOUT MSTC GLOBAL
MSTC GLOBAL is a multi-dimensional conglomerate operating through 8 service divisions: (i) Infrastructure & Property, (ii) RERA & PR Consulting, (iii) Purchase, Rent & Redevelopment, (iv) Finance & Investment, (v) Music & Cultural Services, (vi) Hospitality & Events, (vii) NGO & CSR Initiatives, and (viii) Media, Sports & Tourism. The Managing Director is Love Vijaybhai Parekh.

3. FACILITATOR ROLE & LIMITATION OF LIABILITY
MSTC GLOBAL acts solely as a FACILITATOR and INTERMEDIARY. All transactions, agreements, contracts, and dealings are between you and the respective third-party service provider, property owner, builder, agent, financial institution, or event organiser. MSTC GLOBAL is NOT a party to any transaction and accepts NO liability for:
- Property descriptions, prices, availability, legal status, or encumbrances
- Third-party financial advice, loan approvals, investment returns, or losses
- Outcome of RERA registrations, legal proceedings, or regulatory decisions
- Event quality, vendor performance, or delivery of services
- NGO/CSR fund utilisation beyond MSTC's direct oversight
- Any loss, damage, injury, or harm arising from reliance on information on this Platform

4. PROPERTY PORTAL
All property listings on this Platform are for informational purposes only. MSTC GLOBAL does not verify the legal title, encumbrances, or accuracy of any listing. Users must independently verify all information before transacting. MSTC GLOBAL assumes no responsibility for any property-related loss.

5. FINANCIAL INFORMATION
Financial calculators, EMI estimates, investment projections, and ROI figures are indicative only. They are not financial advice. MSTC GLOBAL is not a SEBI-registered investment advisor. Consult a qualified financial advisor before making any financial decision.

6. RERA CONSULTING
MSTC GLOBAL provides guidance on RERA processes for educational purposes only. We are not a registered legal firm. All RERA matters must be handled by qualified professionals. MSTC GLOBAL is not liable for any regulatory outcome.

7. INTELLECTUAL PROPERTY
All content on this Platform is the exclusive intellectual property of MSTC GLOBAL. Reproduction, distribution, or commercial use without prior written permission is strictly prohibited.

8. USER CONDUCT
You agree not to: misrepresent identity; submit false enquiries; use the Platform for illegal purposes; scrape Platform data; or attempt unauthorised access to admin systems.

9. DATA ACCURACY DISCLAIMER
MSTC GLOBAL makes NO representations or warranties regarding completeness, accuracy, reliability, or fitness for purpose of any content on this Platform.

10. INDEMNITY
You agree to indemnify, defend, and hold harmless MSTC GLOBAL, its Managing Director (Love Vijaybhai Parekh), directors, employees, and agents from any claims, liabilities, losses, damages, costs, and expenses arising from: (a) your use of the Platform; (b) your breach of these Terms; (c) any dispute with a third-party service provider; (d) any inaccurate information you provide.

11. PRIVACY & DATA
We collect and process personal data in accordance with our Privacy Policy and applicable Indian law (IT Act 2000 and IT Amendment Act 2008).

12. COOKIE POLICY
This Platform uses cookies for session management, analytics, and performance. By continuing, you consent to our use of cookies.

13. CONTACT & SUPPORT
Contact: +91 9512609016 | mstc.gbl@gmail.com | https://mstcglobal-kh8.caffeine.xyz

14. JURISDICTION
These Terms shall be governed by the laws of Gujarat, India. Disputes are subject to the exclusive jurisdiction of courts in Ahmedabad, Gujarat.

15. AMENDMENTS
MSTC GLOBAL reserves the right to modify these Terms at any time. Continued use of the Platform constitutes acceptance of revised Terms.

16. SEVERABILITY
If any provision is found invalid, the remaining provisions continue in full force.

17. ENTIRE AGREEMENT
These Terms, together with the Privacy Policy and Disclaimer, constitute the entire agreement between you and MSTC GLOBAL.`;

const PRIVACY_TEXT = `PRIVACY POLICY
MSTC GLOBAL — Last Updated: May 2026

1. INTRODUCTION
MSTC GLOBAL is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information.

2. INFORMATION WE COLLECT
We collect: (a) Information you provide: name, phone number, email address, enquiry details, property preferences; (b) Automatically collected: IP address, browser type, pages visited, device type, location (if permitted); (c) Cookies and session data.

3. HOW WE USE YOUR INFORMATION
- To respond to your enquiries and provide requested services
- To connect you with relevant service providers or property listings
- To send property alerts or newsletters (only if subscribed)
- To maintain our admin dashboard and track leads
- To improve Platform performance and user experience
- To comply with legal obligations

4. DATA SHARING
We do NOT sell your personal data. We may share it with: (a) Relevant service providers to facilitate your enquiry; (b) Technology service providers supporting Platform operations; (c) Regulatory or law enforcement authorities when legally required.

5. DATA SECURITY
We implement industry-standard security measures. However, no internet transmission is 100% secure. Use this Platform at your own risk.

6. DATA RETENTION
We retain your data for as long as necessary to provide services and as required by law. You may request deletion by contacting us.

7. YOUR RIGHTS
You have the right to: access your personal data; correct inaccurate data; request deletion; withdraw consent; lodge a complaint.

8. COOKIES
We use session cookies, analytics cookies, and preference cookies. You can manage cookies via your browser settings.

9. THIRD-PARTY LINKS
This Platform may link to third-party websites. We are not responsible for their privacy practices.

10. CHILDREN'S PRIVACY
This Platform is not directed at persons under 18. We do not knowingly collect data from minors.

11. CONTACT
Privacy enquiries: mstc.gbl@gmail.com | +91 9512609016`;

export default function PrivacyGate({ children }: Props) {
  const accepted =
    typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem("mstcPrivacyAccepted") === "true"
      : false;

  const [isAccepted, setIsAccepted] = useState(accepted);
  const [checked, setChecked] = useState(false);
  const [modalContent, setModalContent] = useState<"terms" | "privacy" | null>(
    null,
  );

  const handleAccept = () => {
    sessionStorage.setItem("mstcPrivacyAccepted", "true");
    setIsAccepted(true);
  };

  if (isAccepted) return <>{children}</>;

  return (
    <>
      {/* Fixed full-screen overlay — flex column so bottom section never scrolls off */}
      <div
        data-ocid="privacy.dialog"
        aria-label="Terms & Privacy Policy"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "#06090f",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Inner column — centered, max-width, full height */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            maxWidth: "640px",
            margin: "0 auto",
            padding: "0",
          }}
        >
          {/* ── HEADER (flex-shrink-0) ── */}
          <div
            style={{
              flexShrink: 0,
              padding: "20px 20px 16px",
              borderBottom: "1px solid oklch(0.72 0.18 76 / 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "10px",
              }}
            >
              <img
                src="/assets/generated/mstc-logo.dim_400x400.png"
                alt="MSTC GLOBAL Logo"
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "contain",
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  className="font-serif font-bold gold-text"
                  style={{ fontSize: "18px", letterSpacing: "0.15em" }}
                >
                  MSTC GLOBAL
                </div>
                <div
                  className="font-sans"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    color: "#c9a84c",
                    opacity: 0.8,
                  }}
                >
                  Excellence · Integrity · Innovation
                </div>
              </div>
            </div>
            <h2
              className="font-serif"
              style={{
                fontSize: "15px",
                color: "#e8e8e8",
                fontWeight: 600,
                marginBottom: "4px",
              }}
            >
              Welcome — Please Review Our Policies
            </h2>
            <p
              className="font-sans"
              style={{
                fontSize: "12px",
                color: "oklch(0.65 0.05 65)",
                lineHeight: 1.5,
              }}
            >
              Read and accept our terms before entering. Scroll through the
              section below.
            </p>
          </div>

          {/* ── SCROLLABLE CONTENT (flex-1, min-h-0) ── */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              maxHeight: "calc(100dvh - 220px)",
              overflowY: "auto",
              padding: "16px 20px",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* Key points summary */}
            <div style={{ marginBottom: "14px" }}>
              {(
                [
                  [
                    "Facilitator Disclaimer",
                    "MSTC GLOBAL acts solely as a facilitator. All transactions are between you and third-party providers. MSTC accepts no liability for outcomes.",
                  ],
                  [
                    "Property Information",
                    "All property listings are for information only. Verify all details independently before transacting. Prices are indicative only.",
                  ],
                  [
                    "Financial Guidance",
                    "Calculators and projections are indicative only and do not constitute financial advice.",
                  ],
                  [
                    "Indemnity",
                    "By entering, you indemnify MSTC GLOBAL, its MD Love Vijaybhai Parekh, directors, and agents from all claims arising from your use of this platform.",
                  ],
                ] as const
              ).map(([title, text]) => (
                <div
                  key={title}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid oklch(0.72 0.18 76 / 0.2)",
                    background: "oklch(0.12 0.01 65 / 0.6)",
                    marginBottom: "8px",
                  }}
                >
                  <p
                    className="font-sans"
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#c9a84c",
                      marginBottom: "3px",
                    }}
                  >
                    {title}
                  </p>
                  <p
                    className="font-sans"
                    style={{
                      fontSize: "11px",
                      color: "#e8e8e8",
                      lineHeight: 1.5,
                    }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>

            {/* Full document links */}
            <p
              className="font-sans"
              style={{
                fontSize: "11px",
                color: "oklch(0.65 0.05 65)",
                marginBottom: "8px",
              }}
            >
              Read the full documents before accepting:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setModalContent("terms")}
                data-ocid="privacy.terms_link"
                className="font-sans"
                style={{
                  fontSize: "12px",
                  color: "#c9a84c",
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Terms &amp; Conditions →
              </button>
              <button
                type="button"
                onClick={() => setModalContent("privacy")}
                data-ocid="privacy.privacy_link"
                className="font-sans"
                style={{
                  fontSize: "12px",
                  color: "#c9a84c",
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Privacy Policy →
              </button>
              <span
                className="font-sans"
                style={{ fontSize: "12px", color: "#c9a84c", opacity: 0.8 }}
              >
                Cookie Policy
              </span>
              <span
                className="font-sans"
                style={{ fontSize: "12px", color: "#c9a84c", opacity: 0.8 }}
              >
                Disclaimer
              </span>
            </div>
          </div>

          {/* ── BOTTOM ACTION SECTION (flex-shrink-0, always visible) ── */}
          <div
            style={{
              flexShrink: 0,
              padding: "16px 20px calc(16px + env(safe-area-inset-bottom))",
              borderTop: "1px solid oklch(0.72 0.18 76 / 0.2)",
              background: "#06090f",
            }}
          >
            {/* Checkbox row */}
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                cursor: "pointer",
                marginBottom: "14px",
                minHeight: "44px",
              }}
            >
              {/* Custom checkbox — 28×28px, gold accent, comfortable for mobile */}
              <div
                style={{
                  flexShrink: 0,
                  marginTop: "2px",
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  border: checked
                    ? "2px solid #c9a84c"
                    : "2px solid oklch(0.5 0.05 65)",
                  background: checked ? "#c9a84c" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  data-ocid="privacy.checkbox"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    width: 0,
                    height: 0,
                  }}
                />
                {checked && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6L5 9L10 3"
                      stroke="#06090f"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span
                className="font-sans"
                style={{ fontSize: "13px", color: "#e8e8e8", lineHeight: 1.5 }}
              >
                I have read and agree to the{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setModalContent("terms");
                  }}
                  style={{
                    color: "#c9a84c",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: "inherit",
                  }}
                >
                  Terms &amp; Conditions
                </button>
                ,{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setModalContent("privacy");
                  }}
                  style={{
                    color: "#c9a84c",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: "inherit",
                  }}
                >
                  Privacy Policy
                </button>
                , Cookie Policy, and Disclaimer. I acknowledge MSTC GLOBAL is a
                facilitator only.
                <span style={{ color: "#e53e3e" }}> *</span>
              </span>
            </label>

            {/* Enter Site button — always visible, full width */}
            <button
              type="button"
              data-ocid="privacy.accept_button"
              disabled={!checked}
              onClick={handleAccept}
              className="font-sans font-semibold"
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: "6px",
                fontSize: "14px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: "none",
                cursor: checked ? "pointer" : "not-allowed",
                background: checked ? "#c9a84c" : "oklch(0.25 0.02 65)",
                color: checked ? "#06090f" : "oklch(0.45 0.03 65)",
                opacity: checked ? 1 : 0.7,
                transition: "all 0.2s",
                minHeight: "50px",
              }}
            >
              {checked ? "Enter Site →" : "Accept Terms to Continue"}
            </button>

            {/* Disclaimer note */}
            <p
              className="font-sans"
              style={{
                fontSize: "10px",
                color: "oklch(0.45 0.03 65)",
                textAlign: "center",
                marginTop: "8px",
                lineHeight: 1.4,
              }}
            >
              MSTC GLOBAL · Ahmedabad, Gujarat, India · mstc.gbl@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* Full Text Modal — rendered above the gate */}
      {modalContent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            background: "rgba(0,0,0,0.75)",
          }}
          data-ocid="privacy.full_text_dialog"
        >
          <div
            style={{
              background: "oklch(0.14 0.015 62)",
              border: "1px solid oklch(0.72 0.18 76 / 0.3)",
              borderRadius: "12px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid oklch(0.72 0.18 76 / 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <h3
                className="font-serif font-bold gold-text"
                style={{ fontSize: "16px" }}
              >
                {modalContent === "terms"
                  ? "Terms & Conditions"
                  : "Privacy Policy"}
              </h3>
              <button
                type="button"
                data-ocid="privacy.close_button"
                onClick={() => setModalContent(null)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "oklch(0.2 0.02 65)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "none",
                  color: "oklch(0.7 0.05 65)",
                  fontSize: "16px",
                  flexShrink: 0,
                }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div
              style={{
                overflowY: "auto",
                padding: "16px 20px",
                flex: 1,
                minHeight: 0,
                WebkitOverflowScrolling: "touch",
              }}
            >
              <pre
                className="font-sans"
                style={{
                  fontSize: "11px",
                  lineHeight: 1.7,
                  color: "#e8e8e8",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {modalContent === "terms" ? TERMS_TEXT : PRIVACY_TEXT}
              </pre>
            </div>
            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid oklch(0.72 0.18 76 / 0.2)",
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="font-sans font-semibold"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  background: "oklch(0.2 0.02 65)",
                  color: "#c9a84c",
                  border: "1px solid oklch(0.72 0.18 76 / 0.3)",
                  cursor: "pointer",
                  fontSize: "13px",
                  minHeight: "44px",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
