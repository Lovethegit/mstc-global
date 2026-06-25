import SecureAppGate from "@/components/shared/SecureAppGate";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUp,
  BarChart2,
  Building2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Menu,
  Newspaper,
  Shield,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";

const LOCALITIES = [
  {
    name: "Prahlad Nagar",
    avg: 8200,
    yoy: 9.8,
    demand: 88,
    type: "Premium Residential",
    sqft: "1,200–4,500",
  },
  {
    name: "Bodakdev",
    avg: 9100,
    yoy: 11.2,
    demand: 91,
    type: "Luxury Residential",
    sqft: "1,500–5,000",
  },
  {
    name: "SG Highway Corridor",
    avg: 7400,
    yoy: 8.5,
    demand: 84,
    type: "Commercial + Residential",
    sqft: "500–3,000",
  },
  {
    name: "Satellite",
    avg: 7800,
    yoy: 7.9,
    demand: 80,
    type: "Premium Residential",
    sqft: "900–3,500",
  },
  {
    name: "Navrangpura",
    avg: 8600,
    yoy: 6.8,
    demand: 82,
    type: "Commercial Hub",
    sqft: "300–2,500",
  },
  {
    name: "Thaltej",
    avg: 6900,
    yoy: 12.3,
    demand: 87,
    type: "Emerging Premium",
    sqft: "1,000–3,800",
  },
  {
    name: "Chandkheda",
    avg: 4800,
    yoy: 14.1,
    demand: 76,
    type: "Affordable Residential",
    sqft: "700–2,200",
  },
  {
    name: "Bopal",
    avg: 5200,
    yoy: 13.7,
    demand: 79,
    type: "Mid-Segment",
    sqft: "800–2,800",
  },
  {
    name: "Gota",
    avg: 4400,
    yoy: 10.5,
    demand: 72,
    type: "Affordable",
    sqft: "600–2,000",
  },
  {
    name: "Vastrapur",
    avg: 8900,
    yoy: 7.2,
    demand: 83,
    type: "Premium Lake-Side",
    sqft: "1,200–4,200",
  },
  {
    name: "Maninagar",
    avg: 4100,
    yoy: 8.9,
    demand: 68,
    type: "Established Residential",
    sqft: "500–1,800",
  },
  {
    name: "Naroda",
    avg: 3200,
    yoy: 9.1,
    demand: 65,
    type: "Industrial + Residential",
    sqft: "500–1,500",
  },
  {
    name: "GIFT City",
    avg: 6100,
    yoy: 18.4,
    demand: 92,
    type: "Financial District",
    sqft: "600–3,000",
  },
  {
    name: "Motera",
    avg: 5600,
    yoy: 11.8,
    demand: 77,
    type: "Sports City",
    sqft: "700–2,400",
  },
  {
    name: "Shela",
    avg: 5100,
    yoy: 15.2,
    demand: 81,
    type: "Emerging West",
    sqft: "800–3,200",
  },
];

