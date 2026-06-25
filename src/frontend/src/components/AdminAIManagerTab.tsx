import {
  Activity,
  AlertTriangle,
  Bot,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Info,
  KeyRound,
  MessageSquare,
  Network,
  RefreshCw,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import React from "react";
import {
  type AIAgentDef,
  AI_AGENTS,
  type AgentTier,
  GM_DIGEST_SECTIONS,
  SAMPLE_COORDINATION_EVENTS,
  TIER_META,
  TIER_ORDER,
} from "./AIManagerData";

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  Claude: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  Gemini: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  Multi: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  Platform: "text-purple-400 bg-purple-400/10 border-purple-400/30",
};

// Types for this module
type ActiveSection = "hierarchy" | "timeline" | "digest" | "api-config";
type ProviderStatus = "untested" | "testing" | "ok" | "error";
type AgentConfig = {
  language: "English" | "Gujarati" | "Hindi";
  personality: "Analytical" | "Conversational" | "Formal";
  focus: string;
};

function isGMRestingNow(): boolean {
  const hour = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  ).getHours();
  return hour >= 23 || hour < 6;
}

function resolveStatus(agentTier: string, offline: boolean): string {
  if (offline) return "offline";
  if (agentTier === "gm" && isGMRestingNow()) return "resting";
  return "active";
}

function StatusDot({ status }: { status: string }) {
  const cls =
    status === "active"
      ? "bg-green-400 animate-pulse"
      : status === "resting"
        ? "bg-yellow-500"
        : "bg-red-500";
  return <span className={`w-2 h-2 rounded-full shrink-0 ${cls}`} />;
}

