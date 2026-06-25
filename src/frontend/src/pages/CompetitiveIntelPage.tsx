import BackButton from "@/components/ui/BackButton";
import CloseButton from "@/components/ui/CloseButton";
import { useState } from "react";

const COMPETITORS = [
  {
    id: 1,
    name: "Ganesh Housing",
    city: "Ahmedabad",
    specialization: "Residential",
    share: 8.4,
    listings: 234,
    avgPrice: "₹78L",
  },
  {
    id: 2,
    name: "Bakeri Group",
    city: "Ahmedabad",
    specialization: "Residential/Commercial",
    share: 7.1,
    listings: 189,
    avgPrice: "₹92L",
  },
  {
    id: 3,
    name: "Savvy Infra",
    city: "Ahmedabad",
    specialization: "Luxury Residential",
    share: 6.3,
    listings: 156,
    avgPrice: "₹1.8Cr",
  },
  {
    id: 4,
    name: "Arvind SmartSpaces",
    city: "Ahmedabad",
    specialization: "Township",
    share: 9.2,
    listings: 312,
    avgPrice: "₹65L",
  },
  {
    id: 5,
    name: "Shivalik Buildcon",
    city: "Ahmedabad",
    specialization: "Mid-segment",
    share: 5.7,
    listings: 143,
    avgPrice: "₹55L",
  },
  {
    id: 6,
    name: "GIFT City Projects",
    city: "Gandhinagar",
    specialization: "Commercial/IT",
    share: 4.2,
    listings: 98,
    avgPrice: "₹1.2Cr",
  },
  {
    id: 7,
    name: "Piramal Realty",
    city: "Ahmedabad",
    specialization: "Premium",
    share: 5.1,
    listings: 67,
    avgPrice: "₹2.5Cr",
  },
  {
    id: 8,
    name: "Godrej Properties",
    city: "Ahmedabad",
    specialization: "Branded Township",
    share: 6.8,
    listings: 178,
    avgPrice: "₹88L",
  },
  {
    id: 9,
    name: "Nirman Group",
    city: "Vadodara",
    specialization: "Residential",
    share: 3.4,
    listings: 112,
    avgPrice: "₹48L",
  },
  {
    id: 10,
    name: "Sambhav Infrastructure",
    city: "Ahmedabad",
    specialization: "Affordable",
    share: 4.9,
    listings: 201,
    avgPrice: "₹32L",
  },
  {
    id: 11,
    name: "Venus Realtors",
    city: "Surat",
    specialization: "Commercial",
    share: 3.2,
    listings: 89,
    avgPrice: "₹75L",
  },
  {
    id: 12,
    name: "Radhe Developers",
    city: "Ahmedabad",
    specialization: "Villa/Bungalow",
    share: 2.8,
    listings: 45,
    avgPrice: "₹3.2Cr",
  },
];

const PRICE_COMPARE = [
  {
    type: "2BHK Apartment",
    mstc: "₹58L",
    market: "₹63L",
    diff: "-7.9%",
    trend: "▼",
  },
  {
    type: "3BHK Apartment",
    mstc: "₹85L",
    market: "₹92L",
    diff: "-7.6%",
    trend: "▼",
  },
  {
    type: "4BHK Flat",
    mstc: "₹1.4Cr",
    market: "₹1.5Cr",
    diff: "-6.7%",
    trend: "▼",
  },
  {
    type: "Commercial Office",
    mstc: "₹1.8Cr",
    market: "₹1.75Cr",
    diff: "+2.9%",
    trend: "▲",
  },
  {
    type: "Industrial Land",
    mstc: "₹2.2Cr",
    market: "₹2.0Cr",
    diff: "+10.0%",
    trend: "▲",
  },
  {
    type: "Residential Plot",
    mstc: "₹72L",
    market: "₹78L",
    diff: "-7.7%",
    trend: "▼",
  },
  {
    type: "Retail Shop",
    mstc: "₹95L",
    market: "₹90L",
    diff: "+5.6%",
    trend: "▲",
  },
  {
    type: "Luxury Villa",
    mstc: "₹3.8Cr",
    market: "₹4.1Cr",
    diff: "-7.3%",
    trend: "▼",
  },
];

