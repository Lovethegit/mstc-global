import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  Brain,
  Clock,
  RefreshCw,
  RotateCcw,
  TrendingUp,
  Zap,
} from "lucide-react";
// MSTC GLOBAL — AdminLearningCenterTab: RL Agents Improvement Tracking
import { useState } from "react";

interface RLAgent {
  name: string;
  insight: string;
  sessionsLearned: number;
  accuracyToday: number;
  improvementCurve: number[];
  bestAction: string;
}

const RL_AGENTS: RLAgent[] = [
  {
    name: "Click Learning AI",
    insight:
      "Identified gold CTA buttons drive 3.2x more clicks than gray variants",
    sessionsLearned: 42_180,
    accuracyToday: 94.1,
    improvementCurve: [70, 72, 74, 77, 80, 83, 85, 87, 90, 92, 94.1],
    bestAction: "Optimized CTA button placement to top-right of property cards",
  },
  {
    name: "Search Learning AI",
    insight:
      "3BHK Bopal is the #1 query; auto-completing it saves 4.8s average time",
    sessionsLearned: 38_450,
    accuracyToday: 93.7,
    improvementCurve: [68, 71, 74, 77, 80, 83, 86, 88, 91, 93, 93.7],
    bestAction:
      "Added predictive search completion for top 50 Ahmedabad localities",
  },
  {
    name: "Chat Learning AI",
    insight:
      "Learned optimal times for property enquiries: Tuesday–Thursday 6–9pm",
    sessionsLearned: 28_930,
    accuracyToday: 92.4,
    improvementCurve: [69, 72, 75, 78, 81, 84, 87, 89, 91, 92, 92.4],
    bestAction:
      "Proactive outreach on Tuesday evenings increased qualified leads by 27%",
  },
  {
    name: "Pricing Learning AI",
    insight:
      "Properties priced 3–6% below jantri rate close 40% faster in Bopal/Satellite",
    sessionsLearned: 19_720,
    accuracyToday: 91.8,
    improvementCurve: [68, 71, 73, 76, 79, 82, 84, 87, 89, 91, 91.8],
    bestAction:
      "Recommended price band adjustments for 12 Satellite properties",
  },
  {
    name: "Lead Learning AI",
    insight:
      "Leads who view EMI calculator have 68% higher conversion probability",
    sessionsLearned: 47_620,
    accuracyToday: 95.3,
    improvementCurve: [72, 75, 78, 81, 84, 86, 88, 90, 92, 94, 95.3],
    bestAction:
      "Flagged 43 calculator-engaged leads for priority follow-up today",
  },
  {
    name: "Recommendation Learning AI",
    insight:
      "Cross-selling finance tools to property enquirers increases LTV by ₹1.2L avg",
    sessionsLearned: 33_840,
    accuracyToday: 90.6,
    improvementCurve: [67, 70, 73, 76, 79, 82, 84, 87, 89, 90, 90.6],
    bestAction:
      "Added home loan banner to all 3BHK listing pages automatically",
  },
  {
    name: "Content Learning AI",
    insight:
      "Area guides with price trend charts get 4x more time-on-page than text-only",
    sessionsLearned: 22_350,
    accuracyToday: 89.4,
    improvementCurve: [66, 69, 72, 75, 78, 80, 83, 85, 87, 89, 89.4],
    bestAction:
      "Refreshed 8 area guides with new sparkline charts this morning",
  },
  {
    name: "Filter Learning AI",
    insight:
      "92% of mobile users prefer price-range filter over BHK filter as first action",
    sessionsLearned: 31_100,
    accuracyToday: 91.2,
    improvementCurve: [67, 70, 73, 76, 79, 82, 85, 87, 89, 90, 91.2],
    bestAction:
      "Reordered filter panel: price-range now appears first on mobile",
  },
  {
    name: "Sequence Learning AI",
    insight:
      "Homepage → EMI Calc → Property Search path has 74% enquiry conversion rate",
    sessionsLearned: 17_490,
    accuracyToday: 88.9,
    improvementCurve: [65, 68, 71, 74, 77, 80, 83, 85, 87, 88, 88.9],
    bestAction: "Added EMI calculator shortcut to homepage hero section",
  },
  {
    name: "Timing Learning AI",
    insight:
      "Optimal outreach time per user is now personalized to 15-minute windows",
    sessionsLearned: 24_780,
    accuracyToday: 93.1,
    improvementCurve: [69, 72, 75, 78, 81, 84, 87, 89, 91, 93, 93.1],
    bestAction:
      "Sent 89 personalized follow-up messages in today's optimal windows",
  },
];

