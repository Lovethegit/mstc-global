import type { CsrImpactEntry } from "@/backend";
import { createActor } from "@/backend";
import PrivacyGate from "@/components/PrivacyGate";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BackToTop from "@/components/ui/BackToTop";
import { useActor } from "@/hooks/useActor";
import { useLogServiceSubmission } from "@/hooks/useQueries";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Droplets,
  Heart,
  Leaf,
  Lightbulb,
  Sparkles,
  Trees,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const FALLBACK_IMPACTS: CsrImpactEntry[] = [
  {
    id: "1",
    metric: "Trees Planted",
    value: BigInt(2400),
    year: BigInt(2024),
    description:
      "Mass tree plantation across residential and industrial zones in Ahmedabad. 2,400+ saplings planted in 12 localities with community participation.",
    category: "Environment",
    updatedAt: BigInt(Date.now()),
  },
  {
    id: "2",
    metric: "Families Supported",
    value: BigInt(180),
    year: BigInt(2025),
    description:
      "Monthly food distribution to daily wage workers and migrant families in industrial areas of Ahmedabad. Nutrition support and hygiene kits included.",
    category: "Food & Nutrition",
    updatedAt: BigInt(Date.now()),
  },
  {
    id: "3",
    metric: "Students Mentored",
    value: BigInt(320),
    year: BigInt(2025),
    description:
      "Mentorship and scholarship support for underprivileged students from Ahmedabad municipal schools. Focus on math, science and digital literacy.",
    category: "Education",
    updatedAt: BigInt(Date.now()),
  },
  {
    id: "4",
    metric: "Youth Skilled",
    value: BigInt(90),
    year: BigInt(2026),
    description:
      "Free trade skill workshops in plumbing, electrical, and construction work for youth in economically weaker sections. 65 placed in jobs.",
    category: "Livelihood",
    updatedAt: BigInt(Date.now()),
  },
  {
    id: "5",
    metric: "Water Units Installed",
    value: BigInt(40),
    year: BigInt(2026),
    description:
      "Distribution of water purification units to slum clusters and awareness about water-borne diseases. 3 clusters covered.",
    category: "Health",
    updatedAt: BigInt(Date.now()),
  },
  {
    id: "6",
    metric: "Healthcare Camps",
    value: BigInt(15),
    year: BigInt(2025),
    description:
      "Free health checkup camps for underprivileged communities. Blood pressure, diabetes, eye & dental screenings for 2,000+ people.",
    category: "Health",
    updatedAt: BigInt(Date.now()),
  },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Environment: Trees,
  "Food & Nutrition": Leaf,
  Education: Sparkles,
  Livelihood: Lightbulb,
  Health: Droplets,
  Volunteers: Users,
};

const CATEGORY_COLORS: Record<string, string> = {
  Environment: "oklch(0.6 0.18 148)",
  "Food & Nutrition": "oklch(0.65 0.18 135)",
  Education: "oklch(0.72 0.18 76)",
  Livelihood: "oklch(0.7 0.16 60)",
  Health: "oklch(0.6 0.16 220)",
  Volunteers: "oklch(0.65 0.15 260)",
};

// Animated counter hook
function useAnimatedCounter(target: number, active: boolean) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const start = 0;
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(start + (target - start) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, active]);

  return count;
}

