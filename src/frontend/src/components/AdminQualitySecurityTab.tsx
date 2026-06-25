import type React from "react";
import { EXTENDED_AGENTS_5 } from "./AIManagerData_Agents5";
import { QUALITY_METRICS } from "./AIManagerData_Extended";

const AdminQualitySecurityTab: React.FC = () => {
  const qualityAgents = EXTENDED_AGENTS_5.filter((a) => a.tier === "quality");
  const securityAgents = EXTENDED_AGENTS_5.filter(
    (a) => a.category === "Security",
  );

  return (
    <div className="space-y-4">
      <div>
        <h2
          className="text-xl font-bold text-[#c9a84c]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Quality & Security Intelligence
        </h2>
        <p className="text-gray-400 text-sm">
          {qualityAgents.length} quality AI agents + {securityAgents.length}{" "}
          security AI agents running continuous platform protection
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Platform Score",
            value: `${QUALITY_METRICS.platformScore}/100`,
            color: "#27ae60",
          },
          {
            label: "Uptime",
            value: `${QUALITY_METRICS.uptime}%`,
            color: "#27ae60",
          },
          {
            label: "PageSpeed",
            value: `${QUALITY_METRICS.pagespeedScore}/100`,
            color: "#c9a84c",
          },
          {
            label: "Accessibility",
            value: `${QUALITY_METRICS.accessibilityScore}/100`,
            color: "#3498db",
          },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-gray-900/60 border border-gray-700/40 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold" style={{ color: m.color }}>
              {m.value}
            </div>
            <div className="text-xs text-gray-500 mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <h3 className="text-green-400 font-semibold text-sm">
            Security Status: Normal &#8212; No Active Threats
          </h3>
        </div>
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            { level: "Critical", count: 0 },
            { level: "High", count: 0 },
            { level: "Medium", count: 2 },
            { level: "Low", count: 3 },
          ].map((t) => (
            <div key={t.level}>
              <div
                className={`text-xl font-bold ${
                  t.count === 0
                    ? "text-gray-600"
                    : t.level === "Medium"
                      ? "text-yellow-400"
                      : "text-blue-400"
                }`}
              >
                {t.count}
              </div>
              <div className="text-xs text-gray-500">{t.level}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h3 className="text-[#c9a84c] font-semibold text-sm mb-3">
            Quality Intelligence Agents ({qualityAgents.length})
          </h3>
          <div className="space-y-2">
            {qualityAgents.map((agent) => (
              <div
                key={agent.id}
                className="bg-gray-900/60 border border-gray-700/30 rounded-lg p-3 flex items-start justify-between"
              >
                <div className="min-w-0">
                  <div className="text-white text-xs font-medium">
                    {agent.name}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5 truncate">
                    {agent.lastAction}
                  </div>
                </div>
                <div className="text-green-400 text-xs ml-2 flex-shrink-0">
                  {agent.performanceScore}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-red-400 font-semibold text-sm mb-3">
            Security Intelligence Agents ({securityAgents.length})
          </h3>
          <div className="space-y-2">
            {securityAgents.map((agent) => (
              <div
                key={agent.id}
                className="bg-gray-900/60 border border-gray-700/30 rounded-lg p-3 flex items-start justify-between"
              >
                <div className="min-w-0">
                  <div className="text-white text-xs font-medium">
                    {agent.name}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5 truncate">
                    {agent.lastAction}
                  </div>
                </div>
                <div className="text-green-400 text-xs ml-2 flex-shrink-0">
                  {agent.performanceScore}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQualitySecurityTab;
