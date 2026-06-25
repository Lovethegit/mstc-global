import SecureAppGate from "@/components/shared/SecureAppGate";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart2,
  Globe,
  Menu,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const TRAFFIC_SOURCES = [
  {
    source: "Organic Search",
    sessions: 5395,
    pct: 42,
    bounce: 31,
    avg: "5m 12s",
    conversions: 89,
  },
  {
    source: "Direct",
    sessions: 3597,
    pct: 28,
    bounce: 28,
    avg: "6m 04s",
    conversions: 67,
  },
  {
    source: "Referral",
    sessions: 2312,
    pct: 18,
    bounce: 38,
    avg: "3m 48s",
    conversions: 42,
  },
  {
    source: "Social Media",
    sessions: 1542,
    pct: 12,
    bounce: 47,
    avg: "2m 31s",
    conversions: 21,
  },
  {
    source: "Email",
    sessions: 384,
    pct: 3,
    bounce: 22,
    avg: "7m 15s",
    conversions: 19,
  },
  {
    source: "Paid Ads",
    sessions: 256,
    pct: 2,
    bounce: 55,
    avg: "1m 42s",
    conversions: 9,
  },
];

const TOP_PAGES = [
  {
    page: "/",
    title: "Home",
    views: 18472,
    unique: 12341,
    bounce: 28,
    avg: "4m 52s",
  },
  {
    page: "/property-portal",
    title: "Property Portal",
    views: 8934,
    unique: 6712,
    bounce: 34,
    avg: "6m 18s",
  },
  {
    page: "/services/finance",
    title: "Finance Services",
    views: 5621,
    unique: 4201,
    bounce: 31,
    avg: "5m 44s",
  },
  {
    page: "/services/infrastructure",
    title: "Infrastructure",
    views: 4809,
    unique: 3644,
    bounce: 36,
    avg: "4m 22s",
  },
  {
    page: "/blog",
    title: "Blog",
    views: 4201,
    unique: 3198,
    bounce: 41,
    avg: "3m 56s",
  },
  {
    page: "/faq",
    title: "FAQ",
    views: 3812,
    unique: 2934,
    bounce: 38,
    avg: "4m 11s",
  },
  {
    page: "/area-guides",
    title: "Area Guides",
    views: 3456,
    unique: 2712,
    bounce: 33,
    avg: "5m 02s",
  },
  {
    page: "/neighborhood-explorer",
    title: "Neighborhood Explorer",
    views: 2934,
    unique: 2301,
    bounce: 35,
    avg: "4m 38s",
  },
  {
    page: "/services/rera-consulting",
    title: "RERA Consulting",
    views: 2812,
    unique: 2211,
    bounce: 29,
    avg: "5m 51s",
  },
  {
    page: "/deal-matchmaker",
    title: "Deal Matchmaker",
    views: 2567,
    unique: 1987,
    bounce: 37,
    avg: "4m 15s",
  },
  {
    page: "/nri-corner",
    title: "NRI Corner",
    views: 2301,
    unique: 1801,
    bounce: 32,
    avg: "5m 22s",
  },
  {
    page: "/event-booking",
    title: "Event Booking",
    views: 1987,
    unique: 1534,
    bounce: 42,
    avg: "3m 48s",
  },
  {
    page: "/finance-tools",
    title: "Finance Tools",
    views: 1834,
    unique: 1423,
    bounce: 26,
    avg: "7m 33s",
  },
  {
    page: "/auction-board",
    title: "Auction Board",
    views: 1712,
    unique: 1312,
    bounce: 39,
    avg: "3m 59s",
  },
  {
    page: "/artist-showcase",
    title: "Artist Showcase",
    views: 1598,
    unique: 1212,
    bounce: 44,
    avg: "3m 21s",
  },
  {
    page: "/sports-portal",
    title: "Sports Portal",
    views: 1432,
    unique: 1098,
    bounce: 40,
    avg: "3m 44s",
  },
  {
    page: "/news",
    title: "News & Insights",
    views: 1387,
    unique: 1056,
    bounce: 37,
    avg: "4m 05s",
  },
  {
    page: "/csr-impact",
    title: "CSR Impact",
    views: 1201,
    unique: 934,
    bounce: 35,
    avg: "4m 27s",
  },
  {
    page: "/travel-customizer",
    title: "Travel Customizer",
    views: 1098,
    unique: 834,
    bounce: 41,
    avg: "3m 55s",
  },
  {
    page: "/talent-portal",
    title: "Talent Portal",
    views: 987,
    unique: 756,
    bounce: 43,
    avg: "3m 18s",
  },
];

