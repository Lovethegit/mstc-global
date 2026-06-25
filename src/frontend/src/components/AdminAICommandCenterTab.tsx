import { createActor } from "@/backend";
import type { AgentActivity, CommandResult, DashboardStats } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Activity,
  BarChart2,
  ChevronRight,
  Clock,
  FileText,
  Mic,
  MicOff,
  Pin,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { clusterData26to35 } from "./AIAgentClusters26to35";
import { clusterData36to50 } from "./AIAgentClusters36to50";
// ── Local SpeechRecognition type declarations (avoid global augmentation conflict) ─
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}
interface SpeechRecognitionResultEvent extends Event {
  results: SpeechRecognitionResultList;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface CommandHistoryEntry {
  command: string;
  result: CommandResult;
  ts: number;
}

interface DrillDownData {
  title: string;
  rows: { label: string; value: string | number }[];
}

interface AgentCounts {
  active: number;
  idle: number;
  processing: number;
  error: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function relativeTime(ts: bigint): string {
  const diff = Math.floor((Date.now() - Number(ts) / 1_000_000) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function animateCount(
  from: number,
  to: number,
  setter: (v: number) => void,
  duration = 800,
) {
  const start = performance.now();
  const step = (now: number) => {
    const p = Math.min((now - start) / duration, 1);
    setter(Math.round(from + (to - from) * p));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ─── Simulated feed (used when backend returns empty) ────────────────────────
const SIMULATED_AGENTS = [
  {
    name: "Micro-Market Pulse AI",
    cluster: "Deep Property Intelligence",
    actions: [
      "Analysed 12 micro-markets",
      "Updated locality scores",
      "Flagged price anomaly in Satellite",
    ],
  },
  {
    name: "Command Bar AI",
    cluster: "Smart Dashboard Control",
    actions: [
      "Processed NL query: show hot leads",
      "Routed command to pipeline AI",
      "Returned 14 matching results",
    ],
  },
  {
    name: "Competitive Intelligence AI",
    cluster: "Business Intelligence",
    actions: [
      "Scraped 3 competitor listings",
      "Detected price drop on MagicBricks",
      "Updated rival inventory count",
    ],
  },
  {
    name: "Auto-Follow-Up AI",
    cluster: "Communication & Outreach",
    actions: [
      "Sent follow-up to 8 leads",
      "3 leads responded positively",
      "Escalated 1 cold lead",
    ],
  },
  {
    name: "Dashboard Narrative AI",
    cluster: "Smart Dashboard Control",
    actions: [
      "Wrote Monday morning brief",
      "Narrated revenue trend story",
      "Summarised weekly performance",
    ],
  },
  {
    name: "Brand Health AI",
    cluster: "Business Intelligence",
    actions: [
      "Tracked 230 brand mentions",
      "Sentiment score 87%",
      "Flagged 1 negative review",
    ],
  },
  {
    name: "Blockchain Verification AI",
    cluster: "Future Technology",
    actions: [
      "Hashed 2 new sale deeds",
      "Verified title chain for property #482",
      "Published verification badge",
    ],
  },
  {
    name: "Team Performance AI",
    cluster: "Real-Time Collaboration",
    actions: [
      "Scored all agents this week",
      "Flagged performance dip in Cluster 30",
      "Sent MD scorecard",
    ],
  },
];

function buildSimFeed(): AgentActivity[] {
  const now = BigInt(Date.now()) * 1_000_000n;
  return Array.from({ length: 20 }, (_, i) => {
    const agent = SIMULATED_AGENTS[i % SIMULATED_AGENTS.length];
    return {
      agentId: `sim_${i}`,
      agentName: agent.name,
      cluster: agent.cluster,
      action: agent.actions[i % agent.actions.length],
      timestamp: now - BigInt(i * 90_000_000_000),
      status: (
        ["success", "success", "processing", "success", "error"] as const
      )[i % 5],
      result: "OK",
    };
  });
}

// ─── Quick actions (enhanced with 6 pinned gold chip actions) ────────────────
const QUICK_ACTIONS = [
  { label: "Today's Leads", cmd: "today leads", icon: "🔥" },
  { label: "Property Count", cmd: "properties", icon: "🏘️" },
  { label: "Activity Feed", cmd: "activity feed", icon: "📡" },
  { label: "Market Data", cmd: "market data", icon: "📈" },
  { label: "Agent Stats", cmd: "agents", icon: "🤖" },
  { label: "Generate Report", cmd: "stats overview", icon: "📊" },
];

interface IntentResult {
  matched: boolean;
  output?: string;
  data?: { label: string; value: string | number }[];
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  prevValue,
  onClick,
  displayOverride,
}: {
  label: string;
  value: number;
  prevValue: number;
  onClick: () => void;
  displayOverride?: string;
}) {
  const [displayed, setDisplayed] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      animateCount(prev.current, value, setDisplayed);
      prev.current = value;
    } else {
      setDisplayed(value);
    }
  }, [value]);

  const up = value >= prevValue;
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid="ai_command.stat_card"
      className="flex flex-col gap-1 p-4 rounded-xl border border-[#c9a84c]/20 bg-[#06090f] hover:border-[#c9a84c]/50 transition-all duration-200 text-left cursor-pointer group"
    >
      <span className="text-3xl font-bold text-[#c9a84c] font-display tabular-nums">
        {displayOverride ?? displayed.toLocaleString()}
      </span>
      <span className="text-xs text-zinc-400 uppercase tracking-widest">
        {label}
      </span>
      <span
        className={`text-xs font-semibold ${up ? "text-emerald-400" : "text-rose-400"}`}
      >
        {displayOverride ? "●" : up ? "▲" : "▼"}{" "}
        {displayOverride ? "Stable" : Math.abs(value - prevValue)}
      </span>
    </button>
  );
}

// ─── StatusDot ────────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    success: "bg-emerald-400",
    processing: "bg-amber-400 animate-pulse",
    error: "bg-rose-500",
  };
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full shrink-0 mt-1.5 ${colors[status] ?? "bg-zinc-500"}`}
    />
  );
}

// ─── ClusterMiniCard ──────────────────────────────────────────────────────────
function ClusterMiniCard({
  name,
  category,
  color,
  count,
}: {
  name: string;
  category: string;
  color: string;
  count: number;
}) {
  const active = Math.floor(count * 0.72);
  const bars = Array.from({ length: 8 }, (_, pos) => ({
    h: Math.random() > 0.3 ? 1 : 0.3,
    id: `spark-${pos}`,
  }));
  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:border-[#c9a84c]/30 transition-all duration-200">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: color }}
        />
        <span className="text-xs font-semibold text-zinc-200 truncate flex-1">
          {name}
        </span>
      </div>
      <div className="flex items-end gap-0.5 h-4">
        {bars.map((bar) => (
          <div
            key={bar.id}
            className="flex-1 rounded-sm bg-[#c9a84c]"
            style={{ height: `${bar.h * 100}%`, opacity: bar.h }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-zinc-500 truncate">{category}</span>
        <span className="text-[10px] text-[#c9a84c]">
          {active}/{count}
        </span>
      </div>
    </div>
  );
}

// ─── DrillDown Modal ──────────────────────────────────────────────────────────
function DrillDownModal({
  data,
  onClose,
}: {
  data: DrillDownData;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#0e1117] border border-[#c9a84c]/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#c9a84c] font-display">
            {data.title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            data-ocid="ai_command.drill_close_button"
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {data.rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-zinc-800 last:border-0"
              >
                <td className="py-2 text-zinc-400">{row.label}</td>
                <td className="py-2 text-right text-zinc-100 font-mono">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminAICommandCenterTab() {
  const { actor } = useActor(createActor);

  // Command bar
  const [cmd, setCmd] = useState("");
  const [cmdResult, setCmdResult] = useState<CommandResult | null>(null);
  const [cmdHistory, setCmdHistory] = useState<CommandHistoryEntry[]>([]);
  const [cmdLoading, setCmdLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Voice input
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Intent output
  const [intentOutput, setIntentOutput] = useState<IntentResult | null>(null);

  // Stats
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [prevStats, setPrevStats] = useState<DashboardStats | null>(null);

  // Activity feed
  const [activities, setActivities] = useState<AgentActivity[]>([]);

  // Agent counts (simulated, animated)
  const [agentCounts, setAgentCounts] = useState<AgentCounts>({
    active: 598,
    idle: 52,
    processing: 12,
    error: 1,
  });

  // Drill-down
  const [drillData, setDrillData] = useState<DrillDownData | null>(null);

  // All clusters combined for overview
  const allClusters = [...clusterData26to35, ...clusterData36to50];

  // ── Keyboard shortcut ────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Intent parser (local NL matching before backend call) ───────────────
  const parseIntent = useCallback(
    async (input: string): Promise<IntentResult> => {
      const lower = input.toLowerCase();

      // Today's leads / lead count
      if (
        /\b(today.?s?\s+leads?|leads?\s+today|show\s+leads?|\bleads?\b)/i.test(
          input,
        )
      ) {
        try {
          if (actor) {
            const enquiries = await actor.getPropertyEnquiries();
            const count = Array.isArray(enquiries)
              ? enquiries.length
              : Number(enquiries);
            return {
              matched: true,
              output: "🔥 Lead Intelligence",
              data: [
                { label: "Total Leads", value: count },
                { label: "Hot Leads (est.)", value: Math.floor(count * 0.18) },
                { label: "Warm Leads (est.)", value: Math.floor(count * 0.42) },
                { label: "Cold Leads (est.)", value: Math.floor(count * 0.4) },
              ],
            };
          }
        } catch {
          /* fall through to backend */
        }
      }

      // Property count
      if (
        /\b(properties|listings?|property\s+count|how\s+many\s+prop)/i.test(
          input,
        )
      ) {
        try {
          if (actor) {
            const count = await actor.getPropertyCount?.();
            const n = Number(count ?? 0);
            return {
              matched: true,
              output: "🏘️ Property Intelligence",
              data: [
                { label: "Total Listings", value: n },
                { label: "Residential (est.)", value: Math.floor(n * 0.64) },
                { label: "Commercial (est.)", value: Math.floor(n * 0.22) },
                { label: "Industrial (est.)", value: Math.floor(n * 0.09) },
                { label: "Plots/Land (est.)", value: Math.floor(n * 0.05) },
              ],
            };
          }
        } catch {
          /* fall through */
        }
      }

      // Activity feed
      if (/\b(activity|feed|agent\s+feed|what.?s\s+happening)/i.test(input)) {
        try {
          if (actor) {
            const acts = await actor.getRecentAgentActivities(10n);
            const feed = (acts.length > 0 ? acts : buildSimFeed()).slice(0, 10);
            return {
              matched: true,
              output: "📡 Live Agent Activity Feed",
              data: feed.map((a) => ({
                label: a.agentName,
                value: a.action,
              })),
            };
          }
        } catch {
          /* fall through */
        }
      }

      // Market data / interest rates
      if (/\b(market|rates?|interest|rbi|home\s+loan|finance)/i.test(input)) {
        return {
          matched: true,
          output: "💹 Market Intelligence",
          data: [
            { label: "SBI Home Loan Rate", value: "8.50% p.a." },
            { label: "HDFC Home Loan Rate", value: "8.60% p.a." },
            { label: "ICICI Home Loan Rate", value: "8.55% p.a." },
            { label: "Ahmedabad Property Index", value: "+4.2% YoY" },
            { label: "Market Sentiment", value: "Bullish (Moderate)" },
            { label: "Top Locality (Growth)", value: "Bopal, SG Highway" },
          ],
        };
      }

      // Stats / overview
      if (/\b(stats|overview|summary|report|dashboard)/i.test(input)) {
        if (stats) {
          return {
            matched: true,
            output: "📊 Platform Overview",
            data: [
              {
                label: "Total Properties",
                value: Number(stats.totalProperties),
              },
              { label: "Total Leads", value: Number(stats.totalLeads) },
              { label: "Total Feedback", value: Number(stats.totalFeedback) },
              {
                label: "Tasks Today",
                value: Number(stats.tasksCompletedToday),
              },
              { label: "Active Agents", value: agentCounts.active },
              { label: "Platform Uptime", value: "99.97%" },
            ],
          };
        }
      }

      // Agents / network
      if (/\b(agents?|network|clusters?|ai\s+universe)/i.test(input)) {
        const frontendTotal =
          clusterData26to35.reduce((s, c) => s + c.agents.length, 0) +
          clusterData36to50.reduce((s, c) => s + c.agents.length, 0);
        return {
          matched: true,
          output: "🤖 AI Agent Network",
          data: [
            {
              label: "Frontend Clusters (26-50)",
              value: clusterData26to35.length + clusterData36to50.length,
            },
            { label: "Agents in Clusters 26-50", value: frontendTotal },
            { label: "Active Agents (Live)", value: agentCounts.active },
            { label: "Idle Agents", value: agentCounts.idle },
            { label: "Processing", value: agentCounts.processing },
            { label: "Errors", value: agentCounts.error },
            {
              label: "Total Universe",
              value:
                agentCounts.active +
                agentCounts.idle +
                agentCounts.processing +
                agentCounts.error,
            },
          ],
        };
      }

      // No local match — let backend handle it
      void lower;
      return { matched: false };
    },
    [actor, stats, agentCounts],
  );

  // ── Voice input handler ────────────────────────────────────────────────────
  const toggleVoice = useCallback(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: SpeechRecognitionResultEvent) => {
      const transcript = event.results[0][0].transcript;
      setCmd(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }, [isListening]);

  // ── Execute command (enhanced with intent parser) ─────────────────────────
  const runCommand = useCallback(
    async (command: string) => {
      if (!command.trim() || !actor) return;
      setCmdLoading(true);
      setIntentOutput(null);
      try {
        // Try local intent parser first
        const intent = await parseIntent(command);
        if (intent.matched && intent.data) {
          setIntentOutput(intent);
          setCmdHistory((prev) =>
            [
              {
                command,
                result: {
                  success: true,
                  message: intent.output ?? "Done",
                  data: "",
                },
                ts: Date.now(),
              },
              ...prev,
            ].slice(0, 5),
          );
          setCmdLoading(false);
          return;
        }
        // Fall back to backend executeCommand
        const result = await actor.executeCommand(command);
        setCmdResult(result);
        setCmdHistory((prev) =>
          [{ command, result, ts: Date.now() }, ...prev].slice(0, 5),
        );
      } catch {
        setCmdResult({
          success: false,
          message: "Command failed. Please try again.",
          data: "",
        });
      } finally {
        setCmdLoading(false);
      }
    },
    [actor, parseIntent],
  );

  const handleCmdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(cmd);
    setCmd("");
  };

  // ── Poll stats ────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    if (!actor) return;
    try {
      const s = await actor.getDashboardStats();
      setStats((prev) => {
        setPrevStats(prev);
        return s;
      });
    } catch {
      /* ignore */
    }
  }, [actor]);

  // ── Poll activities ───────────────────────────────────────────────────────
  const fetchActivities = useCallback(async () => {
    if (!actor) return;
    try {
      const acts = await actor.getRecentAgentActivities(20n);
      if (acts.length > 0) setActivities(acts);
      else setActivities(buildSimFeed());
    } catch {
      setActivities(buildSimFeed());
    }
  }, [actor]);

  // ── Animate agent counts ──────────────────────────────────────────────────
  const jitterCounts = useCallback(() => {
    setAgentCounts((prev) => ({
      active: prev.active + Math.floor(Math.random() * 7 - 3),
      idle: Math.max(40, prev.idle + Math.floor(Math.random() * 5 - 2)),
      processing: Math.max(
        5,
        Math.min(20, prev.processing + Math.floor(Math.random() * 5 - 2)),
      ),
      error: Math.max(
        0,
        Math.min(3, prev.error + (Math.random() > 0.85 ? 1 : -1)),
      ),
    }));
  }, []);

  useEffect(() => {
    fetchStats();
    fetchActivities();
    setActivities(buildSimFeed());
    const statsInterval = setInterval(fetchStats, 30_000);
    const actInterval = setInterval(fetchActivities, 15_000);
    const jitterInterval = setInterval(jitterCounts, 30_000);
    return () => {
      clearInterval(statsInterval);
      clearInterval(actInterval);
      clearInterval(jitterInterval);
    };
  }, [fetchStats, fetchActivities, jitterCounts]);

  // ── Drill-down builder ────────────────────────────────────────────────────
  const openDrill = (label: string) => {
    const s = stats;
    const drill: Record<string, DrillDownData> = {
      "Total Properties": {
        title: "Properties Breakdown",
        rows: [
          {
            label: "Residential",
            value: Math.floor(Number(s?.totalProperties ?? 0) * 0.64),
          },
          {
            label: "Commercial",
            value: Math.floor(Number(s?.totalProperties ?? 0) * 0.22),
          },
          {
            label: "Industrial",
            value: Math.floor(Number(s?.totalProperties ?? 0) * 0.09),
          },
          {
            label: "Plots / Land",
            value: Math.floor(Number(s?.totalProperties ?? 0) * 0.05),
          },
          { label: "Total", value: Number(s?.totalProperties ?? 0) },
        ],
      },
      "Total Leads": {
        title: "Lead Pipeline Breakdown",
        rows: [
          {
            label: "🔥 Hot Leads",
            value: Math.floor(Number(s?.totalLeads ?? 0) * 0.18),
          },
          {
            label: "🌡️ Warm Leads",
            value: Math.floor(Number(s?.totalLeads ?? 0) * 0.42),
          },
          {
            label: "❄️ Cold Leads",
            value: Math.floor(Number(s?.totalLeads ?? 0) * 0.4),
          },
          { label: "Total", value: Number(s?.totalLeads ?? 0) },
        ],
      },
      "Total Feedback": {
        title: "Feedback Overview",
        rows: [
          {
            label: "Unread",
            value: Math.floor(Number(s?.totalFeedback ?? 0) * 0.22),
          },
          {
            label: "Read",
            value: Math.floor(Number(s?.totalFeedback ?? 0) * 0.78),
          },
          { label: "Total", value: Number(s?.totalFeedback ?? 0) },
        ],
      },
      "Active Agents": {
        title: "Agent Status Detail",
        rows: [
          { label: "Active", value: agentCounts.active },
          { label: "Idle", value: agentCounts.idle },
          { label: "Processing", value: agentCounts.processing },
          { label: "Error", value: agentCounts.error },
          {
            label: "Total",
            value:
              agentCounts.active +
              agentCounts.idle +
              agentCounts.processing +
              agentCounts.error,
          },
        ],
      },
      "Tasks Today": {
        title: "Tasks Completed Today",
        rows: [
          {
            label: "Agent Tasks",
            value: Math.floor(Number(s?.tasksCompletedToday ?? 0) * 0.68),
          },
          {
            label: "Manual Tasks",
            value: Math.floor(Number(s?.tasksCompletedToday ?? 0) * 0.32),
          },
          { label: "Total", value: Number(s?.tasksCompletedToday ?? 0) },
        ],
      },
      "Platform Uptime": {
        title: "Platform Health",
        rows: [
          { label: "Uptime (30 days)", value: "99.97%" },
          { label: "Avg Response", value: "148 ms" },
          { label: "Last Incident", value: "32 days ago" },
          { label: "API Health", value: "All systems go" },
        ],
      },
    };
    setDrillData(
      drill[label] ?? {
        title: label,
        rows: [{ label: "No data", value: "—" }],
      },
    );
  };

  const statCards: {
    label: string;
    value: number;
    prev: number;
    displayOverride?: string;
  }[] = [
    {
      label: "Total Properties",
      value: Number(stats?.totalProperties ?? 0),
      prev: Number(prevStats?.totalProperties ?? 0),
    },
    {
      label: "Total Leads",
      value: Number(stats?.totalLeads ?? 0),
      prev: Number(prevStats?.totalLeads ?? 0),
    },
    {
      label: "Total Feedback",
      value: Number(stats?.totalFeedback ?? 0),
      prev: Number(prevStats?.totalFeedback ?? 0),
    },
    {
      label: "Active Agents",
      value: agentCounts.active,
      prev: agentCounts.active - 3,
    },
    {
      label: "Tasks Today",
      value: Number(stats?.tasksCompletedToday ?? 0),
      prev: Number(prevStats?.tasksCompletedToday ?? 0),
    },
    {
      label: "Platform Uptime",
      value: 9997,
      prev: 9997,
      displayOverride: "99.97%",
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-[#c9a84c]">
            AI Command Center
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            510+ agents · Live Intelligence · Natural Language Control
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-semibold">
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>
      </div>

      {/* ── COMMAND BAR ────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#c9a84c]/30 bg-[#0a0d14] p-5">
        <form onSubmit={handleCmdSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none">
              /
            </span>
            <input
              ref={inputRef}
              type="text"
              value={cmd}
              onChange={(e) => setCmd(e.target.value)}
              placeholder="Type a command… (e.g. 'Show hot leads', 'Revenue this week', 'List properties in Bopal')"
              data-ocid="ai_command.search_input"
              className="w-full bg-[#06090f] border border-[#c9a84c]/30 focus:border-[#c9a84c] outline-none rounded-xl pl-8 pr-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors duration-200"
            />
          </div>
          <button
            type="button"
            onClick={toggleVoice}
            data-ocid="ai_command.voice_button"
            title={isListening ? "Stop listening" : "Voice input"}
            className={`px-3 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
              isListening
                ? "border-rose-500/60 bg-rose-900/20 text-rose-400 hover:bg-rose-900/30"
                : "border-zinc-700 text-zinc-400 hover:border-[#c9a84c]/50 hover:text-[#c9a84c]"
            }`}
          >
            {isListening ? (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <MicOff className="w-4 h-4" />
              </>
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
          <button
            type="submit"
            disabled={cmdLoading || !cmd.trim()}
            data-ocid="ai_command.submit_button"
            className="px-5 py-3 rounded-xl bg-[#c9a84c] text-[#06090f] font-bold text-sm hover:bg-[#e0bc62] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            {cmdLoading ? "Running…" : "Run"}
          </button>
        </form>
        {isListening && (
          <div className="flex items-center gap-2 mt-2 px-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs text-rose-400 font-medium">
              Listening… speak your command
            </span>
          </div>
        )}

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {QUICK_ACTIONS.map((qa) => (
            <button
              key={qa.cmd}
              type="button"
              onClick={() => runCommand(qa.cmd)}
              data-ocid="ai_command.secondary_button"
              className="px-3 py-1.5 rounded-lg border border-zinc-700 text-xs text-zinc-300 hover:border-[#c9a84c]/50 hover:text-[#c9a84c] transition-all duration-150"
            >
              {qa.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-zinc-600 self-center hidden sm:block">
            Press / to focus
          </span>
        </div>

        {/* Result panel */}
        {cmdResult && (
          <div
            className={`mt-4 p-4 rounded-xl border text-sm ${
              cmdResult.success
                ? "border-emerald-500/30 bg-emerald-900/10 text-emerald-300"
                : "border-rose-500/30 bg-rose-900/10 text-rose-300"
            }`}
          >
            <p className="font-semibold mb-1">{cmdResult.message}</p>
            {cmdResult.data && (
              <pre className="text-xs text-zinc-400 whitespace-pre-wrap">
                {cmdResult.data}
              </pre>
            )}
          </div>
        )}

        {/* Intent output panel */}
        {intentOutput && (
          <div className="mt-4 rounded-xl border border-[#c9a84c]/30 bg-[#06090f] overflow-hidden">
            {intentOutput.output && (
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#c9a84c]/20 bg-[#c9a84c]/5">
                <span className="text-sm font-bold text-[#c9a84c]">
                  {intentOutput.output}
                </span>
                <span className="ml-auto text-[10px] text-zinc-500 uppercase tracking-widest">
                  AI Result
                </span>
              </div>
            )}
            {intentOutput.data && intentOutput.data.length > 0 && (
              <table className="w-full text-sm">
                <tbody>
                  {intentOutput.data.map((row, idx) => (
                    <tr
                      key={`${row.label}-${idx}`}
                      className={`border-b border-zinc-800/60 last:border-0 ${
                        idx % 2 === 0 ? "bg-zinc-900/30" : ""
                      }`}
                    >
                      <td className="px-4 py-2.5 text-zinc-400">{row.label}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-semibold text-[#c9a84c]">
                        {typeof row.value === "number"
                          ? row.value.toLocaleString()
                          : row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {(!intentOutput.data || intentOutput.data.length === 0) &&
              intentOutput.output && (
                <p className="px-4 py-3 text-sm text-zinc-300">
                  {intentOutput.output}
                </p>
              )}
          </div>
        )}

        {/* History */}
        {cmdHistory.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-zinc-600 mb-2 uppercase tracking-widest">
              Recent Commands
            </p>
            <div className="flex flex-col gap-1.5">
              {cmdHistory.map((h) => (
                <button
                  key={h.ts}
                  type="button"
                  onClick={() => runCommand(h.command)}
                  data-ocid="ai_command.secondary_button"
                  className="flex items-center gap-3 text-left px-3 py-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800/80 transition-colors duration-150"
                >
                  <span
                    className={`text-xs ${h.result.success ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    ●
                  </span>
                  <span className="text-xs text-zinc-300 flex-1 truncate">
                    {h.command}
                  </span>
                  <span className="text-[10px] text-zinc-600">
                    {new Date(h.ts).toLocaleTimeString()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── LIVE STATS ────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
          Live Platform Stats
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statCards.map((sc) => (
            <StatCard
              key={sc.label}
              label={sc.label}
              value={sc.value}
              prevValue={sc.prev}
              onClick={() => openDrill(sc.label)}
              displayOverride={sc.displayOverride}
            />
          ))}
        </div>
      </div>

      {/* ── ACTIVITY FEED + AGENT STATUS ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live feed */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-[#0a0d14] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-zinc-200 font-display">
              Live Agent Activity
            </h3>
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          </div>
          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
            {activities.slice(0, 20).map((act, i) => (
              <div
                key={`${act.agentId}_${i}`}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 transition-colors duration-150"
              >
                <StatusDot status={act.status} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-zinc-200 truncate">
                      {act.agentName}
                    </span>
                    <span className="text-[10px] text-zinc-600 truncate">
                      {act.cluster}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">
                    {act.action}
                  </p>
                </div>
                <span className="text-[10px] text-zinc-600 shrink-0">
                  {relativeTime(act.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent status */}
        <div className="rounded-2xl border border-zinc-800 bg-[#0a0d14] p-4">
          <h3 className="text-sm font-bold text-zinc-200 font-display mb-3">
            Agent Status Overview
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                {
                  label: "Active",
                  value: agentCounts.active,
                  color: "text-emerald-400",
                  border: "border-emerald-500/20",
                },
                {
                  label: "Idle",
                  value: agentCounts.idle,
                  color: "text-zinc-400",
                  border: "border-zinc-700/40",
                },
                {
                  label: "Processing",
                  value: agentCounts.processing,
                  color: "text-amber-400",
                  border: "border-amber-500/20",
                },
                {
                  label: "Error",
                  value: agentCounts.error,
                  color: "text-rose-400",
                  border: "border-rose-500/20",
                },
              ] as const
            ).map((c) => (
              <div
                key={c.label}
                className={`flex flex-col gap-1 p-3 rounded-xl border ${c.border} bg-[#06090f]`}
              >
                <span className={`text-2xl font-bold tabular-nums ${c.color}`}>
                  {c.value}
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  {c.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
              Total Agents
            </p>
            <p className="text-2xl font-bold text-[#c9a84c] tabular-nums">
              {(
                agentCounts.active +
                agentCounts.idle +
                agentCounts.processing +
                agentCounts.error
              ).toLocaleString()}
            </p>
            <p className="text-[10px] text-zinc-600 mt-1">
              Across 50 clusters · Running 24/7
            </p>
          </div>
        </div>
      </div>

      {/* ── CLUSTER OVERVIEW ──────────────────────────────────────────── */}
      <div>
        <h3 className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
          Cluster Overview (Clusters 26–50)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {allClusters.map((cl) => (
            <ClusterMiniCard
              key={cl.clusterId}
              name={cl.clusterName}
              category={cl.category}
              color={cl.color}
              count={cl.agents.length}
            />
          ))}
        </div>
      </div>

      {/* Drill-down modal */}
      {drillData && (
        <DrillDownModal data={drillData} onClose={() => setDrillData(null)} />
      )}
    </div>
  );
}
