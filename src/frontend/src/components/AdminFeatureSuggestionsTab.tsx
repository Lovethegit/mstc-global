import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Cpu,
  Lightbulb,
  RefreshCw,
  Rocket,
  Sparkles,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";

type ImpactLevel = "High" | "Medium" | "Low";
type EffortLevel = "Quick" | "Medium" | "Complex";
type FeatureStatus = "pending" | "approved" | "deferred" | "rejected";

type FeatureSuggestion = {
  id: string;
  title: string;
  description: string;
  impact: ImpactLevel;
  effort: EffortLevel;
  category: string;
  status: FeatureStatus;
  weekAdded: string;
};

const INITIAL_FEATURES: FeatureSuggestion[] = [
  {
    id: "f1",
    title: "360\u00b0 Property Walkthrough",
    description:
      "Allow users to navigate properties room by room using arrow controls. Works on mobile without any VR headset.",
    impact: "High",
    effort: "Medium",
    category: "Property Portal",
    status: "pending",
    weekAdded: "This week",
  },
  {
    id: "f2",
    title: "AI Mortgage Pre-Qualification",
    description:
      "Instant pre-qualification letter PDF based on user income, EMIs and savings. Buyers can show it to sellers immediately.",
    impact: "High",
    effort: "Quick",
    category: "Finance",
    status: "pending",
    weekAdded: "This week",
  },
  {
    id: "f3",
    title: "Multilingual Voice Assistant",
    description:
      "Full Gujarati and Hindi voice conversation support across the entire chatbot. Hands-free property search.",
    impact: "High",
    effort: "Complex",
    category: "AI & Chat",
    status: "pending",
    weekAdded: "This week",
  },
  {
    id: "f4",
    title: "Neighbourhood Comparison Tool",
    description:
      "Compare 2 Ahmedabad localities side-by-side: avg price per sqft, connectivity, schools, upcoming projects.",
    impact: "Medium",
    effort: "Medium",
    category: "Property Portal",
    status: "pending",
    weekAdded: "This week",
  },
  {
    id: "f5",
    title: "Property Investment ROI Simulator",
    description:
      "Enter purchase price, expected rent and hold period to get IRR, total return and projected exit value.",
    impact: "High",
    effort: "Medium",
    category: "Finance",
    status: "pending",
    weekAdded: "Last week",
  },
  {
    id: "f6",
    title: "AI Deal Memo Generator",
    description:
      "Auto-generate a one-page deal summary after every enquiry: client profile, property match, recommended next steps.",
    impact: "High",
    effort: "Quick",
    category: "AI & Chat",
    status: "pending",
    weekAdded: "Last week",
  },
  {
    id: "f7",
    title: "Sentiment Tracker",
    description:
      "Weekly emotional tone report on all incoming messages and enquiries. Shows if users are frustrated, excited or confused.",
    impact: "Medium",
    effort: "Medium",
    category: "Analytics",
    status: "pending",
    weekAdded: "Last week",
  },
  {
    id: "f8",
    title: "Competitor Intelligence Dashboard",
    description:
      "Monitor competitor launches, price shifts in target Ahmedabad localities and alert you to significant market moves.",
    impact: "High",
    effort: "Complex",
    category: "Intelligence",
    status: "pending",
    weekAdded: "Last week",
  },
  {
    id: "f9",
    title: "Legal Cost Estimator",
    description:
      "Full breakdown of stamp duty, registration fee, advocate fees and GST for any Gujarat property transaction.",
    impact: "Medium",
    effort: "Quick",
    category: "Legal",
    status: "pending",
    weekAdded: "2 weeks ago",
  },
  {
    id: "f10",
    title: "Referral Partner Portal",
    description:
      "Brokers and agents register, submit leads, and track their own commissions in a dedicated partner dashboard.",
    impact: "High",
    effort: "Complex",
    category: "Business",
    status: "pending",
    weekAdded: "2 weeks ago",
  },
  {
    id: "f11",
    title: "White-Label Client Portal",
    description:
      "Branded subdomain experience for major clients showing their own properties, documents and deal status.",
    impact: "High",
    effort: "Complex",
    category: "Business",
    status: "pending",
    weekAdded: "2 weeks ago",
  },
  {
    id: "f12",
    title: "AI Weekly Market Brief",
    description:
      "Auto-generated downloadable PDF every Monday: top property news, price changes by locality, upcoming launches in Ahmedabad.",
    impact: "Medium",
    effort: "Medium",
    category: "Content",
    status: "pending",
    weekAdded: "2 weeks ago",
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

const IMPACT_ORDER: Record<ImpactLevel, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

export default function AdminFeatureSuggestionsTab() {
  const [features, setFeatures] =
    useState<FeatureSuggestion[]>(INITIAL_FEATURES);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "deferred" | "rejected"
  >("all");
  const [sortByImpact, setSortByImpact] = useState(true);
  const [generating, setGenerating] = useState(false);

  function updateStatus(id: string, status: FeatureStatus) {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status } : f)),
    );
  }

  function generateNew() {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2500);
  }

  const filtered = features
    .filter((f) => filter === "all" || f.status === filter)
    .sort((a, b) =>
      sortByImpact ? IMPACT_ORDER[a.impact] - IMPACT_ORDER[b.impact] : 0,
    );

  const approved = features.filter((f) => f.status === "approved");
  const pending = features.filter((f) => f.status === "pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-yellow-400 font-playfair flex items-center gap-2">
            <Rocket size={22} className="text-yellow-500" />
            AI Innovation Lab
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Weekly feature ideas generated by your AI, ranked by business
            impact. Approve ideas to queue them for development.
          </p>
        </div>
        <button
          type="button"
          onClick={generateNew}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-yellow-700/40 bg-yellow-700/10 text-yellow-300 text-sm hover:bg-yellow-700/20 transition-colors disabled:opacity-60"
          data-ocid="feature-suggestions.generate_button"
        >
          <Sparkles size={14} className={generating ? "animate-pulse" : ""} />
          {generating ? "AI is thinking..." : "Generate New Ideas"}
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Total Suggestions",
            value: features.length,
            icon: <Lightbulb size={16} />,
            color: "text-yellow-400",
          },
          {
            label: "Pending Review",
            value: pending.length,
            icon: <Clock size={16} />,
            color: "text-orange-400",
          },
          {
            label: "Approved",
            value: approved.length,
            icon: <CheckCircle2 size={16} />,
            color: "text-green-400",
          },
          {
            label: "High Impact",
            value: features.filter((f) => f.impact === "High").length,
            icon: <TrendingUp size={16} />,
            color: "text-blue-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-yellow-800/30 bg-white/[0.03] p-4"
          >
            <div className={`flex items-center gap-1.5 mb-1 ${stat.color}`}>
              {stat.icon}
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <span className="text-2xl font-bold text-white">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Approved Queue */}
      {approved.length > 0 && (
        <div className="rounded-xl border border-green-800/40 bg-green-900/10 p-4">
          <h3 className="text-sm font-semibold text-green-300 mb-3 flex items-center gap-2">
            <Rocket size={14} />
            Approved Queue — {approved.length} feature
            {approved.length !== 1 ? "s" : ""} ready to build
          </h3>
          <div className="space-y-2">
            {approved.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-green-900/20 px-4 py-2.5"
                data-ocid={`feature-suggestions.approved.${f.id}`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CheckCircle2 size={13} className="text-green-400 shrink-0" />
                  <span className="text-sm text-white truncate">{f.title}</span>
                  <span
                    className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${IMPACT_STYLES[f.impact]}`}
                  >
                    {f.impact}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updateStatus(f.id, "pending")}
                  className="text-xs text-gray-500 hover:text-yellow-400 transition-colors shrink-0"
                >
                  Undo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {(
            ["all", "pending", "approved", "deferred", "rejected"] as const
          ).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
              }`}
              data-ocid={`feature-suggestions.filter.${f}`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSortByImpact((s) => !s)}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-yellow-400 transition-colors"
          data-ocid="feature-suggestions.sort_button"
        >
          <TrendingUp size={12} />
          {sortByImpact ? "Sorted by impact" : "Original order"}
        </button>
      </div>

      {/* Feature Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div
            className="rounded-xl border border-dashed border-yellow-800/30 p-8 text-center"
            data-ocid="feature-suggestions.empty_state"
          >
            <Cpu size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              No {filter !== "all" ? filter : ""} suggestions right now.
            </p>
          </div>
        ) : (
          filtered.map((f, i) => (
            <div
              key={f.id}
              className={`rounded-xl border p-4 transition-all ${
                f.status === "approved"
                  ? "border-green-800/40 bg-green-900/10"
                  : f.status === "rejected"
                    ? "border-gray-700/30 bg-black/20 opacity-60"
                    : f.status === "deferred"
                      ? "border-gray-700/30 bg-black/20 opacity-75"
                      : "border-yellow-800/30 bg-white/[0.03] hover:bg-white/[0.05]"
              }`}
              data-ocid={`feature-suggestions.item.${i + 1}`}
            >
              <div className="flex items-start gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  {/* Priority badge + title */}
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${IMPACT_STYLES[f.impact]}`}
                    >
                      {f.impact} Priority
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {f.weekAdded}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">
                    {f.title}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {f.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${EFFORT_STYLES[f.effort]}`}
                    >
                      <Zap size={10} className="mr-1" />
                      {f.effort} effort
                    </span>
                    <span className="text-[10px] text-gray-500 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                      {f.category}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {f.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => updateStatus(f.id, "approved")}
                        className="px-3 py-1.5 text-xs bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                        data-ocid={`feature-suggestions.approve_button.${f.id}`}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(f.id, "deferred")}
                        className="px-3 py-1.5 text-xs border border-gray-600 text-gray-400 rounded-lg hover:text-gray-200 hover:border-gray-500 transition-colors"
                        data-ocid={`feature-suggestions.defer_button.${f.id}`}
                      >
                        Defer
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(f.id, "rejected")}
                        className="px-3 py-1.5 text-xs border border-red-900/50 text-red-400 rounded-lg hover:border-red-700 transition-colors"
                        data-ocid={`feature-suggestions.reject_button.${f.id}`}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {f.status === "approved" && (
                    <span className="flex items-center gap-1 text-xs text-green-400 font-medium">
                      <CheckCircle2 size={13} /> Approved
                    </span>
                  )}
                  {(f.status === "deferred" || f.status === "rejected") && (
                    <button
                      type="button"
                      onClick={() => updateStatus(f.id, "pending")}
                      className="text-xs text-gray-500 hover:text-yellow-400 transition-colors"
                      data-ocid={`feature-suggestions.restore_button.${f.id}`}
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
