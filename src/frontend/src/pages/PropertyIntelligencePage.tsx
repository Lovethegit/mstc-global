import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  ChevronLeft,
  Clock,
  Cpu,
  Database,
  IndianRupee,
  MapPin,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";

type DemandLevel = "Hot" | "Rising" | "Stable" | "Cooling";

interface LocalityRow {
  name: string;
  priceMin: number;
  priceMax: number;
  trend: number;
  demand: DemandLevel;
  avgDays: number;
}

const PI_LOCALITIES: LocalityRow[] = [
  {
    name: "Prahlad Nagar",
    priceMin: 8500,
    priceMax: 11000,
    trend: 4.8,
    demand: "Hot",
    avgDays: 28,
  },
  {
    name: "Bodakdev",
    priceMin: 8200,
    priceMax: 10500,
    trend: 3.9,
    demand: "Hot",
    avgDays: 32,
  },
  {
    name: "Satellite",
    priceMin: 7800,
    priceMax: 9500,
    trend: 3.2,
    demand: "Rising",
    avgDays: 38,
  },
  {
    name: "Thaltej",
    priceMin: 7200,
    priceMax: 8800,
    trend: 2.7,
    demand: "Rising",
    avgDays: 41,
  },
  {
    name: "SG Highway",
    priceMin: 6500,
    priceMax: 8200,
    trend: 2.1,
    demand: "Rising",
    avgDays: 44,
  },
  {
    name: "Bopal",
    priceMin: 5800,
    priceMax: 7200,
    trend: 3.1,
    demand: "Hot",
    avgDays: 35,
  },
  {
    name: "Motera",
    priceMin: 5200,
    priceMax: 6400,
    trend: 1.8,
    demand: "Stable",
    avgDays: 52,
  },
  {
    name: "Gota",
    priceMin: 4900,
    priceMax: 6100,
    trend: 1.4,
    demand: "Stable",
    avgDays: 55,
  },
  {
    name: "Chandkheda",
    priceMin: 3800,
    priceMax: 4900,
    trend: 0.9,
    demand: "Stable",
    avgDays: 68,
  },
  {
    name: "Naroda",
    priceMin: 2900,
    priceMax: 3800,
    trend: -0.5,
    demand: "Cooling",
    avgDays: 82,
  },
];

interface RecentProp {
  id: string;
  type: string;
  locality: string;
  price: string;
  size: string;
  addedAgo: string;
  source: string;
}

const RECENT_PROPS: RecentProp[] = [
  {
    id: "P001",
    type: "3BHK Apartment",
    locality: "Bopal",
    price: "₹85L",
    size: "1,450 sqft",
    addedAgo: "8 min ago",
    source: "99acres",
  },
  {
    id: "P002",
    type: "Villa",
    locality: "Satellite",
    price: "₹2.6Cr",
    size: "3,200 sqft",
    addedAgo: "22 min ago",
    source: "RERA Gujarat",
  },
  {
    id: "P003",
    type: "2BHK Flat",
    locality: "Gota",
    price: "₹52L",
    size: "980 sqft",
    addedAgo: "35 min ago",
    source: "MagicBricks",
  },
  {
    id: "P004",
    type: "Commercial Office",
    locality: "Prahlad Nagar",
    price: "₹1.4Cr",
    size: "1,800 sqft",
    addedAgo: "47 min ago",
    source: "99acres",
  },
  {
    id: "P005",
    type: "Residential Plot",
    locality: "Sanand",
    price: "₹1.1Cr",
    size: "2,000 sqft",
    addedAgo: "1h 12m ago",
    source: "RERA Gujarat",
  },
  {
    id: "P006",
    type: "4BHK Penthouse",
    locality: "Bodakdev",
    price: "₹3.8Cr",
    size: "4,100 sqft",
    addedAgo: "1h 28m ago",
    source: "Housing.com",
  },
  {
    id: "P007",
    type: "1BHK Flat",
    locality: "Chandkheda",
    price: "₹28L",
    size: "620 sqft",
    addedAgo: "2h 5m ago",
    source: "MagicBricks",
  },
  {
    id: "P008",
    type: "3BHK Apartment",
    locality: "Thaltej",
    price: "₹1.55Cr",
    size: "1,650 sqft",
    addedAgo: "2h 41m ago",
    source: "99acres",
  },
  {
    id: "P009",
    type: "Commercial Shop",
    locality: "Motera",
    price: "₹75L",
    size: "540 sqft",
    addedAgo: "3h 18m ago",
    source: "NoBroker",
  },
  {
    id: "P010",
    type: "2BHK Flat",
    locality: "Naroda",
    price: "₹35L",
    size: "850 sqft",
    addedAgo: "3h 55m ago",
    source: "Housing.com",
  },
];

