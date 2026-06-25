import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Cpu,
  Info,
  Lightbulb,
  RefreshCw,
  Sparkles,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";

type ImpactLevel = "High" | "Medium" | "Low";
type EffortLevel = "Quick" | "Medium" | "Complex";
type SuggestionStatus = "pending" | "applied" | "deferred";

type Suggestion = {
  id: string;
  title: string;
  description: string;
  impact: ImpactLevel;
  effort: EffortLevel;
  category: string;
  status: SuggestionStatus;
};

const INITIAL_SUGGESTIONS: Suggestion[] = [
  {
    id: "s1",
    title: "Add Lead Response Time Tracker",
    description:
      "Display average time between lead arrival and first response. Helps identify bottlenecks in the sales process and motivates faster follow-ups.",
    impact: "High",
    effort: "Quick",
    category: "CRM",
    status: "pending",
  },
  {
    id: "s2",
    title: "Enable Bulk WhatsApp from Pipeline",
    description:
      "Allow sending personalized WhatsApp messages to multiple leads at once directly from the lead pipeline view with one click.",
    impact: "High",
    effort: "Medium",
    category: "Automation",
    status: "pending",
  },
  {
    id: "s3",
    title: "Add Property Performance Heatmap",
    description:
      "Visual heatmap showing which localities generate the most enquiries, conversions and revenue. Helps focus your listing efforts.",
    impact: "Medium",
    effort: "Medium",
    category: "Analytics",
    status: "pending",
  },
  {
    id: "s4",
    title: "Set Up Automated Follow-up Sequences",
    description:
      "Create automated Day 1, Day 3, Day 7 follow-up message sequences per lead source. Reduces manual follow-up effort by 80%.",
    impact: "High",
    effort: "Medium",
    category: "Automation",
    status: "pending",
  },
  {
    id: "s5",
    title: "Add Client Birthday Reminder Automation",
    description:
      "Auto-send WhatsApp birthday greetings to past clients. Keeps MSTC top-of-mind for referrals and repeat business.",
    impact: "Medium",
    effort: "Quick",
    category: "CRM",
    status: "pending",
  },
  {
    id: "s6",
    title: "Enable SMS for High-Priority Leads",
    description:
      "Instant SMS notification when a lead with budget >₹1Cr submits an enquiry. Never miss a high-value prospect.",
    impact: "High",
    effort: "Quick",
    category: "Notifications",
    status: "pending",
  },
  {
    id: "s7",
    title: "Add Competitor Price Monitoring Alerts",
    description:
      "AI scans public listings weekly and alerts when similar properties nearby are listed at significantly different prices.",
    impact: "Medium",
    effort: "Complex",
    category: "Intelligence",
    status: "pending",
  },
  {
    id: "s8",
    title: "Enable AI-Powered Inquiry Pre-Screening",
    description:
      "AI reads every new enquiry before it reaches your team, scores quality, removes spam and adds context — saving 30 minutes daily.",
    impact: "High",
    effort: "Quick",
    category: "AI",
    status: "pending",
  },
];

const IMPACT_STYLES: Record<ImpactLevel, string> = {
  High: "bg-green-400/10 text-green-400 border-green-400/30",
  Medium: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
  Low: "bg-gray-400/10 text-gray-400 border-gray-400/30",
};

const EFFORT_STYLES: Record<EffortLevel, string> = {
  Quick: "bg-blue-400/10 text-blue-400 border-blue-400/30",
  Medium: "bg-orange-400/10 text-orange-400 border-orange-400/30",
  Complex: "bg-purple-400/10 text-purple-400 border-purple-400/30",
};

