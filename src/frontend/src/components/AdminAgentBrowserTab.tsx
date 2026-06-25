import type React from "react";
import { useMemo, useState } from "react";
import { EXTENDED_AGENTS_2 } from "./AIManagerData_Agents2";
import { EXTENDED_AGENTS_3 } from "./AIManagerData_Agents3";
import { EXTENDED_AGENTS_4 } from "./AIManagerData_Agents4";
import { EXTENDED_AGENTS_5 } from "./AIManagerData_Agents5";
import { EXTENDED_AGENTS, EXTENDED_TIER_META } from "./AIManagerData_Extended";
import type { ExtendedAgentDef } from "./AIManagerData_Extended";

const ALL_EXTENDED_AGENTS: ExtendedAgentDef[] = [
  ...EXTENDED_AGENTS,
  ...EXTENDED_AGENTS_2,
  ...EXTENDED_AGENTS_3,
  ...EXTENDED_AGENTS_4,
  ...EXTENDED_AGENTS_5,
];

const TIERS = [...new Set(ALL_EXTENDED_AGENTS.map((a) => a.tier))].sort();
const DOMAINS = [
  ...new Set(ALL_EXTENDED_AGENTS.map((a) => a.domain).filter(Boolean)),
]
  .sort()
  .slice(0, 20);

const PAGE_SIZE = 48;

interface TierMeta {
  label: string;
  color: string;
  bg: string;
  badge: string;
}

function getTierMeta(
  tier: string,
  tierMeta: Record<string, TierMeta>,
): TierMeta {
  return (
    tierMeta[tier] ?? {
      label: tier,
      color: "#9ca3af",
      bg: "bg-gray-800",
      badge: "text-gray-400",
    }
  );
}

