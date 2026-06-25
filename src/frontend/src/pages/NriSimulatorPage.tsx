import PrivacyGate from "@/components/PrivacyGate";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BackToTop from "@/components/ui/BackToTop";
import { useLogServiceSubmission } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  Calculator,
  CheckCircle2,
  Globe,
  Home,
  Info,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

const EXCHANGE_RATES: Record<
  string,
  { rate: number; label: string; symbol: string }
> = {
  USD: { rate: 84, label: "US Dollar", symbol: "$" },
  AED: { rate: 23, label: "UAE Dirham", symbol: "د.إ" },
  GBP: { rate: 107, label: "British Pound", symbol: "£" },
  EUR: { rate: 90, label: "Euro", symbol: "€" },
  CAD: { rate: 62, label: "Canadian Dollar", symbol: "C$" },
  AUD: { rate: 55, label: "Australian Dollar", symbol: "A$" },
  SGD: { rate: 62, label: "Singapore Dollar", symbol: "S$" },
};

interface PropertyCategory {
  label: string;
  icon: React.ElementType;
  minInr: number;
  maxInr: number;
  count: number;
  localities: string[];
  pricePerSqft: string;
}

const PROPERTY_CATEGORIES: PropertyCategory[] = [
  {
    label: "1 BHK Apartment (Affordable)",
    icon: Home,
    minInr: 1500000,
    maxInr: 4000000,
    count: 142,
    localities: ["Naroda", "Vastral", "Nikol", "Chandkheda"],
    pricePerSqft: "₹2,800–4,200",
  },
  {
    label: "2 BHK Apartment (Mid-range)",
    icon: Home,
    minInr: 4000000,
    maxInr: 8500000,
    count: 284,
    localities: ["Bopal", "Gota", "Maninagar", "Paldi"],
    pricePerSqft: "₹3,500–5,500",
  },
  {
    label: "3 BHK Apartment (Premium)",
    icon: Home,
    minInr: 8500000,
    maxInr: 18000000,
    count: 167,
    localities: ["Satellite", "Thaltej", "Prahlad Nagar", "SG Highway"],
    pricePerSqft: "₹5,000–8,500",
  },
  {
    label: "Villa / Bungalow",
    icon: Building2,
    minInr: 15000000,
    maxInr: 60000000,
    count: 43,
    localities: ["Shela", "Ghuma", "South Bopal", "Ambli"],
    pricePerSqft: "₹7,000–15,000",
  },
  {
    label: "Commercial Shop / Office",
    icon: Building2,
    minInr: 2500000,
    maxInr: 12000000,
    count: 96,
    localities: ["CG Road", "Navrangpura", "SG Highway", "Ashram Road"],
    pricePerSqft: "₹4,000–12,000",
  },
  {
    label: "Plot / Land",
    icon: MapPin,
    minInr: 1200000,
    maxInr: 15000000,
    count: 58,
    localities: ["Sanand", "Bavla", "Dholka", "Detroj"],
    pricePerSqft: "₹800–2,500",
  },
];

const NRI_LOCALITIES = [
  {
    name: "Satellite / Prahlad Nagar",
    tier: "Premium",
    pricePerSqft: "₹6,000–9,000",
    roi: "9-11%",
    color: "oklch(0.72 0.18 76)",
  },
  {
    name: "SG Highway Corridor",
    tier: "Premium",
    pricePerSqft: "₹5,500–8,500",
    roi: "8-10%",
    color: "oklch(0.72 0.18 76)",
  },
  {
    name: "Bopal / South Bopal",
    tier: "Mid-range",
    pricePerSqft: "₹3,800–5,500",
    roi: "7-9%",
    color: "oklch(0.65 0.18 100)",
  },
  {
    name: "Gota / Thaltej",
    tier: "Mid-range",
    pricePerSqft: "₹3,500–5,000",
    roi: "7-8%",
    color: "oklch(0.65 0.18 100)",
  },
  {
    name: "Chandkheda / Motera",
    tier: "Affordable",
    pricePerSqft: "₹3,000–4,200",
    roi: "6-8%",
    color: "oklch(0.6 0.18 148)",
  },
  {
    name: "Naroda / Vastral",
    tier: "Affordable",
    pricePerSqft: "₹2,500–3,500",
    roi: "6-7%",
    color: "oklch(0.6 0.18 148)",
  },
];

