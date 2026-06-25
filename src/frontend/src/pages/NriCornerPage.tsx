import { createActor } from "@/backend";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useActor } from "@/hooks/useActor";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Globe,
  Mail,
  MessageSquare,
  Phone,
  Shield,
} from "lucide-react";
import { useState } from "react";

const WHY_REASONS = [
  {
    icon: "🏙️",
    title: "Smart City Leader",
    desc: "Ahmedabad is among India's top-ranked smart cities, offering world-class infrastructure, connectivity, and civic services.",
  },
  {
    icon: "🚇",
    title: "Metro Expansion",
    desc: "Phase-2 Metro expansion is unlocking new corridors — Chandkheda, Ranip, Motera — with 15-20% value appreciation near upcoming stations.",
  },
  {
    icon: "💼",
    title: "GIFT City Growth",
    desc: "GIFT City in Gandhinagar is India's first operational International Financial Services Centre, drawing global investment and boosting nearby property demand.",
  },
  {
    icon: "📈",
    title: "Consistent Appreciation",
    desc: "Ahmedabad residential property has appreciated 10-14% annually over the past 5 years, outperforming many tier-1 cities on ROI per rupee invested.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "FEMA Compliance",
    desc: "Under FEMA 1999, NRIs and OCIs can freely purchase residential and commercial property in India. No RBI permission required. Agricultural land, plantation property, and farmhouses are excluded.",
  },
  {
    num: "02",
    title: "Types of Properties Permitted",
    desc: "NRIs can buy: Residential flats, villas, bungalows, plots in approved layouts; Commercial properties (offices, shops, warehouses). Co-operative housing societies and builder floors are permitted.",
  },
  {
    num: "03",
    title: "Fund Repatriation",
    desc: "Funds from sale proceeds can be repatriated abroad up to the original investment amount (max 2 properties) through NRE/NRO accounts. Consult CA for current RBI limits and DTAA benefits.",
  },
  {
    num: "04",
    title: "Tax Implications",
    desc: "TDS at 20% (LTCG) or 30% (STCG) applies on property sale. Lower TDS certificate can be obtained. Rental income taxable in India; DTAA with your country of residence may reduce double taxation.",
  },
  {
    num: "05",
    title: "Power of Attorney",
    desc: "NRIs can execute a Special Power of Attorney to authorise a trusted representative in India to sign documents, register property, and complete formalities on their behalf — essential for remote transactions.",
  },
];

const DOCS = [
  { icon: "🛂", label: "Valid Passport (NRI/OCI)" },
  {
    icon: "📬",
    label: "Overseas Address Proof (utility bill / bank statement)",
  },
  { icon: "🪪", label: "PAN Card (mandatory for property purchase in India)" },
  { icon: "🏦", label: "NRE / NRO Bank Account details" },
  { icon: "📄", label: "OCI Card (if applicable)" },
  { icon: "📑", label: "FEMA Declaration Form" },
  { icon: "✍️", label: "Notarised Power of Attorney (if buying remotely)" },
  { icon: "💳", label: "Recent bank statement (last 6 months)" },
];

const MSTC_SERVICES = [
  {
    icon: "🔍",
    title: "Virtual & Physical Site Visits",
    desc: "We arrange video walkthroughs and in-person inspection on your behalf, giving you a real-time, trust-based view of your shortlisted properties.",
  },
  {
    icon: "📋",
    title: "Documentation Assistance",
    desc: "From title search, encumbrance certificate, to RERA compliance checks — our team handles every document, in-person or remotely.",
  },
  {
    icon: "⚖️",
    title: "Legal & RERA Liaison",
    desc: "We co-ordinate with RERA-registered agents, sub-registrar offices, and legal advisors to ensure your transaction is fully compliant.",
  },
  {
    icon: "💱",
    title: "NRE/NRO Transfer Guidance",
    desc: "Our finance team guides you on optimal fund transfer methods, TDS implications, and repatriation compliance — including DTAA benefits.",
  },
];

