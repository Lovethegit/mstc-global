import { createActor } from "@/backend";
import IndemnityForm from "@/components/shared/IndemnityForm";
import InnerPageLayout from "@/components/shared/InnerPageLayout";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Globe } from "lucide-react";
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

type StepId = 1 | 2 | 3;

const SKILL_OPTIONS = [
  "Teaching",
  "Medical",
  "Legal",
  "IT",
  "Social Work",
  "Art",
  "Agriculture",
  "Construction",
  "Other",
];
const LANG_OPTIONS = ["Gujarati", "Hindi", "English", "Other"];
const AVAIL_OPTIONS = [
  "Weekdays",
  "Weekends",
  "Evenings",
  "Full-time available",
];
const PROGRAM_OPTIONS = [
  "Rural Education",
  "Urban Health Camps",
  "Women's Skill Training",
  "Tree Plantation",
  "Flood Relief",
  "Heritage Conservation",
  "Sports for Youth",
  "Cultural Programs",
];

export default function SocialImpactPage() {
  const submitMutation = useLogServiceSubmission();
  const [submitted, setSubmitted] = useState(false);
  const [indemnity, setIndemnity] = useState(false);
  const [form, setForm] = useState({
    volunteerName: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    city: "",
    background: "",
    skills: [] as string[],
    languages: [] as string[],
    availability: [] as string[],
    programs: [] as string[],
    preferredLocation: "",
    howHeard: "",
    statement: "",
  });

  function toggleArr(
    key: "skills" | "languages" | "availability" | "programs",
    val: string,
  ) {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val)
        ? f[key].filter((v: string) => v !== val)
        : [...f[key], val],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!indemnity) return;
    const fields: Array<[string, string]> = [
      ["Volunteer Name", form.volunteerName],
      ["Age Group", form.age],
      ["Gender", form.gender],
      ["Phone", form.phone],
      ["Email", form.email],
      ["City / District", form.city],
      ["Professional Background", form.background],
      ["Skills", form.skills.join(", ")],
      ["Languages", form.languages.join(", ")],
      ["Availability", form.availability.join(", ")],
      ["Preferred Programs", form.programs.join(", ")],
      ["Preferred Location", form.preferredLocation],
      ["How Heard About Us", form.howHeard],
      ["Personal Statement", form.statement],
    ];
    submitMutation.mutate(
      {
        serviceCategory: "ngo",
        innerPage: "Social Impact",
        formType: "VolunteerRegistration",
        fields,
        submitterName: form.volunteerName,
        submitterPhone: form.phone,
        submitterEmail: form.email,
        indemnityAccepted: indemnity,
      },
      { onSuccess: () => setSubmitted(true) },
    );
  }

  const stepBg = (active: boolean) =>
    active ? "oklch(var(--primary))" : "oklch(var(--muted))";
  const stepColor = (active: boolean) =>
    active
      ? "oklch(var(--primary-foreground))"
      : "oklch(var(--muted-foreground))";

  const steps: { id: StepId; label: string }[] = [
    { id: 1, label: "Personal" },
    { id: 2, label: "Skills" },
    { id: 3, label: "Preferences" },
  ];

  return (
    <InnerPageLayout
      serviceSlug="ngo-csr"
      serviceName="NGO & CSR Initiatives"
      innerPageTitle="Social Impact"
      innerPageSubtitle="Volunteer mobilisation, community programmes, and social welfare initiatives across Gujarat."
    >
      {/* Hero Banner */}
      <div
        className="mb-10 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 30px 0 rgba(201,168,76,0.10)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=400&fit=crop"
          alt="Social Impact"
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
            <Globe size={18} style={{ color: "oklch(var(--primary))" }} />
          </div>
          <span
            className="font-sans text-xs tracking-widest uppercase"
            style={{ color: "oklch(var(--primary))" }}
          >
            Social Programmes
          </span>
        </div>
        <h2
          className="font-serif text-2xl font-bold mb-3"
          style={{ color: "oklch(var(--foreground))" }}
        >
          Empowering Communities Across Gujarat
        </h2>
        <div className="section-divider w-16 mb-5" />
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm font-sans leading-relaxed"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          <p>
            MSTC GLOBAL's Social Impact division acts as a facilitator between
            corporations, NGOs, volunteers, and communities across Gujarat and
            India. We bridge gaps in social infrastructure by connecting willing
            hands with meaningful work.
          </p>
          <p>
            Our programmes span rural education, urban health camps, women's
            skill development, environmental drives, and cultural preservation.
            Every initiative is designed to create measurable, documented impact
            that can be reported to CSR boards and government agencies.
          </p>
          <p>
            Volunteers from all professional backgrounds are welcome — whether
            you can spare weekends or are looking for full-time social work.
            Register below to join our network of change-makers across
            Ahmedabad, Surat, Vadodara, and rural Gujarat.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="tool-card">
          <div className="tool-card-title">Volunteer Registration</div>
          <div className="tool-card-description mb-4">
            Register to join MSTC GLOBAL's social impact programmes. Fill in all
            three sections below.
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-1 mb-6">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1 flex-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0"
                  style={{ background: stepBg(true), color: stepColor(true) }}
                >
                  {s.id}
                </div>
                <span
                  className="font-sans text-xs hidden sm:block"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className="flex-1 h-px mx-1"
                    style={{ background: "oklch(var(--primary) / 0.4)" }}
                  />
                )}
              </div>
            ))}
          </div>

          {submitted ? (
            <div
              className="text-center py-10"
              data-ocid="volunteer.success_state"
            >
              <CheckCircle2
                size={44}
                className="mx-auto mb-3"
                style={{ color: "oklch(var(--primary))" }}
              />
              <p
                className="font-sans font-semibold text-lg"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Volunteer Application Submitted!
              </p>
              <p
                className="font-sans text-sm mt-2"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Thank you for joining our mission. We will reach out with
                upcoming opportunities. Call <strong>+91 9512609016</strong> for
                immediate queries.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              data-ocid="volunteer.form"
            >
              {/* Step 1: Personal */}
              <div>
                <p
                  className="font-sans text-xs font-bold tracking-widest uppercase mb-3"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  Step 1 — Personal Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="tool-field">
                    <label className="tool-field-label" htmlFor="vol-name">
                      Volunteer Name *
                    </label>
                    <input
                      id="vol-name"
                      className="tool-field-input"
                      required
                      value={form.volunteerName}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          volunteerName: e.target.value,
                        }))
                      }
                      placeholder="Your full name"
                      data-ocid="volunteer.name_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label" htmlFor="vol-age">
                      Age Group *
                    </label>
                    <select
                      id="vol-age"
                      className="tool-field-input"
                      required
                      value={form.age}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, age: e.target.value }))
                      }
                      data-ocid="volunteer.age_select"
                    >
                      <option value="">Select</option>
                      <option>18–25</option>
                      <option>26–35</option>
                      <option>36–50</option>
                      <option>50+</option>
                    </select>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label" htmlFor="vol-gender">
                      Gender
                    </label>
                    <select
                      id="vol-gender"
                      className="tool-field-input"
                      value={form.gender}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, gender: e.target.value }))
                      }
                      data-ocid="volunteer.gender_select"
                    >
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Non-binary</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label" htmlFor="vol-phone">
                      Phone *
                    </label>
                    <input
                      id="vol-phone"
                      className="tool-field-input"
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      placeholder="+91 XXXXX XXXXX"
                      data-ocid="volunteer.phone_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label" htmlFor="vol-email">
                      Email
                    </label>
                    <input
                      id="vol-email"
                      className="tool-field-input"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="you@example.com"
                      data-ocid="volunteer.email_input"
                    />
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label" htmlFor="vol-city">
                      City / District *
                    </label>
                    <input
                      id="vol-city"
                      className="tool-field-input"
                      required
                      value={form.city}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, city: e.target.value }))
                      }
                      placeholder="e.g. Ahmedabad"
                      data-ocid="volunteer.city_input"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Skills */}
              <div
                style={{
                  borderTop: "1px solid oklch(var(--border))",
                  paddingTop: "1.5rem",
                }}
              >
                <p
                  className="font-sans text-xs font-bold tracking-widest uppercase mb-3"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  Step 2 — Skills & Background
                </p>
                <div className="space-y-4">
                  <div className="tool-field">
                    <label
                      className="tool-field-label"
                      htmlFor="vol-background"
                    >
                      Professional Background
                    </label>
                    <select
                      id="vol-background"
                      className="tool-field-input"
                      value={form.background}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, background: e.target.value }))
                      }
                      data-ocid="volunteer.background_select"
                    >
                      <option value="">Select</option>
                      <option>Student</option>
                      <option>Working Professional</option>
                      <option>Business Owner</option>
                      <option>Retired</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Skills (select all that apply)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                      {SKILL_OPTIONS.map((s) => (
                        <label
                          key={s}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form.skills.includes(s)}
                            onChange={() => toggleArr("skills", s)}
                            style={{ accentColor: "oklch(var(--primary))" }}
                            data-ocid={`volunteer.skill_${s.toLowerCase()}`}
                          />
                          <span
                            className="font-sans text-xs"
                            style={{ color: "oklch(var(--foreground))" }}
                          >
                            {s}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">Languages</label>
                    <div className="flex flex-wrap gap-3 mt-1">
                      {LANG_OPTIONS.map((l) => (
                        <label
                          key={l}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form.languages.includes(l)}
                            onChange={() => toggleArr("languages", l)}
                            style={{ accentColor: "oklch(var(--primary))" }}
                            data-ocid={`volunteer.lang_${l.toLowerCase()}`}
                          />
                          <span
                            className="font-sans text-xs"
                            style={{ color: "oklch(var(--foreground))" }}
                          >
                            {l}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label">Availability</label>
                    <div className="flex flex-wrap gap-3 mt-1">
                      {AVAIL_OPTIONS.map((a) => (
                        <label
                          key={a}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form.availability.includes(a)}
                            onChange={() => toggleArr("availability", a)}
                            style={{ accentColor: "oklch(var(--primary))" }}
                            data-ocid={`volunteer.avail_${a.toLowerCase().replace(/[^a-z]/g, "_")}`}
                          />
                          <span
                            className="font-sans text-xs"
                            style={{ color: "oklch(var(--foreground))" }}
                          >
                            {a}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Preferences */}
              <div
                style={{
                  borderTop: "1px solid oklch(var(--border))",
                  paddingTop: "1.5rem",
                }}
              >
                <p
                  className="font-sans text-xs font-bold tracking-widest uppercase mb-3"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  Step 3 — Preferences & Statement
                </p>
                <div className="space-y-4">
                  <div className="tool-field">
                    <label className="tool-field-label">
                      Preferred Program Areas
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {PROGRAM_OPTIONS.map((p) => (
                        <label
                          key={p}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form.programs.includes(p)}
                            onChange={() => toggleArr("programs", p)}
                            style={{ accentColor: "oklch(var(--primary))" }}
                            data-ocid={`volunteer.program_${p.toLowerCase().replace(/[^a-z]/g, "_")}`}
                          />
                          <span
                            className="font-sans text-xs"
                            style={{ color: "oklch(var(--foreground))" }}
                          >
                            {p}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label" htmlFor="vol-location">
                      Preferred Location
                    </label>
                    <select
                      id="vol-location"
                      className="tool-field-input"
                      value={form.preferredLocation}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          preferredLocation: e.target.value,
                        }))
                      }
                      data-ocid="volunteer.location_select"
                    >
                      <option value="">Select</option>
                      <option>Ahmedabad</option>
                      <option>Rural Gujarat</option>
                      <option>Any Gujarat</option>
                      <option>Pan India</option>
                    </select>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label" htmlFor="vol-heard">
                      How Did You Hear About Us?
                    </label>
                    <select
                      id="vol-heard"
                      className="tool-field-input"
                      value={form.howHeard}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, howHeard: e.target.value }))
                      }
                      data-ocid="volunteer.heard_select"
                    >
                      <option value="">Select</option>
                      <option>Google</option>
                      <option>Friend</option>
                      <option>Social Media</option>
                      <option>NGO Directory</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="tool-field">
                    <label className="tool-field-label" htmlFor="vol-statement">
                      Personal Statement
                    </label>
                    <textarea
                      id="vol-statement"
                      className="tool-field-input"
                      rows={3}
                      value={form.statement}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, statement: e.target.value }))
                      }
                      placeholder="Why do you want to volunteer? What impact do you hope to create?"
                      data-ocid="volunteer.statement_textarea"
                    />
                  </div>
                </div>
              </div>

              <IndemnityForm checked={indemnity} onChange={setIndemnity} />
              <button
                type="submit"
                disabled={
                  !indemnity ||
                  !form.volunteerName ||
                  !form.phone ||
                  submitMutation.isPending
                }
                className="platform-button w-full"
                style={{
                  opacity:
                    indemnity && form.volunteerName && form.phone ? 1 : 0.5,
                }}
                data-ocid="volunteer.submit_button"
              >
                {submitMutation.isPending
                  ? "Submitting…"
                  : "Register as Volunteer"}
              </button>
              {submitMutation.isError && (
                <p
                  className="font-sans text-xs text-center"
                  style={{ color: "oklch(var(--destructive))" }}
                  data-ocid="volunteer.error_state"
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
