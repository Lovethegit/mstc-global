import { createActor } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ChevronDown,
  ChevronRight,
  Cpu,
  Pause,
  Play,
  Settings,
  TrendingUp,
  Zap,
} from "lucide-react";
// MSTC GLOBAL — AdminAINetworkMap: 2D Clustered AI Network Visualization
import { useState } from "react";
import {
  ALL_BACKEND_AGENTS,
  BACKEND_CLUSTERS,
  BACKEND_CLUSTER_NAMES,
  BACKEND_CLUSTER_STATS,
  type BackendAgent,
} from "./AIClustersBackend";
import {
  ALL_FRONTEND_AGENTS,
  FRONTEND_CLUSTERS,
  FRONTEND_CLUSTER_NAMES,
  FRONTEND_CLUSTER_STATS,
  type FrontendAgent,
} from "./AIClustersFrontend";

type AnyAgent = FrontendAgent | BackendAgent;

// ── Status helpers ─────────────────────────────────────────────────────────────
function statusDotColor(s: AnyAgent["status"]) {
  if (s === "active") return "bg-emerald-500";
  if (s === "processing") return "bg-[#c9a84c]";
  if (s === "idle") return "bg-blue-400";
  return "bg-red-500";
}

// ── Health bar ───────────────────────────────────────────────────────────────────
function HealthBar({ health }: { health: number }) {
  const color =
    health >= 80
      ? "bg-emerald-500"
      : health >= 50
        ? "bg-[#c9a84c]"
        : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
        <div
          className={`${color} h-full rounded-full transition-all`}
          style={{ width: `${health}%` }}
        />
      </div>
      <span className="text-[10px] text-zinc-400 w-8 text-right">
        {health}%
      </span>
    </div>
  );
}

