import {
  CollapsibleTool,
  GSTPropertyCalc,
  RentalIncomeTaxCalc,
} from "@/components/AdvancedFinanceTools";
import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { Briefcase, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function BusinessLoansPage() {
  const [loanAmount, setLoanAmount] = useState("");
  const [tenure, setTenure] = useState("5");
  const [rate, setRate] = useState("12");
  const [emi, setEmi] = useState<number | null>(null);
  const [eligOpen, setEligOpen] = useState(false);
  const [eligIncome, setEligIncome] = useState("");
  const [eligExisting, setEligExisting] = useState("");
  const [eligResult, setEligResult] = useState<{
    maxLoan: number;
    monthlyEmi: number;
  } | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    business: "",
    turnover: "",
    loanPurpose: "",
    message: "",
  });
  const [indemnity, setIndemnity] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const calculateEligibility = () => {
    const inc = Number(eligIncome) || 0;
    const existEmi = Number(eligExisting) || 0;
    if (!inc) return;
    const maxEmiCapacity = inc * 0.55 - existEmi;
    const r = 0.12 / 12;
    const n = 60;
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
    setEmi(Math.round((P * r * (1 + r) ** n) / ((1 + r) ** n - 1)));
  };

  return (
    <InnerPageLayout
      serviceSlug="finance"
      serviceName="Finance & Investment"
      innerPageTitle="Business Loans"
      innerPageSubtitle="Working capital, term loans, and project finance for SMEs and enterprises across Gujarat."
    >
      {/* Hero Banner */}
      <div
        className="mb-10 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=400&fit=crop"
          alt="Business Loans"
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
              <Briefcase size={18} style={{ color: "oklch(var(--primary))" }} />
            </div>
            <span
              className="font-sans text-xs tracking-widest uppercase"
              style={{ color: "oklch(var(--primary))" }}
            >
              Business Financing
            </span>
          </div>
          <h2
            className="font-serif text-2xl font-bold mb-4"
            style={{ color: "oklch(var(--foreground))" }}
          >
            Fuel Your Business Growth
          </h2>
          <div className="section-divider w-16 mb-6" />
          <ul className="space-y-2 mb-6">
            {[
              "Working capital loans",
              "Term loans for expansion",
              "Equipment & machinery finance",
              "MSME / SME loan schemes",
              "Overdraft & CC facility",
              "Project finance structuring",
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
          {/* Loan Eligibility */}
          <div className="tool-card mb-6">
            <button
              type="button"
              onClick={() => setEligOpen((o) => !o)}
              className="w-full flex items-center justify-between"
              data-ocid="bizloan.eligibility_toggle"
            >
              <div className="tool-card-title mb-0">
                Business Loan Eligibility
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Monthly Revenue (₹)
                    </label>
                    <input
                      className="tool-field-input"
                      type="number"
                      value={eligIncome}
                      onChange={(e) => setEligIncome(e.target.value)}
                      placeholder="e.g. 200000"
                      data-ocid="bizloan.elig_income_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Existing EMIs (₹)
                    </label>
                    <input
                      className="tool-field-input"
                      type="number"
                      value={eligExisting}
                      onChange={(e) => setEligExisting(e.target.value)}
                      placeholder="e.g. 20000"
                      data-ocid="bizloan.elig_existing_input"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={calculateEligibility}
                  className="platform-button"
                  data-ocid="bizloan.elig_calculate_button"
                >
                  Check Eligibility
                </button>
                {eligResult && (
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
                        Monthly EMI
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

          <div className="tool-card">
            <div className="tool-card-title">Loan EMI Estimator</div>
            <div className="space-y-4">
              <div className="tool-field">
                <label className="tool-field-label">
                  Loan Amount (Lakhs ₹)
                </label>
                <input
                  className="tool-field-input"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="e.g. 25"
                  data-ocid="bizloan.amount_input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="tool-field">
                  <label className="tool-field-label">Rate (%)</label>
                  <input
                    className="tool-field-input"
                    type="number"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    data-ocid="bizloan.rate_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Tenure (yrs)</label>
                  <select
                    className="tool-field-input"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    data-ocid="bizloan.tenure_select"
                  >
                    <option value="1">1</option>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="7">7</option>
                    <option value="10">10</option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={calculateEmi}
                className="platform-button"
                data-ocid="bizloan.calculate_button"
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
                  data-ocid="bizloan.emi_result"
                >
                  <p
                    className="font-sans text-xs"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    Est. Monthly EMI
                  </p>
                  <p
                    className="font-serif text-3xl font-bold mt-1"
                    style={{ color: "oklch(var(--primary))" }}
                  >
                    ₹{emi.toLocaleString("en-IN")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="tool-card">
          <div className="tool-card-title">Business Loan Enquiry</div>
          <div className="tool-card-description">
            Our finance team will match you with the right lending product for
            your business.
          </div>
          {submitted ? (
            <div className="text-center py-6" data-ocid="bizloan.success_state">
              <CheckCircle2
                size={36}
                className="mx-auto mb-3"
                style={{ color: "oklch(var(--primary))" }}
              />
              <p
                className="font-sans font-semibold"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Enquiry Received!
              </p>
              <p
                className="font-sans text-sm mt-1"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Call +91 9512609016 for immediate assistance.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (indemnity) setSubmitted(true);
              }}
              className="space-y-4"
            >
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
                    data-ocid="bizloan.name_input"
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
                    data-ocid="bizloan.phone_input"
                  />
                </div>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Business Name</label>
                <input
                  className="tool-field-input"
                  value={form.business}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, business: e.target.value }))
                  }
                  placeholder="Company / firm name"
                  data-ocid="bizloan.business_input"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Annual Turnover</label>
                <input
                  className="tool-field-input"
                  value={form.turnover}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, turnover: e.target.value }))
                  }
                  placeholder="e.g. ₹50 Lakhs"
                  data-ocid="bizloan.turnover_input"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Loan Purpose</label>
                <select
                  className="tool-field-input"
                  value={form.loanPurpose}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, loanPurpose: e.target.value }))
                  }
                  data-ocid="bizloan.purpose_select"
                >
                  <option value="">Select</option>
                  <option>Working Capital</option>
                  <option>Expansion</option>
                  <option>Equipment</option>
                  <option>Inventory</option>
                  <option>Other</option>
                </select>
              </div>
              <IndemnityForm checked={indemnity} onChange={setIndemnity} />
              <button
                type="submit"
                disabled={!indemnity}
                className="platform-button w-full"
                data-ocid="bizloan.submit_button"
                style={{ opacity: indemnity ? 1 : 0.5 }}
              >
                Submit Loan Enquiry
              </button>
            </form>
          )}
        </div>
      </div>
      {/* Tax & GST Tools */}
      <div className="mt-10">
        <h3
          className="font-serif text-xl font-bold mb-4"
          style={{ color: "oklch(var(--primary))" }}
        >
          Tax & GST Tools
        </h3>
        <div className="space-y-4">
          <CollapsibleTool
            title="GST on Property Calculator"
            description="Calculate GST applicable on under-construction properties (1% affordable, 5% regular/luxury)."
          >
            <GSTPropertyCalc />
          </CollapsibleTool>
          <CollapsibleTool
            title="Rental Income Tax Calculator"
            description="Estimate income tax on rental earnings with Section 24(a) standard deduction and Section 24(b) home loan interest."
          >
            <RentalIncomeTaxCalc />
          </CollapsibleTool>
        </div>
      </div>
    </InnerPageLayout>
  );
}