const NEWS = [
  {
    headline: "GIFT City Phase 3 — 12 New Towers Approved by IFSCA",
    date: "Jun 22, 2026",
    tag: "GIFT City",
    src: "Times of India",
  },
  {
    headline: "Ahmedabad Metro Phase 2 Extension to GIFT City Gets Cabinet Nod",
    date: "Jun 18, 2026",
    tag: "Infrastructure",
    src: "Indian Express",
  },
  {
    headline: "RBI Keeps Repo Rate Unchanged at 6.50% — June 2026 MPC Meeting",
    date: "Jun 7, 2026",
    tag: "Finance",
    src: "Business Standard",
  },
  {
    headline:
      "Gujarat RERA Q1 2026: 847 New Projects Registered, Ahmedabad Tops",
    date: "Jun 5, 2026",
    tag: "RERA",
    src: "Gujarat Samachar",
  },
  {
    headline: "Bopal–Ghuma Road Widening to 6 Lanes — AMC Begins Acquisition",
    date: "May 30, 2026",
    tag: "Infrastructure",
    src: "Sandesh",
  },
  {
    headline: "SBI Home Loan Rate Cut to 8.50% — Effective June 1, 2026",
    date: "May 28, 2026",
    tag: "Finance",
    src: "Mint",
  },
  {
    headline: "Prahlad Nagar Sees 24% Rise in New Launches — Q1 2026 Report",
    date: "May 25, 2026",
    tag: "Market",
    src: "ANAROCK",
  },
  {
    headline: "Thaltej Smart Township Project — ₹2,200 Cr Investment Announced",
    date: "May 20, 2026",
    tag: "Development",
    src: "Economic Times",
  },
  {
    headline:
      "Gujarat Jantri Rate Revision — New Rates for Ahmedabad Announced",
    date: "May 15, 2026",
    tag: "Policy",
    src: "Gujarat Government",
  },
  {
    headline: "NRI Investment in Ahmedabad Real Estate Surges 34% in 2025–26",
    date: "May 10, 2026",
    tag: "NRI",
    src: "NRI Times",
  },
];

const INTEREST_RATES = [
  { inst: "RBI Repo Rate", rate: "6.50%", change: "0.00%", since: "Feb 2025" },
  { inst: "SBI Home Loan", rate: "8.50%", change: "-0.10%", since: "Jun 2026" },
  { inst: "HDFC Bank", rate: "8.65%", change: "0.00%", since: "Apr 2026" },
  { inst: "ICICI Bank", rate: "8.75%", change: "0.00%", since: "Apr 2026" },
  {
    inst: "Bank of Baroda",
    rate: "8.40%",
    change: "-0.15%",
    since: "May 2026",
  },
  { inst: "LIC HFL", rate: "8.75%", change: "0.00%", since: "Mar 2026" },
  { inst: "Bajaj HFL", rate: "8.48%", change: "-0.07%", since: "Jun 2026" },
  { inst: "PNB Housing", rate: "8.55%", change: "-0.10%", since: "May 2026" },
];

const PRICE_INDEX = [
  { year: "2022", avg: 3840, cagr: "—" },
  { year: "2023", avg: 4150, cagr: "+8.1%" },
  { year: "2024", avg: 4480, cagr: "+7.9%" },
  { year: "2025", avg: 4810, cagr: "+7.4%" },
  { year: "2026 (YTD)", avg: 5120, cagr: "+6.4%" },
];

const INFRA_PROJECTS = [
  {
    name: "Ahmedabad Metro Phase 2B",
    status: "Under Construction",
    completion: "Dec 2027",
    impact: "High",
  },
  {
    name: "GIFT City Phase 3 Towers",
    status: "Approved",
    completion: "Mar 2028",
    impact: "Very High",
  },
  {
    name: "Sardar Patel Ring Road Ext.",
    status: "Under Construction",
    completion: "Sep 2026",
    impact: "Medium",
  },
  {
    name: "Bopal–Ghuma 6-Lane Road",
    status: "Land Acquisition",
    completion: "Jun 2027",
    impact: "High",
  },
  {
    name: "Ahmedabad Smart City 3.0",
    status: "Phase 2 Active",
    completion: "Dec 2026",
    impact: "Medium",
  },
  {
    name: "New Cargo Terminal — SVPI",
    status: "Under Construction",
    completion: "Mar 2027",
    impact: "Medium",
  },
];

const COMPETITORS = [
  {
    name: "PropTiger Ahmedabad",
    listings: 1247,
    share: "18.2%",
    focus: "Residential",
  },
  {
    name: "Square Yards AHD",
    listings: 983,
    share: "14.4%",
    focus: "Premium + Commercial",
  },
  {
    name: "MagicBricks Local",
    listings: 2104,
    share: "30.7%",
    focus: "Pan Ahmedabad",
  },
  {
    name: "99acres Gujarat",
    listings: 1876,
    share: "27.4%",
    focus: "Pan Gujarat",
  },
  { name: "MSTC GLOBAL", listings: 412, share: "6.0%", focus: "Luxury + RERA" },
  {
    name: "Local Brokers (est.)",
    listings: 231,
    share: "3.3%",
    focus: "Neighbourhood",
  },
];

