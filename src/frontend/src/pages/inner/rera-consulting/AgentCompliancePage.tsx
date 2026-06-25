import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { CheckCircle2, Shield } from "lucide-react";
import { useState } from "react";

export default function AgentCompliancePage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    reraNo: "",
    city: "",
    message: "",
  });
  const [indemnity, setIndemnity] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <InnerPageLayout
      serviceSlug="rera-consulting"
      serviceName="RERA & PR Consulting"
      innerPageTitle="Agent Compliance"
      innerPageSubtitle="RERA agent registration and ongoing compliance management for real estate agents in Gujarat."
    >
      {/* Hero Banner */}
      <div
        className="mb-10 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop"
          alt="Agent Compliance"
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
              <Shield size={18} style={{ color: "oklch(var(--primary))" }} />
            </div>
            <span
              className="font-sans text-xs tracking-widest uppercase"
              style={{ color: "oklch(var(--primary))" }}
            >
              Agent Registration
            </span>
          </div>
          <h2
            className="font-serif text-2xl font-bold mb-4"
            style={{ color: "oklch(var(--foreground))" }}
          >
            Stay Compliant. Stay Trusted.
          </h2>
          <div className="section-divider w-16 mb-6" />
          <p
            className="font-sans text-sm leading-relaxed mb-4"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            All real estate agents operating in Gujarat must be registered with
            GujRERA. MSTC GLOBAL simplifies this process and ensures you meet
            all ongoing compliance requirements.
          </p>
          <ul className="space-y-2">
            {[
              "RERA agent application filing",
              "Document collection & verification",
              "Compliance audit support",
              "Annual renewal management",
              "Grievance redressal assistance",
              "Training & certification guidance",
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
        <div className="tool-card">
          <div className="tool-card-title">Agent Compliance Request</div>
          <div className="tool-card-description">
            Submit your details and we will guide you through GujRERA agent
            registration and compliance.
          </div>
          {submitted ? (
            <div className="text-center py-6" data-ocid="agent.success_state">
              <CheckCircle2
                size={36}
                className="mx-auto mb-3"
                style={{ color: "oklch(var(--primary))" }}
              />
              <p
                className="font-sans font-semibold"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Request Received!
              </p>
              <p
                className="font-sans text-sm mt-1"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Our compliance team will contact you. Call +91 9512609016.
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
                    placeholder="Agent name"
                    data-ocid="agent.name_input"
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
                    data-ocid="agent.phone_input"
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
                  data-ocid="agent.email_input"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label">
                  Existing RERA Number (if any)
                </label>
                <input
                  className="tool-field-input"
                  value={form.reraNo}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, reraNo: e.target.value }))
                  }
                  placeholder="RERA/A/GJ/.."
                  data-ocid="agent.rera_input"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label">City of Operation</label>
                <input
                  className="tool-field-input"
                  value={form.city}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, city: e.target.value }))
                  }
                  placeholder="e.g. Ahmedabad"
                  data-ocid="agent.city_input"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Query / Notes</label>
                <textarea
                  className="tool-field-input"
                  rows={3}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  placeholder="Describe your compliance need..."
                  data-ocid="agent.notes_textarea"
                />
              </div>
              <IndemnityForm checked={indemnity} onChange={setIndemnity} />
              <button
                type="submit"
                disabled={!indemnity}
                className="platform-button w-full"
                data-ocid="agent.submit_button"
                style={{ opacity: indemnity ? 1 : 0.5 }}
              >
                Submit Request
              </button>
            </form>
          )}
        </div>
      </div>
    </InnerPageLayout>
  );
}
