import SecureAppGate from "@/components/shared/SecureAppGate";
import {
  ArrowLeft,
  BarChart2,
  BookOpen,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

type Period = "Today" | "This Week" | "This Month" | "This Year";

// Revenue data (monthly, last 6 months)
const revenueData = [
  { month: "Jan", value: 8.2, label: "₹8.2Cr" },
  { month: "Feb", value: 9.1, label: "₹9.1Cr" },
  { month: "Mar", value: 11.4, label: "₹11.4Cr" },
  { month: "Apr", value: 10.8, label: "₹10.8Cr" },
  { month: "May", value: 12.4, label: "₹12.4Cr" },
  { month: "Jun", value: 13.1, label: "₹13.1Cr (YTD)" },
];

const maxRevenue = Math.max(...revenueData.map((d) => d.value));

// Lead Funnel
const leadFunnel = [
  { stage: "New Enquiries", count: 247, pct: 100, color: "bg-blue-500/40" },
  { stage: "Qualified", count: 148, pct: 60, color: "bg-primary/50" },
  { stage: "Proposal Sent", count: 89, pct: 36, color: "bg-primary/70" },
  { stage: "Negotiation", count: 42, pct: 17, color: "bg-yellow-500/60" },
  { stage: "Closed / Won", count: 28, pct: 11, color: "bg-green-500/60" },
];

// Property metrics by locality
const propertyMetrics = [
  {
    locality: "SG Highway",
    views: 4820,
    enquiries: 312,
    visits: 87,
    conversions: 14,
  },
  {
    locality: "Bopal",
    views: 3140,
    enquiries: 201,
    visits: 56,
    conversions: 9,
  },
  {
    locality: "Bodakdev",
    views: 2780,
    enquiries: 178,
    visits: 43,
    conversions: 7,
  },
  {
    locality: "Prahlad Nagar",
    views: 2460,
    enquiries: 154,
    visits: 39,
    conversions: 6,
  },
  {
    locality: "Satellite",
    views: 2110,
    enquiries: 132,
    visits: 31,
    conversions: 5,
  },
  {
    locality: "Chandkheda",
    views: 1680,
    enquiries: 98,
    visits: 22,
    conversions: 3,
  },
];

// Top Performing Localities by conversions
const topLocalities = propertyMetrics.slice(0, 5);
const maxConversions = Math.max(...topLocalities.map((l) => l.conversions));

// Property type performance
const propertyTypes = [
  { type: "3 BHK Residential", deals: 12, revenue: "₹4.8Cr" },
  { type: "Commercial Space", deals: 7, revenue: "₹3.2Cr" },
  { type: "2 BHK Residential", deals: 9, revenue: "₹2.4Cr" },
  { type: "Land / Plot", deals: 4, revenue: "₹1.6Cr" },
  { type: "Luxury Villa", deals: 2, revenue: "₹2.8Cr" },
];
const maxDeals = Math.max(...propertyTypes.map((t) => t.deals));

// Campaign performance
const campaigns = [
  {
    name: "SG Highway Diwali Launch",
    sent: 1200,
    opened: 648,
    clicks: 312,
    conversions: 18,
  },
  {
    name: "Bopal 3BHK Offer",
    sent: 840,
    opened: 412,
    clicks: 176,
    conversions: 11,
  },
  {
    name: "Commercial October",
    sent: 560,
    opened: 234,
    clicks: 98,
    conversions: 6,
  },
  {
    name: "NRI Investment Drive",
    sent: 480,
    opened: 198,
    clicks: 84,
    conversions: 4,
  },
  {
    name: "Luxury Villas Showcase",
    sent: 320,
    opened: 176,
    clicks: 72,
    conversions: 3,
  },
];

// Client acquisition sources
const acquisitionSources = [
  { source: "WhatsApp", pct: 32, color: "bg-green-500/50" },
  { source: "Referral", pct: 28, color: "bg-primary/60" },
  { source: "Web / SEO", pct: 22, color: "bg-blue-500/50" },
  { source: "Walk-in", pct: 10, color: "bg-yellow-500/50" },
  { source: "Social Media", pct: 8, color: "bg-purple-500/50" },
];

// Top agents
const topAgents = [
  { name: "Rajan AI", leads: 42, deals: 8, revenue: "₹3.2Cr" },
  { name: "Priya Sharma", leads: 38, deals: 7, revenue: "₹2.8Cr" },
  { name: "Nilesh Patel", leads: 31, deals: 5, revenue: "₹2.1Cr" },
  { name: "Kavita Mehta", leads: 27, deals: 4, revenue: "₹1.6Cr" },
  { name: "Amit Joshi", leads: 24, deals: 3, revenue: "₹1.2Cr" },
];

function StatCard({
  label,
  value,
  sub,
  up,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  up: boolean;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-primary/20 bg-card/60 px-4 py-4">
      <Icon className="w-4 h-4 mb-2 text-primary" />
      <p className="font-serif text-2xl font-bold text-primary">{value}</p>
      <p className="font-sans text-[11px] text-muted-foreground leading-tight mt-0.5">
        {label}
      </p>
      <p
        className={`font-sans text-[10px] mt-1 flex items-center gap-0.5 ${up ? "text-green-400" : "text-red-400"}`}
      >
        {up ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        {sub}
      </p>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
}: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-4 h-4 text-primary" />
      <h2 className="font-serif text-base font-semibold text-primary">
        {title}
      </h2>
    </div>
  );
}

function AnalyticsCenterInner() {
  const [period, setPeriod] = useState<Period>("This Month");
  const periods: Period[] = ["Today", "This Week", "This Month", "This Year"];

  return (
    <div
      className="min-h-screen bg-background"
      style={{ background: "#06090f" }}
      data-ocid="analytics.page"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-primary/20">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <a
                href="/master"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary font-sans text-xs transition-colors mb-2"
                data-ocid="analytics.back_link"
              >
                <ArrowLeft className="w-3 h-3" /> Back to Master Control
              </a>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary" />
                <h1 className="font-serif text-xl md:text-2xl font-bold text-primary">
                  Analytics Center
                </h1>
              </div>
              <p className="font-sans text-xs text-muted-foreground mt-0.5">
                MSTC GLOBAL · Real-time business intelligence
              </p>
            </div>
            {/* Period Selector */}
            <div className="flex gap-1 p-1 rounded-xl bg-card border border-border/40">
              {periods.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg font-sans text-xs font-medium transition-all ${
                    period === p
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  data-ocid={`analytics.period.${p.toLowerCase().replace(/ /g, "_")}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Summary KPIs */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          data-ocid="analytics.kpi.section"
        >
          <StatCard
            label="Revenue This Month"
            value="₹12.4Cr"
            sub="+8.2% vs last month"
            up={true}
            icon={BarChart2}
          />
          <StatCard
            label="New Leads"
            value="247"
            sub="+23 vs last month"
            up={true}
            icon={Users}
          />
          <StatCard
            label="Deals Closed"
            value="28"
            sub="5 closing this week"
            up={true}
            icon={TrendingUp}
          />
          <StatCard
            label="Conversion Rate"
            value="11.3%"
            sub="+1.2pp vs last month"
            up={true}
            icon={BookOpen}
          />
        </div>

        {/* Revenue Chart */}
        <div
          className="rounded-2xl border border-primary/20 bg-card/60 p-5 mb-6"
          data-ocid="analytics.revenue.section"
        >
          <SectionHeader
            icon={BarChart2}
            title="Revenue Overview — Last 6 Months"
          />
          <div className="flex items-end gap-3 h-44 mb-2">
            {revenueData.map((d) => (
              <div
                key={d.month}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                <span className="font-sans text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.label}
                </span>
                <div
                  className="w-full rounded-t-lg bg-primary/30 hover:bg-primary/60 transition-all duration-300 cursor-default border border-primary/20 hover:border-primary/50"
                  style={{ height: `${(d.value / maxRevenue) * 120}px` }}
                  title={d.label}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {revenueData.map((d) => (
              <div key={d.month} className="flex-1 text-center">
                <span className="font-sans text-xs text-muted-foreground">
                  {d.month}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-border/20">
            {revenueData.map((d) => (
              <div key={d.month} className="flex-1 text-center">
                <span className="font-sans text-[10px] text-primary font-medium">
                  {d.label.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Lead Funnel */}
          <div
            className="rounded-2xl border border-primary/20 bg-card/60 p-5"
            data-ocid="analytics.funnel.section"
          >
            <SectionHeader icon={Users} title="Lead Conversion Funnel" />
            <div className="flex flex-col gap-2">
              {leadFunnel.map((stage, idx) => (
                <div
                  key={stage.stage}
                  className="flex items-center gap-3"
                  data-ocid={`analytics.funnel.item.${idx + 1}`}
                >
                  <span className="font-sans text-xs text-muted-foreground w-28 shrink-0">
                    {stage.stage}
                  </span>
                  <div className="flex-1 h-6 bg-background/60 rounded-lg overflow-hidden border border-border/20">
                    <div
                      className={`h-full rounded-lg ${stage.color} transition-all duration-700`}
                      style={{ width: `${stage.pct}%` }}
                    />
                  </div>
                  <span className="font-sans text-xs font-semibold text-foreground w-8 text-right shrink-0">
                    {stage.count}
                  </span>
                  <span className="font-sans text-[10px] text-muted-foreground w-8 shrink-0">
                    {stage.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Client Acquisition Sources */}
          <div
            className="rounded-2xl border border-primary/20 bg-card/60 p-5"
            data-ocid="analytics.acquisition.section"
          >
            <SectionHeader icon={Users} title="Client Acquisition Sources" />
            <div className="flex flex-col gap-3">
              {acquisitionSources.map((src, idx) => (
                <div
                  key={src.source}
                  className="flex items-center gap-3"
                  data-ocid={`analytics.source.item.${idx + 1}`}
                >
                  <span className="font-sans text-xs text-muted-foreground w-24 shrink-0">
                    {src.source}
                  </span>
                  <div className="flex-1 h-5 bg-background/60 rounded-lg overflow-hidden border border-border/20">
                    <div
                      className={`h-full rounded-lg ${src.color} transition-all duration-700`}
                      style={{ width: `${src.pct}%` }}
                    />
                  </div>
                  <span className="font-sans text-xs font-bold text-primary w-8 text-right shrink-0">
                    {src.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Property Metrics Table */}
        <div
          className="rounded-2xl border border-primary/20 bg-card/60 p-5 mb-6 overflow-x-auto"
          data-ocid="analytics.properties.section"
        >
          <SectionHeader
            icon={BarChart2}
            title="Property Metrics by Locality"
          />
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-border/30">
                {[
                  "Locality",
                  "Views",
                  "Enquiries",
                  "Site Visits",
                  "Conversions",
                  "Conv. Rate",
                ].map((h) => (
                  <th
                    key={h}
                    className="font-sans text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right first:text-left py-2 px-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {propertyMetrics.map((row, idx) => (
                <tr
                  key={row.locality}
                  className="border-b border-border/20 hover:bg-primary/5 transition-colors"
                  data-ocid={`analytics.property.row.${idx + 1}`}
                >
                  <td className="font-sans text-sm text-foreground py-3 px-3">
                    {row.locality}
                  </td>
                  <td className="font-sans text-sm text-right text-foreground py-3 px-3">
                    {row.views.toLocaleString("en-IN")}
                  </td>
                  <td className="font-sans text-sm text-right text-foreground py-3 px-3">
                    {row.enquiries}
                  </td>
                  <td className="font-sans text-sm text-right text-foreground py-3 px-3">
                    {row.visits}
                  </td>
                  <td className="font-sans text-sm text-right font-semibold text-primary py-3 px-3">
                    {row.conversions}
                  </td>
                  <td className="font-sans text-sm text-right text-green-400 py-3 px-3">
                    {((row.conversions / row.enquiries) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Localities Bar Chart */}
          <div
            className="rounded-2xl border border-primary/20 bg-card/60 p-5"
            data-ocid="analytics.top_localities.section"
          >
            <SectionHeader
              icon={TrendingUp}
              title="Top Localities by Conversions"
            />
            <div className="flex flex-col gap-3">
              {topLocalities.map((loc, idx) => (
                <div
                  key={loc.locality}
                  className="flex items-center gap-3"
                  data-ocid={`analytics.locality.item.${idx + 1}`}
                >
                  <span className="font-sans text-xs text-muted-foreground w-28 shrink-0 truncate">
                    {loc.locality}
                  </span>
                  <div className="flex-1 h-5 bg-background/60 rounded overflow-hidden border border-border/20">
                    <div
                      className="h-full bg-primary/50 hover:bg-primary/70 rounded transition-all"
                      style={{
                        width: `${(loc.conversions / maxConversions) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-sans text-xs font-bold text-primary w-6 text-right shrink-0">
                    {loc.conversions}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Property Type Performance */}
          <div
            className="rounded-2xl border border-primary/20 bg-card/60 p-5"
            data-ocid="analytics.property_types.section"
          >
            <SectionHeader icon={BarChart2} title="Property Type Performance" />
            <div className="flex flex-col gap-3">
              {propertyTypes.map((pt, idx) => (
                <div
                  key={pt.type}
                  className="flex items-center gap-3"
                  data-ocid={`analytics.ptype.item.${idx + 1}`}
                >
                  <span className="font-sans text-xs text-muted-foreground flex-1 min-w-0 truncate">
                    {pt.type}
                  </span>
                  <div className="w-32 h-4 bg-background/60 rounded overflow-hidden border border-border/20">
                    <div
                      className="h-full bg-primary/40 hover:bg-primary/60 rounded transition-all"
                      style={{ width: `${(pt.deals / maxDeals) * 100}%` }}
                    />
                  </div>
                  <span className="font-sans text-[11px] text-foreground w-8 text-right shrink-0">
                    {pt.deals}
                  </span>
                  <span className="font-sans text-[11px] text-primary font-semibold w-16 text-right shrink-0">
                    {pt.revenue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Performance Table */}
        <div
          className="rounded-2xl border border-primary/20 bg-card/60 p-5 mb-6 overflow-x-auto"
          data-ocid="analytics.campaigns.section"
        >
          <SectionHeader icon={BarChart2} title="Campaign Performance" />
          <table className="w-full min-w-[520px]">
            <thead>
              <tr className="border-b border-border/30">
                {[
                  "Campaign",
                  "Sent",
                  "Opened",
                  "Clicks",
                  "Conversions",
                  "Open Rate",
                ].map((h) => (
                  <th
                    key={h}
                    className="font-sans text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right first:text-left py-2 px-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c, idx) => (
                <tr
                  key={c.name}
                  className="border-b border-border/20 hover:bg-primary/5 transition-colors"
                  data-ocid={`analytics.campaign.row.${idx + 1}`}
                >
                  <td className="font-sans text-sm text-foreground py-3 px-3 max-w-[180px] truncate">
                    {c.name}
                  </td>
                  <td className="font-sans text-sm text-right text-foreground py-3 px-3">
                    {c.sent.toLocaleString("en-IN")}
                  </td>
                  <td className="font-sans text-sm text-right text-foreground py-3 px-3">
                    {c.opened.toLocaleString("en-IN")}
                  </td>
                  <td className="font-sans text-sm text-right text-foreground py-3 px-3">
                    {c.clicks}
                  </td>
                  <td className="font-sans text-sm text-right font-semibold text-primary py-3 px-3">
                    {c.conversions}
                  </td>
                  <td className="font-sans text-sm text-right text-green-400 py-3 px-3">
                    {((c.opened / c.sent) * 100).toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Agents */}
        <div
          className="rounded-2xl border border-primary/20 bg-card/60 p-5 overflow-x-auto"
          data-ocid="analytics.agents.section"
        >
          <SectionHeader icon={Users} title="Top Performing Agents" />
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="border-b border-border/30">
                {["#", "Agent", "Leads Handled", "Deals Closed", "Revenue"].map(
                  (h) => (
                    <th
                      key={h}
                      className="font-sans text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right first:text-left py-2 px-3"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {topAgents.map((agent, idx) => (
                <tr
                  key={agent.name}
                  className="border-b border-border/20 hover:bg-primary/5 transition-colors"
                  data-ocid={`analytics.agent.row.${idx + 1}`}
                >
                  <td className="font-sans text-xs text-muted-foreground py-3 px-3">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        idx === 0
                          ? "bg-yellow-500/20 text-yellow-400"
                          : idx === 1
                            ? "bg-border/30 text-muted-foreground"
                            : "bg-card text-muted-foreground"
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </td>
                  <td className="font-sans text-sm text-foreground py-3 px-3 font-medium">
                    {agent.name}
                  </td>
                  <td className="font-sans text-sm text-right text-foreground py-3 px-3">
                    {agent.leads}
                  </td>
                  <td className="font-sans text-sm text-right font-semibold text-primary py-3 px-3">
                    {agent.deals}
                  </td>
                  <td className="font-sans text-sm text-right text-green-400 font-bold py-3 px-3">
                    {agent.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="font-sans text-xs text-muted-foreground">
            Analytics powered by MSTC Analytics AI · Last updated:{" "}
            {new Date().toLocaleTimeString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsCenterPage() {
  return (
    <SecureAppGate appName="Analytics Center">
      <AnalyticsCenterInner />
    </SecureAppGate>
  );
}
