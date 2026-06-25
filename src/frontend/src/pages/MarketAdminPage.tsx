import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  ArrowUpRight,
  Newspaper,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const LOCALITIES = [
  {
    name: "Satellite",
    avgPrice: "8,200",
    range: "7,500–9,500",
    yoy: "+9.2%",
    change: "up",
    demand: 88,
    grade: "A+",
  },
  {
    name: "Bodakdev",
    avgPrice: "9,800",
    range: "8,500–11,000",
    yoy: "+11.4%",
    change: "up",
    demand: 92,
    grade: "A+",
  },
  {
    name: "Prahlad Nagar",
    avgPrice: "8,600",
    range: "7,800–9,500",
    yoy: "+8.7%",
    change: "up",
    demand: 85,
    grade: "A",
  },
  {
    name: "SG Highway",
    avgPrice: "7,400",
    range: "6,500–8,800",
    yoy: "+7.3%",
    change: "up",
    demand: 82,
    grade: "A",
  },
  {
    name: "Navrangpura",
    avgPrice: "9,200",
    range: "8,200–10,500",
    yoy: "+6.8%",
    change: "up",
    demand: 78,
    grade: "A",
  },
  {
    name: "Thaltej",
    avgPrice: "7,800",
    range: "6,800–8,600",
    yoy: "+12.1%",
    change: "up",
    demand: 90,
    grade: "A+",
  },
  {
    name: "Motera",
    avgPrice: "6,200",
    range: "5,500–7,200",
    yoy: "+5.4%",
    change: "up",
    demand: 72,
    grade: "B+",
  },
  {
    name: "Vastrapur",
    avgPrice: "8,900",
    range: "8,000–10,200",
    yoy: "+8.9%",
    change: "up",
    demand: 83,
    grade: "A",
  },
  {
    name: "Chandkheda",
    avgPrice: "5,800",
    range: "5,000–6,800",
    yoy: "+4.2%",
    change: "up",
    demand: 68,
    grade: "B",
  },
  {
    name: "Shela",
    avgPrice: "6,800",
    range: "6,000–7,800",
    yoy: "+14.3%",
    change: "up",
    demand: 94,
    grade: "A+",
  },
];

const NEWS = [
  {
    id: 1,
    headline:
      "Ahmedabad Metro Phase 2 to boost Motera & Chandkheda property values by 15-20%",
    source: "Times of India",
    date: "May 24, 2026",
    tag: "Infrastructure",
  },
  {
    id: 2,
    headline:
      "RBI holds repo rate at 6.5% in June 2026 policy meet; home loan EMIs stable",
    source: "Economic Times",
    date: "May 22, 2026",
    tag: "Finance",
  },
  {
    id: 3,
    headline:
      "Ahmedabad Smart City project to develop 8 new townships along SG Highway corridor",
    source: "Gujarat Samachar",
    date: "May 20, 2026",
    tag: "Real Estate",
  },
  {
    id: 4,
    headline:
      "RERA Gujarat registers record 1,240 projects in Q1 2026; compliance tightens",
    source: "Business Standard",
    date: "May 18, 2026",
    tag: "RERA",
  },
  {
    id: 5,
    headline:
      "Shela emerges as Ahmedabad's fastest growing micro-market; 14%+ YoY appreciation",
    source: "PropTiger Report",
    date: "May 15, 2026",
    tag: "Research",
  },
];

const GRADE_COLORS: Record<string, string> = {
  "A+": "bg-green-900/40 text-green-300 border-green-700/40",
  A: "bg-blue-900/40 text-blue-300 border-blue-700/40",
  "B+": "bg-gold-800/30 text-gold-300 border-gold-700/40",
  B: "bg-amber-900/30 text-amber-300 border-amber-700/40",
};