const RERA_FILINGS = [
  {
    project: "Sattva Serene Residency",
    builder: "Sattva Group",
    type: "Residential",
    units: 240,
    registered: "Mar 2026",
    status: "Active",
    flag: null,
  },
  {
    project: "Bodakdev Commercial Hub",
    builder: "Ganesh Housing",
    type: "Commercial",
    units: 80,
    registered: "Apr 2026",
    status: "Active",
    flag: null,
  },
  {
    project: "Thaltej Heights",
    builder: "Narnarayan Dev",
    type: "Residential",
    units: 320,
    registered: "Jan 2026",
    status: "Delayed",
    flag: "18-month delivery delay",
  },
  {
    project: "Prahlad Galaxy",
    builder: "Galaxy Group",
    type: "Residential",
    units: 180,
    registered: "Dec 2025",
    status: "Complaint",
    flag: "3 buyer complaints filed",
  },
  {
    project: "GIFT City Towers 9",
    builder: "IFSCA Developer",
    type: "Commercial",
    units: 60,
    registered: "May 2026",
    status: "Active",
    flag: null,
  },
  {
    project: "Bopal Green Acres",
    builder: "Green Home Infra",
    type: "Residential",
    units: 150,
    registered: "Feb 2026",
    status: "Active",
    flag: null,
  },
];

const PREDICTIONS = [
  {
    locality: "Bopal",
    forecast6m: "+5-8%",
    forecast1y: "+12-15%",
    driver: "Metro Phase 2B corridor",
    confidence: 88,
  },
  {
    locality: "GIFT City",
    forecast6m: "+8-12%",
    forecast1y: "+18-22%",
    driver: "IFSCA Phase 3 + fintech boom",
    confidence: 92,
  },
  {
    locality: "Thaltej",
    forecast6m: "+6-10%",
    forecast1y: "+14-18%",
    driver: "Rs 2,200 Cr smart township",
    confidence: 85,
  },
  {
    locality: "Prahlad Nagar",
    forecast6m: "+4-6%",
    forecast1y: "+9-12%",
    driver: "Premium demand, low supply",
    confidence: 82,
  },
  {
    locality: "Shela",
    forecast6m: "+7-11%",
    forecast1y: "+15-20%",
    driver: "Westward expansion wave",
    confidence: 79,
  },
  {
    locality: "Chandkheda",
    forecast6m: "+3-5%",
    forecast1y: "+8-11%",
    driver: "Affordable housing demand",
    confidence: 75,
  },
];

const TAG_COLORS: Record<string, string> = {
  "GIFT City": "bg-blue-900/30 text-blue-300",
  Infrastructure: "bg-orange-900/30 text-orange-300",
  Finance: "bg-green-900/30 text-green-300",
  RERA: "bg-purple-900/30 text-purple-300",
  Market: "bg-gold-900/30 text-gold-300",
  Development: "bg-teal-900/30 text-teal-300",
  Policy: "bg-red-900/30 text-red-300",
  NRI: "bg-indigo-900/30 text-indigo-300",
};

