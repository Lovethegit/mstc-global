import { createActor } from "@/backend";
import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ClipboardList, Trophy } from "lucide-react";
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

interface EstimatorInput {
  sportType: string;
  eventScale: string;
  participants: string;
  duration: string;
  venueType: string;
  sponsorshipSeeking: string;
}

interface EstimatorResult {
  costRange: string;
  checklist: string[];
}

function SportsEstimator() {
  const [input, setInput] = useState<EstimatorInput>({
    sportType: "",
    eventScale: "",
    participants: "",
    duration: "",
    venueType: "",
    sponsorshipSeeking: "",
  });
  const [result, setResult] = useState<EstimatorResult | null>(null);

  function estimate() {
    const baseMap: Record<string, number> = {
      "<50": 25000,
      "50-200": 75000,
      "200-500": 200000,
      "500+": 500000,
    };
    const scaleMap: Record<string, number> = {
      School: 1,
      District: 1.5,
      State: 2.5,
      National: 5,
      "Corporate Tournament": 2,
    };
    const durMap: Record<string, number> = {
      "1 day": 1,
      "2-3 days": 2,
      "Week-long": 4,
    };
    const base = baseMap[input.participants] ?? 75000;
    const scale = scaleMap[input.eventScale] ?? 1.5;
    const dur = durMap[input.duration] ?? 1.5;
    const low = Math.round((base * scale * dur) / 10000) * 10000;
    const high = Math.round((low * 1.6) / 10000) * 10000;
    const fmt = (n: number) =>
      n >= 100000
        ? `₹${(n / 100000).toFixed(1)}L`
        : `₹${(n / 1000).toFixed(0)}K`;
    const checklist = [
      "Venue booking & permissions",
      "Referees / Officials",
      "Medical staff & first aid",
      "Scorekeeping & timing systems",
      "Certificates / Trophies / Medals",
      "Refreshments & catering",
    ];
    if (input.venueType === "Outdoor" || input.venueType === "Both")
      checklist.push("Tent / Marquee / Weather cover");
    if (input.sponsorshipSeeking === "Yes")
      checklist.push("Sponsorship proposal & branding setup");
    checklist.push("Photography / Broadcast");
    setResult({ costRange: `${fmt(low)} – ${fmt(high)}`, checklist });
  }

  const ready =
    input.sportType &&
    input.eventScale &&
    input.participants &&
    input.duration &&
    input.venueType &&
    input.sponsorshipSeeking;

  return (
    <div className="tool-card">
      <div className="flex items-center gap-2 mb-1">
        <ClipboardList size={18} style={{ color: "oklch(var(--primary))" }} />
        <div className="tool-card-title">Sports Event Planning Estimator</div>
      </div>
      <div className="tool-card-description">
        Get an instant cost estimate and planning checklist for your event.
      </div>
      <div className="tool-card-fields">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="tool-field">
            <label className="tool-field-label" htmlFor="est-sport">
              Sport Type
            </label>
            <select
              id="est-sport"
              className="tool-field-input"
              value={input.sportType}
              onChange={(e) => {
                setInput((i) => ({ ...i, sportType: e.target.value }));
                setResult(null);
              }}
              data-ocid="sports_est.sport_select"
            >
              <option value="">Select</option>
              {[
                "Cricket",
                "Football",
                "Basketball",
                "Volleyball",
                "Kabaddi",
                "Athletics",
                "Swimming",
                "Chess",
                "Other",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="tool-field">
            <label className="tool-field-label" htmlFor="est-scale">
              Event Scale
            </label>
            <select
              id="est-scale"
              className="tool-field-input"
              value={input.eventScale}
              onChange={(e) => {
                setInput((i) => ({ ...i, eventScale: e.target.value }));
                setResult(null);
              }}
              data-ocid="sports_est.scale_select"
            >
              <option value="">Select</option>
              {[
                "School",
                "District",
                "State",
                "National",
                "Corporate Tournament",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="tool-field">
            <label className="tool-field-label" htmlFor="est-participants">
              Expected Participants
            </label>
            <select
              id="est-participants"
              className="tool-field-input"
              value={input.participants}
              onChange={(e) => {
                setInput((i) => ({ ...i, participants: e.target.value }));
                setResult(null);
              }}
              data-ocid="sports_est.participants_select"
            >
              <option value="">Select</option>
              <option value="<50">Under 50</option>
              <option value="50-200">50 – 200</option>
              <option value="200-500">200 – 500</option>
              <option value="500+">500+</option>
            </select>
          </div>
          <div className="tool-field">
            <label className="tool-field-label" htmlFor="est-duration">
              Duration
            </label>
            <select
              id="est-duration"
              className="tool-field-input"
              value={input.duration}
              onChange={(e) => {
                setInput((i) => ({ ...i, duration: e.target.value }));
                setResult(null);
              }}
              data-ocid="sports_est.duration_select"
            >
              <option value="">Select</option>
              <option>1 day</option>
              <option>2-3 days</option>
              <option>Week-long</option>
            </select>
          </div>
          <div className="tool-field">
            <label className="tool-field-label" htmlFor="est-venue">
              Venue Type
            </label>
            <select
              id="est-venue"
              className="tool-field-input"
              value={input.venueType}
              onChange={(e) => {
                setInput((i) => ({ ...i, venueType: e.target.value }));
                setResult(null);
              }}
              data-ocid="sports_est.venue_select"
            >
              <option value="">Select</option>
              <option>Indoor</option>
              <option>Outdoor</option>
              <option>Both</option>
            </select>
          </div>
          <div className="tool-field">
            <label className="tool-field-label" htmlFor="est-sponsor">
              Seeking Sponsorship?
            </label>
            <select
              id="est-sponsor"
              className="tool-field-input"
              value={input.sponsorshipSeeking}
              onChange={(e) => {
                setInput((i) => ({ ...i, sponsorshipSeeking: e.target.value }));
                setResult(null);
              }}
              data-ocid="sports_est.sponsor_select"
            >
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={estimate}
          disabled={!ready}
          className="platform-button"
          style={{ opacity: ready ? 1 : 0.5 }}
          data-ocid="sports_est.estimate_button"
        >
          Get Planning Estimate
        </button>
        {result && (
          <div
            className="p-4 rounded-lg space-y-3"
            style={{
              background: "oklch(var(--primary) / 0.08)",
              border: "1px solid oklch(var(--primary) / 0.25)",
            }}
            data-ocid="sports_est.result"
          >
            <div>
              <p
                className="font-sans text-xs font-semibold"
                style={{ color: "oklch(var(--primary))" }}
              >
                Estimated Organising Cost
              </p>
              <p
                className="font-serif text-2xl font-bold"
                style={{ color: "oklch(var(--foreground))" }}
              >
                {result.costRange}
              </p>
            </div>
            <div
              style={{
                borderTop: "1px solid oklch(var(--border))",
                paddingTop: "0.75rem",
              }}
            >
              <p
                className="font-sans text-xs font-semibold mb-2"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Key Requirements Checklist
              </p>
              <ul className="space-y-1">
                {result.checklist.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2
                      size={12}
                      style={{ color: "oklch(var(--primary))", flexShrink: 0 }}
                    />
                    <span
                      className="font-sans text-xs"
                      style={{ color: "oklch(var(--muted-foreground))" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SportsEventsPage() {
  const submitMutation = useLogServiceSubmission();
  const [submitted, setSubmitted] = useState(false);
  const [indemnity, setIndemnity] = useState(false);
  const [form, setForm] = useState({
    organizerName: "",
    contactPerson: "",
    phone: "",
    email: "",
    sportType: "",
    eventName: "",
    targetDate: "",
    venuePreference: "",
    sponsorshipAmount: "",
    mediaCoverage: "",
    specialRequirements: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!indemnity) return;
    const fields: Array<[string, string]> = [
      ["Organizer / Organization Name", form.organizerName],
      ["Contact Person", form.contactPerson],
      ["Phone", form.phone],
      ["Email", form.email],
      ["Sport Type", form.sportType],
      ["Event Name", form.eventName],
      ["Target Date / Month", form.targetDate],
      ["Venue / Location Preference", form.venuePreference],
      ["Sponsorship Amount Available", form.sponsorshipAmount],
      ["Media Coverage Required", form.mediaCoverage],
      ["Special Requirements", form.specialRequirements],
    ];
    submitMutation.mutate(
      {
        serviceCategory: "media",
        innerPage: "Sports Events",
        formType: "SportsEventForm",
        fields,
        submitterName: form.contactPerson || form.organizerName,
        submitterPhone: form.phone,
        submitterEmail: form.email,
        indemnityAccepted: indemnity,
      },
      { onSuccess: () => setSubmitted(true) },
    );
  }

  return (
    <InnerPageLayout
      serviceSlug="media-sports-tourism"
      serviceName="Media, Sports & Tourism"
      innerPageTitle="Sports Events"
      innerPageSubtitle="End-to-end sports event management, athlete coordination, and sponsorship facilitation across Gujarat."
    >
      {/* Hero Banner */}
      <div
        className="mb-6 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&h=400&fit=crop"
          alt="Sports Events"
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
            <Trophy size={18} style={{ color: "oklch(var(--primary))" }} />
          </div>
          <span
            className="font-sans text-xs tracking-widest uppercase"
            style={{ color: "oklch(var(--primary))" }}
          >
            Sports Management
          </span>
        </div>
        <h2
          className="font-serif text-2xl font-bold mb-3"
          style={{ color: "oklch(var(--foreground))" }}
        >
          Bringing Sports to Life in Gujarat
        </h2>
        <div className="section-divider w-16 mb-5" />
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm font-sans leading-relaxed"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          <p>
            MSTC GLOBAL organises and facilitates sports tournaments, leagues,
            and corporate sports days across Ahmedabad and Gujarat. We partner
            with schools, colleges, sports associations, and corporates to
            create well-managed, professionally executed events.
          </p>
          <p>
            From grassroots kabaddi tournaments in rural Gujarat to state-level
            cricket championships, our team handles venue sourcing, official
            coordination, scorekeeping, medical staff, refreshments, and
            complete event logistics so organizers can focus on participation
            and performance.
          </p>
          <p>
            We also support athlete talent scouting, career management, and
            sponsorship facilitation — connecting promising sportspersons with
            corporate sponsors, media outlets, and sports federations for
            broader visibility and development opportunities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Estimator + Services */}
        <div className="space-y-8">
          <SportsEstimator />
          <div>
            <p
              className="font-sans text-sm font-semibold mb-3"
              style={{ color: "oklch(var(--foreground))" }}
            >
              Key Services
            </p>
            <ul className="space-y-2">
              {[
                "Cricket & kabaddi tournaments",
                "School & college sports events",
                "Corporate sports days",
                "Athlete management & PR",
                "Sports sponsorship facilitation",
                "Stadium & venue coordination",
                "Sports infrastructure consulting",
                "Talent identification & development",
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

        {/* Right: Event Request Form */}
        <div className="tool-card">
          <div className="tool-card-title">Sports Event Request</div>
          <div className="tool-card-description">
            Share your event requirements and we will create a detailed
            management proposal.
          </div>
          {submitted ? (
            <div className="text-center py-8" data-ocid="sports.success_state">
              <CheckCircle2
                size={40}
                className="mx-auto mb-3"
                style={{ color: "oklch(var(--primary))" }}
              />
              <p
                className="font-sans font-semibold text-lg"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Request Submitted!
              </p>
              <p
                className="font-sans text-sm mt-2"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Our sports management team will contact you within 24 hours. For
                urgent matters, call <strong>+91 9512609016</strong>.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              data-ocid="sports.form"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label" htmlFor="sp-organizer">
                    Organizer / Organization *
                  </label>
                  <input
                    id="sp-organizer"
                    className="tool-field-input"
                    required
                    value={form.organizerName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, organizerName: e.target.value }))
                    }
                    placeholder="School / Club / Company name"
                    data-ocid="sports.organizer_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label" htmlFor="sp-contact">
                    Contact Person *
                  </label>
                  <input
                    id="sp-contact"
                    className="tool-field-input"
                    required
                    value={form.contactPerson}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, contactPerson: e.target.value }))
                    }
                    placeholder="Your full name"
                    data-ocid="sports.name_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label" htmlFor="sp-phone">
                    Phone *
                  </label>
                  <input
                    id="sp-phone"
                    className="tool-field-input"
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+91 XXXXX XXXXX"
                    data-ocid="sports.phone_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label" htmlFor="sp-email">
                    Email
                  </label>
                  <input
                    id="sp-email"
                    className="tool-field-input"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                    data-ocid="sports.email_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label" htmlFor="sp-sport">
                    Sport Type *
                  </label>
                  <select
                    id="sp-sport"
                    className="tool-field-input"
                    required
                    value={form.sportType}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, sportType: e.target.value }))
                    }
                    data-ocid="sports.sport_select"
                  >
                    <option value="">Select sport</option>
                    {[
                      "Cricket",
                      "Football",
                      "Basketball",
                      "Volleyball",
                      "Kabaddi",
                      "Athletics",
                      "Swimming",
                      "Chess",
                      "Other",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label" htmlFor="sp-event-name">
                    Event Name
                  </label>
                  <input
                    id="sp-event-name"
                    className="tool-field-input"
                    value={form.eventName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, eventName: e.target.value }))
                    }
                    placeholder="e.g. Ahmedabad Premier Cricket Cup"
                    data-ocid="sports.event_name_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label" htmlFor="sp-date">
                    Target Date / Month
                  </label>
                  <input
                    id="sp-date"
                    className="tool-field-input"
                    value={form.targetDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, targetDate: e.target.value }))
                    }
                    placeholder="e.g. March 2026"
                    data-ocid="sports.date_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label" htmlFor="sp-venue">
                    Venue / Location Preference
                  </label>
                  <input
                    id="sp-venue"
                    className="tool-field-input"
                    value={form.venuePreference}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        venuePreference: e.target.value,
                      }))
                    }
                    placeholder="City or specific venue"
                    data-ocid="sports.venue_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label" htmlFor="sp-sponsor">
                    Sponsorship Amount Available
                  </label>
                  <select
                    id="sp-sponsor"
                    className="tool-field-input"
                    value={form.sponsorshipAmount}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        sponsorshipAmount: e.target.value,
                      }))
                    }
                    data-ocid="sports.sponsorship_select"
                  >
                    <option value="">Select</option>
                    <option>None</option>
                    <option>Under ₹1L</option>
                    <option>₹1L – ₹5L</option>
                    <option>₹5L – ₹20L</option>
                    <option>₹20L+</option>
                  </select>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label" htmlFor="sp-media">
                    Media Coverage Required?
                  </label>
                  <select
                    id="sp-media"
                    className="tool-field-input"
                    value={form.mediaCoverage}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, mediaCoverage: e.target.value }))
                    }
                    data-ocid="sports.media_select"
                  >
                    <option value="">Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              </div>
              <div className="tool-field">
                <label className="tool-field-label" htmlFor="sp-notes">
                  Special Requirements
                </label>
                <textarea
                  id="sp-notes"
                  className="tool-field-input"
                  rows={3}
                  value={form.specialRequirements}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      specialRequirements: e.target.value,
                    }))
                  }
                  placeholder="Sponsorship needs, media coverage, accessible facilities, hospitality..."
                  data-ocid="sports.notes_textarea"
                />
              </div>
              <IndemnityForm checked={indemnity} onChange={setIndemnity} />
              <button
                type="submit"
                disabled={!indemnity || submitMutation.isPending}
                className="platform-button w-full"
                style={{ opacity: indemnity ? 1 : 0.5 }}
                data-ocid="sports.submit_button"
              >
                {submitMutation.isPending
                  ? "Submitting…"
                  : "Submit Event Request"}
              </button>
              {submitMutation.isError && (
                <p
                  className="font-sans text-xs text-center"
                  style={{ color: "oklch(var(--destructive))" }}
                  data-ocid="sports.error_state"
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
