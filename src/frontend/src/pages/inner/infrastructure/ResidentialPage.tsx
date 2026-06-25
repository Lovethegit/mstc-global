import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { Building2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function ResidentialPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    plotSize: "",
    location: "",
    budget: "",
    type: "apartment",
    message: "",
  });
  const [indemnity, setIndemnity] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!indemnity) return;
    setSubmitted(true);
  };

  return (
    <InnerPageLayout
      serviceSlug="infrastructure"
      serviceName="Infrastructure & Property"
      innerPageTitle="Residential Development"
      innerPageSubtitle="From apartments to townships — premium residential infrastructure solutions across Ahmedabad and Gujarat."
    >
      {/* Hero Banner */}
      <div
        className="mb-10 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=400&fit=crop"
          alt="Residential Development"
          className="w-full h-56 md:h-72 object-cover"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* About */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-sm flex items-center justify-center"
              style={{
                background: "oklch(var(--primary) / 0.15)",
                border: "1px solid oklch(var(--primary) / 0.3)",
              }}
            >
              <Building2 size={18} style={{ color: "oklch(var(--primary))" }} />
            </div>
            <span
              className="font-sans text-xs tracking-widest uppercase"
              style={{ color: "oklch(var(--primary))" }}
            >
              Residential Projects
            </span>
          </div>
          <h2
            className="font-serif text-2xl font-bold mb-4"
            style={{ color: "oklch(var(--foreground))" }}
          >
            Quality Homes for Every Aspiration
          </h2>
          <div className="section-divider w-16 mb-6" />
          <p
            className="font-sans text-sm leading-relaxed mb-4"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            MSTC GLOBAL facilitates premium residential developments — from
            affordable housing to luxury villas. We partner with leading
            developers across Ahmedabad and Gujarat to offer curated residential
            opportunities.
          </p>
          <p
            className="font-sans text-sm leading-relaxed mb-6"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            Our residential services cover project feasibility, buyer
            representation, legal due diligence, and post-purchase support.
          </p>
          <ul className="space-y-2">
            {[
              "Apartment & flat sourcing",
              "Villa & bungalow projects",
              "Township development",
              "RERA-compliant properties",
              "Home loan facilitation",
              "Legal documentation support",
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

        {/* Project Feasibility Form + Contact Form */}
        <div className="space-y-6">
          {/* Project Feasibility Tool */}
          <div className="tool-card">
            <div className="tool-card-title">Project Feasibility Enquiry</div>
            <div className="tool-card-description">
              Share your requirements and we will assess suitability and connect
              you with the right project.
            </div>
            {submitted ? (
              <div
                className="text-center py-6"
                data-ocid="residential.success_state"
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
                  We will contact you within 24 hours. For urgent queries call
                  +91 9512609016.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="tool-field">
                    <label className="tool-field-label">Full Name *</label>
                    <input
                      className="tool-field-input"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="Your name"
                      data-ocid="residential.name_input"
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
                      data-ocid="residential.phone_input"
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
                    data-ocid="residential.email_input"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="tool-field">
                    <label className="tool-field-label">Plot / Area Size</label>
                    <input
                      className="tool-field-input"
                      value={form.plotSize}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, plotSize: e.target.value }))
                      }
                      placeholder="e.g. 1200 sq ft"
                      data-ocid="residential.plot_size_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Preferred Location
                    </label>
                    <input
                      className="tool-field-input"
                      value={form.location}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, location: e.target.value }))
                      }
                      placeholder="e.g. Bopal, Ahmedabad"
                      data-ocid="residential.location_input"
                    />
                  </div>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Budget Range</label>
                  <select
                    className="tool-field-input"
                    value={form.budget}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, budget: e.target.value }))
                    }
                    data-ocid="residential.budget_select"
                  >
                    <option value="">Select budget</option>
                    <option>Under ₹30 Lakh</option>
                    <option>₹30L – ₹60L</option>
                    <option>₹60L – ₹1 Crore</option>
                    <option>₹1Cr – ₹2Cr</option>
                    <option>Above ₹2 Crore</option>
                  </select>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Message</label>
                  <textarea
                    className="tool-field-input"
                    rows={3}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="Any specific requirements..."
                    data-ocid="residential.message_textarea"
                  />
                </div>
                <IndemnityForm checked={indemnity} onChange={setIndemnity} />
                <button
                  type="submit"
                  disabled={!indemnity}
                  className="platform-button w-full"
                  data-ocid="residential.submit_button"
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
