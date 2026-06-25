import { createActor } from "@/backend";
import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { useActor } from "@caffeineai/core-infrastructure";
import { Calculator, CheckCircle2, Presentation } from "lucide-react";
import { useState } from "react";

const EVENT_TYPES = [
  "Conference",
  "Product Launch",
  "Annual Dinner",
  "Team Outing",
  "Awards Night",
  "Training",
  "Other",
];

// Per-head rates (₹) by catering level
const CATERING_RATES: Record<string, number> = {
  "Tea-Coffee": 200,
  Lunch: 700,
  "Full Dinner": 1200,
  "Multi-Meal": 2000,
};

// AV package rates
const AV_RATES: Record<string, number> = {
  Basic: 15000,
  Standard: 35000,
  Premium: 75000,
};

// Duration multipliers
const DUR_MULT: Record<string, number> = {
  "Half Day": 1.0,
  "Full Day": 1.7,
  "2 Days": 3.0,
  "3 Days": 4.5,
};

export default function CorporateEventsPage() {
  const { actor } = useActor(createActor);

  // Estimator state
  const [estEventType, setEstEventType] = useState("");
  const [estAttendees, setEstAttendees] = useState("");
  const [estDuration, setEstDuration] = useState("");
  const [estAv, setEstAv] = useState("");
  const [estCatering, setEstCatering] = useState("");
  const [estimate, setEstimate] = useState<{
    low: number;
    high: number;
  } | null>(null);

  // Form state
  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    designation: "",
    phone: "",
    email: "",
    eventType: "",
    attendees: "",
    preferredDate: "",
    venueType: "",
    themeBranding: "",
    guestHospitality: "",
    specialRequests: "",
  });
  const [indemnity, setIndemnity] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getQuote = () => {
    const att = Number.parseInt(estAttendees) || 0;
    if (!att || !estDuration) return;
    const durMult = DUR_MULT[estDuration] || 1.0;
    const venueBase = att * 500 * durMult; // ₹500/head venue base
    const cateringCost = estCatering
      ? (CATERING_RATES[estCatering] || 0) * att * (durMult > 1.5 ? 2 : 1)
      : 0;
    const avCost = estAv ? AV_RATES[estAv] || 0 : 0;
    const total = venueBase + cateringCost + avCost;
    setEstimate({
      low: Math.round(total * 0.85),
      high: Math.round(total * 1.25),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!indemnity || submitting) return;
    setSubmitting(true);
    const fields: Array<[string, string]> = [
      ["Company Name", form.companyName],
      ["Designation", form.designation],
      ["Event Type", form.eventType],
      ["Number of Attendees", form.attendees],
      ["Preferred Date", form.preferredDate],
      ["Venue Type", form.venueType],
      ["Theme/Branding Required", form.themeBranding],
      ["Guest Hospitality", form.guestHospitality],
      ["Special Requests", form.specialRequests],
    ];
    try {
      if (actor) {
        await actor.logServiceSubmission(
          "hospitality",
          "Corporate Events",
          "CorporateEventForm",
          fields,
          form.contactPerson,
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
      serviceSlug="hospitality-events"
      serviceName="Hospitality & Events"
      innerPageTitle="Corporate Events"
      innerPageSubtitle="End-to-end corporate event management — conferences, product launches, team outings, annual dinners, and awards ceremonies."
    >
      {/* Hero Banner */}
      <div
        className="mb-8 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=400&fit=crop"
          alt="Corporate Events"
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
            <Presentation
              size={18}
              style={{ color: "oklch(var(--primary))" }}
            />
          </div>
          <span
            className="font-sans text-xs tracking-widest uppercase"
            style={{ color: "oklch(var(--primary))" }}
          >
            Corporate Event Management
          </span>
        </div>
        <h2
          className="font-serif text-2xl font-bold mb-3"
          style={{ color: "oklch(var(--foreground))" }}
        >
          Professional Events, Flawlessly Executed
        </h2>
        <div className="section-divider w-16 mb-5" />
        <p
          className="font-sans text-sm leading-relaxed mb-3"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          MSTC GLOBAL manages corporate events of all scales for businesses
          across Ahmedabad and Gujarat. From intimate boardroom conferences to
          large-scale product launches and black-tie annual dinners, our
          corporate events division handles every detail — venue, AV production,
          catering, logistics, and guest management.
        </p>
        <p
          className="font-sans text-sm leading-relaxed mb-3"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Ahmedabad's corporate scene has grown rapidly, with the city now
          hosting major national conferences, industry summits, and
          multinational product launches. Our team has deep relationships with
          the city's leading hotels, convention centres, and event technology
          vendors, enabling us to deliver world-class events at competitive
          prices.
        </p>
        <p
          className="font-sans text-sm leading-relaxed"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Use the Budget Estimator below to get an indicative cost range for
          your corporate event, then submit your requirements for a detailed
          proposal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT: Estimator + Offerings */}
        <div className="space-y-6">
          <div className="tool-card">
            <div className="tool-card-title">
              <Calculator
                size={16}
                className="inline mr-2"
                style={{ color: "oklch(var(--primary))" }}
              />
              Corporate Event Cost Estimator
            </div>
            <div className="tool-card-description">
              Input your event parameters to get an indicative budget range.
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="tool-field">
                <label className="tool-field-label">Event Type</label>
                <select
                  className="tool-field-input"
                  value={estEventType}
                  onChange={(e) => setEstEventType(e.target.value)}
                  data-ocid="corp.est_type_select"
                >
                  <option value="">Select</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Attendees</label>
                <input
                  className="tool-field-input"
                  type="number"
                  min="10"
                  value={estAttendees}
                  onChange={(e) => setEstAttendees(e.target.value)}
                  placeholder="e.g. 200"
                  data-ocid="corp.est_attendees_input"
                />
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Duration</label>
                <select
                  className="tool-field-input"
                  value={estDuration}
                  onChange={(e) => setEstDuration(e.target.value)}
                  data-ocid="corp.est_duration_select"
                >
                  <option value="">Select</option>
                  <option>Half Day</option>
                  <option>Full Day</option>
                  <option>2 Days</option>
                  <option>3 Days</option>
                </select>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">AV Package</label>
                <select
                  className="tool-field-input"
                  value={estAv}
                  onChange={(e) => setEstAv(e.target.value)}
                  data-ocid="corp.est_av_select"
                >
                  <option value="">None</option>
                  <option>Basic</option>
                  <option>Standard</option>
                  <option>Premium</option>
                </select>
              </div>
              <div className="tool-field col-span-2">
                <label className="tool-field-label">Catering Level</label>
                <select
                  className="tool-field-input"
                  value={estCatering}
                  onChange={(e) => setEstCatering(e.target.value)}
                  data-ocid="corp.est_catering_select"
                >
                  <option value="">No Catering</option>
                  <option>Tea-Coffee</option>
                  <option>Lunch</option>
                  <option>Full Dinner</option>
                  <option>Multi-Meal</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={getQuote}
              className="platform-button w-full mt-2"
              data-ocid="corp.get_quote_button"
            >
              Get Corporate Quote
            </button>
            {estimate && (
              <div
                className="mt-4 p-4 rounded-sm text-center"
                style={{
                  background: "oklch(var(--primary) / 0.08)",
                  border: "1px solid oklch(var(--primary) / 0.25)",
                }}
              >
                <p
                  className="font-sans text-xs mb-1"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  Estimated Event Budget
                </p>
                <p
                  className="font-serif text-2xl font-bold"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  ₹{estimate.low.toLocaleString("en-IN")} – ₹
                  {estimate.high.toLocaleString("en-IN")}
                </p>
                <p
                  className="font-sans text-xs mt-1"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  * Indicative estimate. Final quote depends on venue selection
                  and specific vendor rates.
                </p>
              </div>
            )}
          </div>

          <div className="tool-card">
            <div className="tool-card-title">Our Corporate Event Services</div>
            <ul className="space-y-2 mt-1">
              {[
                "Venue sourcing & negotiation",
                "Full AV & technical production",
                "Catering management & menu planning",
                "Guest registration & logistics",
                "Branding, collateral & print management",
                "Post-event reporting & analytics",
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
          <div className="tool-card-title">Corporate Event Request</div>
          <div className="tool-card-description">
            Share your event requirements and our corporate events team will
            create a detailed, customised proposal.
          </div>
          {submitted ? (
            <div className="text-center py-8" data-ocid="corp.success_state">
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
                Our corporate events team will contact you within 24 hours.
              </p>
              <p
                className="font-sans text-sm mt-2 font-semibold"
                style={{ color: "oklch(var(--primary))" }}
              >
                Urgent? Call +91 9512609016
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">Company Name *</label>
                  <input
                    className="tool-field-input"
                    required
                    value={form.companyName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, companyName: e.target.value }))
                    }
                    placeholder="Your organisation"
                    data-ocid="corp.company_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Contact Person *</label>
                  <input
                    className="tool-field-input"
                    required
                    value={form.contactPerson}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, contactPerson: e.target.value }))
                    }
                    placeholder="Full name"
                    data-ocid="corp.contact_input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">Designation</label>
                  <input
                    className="tool-field-input"
                    value={form.designation}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, designation: e.target.value }))
                    }
                    placeholder="e.g. HR Manager"
                    data-ocid="corp.designation_input"
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
                    data-ocid="corp.phone_input"
                  />
                </div>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Email *</label>
                <input
                  className="tool-field-input"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="corporate@company.com"
                  data-ocid="corp.email_input"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">Event Type</label>
                  <select
                    className="tool-field-input"
                    value={form.eventType}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, eventType: e.target.value }))
                    }
                    data-ocid="corp.type_select"
                  >
                    <option value="">Select</option>
                    {EVENT_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">
                    Number of Attendees
                  </label>
                  <input
                    className="tool-field-input"
                    type="number"
                    value={form.attendees}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, attendees: e.target.value }))
                    }
                    placeholder="e.g. 150"
                    data-ocid="corp.attendees_input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">
                    Preferred Date / Week
                  </label>
                  <input
                    className="tool-field-input"
                    type="date"
                    value={form.preferredDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, preferredDate: e.target.value }))
                    }
                    data-ocid="corp.date_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Venue Type</label>
                  <select
                    className="tool-field-input"
                    value={form.venueType}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, venueType: e.target.value }))
                    }
                    data-ocid="corp.venue_select"
                  >
                    <option value="">Select</option>
                    <option>Hotel Conference Room</option>
                    <option>Dedicated Convention Centre</option>
                    <option>Office Premises</option>
                    <option>Outdoor</option>
                    <option>Flexible</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">
                    Theme/Branding Required
                  </label>
                  <select
                    className="tool-field-input"
                    value={form.themeBranding}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, themeBranding: e.target.value }))
                    }
                    data-ocid="corp.theme_select"
                  >
                    <option value="">Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">
                    Guest Hospitality (Travel/Stay)
                  </label>
                  <select
                    className="tool-field-input"
                    value={form.guestHospitality}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        guestHospitality: e.target.value,
                      }))
                    }
                    data-ocid="corp.hospitality_select"
                  >
                    <option value="">Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Special Requests</label>
                <textarea
                  className="tool-field-input"
                  rows={3}
                  value={form.specialRequests}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, specialRequests: e.target.value }))
                  }
                  placeholder="Theme, specific AV needs, dietary requirements, accessibility..."
                  data-ocid="corp.requests_textarea"
                />
              </div>
              <IndemnityForm checked={indemnity} onChange={setIndemnity} />
              <button
                type="submit"
                disabled={!indemnity || submitting}
                className="platform-button w-full"
                data-ocid="corp.submit_button"
                style={{ opacity: indemnity && !submitting ? 1 : 0.5 }}
              >
                {submitting ? "Submitting..." : "Request Event Proposal"}
              </button>
            </form>
          )}
        </div>
      </div>
    </InnerPageLayout>
  );
}