function MetricCard({
  entry,
  index,
}: { entry: CsrImpactEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const count = useAnimatedCounter(Number(entry.value), visible);
  const color = CATEGORY_COLORS[entry.category] ?? "oklch(0.72 0.18 76)";
  const Icon = CATEGORY_ICONS[entry.category] ?? Heart;

  return (
    <div
      ref={ref}
      className="border border-border rounded-xl bg-card p-5 flex flex-col gap-2"
      style={{
        borderColor: `${color}33`,
        transitionDelay: `${index * 80}ms`,
      }}
      data-ocid={`csr.metric.${index + 1}`}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs px-2 py-0.5 rounded-full border font-medium"
          style={{
            background: `${color}18`,
            borderColor: `${color}40`,
            color,
          }}
        >
          {entry.category}
        </span>
        <span className="text-xs text-muted-foreground">
          {String(entry.year)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Icon size={24} style={{ color }} />
        <div
          className="font-serif font-bold text-3xl tabular-nums"
          style={{ color }}
        >
          {count.toLocaleString("en-IN")}+
        </div>
      </div>
      <div className="font-semibold text-sm text-foreground">
        {entry.metric}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {entry.description}
      </p>
    </div>
  );
}

interface InvolveForm {
  name: string;
  phone: string;
  email: string;
  role: string;
  message: string;
  indemnity: boolean;
}

export default function CsrImpactPage() {
  const { actor, isFetching } = useActor(createActor);
  const logSubmission = useLogServiceSubmission();

  const { data: backendEntries = [] } = useQuery<CsrImpactEntry[]>({
    queryKey: ["csrImpact"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCsrImpact();
    },
    enabled: !!actor && !isFetching,
  });

  const entries = backendEntries.length > 0 ? backendEntries : FALLBACK_IMPACTS;

  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<InvolveForm>({
    name: "",
    phone: "",
    email: "",
    role: "",
    message: "",
    indemnity: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.indemnity) return;
    logSubmission.mutate({
      serviceCategory: "NGO & CSR",
      innerPage: "CSR Impact Dashboard",
      formType: "GetInvolved",
      fields: [
        ["Role Interest", form.role],
        ["Message", form.message],
      ],
      submitterName: form.name,
      submitterPhone: form.phone,
      submitterEmail: form.email,
      indemnityAccepted: true,
    });
    setSubmitted(true);
  };

  return (
    <PrivacyGate>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        {/* Page Header */}
        <section className="pt-24 pb-8 px-4 bg-card/50 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/services/ngo-csr"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
              data-ocid="csr.back_button"
            >
              <ArrowLeft size={14} /> Back to NGO &amp; CSR
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Heart size={24} className="text-primary" />
              <h1 className="font-serif font-bold text-3xl gold-text">
                CSR Impact Dashboard
              </h1>
            </div>
            <p className="font-sans text-sm text-muted-foreground">
              Our commitment to society — measurable, transparent, impactful.
              Every initiative is documented and verified.
            </p>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 py-10">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {entries.map((entry, i) => (
              <MetricCard key={entry.id} entry={entry} index={i} />
            ))}
          </div>

          {/* Initiatives Section */}
          <h2 className="font-serif font-bold text-xl text-foreground mb-6">
            Active &amp; Completed Initiatives
          </h2>
          <div className="space-y-4 mb-12">
            {entries.map((entry, i) => {
              const color =
                CATEGORY_COLORS[entry.category] ?? "oklch(0.72 0.18 76)";
              return (
                <div
                  key={entry.id}
                  className="border border-border rounded-xl bg-card p-5"
                  data-ocid={`csr.initiative.${i + 1}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${color}15`,
                        border: `1px solid ${color}33`,
                      }}
                    >
                      {(() => {
                        const Icon = CATEGORY_ICONS[entry.category] ?? Heart;
                        return <Icon size={18} style={{ color }} />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full border font-medium"
                          style={{
                            background: `${color}15`,
                            borderColor: `${color}33`,
                            color,
                          }}
                        >
                          {entry.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {String(entry.year)}
                        </span>
                      </div>
                      <h3 className="font-serif font-semibold text-base text-foreground mb-1">
                        {entry.metric}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {entry.description}
                      </p>
                      <div
                        className="mt-2 text-xs font-semibold"
                        style={{ color }}
                      >
                        Impact: {Number(entry.value).toLocaleString("en-IN")}+{" "}
                        {entry.metric.toLowerCase()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Get Involved CTA */}
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.12 0.015 62), oklch(0.16 0.02 68))",
              border: "1px solid oklch(0.72 0.18 76 / 0.3)",
            }}
          >
            <Heart
              size={40}
              className="text-primary mx-auto mb-3"
              fill="oklch(0.72 0.18 76 / 0.2)"
            />
            <h3 className="font-serif font-bold text-2xl gold-text mb-2">
              Get Involved with MSTC CSR
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Volunteer, partner on a new initiative, or contribute to our
              ongoing social impact programs. Every effort counts.
            </p>
            {!showForm ? (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="px-8 py-3 rounded-lg font-semibold text-sm transition-all hover:-translate-y-0.5"
                style={{
                  background: "oklch(0.72 0.18 76)",
                  color: "oklch(0.1 0.01 60)",
                }}
                data-ocid="csr.get_involved_button"
              >
                Get Involved
              </button>
            ) : submitted ? (
              <div className="max-w-sm mx-auto">
                <CheckCircle2
                  size={40}
                  className="text-emerald-400 mx-auto mb-3"
                />
                <p className="text-sm text-muted-foreground">
                  Thank you! Our CSR team will reach out within 48 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto text-left space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                      data-ocid="csr.involve_name_input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Phone *
                    </label>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                      data-ocid="csr.involve_phone_input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    How would you like to help? *
                  </label>
                  <select
                    required
                    value={form.role}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, role: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    data-ocid="csr.involve_role_select"
                  >
                    <option value="">Select your role</option>
                    <option>Volunteer</option>
                    <option>CSR Partner / Donor</option>
                    <option>Corporate Sponsor</option>
                    <option>NGO Collaboration</option>
                    <option>Skill Trainer / Mentor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground resize-none focus:outline-none focus:border-primary"
                  />
                </div>
                <label className="flex items-start gap-2 cursor-pointer p-3 rounded-xl bg-muted/20 border border-border">
                  <input
                    type="checkbox"
                    checked={form.indemnity}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, indemnity: e.target.checked }))
                    }
                    className="mt-0.5 accent-primary"
                    data-ocid="csr.involve_indemnity_checkbox"
                  />
                  <span className="text-xs text-muted-foreground">
                    I understand this is a volunteer interest form. MSTC GLOBAL
                    is not obligated to immediately engage all applicants.
                    <span className="text-red-400 ml-1">*Required</span>
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={!form.indemnity || logSubmission.isPending}
                  className="w-full py-3 rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "oklch(0.72 0.18 76)",
                    color: "oklch(0.1 0.01 60)",
                  }}
                  data-ocid="csr.involve_submit_button"
                >
                  {logSubmission.isPending ? "Submitting…" : "Submit Interest"}
                </button>
              </form>
            )}
          </div>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </PrivacyGate>
  );
}