const ALERTS = [
  {
    id: 1,
    time: "2h ago",
    company: "Arvind SmartSpaces",
    activity: "Launched Phase 3 of Shela Township — 280 units",
    severity: "high",
  },
  {
    id: 2,
    time: "4h ago",
    company: "Godrej Properties",
    activity: "Price drop of 3.5% on Ahmedabad 2BHK range",
    severity: "medium",
  },
  {
    id: 3,
    time: "6h ago",
    company: "Bakeri Group",
    activity: "New residential project launch in Bopal — 150 units",
    severity: "medium",
  },
  {
    id: 4,
    time: "8h ago",
    company: "Piramal Realty",
    activity: "Exclusive tie-up with HDFC for home loan offers",
    severity: "low",
  },
  {
    id: 5,
    time: "1d ago",
    company: "Savvy Infra",
    activity: "Increased marketing spend by 40% in SG Highway belt",
    severity: "high",
  },
  {
    id: 6,
    time: "1d ago",
    company: "GIFT City Projects",
    activity: "New IT tower pre-launch in GIFT Phase 2",
    severity: "medium",
  },
  {
    id: 7,
    time: "2d ago",
    company: "Shivalik Buildcon",
    activity: "Aggressive pricing on 3BHK — dropped to ₹52L",
    severity: "high",
  },
  {
    id: 8,
    time: "2d ago",
    company: "Nirman Group",
    activity: "Expanded to Ahmedabad East with new project",
    severity: "medium",
  },
  {
    id: 9,
    time: "3d ago",
    company: "Sambhav Infrastructure",
    activity: "EMI waiver for 12 months on new bookings",
    severity: "medium",
  },
  {
    id: 10,
    time: "3d ago",
    company: "Radhe Developers",
    activity: "Sold out luxury villas in Prahlad Nagar",
    severity: "low",
  },
];

const severityColor: Record<string, string> = {
  high: "bg-red-900/40 text-red-300 border-red-700/40",
  medium: "bg-amber-900/40 text-amber-300 border-amber-700/40",
  low: "bg-blue-900/40 text-blue-300 border-blue-700/40",
};

