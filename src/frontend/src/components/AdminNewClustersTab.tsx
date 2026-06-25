import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clusterData26to35 } from "./AIAgentClusters26to35";
import type {
  AgentDefinition,
  ClusterDefinition,
} from "./AIAgentClusters26to35";
import { clusterData36to50 } from "./AIAgentClusters36to50";

// ─── Constants ─────────────────────────────────────────────────────────────────
const ALL_CATEGORIES = [
  "All",
  "Property",
  "Finance",
  "Legal",
  "Events",
  "NGO",
  "Sports",
  "Analytics",
  "Platform",
  "Personalization",
  "Communication",
  "BI",
  "Dashboard",
  "Collaboration",
  "FutureTech",
  "HR",
  "Operations",
  "ClientIntel",
  "MarketResearch",
  "FinancialServices",
  "TechTools",
  "VIP",
  "Marketing",
  "Automation",
  "Knowledge",
  "NextGen",
] as const;

type Category = (typeof ALL_CATEGORIES)[number];

// ─── Status helpers ─────────────────────────────────────────────────────────────
const STATUS_COLOR: Record<string, string> = {
  active: "bg-emerald-400 animate-pulse",
  idle: "bg-zinc-500",
  processing: "bg-amber-400 animate-pulse",
  error: "bg-rose-500",
};

const STATUS_TEXT_COLOR: Record<string, string> = {
  active: "text-emerald-400",
  idle: "text-zinc-400",
  processing: "text-amber-400",
  error: "text-rose-400",
};

// ─── Animated counter hook ───────────────────────────────────────────────────────
function useAnimatedCount(target: number, duration = 2000) {
  const [value, setValue] = useState(Math.max(0, target - 10));
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const from = Math.max(0, target - 10);
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round(from + (target - from) * p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

// ─── Toast notification ───────────────────────────────────────────────────────────
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#c9a84c] text-[#06090f] text-sm font-bold shadow-lg"
      role="alert"
    >
      {message}
    </div>
  );
}

