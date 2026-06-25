import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { Briefcase, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function CommercialPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    plotSize: "",
    location: "",
    usage: "",
    message: "",
  });
  const [indemnity, setIndemnity] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <InnerPageLayout
      serviceSlug="infrastructure"
      serviceName="Infrastructure & Property"
      innerPageTitle="Commercial Development"
      innerPageSubtitle="Office spaces, retail complexes, and commercial infrastructure for growing businesses."
    >
      {/* Hero Banner */}
      <div
        className="mb-10 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=400&fit=crop"
          alt="Commercial Development"
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
              Commercial Projects
            </span>
          </div>
          <h2
            className="font-serif text-2xl font-bold mb-4"
            style={{ color: "oklch(var(--foreground))" }}
          >
            Strategic Commercial Spaces
          </h2>
          <div className="section-divider w-16 mb-6" />
          <p
            className="font-sans text-sm leading-relaxed mb-4"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            From retail showrooms to large commercial complexes, MSTC GLOBAL
            facilitates commercial property development that aligns with
            business goals and market demand in Ahmedabad.
          </p>
          <ul className="space-y-2">
            {[
              "Office space development",
              "Retail & showroom complexes",
              "Mixed-use commercial buildings",
              "Industrial-commercial zones",
              "Commercial plot sourcing",
              "Lease & licensing advisory",
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
            <div className="tool-card-title">
              Commercial Project Feasibility
            </div>
            <div className="tool-card-description">
              Fill in your requirements and our team will provide a tailored
              commercial property assessment.
            </div>
            {submitted ? (
              <div
                className="text-center py-6"
                data-ocid="commercial.success_state"
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
                  Enquiry Received!
                </p>
                <p
                  className="font-sans text-sm mt-1"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  We will be in touch shortly. Call +91 9512609016 for urgent
                  assistance.
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
                      data-ocid="commercial.name_input"
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
                      data-ocid="commercial.phone_input"
                    />
                  </div>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">
                    Plot / Built-up Size
                  </label>
                  <input
                    className="tool-field-input"
                    value={form.plotSize}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, plotSize: e.target.value }))
                    }
                    placeholder="e.g. 5000 sq ft"
                    data-ocid="commercial.plot_size_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Preferred Location</label>
                  <input
                    className="tool-field-input"
                    value={form.location}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, location: e.target.value }))
                    }
                    placeholder="e.g. SG Highway, Ahmedabad"
                    data-ocid="commercial.location_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Intended Usage</label>
                  <select
                    className="tool-field-input"
                    value={form.usage}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, usage: e.target.value }))
                    }
                    data-ocid="commercial.usage_select"
                  >
                    <option value="">Select type</option>
                    <option>Office Space</option>
                    <option>Retail / Showroom</option>
                    <option>Warehouse</option>
                    <option>Mixed Use</option>
                  </select>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Additional Notes</label>
                  <textarea
                    className="tool-field-input"
                    rows={3}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="Specific requirements..."
                    data-ocid="commercial.message_textarea"
                  />
                </div>
                <IndemnityForm checked={indemnity} onChange={setIndemnity} />
                <button
                  type="submit"
                  disabled={!indemnity}
                  className="platform-button w-full"
                  data-ocid="commercial.submit_button"
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