export default function AdminAIManagerTab() {
  const [agentOffIds, setAgentOffIds] = React.useState<Set<string>>(() => {
    try {
      const s = localStorage.getItem("mstc-agent-off-ids");
      return s ? new Set(JSON.parse(s) as string[]) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const [agentConfigs, setAgentConfigs] = React.useState<
    Record<string, AgentConfig>
  >({});

  const [expandedTiers, setExpandedTiers] = React.useState<Set<AgentTier>>(
    new Set(["command", "ultra", "gm"]),
  );

  const [tierShowAll, setTierShowAll] = React.useState<Set<AgentTier>>(
    new Set(),
  );

  const [selectedAgentId, setSelectedAgentId] = React.useState<string | null>(
    null,
  );

  const [activeSection, setActiveSection] =
    React.useState<ActiveSection>("hierarchy");

  const [digestKey, setDigestKey] = React.useState(0);
  const digestTime = React.useRef(new Date().toLocaleString("en-IN"));

  const [openaiKey, setOpenaiKey] = React.useState(
    () => localStorage.getItem("openai-api-key") ?? "",
  );
  const [geminiKey, setGeminiKey] = React.useState(
    () => localStorage.getItem("gemini-api-key") ?? "",
  );
  const [claudeKey, setClaudeKey] = React.useState(
    () => localStorage.getItem("claude-api-key") ?? "",
  );
  const [activeProvider, setActiveProvider] = React.useState<
    "OpenAI" | "Gemini" | "Claude" | "Fallback"
  >(
    () =>
      (localStorage.getItem("mstc-active-provider") as
        | "OpenAI"
        | "Gemini"
        | "Claude"
        | "Fallback") ?? "Fallback",
  );
  const [providerStatus, setProviderStatus] = React.useState<
    Record<string, ProviderStatus>
  >({ OpenAI: "untested", Gemini: "untested", Claude: "untested" });
  const [fallbackOrder, setFallbackOrder] = React.useState([
    "OpenAI",
    "Gemini",
    "Claude",
    "Fallback",
  ]);

  const gmResting = isGMRestingNow();
  const totalAgents = AI_AGENTS.length;

  const activeCount = React.useMemo(
    () =>
      AI_AGENTS.filter(
        (a) => resolveStatus(a.tier, agentOffIds.has(a.id)) === "active",
      ).length,
    [agentOffIds],
  );
  const restingCount = React.useMemo(
    () =>
      AI_AGENTS.filter(
        (a) => resolveStatus(a.tier, agentOffIds.has(a.id)) === "resting",
      ).length,
    [agentOffIds],
  );
  const offlineCount = agentOffIds.size;
  const hasOpenAI = openaiKey.length > 0;
  const hasGemini = geminiKey.length > 0;

  const agentsByTier = React.useMemo(
    () =>
      TIER_ORDER.reduce(
        (acc, tier) => {
          acc[tier] = AI_AGENTS.filter((a) => a.tier === tier);
          return acc;
        },
        {} as Record<AgentTier, AIAgentDef[]>,
      ),
    [],
  );

  function toggleAgent(id: string) {
    setAgentOffIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("mstc-agent-off-ids", JSON.stringify([...next]));
      return next;
    });
  }

  function toggleTier(tier: AgentTier) {
    setExpandedTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) next.delete(tier);
      else next.add(tier);
      return next;
    });
  }

  function saveApiConfig() {
    localStorage.setItem("openai-api-key", openaiKey);
    localStorage.setItem("gemini-api-key", geminiKey);
    localStorage.setItem("claude-api-key", claudeKey);
    localStorage.setItem("mstc-active-provider", activeProvider);
  }

  function testProvider(provider: string) {
    setProviderStatus((prev) => ({ ...prev, [provider]: "testing" }));
    setTimeout(() => {
      const key =
        provider === "OpenAI"
          ? openaiKey
          : provider === "Gemini"
            ? geminiKey
            : claudeKey;
      setProviderStatus((prev) => ({
        ...prev,
        [provider]: key.length > 0 ? "ok" : "error",
      }));
    }, 1200);
  }

  function moveFallbackOrder(index: number, dir: -1 | 1) {
    setFallbackOrder((prev) => {
      const next = [...prev];
      const swap = index + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[index], next[swap]] = [next[swap], next[index]];
      return next;
    });
  }

  function refreshDigest() {
    digestTime.current = new Date().toLocaleString("en-IN");
    setDigestKey((k) => k + 1);
  }

  const selectedAgent = selectedAgentId
    ? (AI_AGENTS.find((a) => a.id === selectedAgentId) ?? null)
    : null;

  const selectedAgentStatus = selectedAgent
    ? resolveStatus(selectedAgent.tier, agentOffIds.has(selectedAgent.id))
    : "active";

  const selectedConfig: AgentConfig = selectedAgentId
    ? (agentConfigs[selectedAgentId] ?? {
        language: "English",
        personality: "Analytical",
        focus: "",
      })
    : { language: "English", personality: "Analytical", focus: "" };

  const SECTIONS: {
    id: ActiveSection;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: "hierarchy", label: "Hierarchy", icon: <Network size={13} /> },
    { id: "timeline", label: "Timeline", icon: <Activity size={13} /> },
    { id: "digest", label: "AI Digest", icon: <Sparkles size={13} /> },
    { id: "api-config", label: "API Config", icon: <KeyRound size={13} /> },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-yellow-400 font-playfair flex items-center gap-2">
            <Brain size={22} className="text-yellow-500" />
            AI Operations Center
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Central command for all {totalAgents} AI agents — hierarchical,
            coordinated, always-on.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-700/40 bg-yellow-700/10">
          <Activity size={13} className="text-yellow-400" />
          <span className="text-xs text-yellow-300 font-medium">
            Live Monitoring
          </span>
        </div>
      </div>

      {/* Command Center Stats */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        data-ocid="ai-manager.command-center"
      >
        {[
          {
            label: "Total Agents",
            value: totalAgents,
            sub: "in system",
            icon: <Bot size={14} />,
            color: "text-yellow-400",
          },
          {
            label: "Active",
            value: activeCount,
            sub: "running now",
            icon: <CheckCircle2 size={14} />,
            color: "text-green-400",
          },
          {
            label: "Resting",
            value: restingCount,
            sub: gmResting ? "GMs resting" : "idle agents",
            icon: <Clock size={14} />,
            color: "text-yellow-500",
          },
          {
            label: "Offline",
            value: offlineCount,
            sub: "disabled",
            icon: <AlertTriangle size={14} />,
            color: "text-red-400",
          },
          {
            label: "OpenAI",
            value: hasOpenAI ? "Set" : "Not Set",
            sub: "provider key",
            icon: <Zap size={14} />,
            color: hasOpenAI ? "text-emerald-400" : "text-red-400",
          },
          {
            label: "Gemini",
            value: hasGemini ? "Set" : "Not Set",
            sub: "provider key",
            icon: <Zap size={14} />,
            color: hasGemini ? "text-emerald-400" : "text-red-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-yellow-800/30 bg-white/[0.03] p-3"
          >
            <div className={`flex items-center gap-1 mb-1 ${stat.color}`}>
              {stat.icon}
              <span className="text-[10px] font-medium">{stat.label}</span>
            </div>
            <div className="text-lg font-bold text-white">{stat.value}</div>
            <div className="text-[10px] text-gray-500">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-1 border-b border-yellow-900/20 overflow-x-auto pb-0.5">
        {SECTIONS.map((s) => (
          <button
            type="button"
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg whitespace-nowrap transition-colors ${
              activeSection === s.id
                ? "text-yellow-400 border-b-2 border-yellow-500 bg-yellow-900/10"
                : "text-gray-500 hover:text-gray-300"
            }`}
            data-ocid={`ai-manager.section.${s.id}.tab`}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>

      {/* SECTION: HIERARCHY */}
      {activeSection === "hierarchy" && (
        <div
          className="flex gap-4"
          style={{ minHeight: 500 }}
          data-ocid="ai-manager.hierarchy"
        >
          {/* Left: Tier panels */}
          <div
            className={`flex-1 min-w-0 space-y-2 overflow-y-auto max-h-[700px] ${
              selectedAgent ? "hidden lg:block" : ""
            }`}
          >
            {TIER_ORDER.map((tier) => {
              const tierAgents = agentsByTier[tier];
              const meta = TIER_META[tier];
              const expanded = expandedTiers.has(tier);
              const showAll = tierShowAll.has(tier);
              const PAGE = 20;
              const displayed = showAll
                ? tierAgents
                : tierAgents.slice(0, PAGE);
              return (
                <div
                  key={tier}
                  className={`rounded-xl border overflow-hidden ${meta.borderColor}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleTier(tier)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left ${meta.bgColor}`}
                    data-ocid={`ai-manager.tier.${tier}.toggle`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`text-sm font-semibold ${meta.color}`}>
                        {meta.label}
                      </span>
                      <span className="text-[10px] text-gray-500 bg-black/20 px-1.5 py-0.5 rounded-full">
                        {tierAgents.length}
                      </span>
                      {tier === "gm" && gmResting && (
                        <span className="text-[9px] text-yellow-600 bg-yellow-900/30 px-1.5 py-0.5 rounded-full">
                          Resting (11pm–6am)
                        </span>
                      )}
                    </div>
                    {expanded ? (
                      <ChevronUp size={14} className="text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown
                        size={14}
                        className="text-gray-400 shrink-0"
                      />
                    )}
                  </button>

                  {expanded && (
                    <div className="px-2 py-1 space-y-0.5">
                      {displayed.map((agent) => {
                        const isOff = agentOffIds.has(agent.id);
                        const status = resolveStatus(agent.tier, isOff);
                        const isSelected = selectedAgentId === agent.id;
                        return (
                          <div
                            role="button"
                            tabIndex={0}
                            key={agent.id}
                            onClick={() =>
                              setSelectedAgentId(isSelected ? null : agent.id)
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              setSelectedAgentId(isSelected ? null : agent.id)
                            }
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-150 ${
                              isSelected
                                ? "bg-yellow-900/30 border border-yellow-600/40"
                                : "hover:bg-white/[0.04] border border-transparent"
                            }`}
                            data-ocid={`ai-manager.agent.${agent.id}`}
                          >
                            <StatusDot status={status} />
                            <span className="flex-1 min-w-0">
                              <span className="text-sm text-white/90 truncate block">
                                {agent.name}
                              </span>
                              <span className="text-[10px] text-gray-600 truncate block">
                                {agent.lastAction}
                              </span>
                            </span>
                            <span
                              className={`hidden sm:inline-flex shrink-0 text-[9px] px-1.5 py-0.5 rounded border font-medium ${
                                meta.color
                              } ${meta.borderColor} bg-transparent`}
                            >
                              {agent.category}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAgent(agent.id);
                              }}
                              className={`relative shrink-0 inline-flex h-4 w-7 rounded-full border-2 border-transparent transition-colors cursor-pointer ${
                                !isOff ? "bg-yellow-500" : "bg-gray-600"
                              }`}
                              aria-label={isOff ? "Enable" : "Disable"}
                              data-ocid={`ai-manager.agent.${agent.id}.toggle`}
                            >
                              <span
                                className={`inline-block h-3 w-3 rounded-full bg-white shadow transition-transform ${
                                  !isOff ? "translate-x-3" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                      {tierAgents.length > PAGE && (
                        <button
                          type="button"
                          onClick={() =>
                            setTierShowAll((prev) => {
                              const next = new Set(prev);
                              if (next.has(tier)) next.delete(tier);
                              else next.add(tier);
                              return next;
                            })
                          }
                          className="w-full text-center text-[11px] text-yellow-600 hover:text-yellow-400 py-2 transition-colors"
                          data-ocid={`ai-manager.tier.${tier}.load-more`}
                        >
                          {showAll
                            ? "Show less"
                            : `Show all ${tierAgents.length} agents`}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Detail Panel */}
          {selectedAgent && (
            <div
              className="w-full lg:w-80 xl:w-96 shrink-0 rounded-xl overflow-hidden border border-yellow-800/30 bg-[#07090e] max-h-[700px] overflow-y-auto"
              data-ocid="ai-manager.detail-panel"
            >
              {/* Panel Header */}
              <div className="flex items-start justify-between gap-3 p-4 border-b border-yellow-900/20 sticky top-0 bg-[#07090e] z-10">
                <div className="min-w-0">
                  <h3 className="font-playfair text-yellow-400 font-semibold leading-tight text-sm">
                    {selectedAgent.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                        TIER_META[selectedAgent.tier].color
                      } ${TIER_META[selectedAgent.tier].borderColor} bg-transparent`}
                    >
                      {selectedAgent.tier}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {selectedAgent.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-medium ${
                        selectedAgentStatus === "active"
                          ? "text-green-400"
                          : selectedAgentStatus === "resting"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      <StatusDot status={selectedAgentStatus} />
                      {selectedAgentStatus}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAgentId(null)}
                  className="text-gray-500 hover:text-yellow-400 transition-colors shrink-0"
                  data-ocid="ai-manager.detail-panel.close_button"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 space-y-5">
                {/* Description */}
                <p className="text-xs text-gray-400 leading-relaxed">
                  {selectedAgent.description}
                </p>

                {/* Parent */}
                {selectedAgent.parentId && (
                  <div className="flex items-center gap-1.5">
                    <ChevronRight size={11} className="text-yellow-700" />
                    <span className="text-[10px] text-gray-500">
                      Reports to:
                    </span>
                    <span className="text-[10px] text-yellow-600 font-medium">
                      {
                        AI_AGENTS.find((a) => a.id === selectedAgent.parentId)
                          ?.name
                      }
                    </span>
                  </div>
                )}

                {/* Provider */}
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                    PROVIDER_COLORS[selectedAgent.provider] ??
                    "text-gray-400 bg-gray-400/10 border-gray-400/30"
                  }`}
                >
                  {selectedAgent.provider}
                </span>

                {/* Activity log */}
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                    Recent Activity
                  </p>
                  <div className="space-y-1.5">
                    {[
                      selectedAgent.lastAction,
                      `Coordinated with ${
                        AI_AGENTS.find((a) => a.id === selectedAgent.parentId)
                          ?.name ?? "Master Intelligence"
                      }`,
                      "Ran scheduled check - all nominal",
                      "Updated internal knowledge base",
                      "Completed assigned tasks for this cycle",
                    ].map((action, i) => (
                      <div
                        key={`${selectedAgent.id}-act-${i}`}
                        className="flex items-start gap-2 text-[11px]"
                      >
                        <Clock
                          size={10}
                          className="text-yellow-700 mt-0.5 shrink-0"
                        />
                        <span className="text-gray-400">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Config */}
                <div className="space-y-3">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                    Configuration
                  </p>
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block">
                      Language
                    </label>
                    <select
                      value={selectedConfig.language}
                      onChange={(e) =>
                        setAgentConfigs((prev) => ({
                          ...prev,
                          [selectedAgent.id]: {
                            ...selectedConfig,
                            language: e.target.value as AgentConfig["language"],
                          },
                        }))
                      }
                      className="w-full text-xs bg-black/40 border border-gray-700 rounded px-2 py-1.5 text-gray-300 focus:outline-none focus:border-yellow-600"
                      data-ocid="ai-manager.detail-panel.language.select"
                    >
                      <option>English</option>
                      <option>Gujarati</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block">
                      Personality
                    </label>
                    <select
                      value={selectedConfig.personality}
                      onChange={(e) =>
                        setAgentConfigs((prev) => ({
                          ...prev,
                          [selectedAgent.id]: {
                            ...selectedConfig,
                            personality: e.target
                              .value as AgentConfig["personality"],
                          },
                        }))
                      }
                      className="w-full text-xs bg-black/40 border border-gray-700 rounded px-2 py-1.5 text-gray-300 focus:outline-none focus:border-yellow-600"
                      data-ocid="ai-manager.detail-panel.personality.select"
                    >
                      <option>Analytical</option>
                      <option>Conversational</option>
                      <option>Formal</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block">
                      Focus Area
                    </label>
                    <input
                      type="text"
                      value={selectedConfig.focus}
                      onChange={(e) =>
                        setAgentConfigs((prev) => ({
                          ...prev,
                          [selectedAgent.id]: {
                            ...selectedConfig,
                            focus: e.target.value,
                          },
                        }))
                      }
                      placeholder="e.g. Bopal and Shela only"
                      className="w-full text-xs bg-black/40 border border-gray-700 rounded px-2 py-1.5 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-yellow-600"
                      data-ocid="ai-manager.detail-panel.focus.input"
                    />
                  </div>
                  <button
                    type="button"
                    className="w-full text-xs bg-yellow-500 text-black rounded py-1.5 font-semibold hover:bg-yellow-400 transition-colors"
                    data-ocid="ai-manager.detail-panel.save_button"
                  >
                    Save Config
                  </button>
                </div>

                {/* Ask this agent */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 text-xs border border-yellow-700/40 text-yellow-400 rounded py-2 hover:bg-yellow-900/20 transition-colors"
                  data-ocid="ai-manager.detail-panel.ask_button"
                >
                  <MessageSquare size={12} />
                  Ask This Agent
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION: COORDINATION TIMELINE */}
      {activeSection === "timeline" && (
        <div
          className="rounded-xl border border-yellow-800/30 bg-white/[0.02] overflow-hidden"
          data-ocid="ai-manager.timeline"
        >
          <div className="px-4 py-3 border-b border-yellow-900/20 flex items-center gap-2">
            <Activity size={14} className="text-yellow-500" />
            <span className="text-sm font-semibold text-yellow-300">
              Coordination Timeline
            </span>
            <span className="text-[10px] text-gray-500 ml-auto">
              Today, {new Date().toLocaleDateString("en-IN")}
            </span>
          </div>
          <div className="p-4 space-y-0">
            {SAMPLE_COORDINATION_EVENTS.map((ev, i) => (
              <div
                key={ev.id}
                className="flex gap-3"
                data-ocid={`ai-manager.timeline.item.${i + 1}`}
              >
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 shrink-0 mt-1" />
                  {i < SAMPLE_COORDINATION_EVENTS.length - 1 && (
                    <div className="w-px flex-1 bg-yellow-900/30 my-0.5" />
                  )}
                </div>
                <div className="pb-4 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-yellow-700 font-mono shrink-0">
                      {ev.ts}
                    </span>
                    <span className="text-xs text-gray-300 font-medium truncate">
                      {ev.from}
                    </span>
                    <ChevronRight
                      size={10}
                      className="text-gray-600 shrink-0"
                    />
                    <span className="text-xs text-gray-400 truncate">
                      {ev.to}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {ev.action}
                  </p>
                  <p className="text-[11px] text-yellow-700 mt-0.5">
                    {ev.result}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: AI DAILY DIGEST */}
      {activeSection === "digest" && (
        <div
          className="rounded-xl border border-yellow-800/30 bg-white/[0.02] overflow-hidden"
          data-ocid="ai-manager.digest"
        >
          <div className="px-4 py-3 border-b border-yellow-900/20 flex items-center gap-2">
            <Sparkles size={14} className="text-yellow-500" />
            <span className="text-sm font-semibold text-yellow-300">
              AI Daily Digest
            </span>
            <span className="text-[10px] text-gray-500 ml-2">
              Last updated: {digestTime.current}
            </span>
            <button
              type="button"
              onClick={refreshDigest}
              className="ml-auto flex items-center gap-1.5 text-xs text-yellow-600 hover:text-yellow-400 transition-colors"
              data-ocid="ai-manager.digest.refresh_button"
            >
              <RefreshCw size={12} />
              Refresh
            </button>
          </div>
          <div className="p-4 space-y-5" key={digestKey}>
            {GM_DIGEST_SECTIONS.map((section, si) => (
              <div key={section.gm}>
                <h4 className="text-xs font-semibold text-yellow-500 mb-2 flex items-center gap-2">
                  <span className="w-1 h-3 rounded-full bg-yellow-500 inline-block" />
                  {section.gm}
                </h4>
                <ul className="space-y-1.5">
                  {section.bullets.map((bullet, bi) => (
                    <li
                      key={`digest-${si}-${bullet.slice(0, 20).replace(/\s+/g, "-")}`}
                      className="flex items-start gap-2 text-[11px] text-gray-400"
                      data-ocid={`ai-manager.digest.item.${si * 3 + bi + 1}`}
                    >
                      <span className="shrink-0 text-yellow-700 mt-0.5">
                        &bull;
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: API CONFIGURATION */}
      {activeSection === "api-config" && (
        <div
          className="rounded-xl border border-yellow-800/30 bg-white/[0.02] overflow-hidden"
          data-ocid="ai-manager.api-config"
        >
          <div className="px-4 py-3 border-b border-yellow-900/20 flex items-center gap-2">
            <KeyRound size={14} className="text-yellow-500" />
            <span className="text-sm font-semibold text-yellow-300">
              API Configuration
            </span>
          </div>
          <div className="p-5 space-y-6">
            {/* API Keys */}
            <div className="space-y-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                Provider Keys
              </p>
              {[
                {
                  label: "OpenAI API Key",
                  value: openaiKey,
                  setter: setOpenaiKey,
                  id: "OpenAI",
                },
                {
                  label: "Google Gemini API Key",
                  value: geminiKey,
                  setter: setGeminiKey,
                  id: "Gemini",
                },
                {
                  label: "Anthropic Claude API Key",
                  value: claudeKey,
                  setter: setClaudeKey,
                  id: "Claude",
                },
              ].map((p) => (
                <div key={p.id} className="space-y-1.5">
                  <label className="text-xs text-gray-400">{p.label}</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={p.value}
                      onChange={(e) => p.setter(e.target.value)}
                      placeholder="sk-..."
                      className="flex-1 text-xs bg-black/40 border border-gray-700 rounded px-3 py-2 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-yellow-600"
                      data-ocid={`ai-manager.api-config.${p.id.toLowerCase()}.input`}
                    />
                    <button
                      type="button"
                      onClick={() => testProvider(p.id)}
                      className="shrink-0 px-3 text-xs border border-gray-600 rounded hover:border-yellow-600 text-gray-400 hover:text-yellow-400 transition-colors"
                      data-ocid={`ai-manager.api-config.${p.id.toLowerCase()}.test_button`}
                    >
                      {providerStatus[p.id] === "testing"
                        ? "Testing..."
                        : providerStatus[p.id] === "ok"
                          ? "OK ✓"
                          : providerStatus[p.id] === "error"
                            ? "Failed ✗"
                            : "Test"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Provider */}
            <div className="space-y-3">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                Active Provider
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["OpenAI", "Gemini", "Claude", "Fallback"] as const).map(
                  (p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setActiveProvider(p)}
                      className={`text-xs py-2 px-3 rounded-lg border transition-colors font-medium ${
                        activeProvider === p
                          ? "border-yellow-500 bg-yellow-900/20 text-yellow-300"
                          : "border-gray-700 text-gray-500 hover:border-gray-500"
                      }`}
                      data-ocid={`ai-manager.api-config.provider.${p.toLowerCase()}.radio`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Fallback Order */}
            <div className="space-y-3">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                Fallback Order
              </p>
              <div className="space-y-1.5">
                {fallbackOrder.map((p, i) => (
                  <div
                    key={p}
                    className="flex items-center gap-2 bg-black/20 border border-gray-700/40 rounded-lg px-3 py-2"
                  >
                    <span className="text-[10px] text-gray-600 w-4 shrink-0">
                      {i + 1}.
                    </span>
                    <span className="flex-1 text-xs text-gray-300">{p}</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveFallbackOrder(i, -1)}
                        disabled={i === 0}
                        className="text-gray-600 hover:text-yellow-400 disabled:opacity-30 transition-colors"
                        aria-label="Move up"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFallbackOrder(i, 1)}
                        disabled={i === fallbackOrder.length - 1}
                        className="text-gray-600 hover:text-yellow-400 disabled:opacity-30 transition-colors"
                        aria-label="Move down"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={saveApiConfig}
              className="w-full sm:w-auto px-6 py-2.5 text-sm bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              data-ocid="ai-manager.api-config.save_button"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* Fallback notice */}
      <div className="rounded-xl border border-blue-700/30 bg-blue-900/10 p-4 flex items-start gap-3">
        <Info size={15} className="text-blue-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-300">
            Multi-Provider Fallback Active
          </p>
          <p className="text-xs text-gray-400 mt-1">
            If any provider (OpenAI, Claude, Gemini) is unavailable, the system
            automatically switches to the next available provider. The MSTC
            Knowledge Brain ensures zero downtime even when all external APIs
            are unreachable.
          </p>
        </div>
      </div>
    </div>
  );
}