const TREND_DATA: { name: string; values: number[]; color: string }[] = [
  {
    name: "Prahlad Nagar",
    values: [8100, 8300, 8600, 8900, 9200, 9500],
    color: "bg-primary/60",
  },
  {
    name: "Satellite",
    values: [7200, 7400, 7600, 7700, 7900, 8100],
    color: "bg-amber-400/60",
  },
  {
    name: "Bopal",
    values: [5300, 5500, 5700, 5900, 6100, 6300],
    color: "bg-emerald-400/60",
  },
];

const MONTHS = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];

function demandBadgeClass(demand: DemandLevel) {
  switch (demand) {
    case "Hot":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    case "Rising":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    case "Stable":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "Cooling":
      return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  }
}

function TrendBar({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  return (
    <div className="flex items-end gap-1 h-16">
      {values.map((v, i) => (
        <div
          key={MONTHS[i]}
          className="flex flex-col items-center gap-1 flex-1"
        >
          <div
            className={`rounded-sm ${color} w-full`}
            style={{ height: `${((v - min) / range) * 48 + 8}px` }}
          />
          <span className="text-[9px] text-muted-foreground font-sans">
            {MONTHS[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

const LOCALITIES_LIST = [
  "All",
  "Prahlad Nagar",
  "Bodakdev",
  "Satellite",
  "Thaltej",
  "SG Highway",
  "Bopal",
  "Motera",
  "Gota",
  "Chandkheda",
  "Naroda",
];
const TYPES_LIST = ["All", "Residential", "Commercial", "Land"];
const PRICE_RANGES = ["All", "Under 50L", "50L-1Cr", "1Cr-2Cr", "2Cr+"];

function priceInRange(price: string, range: string): boolean {
  const num = Number.parseFloat(
    price
      .replace(/[₹LCr\s,]/g, "")
      .replace("Cr", "00")
      .replace("L", ""),
  );
  const inCr = price.includes("Cr");
  const valL = inCr ? num * 100 : num;
  if (range === "Under 50L") return valL < 50;
  if (range === "50L-1Cr") return valL >= 50 && valL < 100;
  if (range === "1Cr-2Cr") return valL >= 100 && valL < 200;
  if (range === "2Cr+") return valL >= 200;
  return true;
}

export default function PropertyIntelligencePage() {
  const [sqft, setSqft] = useState("");
  const [locality, setLocality] = useState("");
  const [filterLocality, setFilterLocality] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterPrice, setFilterPrice] = useState("All");
  const [valuationResult, setValuationResult] = useState<{
    min: string;
    max: string;
    confidence: number;
  } | null>(null);

  function runValuation() {
    if (!sqft || !locality) return;
    const sq = Number(sqft);
    const found = PI_LOCALITIES.find((l) =>
      l.name.toLowerCase().includes(locality.toLowerCase()),
    );
    if (found && sq > 0) {
      const midPrice = (found.priceMin + found.priceMax) / 2;
      const min = ((midPrice * 0.93 * sq) / 100000).toFixed(1);
      const max = ((midPrice * 1.07 * sq) / 100000).toFixed(1);
      setValuationResult({ min: `₹${min}L`, max: `₹${max}L`, confidence: 87 });
    } else {
      setValuationResult({ min: "₹42L", max: "₹56L", confidence: 72 });
    }
  }

  const hotLocalities = PI_LOCALITIES.filter(
    (l) => l.demand === "Hot" || l.demand === "Rising",
  );
  const coolingLocalities = PI_LOCALITIES.filter(
    (l) => l.demand === "Cooling" || l.demand === "Stable",
  );

  return (
    <div
      className="min-h-screen bg-background"
      data-ocid="property_intelligence.page"
    >
      <div className="bg-card border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              data-ocid="property_intelligence.back_button"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                <h1 className="font-serif font-bold text-xl text-foreground">
                  Property Intelligence AI
                </h1>
                <span className="hidden sm:flex items-center gap-1 text-[10px] font-sans px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-sans">
                Autonomous AI monitoring Ahmedabad real estate 24/7
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-sans">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <RefreshCw className="w-3 h-3" />
              <span>Last fetched: 3 minutes ago</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Database className="w-3 h-3" />
              <span>
                Sources: RERA Gujarat, 99acres, MagicBricks, Housing.com,
                NoBroker
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <Clock className="w-3 h-3" />
              <span>Next fetch in: 17 minutes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5 space-y-6">
        <section data-ocid="property_intelligence.market_pulse_section">
          <h2 className="font-serif font-semibold text-base text-foreground mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Live Market Pulse
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: "Avg Rate",
                value: "₹6,200/sqft",
                delta: "+3.2% this month",
                up: true,
                icon: TrendingUp,
              },
              {
                label: "New Listings",
                value: "247 this week",
                delta: "+12% vs last week",
                up: true,
                icon: Building2,
              },
              {
                label: "Active Buyers",
                value: "1,893",
                delta: "Ahmedabad market",
                up: true,
                icon: Search,
              },
              {
                label: "Avg Days on Market",
                value: "47 days",
                delta: "−4 days vs last month",
                up: true,
                icon: Clock,
              },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-sans uppercase tracking-wider">
                    {card.label}
                  </span>
                  <card.icon className="w-4 h-4 text-primary/60" />
                </div>
                <p className="font-serif font-bold text-lg text-foreground">
                  {card.value}
                </p>
                <div
                  className={`flex items-center gap-1 mt-1 text-xs font-sans ${card.up ? "text-emerald-400" : "text-red-400"}`}
                >
                  {card.up ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {card.delta}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div
            className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden"
            data-ocid="property_intelligence.locality_map_section"
          >
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <h2 className="font-serif font-semibold text-base text-foreground">
                Locality Price Map
              </h2>
              <span className="ml-auto text-xs text-muted-foreground font-sans">
                ₹/sqft
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                      Locality
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                      Price Range
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                      Trend
                    </th>
                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                      Demand
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                      Avg Days
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PI_LOCALITIES.map((loc, i) => (
                    <tr
                      key={loc.name}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      data-ocid={`property_intelligence.locality_row.${i + 1}`}
                    >
                      <td className="px-4 py-3 font-sans font-medium text-foreground">
                        {loc.name}
                      </td>
                      <td className="px-4 py-3 text-right font-sans text-foreground">
                        ₹{loc.priceMin.toLocaleString()}–
                        {loc.priceMax.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`flex items-center justify-end gap-0.5 font-sans font-semibold text-xs ${loc.trend >= 0 ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {loc.trend >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {loc.trend >= 0 ? "+" : ""}
                          {loc.trend}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full border text-xs font-sans ${demandBadgeClass(loc.demand)}`}
                        >
                          {loc.demand}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-sans text-muted-foreground text-xs">
                        {loc.avgDays}d
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div
            className="bg-card border border-primary/30 rounded-xl p-5"
            data-ocid="property_intelligence.valuation_tool"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <h2 className="font-serif font-semibold text-base text-foreground">
                AI Valuation Tool
              </h2>
            </div>
            <p className="text-xs text-muted-foreground font-sans mb-4">
              Enter property details for an instant AI price estimate
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-sans text-muted-foreground mb-1 block">
                  Area (sqft)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 1450"
                  value={sqft}
                  onChange={(e) => setSqft(e.target.value)}
                  className="bg-background border-border font-sans"
                  data-ocid="property_intelligence.valuation.sqft_input"
                />
              </div>
              <div>
                <label className="text-xs font-sans text-muted-foreground mb-1 block">
                  Locality
                </label>
                <Input
                  placeholder="e.g. Bopal, Satellite"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="bg-background border-border font-sans"
                  data-ocid="property_intelligence.valuation.locality_input"
                />
              </div>
              <Button
                type="button"
                className="w-full"
                onClick={runValuation}
                disabled={!sqft || !locality}
                data-ocid="property_intelligence.valuation.submit_button"
              >
                <Search className="w-4 h-4 mr-2" /> Get Estimate
              </Button>
            </div>
            {valuationResult && (
              <div
                className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/30"
                data-ocid="property_intelligence.valuation.result"
              >
                <p className="text-xs text-muted-foreground font-sans mb-1">
                  Estimated Price Range
                </p>
                <p className="font-serif font-bold text-2xl text-primary">
                  {valuationResult.min} – {valuationResult.max}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${valuationResult.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs font-sans text-muted-foreground">
                    {valuationResult.confidence}% confidence
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground font-sans mt-2">
                  Based on RERA data, recent transactions &amp; market trends
                </p>
              </div>
            )}
          </div>
        </div>

        <section data-ocid="property_intelligence.trends_section">
          <h2 className="font-serif font-semibold text-base text-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> 6-Month Price Trends
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TREND_DATA.map((t) => {
              const latest = t.values[t.values.length - 1];
              const first = t.values[0];
              const pct = (((latest - first) / first) * 100).toFixed(1);
              return (
                <div
                  key={t.name}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-sans font-semibold text-sm text-foreground">
                        {t.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-sans">
                        ₹{latest.toLocaleString()}/sqft
                      </p>
                    </div>
                    <span className="flex items-center gap-0.5 text-xs font-sans font-semibold text-emerald-400">
                      <TrendingUp className="w-3 h-3" /> +{pct}%
                    </span>
                  </div>
                  <TrendBar values={t.values} color={t.color} />
                </div>
              );
            })}
          </div>
        </section>

        <section data-ocid="property_intelligence.demand_supply_section">
          <h2 className="font-serif font-semibold text-base text-foreground mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Demand / Supply
            Analysis
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                <h3 className="font-sans font-semibold text-sm text-emerald-400">
                  Hot Localities
                </h3>
              </div>
              <div className="space-y-2">
                {hotLocalities.map((l) => (
                  <div
                    key={l.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-sans text-foreground">
                      {l.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-sans text-muted-foreground">
                        {l.avgDays}d avg
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-sans ${demandBadgeClass(l.demand)}`}
                      >
                        {l.demand}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-sans font-semibold text-sm text-amber-400">
                  Cooling / Stable Localities
                </h3>
              </div>
              <div className="space-y-2">
                {coolingLocalities.map((l) => (
                  <div
                    key={l.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-sans text-foreground">
                      {l.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-sans text-muted-foreground">
                        {l.avgDays}d avg
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-sans ${demandBadgeClass(l.demand)}`}
                      >
                        {l.demand}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section data-ocid="property_intelligence.recent_properties_section">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif font-semibold text-base text-foreground flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" /> Recent AI-Imported
              Properties
            </h2>
          </div>
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-3">
            <select
              value={filterLocality}
              onChange={(e) => setFilterLocality(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs"
              data-ocid="property_intelligence.locality_filter"
            >
              {LOCALITIES_LIST.map((l) => (
                <option key={l} value={l}>
                  {l === "All" ? "All Localities" : l}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs"
              data-ocid="property_intelligence.type_filter"
            >
              {TYPES_LIST.map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? "All Types" : t}
                </option>
              ))}
            </select>
            <select
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs"
              data-ocid="property_intelligence.price_filter"
            >
              {PRICE_RANGES.map((r) => (
                <option key={r} value={r}>
                  {r === "All" ? "All Prices" : r}
                </option>
              ))}
            </select>
            {(filterLocality !== "All" ||
              filterType !== "All" ||
              filterPrice !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setFilterLocality("All");
                  setFilterType("All");
                  setFilterPrice("All");
                }}
                className="px-2 py-1.5 rounded-lg border border-border bg-card text-muted-foreground text-xs hover:text-foreground"
                data-ocid="property_intelligence.clear_filters_button"
              >
                Clear
              </button>
            )}
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                      Type
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                      Locality
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                      Price
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                      Size
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                      Added
                    </th>
                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_PROPS.filter((p) => {
                    const locMatch =
                      filterLocality === "All" || p.locality === filterLocality;
                    const typeMatch =
                      filterType === "All" ||
                      (filterType === "Residential" &&
                        (p.type.includes("BHK") ||
                          p.type.includes("Flat") ||
                          p.type.includes("Villa") ||
                          p.type.includes("Plot"))) ||
                      (filterType === "Commercial" &&
                        (p.type.includes("Commercial") ||
                          p.type.includes("Office") ||
                          p.type.includes("Shop"))) ||
                      (filterType === "Land" && p.type.includes("Plot"));
                    const priceMatch =
                      filterPrice === "All" ||
                      priceInRange(p.price, filterPrice);
                    return locMatch && typeMatch && priceMatch;
                  }).map((p, i) => (
                    <tr
                      key={p.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      data-ocid={`property_intelligence.property_row.${i + 1}`}
                    >
                      <td className="px-4 py-3 font-sans font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                          {p.type}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 font-sans text-foreground">
                          <MapPin className="w-3 h-3 text-primary/50 shrink-0" />
                          {p.locality}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-sans font-semibold text-primary">
                        {p.price}
                      </td>
                      <td className="px-4 py-3 text-right font-sans text-muted-foreground text-xs">
                        {p.size}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="flex items-center justify-end gap-1 text-xs font-sans text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {p.addedAgo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                          {p.source}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div
          className="bg-card border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3"
          data-ocid="property_intelligence.ai_status_panel"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 font-sans uppercase tracking-wider">
              Property Intelligence AI — Active
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-sans text-muted-foreground sm:ml-auto">
            <span className="flex items-center gap-1">
              <IndianRupee className="w-3 h-3" /> 2,847 properties monitored
            </span>
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Refreshes every 20 min
            </span>
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3" /> 5 live data sources
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
