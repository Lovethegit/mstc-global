import type React from "react";
import { useState } from "react";
import { EXTENDED_AGENTS_5 } from "./AIManagerData_Agents5";
import { EXPANSION_TARGETS } from "./AIManagerData_Extended";
import type { ExpansionTarget } from "./AIManagerData_Extended";

const AdminExpansionHubTab: React.FC = () => {
  const expansionAgents = EXTENDED_AGENTS_5.filter(
    (a) => a.tier === "expansion",
  );
  const [selected, setSelected] = useState<ExpansionTarget | null>(null);

  const scoreColor = (score: number) =>
    score >= 8 ? "#27ae60" : score >= 7 ? "#c9a84c" : "#e74c3c";

  return (
    <div className="space-y-4">
      <div>
        <h2
          className="text-xl font-bold text-[#c9a84c]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Innovation & Expansion Hub
        </h2>
        <p className="text-gray-400 text-sm">
          Strategic expansion intelligence for 12 target markets across India
          and globally
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Expansion Targets",
            value: String(EXPANSION_TARGETS.length),
            color: "#c9a84c",
          },
          {
            label: "High Priority",
            value: String(
              EXPANSION_TARGETS.filter(
                (t: ExpansionTarget) => t.opportunityScore >= 8,
              ).length,
            ),
            color: "#27ae60",
          },
          {
            label: "International",
            value: String(
              EXPANSION_TARGETS.filter(
                (t: ExpansionTarget) => t.country !== "India",
              ).length,
            ),
            color: "#3498db",
          },
          {
            label: "Expansion AIs",
            value: String(expansionAgents.length),
            color: "#9b59b6",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-gray-900/60 border border-gray-700/40 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(EXPANSION_TARGETS as ExpansionTarget[]).map((target) => (
          <div
            key={target.id}
            onClick={() => setSelected(target)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setSelected(target);
            }}
            role="button"
            tabIndex={0}
            className="bg-gray-900/60 border border-gray-700/30 rounded-xl p-4 cursor-pointer hover:border-[#c9a84c]/40 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-white font-bold text-sm">{target.city}</h3>
                <p className="text-gray-500 text-xs">
                  {target.country} &middot; Entry: {target.timeline}
                </p>
              </div>
              <div className="text-right">
                <div
                  className="text-lg font-bold"
                  style={{ color: scoreColor(target.opportunityScore) }}
                >
                  {target.opportunityScore}/10
                </div>
                <div className="text-xs text-gray-600">Opportunity</div>
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-2 line-clamp-2">
              {target.strategy}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 truncate">
                {target.marketSize}
              </span>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                <span className="text-[#c9a84c]">
                  AI: {target.aiReadiness}/10
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-white font-semibold text-sm mb-3">
          Expansion Intelligence Agents ({expansionAgents.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {expansionAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-gray-900/60 border border-gray-700/30 rounded-lg p-3"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-[#c9a84c] text-xs font-medium truncate">
                    {agent.name}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5 truncate">
                    {agent.lastAction}
                  </div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse ml-2 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelected(null);
          }}
          role="presentation"
        >
          <div
            className="bg-[#06090f] border border-gray-700/60 rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3
                  className="text-[#c9a84c] text-xl font-bold"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {selected.city}
                </h3>
                <p className="text-gray-400 text-sm">
                  {selected.country} &middot; Target Entry: {selected.timeline}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-gray-500 hover:text-white text-2xl leading-none"
              >
                &#10005;
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-900/60 rounded-lg p-3">
                <div
                  className="text-2xl font-bold"
                  style={{ color: scoreColor(selected.opportunityScore) }}
                >
                  {selected.opportunityScore}/10
                </div>
                <div className="text-xs text-gray-500">Opportunity Score</div>
              </div>
              <div className="bg-gray-900/60 rounded-lg p-3">
                <div className="text-2xl font-bold text-[#c9a84c]">
                  {selected.aiReadiness}/10
                </div>
                <div className="text-xs text-gray-500">AI Readiness</div>
              </div>
            </div>
            <div className="bg-gray-900/60 rounded-lg p-3 mb-3">
              <div className="text-gray-500 text-xs mb-1">Market Size</div>
              <div className="text-white font-semibold text-sm">
                {selected.marketSize}
              </div>
            </div>
            <div className="bg-gray-900/60 rounded-lg p-3">
              <div className="text-gray-500 text-xs mb-1">Entry Strategy</div>
              <div className="text-gray-300 text-sm">{selected.strategy}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExpansionHubTab;
