import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COMPETITORS = [
  {
    id: 1,
    name: "Arvind SmartSpaces",
    listings: 284,
    specialization: "Residential townships, plotted development",
    founded: 2012,
    activities: [
      "Launched Phase 3 of Uplands at SG Highway",
      "Price revision +8% in Q1 2026",
      "36 deals closed in April 2026",
    ],
    share: 18,
    color: "#3b82f6",
  },
  {
    id: 2,
    name: "Shivalik Group",
    listings: 196,
    specialization: "Luxury residential, commercial",
    founded: 1985,
    activities: [
      "New high-rise at Motera",
      "RERA complaint resolved Q4 2025",
      "Partnered with HDFC for easy home loans",
    ],
    share: 14,
    color: "#8b5cf6",
  },
  {
    id: 3,
    name: "Goyal & Co. Realty",
    listings: 168,
    specialization: "Mid-segment residential, Ahmedabad west",
    founded: 1998,
    activities: [
      "New project in Chandkheda under PMAY",
      "Targeting first-time buyers with sub-50L flats",
      "Digital marketing push via Google Ads",
    ],
    share: 11,
    color: "#22c55e",
  },
  {
    id: 4,
    name: "Narayan Buildcon",
    listings: 142,
    specialization: "Commercial & industrial properties",
    founded: 2005,
    activities: [
      "New warehousing cluster near GIDC Vatva",
      "JV with Singapore fund for logistics park",
      "Acquired 12-acre land at Sanand",
    ],
    share: 9,
    color: "#f59e0b",
  },
  {
    id: 5,
    name: "Panchratna Realty",
    listings: 98,
    specialization: "Redevelopment & RERA consulting",
    founded: 2009,
    activities: [
      "Redeveloping 3 societies in Naranpura",
      "New RERA advisory division launched",
      "Tie-up with local banking for home loans",
    ],
    share: 8,
    color: "#ec4899",
  },
];

const MARKET_SHARE = [
  { name: "MSTC GLOBAL", value: 12, color: "#c9a84c" },
  ...COMPETITORS.map((c) => ({ name: c.name, value: c.share, color: c.color })),
  { name: "Others", value: 28, color: "#374151" },
];

const FEATURES = [
  {
    feature: "RERA Compliance AI",
    MSTC: true,
    Arvind: false,
    Shivalik: false,
    Goyal: false,
    Narayan: false,
  },
  {
    feature: "Multi-service Platform",
    MSTC: true,
    Arvind: false,
    Shivalik: false,
    Goyal: false,
    Narayan: false,
  },
  {
    feature: "Digital Portal",
    MSTC: true,
    Arvind: true,
    Shivalik: true,
    Goyal: false,
    Narayan: false,
  },
  {
    feature: "NRI Services",
    MSTC: true,
    Arvind: true,
    Shivalik: false,
    Goyal: false,
    Narayan: false,
  },
  {
    feature: "CSR / NGO Division",
    MSTC: true,
    Arvind: false,
    Shivalik: false,
    Goyal: false,
    Narayan: false,
  },
  {
    feature: "Finance & Home Loans",
    MSTC: true,
    Arvind: true,
    Shivalik: true,
    Goyal: true,
    Narayan: false,
  },
  {
    feature: "Events & Hospitality",
    MSTC: true,
    Arvind: false,
    Shivalik: false,
    Goyal: false,
    Narayan: false,
  },
  {
    feature: "Music & Culture",
    MSTC: true,
    Arvind: false,
    Shivalik: false,
    Goyal: false,
    Narayan: false,
  },
];

export default function CompetitorsPage() {
  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1
              className="text-2xl font-bold text-gold-400"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Competitive Intelligence
            </h1>
            <p className="text-sm text-muted-foreground">
              Ahmedabad real estate market – competitor analysis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Market Share */}
            <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
              <h2 className="font-bold text-gold-300 mb-4">
                Market Share Estimation
              </h2>
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={MARKET_SHARE}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {MARKET_SHARE.map((m) => (
                      <Cell key={m.name} fill={m.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => `${v}%`}
                    contentStyle={{
                      background: "#0d1117",
                      border: "1px solid #c9a84c40",
                      borderRadius: 8,
                      color: "#f5d78e",
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10, color: "#a08050" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* AI Summary */}
            <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
              <h2 className="font-bold text-gold-300 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                AI Competitive Analysis
              </h2>
              <div className="space-y-3 text-sm">
                <div className="border border-green-700/30 bg-green-900/10 rounded-lg p-3">
                  <p className="text-green-400 font-semibold text-xs mb-1">
                    MSTC Strengths
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Unique multi-service model covering 8 business verticals. No
                    other Ahmedabad competitor offers RERA + Finance + Music +
                    NGO + Tourism under one brand. Strong RERA consulting moat.
                    First-mover AI advantage.
                  </p>
                </div>
                <div className="border border-amber-700/30 bg-amber-900/10 rounded-lg p-3">
                  <p className="text-amber-400 font-semibold text-xs mb-1">
                    Opportunities
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Shela & Thaltej micro-markets growing fastest (+12-14% YoY)
                    with no dominant player. NRI segment underpenetrated.
                    Chandkheda infrastructure boom creates first-mover window.
                  </p>
                </div>
                <div className="border border-red-700/30 bg-red-900/10 rounded-lg p-3">
                  <p className="text-red-400 font-semibold text-xs mb-1">
                    Watch
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Arvind SmartSpaces expanding digital presence. Goyal & Co
                    targeting PMAY segment aggressively. Monitor new launches in
                    Motera ahead of Metro Phase 2.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Competitor Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {COMPETITORS.map((c, i) => (
              <div
                key={c.id}
                className="bg-card/80 border border-gold-800/30 rounded-xl p-4 space-y-3"
                data-ocid={`competitors.card.item.${i + 1}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-sm">
                      {c.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Est. {c.founded} · {c.listings} listings
                    </p>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#06090f]"
                    style={{ background: c.color }}
                  >
                    {c.share}%
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {c.specialization}
                </p>
                <div className="space-y-1">
                  {c.activities.map((a) => (
                    <p
                      key={a}
                      className="text-[10px] text-muted-foreground flex items-start gap-1"
                    >
                      <span className="text-gold-600 mt-0.5">•</span>
                      {a}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
            <h2 className="font-bold text-gold-300 mb-3">
              Competitive Positioning Table
            </h2>
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm"
                data-ocid="competitors.positioning.table"
              >
                <thead>
                  <tr className="border-b border-gold-800/30">
                    <th className="text-left py-2 px-3 text-xs text-muted-foreground">
                      Feature
                    </th>
                    {["MSTC", "Arvind", "Shivalik", "Goyal", "Narayan"].map(
                      (h) => (
                        <th
                          key={h}
                          className={`text-center py-2 px-3 text-xs font-medium ${h === "MSTC" ? "text-gold-400" : "text-muted-foreground"}`}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {FEATURES.map((f, i) => (
                    <tr
                      key={f.feature}
                      className="border-b border-gold-800/10"
                      data-ocid={`competitors.feature.item.${i + 1}`}
                    >
                      <td className="py-2 px-3 text-xs text-foreground">
                        {f.feature}
                      </td>
                      {[f.MSTC, f.Arvind, f.Shivalik, f.Goyal, f.Narayan].map(
                        (has, j) => (
                          <td
                            key={`comp-${f.feature}-${j}`}
                            className="py-2 px-3 text-center text-sm"
                          >
                            {has ? "\u2705" : "\u274C"}
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SecureAppGate>
  );
}
