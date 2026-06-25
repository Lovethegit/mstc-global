import { useState } from "react";

const WHATSAPP_NUMBER = "919512609016";

type DestType =
  | "Heritage"
  | "Beach"
  | "Hill"
  | "Wildlife"
  | "Pilgrimage"
  | "International";
type DurationType = "Weekend" | "Short" | "Week" | "Extended";
type GroupType = "Solo" | "Couple" | "Family" | "Friends" | "Corporate";
type BudgetType = "Budget" | "Standard" | "Premium" | "Luxury";

const DEST_DATA: Record<
  DestType,
  { destinations: string[]; highlights: string[]; icon: string }
> = {
  Heritage: {
    destinations: [
      "Ahmedabad Heritage Walk",
      "Modhera Sun Temple",
      "Patan Rani ki Vav",
    ],
    highlights: [
      "UNESCO World Heritage sites",
      "Ancient step wells",
      "Local Gujarati cuisine",
    ],
    icon: "🏛️",
  },
  Beach: {
    destinations: ["Diu", "Somnath", "Dwarka"],
    highlights: [
      "Pristine beaches",
      "Ancient temples",
      "Water sports & sunsets",
    ],
    icon: "🏖️",
  },
  Hill: {
    destinations: ["Saputara", "Mount Abu", "Girnar"],
    highlights: [
      "Cool hill climate",
      "Trekking routes",
      "Sunrise & sunset views",
    ],
    icon: "⛰️",
  },
  Wildlife: {
    destinations: ["Gir National Park", "Velavadar Blackbuck", "Kutch RNN"],
    highlights: [
      "Asiatic lions (world's only)",
      "Blackbuck herds",
      "Flamingos & migratory birds",
    ],
    icon: "🦁",
  },
  Pilgrimage: {
    destinations: ["Somnath", "Dwarka", "Ambaji", "Palitana"],
    highlights: [
      "12 Jyotirlinga temples",
      "Shakti Peetha shrines",
      "Jain pilgrimage centre",
    ],
    icon: "🙏",
  },
  International: {
    destinations: ["Thailand", "Maldives", "Dubai"],
    highlights: [
      "Exotic beaches & resorts",
      "Luxury shopping & dining",
      "World-class experiences",
    ],
    icon: "✈️",
  },
};

const DURATION_LABELS: Record<DurationType, string> = {
  Weekend: "Weekend (2–3 days)",
  Short: "Short Trip (4–5 days)",
  Week: "Week (6–7 days)",
  Extended: "Extended (8+ days)",
};

const BUDGET_LABELS: Record<BudgetType, string> = {
  Budget: "Budget (₹5K–₹15K)",
  Standard: "Standard (₹15K–₹30K)",
  Premium: "Premium (₹30K–₹60K)",
  Luxury: "Luxury (₹60K+)",
};

const GROUP_LABELS: Record<GroupType, string> = {
  Solo: "Solo Explorer 🧑",
  Couple: "Couple 💑",
  Family: "Family 👨‍👩‍👧‍👦",
  Friends: "Friends Group 👯",
  Corporate: "Corporate 💼",
};

const BASE_COSTS: Record<BudgetType, [number, number]> = {
  Budget: [5000, 15000],
  Standard: [15000, 30000],
  Premium: [30000, 60000],
  Luxury: [60000, 150000],
};

const DUR_MULT: Record<DurationType, number> = {
  Weekend: 1,
  Short: 1.5,
  Week: 2,
  Extended: 3,
};

const PACKAGES = ["Economy", "Standard", "Premium"] as const;
type PkgTier = (typeof PACKAGES)[number];

const PKG_MULT: Record<PkgTier, number> = {
  Economy: 0.8,
  Standard: 1,
  Premium: 1.4,
};

const PKG_INCLUDES: Record<PkgTier, string[]> = {
  Economy: [
    "Budget hotel (3-star)",
    "Shared transport",
    "Local guide (day tours)",
    "Breakfast only",
  ],
  Standard: [
    "3-star hotel",
    "Private AC transport",
    "Professional guide",
    "Breakfast & dinner",
  ],
  Premium: [
    "4-5 star hotel",
    "Luxury private transport",
    "Expert guide & concierge",
    "All meals included",
  ],
};