export default function MarketIntelligencePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("pulse");

  const navItems = [
    { id: "pulse", label: "Market Pulse", icon: TrendingUp },
    { id: "news", label: "News Feed", icon: Newspaper },
    { id: "localities", label: "Localities", icon: Building2 },
    { id: "price-index", label: "Price Index", icon: BarChart2 },
    { id: "rates", label: "Interest Rates", icon: DollarSign },
    { id: "rera", label: "RERA Watchdog", icon: Shield },
    { id: "predictions", label: "Predictions", icon: ArrowUp },
    { id: "infra", label: "Infrastructure", icon: Building2 },
    { id: "competitors", label: "Competitive Intel", icon: BarChart2 },
  ];

  return (
    <SecureAppGate appName="Market Intelligence">
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gold-800/30 bg-card/90 backdrop-blur-md sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gold-900/20 md:hidden"
            data-ocid="market.menu_toggle"
          >
            <Menu className="w-5 h-5 text-gold-400" />
          </button>
          <Link
            to="/apps"
            className="flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-sm"
            data-ocid="market.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Apps</span>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-serif font-bold text-lg text-gold-400 truncate">
              Market Intelligence - Ahmedabad
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Live data - Gujarat RERA - Price predictions - Competitive
              analysis
            </p>
          </div>
          <span className="shrink-0 px-2 py-1 rounded-full text-xs font-bold bg-green-900/30 text-green-300 border border-green-800/30">
            BULLISH
          </span>
        </div>

        <div className="flex h-[calc(100vh-57px)]">
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              role="presentation"
              className="fixed inset-0 bg-black/70 z-40"
              onClick={() => setSidebarOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setSidebarOpen(false);
              }}
            />
          )}
          {/* Sidebar — desktop: always visible flex sibling; mobile: fixed overlay */}
          <aside
            className={`
              flex-shrink-0 w-52 bg-card border-r border-gold-800/30 flex flex-col
              md:relative md:translate-x-0
              fixed inset-y-0 left-0 z-50 transition-transform duration-200
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}
          >
            <div className="flex items-center justify-between p-3 border-b border-gold-800/20">
              <span className="font-bold text-gold-400 text-xs uppercase tracking-wide">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1 hover:bg-gold-900/20 rounded"
                data-ocid="market.close_sidebar"
              >
                <X className="w-4 h-4 text-gold-400" />
              </button>
            </div>
            <nav className="p-2 space-y-0.5 text-sm overflow-y-auto flex-1">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? "bg-gold-700/20 text-gold-400 border border-gold-700/30"
                      : "text-muted-foreground hover:bg-gold-900/10 hover:text-gold-400"
                  }`}
                  data-ocid={`market.nav.${item.id}`}
                >
                  <item.icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs">{item.label}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6">
            {/* Market Pulse */}
            <section id="pulse">
              <h2 className="font-serif font-bold text-gold-400 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Live Market Pulse
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  {
                    label: "Market Sentiment",
                    val: "BULLISH",
                    badge: "bg-green-900/30 text-green-300",
                    change: "4th consecutive month",
                  },
                  {
                    label: "Transaction Volume",
                    val: "+12.3% YoY",
                    badge: null,
                    change: "3,824 registrations",
                  },
                  {
                    label: "Avg Price Change",
                    val: "+7.8%",
                    badge: null,
                    change: "Last 6 months",
                  },
                  {
                    label: "Active RERA Projects",
                    val: "47",
                    badge: null,
                    change: "Gujarat Q1 2026",
                  },
                ].map((s, i) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-gold-800/30 bg-card p-3 sm:p-4"
                    data-ocid={`market.pulse.${i + 1}`}
                  >
                    <p className="text-[11px] text-muted-foreground mb-1">
                      {s.label}
                    </p>
                    {s.badge ? (
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${s.badge}`}
                      >
                        {s.val}
                      </span>
                    ) : (
                      <p className="font-serif text-xl font-bold text-gold-400">
                        {s.val}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {s.change}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: "Avg Rs/sqft (Ahmedabad)",
                    val: "Rs 4,850",
                    change: "+8.2%",
                    up: true,
                  },
                  {
                    label: "Demand Index",
                    val: "73/100",
                    change: "+5 pts",
                    up: true,
                  },
                  {
                    label: "New Launches Q1",
                    val: "2,847 units",
                    change: "+22%",
                    up: true,
                  },
                  {
                    label: "Avg Absorption Rate",
                    val: "68%",
                    change: "+3.4%",
                    up: true,
                  },
                ].map((s, i) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-gold-800/20 bg-muted/40 p-3"
                    data-ocid={`market.stat.${i + 1}`}
                  >
                    <p className="text-[10px] text-muted-foreground">
                      {s.label}
                    </p>
                    <p className="font-serif text-lg font-bold text-gold-400 mt-0.5">
                      {s.val}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {s.up ? (
                        <ChevronUp className="w-3 h-3 text-green-400" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-red-400" />
                      )}
                      <span
                        className={`text-[10px] font-medium ${s.up ? "text-green-400" : "text-red-400"}`}
                      >
                        {s.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* News Feed */}
            <section id="news">
              <h2 className="font-serif font-bold text-gold-400 mb-3 flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                Latest Market News
              </h2>
              <div className="rounded-xl border border-gold-800/30 bg-card p-4">
                <div className="space-y-3">
                  {NEWS.map((n, i) => (
                    <div
                      key={n.headline}
                      className="flex items-start gap-3 pb-3 border-b border-gold-900/20 last:border-0"
                      data-ocid={`market.news.${i + 1}`}
                    >
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${TAG_COLORS[n.tag] ?? "bg-gold-900/30 text-gold-300"}`}
                      >
                        {n.tag}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground font-medium leading-snug">
                          {n.headline}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {n.src}
                          </span>
                          <span className="text-xs text-gold-600">
                            {n.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Locality Data */}
            <section id="localities">
              <h2 className="font-serif font-bold text-gold-400 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Locality-Wise Market Data
              </h2>
              <div className="rounded-xl border border-gold-800/30 bg-card p-4 overflow-x-auto">
                <table className="w-full text-sm min-w-[580px]">
                  <thead>
                    <tr className="border-b border-gold-800/30">
                      {[
                        "Locality",
                        "Avg Rs/sqft",
                        "YoY Growth",
                        "Demand Score",
                        "Type",
                        "Size Range (sqft)",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left py-2 pr-4 text-gold-400 text-xs"
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
                        className="border-b border-gold-900/20 hover:bg-gold-900/10"
                        data-ocid={`market.locality.${i + 1}`}
                      >
                        <td className="py-2 pr-4 font-medium whitespace-nowrap">
                          {l.name}
                        </td>
                        <td className="py-2 pr-4 text-gold-400 font-bold">
                          Rs {l.avg.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2 pr-4">
                          <span className="flex items-center gap-1 text-xs font-medium text-green-400">
                            <TrendingUp className="w-3 h-3" />+{l.yoy}%
                          </span>
                        </td>
                        <td className="py-2 pr-4">
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-1.5 bg-gold-900/30 rounded-full">
                              <div
                                className="h-full bg-gold-500 rounded-full"
                                style={{ width: `${l.demand}%` }}
                              />
                            </div>
                            <span className="text-xs text-gold-400">
                              {l.demand}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 pr-4 text-xs text-muted-foreground">
                          {l.type}
                        </td>
                        <td className="py-2 text-xs text-muted-foreground">
                          {l.sqft}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Price Index + Interest Rates */}
            <section
              id="price-index"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="rounded-xl border border-gold-800/30 bg-card p-4">
                <h2 className="font-serif font-bold text-gold-400 mb-3 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" />
                  Ahmedabad Price Index (5 Year)
                </h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold-800/30">
                      {["Year", "Avg Rs/sqft", "CAGR"].map((h) => (
                        <th
                          key={h}
                          className="text-left py-2 pr-4 text-gold-400 text-xs"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PRICE_INDEX.map((r, i) => (
                      <tr
                        key={r.year}
                        className="border-b border-gold-900/20"
                        data-ocid={`market.price_index.${i + 1}`}
                      >
                        <td className="py-2 pr-4 text-foreground">{r.year}</td>
                        <td className="py-2 pr-4 text-gold-400 font-bold">
                          Rs {r.avg.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2">
                          <span
                            className={`text-xs font-medium ${r.cagr === "—" ? "text-muted-foreground" : "text-green-400"}`}
                          >
                            {r.cagr}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                id="rates"
                className="rounded-xl border border-gold-800/30 bg-card p-4"
              >
                <h2 className="font-serif font-bold text-gold-400 mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Interest Rates (Jun 2026)
                </h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold-800/30">
                      {["Institution", "Rate", "Change", "Since"].map((h) => (
                        <th
                          key={h}
                          className="text-left py-2 pr-3 text-gold-400 text-xs"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {INTEREST_RATES.map((r, i) => (
                      <tr
                        key={r.inst}
                        className="border-b border-gold-900/20"
                        data-ocid={`market.rate.${i + 1}`}
                      >
                        <td className="py-2 pr-3 text-sm">{r.inst}</td>
                        <td className="py-2 pr-3 text-gold-400 font-bold">
                          {r.rate}
                        </td>
                        <td
                          className={`py-2 pr-3 text-xs font-medium ${r.change.startsWith("-") ? "text-green-400" : "text-muted-foreground"}`}
                        >
                          {r.change}
                        </td>
                        <td className="py-2 text-xs text-muted-foreground">
                          {r.since}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* RERA Watchdog */}
            <section id="rera">
              <h2 className="font-serif font-bold text-gold-400 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Gujarat RERA Watchdog
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  {
                    label: "New Registrations Q1",
                    val: "247",
                    sub: "Gujarat statewide",
                    color: "text-green-400",
                  },
                  {
                    label: "Ahmedabad Projects",
                    val: "847",
                    sub: "Total active",
                    color: "text-gold-400",
                  },
                  {
                    label: "Delayed Projects",
                    val: "38",
                    sub: "12-month+ delay",
                    color: "text-yellow-400",
                  },
                  {
                    label: "Complaints Filed",
                    val: "124",
                    sub: "Q1 2026",
                    color: "text-red-400",
                  },
                ].map((s, i) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-gold-800/30 bg-card p-3"
                    data-ocid={`market.rera_stat.${i + 1}`}
                  >
                    <p className="text-[10px] text-muted-foreground">
                      {s.label}
                    </p>
                    <p
                      className={`font-serif text-xl font-bold ${s.color} mt-0.5`}
                    >
                      {s.val}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{s.sub}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-gold-800/30 bg-card p-4 overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gold-800/30">
                      {[
                        "Project",
                        "Builder",
                        "Type",
                        "Units",
                        "Registered",
                        "Status",
                        "Flag",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left py-2 pr-3 text-gold-400 text-xs"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {RERA_FILINGS.map((p, i) => (
                      <tr
                        key={p.project}
                        className="border-b border-gold-900/20 hover:bg-gold-900/10"
                        data-ocid={`market.rera.${i + 1}`}
                      >
                        <td className="py-2 pr-3 font-medium text-xs whitespace-nowrap">
                          {p.project}
                        </td>
                        <td className="py-2 pr-3 text-xs text-muted-foreground">
                          {p.builder}
                        </td>
                        <td className="py-2 pr-3">
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-900/30 text-blue-300">
                            {p.type}
                          </span>
                        </td>
                        <td className="py-2 pr-3 text-xs text-center">
                          {p.units}
                        </td>
                        <td className="py-2 pr-3 text-xs text-muted-foreground">
                          {p.registered}
                        </td>
                        <td className="py-2 pr-3">
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                              p.status === "Active"
                                ? "bg-green-900/30 text-green-300"
                                : p.status === "Delayed"
                                  ? "bg-yellow-900/30 text-yellow-300"
                                  : "bg-red-900/30 text-red-300"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-2">
                          {p.flag ? (
                            <span className="flex items-center gap-1 text-[10px] text-red-400">
                              <AlertTriangle className="w-3 h-3" />
                              {p.flag}
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">
                              -
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Market Prediction Engine */}
            <section id="predictions">
              <h2 className="font-serif font-bold text-gold-400 mb-3 flex items-center gap-2">
                <ArrowUp className="w-4 h-4" />
                Market Prediction Engine
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PREDICTIONS.map((p, i) => (
                  <div
                    key={p.locality}
                    className="rounded-xl border border-gold-800/30 bg-card p-4"
                    data-ocid={`market.prediction.${i + 1}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif font-semibold text-foreground text-sm">
                        {p.locality}
                      </h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold-700/20 text-gold-400">
                        AI: {p.confidence}%
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          6-month
                        </span>
                        <span className="text-green-400 font-bold text-sm">
                          {p.forecast6m}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          1-year
                        </span>
                        <span className="text-green-300 font-bold text-sm">
                          {p.forecast1y}
                        </span>
                      </div>
                      <div className="pt-1.5 border-t border-gold-800/20">
                        <p className="text-[10px] text-muted-foreground">
                          {p.driver}
                        </p>
                      </div>
                      <div className="w-full h-1.5 bg-gold-900/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold-500/70 rounded-full"
                          style={{ width: `${p.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Infrastructure Pipeline */}
            <section id="infra">
              <h2 className="font-serif font-bold text-gold-400 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Infrastructure Pipeline
              </h2>
              <div className="rounded-xl border border-gold-800/30 bg-card p-4 overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gold-800/30">
                      {[
                        "Project",
                        "Status",
                        "Expected Completion",
                        "Market Impact",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left py-2 pr-4 text-gold-400 text-xs"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {INFRA_PROJECTS.map((p, i) => (
                      <tr
                        key={p.name}
                        className="border-b border-gold-900/20 hover:bg-gold-900/10"
                        data-ocid={`market.infra.${i + 1}`}
                      >
                        <td className="py-2 pr-4 font-medium text-sm">
                          {p.name}
                        </td>
                        <td className="py-2 pr-4">
                          <span className="px-2 py-0.5 rounded-full text-xs bg-blue-900/30 text-blue-300">
                            {p.status}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-muted-foreground text-xs">
                          {p.completion}
                        </td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              p.impact === "Very High"
                                ? "bg-red-900/30 text-red-300"
                                : p.impact === "High"
                                  ? "bg-orange-900/30 text-orange-300"
                                  : "bg-green-900/30 text-green-300"
                            }`}
                          >
                            {p.impact}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Competitive Intelligence */}
            <section id="competitors">
              <h2 className="font-serif font-bold text-gold-400 mb-3 flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                Competitive Intelligence
              </h2>
              <div className="rounded-xl border border-gold-800/30 bg-card p-4">
                <p className="text-xs text-muted-foreground mb-3">
                  Ahmedabad real estate agency market share by active listings
                  (estimated Q1 2026)
                </p>
                <div className="space-y-2">
                  {COMPETITORS.map((c, i) => {
                    const isMstc = c.name === "MSTC GLOBAL";
                    return (
                      <div
                        key={c.name}
                        className={`flex items-center gap-3 p-2 rounded-lg ${isMstc ? "border border-gold-500/40 bg-gold-700/10" : ""}`}
                        data-ocid={`market.competitor.${i + 1}`}
                      >
                        <div className="w-5 text-center text-xs text-muted-foreground font-bold">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm font-medium ${isMstc ? "text-gold-400" : "text-foreground"}`}
                            >
                              {c.name}
                              {isMstc && " (MSTC)"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {c.focus}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1.5 bg-gold-900/20 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isMstc ? "bg-gold-500" : "bg-gold-700/50"}`}
                                style={{
                                  width: `${Math.min(100, Math.round((c.listings / 2104) * 100))}%`,
                                }}
                              />
                            </div>
                            <span
                              className={`text-xs font-bold shrink-0 ${isMstc ? "text-gold-400" : "text-muted-foreground"}`}
                            >
                              {c.share}
                            </span>
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {c.listings.toLocaleString()} listings
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </SecureAppGate>
  );
}
