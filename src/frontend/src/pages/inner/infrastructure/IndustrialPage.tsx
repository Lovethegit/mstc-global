import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { CheckCircle2, Factory } from "lucide-react";
import { useState } from "react";

export default function IndustrialPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    plotSize: "",
    location: "",
    industry: "",
    message: "",
  });
  const [indemnity, setIndemnity] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <InnerPageLayout
      serviceSlug="infrastructure"
      serviceName="Infrastructure & Property"
      innerPageTitle="Industrial Development"
      innerPageSubtitle="Industrial zones, warehouses, and manufacturing facilities — GIDC-compliant solutions in Gujarat."
    >
      {/* Hero Banner */}
      <div
        className="mb-10 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=400&fit=crop"
          alt="Industrial Development"
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
              <Factory size={18} style={{ color: "oklch(var(--primary))" }} />
            </div>
            <span
              className="font-sans text-xs tracking-widest uppercase"
              style={{ color: "oklch(var(--primary))" }}
            >
              Industrial Projects
            </span>
          </div>
          <h2
            className="font-serif text-2xl font-bold mb-4"
            style={{ color: "oklch(var(--foreground))" }}
          >
            Industrial Zones & Logistics
          </h2>
          <div className="section-divider w-16 mb-6" />
          <p
            className="font-sans text-sm leading-relaxed mb-4"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            Gujarat is India's industrial powerhouse. MSTC GLOBAL helps
            industries secure land, navigate GIDC approvals, and establish
            compliant industrial facilities.
          </p>
          <ul className="space-y-2">
            {[
              "GIDC plot sourcing & allotment",
              "Industrial shed construction",
              "Warehouse & logistics parks",
              "Manufacturing unit setup",
              "Factory layout planning",
              "Environmental clearance advisory",
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
        </div>
        <div>
          <div className="tool-card">
            <div className="tool-card-title">Industrial Project Enquiry</div>
            <div className="tool-card-description">
              Tell us about your industrial requirements and we will connect you
              with the right resources.
            </div>
            {submitted ? (
              <div
                className="text-center py-6"
                data-ocid="industrial.success_state"
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
                  Enquiry Submitted!
                </p>
                <p
                  className="font-sans text-sm mt-1"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  Our industrial consultant will contact you. Call +91
                  9512609016.
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
                      data-ocid="industrial.name_input"
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
                      data-ocid="industrial.phone_input"
                    />
                  </div>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Plot Size Required</label>
                  <input
                    className="tool-field-input"
                    value={form.plotSize}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, plotSize: e.target.value }))
                    }
                    placeholder="e.g. 2000 sq m"
                    data-ocid="industrial.plot_size_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">
                    Preferred Location / GIDC
                  </label>
                  <input
                    className="tool-field-input"
                    value={form.location}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, location: e.target.value }))
                    }
                    placeholder="e.g. Vatva GIDC"
                    data-ocid="industrial.location_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Industry Type</label>
                  <select
                    className="tool-field-input"
                    value={form.industry}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, industry: e.target.value }))
                    }
                    data-ocid="industrial.industry_select"
                  >
                    <option value="">Select industry</option>
                    <option>Manufacturing</option>
                    <option>Warehouse / Logistics</option>
                    <option>Food Processing</option>
                    <option>Pharma</option>
                    <option>Chemical</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Notes</label>
                  <textarea
                    className="tool-field-input"
                    rows={3}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="Additional details..."
                    data-ocid="industrial.message_textarea"
                  />
                </div>
                <IndemnityForm checked={indemnity} onChange={setIndemnity} />
                <button
                  type="submit"
                  disabled={!indemnity}
                  className="platform-button w-full"
                  data-ocid="industrial.submit_button"
                  style={{ opacity: indemnity ? 1 : 0.5 }}
                >
                  Submit Enquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </InnerPageLayout>
  );
}