const TAG_COLORS: Record<string, string> = {
  Infrastructure: "bg-blue-900/30 text-blue-300 border-blue-700/40",
  Finance: "bg-green-900/30 text-green-300 border-green-700/40",
  "Real Estate": "bg-gold-800/30 text-gold-300 border-gold-700/40",
  RERA: "bg-red-900/30 text-red-300 border-red-700/40",
  Research: "bg-purple-900/30 text-purple-300 border-purple-700/40",
};

export default function MarketAdminPage() {
  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Market Pulse Header */}
          <div className="bg-gradient-to-r from-gold-900/40 via-card to-card border border-gold-700/40 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-5 h-5 text-gold-400 animate-pulse" />
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                    Ahmedabad Market Pulse – Live
                  </span>
                </div>
                <h1
                  className="text-2xl font-bold text-gold-300"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Sentiment: <span className="text-green-400">BULLISH 🐂</span>
                </h1>
                <p className="text-muted-foreground text-sm">
                  YoY price growth across all micro-markets
                </p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">+8.4%</p>
                  <p className="text-xs text-muted-foreground">YoY Growth</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gold-400">₹8,200</p>
                  <p className="text-xs text-muted-foreground">Avg ₹/sqft</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">847</p>
                  <p className="text-xs text-muted-foreground">Active Leads</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interest Rate Tracker */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "RBI Repo Rate",
                value: "6.50%",
                sub: "Jun 2026 unchanged",
                color: "text-gold-400",
              },
              {
                label: "Home Loan Rate",
                value: "8.5–9.2%",
                sub: "SBI / HDFC / ICICI",
                color: "text-blue-400",
              },
              {
                label: "EMI per ₹10L",
                value: "₹9,847",
                sub: "20yr @ 8.85% avg",
                color: "text-green-400",
              },
              {
                label: "Market Index",
                value: "128.4",
                sub: "Base 100 = Jan 2022",
                color: "text-purple-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-card/80 border border-gold-800/30 rounded-xl p-4"
              >
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs font-medium text-foreground mt-0.5">
                  {s.label}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Locality Price Index */}
          <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
            <h2 className="font-bold text-gold-300 mb-3">
              Ahmedabad Locality Price Index
            </h2>
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm"
                data-ocid="market.locality.table"
              >
                <thead>
                  <tr className="border-b border-gold-800/30">
                    {[
                      "Locality",
                      "Avg ₹/sqft",
                      "Price Range",
                      "1Y Change",
                      "Demand Score",
                      "Investment Grade",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-3 text-xs text-muted-foreground font-medium whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LOCALITIES.map((l, i) => (
                    <tr
                      key={l.name}
                      className="border-b border-gold-800/10 hover:bg-gold-900/10"
                      data-ocid={`market.locality.item.${i + 1}`}
                    >
                      <td className="py-2 px-3 font-semibold text-foreground">
                        {l.name}
                      </td>
                      <td className="py-2 px-3 text-gold-400 font-bold">
                        ₹{l.avgPrice}
                      </td>
                      <td className="py-2 px-3 text-muted-foreground text-xs">
                        ₹{l.range}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <span className="text-green-400 font-semibold">
                            {l.yoy}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted/40 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gold-500/70 rounded-full"
                              style={{ width: `${l.demand}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {l.demand}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <Badge className={`${GRADE_COLORS[l.grade]} text-xs`}>
                          {l.grade}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* News Feed */}
          <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
            <h2 className="font-bold text-gold-300 mb-3 flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              Real Estate News
            </h2>
            <div className="space-y-3">
              {NEWS.map((n, i) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 border-b border-gold-800/10 pb-3 last:border-0 last:pb-0"
                  data-ocid={`market.news.item.${i + 1}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gold-900/40 flex items-center justify-center flex-shrink-0">
                    <Newspaper className="w-3.5 h-3.5 text-gold-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground font-medium leading-snug">
                      {n.headline}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {n.source} · {n.date}
                      </span>
                      <Badge
                        className={`${TAG_COLORS[n.tag]} text-[9px] px-1.5 py-0`}
                      >
                        {n.tag}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SecureAppGate>
  );
}
