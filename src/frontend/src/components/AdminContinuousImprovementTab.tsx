import type React from "react";
import { useEffect, useState } from "react";
import { EXTENDED_AGENTS_5 } from "./AIManagerData_Agents5";

const weeklyImprovements = [
  {
    date: "Today",
    action:
      "Lead Conversion ANN retrained \u2014 accuracy improved from 87% to 89.3%",
    impact: "High",
  },
  {
    date: "Yesterday",
    action: "Enquiry auto-response latency reduced from 4.2min to 1.8min",
    impact: "High",
  },
  {
    date: "2 days ago",
    action:
      "WhatsApp sequence optimized \u2014 3-touch outperforms 5-touch for investors",
    impact: "Medium",
  },
  {
    date: "3 days ago",
    action:
      "NRI agent context window expanded \u2014 12% recommendation accuracy improvement",
    impact: "Medium",
  },
  {
    date: "5 days ago",
    action:
      "Property valuation ANN retrained on 340 new transactions \u2014 MAPE improved 0.8%",
    impact: "High",
  },
];

const AdminContinuousImprovementTab: React.FC = () => {
  const ciAgents = EXTENDED_AGENTS_5.filter(
    (a) => a.tier === "continuous-improvement",
  );
  const [systemHealth, setSystemHealth] = useState(98.3);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth((prev) =>
        Math.min(99.9, +(prev + (Math.random() * 0.1 - 0.05)).toFixed(1)),
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2
          className="text-xl font-bold text-[#c9a84c]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Continuous Self-Improvement
        </h2>
        <p className="text-gray-400 text-sm">
          {ciAgents.length} AI agents continuously learning, retraining, and
          improving the entire MSTC AI system
        </p>
      </div>

      <div className="bg-gradient-to-r from-green-900/20 to-gray-900/60 border border-green-500/20 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-green-400 font-semibold text-sm">
              System Health Score
            </div>
            <div className="text-gray-500 text-xs">Continuously improving</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-400">
              {systemHealth.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">/ 100</div>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-700/40 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-500 to-[#c9a84c] transition-all duration-1000"
            style={{ width: `${systemHealth}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Improvement Agents",
            value: String(ciAgents.length),
            color: "#c9a84c",
          },
          { label: "Models Retrained", value: "12", color: "#27ae60" },
          { label: "Accuracy Improvements", value: "8", color: "#3498db" },
          { label: "Latency Reductions", value: "5", color: "#9b59b6" },
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

      <div className="bg-gray-900/60 border border-gray-700/40 rounded-xl p-4">
        <h3 className="text-white font-semibold text-sm mb-3">
          This Week&#39;s Improvements
        </h3>
        <div className="space-y-3">
          {weeklyImprovements.map((imp) => (
            <div key={imp.date} className="flex items-start gap-3">
              <div className="text-gray-600 text-xs w-20 flex-shrink-0">
                {imp.date}
              </div>
              <p className="text-gray-300 text-xs flex-1">{imp.action}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  imp.impact === "High"
                    ? "text-green-400 bg-green-900/20"
                    : "text-blue-400 bg-blue-900/20"
                }`}
              >
                {imp.impact}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold text-sm mb-3">
          Continuous Improvement Agents ({ciAgents.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {ciAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-gray-900/60 border border-gray-700/30 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-[#c9a84c] text-xs font-medium truncate">
                  {agent.name}
                </div>
                <span className="text-green-400 text-xs ml-1 flex-shrink-0">
                  {agent.performanceScore}%
                </span>
              </div>
              <div className="text-gray-500 text-xs truncate">
                {agent.lastAction}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center flex-shrink-0">
          <div className="w-3 h-3 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        </div>
        <div>
          <div className="text-[#c9a84c] font-semibold text-sm">
            System is continuously learning and improving
          </div>
          <div className="text-gray-500 text-xs">
            All 808 AI agents improve daily through feedback loops, retraining,
            and performance optimization
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContinuousImprovementTab;