const LEADS_BY_SERVICE = [
  {
    service: "Infrastructure & Property",
    leads: 89,
    conv: 12,
    value: "₹7.8Cr",
  },
  { service: "Finance & Investment", leads: 47, conv: 8, value: "₹4.2Cr" },
  { service: "RERA & PR Consulting", leads: 38, conv: 6, value: "₹1.1Cr" },
  { service: "Hospitality & Events", leads: 31, conv: 7, value: "₹89L" },
  { service: "Music & Cultural", leads: 18, conv: 4, value: "₹34L" },
  { service: "NGO & CSR", leads: 14, conv: 5, value: "₹22L" },
  { service: "Sports & Media", leads: 10, conv: 3, value: "₹18L" },
];

const FUNNEL = [
  { stage: "Website Visitors", count: 12847, pct: 100 },
  { stage: "Engaged (>2 pages)", count: 7234, pct: 56 },
  { stage: "Form Started", count: 1893, pct: 14.7 },
  { stage: "Leads Generated", count: 247, pct: 1.9 },
  { stage: "Qualified Leads", count: 89, pct: 0.69 },
  { stage: "Site Visits / Calls", count: 42, pct: 0.33 },
  { stage: "Deals Closed", count: 12, pct: 0.09 },
];

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("30d");

  return (
    <SecureAppGate appName="Analytics Center">
      <div className="min-h-screen bg-[#06090f] text-gold-100">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gold-800/30 bg-[#0a0e1a] sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gold-900/20 md:hidden"
            data-ocid="analytics.menu_toggle"
          >
            <Menu className="w-5 h-5 text-gold-400" />
          </button>
          <Link
            to="/apps"
            className="flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-sm"
            data-ocid="analytics.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Apps</span>
          </Link>
          <div className="flex-1">
            <h1
              className="text-lg font-bold text-gold-400"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Analytics Center
            </h1>
          </div>
          <div className="flex gap-1">
            {["7d", "30d", "90d", "1y"].map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded text-xs ${filter === f ? "bg-gold-800/40 text-gold-300" : "text-muted-foreground hover:text-gold-400"}`}
                data-ocid={`analytics.filter.${f}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1">
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setSidebarOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
              role="presentation"
            />
          )}
          <aside
            className={`fixed md:static inset-y-0 left-0 z-50 w-56 bg-[#0a0e1a] border-r border-gold-800/30 flex flex-col transition-transform duration-200 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gold-800/20">
              <span className="font-bold text-gold-400 text-sm">Sections</span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1 hover:bg-gold-900/20 rounded"
                data-ocid="analytics.close_sidebar"
              >
                <X className="w-4 h-4 text-gold-400" />
              </button>
            </div>
            <nav className="p-2 space-y-1 text-sm">
              {[
                { label: "Overview", icon: BarChart2 },
                { label: "Traffic Sources", icon: Globe },
                { label: "Top Pages", icon: TrendingUp },
                { label: "Lead Funnel", icon: Zap },
                { label: "By Service", icon: Users },
              ].map((item) => (
                <a
                  key={item.label}
                  href={`#${item.label.toLowerCase().replace(/ /g, "-")}`}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-gold-900/10 hover:text-gold-400 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {/* KPI Cards */}
            <div
              id="overview"
              className="grid grid-cols-2 md:grid-cols-5 gap-3"
            >
              {[
                {
                  label: "Website Visitors",
                  val: "12,847",
                  change: "+18%",
                  icon: Users,
                },
                {
                  label: "Leads Generated",
                  val: "247",
                  change: "+12%",
                  icon: Zap,
                },
                {
                  label: "Conversion Rate",
                  val: "1.9%",
                  change: "+0.3%",
                  icon: TrendingUp,
                },
                {
                  label: "Avg Session",
                  val: "4m 32s",
                  change: "+24s",
                  icon: BarChart2,
                },
                {
                  label: "Bounce Rate",
                  val: "34%",
                  change: "-2.1%",
                  icon: Globe,
                },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-4"
                  data-ocid={`analytics.stat.${i + 1}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <s.icon className="w-4 h-4 text-gold-400" />
                    <span className="text-xs text-muted-foreground">
                      {s.label}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-gold-400">{s.val}</div>
                  <div className="text-xs text-green-400 mt-1">
                    {s.change} vs prev period
                  </div>
                </div>
              ))}
            </div>

            {/* Traffic Sources */}
            <div
              id="traffic-sources"
              className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-4"
            >
              <h3
                className="font-bold text-gold-400 mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Traffic Sources
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold-800/30">
                      {[
                        "Source",
                        "Sessions",
                        "Share",
                        "Bounce",
                        "Avg Time",
                        "Conversions",
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
                    {TRAFFIC_SOURCES.map((s, i) => (
                      <tr
                        key={s.source}
                        className="border-b border-gold-900/20 hover:bg-gold-900/10"
                        data-ocid={`analytics.traffic.${i + 1}`}
                      >
                        <td className="py-2 pr-4 font-medium">{s.source}</td>
                        <td className="py-2 pr-4 text-foreground">
                          {s.sessions.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gold-900/30 rounded-full min-w-[60px]">
                              <div
                                className="h-full bg-gold-500 rounded-full"
                                style={{ width: `${s.pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-gold-400">
                              {s.pct}%
                            </span>
                          </div>
                        </td>
                        <td className="py-2 pr-4 text-muted-foreground">
                          {s.bounce}%
                        </td>
                        <td className="py-2 pr-4 text-muted-foreground">
                          {s.avg}
                        </td>
                        <td className="py-2 text-green-400 font-medium">
                          {s.conversions}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Pages */}
            <div
              id="top-pages"
              className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-4"
            >
              <h3
                className="font-bold text-gold-400 mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Top Pages
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold-800/30">
                      {["Page", "Views", "Unique", "Bounce", "Avg Time"].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left py-2 pr-4 text-gold-400 text-xs"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {TOP_PAGES.map((p, i) => (
                      <tr
                        key={p.page}
                        className="border-b border-gold-900/20 hover:bg-gold-900/10"
                        data-ocid={`analytics.page.${i + 1}`}
                      >
                        <td className="py-2 pr-4">
                          <div className="font-medium">{p.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {p.page}
                          </div>
                        </td>
                        <td className="py-2 pr-4 text-foreground">
                          {p.views.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2 pr-4 text-muted-foreground">
                          {p.unique.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2 pr-4 text-muted-foreground">
                          {p.bounce}%
                        </td>
                        <td className="py-2 text-muted-foreground">{p.avg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lead Funnel */}
            <div
              id="lead-funnel"
              className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-4"
            >
              <h3
                className="font-bold text-gold-400 mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Lead Conversion Funnel
              </h3>
              <div className="space-y-2">
                {FUNNEL.map((f, i) => (
                  <div
                    key={f.stage}
                    className="flex items-center gap-3"
                    data-ocid={`analytics.funnel.${i + 1}`}
                  >
                    <span className="text-sm text-muted-foreground w-36 shrink-0">
                      {f.stage}
                    </span>
                    <div className="flex-1 h-6 bg-gold-900/20 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold-700/60 to-gold-500/40 rounded-lg flex items-center pl-2 text-xs text-gold-300 font-medium"
                        style={{ width: `${Math.max(f.pct, 1)}%` }}
                      >
                        {f.count.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <span className="text-xs text-gold-400 w-12 text-right shrink-0">
                      {f.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leads By Service */}
            <div
              id="by-service"
              className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-4"
            >
              <h3
                className="font-bold text-gold-400 mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Leads by Service Division
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold-800/30">
                      {[
                        "Service",
                        "Leads",
                        "Conversions",
                        "Pipeline Value",
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
                    {LEADS_BY_SERVICE.map((s, i) => (
                      <tr
                        key={s.service}
                        className="border-b border-gold-900/20 hover:bg-gold-900/10"
                        data-ocid={`analytics.service.${i + 1}`}
                      >
                        <td className="py-2 pr-4 font-medium">{s.service}</td>
                        <td className="py-2 pr-4 text-gold-400 font-bold">
                          {s.leads}
                        </td>
                        <td className="py-2 pr-4 text-green-400">{s.conv}</td>
                        <td className="py-2 text-foreground font-medium">
                          {s.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SecureAppGate>
  );
}