const FAQS = [
  {
    q: "Can an NRI buy any type of property in India?",
    a: "NRIs and OCIs can buy residential and commercial properties without RBI approval. Agricultural land, plantation properties, and farmhouses cannot be purchased — unless inherited or gifted.",
  },
  {
    q: "Do I need to physically travel to India to complete the purchase?",
    a: "No. With a properly executed Special Power of Attorney, a trusted representative can complete registration and all formalities on your behalf. MSTC GLOBAL provides end-to-end support for remote buyers.",
  },
  {
    q: "Is TDS applicable when an NRI sells property in India?",
    a: "Yes. TDS at 20% (LTCG, property held >2 years) or 30% (STCG) applies. The buyer must deduct TDS. NRIs can apply for a lower TDS certificate under Section 197 to reduce TDS deductions based on DTAA treaties.",
  },
  {
    q: "Can I repatriate sale proceeds back to my overseas account?",
    a: "Yes, up to the original purchase amount (in foreign currency) can be repatriated from an NRO account, subject to annual USD 1 million limit under FEMA. Additional proceeds can be repatriated from an NRE account with CA certification.",
  },
  {
    q: "How does MSTC GLOBAL help NRIs specifically?",
    a: "We provide dedicated NRI services including virtual site visits, legal vetting, RERA compliance checks, documentation, NRE/NRO transfer guidance, and Power of Attorney support — ensuring a seamless purchase from anywhere in the world.",
  },
  {
    q: "What are the best areas to invest in Ahmedabad as an NRI?",
    a: "Satellite, SG Highway, Bopal, Thaltej, and Prahlad Nagar offer strong rental yields (3-5%) and capital appreciation. GIFT City vicinity and Motera (Metro Phase-2) are emerging investment corridors for 2026-2028.",
  },
];

const CURRENCIES = [
  "INR (₹)",
  "USD ($)",
  "AED (د.إ)",
  "GBP (£)",
  "CAD ($)",
  "AUD ($)",
  "SGD ($)",
  "EUR (€)",
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-gold-800/30 rounded-xl overflow-hidden"
      data-ocid="nri.faq_item"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-card hover:bg-obsidian-700/40 transition-colors"
      >
        <span className="font-sans font-medium text-sm text-foreground">
          {q}
        </span>
        {open ? (
          <ChevronUp size={16} className="text-gold-400 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-gold-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 pt-2 bg-obsidian-800/40 border-t border-gold-800/20">
          <p className="font-sans text-sm text-obsidian-100 leading-relaxed">
            {a}
          </p>
        </div>
      )}
    </div>
  );
}