// ── Agent mini-card ────────────────────────────────────────────────────────────
function AgentMiniCard({ agent }: { agent: AnyAgent }) {
  const [hover, setHover] = useState(false);
  const pulsing = agent.status === "active" || agent.status === "processing";

  return (
    <div
      className="relative bg-zinc-900/80 border border-zinc-800 hover:border-[#c9a84c]/40 rounded-lg p-2 cursor-default transition-all"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-ocid={`agent.card.${agent.id}`}
    >
      <div className="flex items-center gap-2">
        <span className="relative inline-flex shrink-0">
          {pulsing && (
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${statusDotColor(agent.status)} opacity-50 animate-ping`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full w-2 h-2 ${statusDotColor(agent.status)}`}
          />
        </span>
        <p className="text-white text-[10px] font-medium leading-tight truncate flex-1">
          {agent.name}
        </p>
        <span className="text-[9px] text-zinc-500 shrink-0">
          {agent.tasksToday}
        </span>
      </div>

      {/* Tooltip on hover */}
      {hover && (
        <div className="absolute z-50 bottom-full left-0 mb-2 bg-zinc-800 border border-[#c9a84c]/30 rounded-xl p-3 min-w-[220px] max-w-[260px] shadow-2xl">
          <p className="text-white text-xs font-semibold mb-1">{agent.name}</p>
          <p className="text-zinc-400 text-[10px] mb-2">{agent.specialty}</p>
          <p className="text-zinc-500 text-[10px] mb-2 line-clamp-2">
            {agent.description}
          </p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-zinc-500">Accuracy</span>
            <span className="text-[#c9a84c] text-[10px] font-semibold">
              {agent.accuracy}%
            </span>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              className="flex items-center gap-1 bg-zinc-700 hover:bg-zinc-600 rounded px-2 py-1 text-[9px] text-white"
              data-ocid={`agent.pause.${agent.id}`}
            >
              <Pause className="w-2.5 h-2.5" /> Pause
            </button>
            <button
              type="button"
              className="flex items-center gap-1 bg-emerald-700/40 hover:bg-emerald-700/60 rounded px-2 py-1 text-[9px] text-emerald-300"
              data-ocid={`agent.resume.${agent.id}`}
            >
              <Play className="w-2.5 h-2.5" /> Resume
            </button>
            <button
              type="button"
              className="flex items-center gap-1 bg-zinc-700 hover:bg-zinc-600 rounded px-2 py-1 text-[9px] text-white"
              data-ocid={`agent.configure.${agent.id}`}
            >
              <Settings className="w-2.5 h-2.5" /> Config
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Cluster card ─────────────────────────────────────────────────────────────────
interface ClusterCardProps {
  code: string;
  name: string;
  agents: AnyAgent[];
  health: number;
  type: "Frontend" | "Backend";
}

function ClusterCard({ code, name, agents, health, type }: ClusterCardProps) {
  const [expanded, setExpanded] = useState(false);
  const active = agents.filter(
    (a) => a.status === "active" || a.status === "processing",
  ).length;
  const typeColor =
    type === "Frontend"
      ? "text-[#c9a84c] border-[#c9a84c]/30"
      : "text-blue-400 border-blue-400/30";

  return (
    <div
      className="bg-zinc-900/70 border border-zinc-800 hover:border-[#c9a84c]/30 rounded-xl overflow-hidden transition-all"
      data-ocid={`cluster.card.${code.toLowerCase()}`}
    >
      {/* Cluster header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setExpanded(!expanded);
        }}
        role="button"
        tabIndex={0}
        data-ocid={`cluster.toggle.${code.toLowerCase()}`}
      >
        <div
          className={`font-mono font-bold text-sm border px-2 py-0.5 rounded ${typeColor} bg-zinc-900`}
        >
          {code}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge className="text-[9px] bg-zinc-800 text-zinc-400 border-zinc-700">
              {type}
            </Badge>
            <span className="text-[10px] text-emerald-400">
              {active} active
            </span>
            <span className="text-[10px] text-zinc-500">
              / {agents.length} agents
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-20">
            <HealthBar health={health} />
          </div>
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          )}
        </div>
      </div>

      {/* Expanded agent grid */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-zinc-800">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 pt-3">
            {agents.map((agent) => (
              <AgentMiniCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Summary table ───────────────────────────────────────────────────────────────
function SummaryTable() {
  type Row = {
    code: string;
    name: string;
    type: string;
    count: number;
    health: number;
    active: number;
    idle: number;
    processing: number;
    error: number;
  };
  const rows: Row[] = [
    ...FRONTEND_CLUSTERS.map((c) => {
      const agents = ALL_FRONTEND_AGENTS.filter(
        (a) => a.clusterCode === c.code,
      );
      const stats = FRONTEND_CLUSTER_STATS[c.code];
      return {
        code: c.code,
        name: c.name,
        type: "Frontend",
        count: agents.length,
        health: stats?.health ?? 0,
        active: agents.filter((a) => a.status === "active").length,
        idle: agents.filter((a) => a.status === "idle").length,
        processing: agents.filter((a) => a.status === "processing").length,
        error: agents.filter((a) => a.status === "error").length,
      };
    }),
    ...BACKEND_CLUSTERS.map((c) => {
      const agents = ALL_BACKEND_AGENTS.filter((a) => a.clusterCode === c.code);
      const stats = BACKEND_CLUSTER_STATS[c.code];
      return {
        code: c.code,
        name: c.name,
        type: "Backend",
        count: agents.length,
        health: stats?.health ?? 0,
        active: agents.filter((a) => a.status === "active").length,
        idle: agents.filter((a) => a.status === "idle").length,
        processing: agents.filter((a) => a.status === "processing").length,
        error: agents.filter((a) => a.status === "error").length,
      };
    }),
  ];

  return (
    <div
      className="overflow-x-auto rounded-xl border border-zinc-800"
      data-ocid="network.summary_table"
    >
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-zinc-900 border-b border-zinc-800">
            {[
              "Code",
              "Cluster Name",
              "Type",
              "Agents",
              "Health",
              "Active",
              "Idle",
              "Processing",
              "Error",
            ].map((h) => (
              <th
                key={h}
                className="px-3 py-2 text-left text-zinc-400 font-medium whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.code}
              className={`border-b border-zinc-800/50 ${i % 2 === 0 ? "bg-zinc-900/30" : ""}`}
            >
              <td className="px-3 py-2">
                <span className="font-mono text-[#c9a84c] font-bold">
                  {r.code}
                </span>
              </td>
              <td className="px-3 py-2 text-white max-w-[200px] truncate">
                {r.name}
              </td>
              <td className="px-3 py-2">
                <Badge
                  className={`text-[9px] ${r.type === "Frontend" ? "bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30" : "bg-blue-500/10 text-blue-400 border-blue-500/30"}`}
                >
                  {r.type}
                </Badge>
              </td>
              <td className="px-3 py-2 text-white text-right">{r.count}</td>
              <td className="px-3 py-2 w-24">
                <HealthBar health={r.health} />
              </td>
              <td className="px-3 py-2 text-emerald-400 text-right">
                {r.active}
              </td>
              <td className="px-3 py-2 text-blue-400 text-right">{r.idle}</td>
              <td className="px-3 py-2 text-[#c9a84c] text-right">
                {r.processing}
              </td>
              <td className="px-3 py-2 text-red-400 text-right">{r.error}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────────
export default function AdminAINetworkMap() {
  const { actor, isFetching } = useActor(createActor);

  const { data: realTimeStats } = useQuery({
    queryKey: ["realTimeStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRealTimeStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });

  const statCards = [
    {
      label: "Total Agents",
      value: realTimeStats
        ? Number(realTimeStats.totalAgents).toLocaleString()
        : (
            ALL_FRONTEND_AGENTS.length + ALL_BACKEND_AGENTS.length
          ).toLocaleString(),
      icon: Cpu,
      color: "text-[#c9a84c]",
    },
    {
      label: "Active Now",
      value: realTimeStats
        ? Number(realTimeStats.activeNow).toLocaleString()
        : "—",
      icon: Activity,
      color: "text-emerald-400",
    },
    {
      label: "Tasks Today",
      value: realTimeStats
        ? Number(realTimeStats.tasksToday).toLocaleString()
        : "—",
      icon: Zap,
      color: "text-blue-400",
    },
    {
      label: "Avg Accuracy",
      value: realTimeStats ? `${realTimeStats.avgAccuracy.toFixed(1)}%` : "—",
      icon: TrendingUp,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="space-y-8" data-ocid="network_map.page">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          MSTC AI Network — 1,500+ Agents
        </h2>
        <p className="text-zinc-400 text-sm mt-1">
          Real-time visualization of all AI clusters across Frontend and Backend
          layers
        </p>
      </div>

      {/* Live stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4"
            data-ocid={`network.stat.${label.toLowerCase().replace(/ /g, "_")}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-zinc-400 text-xs">{label}</span>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Frontend clusters */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-[#c9a84c] rounded-full" />
          <h3 className="text-white font-semibold">Frontend AI Clusters</h3>
          <Badge className="bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30">
            {FRONTEND_CLUSTERS.length} clusters — {ALL_FRONTEND_AGENTS.length}{" "}
            agents
          </Badge>
        </div>
        <div className="space-y-2">
          {FRONTEND_CLUSTERS.map((c) => {
            const agents = ALL_FRONTEND_AGENTS.filter(
              (a) => a.clusterCode === c.code,
            );
            const stats = FRONTEND_CLUSTER_STATS[c.code];
            return (
              <ClusterCard
                key={c.code}
                code={c.code}
                name={c.name}
                agents={agents}
                health={stats?.health ?? 0}
                type="Frontend"
              />
            );
          })}
        </div>
      </div>

      {/* Backend clusters */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-blue-400 rounded-full" />
          <h3 className="text-white font-semibold">Backend AI Clusters</h3>
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
            {BACKEND_CLUSTERS.length} clusters — {ALL_BACKEND_AGENTS.length}{" "}
            agents
          </Badge>
        </div>
        <div className="space-y-2">
          {BACKEND_CLUSTERS.map((c) => {
            const agents = ALL_BACKEND_AGENTS.filter(
              (a) => a.clusterCode === c.code,
            );
            const stats = BACKEND_CLUSTER_STATS[c.code];
            return (
              <ClusterCard
                key={c.code}
                code={c.code}
                name={c.name}
                agents={agents}
                health={stats?.health ?? 0}
                type="Backend"
              />
            );
          })}
        </div>
      </div>

      {/* Summary table */}
      <div>
        <h3 className="text-white font-semibold mb-3">All Clusters Summary</h3>
        <SummaryTable />
      </div>
    </div>
  );
}
