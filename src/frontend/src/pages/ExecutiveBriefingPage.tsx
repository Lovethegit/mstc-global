import SecureAppGate from "@/components/shared/SecureAppGate";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  CheckSquare,
  Clock,
  Square,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

function BarChart({
  data,
  labels,
  max,
}: { data: number[]; labels: string[]; max: number }) {
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((val, i) => (
        <div
          key={labels[i]}
          className="flex-1 flex flex-col items-center gap-1"
        >
          <div
            className="w-full rounded-t-sm bg-primary/30 hover:bg-primary/60 transition-colors"
            style={{ height: `${(val / max) * 80}px` }}
            title={`${labels[i]}: ${val}`}
          />
          <span className="font-sans text-[9px] text-muted-foreground">
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

const briefingData = {
  decisions: [
    {
      id: 1,
      source: "Campaign Studio",
      title: "Approve Diwali campaign budget ₹2.4L",
      status: "pending" as "pending" | "approved" | "deferred",
    },
    {
      id: 2,
      source: "Business Development",
      title: "Confirm Surat developer partnership",
      status: "pending" as "pending" | "approved" | "deferred",
    },
    {
      id: 3,
      source: "HR/People AI",
      title: "Review senior staff hire recommendation",
      status: "pending" as "pending" | "approved" | "deferred",
    },
  ],
  priorities: [
    {
      id: 1,
      text: "Review 4 pending decisions in Master Control (Campaign AI, Builder AI, Policy Writer AI, Feature AI)",
      done: false,
    },
    {
      id: 2,
      text: "Follow up on 2 hot leads: Sharma family (3BHK Bopal) and Patel & Sons (commercial space SG Hwy)",
      done: false,
    },
    {
      id: 3,
      text: "Approve updated Privacy Policy — PDPB v2.1 compliance, drafted by Raksha AI. Deadline: 3 days.",
      done: false,
    },
  ],
  weekForecast: [
    {
      day: "Today",
      item: "SG Highway listing launch — 6 new units going live",
    },
    {
      day: "Wednesday",
      item: "RERA filing deadline: Project Skyline registration renewal",
    },
    {
      day: "Thursday",
      item: "Quarterly review: Revenue vs target (₹42L vs ₹75L goal)",
    },
    {
      day: "Friday",
      item: "Ahmedabad Property Expo — lead capture booth setup",
    },
    {
      day: "Saturday",
      item: "Monthly Aria briefing: full AI operations review",
    },
  ],
  aiActions: [
    {
      ai: "Valuation AI",
      action:
        "Updated price estimates for 14 active listings based on latest jantri data",
      impact: "Positive",
    },
    {
      ai: "SEO AI",
      action:
        "Optimized 8 service pages — avg keyword rank improved from 14 to 9",
      impact: "Positive",
    },
    {
      ai: "Policy Writer AI",
      action:
        "Drafted PDPB v2.1 compliant Privacy Policy — awaiting your approval",
      impact: "Pending",
    },
    {
      ai: "Bot Hunter AI",
      action: "Blocked 203 scrapers and 47 fake lead submissions",
      impact: "Positive",
    },
    {
      ai: "Lead AI",
      action:
        "Auto-qualified 18 new leads, routed 4 hot leads to Property team",
      impact: "Positive",
    },
  ],
  weeklyLeads: [8, 14, 11, 17, 12, 9, 15],
  weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

const AI_BOARD = [
  {
    name: "Vikram Mehta AI",
    title: "Property Strategist",
    avatar: "VM",
    recommendation:
      "Increase inventory in Bopal and South Bopal — demand up 22% YoY. Target 15 new listings this quarter.",
    sentiment: "positive" as const,
  },
  {
    name: "Ananya Kapoor AI",
    title: "Finance Advisor",
    avatar: "AK",
    recommendation:
      "RBI rate hold expected. Lock in fixed-rate deals before next MPC. Refinancing window open for 3 active loans.",
    sentiment: "positive" as const,
  },
  {
    name: "Deepak Nair AI",
    title: "Legal Counsel",
    avatar: "DN",
    recommendation:
      "RERA renewal for Project Skyline is 8 days away. Prioritize document prep. No outstanding disputes.",
    sentiment: "warning" as const,
  },
  {
    name: "Priya Sen AI",
    title: "Marketing Director",
    avatar: "PS",
    recommendation:
      "Digital leads up 34% since SEO revamp. Diwali campaign budget approval needed — ROI projection 4.2x.",
    sentiment: "positive" as const,
  },
  {
    name: "Rahul Gupta AI",
    title: "Growth Advisor",
    avatar: "RG",
    recommendation:
      "Surat expansion viable based on comparable market data. Franchise model pilot recommended Q1 next year.",
    sentiment: "positive" as const,
  },
];

const PIPELINE_DEALS = [
  {
    client: "Sharma Family",
    property: "3BHK, Bopal Heights",
    value: "₹1.2 Cr",
    confidence: 87,
    stage: "Negotiation",
    daysLeft: 12,
  },
  {
    client: "Patel & Sons",
    property: "Commercial Space, SG Hwy",
    value: "₹4.8 Cr",
    confidence: 72,
    stage: "Due Diligence",
    daysLeft: 21,
  },
  {
    client: "NRI — R. Desai",
    property: "Plot, Shela",
    value: "₹65 L",
    confidence: 91,
    stage: "Agreement",
    daysLeft: 5,
  },
  {
    client: "Mehta Developers",
    property: "JDA — Vastrapur",
    value: "₹2.1 Cr",
    confidence: 64,
    stage: "Initial",
    daysLeft: 45,
  },
];

function AiBoardSection() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div
      className="rounded-2xl border border-primary/30 bg-card/60 p-5"
      data-ocid="briefing.ai_board.section"
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4 text-primary" />
        <h2 className="font-serif text-base font-semibold text-primary">
          AI Board of Advisors
        </h2>
        <span className="ml-auto text-xs text-muted-foreground">
          5 advisors · All active
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {AI_BOARD.map((advisor, idx) => (
          <button
            key={advisor.name}
            type="button"
            onClick={() => setSelected(selected === idx ? null : idx)}
            className={`text-left rounded-xl p-3 border transition-all ${
              selected === idx
                ? "border-primary/60 bg-primary/10"
                : "border-border/30 bg-background/40 hover:border-primary/30"
            }`}
            data-ocid={`briefing.advisor.item.${idx + 1}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-primary">
                  {advisor.avatar}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {advisor.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {advisor.title}
                </p>
              </div>
              <span
                className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 ${
                  advisor.sentiment === "positive"
                    ? "bg-green-400"
                    : "bg-yellow-400"
                }`}
              />
            </div>
            {selected === idx && (
              <p className="font-sans text-xs text-foreground/80 leading-relaxed border-t border-border/20 pt-2 mt-1">
                {advisor.recommendation}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function PipelineSection() {
  return (
    <div
      className="rounded-2xl border border-primary/20 bg-card/60 p-5"
      data-ocid="briefing.pipeline.section"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h2 className="font-serif text-base font-semibold text-primary">
          Predictive Pipeline
        </h2>
        <span className="ml-auto text-xs text-green-400">
          4 deals likely this month
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {PIPELINE_DEALS.map((deal, idx) => (
          <div
            key={deal.client}
            className="rounded-xl border border-border/20 bg-background/40 px-4 py-3"
            data-ocid={`briefing.pipeline.item.${idx + 1}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-sans text-sm font-semibold text-foreground truncate">
                  {deal.client}
                </p>
                <p className="font-sans text-xs text-muted-foreground truncate">
                  {deal.property}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-sans text-sm font-bold text-primary">
                  {deal.value}
                </p>
                <p className="font-sans text-[10px] text-muted-foreground">
                  {deal.stage}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 bg-muted/30 rounded-full h-1">
                <div
                  className="h-1 rounded-full bg-primary"
                  style={{ width: `${deal.confidence}%` }}
                />
              </div>
              <span className="font-sans text-[10px] text-primary shrink-0">
                {deal.confidence}% confidence
              </span>
              <span className="font-sans text-[10px] text-muted-foreground shrink-0">
                {deal.daysLeft}d left
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExecutiveBriefingInner() {
  const [priorities, setPriorities] = useState(briefingData.priorities);
  const [decisions, setDecisions] = useState(briefingData.decisions);
  const [ariaInput, setAriaInput] = useState("");
  const [ariaMessages, setAriaMessages] = useState<
    { role: "user" | "aria"; text: string }[]
  >([]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const togglePriority = (id: number) => {
    setPriorities((p) =>
      p.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
    );
  };

  const handleDecision = (id: number, action: "approved" | "deferred") => {
    setDecisions((d) =>
      d.map((item) => (item.id === id ? { ...item, status: action } : item)),
    );
  };

  const ariaResponses: Record<string, string> = {
    default:
      "I'm Aria, your MSTC AI Chief Officer. All 2,000+ agents are fully operational. Shall I pull a detailed report on any division?",
    leads:
      "12 new leads today — 4 marked Hot. Rajan AI has already escalated the SG Highway enquiries. Expected conversion: 2 this week.",
    revenue:
      "Current month revenue: ₹12.4 Crore. Pipeline value: ₹84 Crore. On track to close 3 major deals before month-end.",
    security:
      "Security Score 98/100. 1,247 threats blocked today. GateKeeper AI and Bot Hunter AI both running at 100% efficiency. Zero incidents.",
    rera: "RERA compliance status: All active projects are registered. Project Skyline renewal is due on Wednesday — I've flagged it in your calendar.",
    market:
      "RBI Policy Meeting in 8 days. Analysts expect repo rate to hold at 6.5%. Ahmedabad residential demand is up 14% YoY — strong quarter ahead.",
    property:
      "3 new properties added today. Valuation AI updated 14 listings with jantri data. Total active inventory: 87 properties across all segments.",
    staff:
      "490+ AI agents and 28 human staff are active. All agents reported on-time. Performance dashboard shows 14,293 tasks completed today.",
  };

  const getAriaResponse = (msg: string): string => {
    const lower = msg.toLowerCase();
    if (lower.includes("lead") || lower.includes("enquir"))
      return ariaResponses.leads;
    if (
      lower.includes("revenue") ||
      lower.includes("money") ||
      lower.includes("crore")
    )
      return ariaResponses.revenue;
    if (lower.includes("secur") || lower.includes("threat"))
      return ariaResponses.security;
    if (lower.includes("rera") || lower.includes("compliance"))
      return ariaResponses.rera;
    if (
      lower.includes("market") ||
      lower.includes("rbi") ||
      lower.includes("rate")
    )
      return ariaResponses.market;
    if (lower.includes("propert") || lower.includes("listing"))
      return ariaResponses.property;
    if (
      lower.includes("staff") ||
      lower.includes("agent") ||
      lower.includes("ai")
    )
      return ariaResponses.staff;
    return ariaResponses.default;
  };

  const sendToAria = () => {
    const msg = ariaInput.trim();
    if (!msg) return;
    setAriaMessages((prev) => [
      ...prev,
      { role: "user", text: msg },
      { role: "aria", text: getAriaResponse(msg) },
    ]);
    setAriaInput("");
  };

  const completedCount = priorities.filter((p) => p.done).length;
  const maxLeads = Math.max(...briefingData.weeklyLeads);

  return (
    <div
      className="min-h-screen py-6 px-4"
      style={{ background: "#06090f" }}
      data-ocid="briefing.page"
    >
      <div className="max-w-5xl mx-auto">
        {/* Back + Header */}
        <div className="mb-6">
          <a
            href="/master"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 font-sans text-xs transition-colors mb-4"
            data-ocid="briefing.back_link"
          >
            ← Back to Master Control
          </a>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-sans text-xs text-muted-foreground uppercase tracking-widest">
              Executive Briefing
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">
            {greeting}, Love.
          </h1>
          <p className="font-serif text-lg text-foreground/80 mt-1">
            Here is your daily briefing.
          </p>
          <p className="font-sans text-sm text-muted-foreground mt-1">
            {todayFormatted}
          </p>
        </div>

        {/* Stats Row */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
          data-ocid="briefing.stats.section"
        >
          {[
            { label: "New Leads", value: "12", sub: "today", icon: Users },
            {
              label: "Properties Added",
              value: "3",
              sub: "today",
              icon: TrendingUp,
            },
            {
              label: "Revenue",
              value: "₹12.4Cr",
              sub: "this month",
              icon: Zap,
            },
            {
              label: "Active Deals",
              value: "28",
              sub: "in pipeline",
              icon: CheckCircle2,
            },
          ].map((m, idx) => (
            <div
              key={m.label}
              className="rounded-xl border border-primary/20 bg-card/60 px-4 py-4"
              data-ocid={`briefing.stat.item.${idx + 1}`}
            >
              <m.icon className="w-4 h-4 mb-2 text-primary" />
              <p className="font-serif text-2xl font-bold text-primary">
                {m.value}
              </p>
              <p className="font-sans text-[11px] text-muted-foreground leading-tight mt-0.5">
                {m.label}
              </p>
              <p className="font-sans text-[10px] text-primary/60 mt-0.5">
                {m.sub}
              </p>
            </div>
          ))}
        </div>

        {/* AI Operations + Market + Security banners */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div
            className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 flex items-start gap-3"
            data-ocid="briefing.ai_ops.banner"
          >
            <Brain className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-sans text-[10px] text-primary font-semibold uppercase tracking-wider">
                AI Operations
              </p>
              <p className="font-sans text-xs text-foreground/80 mt-0.5">
                All 2,000+ agents operational
              </p>
              <p className="font-sans text-[10px] text-muted-foreground mt-0.5">
                14,293 tasks today · 0 incidents
              </p>
            </div>
          </div>
          <div
            className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 flex items-start gap-3"
            data-ocid="briefing.market.banner"
          >
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-sans text-[10px] text-yellow-400 font-semibold uppercase tracking-wider">
                Market Alert
              </p>
              <p className="font-sans text-xs text-foreground/80 mt-0.5">
                RBI Policy Meeting in 8 days
              </p>
              <p className="font-sans text-[10px] text-muted-foreground mt-0.5">
                Repo Rate expected to hold at 6.5%
              </p>
            </div>
          </div>
          <div
            className="rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3 flex items-start gap-3"
            data-ocid="briefing.security.banner"
          >
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-sans text-[10px] text-green-400 font-semibold uppercase tracking-wider">
                Security Status
              </p>
              <p className="font-sans text-xs text-foreground/80 mt-0.5">
                Score: 98/100 · Fortress Mode
              </p>
              <p className="font-sans text-[10px] text-muted-foreground mt-0.5">
                0 incidents · 1,247 threats blocked
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left col 2/3 */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Decision Queue */}
            <div
              className="rounded-2xl border border-primary/30 bg-card/60 p-5"
              data-ocid="briefing.decisions.section"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-primary" />
                <h2 className="font-serif text-base font-semibold text-primary">
                  Decision Queue
                </h2>
                <span className="ml-auto bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {decisions.filter((d) => d.status === "pending").length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {decisions.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-background/40 border border-border/20 px-4 py-3"
                    data-ocid={`briefing.decision.item.${idx + 1}`}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="font-sans text-[10px] text-primary font-semibold">
                        {item.source}
                      </span>
                      <p className="font-sans text-xs text-foreground mt-0.5">
                        {item.title}
                      </p>
                    </div>
                    {item.status === "pending" ? (
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDecision(item.id, "approved")}
                          className="px-2.5 py-1 rounded-lg bg-green-500/15 text-green-400 border border-green-500/30 font-sans text-[10px] hover:bg-green-500/25 transition-colors"
                          data-ocid={`briefing.decision.approve_button.${idx + 1}`}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecision(item.id, "deferred")}
                          className="px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 font-sans text-[10px] hover:bg-yellow-500/15 transition-colors"
                          data-ocid={`briefing.decision.defer_button.${idx + 1}`}
                        >
                          Defer
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`font-sans text-[10px] px-3 py-1 rounded-full shrink-0 ${
                          item.status === "approved"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {item.status === "approved"
                          ? "✓ Approved"
                          : "⏸ Deferred"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Actions Today */}
            <div
              className="rounded-2xl border border-primary/20 bg-card/60 p-5"
              data-ocid="briefing.ai_actions.section"
            >
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-primary" />
                <h2 className="font-serif text-base font-semibold text-primary">
                  AI Actions Today
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {briefingData.aiActions.map((item, idx) => (
                  <div
                    key={`ai-${item.ai}-${idx}`}
                    className="flex items-start gap-3"
                    data-ocid={`briefing.ai_action.item.${idx + 1}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        item.impact === "Positive"
                          ? "bg-green-400"
                          : "bg-yellow-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-sans text-xs font-semibold text-primary">
                        {item.ai}{" "}
                      </span>
                      <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                        {item.action}
                      </p>
                    </div>
                    <span
                      className={`font-sans text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                        item.impact === "Positive"
                          ? "bg-green-500/15 text-green-400"
                          : "bg-yellow-500/15 text-yellow-400"
                      }`}
                    >
                      {item.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Aria AI Chat */}
            <div
              className="rounded-2xl border border-primary/30 bg-card/60 p-5"
              data-ocid="briefing.aria.section"
            >
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-primary" />
                <h2 className="font-serif text-base font-semibold text-primary">
                  Ask Aria
                </h2>
                <span className="ml-2 text-[10px] font-sans px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">
                  Online
                </span>
              </div>
              {ariaMessages.length > 0 && (
                <div className="flex flex-col gap-2 mb-3 max-h-48 overflow-y-auto">
                  {ariaMessages.map((msg, idx) => (
                    <div
                      key={`msg-${msg.role}-${idx}-${msg.text.slice(0, 8)}`}
                      className={`rounded-lg px-3 py-2 font-sans text-xs ${
                        msg.role === "user"
                          ? "bg-primary/15 text-primary self-end ml-8"
                          : "bg-background/60 border border-border/20 text-foreground/85 mr-8"
                      }`}
                    >
                      {msg.role === "aria" && (
                        <span className="block text-[10px] text-primary font-semibold mb-0.5">
                          Aria
                        </span>
                      )}
                      {msg.text}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ariaInput}
                  onChange={(e) => setAriaInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendToAria()}
                  placeholder="Ask Aria anything..."
                  className="flex-1 bg-background/40 border border-border/30 rounded-lg px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 min-w-0"
                  data-ocid="briefing.aria.input"
                />
                <button
                  type="button"
                  onClick={sendToAria}
                  className="px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 font-sans text-xs font-medium transition-colors shrink-0"
                  data-ocid="briefing.aria.send_button"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="font-sans text-[10px] text-muted-foreground mt-2">
                Try: "How are leads today?", "What's the revenue?", "Security
                status?"
              </p>
            </div>
          </div>

          {/* Right col 1/3 */}
          <div className="flex flex-col gap-5">
            {/* Priorities */}
            <div
              className="rounded-2xl border border-primary/30 bg-card/60 p-5"
              data-ocid="briefing.priorities.section"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h2 className="font-serif text-base font-semibold text-primary">
                    Priorities
                  </h2>
                </div>
                <span className="font-sans text-xs text-muted-foreground">
                  {completedCount}/{priorities.length} done
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {priorities.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => togglePriority(item.id)}
                    className="flex items-start gap-3 text-left hover:bg-primary/5 rounded-lg px-2 py-2 -mx-2 transition-colors"
                    data-ocid={`briefing.priority.item.${idx + 1}`}
                  >
                    {item.done ? (
                      <CheckSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <p
                      className={`font-sans text-xs leading-relaxed ${
                        item.done
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {item.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Lead Trend */}
            <div
              className="rounded-2xl border border-primary/20 bg-card/60 p-5"
              data-ocid="briefing.chart.section"
            >
              <h2 className="font-serif text-sm font-semibold text-primary mb-3">
                Weekly Lead Trend
              </h2>
              <BarChart
                data={briefingData.weeklyLeads}
                labels={briefingData.weekDays}
                max={maxLeads}
              />
              <div className="flex justify-between mt-2">
                <span className="font-sans text-[10px] text-muted-foreground">
                  86 total this week
                </span>
                <span className="font-sans text-[10px] text-green-400">
                  ↑ 12% vs last week
                </span>
              </div>
            </div>

            {/* This Week Forecast */}
            <div
              className="rounded-2xl border border-primary/20 bg-card/60 p-5"
              data-ocid="briefing.forecast.section"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-primary" />
                <h2 className="font-serif text-base font-semibold text-primary">
                  This Week
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                {briefingData.weekForecast.map((item, idx) => (
                  <div
                    key={item.day}
                    className="flex items-start gap-2 rounded-lg bg-background/40 border border-border/20 px-3 py-2.5"
                    data-ocid={`briefing.forecast.item.${idx + 1}`}
                  >
                    <span className="font-sans text-[10px] font-semibold text-primary w-16 shrink-0 mt-0.5">
                      {item.day}
                    </span>
                    <span className="font-sans text-xs text-foreground/80">
                      {item.item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div
              className="rounded-2xl border border-primary/20 bg-card/60 p-5"
              data-ocid="briefing.quick_actions.section"
            >
              <h2 className="font-serif text-sm font-semibold text-primary mb-3">
                Quick Actions
              </h2>
              <div className="flex flex-col gap-2">
                {[
                  {
                    label: "Open Master Control",
                    href: "/master",
                    ocid: "briefing.master_control_button",
                  },
                  {
                    label: "View Audit Log",
                    href: "/master",
                    ocid: "briefing.audit_log_button",
                  },
                  {
                    label: "Security Dashboard",
                    href: "/security",
                    ocid: "briefing.security_button",
                  },
                  {
                    label: "Legal Command",
                    href: "/legal-command",
                    ocid: "briefing.legal_button",
                  },
                ].map((a) => (
                  <a
                    key={a.label}
                    href={a.href}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-primary/30 bg-primary/10 text-primary font-sans text-xs font-medium transition-all hover:bg-primary/20"
                    data-ocid={a.ocid}
                  >
                    {a.label} <ArrowRight className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <AiBoardSection />
        <PipelineSection />

        {/* Footer */}
        <div
          className="text-center pt-4 pb-6 border-t border-primary/10 mt-6"
          data-ocid="briefing.footer.section"
        >
          <p className="font-sans text-xs text-muted-foreground">
            Generated by Aria AI · {todayFormatted}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ExecutiveBriefingPage() {
  return (
    <SecureAppGate appName="Executive Briefing">
      <ExecutiveBriefingInner />
    </SecureAppGate>
  );
}
