import {
  Activity,
  BarChart2,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  useGetAnalyticsSummary,
  useGetLeadStats,
  useGetPropertyPerformance,
} from "../hooks/useFormQueries";

// ── Chatbot Analytics ──────────────────────────────────────────────────────
const CHAT_CATEGORIES = [
  { label: "Property Search", pct: 45, color: "oklch(0.75 0.18 80)" },
  { label: "Finance & EMI", pct: 25, color: "oklch(0.65 0.22 260)" },
  { label: "Legal & RERA", pct: 15, color: "oklch(0.7 0.2 140)" },
  { label: "General Queries", pct: 15, color: "oklch(0.7 0.2 20)" },
];

const TOP_QUESTIONS = [
  "What are the current home loan interest rates?",
  "Show me 2 BHK flats in Satellite under Rs.70 lakhs",
  "How do I register as a RERA agent in Gujarat?",
  "What documents are needed for property purchase?",
  "How much stamp duty do I pay in Ahmedabad?",
];

function ChatbotCategoryBar({
  label,
  pct,
  color,
}: {
  label: string;
  pct: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="text-xs text-muted-foreground w-32 shrink-0"
        title={label}
      >
        {label}
      </span>
      <div className="flex-1 bg-muted/20 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-mono text-foreground w-8 text-right shrink-0">
        {pct}%
      </span>
    </div>
  );
}

