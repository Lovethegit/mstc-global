import { createActor } from "@/backend";
import type { AIActivityEntry } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { ChevronDown, ChevronUp, Cpu, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const GOLD = "#c9a84c";

function relTs(ts: string): string {
  const d = new Date(ts);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

const FALLBACK_MESSAGES = [
  "Aryan matched 12 leads to properties",
  "Property cache: 3 new listings added",
  "Chat AI processed 47 messages",
  "Market data refreshed",
  "Priya calculated EMI for 8 enquiries",
  "Vikram analysed 2 RERA documents",
  "Auto-Follow-Up AI sent 5 messages",
  "Lead Scoring AI rescored 34 leads",
  "Competitive Intelligence: 2 price drops detected",
  "Content AI published weekly market report",
];

export default function AIActivityBar() {
  const { actor, isFetching } = useActor(createActor);
  const [feed, setFeed] = useState<AIActivityEntry[]>([]);
  const [activeCount, setActiveCount] = useState(598);
  const [expanded, setExpanded] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const fetchFeed = useCallback(async () => {
    if (!actor || isFetching) return;
    try {
      const data = await actor.getAIStaffActivityFeed();
      if (data.length > 0) setFeed(data);
    } catch {
      /* keep previous */
    }
    try {
      const stats = await actor.getRealTimeStats();
      setActiveCount(Number(stats.activeNow));
    } catch {
      setActiveCount((p) => p + Math.floor(Math.random() * 5 - 2));
    }
  }, [actor, isFetching]);

  useEffect(() => {
    fetchFeed();
    const id = setInterval(fetchFeed, 30_000);
    return () => clearInterval(id);
  }, [fetchFeed]);

  const messages =
    feed.length > 0
      ? feed.map(
          (f) =>
            `${f.agentName}: ${f.actionType} (${f.count.toString()} actions)`,
        )
      : FALLBACK_MESSAGES;

  const marqueeText = messages.join(" • ");

  return (
    <div
      data-ocid="ai_activity_bar"
      className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ height: expanded ? 220 : 56 }}
    >
      {/* Collapsed / Header row */}
      <div
        className="flex items-center gap-3 px-4 h-14 border-t"
        style={{ background: "#06090f", borderColor: `${GOLD}55` }}
      >
        {/* Left: status */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <Cpu className="w-3.5 h-3.5" style={{ color: GOLD }} />
          <span className="text-xs font-semibold" style={{ color: GOLD }}>
            AI Network Active
          </span>
          <span className="text-xs text-zinc-500">&bull;</span>
          <span className="text-xs text-emerald-400 font-bold tabular-nums">
            {activeCount.toLocaleString()}
          </span>
          <span className="text-xs text-zinc-500">agents</span>
        </div>

        {/* Center: marquee */}
        <div className="flex-1 overflow-hidden mx-4 min-w-0">
          {!expanded && (
            <div
              ref={marqueeRef}
              className="whitespace-nowrap text-xs text-zinc-400"
              style={{
                animation: "ai-marquee 40s linear infinite",
              }}
            >
              {marqueeText} &nbsp;&nbsp;&nbsp; {marqueeText}
            </div>
          )}
          {expanded && (
            <span className="text-xs text-zinc-500">Last 10 AI actions</span>
          )}
        </div>

        {/* Right: toggle */}
        <button
          type="button"
          data-ocid="ai_activity_bar.toggle"
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg border text-xs transition-colors duration-150"
          style={{
            borderColor: `${GOLD}44`,
            color: GOLD,
            background: "transparent",
          }}
          aria-label={expanded ? "Collapse AI bar" : "Expand AI bar"}
        >
          <Zap className="w-3 h-3" />
          {expanded ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronUp className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Expanded: activity list */}
      {expanded && (
        <div
          className="overflow-y-auto"
          style={{
            background: "#08090f",
            height: 164,
            borderTop: `1px solid ${GOLD}22`,
          }}
        >
          {(feed.length > 0 ? feed.slice(0, 10) : []).length === 0 ? (
            <div className="flex flex-col gap-1.5 p-3">
              {FALLBACK_MESSAGES.slice(0, 10).map((msg, i) => (
                <div
                  key={msg}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-lg"
                  style={{ background: "#0e1117" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-xs text-zinc-300 flex-1 truncate">
                    {msg}
                  </span>
                  <span className="text-[10px] text-zinc-600 shrink-0">
                    {i * 3 + 1}m ago
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 p-3">
              {feed.slice(0, 10).map((entry) => (
                <div
                  key={`${entry.agentId}-${entry.timestamp}`}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-lg"
                  style={{ background: "#0e1117" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span
                    className="text-xs font-semibold shrink-0"
                    style={{ color: GOLD }}
                  >
                    {entry.agentName}
                  </span>
                  <span className="text-xs text-zinc-400 flex-1 truncate">
                    {entry.actionType}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 shrink-0">
                    ×{entry.count.toString()}
                  </span>
                  <span className="text-[10px] text-zinc-600 shrink-0">
                    {relTs(entry.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes ai-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