// Multi-point SVG line chart for RL improvement curve
function ImprovementChart({
  data,
  agentName,
}: { data: number[]; agentName: string }) {
  const id = agentName.replace(/[^a-z]/gi, "").toLowerCase();
  const min = 60;
  const max = 100;
  const w = 200;
  const h = 60;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return [x, y] as [number, number];
  });
  const linePath = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");
  const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;

  return (
    <div className="w-full">
      <div className="flex justify-between text-[9px] text-zinc-600 mb-1">
        <span>30d ago</span>
        <span>Today</span>
      </div>
      <svg
        width="100%"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="h-14"
      >
        <defs>
          <linearGradient id={`rl-grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#rl-grad-${id})`} />
        <path d={linePath} fill="none" stroke="#c9a84c" strokeWidth="1.5" />
        {pts.map(([x, y], idx) => (
          <circle
            key={`pt-${x}-${y}`}
            cx={x}
            cy={y}
            r={idx === pts.length - 1 ? 3 : 1.5}
            fill="#c9a84c"
          />
        ))}
        {/* Y-axis gridlines */}
        {[70, 80, 90].map((v) => {
          const gy = h - ((v - min) / (max - min)) * h;
          return (
            <line
              key={v}
              x1={0}
              y1={gy}
              x2={w}
              y2={gy}
              stroke="#3f3f46"
              strokeWidth="0.5"
              strokeDasharray="3,3"
            />
          );
        })}
      </svg>
      <div className="flex justify-between text-[9px] text-zinc-600 mt-0.5">
        <span>~70%</span>
        <span>~80%</span>
        <span>~90%</span>
        <span>{data[data.length - 1]}%</span>
      </div>
    </div>
  );
}