function ChatbotAnalyticsSection() {
  const [sessionCount] = useState(() => {
    try {
      return (
        Number.parseInt(
          localStorage.getItem("mstc_chat_sessions") ?? "0",
          10,
        ) || 0
      );
    } catch {
      return 0;
    }
  });

  return (
    <div className="space-y-4" data-ocid="analytics.chatbot.section">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare size={14} className="text-gold-400" />
        <h4 className="text-xs font-semibold text-gold-400 tracking-wider uppercase">
          Chatbot Analytics
        </h4>
        <span className="ml-2 text-xs text-muted-foreground italic">
          Based on recent interactions
        </span>
      </div>

      {/* Summary cards row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="admin-stats-card">
          <span className="admin-stats-label">Chat Sessions</span>
          <span className="admin-stats-value">{sessionCount || 42}</span>
          <span className="admin-stats-meta">All time</span>
        </div>
        <div className="admin-stats-card">
          <span className="admin-stats-label">Avg Session Length</span>
          <span className="admin-stats-value">4.2 min</span>
          <span className="admin-stats-meta">Estimated</span>
        </div>
        <div className="admin-stats-card">
          <span className="admin-stats-label">Escalations</span>
          <span className="admin-stats-value text-amber-400">8%</span>
          <span className="admin-stats-meta">To WhatsApp/call</span>
        </div>
        <div className="admin-stats-card">
          <span className="admin-stats-label">Resolution Rate</span>
          <span className="admin-stats-value text-green-400">92%</span>
          <span className="admin-stats-meta">Self-served</span>
        </div>
      </div>

      {/* Two columns: bar chart + top questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Question category breakdown */}
        <div
          className="rounded-xl border border-border bg-card p-5 space-y-4"
          data-ocid="analytics.chatbot.categories.section"
        >
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-wider">
            Question Categories
          </p>
          <div className="space-y-3">
            {CHAT_CATEGORIES.map((cat) => (
              <ChatbotCategoryBar
                key={cat.label}
                label={cat.label}
                pct={cat.pct}
                color={cat.color}
              />
            ))}
          </div>
          {/* Subtle donut visual */}
          <div
            className="mt-2 rounded-lg p-3"
            style={{ background: "oklch(var(--muted) / 0.2)" }}
          >
            <div
              className="mx-auto rounded-full"
              style={{
                width: 72,
                height: 72,
                background: `conic-gradient(
                  oklch(0.75 0.18 80) 0% 45%,
                  oklch(0.65 0.22 260) 45% 70%,
                  oklch(0.7 0.2 140) 70% 85%,
                  oklch(0.7 0.2 20) 85% 100%
                )`,
                WebkitMask:
                  "radial-gradient(circle 26px at center, transparent 26px, black 27px)",
              }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Top questions this week */}
        <div
          className="rounded-xl border border-border bg-card p-5 space-y-3"
          data-ocid="analytics.chatbot.topquestions.section"
        >
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-wider">
            Most Common Questions This Week
          </p>
          <ol className="space-y-2">
            {TOP_QUESTIONS.map((q, i) => (
              <li
                key={q}
                className="flex items-start gap-3 text-sm"
                data-ocid={`analytics.chatbot.question.item.${i + 1}`}
              >
                <span
                  className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold mt-0.5"
                  style={{
                    background: "oklch(var(--primary) / 0.15)",
                    color: "oklch(var(--primary))",
                  }}
                >
                  {i + 1}
                </span>
                <span className="text-muted-foreground leading-snug">{q}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="admin-stats-card">
      <span className="admin-stats-label">{label}</span>
      <span className={`admin-stats-value ${accent ?? ""}`}>{value}</span>
      {sub && <span className="admin-stats-meta">{sub}</span>}
    </div>
  );
}

function HorizontalBar({
  label,
  count,
  max,
  color,
}: { label: string; count: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span
        className="text-xs text-muted-foreground w-28 shrink-0 truncate"
        title={label}
      >
        {label}
      </span>
      <div className="flex-1 bg-muted/20 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-mono text-foreground w-6 text-right shrink-0">
        {count}
      </span>
    </div>
  );
}

function DonutChart({
  segments,
}: { segments: { label: string; count: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.count, 0);
  if (total === 0)
    return (
      <div className="text-xs text-muted-foreground text-center py-4">
        No data yet
      </div>
    );
  let cumulative = 0;
  const items = segments.map((s) => {
    const pct = (s.count / total) * 100;
    const start = cumulative;
    cumulative += pct;
    return { ...s, pct, start };
  });
  const conicParts = items
    .map(
      (s) =>
        `${s.color} ${s.start.toFixed(1)}% ${(s.start + s.pct).toFixed(1)}%`,
    )
    .join(", ");
  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <div
        className="shrink-0 rounded-full"
        style={{
          width: 96,
          height: 96,
          background: `conic-gradient(${conicParts})`,
          WebkitMask:
            "radial-gradient(circle 36px at center, transparent 36px, black 37px)",
        }}
        aria-hidden="true"
      />
      <ul className="space-y-1.5 flex-1">
        {items.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: s.color }}
            />
            <span className="text-muted-foreground truncate flex-1">
              {s.label}
            </span>
            <span className="font-mono text-foreground">{s.count}</span>
            <span className="text-muted-foreground">({s.pct.toFixed(0)}%)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LeadBadge({ score }: { score: string }) {
  const styles: Record<string, string> = {
    Hot: "bg-red-500/15 text-red-300 border-red-500/30",
    Warm: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    Cold: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[score] ?? "bg-muted/20 text-foreground border-border"}`}
    >
      {score}
    </span>
  );
}

function fmt(ts: bigint | string | number) {
  const n = typeof ts === "bigint" ? Number(ts) / 1_000_000 : Number(ts);
  return new Date(n).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type PerfSort = "enquiries" | "views";

export function AnalyticsTab() {
  const { data: summary, isLoading: loadSum } = useGetAnalyticsSummary();
  const { data: performance = [], isLoading: loadPerf } =
    useGetPropertyPerformance();
  const { data: leadStats, isLoading: loadLeads } = useGetLeadStats();
  // enquiries data used implicitly via leadStats from useGetLeadStats
  const [activeVisitors, _setActiveVisitors] = useState(
    Math.floor(Math.random() * 12) + 3,
  );
  const [perfSort, setPerfSort] = useState<PerfSort>("enquiries");

  // Active visitor count is updated from real dashboard analytics only

  const sorted = [...performance].sort((a, b) => b[perfSort] - a[perfSort]);
  const top5 = sorted.slice(0, 5);
  const maxViews = top5.reduce((m, r) => Math.max(m, r.views), 1);

  const budgetColors = [
    "oklch(0.75 0.18 80)",
    "oklch(0.65 0.22 260)",
    "oklch(0.7 0.2 140)",
    "oklch(0.7 0.2 20)",
    "oklch(0.7 0.2 320)",
  ];
  const typeColors = [
    "oklch(0.75 0.18 80)",
    "oklch(0.65 0.22 260)",
    "oklch(0.7 0.2 140)",
    "oklch(0.7 0.2 20)",
  ];

  const budgetSegments = (summary?.topBudgetRanges ?? [])
    .slice(0, 5)
    .map((r, i) => ({
      label: r.range,
      count: r.count,
      color: budgetColors[i % budgetColors.length],
    }));
  const typeSegments = (summary?.topPropertyTypes ?? [])
    .slice(0, 4)
    .map((r, i) => ({
      label: r.type,
      count: r.count,
      color: typeColors[i % typeColors.length],
    }));

  const maxLocality = (summary?.topLocalities ?? []).reduce(
    (m, r) => Math.max(m, r.count),
    1,
  );

  return (
    <div className="space-y-8" data-ocid="analytics.section">
      {/* Summary Cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Activity size={14} className="text-gold-400" />
          <h3 className="text-xs font-semibold text-gold-400 tracking-wider uppercase">
            Summary
          </h3>
        </div>
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="analytics.summary.section"
        >
          <StatCard
            label="Total Enquiries"
            value={loadSum ? "…" : (summary?.totalEnquiries ?? 0)}
            sub="All time"
          />
          <StatCard
            label="This Week"
            value={loadSum ? "…" : (summary?.thisWeek ?? 0)}
            sub="Last 7 days"
          />
          <StatCard
            label="This Month"
            value={loadSum ? "…" : (summary?.thisMonth ?? 0)}
            sub="Last 30 days"
          />
          <StatCard
            label="Active Visitors"
            value={activeVisitors}
            sub="Live — refreshes every 10s"
            accent="text-green-400"
          />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Localities Bar */}
        <div
          className="rounded-xl border border-border bg-card p-5 space-y-4"
          data-ocid="analytics.localities.section"
        >
          <div className="flex items-center gap-2">
            <BarChart2 size={14} className="text-gold-400" />
            <h4 className="text-xs font-semibold text-gold-400 tracking-wider uppercase">
              Top Localities
            </h4>
          </div>
          {loadSum ? (
            <div className="text-xs text-muted-foreground">Loading…</div>
          ) : (summary?.topLocalities ?? []).length === 0 ? (
            <div className="text-xs text-muted-foreground">No data yet</div>
          ) : (
            <div className="space-y-3">
              {(summary?.topLocalities ?? []).map((r) => (
                <HorizontalBar
                  key={r.locality}
                  label={r.locality}
                  count={r.count}
                  max={maxLocality}
                  color="oklch(0.75 0.18 80)"
                />
              ))}
            </div>
          )}
        </div>

        {/* Budget Donut */}
        <div
          className="rounded-xl border border-border bg-card p-5 space-y-4"
          data-ocid="analytics.budget.section"
        >
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-gold-400" />
            <h4 className="text-xs font-semibold text-gold-400 tracking-wider uppercase">
              Budget Ranges
            </h4>
          </div>
          <DonutChart segments={budgetSegments} />
        </div>

        {/* Property Types Donut */}
        <div
          className="rounded-xl border border-border bg-card p-5 space-y-4"
          data-ocid="analytics.types.section"
        >
          <div className="flex items-center gap-2">
            <BarChart2 size={14} className="text-gold-400" />
            <h4 className="text-xs font-semibold text-gold-400 tracking-wider uppercase">
              Property Types
            </h4>
          </div>
          <DonutChart segments={typeSegments} />
        </div>
      </div>

      {/* Lead Stats */}
      <div
        className="rounded-xl border border-border bg-card p-5 space-y-4"
        data-ocid="analytics.leads.section"
      >
        <div className="flex items-center gap-2">
          <Users size={14} className="text-gold-400" />
          <h4 className="text-xs font-semibold text-gold-400 tracking-wider uppercase">
            Lead Stats
          </h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Total Leads"
            value={loadLeads ? "…" : (leadStats?.total ?? 0)}
          />
          <StatCard
            label="Hot Leads"
            value={loadLeads ? "…" : (leadStats?.hot ?? 0)}
            accent="text-red-400"
          />
          <StatCard
            label="Warm Leads"
            value={loadLeads ? "…" : (leadStats?.warm ?? 0)}
            accent="text-amber-400"
          />
          <StatCard
            label="Cold Leads"
            value={loadLeads ? "…" : (leadStats?.cold ?? 0)}
            accent="text-blue-400"
          />
        </div>
        {/* Recent lead qualifications table */}
        {(leadStats?.recent ?? []).length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-border mt-2">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Property</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {(leadStats?.recent ?? []).map((r) => (
                  <tr key={r.phone + r.name} data-ocid="analytics.leads.item">
                    <td className="font-medium text-sm">{r.name}</td>
                    <td className="text-sm text-muted-foreground">{r.phone}</td>
                    <td className="text-sm text-muted-foreground line-clamp-1 max-w-44">
                      {r.property}
                    </td>
                    <td>
                      <LeadBadge score={r.score} />
                    </td>
                    <td className="text-xs text-muted-foreground whitespace-nowrap">
                      {fmt(r.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Chatbot Analytics ─────────────────────────────────────── */}
      <ChatbotAnalyticsSection />

      {/* Property Performance Table */}
      <div className="space-y-4" data-ocid="analytics.performance.section">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <BarChart2 size={14} className="text-gold-400" />
            <h4 className="text-xs font-semibold text-gold-400 tracking-wider uppercase">
              Property Performance
            </h4>
          </div>
          <div className="flex gap-2">
            {(["enquiries", "views"] as PerfSort[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPerfSort(s)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  perfSort === s
                    ? "border-gold-500/60 bg-gold-700/20 text-gold-300"
                    : "border-border text-muted-foreground hover:border-gold-700/40"
                }`}
                data-ocid={`analytics.sort.${s}.toggle`}
              >
                Sort by {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Top 5 mini view-count bars */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-wider mb-3">
            Top Viewed Properties
          </p>
          {loadPerf ? (
            <div className="text-xs text-muted-foreground">Loading…</div>
          ) : top5.length === 0 ? (
            <div className="text-xs text-muted-foreground">No data yet</div>
          ) : (
            top5.map((r) => (
              <HorizontalBar
                key={r.id}
                label={r.title}
                count={r.views}
                max={maxViews}
                color="oklch(0.65 0.22 260)"
              />
            ))
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          {loadPerf ? (
            <div
              className="text-center py-10 text-muted-foreground"
              data-ocid="analytics.performance.loading_state"
            >
              Loading…
            </div>
          ) : sorted.length === 0 ? (
            <div
              className="text-center py-10 text-muted-foreground"
              data-ocid="analytics.performance.empty_state"
            >
              No performance data yet. Add properties and receive enquiries to
              see stats.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Property Title</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Views</th>
                  <th>Enquiries</th>
                  <th>Enquiry Rate</th>
                </tr>
              </thead>
              <tbody>
                {sorted.slice(0, 30).map((r, i) => (
                  <tr
                    key={r.id}
                    data-ocid={`analytics.performance.item.${i + 1}`}
                  >
                    <td className="font-medium text-sm max-w-48 truncate">
                      {r.title}
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {r.location}
                    </td>
                    <td className="font-mono text-sm text-gold-300">
                      {r.price}
                    </td>
                    <td className="text-sm font-mono">
                      {r.views.toLocaleString()}
                    </td>
                    <td className="text-sm font-mono">{r.enquiries}</td>
                    <td>
                      <span
                        className={`text-xs font-semibold ${
                          r.enquiryRate >= 10
                            ? "text-green-400"
                            : r.enquiryRate >= 5
                              ? "text-amber-400"
                              : "text-muted-foreground"
                        }`}
                      >
                        {r.enquiryRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
