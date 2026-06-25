import { useState } from "react";

const WHATSAPP_NUMBER = "919512609016";

type EventType =
  | "Wedding"
  | "Corporate"
  | "Birthday"
  | "Cultural"
  | "Conference"
  | "Sports";
type VenueType = "Indoor" | "Outdoor" | "Hotel" | "Farmhouse";
type CateringType = "Veg" | "NonVeg" | "Both";
type DecoType = "Basic" | "Premium" | "Luxury";

const VENUE_RATE: Record<VenueType, number> = {
  Indoor: 15000,
  Outdoor: 10000,
  Hotel: 40000,
  Farmhouse: 25000,
};
const CATERING_RATE: Record<CateringType, number> = {
  Veg: 600,
  NonVeg: 800,
  Both: 900,
};
const DECO_RATE: Record<DecoType, number> = {
  Basic: 30000,
  Premium: 80000,
  Luxury: 200000,
};

const CORPORATE_PACKAGES = [
  {
    name: "Team Outing",
    description: "Fun team activities, bonding games, outdoor/indoor venue",
    base: [15000, 40000],
    addOns: {
      "AV Equipment": [8000, 15000],
      Catering: [300, 600],
      Photography: [15000, 25000],
      "Live Entertainment": [20000, 50000],
      Transport: [5000, 12000],
      Accommodation: [2500, 6000],
    },
  },
  {
    name: "Conference",
    description: "Professional setup, stage, projector, seating",
    base: [40000, 120000],
    addOns: {
      "AV Equipment": [15000, 35000],
      Catering: [400, 700],
      Photography: [20000, 35000],
      "Live Entertainment": [30000, 80000],
      Transport: [8000, 20000],
      Accommodation: [3000, 8000],
    },
  },
  {
    name: "Product Launch",
    description: "Stage design, PR backdrop, media setup, product reveal",
    base: [60000, 200000],
    addOns: {
      "AV Equipment": [20000, 50000],
      Catering: [500, 900],
      Photography: [25000, 50000],
      "Live Entertainment": [40000, 100000],
      Transport: [10000, 25000],
      Accommodation: [3500, 9000],
    },
  },
  {
    name: "Annual Day",
    description: "Full-day celebration, awards, performances, banquet",
    base: [80000, 300000],
    addOns: {
      "AV Equipment": [25000, 60000],
      Catering: [600, 1000],
      Photography: [30000, 60000],
      "Live Entertainment": [50000, 150000],
      Transport: [12000, 30000],
      Accommodation: [4000, 10000],
    },
  },
];

const WEDDING_TASKS: { timeline: string; category: string; task: string }[] = [
  {
    timeline: "6 months",
    category: "Venue",
    task: "Book wedding venue and confirm date",
  },
  {
    timeline: "6 months",
    category: "Catering",
    task: "Shortlist caterers and do taste test",
  },
  {
    timeline: "6 months",
    category: "Photography",
    task: "Book photographer and videographer",
  },
  {
    timeline: "6 months",
    category: "Music",
    task: "Book DJ / live band / orchestra",
  },
  {
    timeline: "6 months",
    category: "Accommodation",
    task: "Block hotel rooms for outstation guests",
  },
  {
    timeline: "3 months",
    category: "Invites",
    task: "Design and print wedding invitations",
  },
  {
    timeline: "3 months",
    category: "Attire",
    task: "Finalise bridal lehenga and groom sherwani",
  },
  {
    timeline: "3 months",
    category: "Decor",
    task: "Book decorator and finalise theme",
  },
  {
    timeline: "3 months",
    category: "Transport",
    task: "Arrange baraat transport and guest shuttles",
  },
  {
    timeline: "3 months",
    category: "Catering",
    task: "Finalise menu and confirm headcount",
  },
  {
    timeline: "1 month",
    category: "Invites",
    task: "Send invitations (digital + physical)",
  },
  {
    timeline: "1 month",
    category: "Attire",
    task: "All fittings and alterations done",
  },
  {
    timeline: "1 month",
    category: "Venue",
    task: "Confirm seating chart and stage setup",
  },
  {
    timeline: "1 month",
    category: "Music",
    task: "Share playlist and special songs list",
  },
  {
    timeline: "2 weeks",
    category: "Catering",
    task: "Final headcount to caterer",
  },
  {
    timeline: "2 weeks",
    category: "Transport",
    task: "Share transport schedule with family",
  },
  {
    timeline: "2 weeks",
    category: "Photography",
    task: "Share shot list with photographer",
  },
  {
    timeline: "week of",
    category: "Decor",
    task: "Venue decoration walkthrough",
  },
  {
    timeline: "week of",
    category: "Attire",
    task: "All outfits pressed and packed",
  },
  {
    timeline: "week of",
    category: "Venue",
    task: "Final venue logistics check",
  },
];

