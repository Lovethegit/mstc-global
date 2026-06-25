import PrivacyGate from "@/components/PrivacyGate";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BackToTop from "@/components/ui/BackToTop";
import { useLogServiceSubmission } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Download,
  FileText,
  Mail,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const NEWSLETTERS = [
  {
    id: "jun-2026",
    title: "Ahmedabad Real Estate Market — June 2026",
    date: "June 2026",
    topics: [
      "SG Highway & Prahlad Nagar — 8–12% appreciation",
      "143 new RERA projects registered in Q2",
      "RBI holds repo rate at 6.5%",
      "Top 5 upcoming township launches",
    ],
    summary:
      "SG Highway and Prahlad Nagar saw 8–12% price appreciation. 143 new RERA projects registered in Gujarat. RBI held rates steady at 6.5%. Premium segment leads demand.",
    content: {
      marketOverview:
        "The Ahmedabad real estate market continued its strong upward momentum in Q2 2026. Premium localities such as SG Highway, Prahlad Nagar, and Satellite recorded 8–12% price appreciation year-over-year. Demand for 3BHK and 4BHK configurations remains robust, driven by HNI and NRI buyers.",
      topLocalities: [
        { name: "SG Highway", appreciation: "+11.4%", avgPsf: "₹7,800" },
        { name: "Prahlad Nagar", appreciation: "+9.2%", avgPsf: "₹7,200" },
        { name: "Satellite", appreciation: "+8.8%", avgPsf: "₹7,600" },
        { name: "Bopal", appreciation: "+6.5%", avgPsf: "₹5,100" },
        { name: "Gota", appreciation: "+5.8%", avgPsf: "₹4,600" },
      ],
      reraUpdate:
        "GujRERA registered 143 new residential projects in Q2 2026. Enhanced transparency rules mandate quarterly project updates. 89 projects received RERA completion certificates.",
      financeTips:
        "Home loan rates remain stable at 8.5–9.2% p.a. SBI and HDFC offer special NRI packages with up to 90% LTV. Pre-approved loans available for ready-to-move projects.",
    },
  },
  {
    id: "may-2026",
    title: "Property Investment Guide — May 2026",
    date: "May 2026",
    topics: [
      "Budget-friendly buys under ₹50L in Bopal & Gota",
      "Commercial space outlook — IT corridor boom",
      "RBI circular eases NRI repatriation",
      "Upcoming township launches on Sarkhej Road",
    ],
    summary:
      "Bopal and Gota emerged as top budget-friendly zones. New RBI circular eases NRI repatriation norms. Commercial space demand surges on IT corridor. Several major townships announced.",
    content: {
      marketOverview:
        "May 2026 saw a surge in affordable housing demand in the ₹30L–50L segment. Bopal, Gota, and Chandkheda led volume sales. The commercial real estate sector is heating up around the IT corridor near GIFT City and Sarkhej.",
      topLocalities: [
        { name: "Bopal", appreciation: "+7.2%", avgPsf: "₹5,200" },
        { name: "Gota", appreciation: "+6.1%", avgPsf: "₹4,800" },
        { name: "Chandkheda", appreciation: "+5.5%", avgPsf: "₹4,100" },
        { name: "Naroda", appreciation: "+4.8%", avgPsf: "₹3,400" },
        { name: "Vastral", appreciation: "+4.2%", avgPsf: "₹3,100" },
      ],
      reraUpdate:
        "96 new projects registered in May. RBI circular relaxes repatriation norms for NRI property sales proceeds. NRIs may now repatriate up to the original acquisition cost from NRE accounts.",
      financeTips:
        "PMAY-Urban scheme benefits available for first-time buyers. Interest subsidy of up to 2.67 lakh for EWS/LIG segments. Apply via NHB portal before June 30.",
    },
  },
  {
    id: "apr-2026",
    title: "RERA Compliance Update — Q1 2026",
    date: "April 2026",
    topics: [
      "GujRERA stricter delivery timelines from April 2026",
      "All promoters must renew registration by June 2026",
      "New agent compliance checklist released",
      "Penalty structure updated for delays",
    ],
    summary:
      "GujRERA introduced stricter delivery timelines effective April 2026. All promoters must renew registration by June 2026. Agent compliance checklist updated with new documentation requirements.",
    content: {
      marketOverview:
        "Q1 2026 saw GujRERA strengthening buyer protection rules. Developers must now submit quarterly construction progress reports with photo evidence. Delay penalties increased to 1.5% per month of the base price for projects missing possession timelines.",
      topLocalities: [
        { name: "Navrangpura", appreciation: "+5.9%", avgPsf: "₹6,800" },
        { name: "Paldi", appreciation: "+5.4%", avgPsf: "₹5,900" },
        { name: "Maninagar", appreciation: "+4.6%", avgPsf: "₹4,300" },
        { name: "Thaltej", appreciation: "+8.2%", avgPsf: "₹6,200" },
        { name: "Ambawadi", appreciation: "+6.0%", avgPsf: "₹6,100" },
      ],
      reraUpdate:
        "GujRERA Circular 2026/03 mandates all registered promoters to renew registration by June 30, 2026. New Form K for agent compliance submitted quarterly. Penalty for non-compliance: ₹50,000 per month.",
      financeTips:
        "RERA-compliant projects see 15–18% better resale value compared to non-registered projects. Always verify RERA registration at rera.gujarat.gov.in before booking.",
    },
  },
];