const TAX_INFO = [
  {
    title: "TDS on Property Purchase",
    value: "1% of sale value (if >50L)",
    note: "Buyer must deduct and deposit with Form 26QB.",
  },
  {
    title: "FEMA Compliance",
    value: "RBI Circular 180/2015",
    note: "NRIs / PIOs can purchase residential & commercial property without RBI permission. Agricultural land requires permission.",
  },
  {
    title: "Repatriation Rules",
    value: "Up to cost of acquisition",
    note: "Principal can be repatriated from NRE account. Rental income repatriable up to 2 properties. Capital gains tax applies.",
  },
  {
    title: "Capital Gains Tax",
    value: "20% with indexation (LTCG)",
    note: "Long-term (>2 years). Short-term gains taxed at slab rate. Exemptions via Sec 54/54EC if reinvested.",
  },
];

function formatInr(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

interface ConsultForm {
  name: string;
  phone: string;
  email: string;
  country: string;
  message: string;
  indemnity: boolean;
}

export default function NriSimulatorPage() {
  const [currency, setCurrency] = useState("USD");
  const [budget, setBudget] = useState("");
  const logSubmission = useLogServiceSubmission();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<ConsultForm>({
    name: "",
    phone: "",
    email: "",
    country: "",
    message: "",
    indemnity: false,
  });

  const inrAmount = useMemo(() => {
    const num = Number.parseFloat(budget);
    if (!num || num <= 0) return 0;
    return num * EXCHANGE_RATES[currency].rate;
  }, [budget, currency]);

  const affordable = useMemo(
    () => PROPERTY_CATEGORIES.filter((p) => inrAmount >= p.minInr),
    [inrAmount],
  );

  const handleConsult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.indemnity) return;
    logSubmission.mutate({
      serviceCategory: "NRI Investment",
      innerPage: "NRI Simulator",
      formType: "NRIConsultation",
      fields: [
        ["Currency", currency],
        ["Budget", `${EXCHANGE_RATES[currency].symbol}${budget}`],
        ["INR Equivalent", formatInr(inrAmount)],
        ["Country", form.country],
      ],
      submitterName: form.name,
      submitterPhone: form.phone,
      submitterEmail: form.email,
      indemnityAccepted: true,
    });
    setSubmitted(true);
  };

  const { symbol } = EXCHANGE_RATES[currency];

  return (
    <PrivacyGate>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        {/* Page Header */}
        <section className="pt-24 pb-8 px-4 bg-card/50 border-b border-border">
          <div className="max-w-5xl mx-auto">
            <Link
              to="/nri-corner"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
              data-ocid="nri_sim.back_button"
            >
              <ArrowLeft size={14} /> Back to NRI Corner
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Globe size={24} className="text-primary" />
              <h1 className="font-serif font-bold text-3xl gold-text">
                NRI Investment Simulator
              </h1>
            </div>
            <p className="font-sans text-sm text-muted-foreground">
              Enter your foreign currency budget to discover what you can buy in
              Ahmedabad today, with recommended localities and tax guidance.
            </p>
          </div>
        </section>

        <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
          {/* Currency Converter */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Calculator size={18} className="text-primary" />
              <h2 className="font-serif font-semibold text-lg text-foreground">
                Currency Converter
              </h2>
              <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                <Info size={11} /> Rates are indicative
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Your Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                  data-ocid="nri_sim.currency_select"
                >
                  {Object.entries(EXCHANGE_RATES).map(([code, info]) => (
                    <option key={code} value={code}>
                      {code} — {info.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Your Budget (in {currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter amount"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full pl-7 pr-4 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    data-ocid="nri_sim.budget_input"
                  />
                </div>
              </div>
            </div>

            {inrAmount > 0 && (
              <div
                className="mt-5 p-4 rounded-xl"
                style={{
                  background: "oklch(0.72 0.18 76 / 0.08)",
                  border: "1px solid oklch(0.72 0.18 76 / 0.3)",
                }}
              >
                <div className="text-xs text-muted-foreground mb-1">
                  Equivalent in Indian Rupees (approx.)
                </div>
                <div className="font-serif font-bold text-3xl gold-text">
                  {formatInr(inrAmount)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Rate: 1 {currency} ≈ ₹{EXCHANGE_RATES[currency].rate} •
                  Indicative rate, not financial advice
                </div>
              </div>
            )}
          </div>

          {/* What You Can Afford */}
          {inrAmount > 0 && (
            <div>
              <h2 className="font-serif font-bold text-xl text-foreground mb-4">
                What You Can Buy in Ahmedabad
              </h2>
              {affordable.length === 0 ? (
                <div className="p-6 bg-card border border-border rounded-xl text-center">
                  <p className="text-sm text-muted-foreground">
                    Budget is below our listed categories. Please contact MSTC
                    for micro-investment and land options.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {affordable.map((opt, i) => {
                    const Icon = opt.icon;
                    return (
                      <div
                        key={opt.label}
                        className="p-4 bg-card border border-border rounded-xl"
                        data-ocid={`nri_sim.category.${i + 1}`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "oklch(0.72 0.18 76 / 0.1)",
                              border: "1px solid oklch(0.72 0.18 76 / 0.25)",
                            }}
                          >
                            <Icon
                              size={16}
                              style={{ color: "oklch(0.72 0.18 76)" }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-sm text-foreground">
                                {opt.label}
                              </h3>
                              <span
                                className="text-xs font-bold px-2 py-0.5 rounded border flex-shrink-0"
                                style={{
                                  background: "oklch(0.4 0.15 148 / 0.2)",
                                  borderColor: "oklch(0.5 0.18 148 / 0.4)",
                                  color: "oklch(0.7 0.18 148)",
                                }}
                              >
                                {opt.count} listings
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mb-2">
                              Range: {formatInr(opt.minInr)} –{" "}
                              {formatInr(opt.maxInr)}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>Price/sqft: {opt.pricePerSqft}</span>
                              <span className="text-muted-foreground/60">
                                |
                              </span>
                              <span>
                                Localities: {opt.localities.join(", ")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Recommended NRI Localities */}
          {inrAmount > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-primary" />
                <h2 className="font-serif font-bold text-xl text-foreground">
                  Recommended NRI Investment Localities
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {NRI_LOCALITIES.map((loc, i) => (
                  <div
                    key={loc.name}
                    className="p-4 bg-card border border-border rounded-xl"
                    data-ocid={`nri_sim.locality.${i + 1}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm text-foreground">
                        {loc.name}
                      </h3>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full border"
                        style={{
                          color: loc.color,
                          borderColor: `${loc.color}40`,
                          background: `${loc.color}15`,
                        }}
                      >
                        {loc.tier}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="text-foreground font-medium">
                        {loc.pricePerSqft}/sqft
                      </span>
                    </div>
                    <div
                      className="text-xs mt-1 font-semibold"
                      style={{ color: "oklch(0.6 0.18 148)" }}
                    >
                      Est. ROI: {loc.roi} p.a.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tax Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Info size={18} className="text-primary" />
              <h2 className="font-serif font-bold text-xl text-foreground">
                NRI Property Tax &amp; Legal Summary
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {TAX_INFO.map((t, i) => (
                <div
                  key={t.title}
                  className="p-4 bg-card border border-border rounded-xl"
                  data-ocid={`nri_sim.tax_info.${i + 1}`}
                >
                  <h3 className="font-semibold text-sm text-foreground mb-1">
                    {t.title}
                  </h3>
                  <div
                    className="text-xs font-bold mb-1"
                    style={{ color: "oklch(0.72 0.18 76)" }}
                  >
                    {t.value}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.note}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              ⚠️ The above is general information only. Please consult a CA or
              legal advisor before making investment decisions.
            </p>
          </div>

          {/* Consult CTA */}
          <div
            className="rounded-2xl p-8"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.12 0.015 62), oklch(0.16 0.025 70))",
              border: "1px solid oklch(0.72 0.18 76 / 0.3)",
            }}
          >
            <div className="text-center mb-6">
              <Globe size={36} className="text-primary mx-auto mb-3" />
              <h3 className="font-serif font-bold text-2xl gold-text mb-2">
                Consult MSTC for NRI Investment
              </h3>
              <p className="text-sm text-muted-foreground">
                FEMA compliance, repatriation, power of attorney, property
                management — MSTC GLOBAL handles everything for NRI investors.
              </p>
            </div>

            {!showForm ? (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="px-8 py-3 rounded-lg font-semibold text-sm transition-all hover:-translate-y-0.5"
                  style={{
                    background: "oklch(0.72 0.18 76)",
                    color: "oklch(0.1 0.01 60)",
                  }}
                  data-ocid="nri_sim.consult_button"
                >
                  Book a Consultation
                </button>
                <a
                  href="https://wa.me/919512609016"
                  className="px-8 py-3 rounded-lg font-semibold text-sm text-center"
                  style={{ background: "#25D366", color: "#fff" }}
                  data-ocid="nri_sim.whatsapp_button"
                >
                  WhatsApp MSTC
                </a>
              </div>
            ) : submitted ? (
              <div className="text-center">
                <CheckCircle2
                  size={40}
                  className="text-emerald-400 mx-auto mb-3"
                />
                <p className="text-sm text-muted-foreground">
                  Thank you! Our NRI advisory team will contact you within 24
                  hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleConsult}
                className="max-w-md mx-auto space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                      data-ocid="nri_sim.consult_name_input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Phone (with country code) *
                    </label>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      placeholder="+1 555 000 0000"
                      className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                      data-ocid="nri_sim.consult_phone_input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Country of Residence *
                    </label>
                    <input
                      required
                      value={form.country}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, country: e.target.value }))
                      }
                      placeholder="USA / UAE / UK..."
                      className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                      data-ocid="nri_sim.consult_country_input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Your Investment Goals
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    rows={2}
                    placeholder="Type of property, timeline, specific areas of interest..."
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground resize-none focus:outline-none focus:border-primary"
                  />
                </div>
                <label className="flex items-start gap-2 cursor-pointer p-3 rounded-xl bg-muted/20 border border-border">
                  <input
                    type="checkbox"
                    checked={form.indemnity}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, indemnity: e.target.checked }))
                    }
                    className="mt-0.5 accent-primary"
                    data-ocid="nri_sim.consult_indemnity_checkbox"
                  />
                  <span className="text-xs text-muted-foreground">
                    I understand that MSTC GLOBAL provides advisory services
                    only. All investment decisions are my own responsibility.
                    <span className="text-red-400 ml-1">*Required</span>
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={!form.indemnity || logSubmission.isPending}
                  className="w-full py-3 rounded-lg font-semibold text-sm disabled:opacity-50"
                  style={{
                    background: "oklch(0.72 0.18 76)",
                    color: "oklch(0.1 0.01 60)",
                  }}
                  data-ocid="nri_sim.consult_submit_button"
                >
                  {logSubmission.isPending
                    ? "Submitting…"
                    : "Request Consultation"}
                </button>
              </form>
            )}
          </div>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </PrivacyGate>
  );
}