const TIMELINES = ["6 months", "3 months", "1 month", "2 weeks", "week of"];

export default function EventToolsPage() {
  const [activeTab, setActiveTab] = useState<"cost" | "wedding" | "corporate">(
    "cost",
  );

  // Cost estimator state
  const [eventType, setEventType] = useState<EventType>("Wedding");
  const [guestCount, setGuestCount] = useState(200);
  const [duration, setDuration] = useState(6);
  const [venueType, setVenueType] = useState<VenueType>("Hotel");
  const [catering, setCatering] = useState<CateringType>("Veg");
  const [music, setMusic] = useState(true);
  const [decoration, setDecoration] = useState<DecoType>("Premium");
  const [photography, setPhotography] = useState(true);

  // Wedding checklist state
  const [weddingDate, setWeddingDate] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem("mstc_wedding_checklist") || "{}");
    } catch {
      return {};
    }
  });

  // Corporate state
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>(
    {},
  );
  const [guests, setGuests] = useState(100);

  const venueTotal = VENUE_RATE[venueType] * duration;
  const cateringTotal = guestCount * CATERING_RATE[catering];
  const musicTotal = music ? (guestCount < 200 ? 25000 : 60000) : 0;
  const decoTotal = DECO_RATE[decoration];
  const photoTotal = photography ? 30000 : 0;
  const subtotal =
    venueTotal + cateringTotal + musicTotal + decoTotal + photoTotal;
  const misc = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + misc;

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const quoteMsg = `Hi MSTC GLOBAL, I'd like an exact quote for a ${eventType} event: ${guestCount} guests, ${duration}h, ${venueType} venue, ${catering} catering. Estimated budget: ${fmt(grandTotal)}. Please contact me.`;

  const toggleWeddingTask = (key: string) => {
    const updated = { ...checked, [key]: !checked[key] };
    setChecked(updated);
    localStorage.setItem("mstc_wedding_checklist", JSON.stringify(updated));
  };

  const totalTasks = WEDDING_TASKS.length;
  const doneTasks = WEDDING_TASKS.filter(
    (t) => checked[t.timeline + t.task],
  ).length;
  const progress = Math.round((doneTasks / totalTasks) * 100);

  const pkg = CORPORATE_PACKAGES[selectedPackage];
  const addOnTotal = Object.entries(selectedAddOns)
    .filter(([, v]) => v)
    .reduce((sum, [key]) => {
      const range = pkg.addOns[key as keyof typeof pkg.addOns];
      if (!range) return sum;
      const perPerson = ["Catering"].includes(key);
      return (
        sum +
        (perPerson ? range[0] * guests : Math.round((range[0] + range[1]) / 2))
      );
    }, 0);
  const corpMin = pkg.base[0] + addOnTotal;
  const corpMax = pkg.base[1] + addOnTotal * 1.4;
  const corpMsg = `Hi MSTC GLOBAL, I'd like to request a quote for ${pkg.name} event. Approx ${guests} guests. Add-ons: ${
    Object.entries(selectedAddOns)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(", ") || "None"
  }. Est. range: ${fmt(corpMin)}-${fmt(corpMax)}. Please contact me.`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
            Events & Hospitality Tools
          </h1>
          <p className="text-muted-foreground font-sans">
            Plan your perfect event with our calculators and checklists.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border pb-0 flex-wrap">
          {(["cost", "wedding", "corporate"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              data-ocid={`event_tools.${tab}_tab`}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 font-sans text-sm font-medium rounded-t-lg transition-all ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {tab === "cost"
                ? "Event Cost Estimator"
                : tab === "wedding"
                  ? "Wedding Checklist"
                  : "Corporate Packages"}
            </button>
          ))}
        </div>

        {/* === EVENT COST ESTIMATOR === */}
        {activeTab === "cost" && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                  Event Type
                </label>
                <select
                  data-ocid="event_tools.event_type_select"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-sans text-foreground"
                >
                  {[
                    "Wedding",
                    "Corporate",
                    "Birthday",
                    "Cultural",
                    "Conference",
                    "Sports",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                  Guest Count:{" "}
                  <span className="text-primary font-bold">{guestCount}</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={2000}
                  step={25}
                  value={guestCount}
                  data-ocid="event_tools.guest_count_input"
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground font-sans mt-1">
                  <span>50</span>
                  <span>2000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                  Duration:{" "}
                  <span className="text-primary font-bold">
                    {duration} hours
                  </span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={12}
                  step={1}
                  value={duration}
                  data-ocid="event_tools.duration_input"
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                  Venue Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    ["Indoor", "Outdoor", "Hotel", "Farmhouse"] as VenueType[]
                  ).map((v) => (
                    <button
                      key={v}
                      type="button"
                      data-ocid={`event_tools.venue_${v.toLowerCase()}`}
                      onClick={() => setVenueType(v)}
                      className={`py-2 rounded-lg text-sm font-sans border transition-all ${
                        venueType === v
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                  Catering
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Veg", "NonVeg", "Both"] as CateringType[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      data-ocid={`event_tools.catering_${c.toLowerCase()}`}
                      onClick={() => setCatering(c)}
                      className={`py-2 rounded-lg text-sm font-sans border transition-all ${
                        catering === c
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                  Decoration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Basic", "Premium", "Luxury"] as DecoType[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      data-ocid={`event_tools.deco_${d.toLowerCase()}`}
                      onClick={() => setDecoration(d)}
                      className={`py-2 rounded-lg text-sm font-sans border transition-all ${
                        decoration === d
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={music}
                    data-ocid="event_tools.music_checkbox"
                    onChange={(e) => setMusic(e.target.checked)}
                    className="accent-primary w-4 h-4"
                  />
                  Music / DJ
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={photography}
                    data-ocid="event_tools.photography_checkbox"
                    onChange={(e) => setPhotography(e.target.checked)}
                    className="accent-primary w-4 h-4"
                  />
                  Photography
                </label>
              </div>
            </div>

            <div>
              <div className="bg-card border border-border rounded-xl p-6 sticky top-4">
                <h3 className="font-serif text-lg font-bold text-primary mb-4">
                  Cost Breakdown
                </h3>
                <div className="space-y-3">
                  {[
                    [`Venue (${venueType}, ${duration}h)`, venueTotal],
                    [`Catering (${guestCount} guests)`, cateringTotal],
                    ["Music / DJ", musicTotal],
                    [`Decoration (${decoration})`, decoTotal],
                    ["Photography", photoTotal],
                    ["Miscellaneous (10%)", misc],
                  ].map(([label, val]) => (
                    <div
                      key={String(label)}
                      className="flex justify-between items-center py-2 border-b border-border/50 last:border-0"
                    >
                      <span className="text-sm text-muted-foreground font-sans">
                        {label}
                      </span>
                      <span
                        className={`text-sm font-medium font-sans ${Number(val) === 0 ? "text-muted-foreground" : "text-foreground"}`}
                      >
                        {Number(val) === 0 ? "—" : fmt(Number(val))}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 mt-2 border-t-2 border-primary/40">
                    <span className="font-serif text-base font-bold text-foreground">
                      Grand Total
                    </span>
                    <span className="font-serif text-xl font-bold text-primary">
                      {fmt(grandTotal)}
                    </span>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(quoteMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="event_tools.get_quote_button"
                  className="mt-5 block w-full text-center py-3 rounded-lg bg-primary text-primary-foreground font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Get Exact Quote on WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        {/* === WEDDING CHECKLIST === */}
        {activeTab === "wedding" && (
          <div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                  Wedding Date
                </label>
                <input
                  type="date"
                  value={weddingDate}
                  data-ocid="event_tools.wedding_date_input"
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="bg-card border border-border rounded-lg px-3 py-2 text-sm font-sans text-foreground"
                />
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground font-sans mb-1">
                  {doneTasks}/{totalTasks} tasks complete
                </div>
                <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {TIMELINES.map((tl) => (
              <div key={tl} className="mb-6">
                <h3 className="font-serif text-base font-bold text-primary mb-3 border-b border-border pb-2">
                  {tl === "week of"
                    ? "Week Of Wedding"
                    : `${tl.charAt(0).toUpperCase() + tl.slice(1)} Before`}
                </h3>
                <div className="space-y-2">
                  {WEDDING_TASKS.filter((t) => t.timeline === tl).map(
                    (task) => (
                      <label
                        key={task.task}
                        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                          checked[tl + task.task]
                            ? "border-primary/40 bg-primary/5"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!!checked[tl + task.task]}
                          data-ocid={"event_tools.wedding_task_checkbox"}
                          onChange={() => toggleWeddingTask(tl + task.task)}
                          className="accent-primary w-4 h-4 mt-0.5 shrink-0"
                        />
                        <div className="min-w-0">
                          <span
                            className={`block text-sm font-sans ${
                              checked[tl + task.task]
                                ? "line-through text-muted-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {task.task}
                          </span>
                          <span className="text-xs text-primary font-sans">
                            {task.category}
                          </span>
                        </div>
                      </label>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* === CORPORATE PACKAGES === */}
        {activeTab === "corporate" && (
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {CORPORATE_PACKAGES.map((p, i) => (
                  <button
                    key={p.name}
                    type="button"
                    data-ocid={`event_tools.corp_pkg_${i + 1}`}
                    onClick={() => {
                      setSelectedPackage(i);
                      setSelectedAddOns({});
                    }}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedPackage === i
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-serif font-bold text-sm text-foreground">
                      {p.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-sans mt-1 leading-relaxed">
                      {p.description}
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                  Guest Count:{" "}
                  <span className="text-primary font-bold">{guests}</span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={2000}
                  step={10}
                  value={guests}
                  data-ocid="event_tools.corp_guests_input"
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <h4 className="font-sans text-sm font-medium text-foreground mb-3">
                  Add-ons
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(pkg.addOns).map((addon) => (
                    <label
                      key={addon}
                      className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-border hover:border-primary/40 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={!!selectedAddOns[addon]}
                        data-ocid={`event_tools.corp_addon_${addon.toLowerCase().replace(/ /g, "_")}`}
                        onChange={(e) =>
                          setSelectedAddOns((prev) => ({
                            ...prev,
                            [addon]: e.target.checked,
                          }))
                        }
                        className="accent-primary w-4 h-4"
                      />
                      <span className="text-sm font-sans text-foreground">
                        {addon}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-card border border-border rounded-xl p-5 sticky top-4">
                <h3 className="font-serif text-lg font-bold text-primary mb-1">
                  {pkg.name}
                </h3>
                <p className="text-xs text-muted-foreground font-sans mb-4">
                  {pkg.description}
                </p>
                <div className="space-y-1 mb-4">
                  <div className="text-sm text-muted-foreground font-sans">
                    Estimated Range
                  </div>
                  <div className="font-serif text-2xl font-bold text-primary">
                    {fmt(corpMin)}
                  </div>
                  <div className="text-sm text-muted-foreground font-sans">
                    — to —
                  </div>
                  <div className="font-serif text-xl font-bold text-foreground">
                    {fmt(corpMax)}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-sans mb-5">
                  Final pricing based on exact requirements, season, and
                  availability.
                </div>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(corpMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="event_tools.corp_quote_button"
                  className="block w-full text-center py-3 rounded-lg bg-primary text-primary-foreground font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Request Quote on WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
