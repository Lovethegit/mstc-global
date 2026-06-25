import { createActor } from "@/backend";
import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { useActor } from "@caffeineai/core-infrastructure";
import { CheckCircle2, Music } from "lucide-react";
import { useState } from "react";

type Genre = "Folk" | "Classical" | "Pop/Contemporary";

const GENRE_BUTTONS: Genre[] = ["Folk", "Classical", "Pop/Contemporary"];

export default function ArtistManagementPage() {
  const { actor } = useActor(createActor);

  const [genre, setGenre] = useState<Genre>("Folk");

  // Base form
  const [form, setForm] = useState({
    artistName: "",
    stageName: "",
    phone: "",
    email: "",
    cityState: "",
    yearsActive: "",
    managementNeed: "",
    bio: "",
  });

  // Folk-specific
  const [folkRegion, setFolkRegion] = useState("");
  const [folkInstrument, setFolkInstrument] = useState("");
  const [folkScale, setFolkScale] = useState("");
  const [folkTroupeSize, setFolkTroupeSize] = useState("");

  // Classical-specific
  const [classicalGharana, setClassicalGharana] = useState("");
  const [classicalTraining, setClassicalTraining] = useState("");
  const [classicalPerfType, setClassicalPerfType] = useState("");
  const [classicalCerts, setClassicalCerts] = useState("");

  // Pop-specific
  const [popSocialHandle, setPopSocialHandle] = useState("");
  const [popStreams, setPopStreams] = useState("");
  const [popLabel, setPopLabel] = useState("");
  const [popMarket, setPopMarket] = useState("");

  const [indemnity, setIndemnity] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const buildGenreFields = (): Array<[string, string]> => {
    const base: Array<[string, string]> = [
      ["Genre", genre],
      ["Stage Name", form.stageName],
      ["City/State", form.cityState],
      ["Years Active", form.yearsActive],
      ["Management Need", form.managementNeed],
      ["Artist Bio", form.bio],
    ];
    if (genre === "Folk")
      return [
        ...base,
        ["Native Region", folkRegion],
        ["Instrument", folkInstrument],
        ["Performance Scale", folkScale],
        ["Troupe Size", folkTroupeSize],
      ];
    if (genre === "Classical")
      return [
        ...base,
        ["Training Lineage/Gharana", classicalGharana],
        ["Years of Training", classicalTraining],
        ["Performance Type", classicalPerfType],
        ["Certifications", classicalCerts],
      ];
    return [
      ...base,
      ["Social Media Handle", popSocialHandle],
      ["Monthly Stream Count", popStreams],
      ["Label Affiliation", popLabel],
      ["Target Market", popMarket],
    ];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!indemnity || submitting) return;
    setSubmitting(true);
    try {
      if (actor) {
        await actor.logServiceSubmission(
          "music",
          "Artist Management",
          "ArtistForm",
          buildGenreFields(),
          form.artistName,
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
      serviceSlug="music-cultural"
      serviceName="Music & Cultural Services"
      innerPageTitle="Artist Management"
      innerPageSubtitle="Professional management, bookings, and career development for Indian traditional and contemporary artists."
    >
      {/* Hero Banner */}
      <div
        className="mb-10 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=400&fit=crop"
          alt="Artist Management"
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
            <Music size={18} style={{ color: "oklch(var(--primary))" }} />
          </div>
          <span
            className="font-sans text-xs tracking-widest uppercase"
            style={{ color: "oklch(var(--primary))" }}
          >
            Artist Management
          </span>
        </div>
        <h2
          className="font-serif text-2xl font-bold mb-3"
          style={{ color: "oklch(var(--foreground))" }}
        >
          Your Art, Amplified. Your Career, Managed.
        </h2>
        <div className="section-divider w-16 mb-5" />
        <p
          className="font-sans text-sm leading-relaxed mb-3"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          MSTC GLOBAL manages artists across the full spectrum of Indian music —
          from Gujarati folk and Rajasthani performers steeped in tradition, to
          Hindustani and Carnatic classical musicians trained in the great
          gharanas, to independent and emerging contemporary pop artists.
        </p>
        <p
          className="font-sans text-sm leading-relaxed mb-3"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Our management services include event booking, PR and media outreach,
          contract negotiation with promoters and labels, digital distribution
          advisory, and strategic career planning. We bridge the gap between
          artistic talent and commercial opportunity.
        </p>
        <p
          className="font-sans text-sm leading-relaxed"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Select your genre below to see tailored requirements, then submit your
          artist profile for consideration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT: Genre Selector + Info */}
        <div className="space-y-6">
          <div className="tool-card">
            <div className="tool-card-title">Select Your Genre</div>
            <div className="tool-card-description">
              Choose your primary music genre to reveal relevant management
              fields.
            </div>
            <div className="flex gap-3 flex-wrap mt-2">
              {GENRE_BUTTONS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenre(g)}
                  data-ocid={`artist.genre_${g.toLowerCase().replace(/[^a-z]/g, "_")}_button`}
                  className="px-5 py-2.5 rounded-sm font-sans text-sm font-semibold transition-all duration-200"
                  style={{
                    background:
                      genre === g ? "oklch(var(--primary))" : "transparent",
                    color:
                      genre === g
                        ? "oklch(var(--primary-foreground))"
                        : "oklch(var(--foreground))",
                    border: `1.5px solid ${genre === g ? "oklch(var(--primary))" : "oklch(var(--border))"}`,
                  }}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Folk fields */}
            {genre === "Folk" && (
              <div className="space-y-3 mt-4">
                <p
                  className="font-sans text-xs font-bold uppercase tracking-wider"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  Folk Artist Information
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="tool-field">
                    <label className="tool-field-label">Native Region</label>
                    <select
                      className="tool-field-input"
                      value={folkRegion}
                      onChange={(e) => setFolkRegion(e.target.value)}
                      data-ocid="artist.folk_region_select"
                    >
                      <option value="">Select</option>
                      <option>Gujarat</option>
                      <option>Rajasthan</option>
                      <option>Punjab</option>
                      <option>Maharashtra</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Instrument Played
                    </label>
                    <input
                      className="tool-field-input"
                      value={folkInstrument}
                      onChange={(e) => setFolkInstrument(e.target.value)}
                      placeholder="e.g. Dhol, Tabla"
                      data-ocid="artist.folk_instrument_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Performance Scale
                    </label>
                    <select
                      className="tool-field-input"
                      value={folkScale}
                      onChange={(e) => setFolkScale(e.target.value)}
                      data-ocid="artist.folk_scale_select"
                    >
                      <option value="">Select</option>
                      <option>Village</option>
                      <option>District</option>
                      <option>State</option>
                      <option>National</option>
                    </select>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">Troupe Size</label>
                    <input
                      className="tool-field-input"
                      type="number"
                      value={folkTroupeSize}
                      onChange={(e) => setFolkTroupeSize(e.target.value)}
                      placeholder="No. of members"
                      data-ocid="artist.folk_troupe_input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Classical fields */}
            {genre === "Classical" && (
              <div className="space-y-3 mt-4">
                <p
                  className="font-sans text-xs font-bold uppercase tracking-wider"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  Classical Artist Information
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Training Lineage / Gharana
                    </label>
                    <input
                      className="tool-field-input"
                      value={classicalGharana}
                      onChange={(e) => setClassicalGharana(e.target.value)}
                      placeholder="e.g. Jaipur Gharana"
                      data-ocid="artist.classical_gharana_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Years of Training
                    </label>
                    <input
                      className="tool-field-input"
                      type="number"
                      value={classicalTraining}
                      onChange={(e) => setClassicalTraining(e.target.value)}
                      placeholder="e.g. 12"
                      data-ocid="artist.classical_training_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">Performance Type</label>
                    <select
                      className="tool-field-input"
                      value={classicalPerfType}
                      onChange={(e) => setClassicalPerfType(e.target.value)}
                      data-ocid="artist.classical_perf_select"
                    >
                      <option value="">Select</option>
                      <option>Vocal</option>
                      <option>Instrumental</option>
                      <option>Dance</option>
                    </select>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Certifications / Awards
                    </label>
                    <input
                      className="tool-field-input"
                      value={classicalCerts}
                      onChange={(e) => setClassicalCerts(e.target.value)}
                      placeholder="Any notable awards"
                      data-ocid="artist.classical_certs_input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pop fields */}
            {genre === "Pop/Contemporary" && (
              <div className="space-y-3 mt-4">
                <p
                  className="font-sans text-xs font-bold uppercase tracking-wider"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  Pop / Contemporary Artist Information
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Social Media Handle
                    </label>
                    <input
                      className="tool-field-input"
                      value={popSocialHandle}
                      onChange={(e) => setPopSocialHandle(e.target.value)}
                      placeholder="@yourhandle"
                      data-ocid="artist.pop_social_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Monthly Stream Count
                    </label>
                    <input
                      className="tool-field-input"
                      value={popStreams}
                      onChange={(e) => setPopStreams(e.target.value)}
                      placeholder="e.g. 50,000"
                      data-ocid="artist.pop_streams_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Label Affiliation
                    </label>
                    <select
                      className="tool-field-input"
                      value={popLabel}
                      onChange={(e) => setPopLabel(e.target.value)}
                      data-ocid="artist.pop_label_select"
                    >
                      <option value="">Select</option>
                      <option>Independent</option>
                      <option>Indie Label</option>
                      <option>Major Label</option>
                    </select>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">Target Market</label>
                    <select
                      className="tool-field-input"
                      value={popMarket}
                      onChange={(e) => setPopMarket(e.target.value)}
                      data-ocid="artist.pop_market_select"
                    >
                      <option value="">Select</option>
                      <option>Local</option>
                      <option>National</option>
                      <option>International</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="tool-card">
            <div className="tool-card-title">What We Offer Artists</div>
            <ul className="space-y-2 mt-1">
              {[
                "Event booking & performance scheduling",
                "Contract review and negotiation",
                "PR, media outreach & press releases",
                "Brand partnership and sponsorship",
                "Digital presence strategy",
                "Festival, concert & cultural event placement",
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
          <div className="tool-card-title">Submit Your Artist Profile</div>
          <div className="tool-card-description">
            Share your profile and our team will review and get in touch about
            management opportunities.
          </div>
          {submitted ? (
            <div className="text-center py-8" data-ocid="artist.success_state">
              <CheckCircle2
                size={40}
                className="mx-auto mb-3"
                style={{ color: "oklch(var(--primary))" }}
              />
              <p
                className="font-serif text-lg font-bold mb-1"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Profile Submitted!
              </p>
              <p
                className="font-sans text-sm"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Our team will review and contact you shortly.
              </p>
              <p
                className="font-sans text-sm mt-2 font-semibold"
                style={{ color: "oklch(var(--primary))" }}
              >
                Call us: +91 9512609016
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">Artist Name *</label>
                  <input
                    className="tool-field-input"
                    required
                    value={form.artistName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, artistName: e.target.value }))
                    }
                    placeholder="Full name"
                    data-ocid="artist.name_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">
                    Stage Name (if any)
                  </label>
                  <input
                    className="tool-field-input"
                    value={form.stageName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, stageName: e.target.value }))
                    }
                    placeholder="Stage or brand name"
                    data-ocid="artist.stage_name_input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    data-ocid="artist.phone_input"
                  />
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
                    placeholder="artist@email.com"
                    data-ocid="artist.email_input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">City / State</label>
                  <input
                    className="tool-field-input"
                    value={form.cityState}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, cityState: e.target.value }))
                    }
                    placeholder="e.g. Ahmedabad, Gujarat"
                    data-ocid="artist.city_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Years Active</label>
                  <input
                    className="tool-field-input"
                    type="number"
                    min="0"
                    value={form.yearsActive}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, yearsActive: e.target.value }))
                    }
                    placeholder="e.g. 5"
                    data-ocid="artist.years_input"
                  />
                </div>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Management Need</label>
                <select
                  className="tool-field-input"
                  value={form.managementNeed}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, managementNeed: e.target.value }))
                  }
                  data-ocid="artist.need_select"
                >
                  <option value="">Select what you need</option>
                  <option>Event Booking</option>
                  <option>Promotion & PR</option>
                  <option>Contract Negotiation</option>
                  <option>Full Management</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">
                  Bio / About Your Music
                </label>
                <textarea
                  className="tool-field-input"
                  rows={3}
                  value={form.bio}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bio: e.target.value }))
                  }
                  placeholder="Links to recordings, performances, social media, goals..."
                  data-ocid="artist.bio_textarea"
                />
              </div>
              <IndemnityForm checked={indemnity} onChange={setIndemnity} />
              <button
                type="submit"
                disabled={!indemnity || submitting}
                className="platform-button w-full"
                data-ocid="artist.submit_button"
                style={{ opacity: indemnity && !submitting ? 1 : 0.5 }}
              >
                {submitting ? "Submitting..." : "Submit Artist Profile"}
              </button>
            </form>
          )}
        </div>
      </div>
    </InnerPageLayout>
  );
}
