import { createActor } from "@/backend";
import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calculator, CheckCircle2, HandHeart, Info } from "lucide-react";
import { useState } from "react";

function useLogServiceSubmission() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      serviceCategory: string;
      innerPage: string;
      formType: string;
      fields: Array<[string, string]>;
      submitterName: string;
      submitterPhone: string;
      submitterEmail: string;
      indemnityAccepted: boolean;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.logServiceSubmission(
        vars.serviceCategory,
        vars.innerPage,
        vars.formType,
        vars.fields,
        vars.submitterName,
        vars.submitterPhone,
        vars.submitterEmail,
        vars.indemnityAccepted,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["serviceSubmissions"] });
    },
  });
}

interface CsrResult {
  mandatoryAmount: string;
  eligibilityNote: string;
}

function CsrCalculator() {
  const [turnoverRange, setTurnoverRange] = useState("");
  const [netProfit, setNetProfit] = useState("");
  const [result, setResult] = useState<CsrResult | null>(null);

  function calculate() {
    const profit = Number.parseFloat(netProfit) || 0;
    const csrObligation = profit * 0.02;
    const formatted = csrObligation.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
    let eligNote = "";
    if (
      turnoverRange === "500Cr+" ||
      profit >= 500_00_00_000 ||
      profit >= 5_00_00_000
    ) {
      eligNote =
        "Section 135 of Companies Act 2013 applies. CSR committee formation is mandatory.";
    } else {
      eligNote =
        "Section 135 applies if net worth ≥ ₹500Cr, turnover ≥ ₹1000Cr, or average net profit ≥ ₹5Cr.";
    }
    setResult({ mandatoryAmount: formatted, eligibilityNote: eligNote });
  }

  return (
    <div className="tool-card">
      <div className="flex items-center gap-2 mb-1">
        <Calculator size={18} style={{ color: "oklch(var(--primary))" }} />
        <div className="tool-card-title">CSR Budget Calculator</div>
      </div>
      <div className="tool-card-description">
        Estimate your mandatory CSR obligation under Companies Act 2013.
      </div>
      <div className="tool-card-fields">
        <div className="tool-field">
          <label className="tool-field-label">Company Annual Turnover</label>
          <select
            className="tool-field-input"
            value={turnoverRange}
            onChange={(e) => {
              setTurnoverRange(e.target.value);
              setResult(null);
            }}
            data-ocid="csr_calc.turnover_select"
          >
            <option value="">Select range</option>
            <option value="10Cr-50Cr">₹10Cr – ₹50Cr</option>
            <option value="50Cr-100Cr">₹50Cr – ₹100Cr</option>
            <option value="100Cr-500Cr">₹100Cr – ₹500Cr</option>
            <option value="500Cr+">₹500Cr+</option>
          </select>
        </div>
        <div className="tool-field">
          <label className="tool-field-label">
            Average Net Profit (Last 3 Years, INR)
          </label>
          <input
            type="number"
            className="tool-field-input"
            value={netProfit}
            onChange={(e) => {
              setNetProfit(e.target.value);
              setResult(null);
            }}
            placeholder="e.g. 50000000 (for ₹5Cr)"
            data-ocid="csr_calc.profit_input"
          />
        </div>
        <button
          type="button"
          onClick={calculate}
          disabled={!turnoverRange || !netProfit}
          className="platform-button"
          style={{ opacity: turnoverRange && netProfit ? 1 : 0.5 }}
          data-ocid="csr_calc.calculate_button"
        >
          Calculate CSR Obligation
        </button>
        {result && (
          <div
            className="p-4 rounded-lg space-y-2"
            style={{
              background: "oklch(var(--primary) / 0.08)",
              border: "1px solid oklch(var(--primary) / 0.25)",
            }}
            data-ocid="csr_calc.result"
          >
            <p
              className="font-sans text-xs font-semibold"
              style={{ color: "oklch(var(--primary))" }}
            >
              Mandatory CSR Amount (2% of Avg Net Profit)
            </p>
            <p
              className="font-serif text-xl font-bold"
              style={{ color: "oklch(var(--foreground))" }}
            >
              {result.mandatoryAmount}
            </p>
            <div
              className="flex items-start gap-2 pt-1"
              style={{ borderTop: "1px solid oklch(var(--border))" }}
            >
              <Info
                size={13}
                className="mt-0.5 shrink-0"
                style={{ color: "oklch(var(--muted-foreground))" }}
              />
              <p
                className="font-sans text-xs leading-relaxed"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                {result.eligibilityNote}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CsrFundManagementPage() {
  const submitMutation = useLogServiceSubmission();
  const [submitted, setSubmitted] = useState(false);
  const [indemnity, setIndemnity] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    cin: "",
    contactPerson: "",
    designation: "",
    phone: "",
    email: "",
    csrBudget: "",
    prevActivities: "",
    implementation: "",
    focusAreas: [] as string[],
  });

  const focusOptions = [
    "Education",
    "Health & Sanitation",
    "Environment",
    "Women Empowerment",
    "Rural Development",
    "Disaster Relief",
    "Sports",
    "Culture",
    "Other",
  ];

  function toggleFocus(area: string) {
    setForm((f) => ({
      ...f,
      focusAreas: f.focusAreas.includes(area)
        ? f.focusAreas.filter((a) => a !== area)
        : [...f.focusAreas, area],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!indemnity) return;
    const fields: Array<[string, string]> = [
      ["Company Name", form.companyName],
      ["CIN / Registration Number", form.cin],
      ["Contact Person", form.contactPerson],
      ["Designation", form.designation],
      ["Phone", form.phone],
      ["Email", form.email],
      ["CSR Focus Areas", form.focusAreas.join(", ")],
      ["Annual CSR Budget", form.csrBudget],
      ["Previous CSR Activities", form.prevActivities],
      ["Implementation Preference", form.implementation],
    ];
    submitMutation.mutate(
      {
        serviceCategory: "ngo",
        innerPage: "CSR Fund Management",
        formType: "CSRFundForm",
        fields,
        submitterName: form.contactPerson,
        submitterPhone: form.phone,
        submitterEmail: form.email,
        indemnityAccepted: indemnity,
      },
      { onSuccess: () => setSubmitted(true) },
    );
  }

  return (
    <InnerPageLayout
      serviceSlug="ngo-csr"
      serviceName="NGO & CSR Initiatives"
      innerPageTitle="CSR Fund Management"
      innerPageSubtitle="Strategic CSR fund management and compliance for companies under the Companies Act 2013."
    >
      {/* Hero Banner */}
      <div
        className="mb-8 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=400&fit=crop"
          alt="CSR Fund Management"
          className="w-full h-56 md:h-72 object-cover"
        />
      </div>
      {/* Description */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-sm flex items-center justify-center"
            style={{
              background: "oklch(var(--primary) / 0.15)",
              border: "1px solid oklch(var(--primary) / 0.3)",
            }}
          >
            <HandHeart size={18} style={{ color: "oklch(var(--primary))" }} />
          </div>
          <span
            className="font-sans text-xs tracking-widest uppercase"
            style={{ color: "oklch(var(--primary))" }}
          >
            CSR Compliance & Impact
          </span>
        </div>
        <h2
          className="font-serif text-2xl font-bold mb-3"
          style={{ color: "oklch(var(--foreground))" }}
        >
          CSR that Creates Real Change
        </h2>
        <div className="section-divider w-16 mb-5" />
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm font-sans leading-relaxed"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          <p>
            Under Section 135 of the Companies Act 2013, every company meeting
            the prescribed thresholds must spend at least 2% of its average net
            profits on CSR activities. MSTC GLOBAL helps Gujarat-based
            businesses understand, plan, and execute their CSR obligations with
            full regulatory compliance.
          </p>
          <p>
            We facilitate CSR committee formation, policy drafting, project
            identification, NGO partner vetting, and end-to-end fund
            disbursement management. Our Gujarat-focused network ensures CSR
            spend reaches meaningful, auditable community outcomes.
          </p>
          <p>
            From annual CSR reporting to impact measurement, we handle every
            aspect of your CSR programme — ensuring legal compliance,
            transparent documentation, and measurable social benefit aligned
            with Schedule VII of the Companies Act.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Calculator + Offerings */}
        <div className="space-y-8">
          <CsrCalculator />
          <div>
            <p
              className="font-sans text-sm font-semibold mb-3"
              style={{ color: "oklch(var(--foreground))" }}
            >
              Key Services
            </p>
            <ul className="space-y-2">
              {[
                "CSR policy & strategy formulation",
                "Project identification & vetting",
                "NGO partner selection & due diligence",
                "Fund disbursement management",
                "Companies Act Section 135 compliance",
                "Impact measurement & annual reporting",
                "CSR committee formation support",
                "Schedule VII activity guidance",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
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
          </div>
        </div>

        {/* Right: Enquiry Form */}
        <div className="tool-card">
          <div className="tool-card-title">CSR Partnership Enquiry</div>
          <div className="tool-card-description">
            Share your CSR objectives and we will design a tailored programme
            for your organisation.
          </div>
          {submitted ? (
            <div className="text-center py-8" data-ocid="csr.success_state">
              <CheckCircle2
                size={40}
                className="mx-auto mb-3"
                style={{ color: "oklch(var(--primary))" }}
              />
              <p
                className="font-sans font-semibold text-lg"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Enquiry Received!
              </p>
              <p
                className="font-sans text-sm mt-2"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Our CSR team will contact you within 24 hours. For urgent
                matters, call <strong>+91 9512609016</strong>.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              data-ocid="csr.form"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label" htmlFor="csr-company">
                    Company Name *
                  </label>
                  <input
                    id="csr-company"
                    className="tool-field-input"
                    required
                    value={form.companyName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, companyName: e.target.value }))
                    }
                    placeholder="ABC Private Limited"
                    data-ocid="csr.company_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label" htmlFor="csr-cin">
                    CIN / Registration No.
                  </label>
                  <input
                    id="csr-cin"
                    className="tool-field-input"
                    value={form.cin}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, cin: e.target.value }))
                    }
                    placeholder="U12345GJ2020PTC123456"
                    data-ocid="csr.cin_input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label" htmlFor="csr-contact">
                    Contact Person *
                  </label>
                  <input
                    id="csr-contact"
                    className="tool-field-input"
                    required
                    value={form.contactPerson}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, contactPerson: e.target.value }))
                    }
                    placeholder="Your full name"
                    data-ocid="csr.name_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label" htmlFor="csr-designation">
                    Designation
                  </label>
                  <input
                    id="csr-designation"
                    className="tool-field-input"
                    value={form.designation}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, designation: e.target.value }))
                    }
                    placeholder="e.g. CFO, CSR Head"
                    data-ocid="csr.designation_input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label" htmlFor="csr-phone">
                    Phone *
                  </label>
                  <input
                    id="csr-phone"
                    className="tool-field-input"
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+91 XXXXX XXXXX"
                    data-ocid="csr.phone_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label" htmlFor="csr-email">
                    Email
                  </label>
                  <input
                    id="csr-email"
                    className="tool-field-input"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="you@company.com"
                    data-ocid="csr.email_input"
                  />
                </div>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">
                  CSR Focus Areas (select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                  {focusOptions.map((area) => (
                    <label
                      key={area}
                      className="flex items-center gap-2 cursor-pointer"
                      data-ocid={`csr.focus_${area.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                    >
                      <input
                        type="checkbox"
                        checked={form.focusAreas.includes(area)}
                        onChange={() => toggleFocus(area)}
                        className="rounded"
                        style={{ accentColor: "oklch(var(--primary))" }}
                      />
                      <span
                        className="font-sans text-xs"
                        style={{ color: "oklch(var(--foreground))" }}
                      >
                        {area}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="tool-field">
                <label className="tool-field-label" htmlFor="csr-budget">
                  Annual CSR Budget (INR)
                </label>
                <input
                  id="csr-budget"
                  className="tool-field-input"
                  type="number"
                  value={form.csrBudget}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, csrBudget: e.target.value }))
                  }
                  placeholder="e.g. 5000000 (for ₹50L)"
                  data-ocid="csr.budget_input"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label" htmlFor="csr-prev">
                  Previous CSR Activities
                </label>
                <textarea
                  id="csr-prev"
                  className="tool-field-input"
                  rows={2}
                  value={form.prevActivities}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, prevActivities: e.target.value }))
                  }
                  placeholder="Briefly describe past CSR initiatives, if any..."
                  data-ocid="csr.prev_activities_textarea"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label" htmlFor="csr-impl">
                  Implementation Preference
                </label>
                <select
                  id="csr-impl"
                  className="tool-field-input"
                  value={form.implementation}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, implementation: e.target.value }))
                  }
                  data-ocid="csr.implementation_select"
                >
                  <option value="">Select preference</option>
                  <option>Through NGO</option>
                  <option>Direct Implementation</option>
                  <option>Both</option>
                </select>
              </div>
              <IndemnityForm checked={indemnity} onChange={setIndemnity} />
              <button
                type="submit"
                disabled={!indemnity || submitMutation.isPending}
                className="platform-button w-full"
                style={{ opacity: indemnity ? 1 : 0.5 }}
                data-ocid="csr.submit_button"
              >
                {submitMutation.isPending
                  ? "Submitting…"
                  : "Submit CSR Enquiry"}
              </button>
              {submitMutation.isError && (
                <p
                  className="font-sans text-xs text-center"
                  style={{ color: "oklch(var(--destructive))" }}
                  data-ocid="csr.error_state"
                >
                  Submission failed. Please try again or call +91 9512609016.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </InnerPageLayout>
  );
}