const AdminAgentBrowserTab: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [selected, setSelected] = useState<ExtendedAgentDef | null>(null);
  const [page, setPage] = useState(0);

  const tierMeta = EXTENDED_TIER_META as Record<string, TierMeta>;

  const filtered = useMemo(() => {
    return ALL_EXTENDED_AGENTS.filter((a) => {
      if (filterTier && a.tier !== filterTier) return false;
      if (filterDomain && a.domain !== filterDomain) return false;
      if (
        search &&
        !a.name.toLowerCase().includes(search.toLowerCase()) &&
        !a.category.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [search, filterTier, filterDomain]);

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div className="space-y-4" data-ocid="agent-browser.panel">
      {/* Header */}
      <div>
        <h2
          className="text-xl font-bold text-[#c9a84c]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          808+ Agent Browser
        </h2>
        <p className="text-gray-400 text-sm">
          {ALL_EXTENDED_AGENTS.length} AI agents — search, filter, and explore
          the complete MSTC AI universe
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder="Search agents by name or category..."
          className="flex-1 bg-gray-900/60 border border-gray-700/40 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50"
          data-ocid="agent-browser.search_input"
        />
        <select
          value={filterTier}
          onChange={(e) => {
            setFilterTier(e.target.value);
            setPage(0);
          }}
          className="bg-gray-900/60 border border-gray-700/40 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 sm:w-48"
          data-ocid="agent-browser.tier.select"
        >
          <option value="">All Tiers</option>
          {TIERS.map((t) => (
            <option key={t} value={t}>
              {getTierMeta(t, tierMeta).label}
            </option>
          ))}
        </select>
        <select
          value={filterDomain}
          onChange={(e) => {
            setFilterDomain(e.target.value);
            setPage(0);
          }}
          className="bg-gray-900/60 border border-gray-700/40 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 sm:w-48"
          data-ocid="agent-browser.domain.select"
        >
          <option value="">All Domains</option>
          {DOMAINS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Results count + pagination */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Showing {filtered.length} agents{" "}
          {search || filterTier || filterDomain ? "(filtered)" : ""}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded-lg bg-gray-800 text-gray-400 disabled:opacity-40 hover:bg-gray-700 transition-colors"
            data-ocid="agent-browser.pagination_prev"
          >
            &#8592;
          </button>
          <span>
            Page {page + 1} / {Math.max(1, totalPages)}
          </span>
          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded-lg bg-gray-800 text-gray-400 disabled:opacity-40 hover:bg-gray-700 transition-colors"
            data-ocid="agent-browser.pagination_next"
          >
            &#8594;
          </button>
        </div>
      </div>

      {/* Agent Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
        data-ocid="agent-browser.list"
      >
        {paginated.map((agent, idx) => {
          const meta = getTierMeta(agent.tier, tierMeta);
          return (
            <button
              key={agent.id}
              type="button"
              onClick={() => setSelected(agent)}
              className="bg-gray-900/60 border border-gray-700/30 rounded-xl p-3 cursor-pointer hover:border-[#c9a84c]/40 transition-all w-full text-left"
              data-ocid={`agent-browser.item.${idx + 1}`}
            >
              <div className="flex items-start justify-between mb-2">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-medium flex-shrink-0 ${meta.badge} bg-gray-800/60`}
                >
                  {meta.label}
                </span>
                <div className="flex items-center gap-1 ml-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs">
                    {agent.performanceScore}%
                  </span>
                </div>
              </div>
              <div className="text-white text-xs font-semibold mb-1 leading-tight">
                {agent.name}
              </div>
              <div className="text-gray-500 text-xs mb-2">{agent.domain}</div>
              <div className="text-gray-600 text-xs truncate">
                {agent.lastAction}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                <span>AL: {agent.autonomyLevel}/10</span>
                <span>{agent.tasksCompleted.toLocaleString()} tasks</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Agent Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
          data-ocid="agent-browser.dialog"
          role="presentation"
          onKeyDown={(e) => e.key === "Escape" && setSelected(null)}
        >
          <div
            className="bg-[#06090f] border border-gray-700/60 rounded-2xl p-6 max-w-lg w-full my-4"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal header */}
            <div className="flex items-start justify-between mb-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                      getTierMeta(selected.tier, tierMeta).badge
                    } bg-gray-800`}
                  >
                    {getTierMeta(selected.tier, tierMeta).label}
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-xs">Active</span>
                  </div>
                </div>
                <h3
                  className="text-[#c9a84c] text-lg font-bold"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {selected.name}
                </h3>
                <p className="text-gray-500 text-sm">
                  {selected.category} &middot; {selected.domain}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-gray-500 hover:text-white text-2xl leading-none ml-2 flex-shrink-0"
                aria-label="Close agent detail"
                data-ocid="agent-browser.close_button"
              >
                &#10005;
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {selected.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-900/60 rounded-lg p-3 text-center">
                <div className="text-[#c9a84c] font-bold text-lg">
                  {selected.autonomyLevel}/10
                </div>
                <div className="text-gray-500 text-xs">Autonomy</div>
              </div>
              <div className="bg-gray-900/60 rounded-lg p-3 text-center">
                <div className="text-green-400 font-bold text-lg">
                  {selected.performanceScore}%
                </div>
                <div className="text-gray-500 text-xs">Performance</div>
              </div>
              <div className="bg-gray-900/60 rounded-lg p-3 text-center">
                <div className="text-blue-400 font-bold text-lg">
                  {selected.tasksCompleted >= 1000
                    ? `${(selected.tasksCompleted / 1000).toFixed(1)}K`
                    : selected.tasksCompleted}
                </div>
                <div className="text-gray-500 text-xs">Tasks Done</div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="bg-gray-900/60 rounded-xl p-4 mb-4">
              <div className="text-gray-500 text-xs mb-2">Capabilities</div>
              <div className="space-y-1.5">
                {selected.capabilities.map((cap) => (
                  <div key={cap} className="flex items-start gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Last action */}
            <div className="bg-gray-900/60 rounded-lg px-4 py-3">
              <div className="text-gray-500 text-xs mb-1">Last Action</div>
              <div className="text-gray-300 text-sm">{selected.lastAction}</div>
            </div>

            {/* Self-task badge */}
            {selected.selfTaskEnabled && (
              <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>
                  Self-task enabled &mdash; operates autonomously without
                  approval
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAgentBrowserTab;