export default function AdminDashboardEnhancerTab() {
  const [suggestions, setSuggestions] =
    useState<Suggestion[]>(INITIAL_SUGGESTIONS);
  const [filter, setFilter] = useState<
    "all" | "pending" | "applied" | "deferred"
  >("all");
  const [analyzing, setAnalyzing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState("Today, 9:14 AM");

  function updateStatus(id: string, status: SuggestionStatus) {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    );
  }

  function reanalyze() {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setLastAnalyzed(
        new Date().toLocaleString("en-IN", {
          timeStyle: "short",
          dateStyle: "short",
        }),
      );
    }, 2200);
  }

  const filtered = suggestions.filter(
    (s) => filter === "all" || s.status === filter,
  );
  const appliedCount = suggestions.filter((s) => s.status === "applied").length;
  const pendingCount = suggestions.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-yellow-400 font-playfair flex items-center gap-2">
            <Sparkles size={22} className="text-yellow-500" />
            Dashboard Enhancer AI
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            AI continuously analyzes your dashboard usage and suggests
            high-impact improvements.
          </p>
        </div>
        <button
          type="button"
          onClick={reanalyze}
          disabled={analyzing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-yellow-700/40 bg-yellow-700/10 text-yellow-300 text-sm hover:bg-yellow-700/20 transition-colors disabled:opacity-60"
          data-ocid="dashboard-enhancer.reanalyze_button"
        >
          <RefreshCw size={14} className={analyzing ? "animate-spin" : ""} />
          {analyzing ? "Analyzing..." : "Re-Analyze Now"}
        </button>
      </div>

      {/* Last Analyzed + Stats */}
      <div className="rounded-xl border border-yellow-800/30 bg-white/[0.03] p-4 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-gray-400" />
          <span className="text-sm text-gray-300">
            Last analyzed:{" "}
            <strong className="text-yellow-300">{lastAnalyzed}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Lightbulb size={14} className="text-yellow-400" />
          <span className="text-sm text-gray-300">
            <strong className="text-yellow-300">{pendingCount}</strong> new
            suggestions
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-green-400" />
          <span className="text-sm text-gray-300">
            <strong className="text-green-300">{appliedCount}</strong> applied
            this month
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "pending", "applied", "deferred"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === f
                ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
            }`}
            data-ocid={`dashboard-enhancer.filter.${f}`}
          >
            {f}
            {f === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] bg-yellow-500/30 text-yellow-300">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Suggestion Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div
            className="rounded-xl border border-dashed border-yellow-800/30 p-8 text-center"
            data-ocid="dashboard-enhancer.empty_state"
          >
            <Cpu size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              No {filter !== "all" ? filter : ""} suggestions right now.
            </p>
          </div>
        ) : (
          filtered.map((s) => (
            <div
              key={s.id}
              className={`rounded-xl border p-4 transition-all ${
                s.status === "applied"
                  ? "border-green-800/40 bg-green-900/10"
                  : s.status === "deferred"
                    ? "border-gray-700/30 bg-black/20 opacity-70"
                    : "border-yellow-800/30 bg-white/[0.03] hover:bg-white/[0.05]"
              }`}
              data-ocid={`dashboard-enhancer.suggestion.${s.id}`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {s.status === "applied" && (
                      <CheckCircle2
                        size={14}
                        className="text-green-400 shrink-0"
                      />
                    )}
                    <p className="text-sm font-semibold text-white">
                      {s.title}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {s.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${IMPACT_STYLES[s.impact]}`}
                    >
                      <TrendingUp size={10} className="mr-1" />
                      {s.impact} Impact
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${EFFORT_STYLES[s.effort]}`}
                    >
                      <Zap size={10} className="mr-1" />
                      {s.effort}
                    </span>
                    <span className="text-[10px] text-gray-500 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                      {s.category}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {s.status === "applied" ? (
                    <span className="flex items-center gap-1 text-xs text-green-400 font-medium">
                      <CheckCircle2 size={13} /> Applied
                    </span>
                  ) : s.status === "deferred" ? (
                    <button
                      type="button"
                      onClick={() => updateStatus(s.id, "pending")}
                      className="text-xs text-gray-400 hover:text-yellow-400 transition-colors"
                      data-ocid={`dashboard-enhancer.restore_button.${s.id}`}
                    >
                      Restore
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => updateStatus(s.id, "applied")}
                        className="px-3 py-1.5 text-xs bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                        data-ocid={`dashboard-enhancer.apply_button.${s.id}`}
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(s.id, "deferred")}
                        className="px-3 py-1.5 text-xs border border-gray-600 text-gray-400 rounded-lg hover:text-gray-200 hover:border-gray-500 transition-colors"
                        data-ocid={`dashboard-enhancer.defer_button.${s.id}`}
                      >
                        Defer
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Footer */}
      <div className="rounded-xl border border-yellow-800/20 bg-yellow-900/5 p-4 flex items-start gap-3">
        <Info size={14} className="text-yellow-500 mt-0.5 shrink-0" />
        <p className="text-xs text-gray-400">
          The Dashboard Enhancer AI runs a full analysis every Monday morning at
          6 AM IST. It tracks widget usage, tab visit frequency, click patterns,
          and lead pipeline velocity to generate high-signal suggestions.
        </p>
      </div>
    </div>
  );
}