type Newsletter = (typeof NEWSLETTERS)[0];

function NewsletterPrintView({
  nl,
  onClose,
}: { nl: Newsletter; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0.06 0.01 60 / 0.9)" }}
    >
      <div
        className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "0 20px 60px oklch(0.06 0.01 60 / 0.6)" }}
      >
        {/* Print Header */}
        <div
          className="p-6 border-b border-border"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.12 0.015 62), oklch(0.16 0.025 70))",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-serif font-bold text-lg gold-text">
                MSTC GLOBAL
              </div>
              <div className="text-xs text-muted-foreground">
                MSTC Insights Newsletter — {nl.date}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <h2 className="font-serif font-bold text-2xl gold-text">
            {nl.title}
          </h2>

          {/* Summary */}
          <div
            className="p-4 rounded-xl"
            style={{
              background: "oklch(0.72 0.18 76 / 0.08)",
              border: "1px solid oklch(0.72 0.18 76 / 0.3)",
            }}
          >
            <h3 className="font-semibold text-sm text-foreground mb-2">
              Editor&apos;s Summary
            </h3>
            <p className="text-sm text-muted-foreground">{nl.summary}</p>
          </div>

          {/* Market Overview */}
          <div>
            <h3 className="font-serif font-semibold text-base text-foreground mb-2">
              Market Overview
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {nl.content.marketOverview}
            </p>
          </div>

          {/* Price Trends Table */}
          <div>
            <h3 className="font-serif font-semibold text-base text-foreground mb-3">
              Top Locality Price Trends
            </h3>
            <div className="rounded-xl overflow-hidden border border-border">
              <table className="w-full text-sm">
                <thead
                  style={{
                    background: "oklch(0.72 0.18 76 / 0.1)",
                    borderBottom: "1px solid oklch(0.72 0.18 76 / 0.2)",
                  }}
                >
                  <tr>
                    <th className="text-left p-3 text-xs font-semibold text-foreground">
                      Locality
                    </th>
                    <th className="text-right p-3 text-xs font-semibold text-foreground">
                      Y-O-Y Change
                    </th>
                    <th className="text-right p-3 text-xs font-semibold text-foreground">
                      Avg Price/Sqft
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {nl.content.topLocalities.map((loc, i) => (
                    <tr
                      key={loc.name}
                      style={{
                        background:
                          i % 2 === 0
                            ? undefined
                            : "oklch(0.72 0.18 76 / 0.04)",
                      }}
                    >
                      <td className="p-3 text-sm text-foreground">
                        {loc.name}
                      </td>
                      <td
                        className="p-3 text-right text-sm font-semibold"
                        style={{ color: "oklch(0.6 0.18 148)" }}
                      >
                        {loc.appreciation}
                      </td>
                      <td
                        className="p-3 text-right text-sm"
                        style={{ color: "oklch(0.72 0.18 76)" }}
                      >
                        {loc.avgPsf}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RERA Update */}
          <div>
            <h3 className="font-serif font-semibold text-base text-foreground mb-2">
              RERA Update
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {nl.content.reraUpdate}
            </p>
          </div>

          {/* Finance Tips */}
          <div>
            <h3 className="font-serif font-semibold text-base text-foreground mb-2">
              Finance &amp; Investment Tips
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {nl.content.financeTips}
            </p>
          </div>

          {/* Disclaimer */}
          <div className="p-3 rounded-lg bg-muted/20 border border-border">
            <p className="text-xs text-muted-foreground">
              ⚠️ This newsletter is for informational purposes only. MSTC GLOBAL
              does not guarantee accuracy of data. Please conduct independent
              due diligence before any investment decisions. Content is compiled
              from public sources.
            </p>
          </div>

          {/* Print Footer */}
          <div className="border-t border-border pt-4 text-xs text-muted-foreground">
            MSTC GLOBAL • +91 9512609016 • mstc.gbl@gmail.com •
            mstcglobal-kh8.caffeine.xyz
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
            style={{
              background: "oklch(0.72 0.18 76)",
              color: "oklch(0.1 0.01 60)",
            }}
          >
            <Download size={14} /> Save as PDF / Print
          </button>
        </div>
      </div>
    </div>
  );
}