export default function NriCornerPage() {
  const { actor } = useActor(createActor);
  const [form, setForm] = useState({
    name: "",
    country: "",
    phone: "",
    email: "",
    propertyType: "",
    currency: "USD ($)",
    budget: "",
    message: "",
    agreed: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.agreed) {
      setError("Please accept the terms to proceed.");
      return;
    }
    if (!form.name || !form.phone || !form.email) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      if (actor) {
        await actor.logServiceSubmission(
          "NRI",
          "nri-corner",
          "enquiry",
          [
            ["Country of Residence", form.country],
            ["Property Type", form.propertyType],
            ["Budget Currency", form.currency],
            ["Budget", form.budget],
            ["Message", form.message],
          ],
          form.name,
          form.phone,
          form.email,
          true,
        );
      }
      setSubmitted(true);
    } catch {
      setError("Submission failed. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-obsidian-900 text-gold-100">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-16 px-4 bg-gradient-to-b from-obsidian-800 to-obsidian-900 border-b border-gold-800/30">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-sans mb-8 transition-colors"
              data-ocid="nri.back_link"
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe size={32} className="text-gold-400" />
            </div>
            <h1 className="font-serif font-bold text-3xl md:text-5xl gold-text mb-4">
              NRI Corner
            </h1>
            <p className="font-serif text-xl md:text-2xl text-gold-300 mb-4">
              Invest in Ahmedabad from Anywhere in the World
            </p>
            <p className="font-sans text-base text-obsidian-100 max-w-2xl mx-auto leading-relaxed">
              MSTC GLOBAL provides comprehensive end-to-end property investment
              services for NRIs across the USA, UAE, UK, Canada, and beyond. We
              handle everything — from legal compliance to virtual site visits —
              so you can invest with confidence from abroad.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <a
                href="tel:+919512609016"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600/20 text-green-400 border border-green-600/40 hover:bg-green-600/30 transition-colors font-sans font-medium text-sm"
                data-ocid="nri.whatsapp_button"
              >
                <MessageSquare size={16} /> Call / WhatsApp: +91 9512609016
              </a>
              <a
                href="tel:9512609016"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gold-gradient text-obsidian-900 font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
                data-ocid="nri.call_button"
              >
                <Phone size={16} /> +91 9512609016
              </a>
            </div>
          </div>
        </section>

        {/* Why Ahmedabad */}
        <section className="py-16 px-4 bg-obsidian-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif font-bold text-2xl md:text-3xl gold-text text-center mb-10">
              Why Ahmedabad?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {WHY_REASONS.map((r) => (
                <div
                  key={r.title}
                  className="rounded-xl p-6 bg-card border border-gold-800/30 hover:border-gold-500/50 transition-all duration-300"
                >
                  <div className="text-3xl mb-3">{r.icon}</div>
                  <h3 className="font-serif font-semibold text-gold-300 mb-2">
                    {r.title}
                  </h3>
                  <p className="font-sans text-sm text-obsidian-100 leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NRI Investment Guide */}
        <section className="py-16 px-4 bg-obsidian-800/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif font-bold text-2xl md:text-3xl gold-text text-center mb-10">
              NRI Investment Guide — Step by Step
            </h2>
            <div className="space-y-4">
              {STEPS.map((step) => (
                <div
                  key={step.num}
                  className="flex gap-5 p-6 rounded-xl bg-card border border-gold-800/30"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-obsidian-900 font-bold font-serif text-sm">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-gold-300 mb-1">
                      {step.title}
                    </h3>
                    <p className="font-sans text-sm text-obsidian-100 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Documents Required */}
        <section className="py-16 px-4 bg-obsidian-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif font-bold text-2xl md:text-3xl gold-text text-center mb-10">
              Documents Required
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DOCS.map((d) => (
                <div
                  key={d.label}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-gold-800/30"
                >
                  <span className="text-xl">{d.icon}</span>
                  <span className="font-sans text-sm text-foreground">
                    {d.label}
                  </span>
                  <CheckCircle2
                    size={16}
                    className="text-gold-500 ml-auto shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MSTC Services */}
        <section className="py-16 px-4 bg-obsidian-800/40">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif font-bold text-2xl md:text-3xl gold-text text-center mb-10">
              How MSTC GLOBAL Supports NRI Investors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MSTC_SERVICES.map((s) => (
                <div
                  key={s.title}
                  className="rounded-xl p-6 bg-card border border-gold-800/30 hover:border-gold-500/50 transition-all duration-300"
                >
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <h3 className="font-serif font-semibold text-gold-300 mb-2">
                    {s.title}
                  </h3>
                  <p className="font-sans text-sm text-obsidian-100 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enquiry Form */}
        <section className="py-16 px-4 bg-obsidian-900">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif font-bold text-2xl md:text-3xl gold-text mb-3">
                NRI Property Enquiry
              </h2>
              <p className="font-sans text-sm text-obsidian-100">
                Fill the form below and our NRI specialist will connect with you
                within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div
                className="rounded-xl p-8 bg-card border border-gold-500/40 text-center"
                data-ocid="nri.form.success_state"
              >
                <CheckCircle2
                  size={48}
                  className="text-gold-400 mx-auto mb-4"
                />
                <h3 className="font-serif text-xl text-gold-300 mb-2">
                  Enquiry Received!
                </h3>
                <p className="font-sans text-sm text-obsidian-100 mb-6">
                  Our NRI specialist will contact you within 24 hours. You can
                  also reach us directly:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="tel:+919512609016"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600/20 text-green-400 border border-green-600/40 font-sans text-sm"
                  >
                    <MessageSquare size={15} /> +91 9512609016
                  </a>
                  <a
                    href="mailto:mstc.gbl@gmail.com"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gold-700/40 text-gold-400 font-sans text-sm"
                  >
                    <Mail size={15} /> mstc.gbl@gmail.com
                  </a>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-xl p-6 md:p-8 bg-card border border-gold-800/30 space-y-5"
                data-ocid="nri.enquiry_form"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      required
                      className="px-3 py-2 rounded-lg bg-obsidian-900 border border-gold-700/40 text-foreground text-sm focus:outline-none focus:border-gold-500 font-sans"
                      placeholder="Your full name"
                      data-ocid="nri.name.input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                      Country of Residence *
                    </label>
                    <input
                      type="text"
                      value={form.country}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, country: e.target.value }))
                      }
                      required
                      className="px-3 py-2 rounded-lg bg-obsidian-900 border border-gold-700/40 text-foreground text-sm focus:outline-none focus:border-gold-500 font-sans"
                      placeholder="e.g. United States"
                      data-ocid="nri.country.input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                      Phone (with country code) *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      required
                      className="px-3 py-2 rounded-lg bg-obsidian-900 border border-gold-700/40 text-foreground text-sm focus:outline-none focus:border-gold-500 font-sans"
                      placeholder="+1 555 123 4567"
                      data-ocid="nri.phone.input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      required
                      className="px-3 py-2 rounded-lg bg-obsidian-900 border border-gold-700/40 text-foreground text-sm focus:outline-none focus:border-gold-500 font-sans"
                      placeholder="you@email.com"
                      data-ocid="nri.email.input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                      Property Type
                    </label>
                    <select
                      value={form.propertyType}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, propertyType: e.target.value }))
                      }
                      className="px-3 py-2 rounded-lg bg-obsidian-900 border border-gold-700/40 text-foreground text-sm focus:outline-none focus:border-gold-500 font-sans"
                      data-ocid="nri.property_type.select"
                    >
                      <option value="">Select type</option>
                      {[
                        "Residential Apartment",
                        "Villa / Bungalow",
                        "Commercial",
                        "Plot / Land",
                        "Office Space",
                        "Any",
                      ].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                      Budget Currency
                    </label>
                    <select
                      value={form.currency}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, currency: e.target.value }))
                      }
                      className="px-3 py-2 rounded-lg bg-obsidian-900 border border-gold-700/40 text-foreground text-sm focus:outline-none focus:border-gold-500 font-sans"
                      data-ocid="nri.currency.select"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                    Budget
                  </label>
                  <input
                    type="text"
                    value={form.budget}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, budget: e.target.value }))
                    }
                    className="px-3 py-2 rounded-lg bg-obsidian-900 border border-gold-700/40 text-foreground text-sm focus:outline-none focus:border-gold-500 font-sans"
                    placeholder="e.g. $150,000 or ₹1.5 Cr"
                    data-ocid="nri.budget.input"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                    Message / Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    className="px-3 py-2 rounded-lg bg-obsidian-900 border border-gold-700/40 text-foreground text-sm focus:outline-none focus:border-gold-500 font-sans resize-none"
                    placeholder="Tell us about your requirements — preferred area, timeline, purpose (own use / investment), etc."
                    data-ocid="nri.message.textarea"
                  />
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-obsidian-800/60 border border-gold-700/20">
                  <input
                    id="nri-agree"
                    type="checkbox"
                    checked={form.agreed}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, agreed: e.target.checked }))
                    }
                    className="mt-0.5 w-4 h-4 accent-gold-500"
                    data-ocid="nri.agree.checkbox"
                  />
                  <label
                    htmlFor="nri-agree"
                    className="font-sans text-xs text-obsidian-100 leading-relaxed"
                  >
                    <Shield size={12} className="inline mr-1 text-gold-500" />I
                    agree that MSTC GLOBAL is a facilitator only and not
                    responsible for any transaction outcomes. I have read and
                    accept the{" "}
                    <Link to="/" className="text-gold-400 hover:underline">
                      Terms &amp; Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/" className="text-gold-400 hover:underline">
                      Privacy Policy
                    </Link>
                    . All information provided is accurate to the best of my
                    knowledge.
                  </label>
                </div>

                {error && (
                  <p
                    className="text-destructive text-sm text-center"
                    data-ocid="nri.form.error_state"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-lg gold-gradient text-obsidian-900 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 font-sans"
                  data-ocid="nri.form.submit_button"
                >
                  {submitting ? "Submitting…" : "Submit NRI Enquiry"}
                </button>

                <p className="text-center text-xs text-muted-foreground font-sans">
                  Our NRI specialist will contact you within 24 hours via
                  WhatsApp or email.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-obsidian-800/40">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif font-bold text-2xl md:text-3xl gold-text text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-12 px-4 bg-obsidian-900 border-t border-gold-800/30">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="font-serif text-lg text-gold-300">
              Ready to invest from abroad?
            </p>
            <p className="font-sans text-sm text-obsidian-100">
              Our NRI specialists are available 7 days a week to guide you every
              step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:+919512609016"
                target="_self"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600/20 text-green-400 border border-green-600/40 font-sans font-medium text-sm"
                data-ocid="nri.cta.whatsapp_button"
              >
                <MessageSquare size={16} /> Call: +91 9512609016
              </a>
              <a
                href="mailto:mstc.gbl@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gold-700/40 text-gold-400 font-sans font-medium text-sm hover:border-gold-500/60 transition-colors"
                data-ocid="nri.cta.email_button"
              >
                <Mail size={16} /> mstc.gbl@gmail.com
              </a>
              <a
                href="tel:9512609016"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gold-700/40 text-gold-400 font-sans font-medium text-sm hover:border-gold-500/60 transition-colors"
                data-ocid="nri.cta.call_button"
              >
                <Phone size={16} /> +91 9512609016
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