const PKG_EXCLUDES: Record<PkgTier, string[]> = {
  Economy: [
    "Flights/train tickets",
    "Lunch",
    "Personal expenses",
    "Entry fees",
  ],
  Standard: ["Flights/train tickets", "Lunch", "Personal expenses"],
  Premium: [
    "International flights",
    "Personal expenses",
    "Spa & premium activities",
  ],
};

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function TravelCustomizerPage() {
  const [step, setStep] = useState(1);
  const [destType, setDestType] = useState<DestType | null>(null);
  const [duration, setDuration] = useState<DurationType | null>(null);
  const [groupType, setGroupType] = useState<GroupType | null>(null);
  const [budget, setBudget] = useState<BudgetType | null>(null);
  const [done, setDone] = useState(false);

  const canProceed = () => {
    if (step === 1) return destType !== null;
    if (step === 2) return duration !== null;
    if (step === 3) return groupType !== null;
    if (step === 4) return budget !== null;
    return false;
  };

  const handleNext = () => {
    if (step < 4) setStep((s) => s + 1);
    else setDone(true);
  };

  const handleBack = () => {
    if (done) {
      setDone(false);
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  };

  const getPkgCost = (tier: PkgTier): [number, number] => {
    if (!budget) return [0, 0];
    const [min, max] = BASE_COSTS[budget];
    const dm = DUR_MULT[duration ?? "Week"];
    const pm = PKG_MULT[tier];
    return [Math.round(min * dm * pm), Math.round(max * dm * pm)];
  };

  const requestMsg = (tier: PkgTier) =>
    `Hi MSTC GLOBAL, I'd like to request the ${tier} travel package for ${destType} trip. Duration: ${duration}, Group: ${groupType}, Budget: ${budget}. Budget range: ${fmt(getPkgCost(tier)[0])}-${fmt(getPkgCost(tier)[1])} per person. Please share the full itinerary.`;

  const dest = destType ? DEST_DATA[destType] : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
            Travel Customizer
          </h1>
          <p className="text-muted-foreground font-sans">
            Build your perfect Gujarat & beyond travel package in 4 steps.
          </p>
        </div>

        {/* Progress */}
        {!done && (
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-sans font-bold transition-all ${
                    step === n
                      ? "bg-primary text-primary-foreground"
                      : step > n
                        ? "bg-primary/30 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {n}
                </div>
                {n < 4 && (
                  <div
                    className={`h-0.5 w-8 md:w-16 transition-all ${
                      step > n ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
            <span className="ml-2 text-xs font-sans text-muted-foreground">
              {step === 1
                ? "Destination"
                : step === 2
                  ? "Duration"
                  : step === 3
                    ? "Group"
                    : "Budget"}
            </span>
          </div>
        )}

        {/* Step 1: Destination */}
        {!done && step === 1 && (
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground mb-5">
              Where do you want to go?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(
                Object.entries(DEST_DATA) as [
                  DestType,
                  (typeof DEST_DATA)[DestType],
                ][]
              ).map(([key, data]) => (
                <button
                  key={key}
                  type="button"
                  data-ocid={`travel.dest_${key.toLowerCase()}`}
                  onClick={() => setDestType(key)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    destType === key
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-3xl mb-2">{data.icon}</div>
                  <div className="font-serif font-bold text-sm text-foreground">
                    {key}
                  </div>
                  <div className="text-xs text-muted-foreground font-sans mt-1">
                    {data.destinations[0]}…
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Duration */}
        {!done && step === 2 && (
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground mb-5">
              How long is your trip?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {(
                Object.entries(DURATION_LABELS) as [DurationType, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  data-ocid={`travel.duration_${key.toLowerCase()}`}
                  onClick={() => setDuration(key)}
                  className={`p-5 rounded-xl border text-left transition-all ${
                    duration === key
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-serif font-bold text-base text-foreground">
                    {label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Group */}
        {!done && step === 3 && (
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground mb-5">
              Who's travelling?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.entries(GROUP_LABELS) as [GroupType, string][]).map(
                ([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    data-ocid={`travel.group_${key.toLowerCase()}`}
                    onClick={() => setGroupType(key)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      groupType === key
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-serif font-bold text-sm text-foreground">
                      {label}
                    </div>
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        {/* Step 4: Budget */}
        {!done && step === 4 && (
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground mb-5">
              Budget per person?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {(Object.entries(BUDGET_LABELS) as [BudgetType, string][]).map(
                ([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    data-ocid={`travel.budget_${key.toLowerCase()}`}
                    onClick={() => setBudget(key)}
                    className={`p-5 rounded-xl border text-left transition-all ${
                      budget === key
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-serif font-bold text-base text-foreground">
                      {label}
                    </div>
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        {!done && (
          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              data-ocid="travel.back_button"
              onClick={handleBack}
              disabled={step === 1}
              className="px-5 py-2.5 rounded-lg border border-border text-muted-foreground font-sans text-sm hover:border-primary hover:text-primary disabled:opacity-40 transition-all"
            >
              ← Back
            </button>
            <button
              type="button"
              data-ocid="travel.next_button"
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-sans font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {step === 4 ? "See Packages →" : "Next →"}
            </button>
          </div>
        )}

        {/* Results */}
        {done && dest && (
          <div>
            <div className="bg-card border border-primary/20 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{dest.icon}</div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-primary">
                    {destType} — {DURATION_LABELS[duration!]}
                  </h3>
                  <p className="text-sm text-muted-foreground font-sans">
                    {GROUP_LABELS[groupType!]} · {BUDGET_LABELS[budget!]}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {dest.destinations.map((d) => (
                      <span
                        key={d}
                        className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-sans"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {dest.highlights.map((h) => (
                      <span
                        key={h}
                        className="text-xs text-muted-foreground font-sans"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-serif text-lg font-bold text-foreground mb-4">
              Choose Your Package
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {PACKAGES.map((tier) => {
                const [min, max] = getPkgCost(tier);
                return (
                  <div
                    key={tier}
                    data-ocid={`travel.pkg_${tier.toLowerCase()}_card`}
                    className={`border rounded-xl p-5 ${
                      tier === "Standard"
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    {tier === "Standard" && (
                      <div className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-sans inline-block mb-2">
                        Most Popular
                      </div>
                    )}
                    <div className="font-serif text-base font-bold text-foreground mb-1">
                      {tier}
                    </div>
                    <div className="font-serif text-lg font-bold text-primary mb-3">
                      {fmt(min)}–{fmt(max)}
                      <span className="text-xs text-muted-foreground font-sans">
                        {" "}
                        /person
                      </span>
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="text-xs font-sans font-medium text-foreground mb-1">
                        Includes:
                      </div>
                      {PKG_INCLUDES[tier].map((i) => (
                        <div
                          key={i}
                          className="flex items-start gap-1 text-xs font-sans text-muted-foreground"
                        >
                          <span className="text-primary mt-0.5 shrink-0">
                            ✓
                          </span>
                          {i}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1 mb-4">
                      <div className="text-xs font-sans font-medium text-foreground mb-1">
                        Excludes:
                      </div>
                      {PKG_EXCLUDES[tier].map((e) => (
                        <div
                          key={e}
                          className="flex items-start gap-1 text-xs font-sans text-muted-foreground"
                        >
                          <span className="text-destructive mt-0.5 shrink-0">
                            ✕
                          </span>
                          {e}
                        </div>
                      ))}
                    </div>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(requestMsg(tier))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ocid={`travel.pkg_${tier.toLowerCase()}_request_button`}
                      className="block w-full text-center py-2.5 rounded-lg bg-primary text-primary-foreground font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                      Request Package
                    </a>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              data-ocid="travel.start_over_button"
              onClick={() => {
                setDone(false);
                setStep(1);
                setDestType(null);
                setDuration(null);
                setGroupType(null);
                setBudget(null);
              }}
              className="px-5 py-2.5 rounded-lg border border-border text-muted-foreground font-sans text-sm hover:border-primary hover:text-primary transition-all"
            >
              ← Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
