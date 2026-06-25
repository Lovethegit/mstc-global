import TutorialFloatingButton from "@/components/TutorialFloatingButton";
import SecureAppGate from "@/components/shared/SecureAppGate";
import { DollarSign, Download, Home, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const REVENUE_BY_RANGE: Record<string, { month: string; revenue: number }[]> = {
  "7d": [
    { month: "Day 1", revenue: 1.2 },
    { month: "Day 2", revenue: 0.8 },
    { month: "Day 3", revenue: 1.5 },
    { month: "Day 4", revenue: 1.1 },
    { month: "Day 5", revenue: 2.0 },
    { month: "Day 6", revenue: 1.7 },
    { month: "Day 7", revenue: 2.2 },
  ],
  "30d": [
    { month: "W1", revenue: 6.5 },
    { month: "W2", revenue: 8.2 },
    { month: "W3", revenue: 7.8 },
    { month: "W4", revenue: 9.1 },
  ],
  "90d": [
    { month: "Jun '25", revenue: 8.2 },
    { month: "Jul '25", revenue: 10.4 },
    { month: "Aug '25", revenue: 9.1 },
    { month: "Sep '25", revenue: 11.8 },
    { month: "Oct '25", revenue: 13.5 },
    { month: "Nov '25", revenue: 15.2 },
    { month: "Dec '25", revenue: 17.8 },
    { month: "Jan '26", revenue: 11.2 },
    { month: "Feb '26", revenue: 12.4 },
    { month: "Mar '26", revenue: 14.6 },
    { month: "Apr '26", revenue: 13.1 },
    { month: "May '26", revenue: 12.45 },
  ],
};

const FUNNEL = [
  { stage: "Total Leads", count: 847, pct: 100 },
  { stage: "Qualified", count: 389, pct: 46 },
  { stage: "Site Visits", count: 201, pct: 24 },
  { stage: "Negotiation", count: 89, pct: 11 },
  { stage: "Deals Closed", count: 23, pct: 2.7 },
];

const CHANNELS = [
  { name: "WhatsApp", value: 35, color: "#25d366" },
  { name: "Referral", value: 28, color: "#c9a84c" },
  { name: "Google", value: 20, color: "#4285f4" },
  { name: "Direct", value: 12, color: "#a855f7" },
  { name: "Social Media", value: 5, color: "#ec4899" },
];

const LOCALITIES = [
  { locality: "Prahlad Nagar", deals: 6, revenue: 42, avgDeal: "70L" },
  { locality: "Bodakdev", deals: 5, revenue: 37.5, avgDeal: "75L" },
  { locality: "SG Highway", deals: 4, revenue: 28.8, avgDeal: "72L" },
  { locality: "Satellite", deals: 3, revenue: 21.6, avgDeal: "72L" },
  { locality: "Navrangpura", deals: 3, revenue: 15, avgDeal: "50L" },
  { locality: "Thaltej", deals: 2, revenue: 17.6, avgDeal: "88L" },
];

export default function AnalyticsAdminPage() {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("90d");
  const MONTHLY_REVENUE = REVENUE_BY_RANGE[dateRange];
  const ytd = MONTHLY_REVENUE.reduce((s, r) => s + r.revenue, 0);

  function handleExport() {
    const summary = `MSTC GLOBAL Analytics Report\nRange: ${dateRange}\nYTD Revenue: ₹${ytd.toFixed(2)} Cr\nDeals Closed: 23\nAvg Deal Size: ₹54L`;
    navigator.clipboard
      .writeText(summary)
      .then(() => toast.success("Report copied to clipboard"));
  }

  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1
              className="text-2xl font-bold text-gold-400"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Analytics Center
            </h1>
            <p className="text-sm text-muted-foreground">
              Revenue, lead funnel, channel attribution & performance
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Monthly Revenue",
                value: "₹12,45,000",
                sub: "May 2026",
                icon: DollarSign,
                color: "text-green-400",
              },
              {
                label: "YTD Revenue",
                value: `₹${ytd.toFixed(2)} Cr`,
                sub: "Jun 25–May 26",
                icon: TrendingUp,
                color: "text-gold-400",
              },
              {
                label: "Deals Closed",
                value: "23",
                sub: "This month",
                icon: Home,
                color: "text-blue-400",
              },
              {
                label: "Avg Deal Size",
                value: "₹54L",
                sub: "Across all deals",
                icon: Users,
                color: "text-purple-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-card/80 border border-gold-800/30 rounded-xl p-4"
                data-ocid={`analytics.kpi.${s.label.toLowerCase().replace(/ /g, "_")}`}
              >
                <s.icon className={`w-5 h-5 mb-2 ${s.color}`} />
                <div className="text-xl font-bold text-gold-300">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Date Range + Export */}
          <div className="flex flex-wrap items-center gap-2">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${dateRange === r ? "border-gold-500/50 bg-gold-700/20 text-gold-300" : "border-gold-800/30 text-gold-600"}`}
                data-ocid={`analytics.range.${r}`}
              >
                {r === "7d"
                  ? "Last 7 days"
                  : r === "30d"
                    ? "Last 30 days"
                    : "Last 90 days"}
              </button>
            ))}
            <button
              type="button"
              onClick={handleExport}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-800/40 text-gold-500 text-xs hover:border-gold-600/50 transition-colors"
              data-ocid="analytics.export_button"
            >
              <Download className="w-3.5 h-3.5" /> Export Report
            </button>
          </div>

          {/* Revenue Chart */}
          <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
            <h2 className="font-bold text-gold-300 mb-4">
              Revenue (Lakhs ₹) —{" "}
              {dateRange === "7d"
                ? "Last 7 Days"
                : dateRange === "30d"
                  ? "Last 30 Days"
                  : "Last 90 Days"}
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={MONTHLY_REVENUE}
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#c9a84c15" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#a08050" }}
                />
                <YAxis tick={{ fontSize: 10, fill: "#a08050" }} />
                <Tooltip
                  formatter={(v: number) => [`₹${v}L`, "Revenue"]}
                  contentStyle={{
                    background: "#0d1117",
                    border: "1px solid #c9a84c40",
                    borderRadius: 8,
                    color: "#f5d78e",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="revenue" fill="#c9a84c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Lead Funnel */}
            <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
              <h2 className="font-bold text-gold-300 mb-4">Lead Funnel</h2>
              <div className="space-y-2">
                {FUNNEL.map((f, i) => (
                  <div
                    key={f.stage}
                    data-ocid={`analytics.funnel.item.${i + 1}`}
                  >
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-foreground font-medium">
                        {f.stage}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-gold-400 font-bold">
                          {f.count.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">{f.pct}%</span>
                      </div>
                    </div>
                    <div className="h-6 bg-muted/30 rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg flex items-center px-2 text-xs font-medium text-[#06090f] transition-all"
                        style={{
                          width: `${f.pct}%`,
                          background: `oklch(0.72 0.18 76 / ${0.4 + i * 0.12})`,
                        }}
                      >
                        {f.pct > 15 && `${f.count}`}
                      </div>
                    </div>
                    {i < FUNNEL.length - 1 && (
                      <div className="text-[10px] text-muted-foreground ml-1 mt-0.5">
                        ↓ {Math.round((FUNNEL[i + 1].count / f.count) * 100)}%
                        conversion
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Channel Attribution */}
            <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
              <h2 className="font-bold text-gold-300 mb-4">
                Lead Channel Attribution
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={CHANNELS}
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {CHANNELS.map((c) => (
                      <Cell key={c.name} fill={c.color} />
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
                  <Legend wrapperStyle={{ fontSize: 11, color: "#a08050" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Localities */}
          <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
            <h2 className="font-bold text-gold-300 mb-3">
              Top Performing Localities
            </h2>
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm"
                data-ocid="analytics.localities.table"
              >
                <thead>
                  <tr className="border-b border-gold-800/30">
                    {["Locality", "Deals", "Revenue (Lakhs)", "Avg Deal"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left py-2 px-3 text-xs text-muted-foreground font-medium"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {LOCALITIES.map((l, i) => (
                    <tr
                      key={l.locality}
                      className="border-b border-gold-800/10 hover:bg-gold-900/10"
                      data-ocid={`analytics.locality.item.${i + 1}`}
                    >
                      <td className="py-2 px-3 font-medium text-foreground">
                        {l.locality}
                      </td>
                      <td className="py-2 px-3 text-center text-gold-400 font-bold">
                        {l.deals}
                      </td>
                      <td className="py-2 px-3 text-green-400 font-semibold">
                        ₹{l.revenue}L
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">
                        ₹{l.avgDeal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <TutorialFloatingButton />
    </SecureAppGate>
  );
}
