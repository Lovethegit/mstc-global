import { createActor } from "@/backend";
import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { useActor } from "@caffeineai/core-infrastructure";
import { CheckCircle2, Disc3 } from "lucide-react";
import { useState } from "react";

type Genre = "Folk" | "Classical" | "Pop/Contemporary";
const GENRE_BUTTONS: Genre[] = ["Folk", "Classical", "Pop/Contemporary"];

export default function MusicProductionPage() {
  const { actor } = useActor(createActor);
  const [genre, setGenre] = useState<Genre>("Folk");

  // Base form
  const [form, setForm] = useState({
    artistName: "",
    contactName: "",
    phone: "",
    email: "",
    projectTitle: "",
    description: "",
    releaseDate: "",
    budget: "",
    distribution: "",
  });

  // Folk-specific
  const [folkFormat, setFolkFormat] = useState("");
  const [folkInstruments, setFolkInstruments] = useState<
    Record<string, boolean>
  >({});
  const [folkFilming, setFolkFilming] = useState("");

  // Classical-specific
  const [classicalPerformers, setClassicalPerformers] = useState("");
  const [classicalDuration, setClassicalDuration] = useState("");
  const [classicalRecording, setClassicalRecording] = useState("");

  // Pop-specific
  const [popDaw, setPopDaw] = useState("");
  const [popRefLinks, setPopRefLinks] = useState("");
  const [popMixOnly, setPopMixOnly] = useState("");
  const [popVideo, setPopVideo] = useState("");

  const [indemnity, setIndemnity] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const FOLK_INSTRUMENTS = ["Dhol", "Tasha", "Sarangi", "Harmonium", "Other"];

  const buildGenreFields = (): Array<[string, string]> => {
    const base: Array<[string, string]> = [
      ["Genre", genre],
      ["Contact Name", form.contactName],
      ["Project Title", form.projectTitle],
      ["Description", form.description],
      ["Planned Release Date", form.releaseDate],
      ["Budget Range", form.budget],
      ["Distribution Needed", form.distribution],
    ];
    if (genre === "Folk") {
      const instruments = Object.entries(folkInstruments)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(", ");
      return [
        ...base,
        ["Recording Format", folkFormat],
        ["Instruments Needed", instruments],
        ["Filming Required", folkFilming],
      ];
    }
    if (genre === "Classical")
      return [
        ...base,
        ["Number of Performers", classicalPerformers],
        ["Performance Duration", classicalDuration],
        ["Recording Type", classicalRecording],
      ];
    return [
      ...base,
      ["DAW Preference", popDaw],
      ["Reference Track Links", popRefLinks],
      ["Mix/Master Only", popMixOnly],
      ["Music Video Required", popVideo],
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
          "Music Production",
          "ProductionForm",
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
      innerPageTitle="Music Production"
      innerPageSubtitle="Professional recording, mixing, mastering, and music video production for folk, classical, and contemporary artists."
    >
      {/* Hero Banner */}
      <div
        className="mb-8 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=400&fit=crop"
          alt="Music Production"
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
            <Disc3 size={18} style={{ color: "oklch(var(--primary))" }} />
          </div>
          <span
            className="font-sans text-xs tracking-widest uppercase"
            style={{ color: "oklch(var(--primary))" }}
          >
            Music Production Services
          </span>
        </div>
        <h2
          className="font-serif text-2xl font-bold mb-3"
          style={{ color: "oklch(var(--foreground))" }}
        >
          Studio-Quality Production for Every Genre
        </h2>
        <div className="section-divider w-16 mb-5" />
        <p
          className="font-sans text-sm leading-relaxed mb-3"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          MSTC GLOBAL facilitates music production services covering the entire
          production lifecycle — from initial recording sessions and arrangement
          through mixing, mastering, and final delivery. We connect artists with
          experienced, genre-specialist sound engineers and production houses in
          Gujarat and across India.
        </p>
        <p
          className="font-sans text-sm leading-relaxed mb-3"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Our folk music productions preserve the authentic texture and acoustic
          character of traditional instruments. Classical recordings are handled
          with the precision the genre demands — capturing nuance and resonance.
          Contemporary pop productions leverage modern DAW technology for
          commercial-ready output.
        </p>
        <p
          className="font-sans text-sm leading-relaxed"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Select your genre to see production-specific options, then submit your
          project brief and we will provide a detailed production plan and
          quote.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT: Genre Selector + Offerings */}
        <div className="space-y-6">
          <div className="tool-card">
            <div className="tool-card-title">Select Production Genre</div>
            <div className="flex gap-3 flex-wrap mt-2">
              {GENRE_BUTTONS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenre(g)}
                  data-ocid={`prod.genre_${g.toLowerCase().replace(/[^a-z]/g, "_")}_button`}
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

            {genre === "Folk" && (
              <div className="space-y-3 mt-4">
                <p
                  className="font-sans text-xs font-bold uppercase tracking-wider"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  Folk Production Options
                </p>
                <div className="tool-field">
                  <label className="tool-field-label">Recording Format</label>
                  <select
                    className="tool-field-input"
                    value={folkFormat}
                    onChange={(e) => setFolkFormat(e.target.value)}
                    data-ocid="prod.folk_format_select"
                  >
                    <option value="">Select</option>
                    <option>Traditional Acoustic</option>
                    <option>Folk-Fusion</option>
                    <option>Documentary Style</option>
                  </select>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">
                    Instruments Needed (select all)
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {FOLK_INSTRUMENTS.map((inst) => (
                      <label
                        key={inst}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <div
                          className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                          style={{
                            background: folkInstruments[inst]
                              ? "oklch(var(--primary))"
                              : "oklch(var(--input))",
                            border: `1px solid ${folkInstruments[inst] ? "oklch(var(--primary))" : "oklch(var(--border))"}`,
                          }}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={!!folkInstruments[inst]}
                            onChange={(e) =>
                              setFolkInstruments((s) => ({
                                ...s,
                                [inst]: e.target.checked,
                              }))
                            }
                            data-ocid={`prod.folk_inst_${inst.toLowerCase()}`}
                          />
                          {folkInstruments[inst] && (
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
                          className="font-sans text-xs"
                          style={{ color: "oklch(var(--foreground))" }}
                        >
                          {inst}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Filming Required</label>
                  <select
                    className="tool-field-input"
                    value={folkFilming}
                    onChange={(e) => setFolkFilming(e.target.value)}
                    data-ocid="prod.folk_filming_select"
                  >
                    <option value="">Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              </div>
            )}

            {genre === "Classical" && (
              <div className="space-y-3 mt-4">
                <p
                  className="font-sans text-xs font-bold uppercase tracking-wider"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  Classical Production Options
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Number of Performers
                    </label>
                    <input
                      className="tool-field-input"
                      type="number"
                      value={classicalPerformers}
                      onChange={(e) => setClassicalPerformers(e.target.value)}
                      placeholder="e.g. 3"
                      data-ocid="prod.classical_performers_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Performance Duration
                    </label>
                    <select
                      className="tool-field-input"
                      value={classicalDuration}
                      onChange={(e) => setClassicalDuration(e.target.value)}
                      data-ocid="prod.classical_duration_select"
                    >
                      <option value="">Select</option>
                      <option>30 min</option>
                      <option>1 hour</option>
                      <option>2 hours</option>
                      <option>Full Concert</option>
                    </select>
                  </div>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Recording Type</label>
                  <select
                    className="tool-field-input"
                    value={classicalRecording}
                    onChange={(e) => setClassicalRecording(e.target.value)}
                    data-ocid="prod.classical_recording_select"
                  >
                    <option value="">Select</option>
                    <option>Live Recording</option>
                    <option>Studio Recording</option>
                  </select>
                </div>
              </div>
            )}

            {genre === "Pop/Contemporary" && (
              <div className="space-y-3 mt-4">
                <p
                  className="font-sans text-xs font-bold uppercase tracking-wider"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  Pop/Contemporary Options
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="tool-field">
                    <label className="tool-field-label">DAW Preference</label>
                    <select
                      className="tool-field-input"
                      value={popDaw}
                      onChange={(e) => setPopDaw(e.target.value)}
                      data-ocid="prod.pop_daw_select"
                    >
                      <option value="">No Preference</option>
                      <option>Logic Pro</option>
                      <option>Ableton</option>
                      <option>FL Studio</option>
                    </select>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">Mix/Master Only</label>
                    <select
                      className="tool-field-input"
                      value={popMixOnly}
                      onChange={(e) => setPopMixOnly(e.target.value)}
                      data-ocid="prod.pop_mix_select"
                    >
                      <option value="">Select</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Music Video Required
                    </label>
                    <select
                      className="tool-field-input"
                      value={popVideo}
                      onChange={(e) => setPopVideo(e.target.value)}
                      data-ocid="prod.pop_video_select"
                    >
                      <option value="">Select</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Reference Track Links
                    </label>
                    <input
                      className="tool-field-input"
                      value={popRefLinks}
                      onChange={(e) => setPopRefLinks(e.target.value)}
                      placeholder="YouTube/Spotify URL"
                      data-ocid="prod.pop_refs_input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="tool-card">
            <div className="tool-card-title">Production Services Include</div>
            <ul className="space-y-2 mt-1">
              {[
                "Multi-track studio recording",
                "Arrangement & orchestration support",
                "Professional mixing & mastering",
                "Music video production",
                "Album artwork & release packaging",
                "Digital distribution advisory (Spotify, Apple, YouTube)",
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
          <div className="tool-card-title">Submit Production Project Brief</div>
          <div className="tool-card-description">
            Share your project details and we will provide a production plan and
            quote within 48 hours.
          </div>
          {submitted ? (
            <div className="text-center py-8" data-ocid="prod.success_state">
              <CheckCircle2
                size={40}
                className="mx-auto mb-3"
                style={{ color: "oklch(var(--primary))" }}
              />
              <p
                className="font-serif text-lg font-bold mb-1"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Brief Submitted!
              </p>
              <p
                className="font-sans text-sm"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Our production team will contact you within 48 hours.
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
                  <label className="tool-field-label">
                    Artist / Band Name *
                  </label>
                  <input
                    className="tool-field-input"
                    required
                    value={form.artistName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, artistName: e.target.value }))
                    }
                    placeholder="Artist or band name"
                    data-ocid="prod.artist_name_input"
                  />
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">Contact Name *</label>
                  <input
                    className="tool-field-input"
                    required
                    value={form.contactName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, contactName: e.target.value }))
                    }
                    placeholder="Your name"
                    data-ocid="prod.contact_name_input"
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
                    data-ocid="prod.phone_input"
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
                    data-ocid="prod.email_input"
                  />
                </div>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Project Title</label>
                <input
                  className="tool-field-input"
                  value={form.projectTitle}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, projectTitle: e.target.value }))
                  }
                  placeholder="e.g. Debut Album, Single EP"
                  data-ocid="prod.title_input"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="tool-field">
                  <label className="tool-field-label">Budget Range</label>
                  <select
                    className="tool-field-input"
                    value={form.budget}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, budget: e.target.value }))
                    }
                    data-ocid="prod.budget_select"
                  >
                    <option value="">Select range</option>
                    <option>Under ₹50,000</option>
                    <option>₹50,000–₹2 Lakh</option>
                    <option>₹2 Lakh–₹5 Lakh</option>
                    <option>₹5 Lakh+</option>
                  </select>
                </div>
                <div className="tool-field">
                  <label className="tool-field-label">
                    Planned Release Date
                  </label>
                  <input
                    className="tool-field-input"
                    type="date"
                    value={form.releaseDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, releaseDate: e.target.value }))
                    }
                    data-ocid="prod.release_input"
                  />
                </div>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Distribution Needed</label>
                <select
                  className="tool-field-input"
                  value={form.distribution}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, distribution: e.target.value }))
                  }
                  data-ocid="prod.distribution_select"
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                  <option>Not Sure</option>
                </select>
              </div>
              <div className="tool-field">
                <label className="tool-field-label">Project Description</label>
                <textarea
                  className="tool-field-input"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Describe your project, musical style, references, and what you want to achieve..."
                  data-ocid="prod.description_textarea"
                />
              </div>
              <IndemnityForm checked={indemnity} onChange={setIndemnity} />
              <button
                type="submit"
                disabled={!indemnity || submitting}
                className="platform-button w-full"
                data-ocid="prod.submit_button"
                style={{ opacity: indemnity && !submitting ? 1 : 0.5 }}
              >
                {submitting ? "Submitting..." : "Submit Production Brief"}
              </button>
            </form>
          )}
        </div>
      </div>
    </InnerPageLayout>
  );
}
