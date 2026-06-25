import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { CheckCircle2, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function EquityFundingPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    fundingAmount: "",
    stage: "",
    sector: "",
    message: "",
  });
  const [indemnity, setIndemnity] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <InnerPageLayout
      serviceSlug="finance"
      serviceName="Finance & Investment"
      innerPageTitle="Equity Funding"
      innerPageSubtitle="Angel, venture, and private equity connections for startups and growth-stage businesses."
    >
      {/* Hero Banner */}
      <div
        className="mb-10 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=400&fit=crop"
          alt="Equity Funding"
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
              <TrendingUp
                size={18}
                style={{ color: "oklch(var(--primary))" }}
              />
            </div>
            <span
              className="font-sans text-xs tracking-widest uppercase"
              style={{ color: "oklch(var(--primary))" }}
            >
              Investment Facilitation
            </span>
          </div>
          <h2
            className="font-serif text-2xl font-bold mb-4"
            style={{ color: "oklch(var(--foreground))" }}
          >
            Capital for Your Vision
          </h2>
          <div className="section-divider w-16 mb-6" />
          <p
            className="font-sans text-sm leading-relaxed mb-4"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            MSTC GLOBAL connects promising businesses with the right investors —
            from angel networks to private equity firms. We facilitate
            introductions, pitch preparation, and deal structuring.
          </p>
          <ul className="space-y-2">
            {[
              "Angel investor introductions",
              "Venture capital facilitation",
              "Private equity connections",
              "Pitch deck advisory",
              "Deal structuring support",
              "Investment agreement guidance",
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
          <div className="tool-card-title">Funding Enquiry</div>
          <div className="tool-card-description">
            Tell us about your business and funding needs and we will connect
            you with suitable investors.
          </div>
          {submitted ? (
            <div className="text-center py-6" data-ocid="equity.success_state">
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
                Our investment team will contact you. Call +91 9512609016.
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
                    data-ocid="equity.name_input"
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
                    data-ocid="equity.phone_input"
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
                  data-ocid="equity.email_input"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label">
                  Funding Amount Sought
                </label>
                <input
                  className="tool-field-input"
                  value={form.fundingAmount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fundingAmount: e.target.value }))
                  }
                  placeholder="e.g. ₹50 Lakhs"
                  data-ocid="equity.amount_input"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">Business Stage</label>
                  <select
                    className="tool-field-input"
                    value={form.stage}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, stage: e.target.value }))
                    }
                    data-ocid="equity.stage_select"
                  >
                    <option value="">Select</option>
                    <option>Idea</option>
                    <option>MVP / Early</option>
                    <option>Revenue Stage</option>
                    <option>Growth Stage</option>
                  </select>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Sector</label>
                  <select
                    className="tool-field-input"
                    value={form.sector}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, sector: e.target.value }))
                    }
                    data-ocid="equity.sector_select"
                  >
                    <option value="">Select</option>
                    <option>Real Estate</option>
                    <option>Tech</option>
                    <option>FMCG</option>
                    <option>Healthcare</option>
                    <option>Media</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Business Summary</label>
                <textarea
                  className="tool-field-input"
                  rows={3}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  placeholder="Brief description of your business and how funds will be used..."
                  data-ocid="equity.notes_textarea"
                />
              </div>
              <IndemnityForm checked={indemnity} onChange={setIndemnity} />
              <button
                type="submit"
                disabled={!indemnity}
                className="platform-button w-full"
                data-ocid="equity.submit_button"
                style={{ opacity: indemnity ? 1 : 0.5 }}
              >
                Submit Funding Enquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </InnerPageLayout>
  );
}