interface SubscribeForm {
  name: string;
  email: string;
  phone: string;
  indemnity: boolean;
}

export default function NewsletterPage() {
  const logSubmission = useLogServiceSubmission();
  const [selectedNl, setSelectedNl] = useState<Newsletter | null>(null);
  const [captureEmail, setCaptureEmail] = useState(false);
  const [captureForm, setCaptureForm] = useState({
    name: "",
    email: "",
    phone: "",
    indemnity: false,
  });
  const [pendingNl, setPendingNl] = useState<Newsletter | null>(null);
  const [subscribeForm, setSubscribeForm] = useState<SubscribeForm>({
    name: "",
    email: "",
    phone: "",
    indemnity: false,
  });
  const [subscribed, setSubscribed] = useState(false);

  const handleDownloadClick = (nl: Newsletter) => {
    setPendingNl(nl);
    setCaptureEmail(true);
    setCaptureForm({ name: "", email: "", phone: "", indemnity: false });
  };

  const handleCaptureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captureForm.indemnity || !pendingNl) return;
    logSubmission.mutate({
      serviceCategory: "Newsletter",
      innerPage: "Newsletter Download",
      formType: "NewsletterAccess",
      fields: [["Issue", pendingNl.title]],
      submitterName: captureForm.name,
      submitterPhone: captureForm.phone,
      submitterEmail: captureForm.email,
      indemnityAccepted: true,
    });
    setCaptureEmail(false);
    setSelectedNl(pendingNl);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeForm.indemnity) return;
    logSubmission.mutate({
      serviceCategory: "Newsletter",
      innerPage: "Newsletter Subscribe",
      formType: "Subscribe",
      fields: [["Email", subscribeForm.email]],
      submitterName: subscribeForm.name,
      submitterPhone: subscribeForm.phone,
      submitterEmail: subscribeForm.email,
      indemnityAccepted: true,
    });
    setSubscribed(true);
  };

  return (
    <PrivacyGate>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        {/* Header */}
        <section className="pt-24 pb-8 px-4 bg-card/50 border-b border-border">
          <div className="max-w-5xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
              data-ocid="newsletter.back_button"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={24} className="text-primary" />
              <h1 className="font-serif font-bold text-3xl gold-text">
                MSTC Insights Newsletter
              </h1>
            </div>
            <p className="font-sans text-sm text-muted-foreground">
              Monthly reports on Ahmedabad property market, RERA updates, home
              loan rates and investment tips — free, from MSTC GLOBAL.
            </p>
          </div>
        </section>

        <main className="max-w-5xl mx-auto px-4 py-10">
          {/* Subscribe Banner */}
          <div
            className="rounded-2xl p-6 mb-10"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.12 0.015 62), oklch(0.18 0.025 70))",
              border: "1px solid oklch(0.72 0.18 76 / 0.3)",
            }}
          >
            <div className="flex items-start gap-4">
              <Bell size={24} className="text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="font-serif font-bold text-xl gold-text mb-1">
                  Get It in Your Inbox
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Free monthly market insights. Unsubscribe anytime.
                </p>
                {!subscribed ? (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <input
                          required
                          placeholder="Your Name"
                          value={subscribeForm.name}
                          onChange={(e) =>
                            setSubscribeForm((f) => ({
                              ...f,
                              name: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                          data-ocid="newsletter.name_input"
                        />
                      </div>
                      <div>
                        <input
                          required
                          type="email"
                          placeholder="your@email.com"
                          value={subscribeForm.email}
                          onChange={(e) =>
                            setSubscribeForm((f) => ({
                              ...f,
                              email: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                          data-ocid="newsletter.email_input"
                        />
                      </div>
                      <div>
                        <input
                          required
                          placeholder="Phone"
                          value={subscribeForm.phone}
                          onChange={(e) =>
                            setSubscribeForm((f) => ({
                              ...f,
                              phone: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                          data-ocid="newsletter.phone_input"
                        />
                      </div>
                    </div>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subscribeForm.indemnity}
                        onChange={(e) =>
                          setSubscribeForm((f) => ({
                            ...f,
                            indemnity: e.target.checked,
                          }))
                        }
                        className="mt-0.5 accent-primary"
                        data-ocid="newsletter.subscribe_indemnity_checkbox"
                      />
                      <span className="text-xs text-muted-foreground">
                        I agree to receive periodic market reports from MSTC
                        GLOBAL. I can unsubscribe at any time.
                        <span className="text-red-400 ml-1">*Required</span>
                      </span>
                    </label>
                    <button
                      type="submit"
                      disabled={
                        !subscribeForm.indemnity || logSubmission.isPending
                      }
                      className="px-6 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-50"
                      style={{
                        background: "oklch(0.72 0.18 76)",
                        color: "oklch(0.1 0.01 60)",
                      }}
                      data-ocid="newsletter.subscribe_button"
                    >
                      Subscribe Free
                    </button>
                  </form>
                ) : (
                  <div
                    className="p-3 rounded-lg text-sm font-medium flex items-center gap-2"
                    style={{
                      background: "oklch(0.4 0.15 148 / 0.2)",
                      border: "1px solid oklch(0.5 0.18 148 / 0.4)",
                      color: "oklch(0.7 0.18 148)",
                    }}
                  >
                    <CheckCircle2 size={16} /> Subscribed! You&apos;ll receive
                    the next edition in your inbox.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Past Issues */}
          <h2 className="font-serif font-bold text-xl text-foreground mb-5">
            Past Issues
          </h2>
          <div className="space-y-4">
            {NEWSLETTERS.map((nl, i) => (
              <div
                key={nl.id}
                className="border border-border rounded-xl bg-card p-5 hover:border-primary/40 transition-all"
                data-ocid={`newsletter.issue.${i + 1}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "oklch(0.72 0.18 76 / 0.1)",
                      border: "1px solid oklch(0.72 0.18 76 / 0.25)",
                    }}
                  >
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">
                        {nl.date}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full border"
                        style={{
                          background: "oklch(0.72 0.18 76 / 0.1)",
                          borderColor: "oklch(0.72 0.18 76 / 0.3)",
                          color: "oklch(0.72 0.18 76)",
                        }}
                      >
                        Free Report
                      </span>
                    </div>
                    <h3 className="font-serif font-semibold text-base text-foreground mb-2">
                      {nl.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {nl.summary}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {nl.topics.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 rounded-full border"
                          style={{
                            background: "oklch(0.72 0.18 76 / 0.06)",
                            borderColor: "oklch(0.72 0.18 76 / 0.2)",
                            color: "oklch(0.72 0.18 76)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadClick(nl)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all hover:border-primary/60"
                    style={{
                      borderColor: "oklch(0.72 0.18 76 / 0.4)",
                      color: "oklch(0.72 0.18 76)",
                    }}
                    data-ocid={`newsletter.download_button.${i + 1}`}
                  >
                    <Download size={13} /> View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
        <Footer />
        <BackToTop />

        {/* Email Capture Modal */}
        {captureEmail && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "oklch(0.06 0.01 60 / 0.85)" }}
          >
            <div
              className="bg-card border border-border rounded-2xl max-w-sm w-full p-6"
              style={{ boxShadow: "0 20px 60px oklch(0.06 0.01 60 / 0.6)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-primary" />
                  <h3 className="font-serif font-semibold text-lg text-foreground">
                    Access Newsletter
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCaptureEmail(false)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Enter your details to access the free report.
              </p>
              <form onSubmit={handleCaptureSubmit} className="space-y-3">
                <input
                  required
                  placeholder="Your Name"
                  value={captureForm.name}
                  onChange={(e) =>
                    setCaptureForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                  data-ocid="newsletter.capture_name_input"
                />
                <input
                  required
                  type="email"
                  placeholder="your@email.com"
                  value={captureForm.email}
                  onChange={(e) =>
                    setCaptureForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                  data-ocid="newsletter.capture_email_input"
                />
                <input
                  required
                  placeholder="Phone"
                  value={captureForm.phone}
                  onChange={(e) =>
                    setCaptureForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                  data-ocid="newsletter.capture_phone_input"
                />
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={captureForm.indemnity}
                    onChange={(e) =>
                      setCaptureForm((f) => ({
                        ...f,
                        indemnity: e.target.checked,
                      }))
                    }
                    className="mt-0.5 accent-primary"
                    data-ocid="newsletter.capture_indemnity_checkbox"
                  />
                  <span className="text-xs text-muted-foreground">
                    I agree to receive the newsletter and understand the content
                    is for informational purposes only.
                    <span className="text-red-400 ml-1">*Required</span>
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={!captureForm.indemnity}
                  className="w-full py-2.5 rounded-lg font-semibold text-sm disabled:opacity-50"
                  style={{
                    background: "oklch(0.72 0.18 76)",
                    color: "oklch(0.1 0.01 60)",
                  }}
                  data-ocid="newsletter.capture_submit_button"
                >
                  Access Free Report
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Full Newsletter Viewer */}
        {selectedNl && (
          <NewsletterPrintView
            nl={selectedNl}
            onClose={() => setSelectedNl(null)}
          />
        )}
      </div>
    </PrivacyGate>
  );
}