function RLCard({ agent, index }: { agent: RLAgent; index: number }) {
  const [retraining, setRetraining] = useState(false);
  const [resetting, setResetting] = useState(false);

  function handleRetrain() {
    setRetraining(true);
    setTimeout(() => setRetraining(false), 3000);
  }
  function handleReset() {
    setResetting(true);
    setTimeout(() => setResetting(false), 2000);
  }

  return (
    <div
      className="bg-zinc-900/70 border border-zinc-800 hover:border-[#c9a84c]/30 rounded-xl p-4 flex flex-col gap-4 transition-all"
      data-ocid={`learning.agent.${index + 1}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-white font-semibold text-sm">{agent.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative inline-flex">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#c9a84c] opacity-40 animate-ping" />
              <span className="relative inline-flex rounded-full w-2 h-2 bg-[#c9a84c]" />
            </span>
            <span className="text-[10px] text-[#c9a84c] font-semibold">
              {agent.accuracyToday}% today
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-zinc-300 text-xs font-semibold">
            {(agent.sessionsLearned / 1000).toFixed(1)}K
          </p>
          <p className="text-zinc-600 text-[9px]">sessions</p>
        </div>
      </div>

      {/* 30-day improvement chart */}
      <ImprovementChart data={agent.improvementCurve} agentName={agent.name} />

      {/* Key insight */}
      <div className="bg-zinc-900/60 rounded-lg p-2.5 border border-zinc-800">
        <p className="text-[10px] text-zinc-500 mb-0.5">Key Insight</p>
        <p className="text-zinc-300 text-xs leading-snug">{agent.insight}</p>
      </div>

      {/* Latest action */}
      <div className="bg-[#c9a84c]/5 rounded-lg p-2.5 border border-[#c9a84c]/20">
        <p className="text-[10px] text-[#c9a84c]/70 mb-0.5">Latest Action</p>
        <p className="text-zinc-300 text-[11px] leading-snug">
          {agent.bestAction}
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="flex-1 border-zinc-700 text-zinc-300 hover:border-[#c9a84c]/50 hover:text-[#c9a84c] text-xs h-7"
          onClick={handleRetrain}
          disabled={retraining}
          data-ocid={`learning.retrain.${index + 1}`}
        >
          <RefreshCw
            className={`w-3 h-3 mr-1 ${retraining ? "animate-spin" : ""}`}
          />
          {retraining ? "Training…" : "Retrain"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="flex-1 border-zinc-700 text-zinc-300 hover:border-red-500/50 hover:text-red-400 text-xs h-7"
          onClick={handleReset}
          disabled={resetting}
          data-ocid={`learning.reset.${index + 1}`}
        >
          <RotateCcw
            className={`w-3 h-3 mr-1 ${resetting ? "animate-spin" : ""}`}
          />
          {resetting ? "Resetting…" : "Reset"}
        </Button>
      </div>
    </div>
  );
}

export default function AdminLearningCenterTab() {
  const totalSessions = RL_AGENTS.reduce((a, ag) => a + ag.sessionsLearned, 0);
  const avgImprovement =
    RL_AGENTS.reduce(
      (a, ag) =>
        a +
        (ag.improvementCurve[ag.improvementCurve.length - 1] -
          ag.improvementCurve[0]),
      0,
    ) / RL_AGENTS.length;
  const bestAgent = RL_AGENTS.reduce((best, ag) =>
    ag.accuracyToday > best.accuracyToday ? ag : best,
  );

  const topStats = [
    {
      label: "Total Learning Sessions",
      value: `${(totalSessions / 1000).toFixed(0)}K`,
      icon: Brain,
      color: "text-[#c9a84c]",
    },
    {
      label: "Avg Accuracy Improvement",
      value: `+${avgImprovement.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      label: "Best Performing Agent",
      value: bestAgent.name.replace(" AI", ""),
      icon: Award,
      color: "text-purple-400",
    },
    {
      label: "Last Learning Event",
      value: "2 min ago",
      icon: Clock,
      color: "text-blue-400",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="learning_center.page">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">AI Learning Center</h2>
        <p className="text-zinc-400 text-sm mt-1">
          Reinforcement Intelligence — 10 RL agents continuously improving from
          real platform interactions
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {topStats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4"
            data-ocid={`learning.stat.${label.toLowerCase().replace(/ /g, "_")}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-zinc-400 text-[11px] leading-tight">
                {label}
              </span>
            </div>
            <p className={`text-lg font-bold ${color} leading-tight`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Live status banner */}
      <div
        className="flex items-center gap-3 bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3"
        data-ocid="learning.status_banner"
      >
        <span className="relative inline-flex">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-50 animate-ping" />
          <span className="relative inline-flex rounded-full w-3 h-3 bg-emerald-500" />
        </span>
        <p className="text-zinc-300 text-sm">
          <span className="text-white font-semibold">10 RL agents active</span>{" "}
          — all learning from live platform interactions in real time. Platform
          has processed{" "}
          <span className="text-[#c9a84c] font-semibold">
            {(totalSessions / 1000).toFixed(0)}K+ sessions
          </span>{" "}
          to date.
        </p>
        <Badge className="ml-auto bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shrink-0">
          Live
        </Badge>
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {RL_AGENTS.map((agent, i) => (
          <RLCard key={agent.name} agent={agent} index={i} />
        ))}
      </div>
    </div>
  );
}
