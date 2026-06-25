import {
  BreakEvenCalc,
  CollapsibleTool,
  PrepaymentOptimizer,
} from "@/components/AdvancedFinanceTools";
import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { useLogServiceSubmission } from "@/hooks/useQueries";
import { CheckCircle2, ChevronDown, ChevronUp, Home } from "lucide-react";
import { useState } from "react";

function TaxBenefitCalculator() {
  const [txLoan, setTxLoan] = useState("");
  const [txRate, setTxRate] = useState("8.5");
  const [txTenure, setTxTenure] = useState("20");
  const [txIncome, setTxIncome] = useState("");
  const [txOpen, setTxOpen] = useState(false);
  const [txResult, setTxResult] = useState<{
    annualInterest: number;
    sec24: number;
    sec80c: number;
    totalBenefit: number;
  } | null>(null);

  const calcTax = () => {
    const P = Number(txLoan) * 100000;
    const r = Number(txRate) / 12 / 100;
    const n = Number(txTenure) * 12;
    if (!P || !r || !n) return;
    const emi = (P * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    const _annualEmi = emi * 12;
    // Year 1 interest (approximate)
    const annualInterest = Math.round((P * Number(txRate)) / 100);
    const sec24 = Math.min(annualInterest, 200000); // max ₹2L under Section 24
    const sec80c = 150000; // max ₹1.5L under 80C for principal
    const income = Number(txIncome) * 12;
    const taxRate =
      income > 1500000
        ? 0.3
        : income > 1000000
          ? 0.2
          : income > 500000
            ? 0.1
            : 0;
    const totalBenefit = Math.round((sec24 + sec80c) * taxRate);
    setTxResult({ annualInterest, sec24, sec80c, totalBenefit });
  };

  return (
    <div className="border border-[#c9a84c]/30 rounded-lg overflow-hidden mb-3">
      <button
        type="button"
        onClick={() => setTxOpen(!txOpen)}
        className="w-full flex items-center justify-between p-4 bg-[#0f1319] hover:bg-[#1a1f2a] transition-colors"
        data-ocid="homeloan.taxbenefit_toggle"
      >
        <span
          className="font-sans font-semibold"
          style={{ color: "oklch(var(--primary))" }}
        >
          Home Loan Tax Benefit Calculator (80C + Section 24)
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${txOpen ? "rotate-180" : ""}`}
          style={{ color: "oklch(var(--primary))" }}
        />
      </button>
      {txOpen && (
        <div
          className="p-5 space-y-4"
          style={{ background: "oklch(var(--card))" }}
        >
          <p
            className="font-sans text-xs"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            Estimate your annual income tax savings from your home loan.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="tool-field">
              <label className="tool-field-label">Loan Amount (Lakhs ₹)</label>
              <input
                className="tool-field-input"
                type="number"
                value={txLoan}
                onChange={(e) => setTxLoan(e.target.value)}
                placeholder="e.g. 50"
                data-ocid="homeloan.tx_loan_input"
              />
            </div>
            <div className="tool-field">
              <label className="tool-field-label">Rate (%)</label>
              <input
                className="tool-field-input"
                type="number"
                step="0.1"
                value={txRate}
                onChange={(e) => setTxRate(e.target.value)}
                data-ocid="homeloan.tx_rate_input"
              />
            </div>
            <div className="tool-field">
              <label className="tool-field-label">Tenure (years)</label>
              <select
                className="tool-field-input"
                value={txTenure}
                onChange={(e) => setTxTenure(e.target.value)}
                data-ocid="homeloan.tx_tenure_select"
              >
                {[10, 15, 20, 25, 30].map((y) => (
                  <option key={y} value={y}>
                    {y} yrs
                  </option>
                ))}
              </select>
            </div>
            <div className="tool-field">
              <label className="tool-field-label">Monthly Income (₹)</label>
              <input
                className="tool-field-input"
                type="number"
                value={txIncome}
                onChange={(e) => setTxIncome(e.target.value)}
                placeholder="e.g. 80000"
                data-ocid="homeloan.tx_income_input"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={calcTax}
            className="platform-button"
            data-ocid="homeloan.tx_calculate_button"
          >
            Calculate Tax Savings
          </button>
          {txResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              {(
                [
                  [
                    "Annual Interest",
                    `₹${(txResult.annualInterest / 100000).toFixed(1)}L`,
                  ],
                  [
                    "Section 24 Deduction",
                    `₹${(txResult.sec24 / 100000).toFixed(1)}L`,
                  ],
                  [
                    "Section 80C (Principal)",
                    `₹${(txResult.sec80c / 100000).toFixed(1)}L`,
                  ],
                  [
                    "Est. Tax Saved/yr",
                    `₹${txResult.totalBenefit.toLocaleString("en-IN")}`,
                  ],
                ] as [string, string][]
              ).map(([label, val]) => (
                <div
                  key={label}
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
                    {label}
                  </p>
                  <p
                    className="font-serif text-lg font-bold mt-1"
                    style={{ color: "oklch(var(--primary))" }}
                  >
                    {val}
                  </p>
                </div>
              ))}
            </div>
          )}
          <p
            className="font-sans text-xs"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            * Indicative estimates. Consult a CA for precise tax advice.
          </p>
        </div>
      )}
    </div>
  );
}

export default function HomeLoansPage() {
  const [loanAmount, setLoanAmount] = useState("");
  const [tenure, setTenure] = useState("20");
  const [rate, setRate] = useState("8.5");
  const [emi, setEmi] = useState<number | null>(null);
  const [eligOpen, setEligOpen] = useState(false);
  const [eligIncome, setEligIncome] = useState("");
  const [eligExisting, setEligExisting] = useState("");
  const [eligDp, setEligDp] = useState("");
  const [eligResult, setEligResult] = useState<{
    maxLoan: number;
    monthlyEmi: number;
  } | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    employment: "",
    income: "",
    message: "",
  });
  const [indemnity, setIndemnity] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const logSubmission = useLogServiceSubmission();

  const calculateEligibility = () => {
    const inc = Number(eligIncome) || 0;
    const existEmi = Number(eligExisting) || 0;
    if (!inc) return;
    const maxEmiCapacity = inc * 0.5 - existEmi;
    const r = 0.085 / 12;
    const n = 240;
    const maxLoan =
      maxEmiCapacity > 0
        ? Math.round((maxEmiCapacity * ((1 + r) ** n - 1)) / (r * (1 + r) ** n))
        : 0;
    const monthlyEmi =
      maxLoan > 0
        ? Math.round((maxLoan * r * (1 + r) ** n) / ((1 + r) ** n - 1))
        : 0;
    setEligResult({ maxLoan, monthlyEmi });
  };

  const calculateEmi = () => {
    const P = Number.parseFloat(loanAmount) * 100000;
    const r = Number.parseFloat(rate) / 12 / 100;
    const n = Number.parseFloat(tenure) * 12;
    if (!P || !r || !n) return;
    const emiVal = (P * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    setEmi(Math.round(emiVal));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!indemnity) return;
    setSubmitError("");
    try {
      await logSubmission.mutateAsync({
        serviceCategory: "finance",
        innerPage: "Home Loans",
        formType: "EMICalculator",
        fields: [
          ["name", form.name],
          ["phone", form.phone],
          ["email", form.email],
          ["employment", form.employment],
          ["income", form.income],
          ["additionalDetails", form.message],
          ["loanAmountLakhs", loanAmount],
          ["tenureYears", tenure],
          ["interestRate", rate],
          ...(emi !== null
            ? [["estimatedEMI", String(emi)] as [string, string]]
            : []),
        ],
        submitterName: form.name,
        submitterPhone: form.phone,
        submitterEmail: form.email,
        indemnityAccepted: indemnity,
      });
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Submission failed. Please try again or call +91 9512609016.",
      );
    }
  };

  return (
    <InnerPageLayout
      serviceSlug="finance"
      serviceName="Finance & Investment"
      innerPageTitle="Home Loans"
      innerPageSubtitle="Competitive home loan facilitation with access to 20+ banks and NBFCs across India."
    >
      {/* Hero Banner */}
      <div
        className="mb-10 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&h=400&fit=crop"
          alt="Home Loans"
          className="w-full h-56 md:h-72 object-cover"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
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
              Home Loan Advisory
            </span>
          </div>
          <h2
            className="font-serif text-2xl font-bold mb-4"
            style={{ color: "oklch(var(--foreground))" }}
          >
            Your Dream Home, Financed Right
          </h2>
          <div className="section-divider w-16 mb-6" />
          <ul className="space-y-2 mb-6">
            {[
              "Loans from ₹10L to ₹10Cr+",
              "Salaried & self-employed options",
              "Balance transfer facilitation",
              "Pre-approval assistance",
              "Door-step documentation",
              "NRI home loan advisory",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2
                  size={15}
                  style={{ color: "oklch(var(--primary))", flexShrink: 0 }}
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

          {/* Loan Eligibility Calculator */}
          <div className="tool-card mb-6">
            <button
              type="button"
              onClick={() => setEligOpen((o) => !o)}
              className="w-full flex items-center justify-between"
              data-ocid="homeloan.eligibility_toggle"
            >
              <div className="tool-card-title mb-0">
                Loan Eligibility Calculator
              </div>
              {eligOpen ? (
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
            {eligOpen && (
              <div className="mt-4 space-y-4">
                <p
                  className="font-sans text-xs"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  Find out how much home loan you can get based on your income.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Monthly Income (₹)
                    </label>
                    <input
                      className="tool-field-input"
                      type="number"
                      value={eligIncome}
                      onChange={(e) => setEligIncome(e.target.value)}
                      placeholder="e.g. 80000"
                      data-ocid="homeloan.elig_income_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Existing EMIs (₹/mo)
                    </label>
                    <input
                      className="tool-field-input"
                      type="number"
                      value={eligExisting}
                      onChange={(e) => setEligExisting(e.target.value)}
                      placeholder="e.g. 10000"
                      data-ocid="homeloan.elig_existing_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">Down Payment (₹)</label>
                    <input
                      className="tool-field-input"
                      type="number"
                      value={eligDp}
                      onChange={(e) => setEligDp(e.target.value)}
                      placeholder="e.g. 500000"
                      data-ocid="homeloan.elig_dp_input"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={calculateEligibility}
                  className="platform-button"
                  data-ocid="homeloan.elig_calculate_button"
                >
                  Check Eligibility
                </button>
                {eligResult && (
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
                        Max Loan Amount
                      </p>
                      <p
                        className="font-serif text-xl font-bold mt-1"
                        style={{ color: "oklch(var(--primary))" }}
                      >
                        ₹{(eligResult.maxLoan / 100000).toFixed(1)}L
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
                        Monthly EMI Est.
                      </p>
                      <p
                        className="font-serif text-xl font-bold mt-1"
                        style={{ color: "oklch(var(--primary))" }}
                      >
                        ₹{eligResult.monthlyEmi.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* EMI Calculator */}
          <div className="tool-card">
            <div className="tool-card-title">EMI Calculator</div>
            <div className="tool-card-description">
              Estimate your monthly EMI before applying.
            </div>
            <div className="space-y-4">
              <div className="tool-field">
                <label className="tool-field-label">
                  Loan Amount (in Lakhs ₹)
                </label>
                <input
                  className="tool-field-input"
                  type="number"
                  min="1"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="e.g. 50"
                  data-ocid="homeloan.amount_input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">
                    Rate of Interest (%)
                  </label>
                  <input
                    className="tool-field-input"
                    type="number"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    data-ocid="homeloan.rate_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Tenure (years)</label>
                  <select
                    className="tool-field-input"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    data-ocid="homeloan.tenure_select"
                  >
                    <option value="5">5 yrs</option>
                    <option value="10">10 yrs</option>
                    <option value="15">15 yrs</option>
                    <option value="20">20 yrs</option>
                    <option value="25">25 yrs</option>
                    <option value="30">30 yrs</option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={calculateEmi}
                className="platform-button"
                data-ocid="homeloan.calculate_button"
              >
                Calculate EMI
              </button>
              {emi !== null && (
                <div
                  className="text-center py-3 rounded-sm"
                  style={{
                    background: "oklch(var(--primary) / 0.1)",
                    border: "1px solid oklch(var(--primary) / 0.3)",
                  }}
                  data-ocid="homeloan.emi_result"
                >
                  <p
                    className="font-sans text-xs"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    Estimated Monthly EMI
                  </p>
                  <p
                    className="font-serif text-3xl font-bold mt-1"
                    style={{ color: "oklch(var(--primary))" }}
                  >
                    ₹{emi.toLocaleString("en-IN")}
                  </p>
                  <p
                    className="font-sans text-xs mt-1"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    *Indicative only. Actual rate may vary.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="tool-card">
          <div className="tool-card-title">Apply for Home Loan Advisory</div>
          <div className="tool-card-description">
            Our loan expert will assess your eligibility and connect you with
            the best lender.
          </div>
          {submitted ? (
            <div
              className="text-center py-6"
              data-ocid="homeloan.success_state"
            >
              <CheckCircle2
                size={36}
                className="mx-auto mb-3"
                style={{ color: "oklch(var(--primary))" }}
              />
              <p
                className="font-sans font-semibold"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Thank you! We've received your request.
              </p>
              <p
                className="font-sans text-sm mt-1"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                We'll get back to you within 24 hours. For urgent needs,
                WhatsApp us at +91 9512609016.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">Name *</label>
                  <input
                    className="tool-field-input"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Your name"
                    data-ocid="homeloan.name_input"
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
                    data-ocid="homeloan.phone_input"
                  />
                </div>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Employment Type</label>
                <select
                  className="tool-field-input"
                  value={form.employment}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, employment: e.target.value }))
                  }
                  data-ocid="homeloan.employment_select"
                >
                  <option value="">Select</option>
                  <option>Salaried</option>
                  <option>Self-Employed</option>
                  <option>Business Owner</option>
                  <option>NRI</option>
                </select>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Monthly Income (₹)</label>
                <input
                  className="tool-field-input"
                  value={form.income}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, income: e.target.value }))
                  }
                  placeholder="e.g. 80,000"
                  data-ocid="homeloan.income_input"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Additional Details</label>
                <textarea
                  className="tool-field-input"
                  rows={3}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  placeholder="Property location, loan amount needed..."
                  data-ocid="homeloan.notes_textarea"
                />
              </div>
              <IndemnityForm checked={indemnity} onChange={setIndemnity} />
              {submitError && (
                <p
                  className="font-sans text-xs"
                  style={{ color: "oklch(var(--destructive))" }}
                  data-ocid="homeloan.error_state"
                >
                  {submitError}
                </p>
              )}
              <button
                type="submit"
                disabled={!indemnity || logSubmission.isPending}
                className="platform-button w-full"
                data-ocid="homeloan.submit_button"
                style={{
                  opacity: indemnity && !logSubmission.isPending ? 1 : 0.5,
                }}
              >
                {logSubmission.isPending ? "Submitting…" : "Send My Request"}
              </button>
            </form>
          )}
        </div>
        {/* Tax Benefit Calculator + Advanced Tools */}
        <div className="mt-10">
          <h3
            className="font-serif text-lg font-bold mb-4"
            style={{ color: "oklch(var(--primary))" }}
          >
            More Financial Tools
          </h3>
          <TaxBenefitCalculator />
          <CollapsibleTool
            title="Part-Prepayment Optimizer"
            description="Calculate how much you save by making an extra lump-sum payment on your home loan."
          >
            <PrepaymentOptimizer />
          </CollapsibleTool>
          <CollapsibleTool
            title="Break-Even Calculator (Buy vs Rent)"
            description="Find out exactly when buying a property becomes cheaper than renting — with a 20-year chart."
          >
            <BreakEvenCalc />
          </CollapsibleTool>
        </div>
      </div>
    </InnerPageLayout>
  );
}