// ─── Agent Card ────────────────────────────────────────────────────────────────
function AgentCard({
  agent,
  onSelect,
  onToast,
}: {
  agent: AgentDefinition;
  onSelect: (a: AgentDefinition) => void;
  onToast: (msg: string) => void;
}) {
  const animatedTasks = useAnimatedCount(agent.tasksToday);
  const [paused, setPaused] = useState(false);
  const [showOverride, setShowOverride] = useState(false);
  const [overrideText, setOverrideText] = useState("");
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col gap-2.5 p-3 rounded-xl border border-zinc-800 bg-[#0a0d14] hover:border-[#c9a84c]/30 transition-all duration-200"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLOR[agent.status] ?? "bg-zinc-600"}`}
        />
        <button
          type="button"
          onClick={() => onSelect(agent)}
          data-ocid="ai_clusters.agent_button"
          className="text-sm font-bold text-zinc-100 text-left hover:text-[#c9a84c] transition-colors truncate flex-1"
        >
          {agent.name}
        </button>
        <span
          className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
            agent.dataSource === "real"
              ? "bg-emerald-900/40 text-emerald-400 border border-emerald-500/20"
              : "bg-zinc-800 text-zinc-500 border border-zinc-700/40"
          }`}
        >
          {agent.dataSource === "real" ? "Live" : "Sim"}
        </span>
      </div>

      {/* Performance bar */}
      <div>
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] text-zinc-600">Performance</span>
          <span className="text-[10px] text-[#c9a84c]">
            {agent.performanceScore}%
          </span>
        </div>
        <div className="h-1 rounded-full bg-zinc-800">
          <div
            className="h-1 rounded-full bg-[#c9a84c] transition-all duration-700"
            style={{ width: `${agent.performanceScore}%` }}
          />
        </div>
      </div>

      {/* Tasks + current task */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">
          <span className="text-[#c9a84c] font-semibold tabular-nums">
            {animatedTasks}
          </span>{" "}
          <span className="text-zinc-600">tasks today</span>
        </span>
        <span
          className={`text-[10px] font-semibold uppercase ${STATUS_TEXT_COLOR[agent.status] ?? "text-zinc-500"}`}
        >
          {agent.status}
        </span>
      </div>

      <p className="text-[11px] text-zinc-500 italic truncate">
        {agent.currentTask}
      </p>
      <p className="text-[10px] text-zinc-600 truncate">
        ↳ {agent.lastActions[0] ?? "—"}
      </p>

      {/* Hover detail */}
      {hovered && agent.capabilities.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {agent.capabilities.slice(0, 3).map((cap) => (
            <span
              key={cap}
              className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500"
            >
              {cap}
            </span>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-1.5 mt-1">
        <button
          type="button"
          onClick={() => {
            setPaused((p) => !p);
            onToast(paused ? "Agent resumed" : "Agent paused");
          }}
          data-ocid="ai_clusters.toggle"
          className={`flex-1 py-1 rounded-lg text-[10px] font-semibold border transition-all duration-150 ${
            paused
              ? "border-emerald-500/40 text-emerald-400 bg-emerald-900/10 hover:bg-emerald-900/20"
              : "border-amber-500/40 text-amber-400 bg-amber-900/10 hover:bg-amber-900/20"
          }`}
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          onClick={() => onToast("Configuration panel opened")}
          data-ocid="ai_clusters.secondary_button"
          className="flex-1 py-1 rounded-lg text-[10px] font-semibold border border-zinc-700 text-zinc-400 hover:border-[#c9a84c]/30 hover:text-[#c9a84c] transition-all duration-150"
        >
          Configure
        </button>
        <button
          type="button"
          onClick={() => setShowOverride((s) => !s)}
          data-ocid="ai_clusters.secondary_button"
          className="flex-1 py-1 rounded-lg text-[10px] font-semibold border border-[#c9a84c]/20 text-[#c9a84c] bg-[#c9a84c]/5 hover:bg-[#c9a84c]/10 transition-all duration-150"
        >
          Override
        </button>
      </div>

      {/* Override input */}
      {showOverride && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (overrideText.trim()) {
              onToast("Instruction sent to agent");
              setOverrideText("");
              setShowOverride(false);
            }
          }}
          className="flex gap-1.5 mt-1"
        >
          <input
            type="text"
            value={overrideText}
            onChange={(e) => setOverrideText(e.target.value)}
            placeholder="Type instruction…"
            data-ocid="ai_clusters.input"
            className="flex-1 bg-[#06090f] border border-[#c9a84c]/30 rounded-lg px-2 py-1 text-[11px] text-zinc-200 placeholder:text-zinc-700 outline-none focus:border-[#c9a84c] transition-colors"
          />
          <button
            type="submit"
            data-ocid="ai_clusters.submit_button"
            className="px-2 py-1 rounded-lg bg-[#c9a84c] text-[#06090f] text-[10px] font-bold hover:bg-[#e0bc62] transition-colors"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Agent Detail Drawer ─────────────────────────────────────────────────────
function AgentDrawer({
  agent,
  onClose,
  onToast,
}: {
  agent: AgentDefinition;
  onClose: () => void;
  onToast: (msg: string) => void;
}) {
  const [overrideText, setOverrideText] = useState("");
  const [paused, setPaused] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Circular gauge using SVG
  const r = 28;
  const circ = 2 * Math.PI * r;
  const fill = circ * (1 - agent.performanceScore / 100);

  const todayCount = useAnimatedCount(agent.tasksToday);
  const weeklyCount = useAnimatedCount(agent.tasksThisWeek);
  const allTimeCount = useAnimatedCount(agent.tasksAllTime, 1500);

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        role="presentation"
      />
      {/* Panel */}
      <div
        ref={drawerRef}
        className="relative z-10 w-full max-w-sm h-full bg-[#0a0d14] border-l border-[#c9a84c]/20 flex flex-col overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${STATUS_COLOR[agent.status] ?? "bg-zinc-500"}`}
            />
            <h2 className="text-base font-bold text-[#c9a84c] font-display leading-tight">
              {agent.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-ocid="ai_clusters.close_button"
            aria-label="Close drawer"
            className="text-zinc-400 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-5 p-5">
          {/* Meta */}
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-800 text-zinc-400">
              {agent.clusterName}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-800 text-zinc-400">
              Autonomy {agent.autonomyLevel}/10
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                agent.dataSource === "real"
                  ? "bg-emerald-900/30 text-emerald-400"
                  : "bg-zinc-800 text-zinc-500"
              }`}
            >
              {agent.dataSource === "real" ? "Live data" : "Simulated"}
            </span>
          </div>

          {/* Gauge + stats */}
          <div className="flex items-center gap-4">
            <svg width="72" height="72" className="shrink-0">
              <circle
                cx="36"
                cy="36"
                r={r}
                fill="none"
                stroke="#1f2937"
                strokeWidth="6"
              />
              <circle
                cx="36"
                cy="36"
                r={r}
                fill="none"
                stroke="#c9a84c"
                strokeWidth="6"
                strokeDasharray={circ}
                strokeDashoffset={fill}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
              />
              <text
                x="36"
                y="40"
                textAnchor="middle"
                className="text-xs"
                fill="#c9a84c"
                fontSize="13"
                fontWeight="bold"
              >
                {agent.performanceScore}%
              </text>
            </svg>
            <div className="grid grid-cols-3 gap-2 flex-1">
              {[
                { label: "Today", value: todayCount },
                { label: "Week", value: weeklyCount },
                { label: "All Time", value: allTimeCount },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-0.5 p-2 rounded-lg bg-zinc-900/80 border border-zinc-800"
                >
                  <span className="text-base font-bold text-[#c9a84c] tabular-nums">
                    {s.value.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-zinc-600 uppercase tracking-wider">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Current task */}
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-3">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
              Current Task
            </p>
            <p className="text-sm text-zinc-200">{agent.currentTask}</p>
          </div>

          {/* Last actions */}
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
              Last 5 Actions
            </p>
            <div className="flex flex-col gap-1.5">
              {agent.lastActions.slice(0, 5).map((action) => (
                <div key={action} className="flex items-start gap-2 text-xs">
                  <span className="text-zinc-600 shrink-0 tabular-nums mt-px">
                    {agent.lastActions.indexOf(action) + 1}.
                  </span>
                  <span className="text-zinc-300">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
              Capabilities
            </p>
            <div className="flex flex-wrap gap-1.5">
              {agent.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="px-2 py-0.5 rounded-full text-[10px] bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c]"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setPaused((p) => !p);
                onToast(paused ? "Agent resumed" : "Agent paused");
              }}
              data-ocid="ai_clusters.toggle"
              className={`py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                paused
                  ? "border-emerald-500/40 text-emerald-400 bg-emerald-900/10"
                  : "border-amber-500/40 text-amber-400 bg-amber-900/10"
              }`}
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              type="button"
              onClick={() => onToast("Agent retrain queued")}
              data-ocid="ai_clusters.secondary_button"
              className="py-2 rounded-xl text-xs font-semibold border border-zinc-700 text-zinc-400 hover:border-[#c9a84c]/30 hover:text-[#c9a84c] transition-all"
            >
              Retrain
            </button>
          </div>

          {/* Manual override */}
          <div className="rounded-xl border border-[#c9a84c]/20 bg-[#06090f] p-3">
            <p className="text-[10px] text-[#c9a84c] uppercase tracking-widest mb-2">
              Manual Override
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (overrideText.trim()) {
                  onToast("Instruction sent to agent");
                  setOverrideText("");
                }
              }}
            >
              <textarea
                value={overrideText}
                onChange={(e) => setOverrideText(e.target.value)}
                placeholder="Type your instruction for this agent…"
                data-ocid="ai_clusters.textarea"
                rows={3}
                className="w-full bg-transparent border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-700 outline-none focus:border-[#c9a84c] resize-none transition-colors"
              />
              <button
                type="submit"
                data-ocid="ai_clusters.submit_button"
                className="mt-2 w-full py-2 rounded-xl bg-[#c9a84c] text-[#06090f] text-xs font-bold hover:bg-[#e0bc62] transition-colors"
              >
                Send Instruction
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cluster Panel ─────────────────────────────────────────────────────────────
function ClusterPanel({
  cluster,
  filteredAgents,
  onSelectAgent,
  onToast,
}: {
  cluster: ClusterDefinition;
  filteredAgents: AgentDefinition[];
  onSelectAgent: (a: AgentDefinition) => void;
  onToast: (msg: string) => void;
}) {
  if (filteredAgents.length === 0) return null;

  const activeCount = filteredAgents.filter(
    (a) => a.status === "active",
  ).length;

  return (
    <div className="mb-6">
      {/* Cluster header */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl mb-3 border border-zinc-800"
        style={{ borderLeftColor: cluster.color, borderLeftWidth: "4px" }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-zinc-100 font-display">
              Cluster {cluster.clusterId}: {cluster.clusterName}
            </h3>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
              style={{
                borderColor: `${cluster.color}40`,
                color: cluster.color,
              }}
            >
              {cluster.category}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
            {cluster.clusterDescription}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-bold text-[#c9a84c]">
            {filteredAgents.length} agents
          </p>
          <p className="text-[10px] text-zinc-600">{activeCount} active</p>
        </div>
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {filteredAgents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onSelect={onSelectAgent}
            onToast={onToast}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminNewClustersTab() {
  const allClusters: ClusterDefinition[] = useMemo(
    () => [...clusterData26to35, ...clusterData36to50],
    [],
  );

  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition | null>(
    null,
  );
  const [toast, setToast] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((msg: string) => setToast(msg), []);
  const clearToast = useCallback(() => setToast(""), []);

  // Filtered clusters/agents
  const filteredClusters = useMemo(() => {
    return allClusters
      .map((cluster) => {
        const filteredAgents = cluster.agents.filter((agent) => {
          const matchesCategory =
            selectedCategory === "All" || cluster.category === selectedCategory;
          const matchesSearch =
            searchQuery === "" ||
            agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            agent.currentTask.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
        });
        return { cluster, filteredAgents };
      })
      .filter(({ filteredAgents }) => filteredAgents.length > 0);
  }, [allClusters, selectedCategory, searchQuery]);

  const totalFiltered = useMemo(
    () =>
      filteredClusters.reduce(
        (sum, { filteredAgents }) => sum + filteredAgents.length,
        0,
      ),
    [filteredClusters],
  );

  const totalAgents = useMemo(
    () => allClusters.reduce((sum, c) => sum + c.agents.length, 0),
    [allClusters],
  );

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-bold font-display text-[#c9a84c]">
            AI Agent Clusters 26–50
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Deep intelligence agents for every MSTC domain
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Showing</span>
          <span className="font-bold text-[#c9a84c]">{totalFiltered}</span>
          <span className="text-zinc-500">of</span>
          <span className="font-bold text-zinc-300">{totalAgents}</span>
          <span className="text-zinc-500">agents</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-xl border border-zinc-800 bg-[#0a0d14] p-3">
        {/* Search */}
        <div className="mb-3">
          <input
            ref={searchRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agents by name, task, or capability…"
            data-ocid="ai_clusters.search_input"
            className="w-full bg-[#06090f] border border-zinc-800 focus:border-[#c9a84c] outline-none rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 transition-colors"
          />
        </div>
        {/* Category filters */}
        <div className="flex flex-wrap gap-1.5">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              data-ocid="ai_clusters.tab"
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all duration-150 ${
                selectedCategory === cat
                  ? "bg-[#c9a84c] border-[#c9a84c] text-[#06090f]"
                  : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cluster panels */}
      <div>
        {filteredClusters.length === 0 ? (
          <div
            data-ocid="ai_clusters.empty_state"
            className="flex flex-col items-center gap-3 py-16 text-center"
          >
            <span className="text-4xl">&#x1F916;</span>
            <p className="text-zinc-400 font-semibold">
              No agents match your search
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              data-ocid="ai_clusters.secondary_button"
              className="px-4 py-2 rounded-xl border border-[#c9a84c]/30 text-[#c9a84c] text-sm hover:bg-[#c9a84c]/5 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredClusters.map(({ cluster, filteredAgents }) => (
            <ClusterPanel
              key={cluster.clusterId}
              cluster={cluster}
              filteredAgents={filteredAgents}
              onSelectAgent={setSelectedAgent}
              onToast={showToast}
            />
          ))
        )}
      </div>

      {/* Agent Drawer */}
      {selectedAgent && (
        <AgentDrawer
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onToast={showToast}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onDone={clearToast} />}
    </div>
  );
}
