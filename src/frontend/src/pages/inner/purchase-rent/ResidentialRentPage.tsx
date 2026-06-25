import { createActor } from "@/backend";
import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { useActor } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Home,
  Info,
  Search,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

function RentalYieldCalculator() {
  const [ryOpen, setRyOpen] = useState(false);
  const [ryValue, setRyValue] = useState("");
  const [ryRent, setRyRent] = useState("");
  const [ryResult, setRyResult] = useState<number | null>(null);

  const calcYield = () => {
    const val = Number(ryValue);
    const rent = Number(ryRent);
    if (!val || !rent) return;
    setRyResult(Math.round(((rent * 12) / val) * 10000) / 100);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setRyOpen(!ryOpen)}
        className="w-full flex items-center justify-between p-4 bg-[#0f1319] hover:bg-[#1a1f2a] transition-colors"
        data-ocid="resrent.yield_toggle"
      >
        <span
          className="font-sans font-semibold"
          style={{ color: "oklch(var(--primary))" }}
        >
          Rental Yield Calculator
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${ryOpen ? "rotate-180" : ""}`}
          style={{ color: "oklch(var(--primary))" }}
        />
      </button>
      {ryOpen && (
        <div
          className="p-5 space-y-4"
          style={{ background: "oklch(var(--card))" }}
        >
          <p
            className="font-sans text-xs"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            Find out what rental yield a property delivers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="tool-field">
              <label className="tool-field-label">Property Value (₹)</label>
              <input
                className="tool-field-input"
                type="number"
                value={ryValue}
                onChange={(e) => setRyValue(e.target.value)}
                placeholder="e.g. 4500000"
                data-ocid="resrent.yield_value_input"
              />
            </div>
            <div className="tool-field">
              <label className="tool-field-label">Monthly Rent (₹)</label>
              <input
                className="tool-field-input"
                type="number"
                value={ryRent}
                onChange={(e) => setRyRent(e.target.value)}
                placeholder="e.g. 18000"
                data-ocid="resrent.yield_rent_input"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={calcYield}
            className="platform-button"
            data-ocid="resrent.yield_calculate_button"
          >
            Calculate Yield
          </button>
          {ryResult !== null && (
            <div
              className="text-center py-3 rounded-sm"
              style={{
                background: "oklch(var(--primary) / 0.1)",
                border: "1px solid oklch(var(--primary) / 0.3)",
              }}
            >
              <p
                className="font-sans text-xs"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Gross Rental Yield
              </p>
              <p
                className="font-serif text-3xl font-bold mt-1"
                style={{ color: "oklch(var(--primary))" }}
              >
                {ryResult}%
              </p>
              <p
                className="font-sans text-xs mt-1"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                {ryResult >= 4
                  ? "Above average for Ahmedabad — strong investment."
                  : ryResult >= 2.5
                    ? "Average yield for Ahmedabad residential."
                    : "Below average — consider negotiating price."}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

const LOCALITIES = [
  "Satellite",
  "Bopal",
  "Prahlad Nagar",
  "Paldi",
  "Navrangpura",
  "Vastrapur",
  "Maninagar",
  "Thaltej",
  "South Bopal",
  "Other",
];

export default function ResidentialRentPage() {
  const { actor } = useActor(createActor);

  // Search tool state
  const [budget, setBudget] = useState("");
  const [locality, setLocality] = useState("");
  const [bhk, setBhk] = useState("");
  const [furnishing, setFurnishing] = useState("");

  // Loan eligibility state
  const [loanOpen, setLoanOpen] = useState(false);
  const [loanIncome, setLoanIncome] = useState("");
  const [loanExisting, setLoanExisting] = useState("");
  const [loanDp, setLoanDp] = useState("");
  const [loanResult, setLoanResult] = useState<{
    maxLoan: number;
    monthlyEmi: number;
  } | null>(null);

  // Rent vs Buy state
  const [rvbOpen, setRvbOpen] = useState(false);
  const [rvbRent, setRvbRent] = useState("");
  const [rvbPrice, setRvbPrice] = useState("");
  const [rvbTenure, setRvbTenure] = useState("10");
  const [rvbResult, setRvbResult] = useState<{
    rentCost: number;
    buyCost: number;
    recommendation: string;
  } | null>(null);

  // Form state
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    moveInDate: "",
    formBudget: "",
    petFriendly: "",
    additionalPrefs: "",
  });
  const [localityChecks, setLocalityChecks] = useState<Record<string, boolean>>(
    {},
  );
  const [indemnity, setIndemnity] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const calcLoan = () => {
    const inc = Number(loanIncome) || 0;
    const existEmi = Number(loanExisting) || 0;
    if (!inc) return;
    const cap = inc * 0.5 - existEmi;
    const r = 0.085 / 12;
    const n = 240;
    const maxLoan =
      cap > 0 ? Math.round((cap * ((1 + r) ** n - 1)) / (r * (1 + r) ** n)) : 0;
    const monthlyEmi =
      maxLoan > 0
        ? Math.round((maxLoan * r * (1 + r) ** n) / ((1 + r) ** n - 1))
        : 0;
    setLoanResult({ maxLoan, monthlyEmi });
  };

  const calcRvb = () => {
    const r = Number(rvbRent) || 0;
    const p = Number(rvbPrice) || 0;
    const t = Number(rvbTenure) || 10;
    if (!r || !p) return;
    const rentCost = r * 12 * t * 1.05;
    const er = 0.085 / 12;
    const en = t * 12;
    const emi = (p * 0.8 * er * (1 + er) ** en) / ((1 + er) ** en - 1);
    const buyCost = emi * 12 * t + p * 0.2;
    setRvbResult({
      rentCost: Math.round(rentCost),
      buyCost: Math.round(buyCost),
      recommendation:
        buyCost < rentCost * 1.1
          ? "Buying is financially wiser long-term."
          : "Renting provides more flexibility right now.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!indemnity || submitting) return;
    setSubmitting(true);
    const selectedLocalities = Object.entries(localityChecks)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(", ");
    const fields: Array<[string, string]> = [
      ["Move-in Date", form.moveInDate],
      ["Budget", form.formBudget],
      ["Locality Preferences", selectedLocalities],
      ["Pet-friendly Required", form.petFriendly],
      ["Additional Preferences", form.additionalPrefs],
    ];
    try {
      if (actor) {
        await actor.logServiceSubmission(
          "purchase-rent",
          "Residential Rent",
          "PropertySearch",
          fields,
          form.fullName,
          form.phone,
          form.email,
          true,
        );
      }
    } catch (_) {
      /* best-effort */
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <InnerPageLayout
      serviceSlug="purchase-rent"
      serviceName="Purchase, Rent & Redevelopment"
      innerPageTitle="Residential Rent"
      innerPageSubtitle="Find your ideal rental home in Ahmedabad. We search multiple platforms, verify landlords, and handle all documentation."
    >
      {/* Hero Banner */}
      <div
        className="mb-10 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=400&fit=crop"
          alt="Residential Rent"
          className="w-full h-56 md:h-72 object-cover"
        />
      </div>
      {/* Description */}
      <div className="mb-10 max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-sm flex items-center justify-center"
            style={{
              background: "oklch(var(--primary) / 0.15)",
              border: "1px solid oklch(var(--primary) / 0.3)",
            }}
          >
            <Home size={18} style={{ color: "oklch(var(--primary))" }} />
          </div>
          <span
            className="font-sans text-xs tracking-widest uppercase"
            style={{ color: "oklch(var(--primary))" }}
          >
            Residential Rental Services
          </span>
        </div>
        <h2
          className="font-serif text-2xl font-bold mb-3"
          style={{ color: "oklch(var(--foreground))" }}
        >
          Ahmedabad's Most Trusted Rental Facilitator
        </h2>
        <div className="section-divider w-16 mb-5" />
        <p
          className="font-sans text-sm leading-relaxed mb-3"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          MSTC GLOBAL facilitates residential rentals across Ahmedabad's most
          sought-after neighbourhoods — Satellite, Bopal, Prahlad Nagar,
          Navrangpura, Vastrapur, and beyond. We personally shortlist properties
          that match your budget, preferred area, and lifestyle needs.
        </p>
        <p
          className="font-sans text-sm leading-relaxed mb-3"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Our tenant services include landlord verification, rental agreement
          drafting under Gujarat Tenancy Act norms, security deposit advisory,
          and post-move-in support. Every listing we recommend is vetted for
          legal compliance and habitability.
        </p>
        <p
          className="font-sans text-sm leading-relaxed"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Use the search tool below to browse live property portals with your
          exact filters pre-applied, or submit your requirements directly and
          let our rental specialists find the perfect match for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT: Search Tool + Offerings */}
        <div className="space-y-6">
          {/* Search Tool */}
          <div className="property-search-container">
            <div className="property-search-title">
              <Search
                size={16}
                className="inline mr-2"
                style={{ color: "oklch(var(--primary))" }}
              />
              Property Search Tool
            </div>
            <p
              className="font-sans text-xs"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Set your filters and search on top property portals. Opens in a
              new tab with your preferences pre-applied.
            </p>
            <div className="property-search-inputs">
              <div className="tool-field">
                <label className="tool-field-label">Monthly Budget</label>
                <select
                  className="tool-field-input"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  data-ocid="resrent.budget_select"
                >
                  <option value="">Any Budget</option>
                  <option value="5000">Under ₹5,000</option>
                  <option value="10000">₹5,000–₹10,000</option>
                  <option value="20000">₹10,000–₹20,000</option>
                  <option value="50000">₹20,000–₹50,000</option>
                  <option value="100000">₹50,000+</option>
                </select>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Area / Locality</label>
                <select
                  className="tool-field-input"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  data-ocid="resrent.locality_select"
                >
                  <option value="">All Localities</option>
                  {LOCALITIES.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Property Type</label>
                <select
                  className="tool-field-input"
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  data-ocid="resrent.bhk_select"
                >
                  <option value="">Any Type</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK+</option>
                  <option value="0">Studio</option>
                </select>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Furnishing</label>
                <select
                  className="tool-field-input"
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value)}
                  data-ocid="resrent.furnishing_select"
                >
                  <option value="">Any</option>
                  <option>Furnished</option>
                  <option>Semi-Furnished</option>
                  <option>Unfurnished</option>
                </select>
              </div>
            </div>
            <div className="property-search-buttons">
              <Link
                to="/property-portal"
                className="platform-button"
                data-ocid="resrent.search_portal_button"
              >
                <Search size={14} /> Search in MSTC Property Portal
              </Link>
            </div>
            <div
              className="flex items-start gap-2 p-3 rounded-sm"
              style={{
                background: "oklch(var(--primary) / 0.08)",
                border: "1px solid oklch(var(--primary) / 0.2)",
              }}
            >
              <Info
                size={13}
                className="mt-0.5 flex-shrink-0"
                style={{ color: "oklch(var(--primary))" }}
              />
              <p
                className="font-sans text-xs"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Browse curated listings directly within our MSTC Property
                Portal. All enquiries are handled by our team.
              </p>
            </div>
          </div>

          {/* Loan Eligibility Tool */}
          <div className="tool-card">
            <button
              type="button"
              onClick={() => setLoanOpen((o) => !o)}
              className="w-full flex items-center justify-between"
              data-ocid="resrent.loan_toggle"
            >
              <div className="flex items-center gap-2">
                <Calculator
                  size={15}
                  style={{ color: "oklch(var(--primary))" }}
                />
                <span className="tool-card-title mb-0">
                  Loan Eligibility Calculator
                </span>
              </div>
              {loanOpen ? (
                <ChevronUp
                  size={15}
                  style={{ color: "oklch(var(--primary))" }}
                />
              ) : (
                <ChevronDown
                  size={15}
                  style={{ color: "oklch(var(--primary))" }}
                />
              )}
            </button>
            {loanOpen && (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Monthly Income (₹)
                    </label>
                    <input
                      className="tool-field-input"
                      type="number"
                      value={loanIncome}
                      onChange={(e) => setLoanIncome(e.target.value)}
                      placeholder="e.g. 60000"
                      data-ocid="resrent.loan_income_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Existing EMIs (₹)
                    </label>
                    <input
                      className="tool-field-input"
                      type="number"
                      value={loanExisting}
                      onChange={(e) => setLoanExisting(e.target.value)}
                      placeholder="e.g. 5000"
                      data-ocid="resrent.loan_existing_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">Down Payment (₹)</label>
                    <input
                      className="tool-field-input"
                      type="number"
                      value={loanDp}
                      onChange={(e) => setLoanDp(e.target.value)}
                      placeholder="e.g. 300000"
                      data-ocid="resrent.loan_dp_input"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={calcLoan}
                  className="platform-button"
                  data-ocid="resrent.loan_calculate_button"
                >
                  Check Eligibility
                </button>
                {loanResult && (
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="text-center py-3 rounded-sm"
                      style={{
                        background: "oklch(var(--primary) / 0.1)",
                        border: "1px solid oklch(var(--primary) / 0.3)",
                      }}
                    >
                      <p
                        className="font-sans text-xs"
                        style={{ color: "oklch(var(--muted-foreground))" }}
                      >
                        Max Loan
                      </p>
                      <p
                        className="font-serif text-xl font-bold"
                        style={{ color: "oklch(var(--primary))" }}
                      >
                        ₹{(loanResult.maxLoan / 100000).toFixed(1)}L
                      </p>
                    </div>
                    <div
                      className="text-center py-3 rounded-sm"
                      style={{
                        background: "oklch(var(--primary) / 0.1)",
                        border: "1px solid oklch(var(--primary) / 0.3)",
                      }}
                    >
                      <p
                        className="font-sans text-xs"
                        style={{ color: "oklch(var(--muted-foreground))" }}
                      >
                        Monthly EMI
                      </p>
                      <p
                        className="font-serif text-xl font-bold"
                        style={{ color: "oklch(var(--primary))" }}
                      >
                        ₹{loanResult.monthlyEmi.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rent vs Buy Tool */}
          <div className="tool-card">
            <button
              type="button"
              onClick={() => setRvbOpen((o) => !o)}
              className="w-full flex items-center justify-between"
              data-ocid="resrent.rvb_toggle"
            >
              <div className="flex items-center gap-2">
                <TrendingUp
                  size={15}
                  style={{ color: "oklch(var(--primary))" }}
                />
                <span className="tool-card-title mb-0">
                  Rent vs. Buy Calculator
                </span>
              </div>
              {rvbOpen ? (
                <ChevronUp
                  size={15}
                  style={{ color: "oklch(var(--primary))" }}
                />
              ) : (
                <ChevronDown
                  size={15}
                  style={{ color: "oklch(var(--primary))" }}
                />
              )}
            </button>
            {rvbOpen && (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="tool-field">
                    <label className="tool-field-label">Monthly Rent (₹)</label>
                    <input
                      className="tool-field-input"
                      type="number"
                      value={rvbRent}
                      onChange={(e) => setRvbRent(e.target.value)}
                      placeholder="e.g. 18000"
                      data-ocid="resrent.rvb_rent_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Property Price (₹)
                    </label>
                    <input
                      className="tool-field-input"
                      type="number"
                      value={rvbPrice}
                      onChange={(e) => setRvbPrice(e.target.value)}
                      placeholder="e.g. 4500000"
                      data-ocid="resrent.rvb_price_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">Tenure (years)</label>
                    <select
                      className="tool-field-input"
                      value={rvbTenure}
                      onChange={(e) => setRvbTenure(e.target.value)}
                      data-ocid="resrent.rvb_tenure_select"
                    >
                      {[5, 7, 10, 15, 20].map((y) => (
                        <option key={y} value={y}>
                          {y} yrs
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={calcRvb}
                  className="platform-button"
                  data-ocid="resrent.rvb_calculate_button"
                >
                  Compare
                </button>
                {rvbResult && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className="text-center py-2 rounded-sm"
                        style={{
                          background: "oklch(var(--primary) / 0.08)",
                          border: "1px solid oklch(var(--primary) / 0.2)",
                        }}
                      >
                        <p
                          className="font-sans text-xs"
                          style={{ color: "oklch(var(--muted-foreground))" }}
                        >
                          Rent Cost
                        </p>
                        <p
                          className="font-serif text-lg font-bold"
                          style={{ color: "oklch(var(--primary))" }}
                        >
                          ₹{(rvbResult.rentCost / 100000).toFixed(1)}L
                        </p>
                      </div>
                      <div
                        className="text-center py-2 rounded-sm"
                        style={{
                          background: "oklch(var(--primary) / 0.08)",
                          border: "1px solid oklch(var(--primary) / 0.2)",
                        }}
                      >
                        <p
                          className="font-sans text-xs"
                          style={{ color: "oklch(var(--muted-foreground))" }}
                        >
                          Buy Cost
                        </p>
                        <p
                          className="font-serif text-lg font-bold"
                          style={{ color: "oklch(var(--primary))" }}
                        >
                          ₹{(rvbResult.buyCost / 100000).toFixed(1)}L
                        </p>
                      </div>
                    </div>
                    <p
                      className="font-sans text-xs"
                      style={{ color: "oklch(var(--muted-foreground))" }}
                    >
                      <strong>Verdict:</strong> {rvbResult.recommendation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rental Yield Calculator */}
          <div className="border border-[#c9a84c]/30 rounded-lg overflow-hidden mb-3">
            <RentalYieldCalculator />
          </div>

          {/* Key Offerings */}
          <div className="tool-card">
            <div className="tool-card-title">Our Rental Services Include</div>
            <ul className="space-y-2 mt-1">
              {[
                "Curated shortlist based on your exact requirements",
                "Verified landlord background checks",
                "Rental agreement drafting (Gujarat Tenancy Act)",
                "Security deposit negotiation & advisory",
                "Locality & infrastructure guidance",
                "Post-move-in support for 30 days",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2
                    size={14}
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: "oklch(var(--primary))" }}
                  />
                  <span
                    className="font-sans text-sm"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT: Enquiry Form */}
        <div className="tool-card">
          <div className="tool-card-title">Submit Your Rental Requirements</div>
          <div className="tool-card-description">
            Share your preferences and our rental specialist will personally
            curate and shortlist properties for you within 24 hours.
          </div>
          {submitted ? (
            <div className="text-center py-8" data-ocid="resrent.success_state">
              <CheckCircle2
                size={40}
                className="mx-auto mb-3"
                style={{ color: "oklch(var(--primary))" }}
              />
              <p
                className="font-serif text-lg font-bold mb-1"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Request Submitted!
              </p>
              <p
                className="font-sans text-sm"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Thank you! We've received your request and will get back to you
                within 24 hours. For urgent needs, WhatsApp us at +91
                9512609016.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">Full Name *</label>
                  <input
                    className="tool-field-input"
                    required
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, fullName: e.target.value }))
                    }
                    placeholder="Your full name"
                    data-ocid="resrent.name_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Phone *</label>
                  <input
                    className="tool-field-input"
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+91 XXXXX XXXXX"
                    data-ocid="resrent.phone_input"
                  />
                </div>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Email</label>
                <input
                  className="tool-field-input"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="your@email.com"
                  data-ocid="resrent.email_input"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">
                    Preferred Move-in Date
                  </label>
                  <input
                    className="tool-field-input"
                    type="date"
                    value={form.moveInDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, moveInDate: e.target.value }))
                    }
                    data-ocid="resrent.movein_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Monthly Budget</label>
                  <select
                    className="tool-field-input"
                    value={form.formBudget}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, formBudget: e.target.value }))
                    }
                    data-ocid="resrent.form_budget_select"
                  >
                    <option value="">Select range</option>
                    <option>Under ₹5,000/mo</option>
                    <option>₹5,000–₹10,000/mo</option>
                    <option>₹10,000–₹20,000/mo</option>
                    <option>₹20,000–₹50,000/mo</option>
                    <option>₹50,000+/mo</option>
                  </select>
                </div>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">
                  Locality Preference (select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {LOCALITIES.map((loc) => (
                    <label
                      key={loc}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                        style={{
                          background: localityChecks[loc]
                            ? "oklch(var(--primary))"
                            : "oklch(var(--input))",
                          border: `1px solid ${localityChecks[loc] ? "oklch(var(--primary))" : "oklch(var(--border))"}`,
                        }}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={!!localityChecks[loc]}
                          onChange={(e) =>
                            setLocalityChecks((s) => ({
                              ...s,
                              [loc]: e.target.checked,
                            }))
                          }
                          data-ocid={`resrent.locality_${loc.toLowerCase().replace(/\s/g, "_")}`}
                        />
                        {localityChecks[loc] && (
                          <svg
                            width="9"
                            height="9"
                            viewBox="0 0 12 12"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M2 6L5 9L10 3"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className="font-sans text-xs"
                        style={{ color: "oklch(var(--foreground))" }}
                      >
                        {loc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">
                  Pet-friendly Required
                </label>
                <select
                  className="tool-field-input"
                  value={form.petFriendly}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, petFriendly: e.target.value }))
                  }
                  data-ocid="resrent.pet_select"
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                  <option>Doesn't Matter</option>
                </select>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">
                  Additional Preferences
                </label>
                <textarea
                  className="tool-field-input"
                  rows={3}
                  value={form.additionalPrefs}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, additionalPrefs: e.target.value }))
                  }
                  placeholder="Floor preference, parking, society amenities, proximity to school/office..."
                  data-ocid="resrent.prefs_textarea"
                />
              </div>
              <IndemnityForm checked={indemnity} onChange={setIndemnity} />
              <button
                type="submit"
                disabled={!indemnity || submitting}
                className="platform-button w-full"
                data-ocid="resrent.submit_button"
                style={{ opacity: indemnity && !submitting ? 1 : 0.5 }}
              >
                {submitting ? "Submitting..." : "Send My Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </InnerPageLayout>
  );
}