export default function CompetitiveIntelPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "competitors" | "pricing" | "alerts"
  >("competitors");

  const stats = [
    { label: "Competitors Tracked", value: "28", icon: "🔍", change: "+2" },
    { label: "New Listings", value: "156", icon: "🏠", change: "this week" },
    { label: "Price Changes", value: "34", icon: "📈", change: "last 7 days" },
    { label: "Active Alerts", value: "8", icon: "🔔", change: "unread" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-gold-700/30 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gold-700/20">
          <span className="font-serif text-gold-400 font-bold text-lg">
            Intel
          </span>
          <CloseButton onClick={() => setSidebarOpen(false)} size="sm" />
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {(["competitors", "pricing", "alerts"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setActiveTab(t);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-sans capitalize transition-colors ${
                activeTab === t
                  ? "bg-gold-700/20 text-gold-300 border border-gold-700/40"
                  : "text-muted-foreground hover:bg-obsidian-800/60 hover:text-gold-300"
              }`}
              data-ocid={`intel.sidebar.${t}_tab`}
            >
              {t === "competitors"
                ? "🏛️ Competitors"
                : t === "pricing"
                  ? "💰 Price Comparison"
                  : "🔔 Alert Feed"}
            </button>
          ))}
        </nav>
      </aside>
      {sidebarOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setSidebarOpen(false);
            }
          }}
        />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-card border-b border-gold-700/20">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg border border-gold-700/30 text-gold-400"
            data-ocid="intel.menu_button"
            aria-label="Open menu"
          >
            <span className="block w-4 h-0.5 bg-current mb-1" />
            <span className="block w-4 h-0.5 bg-current mb-1" />
            <span className="block w-4 h-0.5 bg-current" />
          </button>
          <BackButton />
          <h1 className="font-serif font-bold text-gold-300 text-xl">
            Competitive Intelligence
          </h1>
          <span className="ml-auto text-xs text-muted-foreground font-sans">
            MSTC GLOBAL
          </span>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-card border border-gold-700/20 rounded-xl p-4"
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-serif text-xl text-gold-300 font-bold">
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground font-sans mt-0.5">
                  {s.label}
                </div>
                <div className="text-xs text-amber-400 font-sans mt-1">
                  {s.change}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto lg:hidden pb-1">
            {(["competitors", "pricing", "alerts"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-sans capitalize whitespace-nowrap border transition-colors ${
                  activeTab === t
                    ? "bg-gold-700/20 text-gold-300 border-gold-700/40"
                    : "text-muted-foreground border-gold-800/20"
                }`}
                data-ocid={`intel.tab.${t}`}
              >
                {t}
              </button>
            ))}
          </div>

          {activeTab === "competitors" && (
            <section>
              <h2 className="font-serif text-lg text-gold-300 mb-3">
                Competitor Tracker
              </h2>
              <div className="overflow-x-auto rounded-xl border border-gold-700/20">
                <table className="w-full min-w-[700px] text-sm font-sans">
                  <thead>
                    <tr className="bg-obsidian-800/60">
                      {[
                        "#",
                        "Company",
                        "City",
                        "Specialization",
                        "Market Share",
                        "Active Listings",
                        "Avg. Price",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-gold-400 font-semibold text-xs uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPETITORS.map((c, i) => (
                      <tr
                        key={c.id}
                        className="border-t border-gold-800/15 hover:bg-obsidian-800/30"
                        data-ocid={`intel.competitor.item.${i + 1}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3 text-foreground font-medium">
                          {c.name}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {c.city}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {c.specialization}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 bg-obsidian-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gold-500 rounded-full"
                                style={{ width: `${(c.share / 10) * 100}%` }}
                              />
                            </div>
                            <span className="text-gold-300 text-xs">
                              {c.share}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {c.listings}
                        </td>
                        <td className="px-4 py-3 text-gold-300">
                          {c.avgPrice}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "pricing" && (
            <section>
              <h2 className="font-serif text-lg text-gold-300 mb-3">
                Price Comparison: MSTC vs Market
              </h2>
              <div className="overflow-x-auto rounded-xl border border-gold-700/20">
                <table className="w-full min-w-[500px] text-sm font-sans">
                  <thead>
                    <tr className="bg-obsidian-800/60">
                      {[
                        "Property Type",
                        "MSTC Price",
                        "Market Avg.",
                        "Difference",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-gold-400 font-semibold text-xs uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PRICE_COMPARE.map((p, i) => (
                      <tr
                        key={p.type}
                        className="border-t border-gold-800/15 hover:bg-obsidian-800/30"
                        data-ocid={`intel.price.item.${i + 1}`}
                      >
                        <td className="px-4 py-3 text-foreground font-medium">
                          {p.type}
                        </td>
                        <td className="px-4 py-3 text-gold-300 font-semibold">
                          {p.mstc}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {p.market}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-sm font-semibold ${p.diff.startsWith("-") ? "text-emerald-400" : "text-red-400"}`}
                          >
                            {p.trend} {p.diff}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "alerts" && (
            <section>
              <h2 className="font-serif text-lg text-gold-300 mb-3">
                Competitor Activity Feed
              </h2>
              <div className="space-y-3">
                {ALERTS.map((a, i) => (
                  <div
                    key={a.id}
                    className="bg-card border border-gold-700/20 rounded-xl p-4"
                    data-ocid={`intel.alert.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs border ${severityColor[a.severity]}`}
                          >
                            {a.severity.toUpperCase()}
                          </span>
                          <span className="font-serif text-gold-300 font-semibold text-sm truncate">
                            {a.company}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground font-sans">
                          {a.activity}
                        </p>
                      </div>
                      <span className="text-xs text-gold-600 font-sans shrink-0">
                        {a.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
