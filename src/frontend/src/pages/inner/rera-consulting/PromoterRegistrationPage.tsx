import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { CheckCircle2, FileText } from "lucide-react";
import React, { useState } from "react";

function CollapsibleTool({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border border-[#c9a84c]/30 rounded-lg overflow-hidden mb-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-[#0f1319] text-[#c9a84c] font-semibold hover:bg-[#1a1f2a] transition-colors"
        data-ocid="promoter.tool_toggle"
      >
        <span>{title}</span>
        <span
          className="transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▼
        </span>
      </button>
      {open && (
        <div className="p-5 bg-[#0a0e17] text-[#e8e8e8]">{children}</div>
      )}
    </div>
  );
}

const RERA_STEPS = [
  "Obtain land title documents and clear title",
  "Get all statutory approvals (AUDA/AMC plan approval)",
  "Prepare project details and layout plan",
  "Arrange CA certificate for project financials",
  "Register on GujRERA portal (rera.gujarat.gov.in)",
  "Upload all required documents",
  "Pay RERA registration fees",
  "Await RERA number issuance (usually 30 days)",
  "Display RERA number on all marketing materials",
  "Submit quarterly progress reports",
];

const checklist = [
  { id: "commencement", label: "Commencement Certificate" },
  { id: "layout", label: "Approved Layout Plan" },
  { id: "landTitle", label: "Clear Land Title Document" },
  { id: "envClearance", label: "Environmental Clearance (if required)" },
  { id: "noc", label: "NOC from Local Authority" },
  { id: "panCard", label: "PAN Card of Promoter" },
  { id: "encumbrance", label: "Encumbrance Certificate" },
  { id: "photos", label: "Passport-size Photos (3 copies)" },
  { id: "bankStmt", label: "Bank Statement (6 months)" },
  { id: "itReturns", label: "IT Returns (2 years)" },
];

export default function PromoterRegistrationPage() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [reraStepChecks, setReraStepChecks] = useState<boolean[]>(
    Array(RERA_STEPS.length).fill(false),
  );
  const [projectType, setProjectType] = useState<
    "Residential" | "Commercial" | "Mixed"
  >("Residential");
  const [totalUnits, setTotalUnits] = useState("");
  const [carpetArea, setCarpetArea] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    project: "",
    location: "",
    message: "",
  });
  const [indemnity, setIndemnity] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const missingCount = checklist.filter((c) => !checks[c.id]).length;
  const reraStepsCompleted = reraStepChecks.filter(Boolean).length;

  const calcReraFee = () => {
    const area = Number.parseFloat(carpetArea) || 0;
    if (area <= 0) return null;
    const rate = 10;
    const fee = area * rate;
    if (projectType === "Residential") {
      return Math.min(Math.max(fee, 50000), 500000);
    }
    return Math.min(Math.max(fee, 100000), 1000000);
  };

  const reraFee = calcReraFee();

  return (
    <InnerPageLayout
      serviceSlug="rera-consulting"
      serviceName="RERA & PR Consulting"
      innerPageTitle="Promoter Registration"
      innerPageSubtitle="GujRERA promoter registration — we handle documentation, submissions, and compliance end-to-end."
    >
      {/* Hero Banner */}
      <div
        className="mb-10 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=400&fit=crop"
          alt="Promoter Registration"
          className="w-full h-56 md:h-72 object-cover"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* RERA Checklist */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-sm flex items-center justify-center"
              style={{
                background: "oklch(var(--primary) / 0.15)",
                border: "1px solid oklch(var(--primary) / 0.3)",
              }}
            >
              <FileText size={18} style={{ color: "oklch(var(--primary))" }} />
            </div>
            <span
              className="font-sans text-xs tracking-widest uppercase"
              style={{ color: "oklch(var(--primary))" }}
            >
              Interactive RERA Checklist
            </span>
          </div>
          <h2
            className="font-serif text-2xl font-bold mb-2"
            style={{ color: "oklch(var(--foreground))" }}
          >
            Documents Required
          </h2>
          <p
            className="font-sans text-sm mb-4"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            Check off documents you already have. We will follow up on missing
            ones.
          </p>
          <div className="tool-card">
            <div className="space-y-3">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      background: checks[item.id]
                        ? "oklch(var(--primary))"
                        : "oklch(var(--input))",
                      border: `2px solid ${checks[item.id] ? "oklch(var(--primary))" : "oklch(var(--border))"}`,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!checks[item.id]}
                      onChange={(e) =>
                        setChecks((c) => ({
                          ...c,
                          [item.id]: e.target.checked,
                        }))
                      }
                      className="sr-only"
                      data-ocid={`rera.check_${item.id}`}
                    />
                    {checks[item.id] && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 12 12"
                        fill="none"
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
                    className="font-sans text-sm"
                    style={{
                      color: checks[item.id]
                        ? "oklch(var(--primary))"
                        : "oklch(var(--foreground))",
                    }}
                  >
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
            <div
              className="mt-4 pt-4"
              style={{ borderTop: "1px solid oklch(var(--border))" }}
            >
              {missingCount > 0 ? (
                <p
                  className="font-sans text-sm"
                  style={{ color: "oklch(var(--destructive))" }}
                >
                  ⚠️ {missingCount} document(s) missing — contact us for
                  assistance.
                </p>
              ) : (
                <p
                  className="font-sans text-sm"
                  style={{ color: "oklch(0.7 0.18 148)" }}
                >
                  ✓ All documents ready! Proceed with registration.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="tool-card">
          <div className="tool-card-title">RERA Registration Request</div>
          <div className="tool-card-description">
            Submit your details and we will initiate the GujRERA promoter
            registration process.
          </div>
          {submitted ? (
            <div
              className="text-center py-6"
              data-ocid="promoter.success_state"
            >
              <CheckCircle2
                size={36}
                className="mx-auto mb-3"
                style={{ color: "oklch(var(--primary))" }}
              />
              <p
                className="font-sans font-semibold text-lg"
                style={{ color: "oklch(var(--foreground))" }}
              >
                We've Received Your Request! 🙏
              </p>
              <p
                className="font-sans text-sm mt-2"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Our RERA expert will personally reach out to you and guide you
                through every step. You're in good hands.
              </p>
              <p
                className="font-sans text-xs mt-2"
                style={{ color: "oklch(var(--primary))" }}
              >
                For urgent queries: +91 9512609016
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
                    placeholder="Promoter name"
                    data-ocid="promoter.name_input"
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
                    data-ocid="promoter.phone_input"
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
                  data-ocid="promoter.email_input"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Project Name</label>
                <input
                  className="tool-field-input"
                  value={form.project}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, project: e.target.value }))
                  }
                  placeholder="Project name"
                  data-ocid="promoter.project_input"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Project Location</label>
                <input
                  className="tool-field-input"
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  placeholder="City / Area"
                  data-ocid="promoter.location_input"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Additional Notes</label>
                <textarea
                  className="tool-field-input"
                  rows={2}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  placeholder="Any specific concerns..."
                  data-ocid="promoter.notes_textarea"
                />
              </div>
              <IndemnityForm checked={indemnity} onChange={setIndemnity} />
              <button
                type="submit"
                disabled={!indemnity}
                className="platform-button w-full"
                data-ocid="promoter.submit_button"
                style={{ opacity: indemnity ? 1 : 0.5 }}
              >
                Let's Connect
              </button>
            </form>
          )}
        </div>
      </div>
      {/* RERA Tools Section */}
      <div className="mt-10">
        <h3
          className="font-serif text-xl font-bold mb-2"
          style={{ color: "oklch(var(--primary))" }}
        >
          RERA Tools & Resources
        </h3>
        <p
          className="font-sans text-sm mb-4"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Use these tools to plan your RERA registration with clarity.
        </p>

        <CollapsibleTool title="RERA Registration Fee Estimator">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-[#c9a84c] mb-1 font-semibold uppercase tracking-wide">
                  Project Type
                </label>
                <select
                  value={projectType}
                  onChange={(e) =>
                    setProjectType(
                      e.target.value as "Residential" | "Commercial" | "Mixed",
                    )
                  }
                  className="w-full bg-[#0f1319] border border-[#c9a84c]/30 rounded px-3 py-2 text-[#e8e8e8] text-sm focus:outline-none focus:border-[#c9a84c]"
                  data-ocid="rera_fee.project_type_select"
                >
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Mixed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#c9a84c] mb-1 font-semibold uppercase tracking-wide">
                  Total Units
                </label>
                <input
                  type="number"
                  min="1"
                  value={totalUnits}
                  onChange={(e) => setTotalUnits(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full bg-[#0f1319] border border-[#c9a84c]/30 rounded px-3 py-2 text-[#e8e8e8] text-sm focus:outline-none focus:border-[#c9a84c]"
                  data-ocid="rera_fee.units_input"
                />
              </div>
              <div>
                <label className="block text-xs text-[#c9a84c] mb-1 font-semibold uppercase tracking-wide">
                  Total Carpet Area (sqft)
                </label>
                <input
                  type="number"
                  min="0"
                  value={carpetArea}
                  onChange={(e) => setCarpetArea(e.target.value)}
                  placeholder="e.g. 25000"
                  className="w-full bg-[#0f1319] border border-[#c9a84c]/30 rounded px-3 py-2 text-[#e8e8e8] text-sm focus:outline-none focus:border-[#c9a84c]"
                  data-ocid="rera_fee.area_input"
                />
              </div>
            </div>
            {reraFee !== null && (
              <div className="mt-4 bg-[#0f1319] border border-[#c9a84c]/40 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#aaa]">
                    GujRERA Registration Fee (₹10/sqft)
                  </span>
                  <span className="text-[#c9a84c] font-bold">
                    ₹{reraFee.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#aaa]">
                    Application Processing Fee
                  </span>
                  <span className="text-[#c9a84c] font-bold">₹5,000</span>
                </div>
                <div className="border-t border-[#c9a84c]/20 pt-2 flex justify-between text-sm font-bold">
                  <span className="text-[#e8e8e8]">Estimated Total</span>
                  <span className="text-[#c9a84c]">
                    ₹{(reraFee + 5000).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-[#888] mt-2">
                  * Additional CA/legal consultation fees may apply. Actual fees
                  subject to GujRERA rules at time of registration.
                </p>
              </div>
            )}
            {reraFee === null && carpetArea !== "" && (
              <p className="text-xs text-red-400 mt-2">
                Please enter a valid carpet area to estimate fees.
              </p>
            )}
            {carpetArea === "" && (
              <p className="text-xs text-[#888] mt-1">
                Enter carpet area above to calculate estimated fees.
              </p>
            )}
          </div>
        </CollapsibleTool>

        <CollapsibleTool title="RERA Registration Checklist">
          <div className="space-y-3">
            {RERA_STEPS.map((step, idx) => (
              <label
                key={step}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <div
                  className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center mt-0.5 transition-all"
                  style={{
                    background: reraStepChecks[idx] ? "#c9a84c" : "#1a1f2a",
                    border: `2px solid ${reraStepChecks[idx] ? "#c9a84c" : "#3a3f4a"}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={reraStepChecks[idx]}
                    onChange={(e) =>
                      setReraStepChecks((prev) => {
                        const next = [...prev];
                        next[idx] = e.target.checked;
                        return next;
                      })
                    }
                    className="sr-only"
                    data-ocid={`rera_steps.check.${idx + 1}`}
                  />
                  {reraStepChecks[idx] && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
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
                  className="text-sm"
                  style={{ color: reraStepChecks[idx] ? "#c9a84c" : "#e8e8e8" }}
                >
                  <span className="text-[#c9a84c]/60 mr-1">{idx + 1}.</span>{" "}
                  {step}
                </span>
              </label>
            ))}
            <div className="mt-4 pt-3 border-t border-[#c9a84c]/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#e8e8e8]">
                  {reraStepsCompleted} / {RERA_STEPS.length} steps completed
                </span>
                <span className="text-xs text-[#c9a84c] font-semibold">
                  {Math.round((reraStepsCompleted / RERA_STEPS.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-[#1a1f2a] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(reraStepsCompleted / RERA_STEPS.length) * 100}%`,
                    background: "#c9a84c",
                  }}
                />
              </div>
              {reraStepsCompleted === RERA_STEPS.length && (
                <p className="text-sm text-green-400 mt-2 font-semibold">
                  ✓ All steps complete — ready to proceed with GujRERA
                  registration!
                </p>
              )}
            </div>
          </div>
        </CollapsibleTool>
      </div>
    </InnerPageLayout>
  );
}
