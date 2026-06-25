import { createActor } from "@/backend";
import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

function SocietyCorpusCalculator() {
  const [scOpen, setScOpen] = useState(false);
  const [scFlats, setScFlats] = useState("");
  const [scValue, setScValue] = useState("");
  const [scResult, setScResult] = useState<{
    corpus: number;
    perFlat: number;
  } | null>(null);

  const calcCorpus = () => {
    const flats = Number(scFlats);
    const value = Number(scValue);
    if (!flats || !value) return;
    const corpus = Math.round(flats * value * 0.08); // ~8% of total value as corpus
    setScResult({ corpus, perFlat: Math.round(corpus / flats) });
  };

  return (
    <div className="border border-[#c9a84c]/30 rounded-lg overflow-hidden mb-3">
      <button
        type="button"
        onClick={() => setScOpen(!scOpen)}
        className="w-full flex items-center justify-between p-4 bg-[#0f1319] hover:bg-[#1a1f2a] transition-colors"
        data-ocid="redevel.corpus_toggle"
      >
        <span
          className="font-sans font-semibold"
          style={{ color: "oklch(var(--primary))" }}
        >
          Society Corpus Requirement Calculator
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${scOpen ? "rotate-180" : ""}`}
          style={{ color: "oklch(var(--primary))" }}
        />
      </button>
      {scOpen && (
        <div
          className="p-5 space-y-4"
          style={{ background: "oklch(var(--card))" }}
        >
          <p
            className="font-sans text-xs"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            Estimate the maintenance corpus a housing society needs before
            initiating redevelopment.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="tool-field">
              <label className="tool-field-label">Number of Flats</label>
              <input
                className="tool-field-input"
                type="number"
                value={scFlats}
                onChange={(e) => setScFlats(e.target.value)}
                placeholder="e.g. 24"
                data-ocid="redevel.corpus_flats_input"
              />
            </div>
            <div className="tool-field">
              <label className="tool-field-label">Avg. Flat Value (₹)</label>
              <input
                className="tool-field-input"
                type="number"
                value={scValue}
                onChange={(e) => setScValue(e.target.value)}
                placeholder="e.g. 3500000"
                data-ocid="redevel.corpus_value_input"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={calcCorpus}
            className="platform-button"
            data-ocid="redevel.corpus_calculate_button"
          >
            Calculate Corpus
          </button>
          {scResult && (
            <div className="grid grid-cols-2 gap-3 mt-2">
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
                  Total Corpus Needed
                </p>
                <p
                  className="font-serif text-xl font-bold mt-1"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  ₹{(scResult.corpus / 100000).toFixed(1)}L
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
                  Per Flat Share
                </p>
                <p
                  className="font-serif text-xl font-bold mt-1"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  ₹{scResult.perFlat.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          )}
          <p
            className="font-sans text-xs"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            * Indicative estimate at ~8% of total property value. Consult a
            housing society lawyer for legal minimums.
          </p>
        </div>
      )}
    </div>
  );
}

type Viability = "good" | "moderate" | "low" | null;

export default function RedevelopmentPage() {
  const { actor } = useActor(createActor);

  // Viability Checker state
  const [propAge, setPropAge] = useState("");
  const [currentFsi, setCurrentFsi] = useState("");
  const [availFsi, setAvailFsi] = useState("");
  const [existingFlats, setExistingFlats] = useState("");
  const [floors, setFloors] = useState("");
  const [plotAreaCalc, setPlotAreaCalc] = useState("");
  const [viability, setViability] = useState<Viability>(null);
  const [addlArea, setAddlArea] = useState(0);
  const [newUnits, setNewUnits] = useState(0);

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
    ownerName: "",
    societyName: "",
    location: "",
    plotArea: "",
    numOwners: "",
    phone: "",
    email: "",
    primaryConcern: "",
    legalIssues: "",
  });
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
          ? "Buying is more cost-effective long-term."
          : "Renting may suit your needs better right now.",
    });
  };

  const checkViability = () => {
    const cf = Number.parseFloat(currentFsi) || 0;
    const af = Number.parseFloat(availFsi) || 0;
    const pa = Number.parseFloat(plotAreaCalc) || 0;
    if (!cf || !af || !pa) return;
    const addl = ((af - cf) * pa) / 100;
    const avgFlatSize = 700; // sqft
    const units = Math.floor(addl / avgFlatSize);
    setAddlArea(Math.round(addl));
    setNewUnits(units);
    if (addl > 2000 && units > 3) setViability("good");
    else if (addl > 800 && units > 1) setViability("moderate");
    else setViability("low");
  };

  const viabilityConfig: Record<
    NonNullable<Viability>,
    { label: string; color: string; note: string }
  > = {
    good: {
      label: "Good Viability",
      color: "oklch(0.7 0.18 148)",
      note: "Strong redevelopment potential. High chance of developer interest.",
    },
    moderate: {
      label: "Moderate Viability",
      color: "oklch(0.8 0.15 80)",
      note: "Viable under favourable conditions. Recommend expert consultation.",
    },
    low: {
      label: "Needs Expert Assessment",
      color: "oklch(0.65 0.2 30)",
      note: "Limited FSI differential. May require special permissions or amalgamation.",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!indemnity || submitting) return;
    setSubmitting(true);
    const fields: Array<[string, string]> = [
      ["Society/Property Name", form.societyName],
      ["Property Location", form.location],
      ["Plot Area (sqft)", form.plotArea],
      ["Number of Owners/Members", form.numOwners],
      ["Primary Concern", form.primaryConcern],
      ["Current Legal Issues", form.legalIssues],
    ];
    try {
      if (actor) {
        await actor.logServiceSubmission(
          "purchase-rent",
          "Redevelopment",
          "FeasibilityForm",
          fields,
          form.ownerName,
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
      innerPageTitle="Redevelopment"
      innerPageSubtitle="Transform aging societies and properties into modern, high-value assets through expert redevelopment planning and developer matching."
    >
      {/* Hero Banner */}
      <div
        className="mb-10 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=400&fit=crop"
          alt="Redevelopment"
          className="w-full h-56 md:h-72 object-cover"
        />
      </div>
      <div className="mb-10 max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-sm flex items-center justify-center"
            style={{
              background: "oklch(var(--primary) / 0.15)",
              border: "1px solid oklch(var(--primary) / 0.3)",
            }}
          >
            <RefreshCw size={18} style={{ color: "oklch(var(--primary))" }} />
          </div>
          <span
            className="font-sans text-xs tracking-widest uppercase"
            style={{ color: "oklch(var(--primary))" }}
          >
            Urban Redevelopment Services
          </span>
        </div>
        <h2
          className="font-serif text-2xl font-bold mb-3"
          style={{ color: "oklch(var(--foreground))" }}
        >
          Unlock the Hidden Value of Your Property
        </h2>
        <div className="section-divider w-16 mb-5" />
        <p
          className="font-sans text-sm leading-relaxed mb-3"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Old buildings with underutilized FSI (Floor Space Index) represent one
          of the largest untapped opportunities in Ahmedabad real estate. MSTC
          GLOBAL connects property owners and housing societies with reputed
          developers who specialize in consensual redevelopment under Gujarat
          RERA redevelopment clauses and the MOFA Act.
        </p>
        <p
          className="font-sans text-sm leading-relaxed mb-3"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Our redevelopment process begins with a thorough feasibility study —
          assessing your FSI utilization, consent requirements, AMC development
          plan compliance, and comparable builder offers. We act as an
          independent facilitator, ensuring your interests as property owners
          are protected throughout.
        </p>
        <p
          className="font-sans text-sm leading-relaxed"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Use the viability checker below for a preliminary estimate, then
          submit your details for a full professional assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT: Viability Checker + Offerings */}
        <div className="space-y-6">
          <div className="tool-card">
            <div className="tool-card-title">
              <TrendingUp
                size={16}
                className="inline mr-2"
                style={{ color: "oklch(var(--primary))" }}
              />
              Redevelopment Viability Checker
            </div>
            <div className="tool-card-description">
              Enter your property data for an indicative estimate of
              redevelopment potential.
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="tool-field">
                <label className="tool-field-label">Property Age</label>
                <select
                  className="tool-field-input"
                  value={propAge}
                  onChange={(e) => setPropAge(e.target.value)}
                  data-ocid="redevel.age_select"
                >
                  <option value="">Select</option>
                  <option>10–20 years</option>
                  <option>20–30 years</option>
                  <option>30+ years</option>
                </select>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Plot Area (sqft)</label>
                <input
                  className="tool-field-input"
                  type="number"
                  value={plotAreaCalc}
                  onChange={(e) => setPlotAreaCalc(e.target.value)}
                  placeholder="e.g. 5000"
                  data-ocid="redevel.plot_input"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Current FSI Used (%)</label>
                <input
                  className="tool-field-input"
                  type="number"
                  min="0"
                  max="400"
                  value={currentFsi}
                  onChange={(e) => setCurrentFsi(e.target.value)}
                  placeholder="e.g. 60"
                  data-ocid="redevel.current_fsi_input"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Available FSI (%)</label>
                <input
                  className="tool-field-input"
                  type="number"
                  min="0"
                  max="400"
                  value={availFsi}
                  onChange={(e) => setAvailFsi(e.target.value)}
                  placeholder="e.g. 180"
                  data-ocid="redevel.avail_fsi_input"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Existing Flats</label>
                <input
                  className="tool-field-input"
                  type="number"
                  value={existingFlats}
                  onChange={(e) => setExistingFlats(e.target.value)}
                  placeholder="e.g. 12"
                  data-ocid="redevel.flats_input"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Number of Floors</label>
                <input
                  className="tool-field-input"
                  type="number"
                  value={floors}
                  onChange={(e) => setFloors(e.target.value)}
                  placeholder="e.g. 4"
                  data-ocid="redevel.floors_input"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={checkViability}
              className="platform-button w-full mt-2"
              data-ocid="redevel.check_viability_button"
            >
              Check Viability
            </button>
            {viability && (
              <div
                className="mt-4 p-4 rounded-sm"
                style={{
                  background: "oklch(var(--muted) / 0.3)",
                  border: "1px solid oklch(var(--border))",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: viabilityConfig[viability].color }}
                  />
                  <span
                    className="font-sans font-bold text-sm"
                    style={{ color: viabilityConfig[viability].color }}
                  >
                    {viabilityConfig[viability].label}
                  </span>
                </div>
                <p
                  className="font-sans text-xs mb-3"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  {viabilityConfig[viability].note}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="text-center p-2 rounded-sm"
                    style={{ background: "oklch(var(--card))" }}
                  >
                    <p
                      className="font-serif text-xl font-bold"
                      style={{ color: "oklch(var(--primary))" }}
                    >
                      {addlArea.toLocaleString("en-IN")} sqft
                    </p>
                    <p
                      className="font-sans text-xs"
                      style={{ color: "oklch(var(--muted-foreground))" }}
                    >
                      Additional Buildable Area
                    </p>
                  </div>
                  <div
                    className="text-center p-2 rounded-sm"
                    style={{ background: "oklch(var(--card))" }}
                  >
                    <p
                      className="font-serif text-xl font-bold"
                      style={{ color: "oklch(var(--primary))" }}
                    >
                      ~{newUnits} units
                    </p>
                    <p
                      className="font-sans text-xs"
                      style={{ color: "oklch(var(--muted-foreground))" }}
                    >
                      Estimated New Units
                    </p>
                  </div>
                </div>
                <p
                  className="font-sans text-xs mt-2"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  * Indicative estimate only. Actual potential depends on AMC
                  guidelines, TDR, and site-specific factors.
                </p>
              </div>
            )}
          </div>

          {/* Loan Eligibility */}
          <div className="tool-card">
            <button
              type="button"
              onClick={() => setLoanOpen((o) => !o)}
              className="w-full flex items-center justify-between"
              data-ocid="redevel.loan_toggle"
            >
              <div className="flex items-center gap-2">
                <Calculator
                  size={15}
                  style={{ color: "oklch(var(--primary))" }}
                />
                <span className="tool-card-title mb-0">Loan Eligibility</span>
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
                      placeholder="e.g. 80000"
                      data-ocid="redevel.loan_income_input"
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
                      placeholder="e.g. 10000"
                      data-ocid="redevel.loan_existing_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">Down Payment (₹)</label>
                    <input
                      className="tool-field-input"
                      type="number"
                      value={loanDp}
                      onChange={(e) => setLoanDp(e.target.value)}
                      placeholder="e.g. 500000"
                      data-ocid="redevel.loan_dp_input"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={calcLoan}
                  className="platform-button"
                  data-ocid="redevel.loan_calculate_button"
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

          {/* Rent vs Buy */}
          <div className="tool-card">
            <button
              type="button"
              onClick={() => setRvbOpen((o) => !o)}
              className="w-full flex items-center justify-between"
              data-ocid="redevel.rvb_toggle"
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
                      placeholder="e.g. 20000"
                      data-ocid="redevel.rvb_rent_input"
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
                      placeholder="e.g. 5000000"
                      data-ocid="redevel.rvb_price_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">Tenure (years)</label>
                    <select
                      className="tool-field-input"
                      value={rvbTenure}
                      onChange={(e) => setRvbTenure(e.target.value)}
                      data-ocid="redevel.rvb_tenure_select"
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
                  data-ocid="redevel.rvb_calculate_button"
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

          <SocietyCorpusCalculator />

          <div className="tool-card">
            <div className="tool-card-title">Our Redevelopment Services</div>
            <ul className="space-y-2 mt-1">
              {[
                "Redevelopment feasibility study & FSI analysis",
                "Builder / developer matching and vetting",
                "Society consensus building & legal advisory",
                "RERA redevelopment compliance (Gujarat)",
                "Rehabilitation & hardship compensation planning",
                "AMC approval & municipal liaison support",
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
          <div className="tool-card-title">
            Redevelopment Feasibility Request
          </div>
          <div className="tool-card-description">
            Share your property details and we will conduct a professional
            preliminary feasibility assessment and connect you with suitable
            developers.
          </div>
          {submitted ? (
            <div className="text-center py-8" data-ocid="redevel.success_state">
              <CheckCircle2
                size={40}
                className="mx-auto mb-3"
                style={{ color: "oklch(var(--primary))" }}
              />
              <p
                className="font-serif text-lg font-bold mb-1"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Request Received!
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
                  <label className="tool-field-label">Owner Name *</label>
                  <input
                    className="tool-field-input"
                    required
                    value={form.ownerName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, ownerName: e.target.value }))
                    }
                    placeholder="Your full name"
                    data-ocid="redevel.name_input"
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
                    data-ocid="redevel.phone_input"
                  />
                </div>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">
                  Society / Property Name
                </label>
                <input
                  className="tool-field-input"
                  value={form.societyName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, societyName: e.target.value }))
                  }
                  placeholder="e.g. Shanti Nagar CHS"
                  data-ocid="redevel.society_input"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Property Location</label>
                <input
                  className="tool-field-input"
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  placeholder="Area / Locality, Ahmedabad"
                  data-ocid="redevel.location_input"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">Plot Area (sqft)</label>
                  <input
                    className="tool-field-input"
                    type="number"
                    value={form.plotArea}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, plotArea: e.target.value }))
                    }
                    placeholder="e.g. 5000"
                    data-ocid="redevel.form_plot_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">
                    Number of Owners/Members
                  </label>
                  <input
                    className="tool-field-input"
                    type="number"
                    value={form.numOwners}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, numOwners: e.target.value }))
                    }
                    placeholder="e.g. 24"
                    data-ocid="redevel.owners_input"
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
                  data-ocid="redevel.email_input"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">Primary Concern</label>
                  <select
                    className="tool-field-input"
                    value={form.primaryConcern}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, primaryConcern: e.target.value }))
                    }
                    data-ocid="redevel.concern_select"
                  >
                    <option value="">Select</option>
                    <option>Better / Larger Flat</option>
                    <option>Additional Compensation</option>
                    <option>Both</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">
                    Current Legal Issues
                  </label>
                  <select
                    className="tool-field-input"
                    value={form.legalIssues}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, legalIssues: e.target.value }))
                    }
                    data-ocid="redevel.legal_select"
                  >
                    <option value="">Select</option>
                    <option>Yes</option>
                    <option>No</option>
                    <option>Maybe</option>
                  </select>
                </div>
              </div>
              <IndemnityForm checked={indemnity} onChange={setIndemnity} />
              <button
                type="submit"
                disabled={!indemnity || submitting}
                className="platform-button w-full"
                data-ocid="redevel.submit_button"
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
