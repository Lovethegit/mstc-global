import { createActor } from "@/backend";
import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, MapPin } from "lucide-react";
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

const STEPS = [
  { id: 1, label: "Destination", desc: "Where to?" },
  { id: 2, label: "Dates & Budget", desc: "When & how much?" },
  { id: 3, label: "Preferences", desc: "Your style" },
  { id: 4, label: "Confirm", desc: "Review & submit" },
];

const POPULAR_DESTINATIONS = [
  "Somnath",
  "Gir National Park",
  "Rann of Kutch",
  "Dwarka",
  "Vadodara",
  "Saputara",
  "Ahmedabad Heritage",
];

const SPECIAL_NEEDS = [
  "Vegetarian",
  "Jain Food",
  "Wheelchair Access",
  "Child-friendly",
  "Senior-friendly",
];

export default function TravelItinerariesPage() {
  const submitMutation = useLogServiceSubmission();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [indemnity, setIndemnity] = useState(false);
  const [form, setForm] = useState({
    destination: "",
    destinationType: "",
    tripType: "",
    departureDate: "",
    returnDate: "",
    flexibleDates: false,
    budget: "",
    groupSize: "2",
    travelStyle: "",
    specialNeeds: [] as string[],
    fullName: "",
    phone: "",
    email: "",
    specialRequests: "",
  });

  function toggleNeed(need: string) {
    setForm((f) => ({
      ...f,
      specialNeeds: f.specialNeeds.includes(need)
        ? f.specialNeeds.filter((n) => n !== need)
        : [...f.specialNeeds, need],
    }));
  }

  function calcDuration() {
    if (!form.departureDate || !form.returnDate) return null;
    const diff =
      (new Date(form.returnDate).getTime() -
        new Date(form.departureDate).getTime()) /
      (1000 * 60 * 60 * 24);
    if (diff <= 0) return null;
    return `${diff} day${diff !== 1 ? "s" : ""}`;
  }

  function budgetPerPerson() {
    const g = Number.parseInt(form.groupSize) || 1;
    const budgetMap: Record<string, number> = {
      "Under ₹5K": 5000,
      "₹5K–₹20K": 12500,
      "₹20K–₹50K": 35000,
      "₹50K–₹2L": 125000,
      "₹2L+": 250000,
    };
    const total = budgetMap[form.budget];
    if (!total || g < 1) return null;
    return `~₹${Math.round(total / g).toLocaleString("en-IN")} per person`;
  }

  const canNext = (s: number) => {
    if (s === 1) return !!form.destination;
    if (s === 2)
      return !!form.departureDate && !!form.returnDate && !!form.budget;
    if (s === 3) return !!form.travelStyle;
    return indemnity && !!form.fullName && !!form.phone;
  };

  function handleSubmit() {
    if (!indemnity || !form.fullName || !form.phone) return;
    const dur = calcDuration();
    const bpp = budgetPerPerson();
    const fields: Array<[string, string]> = [
      ["Destination", form.destination],
      ["Destination Type", form.destinationType],
      ["Domestic / International", form.tripType],
      ["Departure Date", form.departureDate],
      ["Return Date", form.returnDate],
      ["Duration", dur ?? "N/A"],
      ["Flexible Dates", form.flexibleDates ? "Yes" : "No"],
      ["Total Budget", form.budget],
      ["Budget Per Person", bpp ?? "N/A"],
      ["Group Size", form.groupSize],
      ["Travel Style", form.travelStyle],
      ["Special Needs", form.specialNeeds.join(", ")],
      ["Full Name", form.fullName],
      ["Phone", form.phone],
      ["Email", form.email],
      ["Special Requests", form.specialRequests],
    ];
    submitMutation.mutate(
      {
        serviceCategory: "media",
        innerPage: "Travel Itineraries",
        formType: "TripPlannerForm",
        fields,
        submitterName: form.fullName,
        submitterPhone: form.phone,
        submitterEmail: form.email,
        indemnityAccepted: indemnity,
      },
      { onSuccess: () => setSubmitted(true) },
    );
  }

  const dur = calcDuration();
  const bpp = budgetPerPerson();

  return (
    <InnerPageLayout
      serviceSlug="media-sports-tourism"
      serviceName="Media, Sports & Tourism"
      innerPageTitle="Travel Itineraries"
      innerPageSubtitle="Personalised travel planning across Gujarat, India, and beyond — curated by MSTC GLOBAL specialists."
    >
      {/* Hero Banner */}
      <div
        className="mb-10 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=400&fit=crop"
          alt="Travel Itineraries"
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
            <MapPin size={18} style={{ color: "oklch(var(--primary))" }} />
          </div>
          <span
            className="font-sans text-xs tracking-widest uppercase"
            style={{ color: "oklch(var(--primary))" }}
          >
            Travel Planning
          </span>
        </div>
        <h2
          className="font-serif text-2xl font-bold mb-3"
          style={{ color: "oklch(var(--foreground))" }}
        >
          Journeys Crafted for You
        </h2>
        <div className="section-divider w-16 mb-5" />
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm font-sans leading-relaxed"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          <p>
            Gujarat is one of India’s most diverse travel destinations — from
            the ethereal white desert of the Rann of Kutch to the UNESCO World
            Heritage streets of Ahmedabad, the ancient temples of Somnath and
            Dwarka, and the wildlife of Gir. MSTC GLOBAL curates experiences
            that go beyond tourism packages.
          </p>
          <p>
            Our travel specialists design personalised itineraries for
            pilgrimage circuits, heritage tours, wildlife expeditions, adventure
            trips, and corporate retreats. We arrange accommodation, transport,
            guides, and dining with a strong understanding of Gujarat’s culture
            and hospitality.
          </p>
          <p>
            Whether you’re planning a family holiday, a group pilgrimage, or an
            international corporate incentive trip, use our 4-step Trip Planner
            below to share your requirements. Our team will send you a detailed,
            curated itinerary within 48 hours.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Popular Destinations */}
        <div className="space-y-6">
          <div>
            <p
              className="font-sans text-sm font-semibold mb-3"
              style={{ color: "oklch(var(--foreground))" }}
            >
              Popular Gujarat Destinations
            </p>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_DESTINATIONS.map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, destination: dest }))}
                  className="text-left px-3 py-2 rounded-md font-sans text-xs transition-all"
                  style={{
                    background:
                      form.destination === dest
                        ? "oklch(var(--primary) / 0.15)"
                        : "oklch(var(--muted) / 0.4)",
                    border: `1px solid ${
                      form.destination === dest
                        ? "oklch(var(--primary) / 0.5)"
                        : "oklch(var(--border))"
                    }`,
                    color:
                      form.destination === dest
                        ? "oklch(var(--primary))"
                        : "oklch(var(--muted-foreground))",
                  }}
                  data-ocid={`travel.dest_${dest.toLowerCase().replace(/[^a-z]/g, "_")}`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p
              className="font-sans text-sm font-semibold mb-3"
              style={{ color: "oklch(var(--foreground))" }}
            >
              Key Services
            </p>
            <ul className="space-y-2">
              {[
                "Personalised itinerary planning",
                "Hotel & resort bookings",
                "Transport arrangements",
                "Heritage & cultural tours",
                "Religious pilgrimage circuits",
                "Corporate travel management",
                "Wildlife & adventure expeditions",
                "Group & family holiday packages",
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

        {/* Right: Trip Planner */}
        <div className="tool-card">
          <div className="tool-card-title">Trip Planner</div>

          {/* Step indicator */}
          <div className="flex items-center gap-1 mb-6">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1 flex-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0"
                  style={{
                    background:
                      step >= s.id
                        ? "oklch(var(--primary))"
                        : "oklch(var(--muted))",
                    color:
                      step >= s.id
                        ? "oklch(var(--primary-foreground))"
                        : "oklch(var(--muted-foreground))",
                  }}
                >
                  {s.id}
                </div>
                <span
                  className="font-sans text-xs hidden sm:block"
                  style={{
                    color:
                      step === s.id
                        ? "oklch(var(--primary))"
                        : "oklch(var(--muted-foreground))",
                  }}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-px mx-1"
                    style={{
                      background:
                        step > s.id
                          ? "oklch(var(--primary))"
                          : "oklch(var(--border))",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {submitted ? (
            <div className="text-center py-10" data-ocid="travel.success_state">
              <CheckCircle2
                size={44}
                className="mx-auto mb-3"
                style={{ color: "oklch(var(--primary))" }}
              />
              <p
                className="font-sans font-semibold text-lg"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Trip Request Submitted!
              </p>
              <p
                className="font-sans text-sm mt-2"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Our travel specialist will send you a curated itinerary within
                48 hours. For immediate assistance, call{" "}
                <strong>+91 9512609016</strong>.
              </p>
            </div>
          ) : (
            <>
              {/* Step 1: Destination */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="tool-field">
                    <label className="tool-field-label" htmlFor="tr-dest">
                      Primary Destination *
                    </label>
                    <input
                      id="tr-dest"
                      className="tool-field-input"
                      required
                      value={form.destination}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, destination: e.target.value }))
                      }
                      placeholder="e.g. Somnath, Kerala, Dubai"
                      data-ocid="travel.destination_input"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {POPULAR_DESTINATIONS.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() =>
                            setForm((f) => ({ ...f, destination: d }))
                          }
                          className="px-2 py-0.5 rounded font-sans text-xs transition-all"
                          style={{
                            background:
                              form.destination === d
                                ? "oklch(var(--primary) / 0.15)"
                                : "oklch(var(--muted) / 0.5)",
                            color:
                              form.destination === d
                                ? "oklch(var(--primary))"
                                : "oklch(var(--muted-foreground))",
                            border: `1px solid ${form.destination === d ? "oklch(var(--primary) / 0.4)" : "oklch(var(--border))"}`,
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="tool-field">
                      <label className="tool-field-label" htmlFor="tr-type">
                        Destination Type
                      </label>
                      <select
                        id="tr-type"
                        className="tool-field-input"
                        value={form.destinationType}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            destinationType: e.target.value,
                          }))
                        }
                        data-ocid="travel.dest_type_select"
                      >
                        <option value="">Select</option>
                        {[
                          "Religious",
                          "Adventure",
                          "Heritage",
                          "Wildlife",
                          "Beach",
                          "Mountain",
                          "City Tour",
                        ].map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="tool-field">
                      <label className="tool-field-label" htmlFor="tr-intl">
                        Domestic / International
                      </label>
                      <select
                        id="tr-intl"
                        className="tool-field-input"
                        value={form.tripType}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, tripType: e.target.value }))
                        }
                        data-ocid="travel.trip_type_select"
                      >
                        <option value="">Select</option>
                        <option>Domestic</option>
                        <option>International</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Dates & Budget */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="tool-field">
                      <label className="tool-field-label" htmlFor="tr-depart">
                        Departure Date *
                      </label>
                      <input
                        id="tr-depart"
                        className="tool-field-input"
                        type="date"
                        required
                        value={form.departureDate}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            departureDate: e.target.value,
                          }))
                        }
                        data-ocid="travel.from_date_input"
                      />
                    </div>
                    <div className="tool-field">
                      <label className="tool-field-label" htmlFor="tr-return">
                        Return Date *
                      </label>
                      <input
                        id="tr-return"
                        className="tool-field-input"
                        type="date"
                        required
                        value={form.returnDate}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, returnDate: e.target.value }))
                        }
                        data-ocid="travel.to_date_input"
                      />
                    </div>
                  </div>
                  {dur && (
                    <div
                      className="px-3 py-2 rounded-md font-sans text-sm"
                      style={{
                        background: "oklch(var(--primary) / 0.08)",
                        color: "oklch(var(--primary))",
                        border: "1px solid oklch(var(--primary) / 0.2)",
                      }}
                    >
                      Duration: <strong>{dur}</strong>
                    </div>
                  )}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.flexibleDates}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          flexibleDates: e.target.checked,
                        }))
                      }
                      style={{ accentColor: "oklch(var(--primary))" }}
                      data-ocid="travel.flexible_dates_checkbox"
                    />
                    <span
                      className="font-sans text-sm"
                      style={{ color: "oklch(var(--foreground))" }}
                    >
                      Flexible Dates
                    </span>
                  </label>
                  <div className="tool-field">
                    <label className="tool-field-label" htmlFor="tr-budget">
                      Total Budget *
                    </label>
                    <select
                      id="tr-budget"
                      className="tool-field-input"
                      required
                      value={form.budget}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, budget: e.target.value }))
                      }
                      data-ocid="travel.budget_select"
                    >
                      <option value="">Select</option>
                      <option>Under ₹5K</option>
                      <option>₹5K–₹20K</option>
                      <option>₹20K–₹50K</option>
                      <option>₹50K–₹2L</option>
                      <option>₹2L+</option>
                    </select>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label" htmlFor="tr-group">
                      Group Size
                    </label>
                    <input
                      id="tr-group"
                      className="tool-field-input"
                      type="number"
                      min="1"
                      value={form.groupSize}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, groupSize: e.target.value }))
                      }
                      data-ocid="travel.group_size_input"
                    />
                  </div>
                  {bpp && (
                    <div
                      className="px-3 py-2 rounded-md font-sans text-xs"
                      style={{
                        background: "oklch(var(--muted) / 0.3)",
                        color: "oklch(var(--muted-foreground))",
                        border: "1px solid oklch(var(--border))",
                      }}
                    >
                      Estimated budget per person:{" "}
                      <strong style={{ color: "oklch(var(--primary))" }}>
                        {bpp}
                      </strong>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Preferences */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="tool-field">
                    <label className="tool-field-label">Travel Style *</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {["Budget", "Standard", "Luxury", "Backpacker"].map(
                        (s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() =>
                              setForm((f) => ({ ...f, travelStyle: s }))
                            }
                            className="py-2 rounded-sm font-sans text-sm transition-all"
                            style={{
                              background:
                                form.travelStyle === s
                                  ? "oklch(var(--primary))"
                                  : "oklch(var(--muted))",
                              color:
                                form.travelStyle === s
                                  ? "oklch(var(--primary-foreground))"
                                  : "oklch(var(--foreground))",
                              border: `1px solid ${form.travelStyle === s ? "oklch(var(--primary))" : "oklch(var(--border))"}`,
                            }}
                            data-ocid={`travel.style_${s.toLowerCase()}`}
                          >
                            {s}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">Special Needs</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {SPECIAL_NEEDS.map((n) => (
                        <label
                          key={n}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form.specialNeeds.includes(n)}
                            onChange={() => toggleNeed(n)}
                            style={{ accentColor: "oklch(var(--primary))" }}
                            data-ocid={`travel.need_${n.toLowerCase().replace(/[^a-z]/g, "_")}`}
                          />
                          <span
                            className="font-sans text-xs"
                            style={{ color: "oklch(var(--foreground))" }}
                          >
                            {n}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Contact & Summary */}
              {step === 4 && (
                <div className="space-y-4">
                  {/* Summary */}
                  <div
                    className="p-4 rounded-lg space-y-2"
                    style={{
                      background: "oklch(var(--muted) / 0.25)",
                      border: "1px solid oklch(var(--border))",
                    }}
                  >
                    <p
                      className="font-sans text-xs font-bold tracking-widest uppercase"
                      style={{ color: "oklch(var(--primary))" }}
                    >
                      Trip Summary
                    </p>
                    {[
                      { k: "Destination", v: form.destination },
                      {
                        k: "Type",
                        v: [form.destinationType, form.tripType]
                          .filter(Boolean)
                          .join(" • "),
                      },
                      {
                        k: "Dates",
                        v: form.departureDate
                          ? `${form.departureDate} → ${form.returnDate}`
                          : "",
                      },
                      { k: "Duration", v: dur ?? "" },
                      {
                        k: "Budget",
                        v: `${form.budget}${bpp ? ` (${bpp})` : ""}`,
                      },
                      {
                        k: "Group",
                        v: `${form.groupSize} person${Number(form.groupSize) !== 1 ? "s" : ""}`,
                      },
                      { k: "Style", v: form.travelStyle },
                      { k: "Needs", v: form.specialNeeds.join(", ") },
                    ]
                      .filter((r) => r.v)
                      .map((row) => (
                        <div key={row.k} className="flex justify-between gap-2">
                          <span
                            className="font-sans text-xs"
                            style={{ color: "oklch(var(--muted-foreground))" }}
                          >
                            {row.k}
                          </span>
                          <span
                            className="font-sans text-xs font-semibold text-right"
                            style={{ color: "oklch(var(--foreground))" }}
                          >
                            {row.v}
                          </span>
                        </div>
                      ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="tool-field">
                      <label className="tool-field-label" htmlFor="tr-name">
                        Full Name *
                      </label>
                      <input
                        id="tr-name"
                        className="tool-field-input"
                        required
                        value={form.fullName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, fullName: e.target.value }))
                        }
                        placeholder="Your full name"
                        data-ocid="travel.name_input"
                      />
                    </div>
                    <div className="tool-field">
                      <label className="tool-field-label" htmlFor="tr-phone">
                        Phone *
                      </label>
                      <input
                        id="tr-phone"
                        className="tool-field-input"
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                        placeholder="+91 XXXXX XXXXX"
                        data-ocid="travel.phone_input"
                      />
                    </div>
                    <div className="tool-field sm:col-span-2">
                      <label className="tool-field-label" htmlFor="tr-email">
                        Email
                      </label>
                      <input
                        id="tr-email"
                        className="tool-field-input"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        placeholder="you@example.com"
                        data-ocid="travel.email_input"
                      />
                    </div>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label" htmlFor="tr-requests">
                      Special Requests
                    </label>
                    <textarea
                      id="tr-requests"
                      className="tool-field-input"
                      rows={2}
                      value={form.specialRequests}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          specialRequests: e.target.value,
                        }))
                      }
                      placeholder="Dietary requirements, must-see places, room preferences..."
                      data-ocid="travel.notes_textarea"
                    />
                  </div>
                  <IndemnityForm checked={indemnity} onChange={setIndemnity} />
                  {submitMutation.isError && (
                    <p
                      className="font-sans text-xs text-center"
                      style={{ color: "oklch(var(--destructive))" }}
                      data-ocid="travel.error_state"
                    >
                      Submission failed. Please try again or call +91
                      9512609016.
                    </p>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 mt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="flex-1 py-2.5 rounded-sm font-sans text-sm font-semibold transition-all"
                    style={{
                      background: "oklch(var(--muted))",
                      color: "oklch(var(--foreground))",
                      border: "1px solid oklch(var(--border))",
                    }}
                    data-ocid="travel.prev_button"
                  >
                    ← Back
                  </button>
                )}
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => canNext(step) && setStep((s) => s + 1)}
                    disabled={!canNext(step)}
                    className="flex-1 platform-button"
                    style={{ opacity: canNext(step) ? 1 : 0.5 }}
                    data-ocid="travel.next_button"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canNext(4) || submitMutation.isPending}
                    className="flex-1 platform-button"
                    style={{ opacity: canNext(4) ? 1 : 0.5 }}
                    data-ocid="travel.submit_button"
                  >
                    {submitMutation.isPending ? "Submitting…" : "Plan My Trip"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </InnerPageLayout>
  );
}
