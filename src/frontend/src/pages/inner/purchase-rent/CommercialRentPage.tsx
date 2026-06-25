import { createActor } from "@/backend";
import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { useActor } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Search,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const ZONES = [
  "SG Road",
  "Prahlad Nagar",
  "Navrangpura",
  "Bodakdev",
  "Vastrapur",
  "Ashram Road",
  "CG Road",
  "GIFT City",
  "Industrial Area",
];

export default function CommercialRentPage() {
  const { actor } = useActor(createActor);

  // Search tool state
  const [searchBudget, setSearchBudget] = useState("");
  const [searchZone, setSearchZone] = useState("");
  const [officeType, setOfficeType] = useState("");
  const [areaReq, setAreaReq] = useState("");

  // Loan eligibility state
  const [loanOpen, setLoanOpen] = useState(false);
  const [loanIncome, setLoanIncome] = useState("");
  const [loanExisting, setLoanExisting] = useState("");
  const [loanResult, setLoanResult] = useState<{
    maxLoan: number;
    monthlyEmi: number;
  } | null>(null);

  // Rent vs Buy state
  const [rvbOpen, setRvbOpen] = useState(false);
  const [rvbRent, setRvbRent] = useState("");
  const [rvbPrice, setRvbPrice] = useState("");
  const [rvbTenure, setRvbTenure] = useState("5");
  const [rvbResult, setRvbResult] = useState<{
    rentCost: number;
    buyCost: number;
    recommendation: string;
  } | null>(null);

  // Form state
  const [form, setForm] = useState({
    businessName: "",
    contactPerson: "",
    phone: "",
    email: "",
    formOfficeType: "",
    requiredArea: "",
    zonePreference: "",
    leasePeriod: "",
    parking: "",
    fitOut: "",
  });
  const [indemnity, setIndemnity] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const calcLoan = () => {
    const inc = Number(loanIncome) || 0;
    const existEmi = Number(loanExisting) || 0;
    if (!inc) return;
    const cap = inc * 0.5 - existEmi;
    const r = 0.1 / 12;
    const n = 60;
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
    const t = Number(rvbTenure) || 5;
    if (!r || !p) return;
    const rentCost = r * 12 * t * 1.06;
    const er = 0.1 / 12;
    const en = t * 12;
    const emi = (p * 0.8 * er * (1 + er) ** en) / ((1 + er) ** en - 1);
    const buyCost = emi * 12 * t + p * 0.2;
    setRvbResult({
      rentCost: Math.round(rentCost),
      buyCost: Math.round(buyCost),
      recommendation:
        buyCost < rentCost * 1.15
          ? "Buying the space is financially stronger long-term."
          : "Renting provides better flexibility at this stage.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!indemnity || submitting) return;
    setSubmitting(true);
    const fields: Array<[string, string]> = [
      ["Business Name", form.businessName],
      ["Office Type", form.formOfficeType],
      ["Required Area (sqft)", form.requiredArea],
      ["Zone Preference", form.zonePreference],
      ["Lease Period", form.leasePeriod],
      ["Parking Required", form.parking],
      ["Fit-out Requirement", form.fitOut],
    ];
    try {
      if (actor) {
        await actor.logServiceSubmission(
          "purchase-rent",
          "Commercial Rent",
          "PropertySearch",
          fields,
          form.contactPerson,
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
      innerPageTitle="Commercial Rent"
      innerPageSubtitle="Premium office spaces, retail units, co-working floors and warehouses for rent across Ahmedabad's business corridors."
    >
      {/* Hero Banner */}
      <div
        className="mb-8 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop"
          alt="Commercial Rent"
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
            <Briefcase size={18} style={{ color: "oklch(var(--primary))" }} />
          </div>
          <span
            className="font-sans text-xs tracking-widest uppercase"
            style={{ color: "oklch(var(--primary))" }}
          >
            Commercial Rental Services
          </span>
        </div>
        <h2
          className="font-serif text-2xl font-bold mb-3"
          style={{ color: "oklch(var(--foreground))" }}
        >
          The Right Space for Your Business in Ahmedabad
        </h2>
        <div className="section-divider w-16 mb-5" />
        <p
          className="font-sans text-sm leading-relaxed mb-3"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          MSTC GLOBAL facilitates commercial rental transactions across
          Ahmedabad's prime business zones — SG Road, Prahlad Nagar,
          Navrangpura, Bodakdev, CG Road, and the growing GIFT City corridor. We
          work with property owners and landlords to source compliant,
          well-located commercial spaces.
        </p>
        <p
          className="font-sans text-sm leading-relaxed mb-3"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Our commercial rental services cover offices (standalone, co-working,
          and serviced), retail and showrooms, warehousing, and industrial
          plots. We assist with legal due diligence, lease structuring, stamp
          duty advisory, and registration under Gujarat Stamp Act.
        </p>
        <p
          className="font-sans text-sm leading-relaxed"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Use the search tool below to explore listings directly on commercial
          property portals, or submit your detailed requirements and let our
          commercial specialists find and negotiate the best space for your
          business.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT: Search Tool + Offerings */}
        <div className="space-y-6">
          <div className="property-search-container">
            <div className="property-search-title">
              <Search
                size={16}
                className="inline mr-2"
                style={{ color: "oklch(var(--primary))" }}
              />
              Commercial Property Search
            </div>
            <p
              className="font-sans text-xs"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Filter by budget, zone and type, then search across three leading
              commercial property platforms.
            </p>
            <div className="property-search-inputs">
              <div className="tool-field">
                <label className="tool-field-label">Budget / Month</label>
                <select
                  className="tool-field-input"
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                  data-ocid="comrent.budget_select"
                >
                  <option value="">Any Budget</option>
                  <option value="20000">Under ₹20,000</option>
                  <option value="50000">₹20,000–₹50,000</option>
                  <option value="100000">₹50,000–₹1 Lakh</option>
                  <option value="500000">₹1 Lakh–₹5 Lakh</option>
                  <option value="999999">₹5 Lakh+</option>
                </select>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Zone / Area</label>
                <select
                  className="tool-field-input"
                  value={searchZone}
                  onChange={(e) => setSearchZone(e.target.value)}
                  data-ocid="comrent.zone_select"
                >
                  <option value="">All Zones</option>
                  {ZONES.map((z) => (
                    <option key={z}>{z}</option>
                  ))}
                </select>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Office Type</label>
                <select
                  className="tool-field-input"
                  value={officeType}
                  onChange={(e) => setOfficeType(e.target.value)}
                  data-ocid="comrent.type_select"
                >
                  <option value="">Any Type</option>
                  <option>Co-working</option>
                  <option>Serviced Office</option>
                  <option>Dedicated Office</option>
                  <option>Showroom</option>
                  <option>Retail</option>
                  <option>Warehouse</option>
                </select>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Area Required</label>
                <select
                  className="tool-field-input"
                  value={areaReq}
                  onChange={(e) => setAreaReq(e.target.value)}
                  data-ocid="comrent.area_select"
                >
                  <option value="">Any Size</option>
                  <option>Under 500 sqft</option>
                  <option>500–1,000 sqft</option>
                  <option>1,000–2,500 sqft</option>
                  <option>2,500 sqft+</option>
                </select>
              </div>
            </div>
            <div className="property-search-buttons">
              <Link
                to="/property-portal"
                className="platform-button"
                data-ocid="comrent.search_portal_button"
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
                Browse commercial listings directly within our MSTC Property
                Portal. All enquiries are handled by our expert team.
              </p>
            </div>
          </div>

          {/* Loan Eligibility + Rent vs Buy */}
          <div className="tool-card">
            <button
              type="button"
              onClick={() => setLoanOpen((o) => !o)}
              className="w-full flex items-center justify-between"
              data-ocid="comrent.loan_toggle"
            >
              <div className="flex items-center gap-2">
                <Calculator
                  size={15}
                  style={{ color: "oklch(var(--primary))" }}
                />
                <span className="tool-card-title mb-0">
                  Loan / Lease Eligibility
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Monthly Revenue (₹)
                    </label>
                    <input
                      className="tool-field-input"
                      type="number"
                      value={loanIncome}
                      onChange={(e) => setLoanIncome(e.target.value)}
                      placeholder="e.g. 300000"
                      data-ocid="comrent.loan_income_input"
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
                      placeholder="e.g. 30000"
                      data-ocid="comrent.loan_existing_input"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={calcLoan}
                  className="platform-button"
                  data-ocid="comrent.loan_calculate_button"
                >
                  Check
                </button>
                {loanResult && (
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="text-center py-2 rounded-sm"
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
                      className="text-center py-2 rounded-sm"
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

          <div className="tool-card">
            <button
              type="button"
              onClick={() => setRvbOpen((o) => !o)}
              className="w-full flex items-center justify-between"
              data-ocid="comrent.rvb_toggle"
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
                      placeholder="e.g. 50000"
                      data-ocid="comrent.rvb_rent_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Purchase Price (₹)
                    </label>
                    <input
                      className="tool-field-input"
                      type="number"
                      value={rvbPrice}
                      onChange={(e) => setRvbPrice(e.target.value)}
                      placeholder="e.g. 8000000"
                      data-ocid="comrent.rvb_price_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">Tenure (years)</label>
                    <select
                      className="tool-field-input"
                      value={rvbTenure}
                      onChange={(e) => setRvbTenure(e.target.value)}
                      data-ocid="comrent.rvb_tenure_select"
                    >
                      {[3, 5, 7, 10, 15].map((y) => (
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
                  data-ocid="comrent.rvb_calculate_button"
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

          <div className="tool-card">
            <div className="tool-card-title">
              Our Commercial Rental Services
            </div>
            <ul className="space-y-2 mt-1">
              {[
                "Office space sourcing across all commercial zones",
                "Lease agreement review & structuring",
                "Stamp duty & registration advisory",
                "Landlord/tenant negotiation support",
                "Co-working & serviced office tie-ups",
                "Warehouse & industrial plot matching",
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

        {/* RIGHT: Form */}
        <div className="tool-card">
          <div className="tool-card-title">Commercial Space Request</div>
          <div className="tool-card-description">
            Share your business requirements and our commercial specialists will
            curate the most suitable options for you.
          </div>
          {submitted ? (
            <div className="text-center py-8" data-ocid="comrent.success_state">
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
                Our commercial specialist will contact you within 24 hours.
              </p>
              <p
                className="font-sans text-sm mt-2 font-semibold"
                style={{ color: "oklch(var(--primary))" }}
              >
                Urgent? Call +91 9512609016
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">Business Name *</label>
                  <input
                    className="tool-field-input"
                    required
                    value={form.businessName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, businessName: e.target.value }))
                    }
                    placeholder="Your company name"
                    data-ocid="comrent.business_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Contact Person *</label>
                  <input
                    className="tool-field-input"
                    required
                    value={form.contactPerson}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, contactPerson: e.target.value }))
                    }
                    placeholder="Full name"
                    data-ocid="comrent.contact_input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    data-ocid="comrent.phone_input"
                  />
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
                    placeholder="business@email.com"
                    data-ocid="comrent.email_input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">Office Type</label>
                  <select
                    className="tool-field-input"
                    value={form.formOfficeType}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, formOfficeType: e.target.value }))
                    }
                    data-ocid="comrent.form_type_select"
                  >
                    <option value="">Select type</option>
                    <option>Co-working</option>
                    <option>Serviced Office</option>
                    <option>Dedicated Office</option>
                    <option>Showroom</option>
                    <option>Retail</option>
                    <option>Warehouse</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">
                    Required Area (sqft)
                  </label>
                  <input
                    className="tool-field-input"
                    type="number"
                    value={form.requiredArea}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, requiredArea: e.target.value }))
                    }
                    placeholder="e.g. 1200"
                    data-ocid="comrent.area_input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">Zone Preference</label>
                  <select
                    className="tool-field-input"
                    value={form.zonePreference}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, zonePreference: e.target.value }))
                    }
                    data-ocid="comrent.zone_form_select"
                  >
                    <option value="">Any Zone</option>
                    {ZONES.map((z) => (
                      <option key={z}>{z}</option>
                    ))}
                  </select>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Lease Period</label>
                  <select
                    className="tool-field-input"
                    value={form.leasePeriod}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, leasePeriod: e.target.value }))
                    }
                    data-ocid="comrent.lease_select"
                  >
                    <option value="">Select</option>
                    <option>11 months</option>
                    <option>1 year</option>
                    <option>2 years</option>
                    <option>3 years</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">Parking Required</label>
                  <select
                    className="tool-field-input"
                    value={form.parking}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, parking: e.target.value }))
                    }
                    data-ocid="comrent.parking_select"
                  >
                    <option value="">Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">
                    Fit-out Requirement
                  </label>
                  <select
                    className="tool-field-input"
                    value={form.fitOut}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, fitOut: e.target.value }))
                    }
                    data-ocid="comrent.fitout_select"
                  >
                    <option value="">Select</option>
                    <option>Bare Shell</option>
                    <option>Semi-furnished</option>
                    <option>Fully Furnished</option>
                  </select>
                </div>
              </div>
              <IndemnityForm checked={indemnity} onChange={setIndemnity} />
              <button
                type="submit"
                disabled={!indemnity || submitting}
                className="platform-button w-full"
                data-ocid="comrent.submit_button"
                style={{ opacity: indemnity && !submitting ? 1 : 0.5 }}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Commercial Space Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </InnerPageLayout>
  );
}
