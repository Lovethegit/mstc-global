import { createActor } from "@/backend";
import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { useActor } from "@caffeineai/core-infrastructure";
import { Calculator, CalendarDays, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const EVENT_TYPES = [
  "Wedding",
  "Reception",
  "Engagement",
  "Birthday",
  "Corporate Meeting",
  "Conference",
  "Exhibition",
  "Other",
];

// Budget calculation helpers
const BASE_VENUE_RATE = 100; // ₹ per guest
const EVENT_MULTIPLIERS: Record<string, number> = {
  Wedding: 2.5,
  Reception: 2.0,
  Engagement: 1.8,
  Birthday: 1.2,
  "Corporate Meeting": 1.0,
  Conference: 1.2,
  Exhibition: 1.5,
  Other: 1.0,
};
const DURATION_MULTIPLIERS: Record<string, number> = {
  "4 hours": 1.0,
  "Half Day": 1.4,
  "Full Day": 2.0,
  "2 Days": 3.5,
  "3 Days": 5.0,
};
const DECORATION_COST: Record<string, number> = {
  Basic: 15000,
  Standard: 35000,
  Premium: 80000,
  Custom: 150000,
};

export default function VenueBookingPage() {
  const { actor } = useActor(createActor);

  // Estimator state
  const [estEventType, setEstEventType] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [duration, setDuration] = useState("");
  const [catering, setCatering] = useState(false);
  const [avEquip, setAvEquip] = useState(false);
  const [decoration, setDecoration] = useState("");
  const [estimate, setEstimate] = useState<{
    low: number;
    high: number;
  } | null>(null);

  // Form state
  const [form, setForm] = useState({
    contactName: "",
    phone: "",
    email: "",
    eventType: "",
    eventDate: "",
    guests: "",
    venuePreference: "",
    locationPreference: "",
    cuisinePreference: "",
    specialRequirements: "",
  });
  const [indemnity, setIndemnity] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const calculateEstimate = () => {
    const guests = Number.parseInt(guestCount) || 0;
    if (!guests || !estEventType || !duration) return;
    const eventMult = EVENT_MULTIPLIERS[estEventType] || 1.0;
    const durMult = DURATION_MULTIPLIERS[duration] || 1.0;
    const baseVenue = guests * BASE_VENUE_RATE * eventMult * durMult;
    const cateringCost = catering ? guests * 800 : 0;
    const avCost = avEquip ? 25000 : 0;
    const decorCost = decoration ? DECORATION_COST[decoration] || 0 : 0;
    const total = baseVenue + cateringCost + avCost + decorCost;
    setEstimate({
      low: Math.round(total * 0.85),
      high: Math.round(total * 1.2),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!indemnity || submitting) return;
    setSubmitting(true);
    const fields: Array<[string, string]> = [
      ["Event Type", form.eventType],
      ["Event Date", form.eventDate],
      ["Guest Count", form.guests],
      ["Venue Preference", form.venuePreference],
      ["Location Preference", form.locationPreference],
      ["Cuisine Preference", form.cuisinePreference],
      ["Special Requirements", form.specialRequirements],
    ];
    try {
      if (actor) {
        await actor.logServiceSubmission(
          "hospitality",
          "Venue Booking",
          "VenueForm",
          fields,
          form.contactName,
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
      innerPageTitle="Venue Booking"
      innerPageSubtitle="Curated venue solutions for weddings, corporate functions, and social gatherings across Ahmedabad's finest properties."
    >
      {/* Hero Banner */}
      <div
        className="mb-10 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=400&fit=crop"
          alt="Venue Booking"
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
            <CalendarDays
              size={18}
              style={{ color: "oklch(var(--primary))" }}
            />
          </div>
          <span
            className="font-sans text-xs tracking-widest uppercase"
            style={{ color: "oklch(var(--primary))" }}
          >
            Venue Booking Services
          </span>
        </div>
        <h2
          className="font-serif text-2xl font-bold mb-3"
          style={{ color: "oklch(var(--foreground))" }}
        >
          The Perfect Setting for Every Occasion
        </h2>
        <div className="section-divider w-16 mb-5" />
        <p
          className="font-sans text-sm leading-relaxed mb-3"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          MSTC GLOBAL facilitates venue booking across Ahmedabad's premium event
          spaces — from 5-star hotel ballrooms and luxury banquet halls to
          charming farmhouses, rooftop terraces, and open lawns. We maintain
          relationships with over 50 top venues in Ahmedabad and surrounding
          areas.
        </p>
        <p
          className="font-sans text-sm leading-relaxed mb-3"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Gujarat's rich celebration culture calls for venues that match the
          grandeur of the occasion. Our venue specialists personally inspect and
          vet every property on our curated list for ambience, catering
          capabilities, AV infrastructure, parking, and compliance with
          municipal regulations.
        </p>
        <p
          className="font-sans text-sm leading-relaxed"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Use the Budget Estimator to get an indicative cost range, then submit
          your event details and we will propose venue options within 24 hours.
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
              Event Budget Estimator
            </div>
            <div className="tool-card-description">
              Select your event details for an indicative venue cost estimate.
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="tool-field">
                <label className="tool-field-label">Event Type</label>
                <select
                  className="tool-field-input"
                  value={estEventType}
                  onChange={(e) => setEstEventType(e.target.value)}
                  data-ocid="venue.est_event_type_select"
                >
                  <option value="">Select</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Guest Count</label>
                <select
                  className="tool-field-input"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  data-ocid="venue.est_guests_select"
                >
                  <option value="">Select</option>
                  {["50", "100", "200", "300", "500", "750", "1000+"].map(
                    (g) => (
                      <option key={g}>{g}</option>
                    ),
                  )}
                </select>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Duration</label>
                <select
                  className="tool-field-input"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  data-ocid="venue.est_duration_select"
                >
                  <option value="">Select</option>
                  {["4 hours", "Half Day", "Full Day", "2 Days", "3 Days"].map(
                    (d) => (
                      <option key={d}>{d}</option>
                    ),
                  )}
                </select>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Decoration Package</label>
                <select
                  className="tool-field-input"
                  value={decoration}
                  onChange={(e) => setDecoration(e.target.value)}
                  data-ocid="venue.est_decor_select"
                >
                  <option value="">None</option>
                  <option>Basic</option>
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>Custom</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  className="w-4 h-4 rounded flex items-center justify-center"
                  style={{
                    background: catering
                      ? "oklch(var(--primary))"
                      : "oklch(var(--input))",
                    border: `1px solid ${catering ? "oklch(var(--primary))" : "oklch(var(--border))"}`,
                  }}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={catering}
                    onChange={(e) => setCatering(e.target.checked)}
                    data-ocid="venue.est_catering_checkbox"
                  />
                  {catering && (
                    <svg
                      width="9"
                      height="9"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
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
                  style={{ color: "oklch(var(--foreground))" }}
                >
                  Include Catering
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  className="w-4 h-4 rounded flex items-center justify-center"
                  style={{
                    background: avEquip
                      ? "oklch(var(--primary))"
                      : "oklch(var(--input))",
                    border: `1px solid ${avEquip ? "oklch(var(--primary))" : "oklch(var(--border))"}`,
                  }}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={avEquip}
                    onChange={(e) => setAvEquip(e.target.checked)}
                    data-ocid="venue.est_av_checkbox"
                  />
                  {avEquip && (
                    <svg
                      width="9"
                      height="9"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
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
                  style={{ color: "oklch(var(--foreground))" }}
                >
                  AV Equipment
                </span>
              </label>
            </div>
            <button
              type="button"
              onClick={calculateEstimate}
              className="platform-button w-full mt-3"
              data-ocid="venue.estimate_button"
            >
              Estimate Budget
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
                  Estimated Venue Budget
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
                  * Indicative estimate. Actual cost depends on specific venue
                  selection and negotiated rates.
                </p>
              </div>
            )}
          </div>

          <div className="tool-card">
            <div className="tool-card-title">Our Venue Services</div>
            <ul className="space-y-2 mt-1">
              {[
                "Curated shortlist of 3-5 venues per requirement",
                "Site visits and venue inspections",
                "Price negotiation with venue management",
                "Catering & vendor coordination",
                "Décor & florist tie-ups",
                "Legal contract review for venue bookings",
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
          <div className="tool-card-title">Venue Booking Enquiry</div>
          <div className="tool-card-description">
            Share your event details and our hospitality team will propose
            curated venue options within 24 hours.
          </div>
          {submitted ? (
            <div className="text-center py-8" data-ocid="venue.success_state">
              <CheckCircle2
                size={40}
                className="mx-auto mb-3"
                style={{ color: "oklch(var(--primary))" }}
              />
              <p
                className="font-serif text-lg font-bold mb-1"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Enquiry Received!
              </p>
              <p
                className="font-sans text-sm"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Our events team will contact you within 24 hours.
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
                  <label className="tool-field-label">Contact Name *</label>
                  <input
                    className="tool-field-input"
                    required
                    value={form.contactName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, contactName: e.target.value }))
                    }
                    placeholder="Your full name"
                    data-ocid="venue.name_input"
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
                    data-ocid="venue.phone_input"
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
                  data-ocid="venue.email_input"
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
                    data-ocid="venue.event_type_select"
                  >
                    <option value="">Select event</option>
                    {EVENT_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Event Date</label>
                  <input
                    className="tool-field-input"
                    type="date"
                    value={form.eventDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, eventDate: e.target.value }))
                    }
                    data-ocid="venue.date_input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">Guest Count</label>
                  <input
                    className="tool-field-input"
                    type="number"
                    value={form.guests}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, guests: e.target.value }))
                    }
                    placeholder="e.g. 250"
                    data-ocid="venue.guests_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Venue Preference</label>
                  <select
                    className="tool-field-input"
                    value={form.venuePreference}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        venuePreference: e.target.value,
                      }))
                    }
                    data-ocid="venue.preference_select"
                  >
                    <option value="">Select type</option>
                    <option>5-Star Hotel</option>
                    <option>Banquet Hall</option>
                    <option>Farm House</option>
                    <option>Open Lawn</option>
                    <option>Terrace</option>
                    <option>Not Decided</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">
                    Location Preference
                  </label>
                  <select
                    className="tool-field-input"
                    value={form.locationPreference}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        locationPreference: e.target.value,
                      }))
                    }
                    data-ocid="venue.location_select"
                  >
                    <option value="">Any location</option>
                    <option>Ahmedabad West</option>
                    <option>Ahmedabad East</option>
                    <option>Central Ahmedabad</option>
                    <option>Outskirts</option>
                  </select>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Cuisine Preference</label>
                  <select
                    className="tool-field-input"
                    value={form.cuisinePreference}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        cuisinePreference: e.target.value,
                      }))
                    }
                    data-ocid="venue.cuisine_select"
                  >
                    <option value="">Select</option>
                    <option>Pure Vegetarian</option>
                    <option>Vegetarian with Jain option</option>
                    <option>Multi-cuisine</option>
                  </select>
                </div>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Special Requirements</label>
                <textarea
                  className="tool-field-input"
                  rows={3}
                  value={form.specialRequirements}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      specialRequirements: e.target.value,
                    }))
                  }
                  placeholder="Theme, special décor, accessibility needs, parking requirements..."
                  data-ocid="venue.requirements_textarea"
                />
              </div>
              <IndemnityForm checked={indemnity} onChange={setIndemnity} />
              <button
                type="submit"
                disabled={!indemnity || submitting}
                className="platform-button w-full"
                data-ocid="venue.submit_button"
                style={{ opacity: indemnity && !submitting ? 1 : 0.5 }}
              >
                {submitting ? "Submitting..." : "Submit Venue Enquiry"}
              </button>
            </form>
          )}
        </div>
      </div>
    </InnerPageLayout>
  );
}
