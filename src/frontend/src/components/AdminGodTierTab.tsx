import type React from "react";
import { useEffect, useState } from "react";
import { EXTENDED_AGENTS } from "./AIManagerData_Extended";

const dailyBriefItems = [
  {
    type: "lead",
    icon: "⚡",
    title: "3 Hot Leads — Action Today",
    desc: "Patel family (NRI, ₹2.1Cr budget) — 78% probability this week. Shah investor — 3 properties shortlisted. Mehta first-time buyer — pre-approval letter ready.",
  },
  {
    type: "market",
    icon: "📈",
    title: "Market Signal: Chandkheda Breaking Out",
    desc: "IT park approval driving 12% demand increase. 5 new enquiries since yesterday. Recommend adding 3 new listings in corridor.",
  },
  {
    type: "alert",
    icon: "⚠️",
    title: "RERA Deadline Alert",
    desc: "Project GP-5612 possession compliance due in 7 days. Client has been notified. Legal checklist issued.",
  },
  {
    type: "opportunity",
    icon: "💡",
    title: "NRI Campaign Opportunity",
    desc: "Dubai interest rate cut driving NRI India investment interest. 28% increase in NRI enquiries this week. Launch targeted campaign.",
  },
  {
    type: "performance",
    icon: "🎯",
    title: "Platform Milestone: 1,000 Active Leads",
    desc: "All-time high in active lead pipeline. Conversion funnel performing at 92% of Q1 projections. Team at 87% capacity.",
  },
];

const coordTimeline = [
  {
    time: "09:45",
    agent: "MSTC Sovereign Intelligence",
    action:
      "Morning brief generated — 5 insights, 3 alerts distributed to all Command AIs",
  },
  {
    time: "09:38",
    agent: "Platform Consciousness AI",
    action:
      "Property portal performance optimized — mobile LCP improved to 1.8s",
  },
  {
    time: "09:21",
    agent: "Supreme Client Intelligence AI",
    action:
      "23 new enquiries scored — 3 flagged as high-priority for immediate engagement",
  },
  {
    time: "09:12",
    agent: "Omniscient Market AI",
    action:
      "Chandkheda micro-market signal detected — all 5 locality agents notified",
  },
  {
    time: "08:55",
    agent: "Empire Architect AI",
    action:
      "Dubai expansion strategy updated — NRI interest rate impact analyzed",
  },
];

const empireStats = [
  { label: "Total AI Agents", value: "808+", color: "#9b59b6" },
  { label: "Active Agents", value: "808", color: "#27ae60" },
  { label: "Tasks Today", value: "12,847", color: "#c9a84c" },
  { label: "Autonomous Actions", value: "847", color: "#3498db" },
];

const AdminGodTierTab: React.FC = () => {
  const godAgents = EXTENDED_AGENTS.filter((a) => a.tier === "god");
  const [activeAlert, setActiveAlert] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setActiveAlert((prev) => (prev + 1) % dailyBriefItems.length),
      6000,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4" data-ocid="god-tier.panel">
      {/* Header */}
      <div>
        <h2
          className="text-2xl font-bold text-[#c9a84c]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          God Tier Intelligence
        </h2>
        <p className="text-gray-400 text-sm">
          The 5 apex intelligence systems — complete awareness of all 808
          agents, every client, and every decision
        </p>
      </div>

      {/* Empire Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {empireStats.map((s) => (
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

      {/* 5 God Tier Agents */}
      <div className="space-y-3">
        {godAgents.map((agent) => (
          <div
            key={agent.id}
            className="bg-gradient-to-r from-purple-900/20 to-gray-900/60 border border-purple-500/20 rounded-2xl p-5"
            data-ocid={`god-tier.item.${agent.id}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-300 font-semibold">
                    GOD TIER
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
                  {agent.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {agent.description}
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-2xl font-bold text-purple-300">
                  {agent.performanceScore}%
                </div>
                <div className="text-gray-600 text-xs">performance</div>
                <div className="text-gray-500 text-xs mt-1">
                  {agent.tasksCompleted.toLocaleString()} tasks
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {agent.capabilities.slice(0, 4).map((cap) => (
                <span
                  key={cap}
                  className="text-xs bg-purple-900/20 border border-purple-700/30 rounded-lg px-2 py-0.5 text-purple-200"
                >
                  {cap}
                </span>
              ))}
            </div>

            {agent.currentTask && (
              <div className="mt-3 bg-purple-900/10 rounded-lg px-3 py-2 text-xs text-purple-300 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse flex-shrink-0" />
                Currently: {agent.currentTask}
              </div>
            )}

            <div className="mt-2 text-gray-600 text-xs">
              Last action: {agent.lastAction}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Brief */}
        <div
          className="bg-gray-900/60 border border-[#c9a84c]/20 rounded-xl p-4"
          data-ocid="god-tier.daily-brief.panel"
        >
          <h3 className="text-[#c9a84c] font-semibold text-sm mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
            Sovereign Intelligence Daily Brief
          </h3>
          <div className="space-y-2 mb-4">
            {dailyBriefItems.map((item, i) => (
              <button
                key={item.type}
                type="button"
                onClick={() => setActiveAlert(i)}
                className={`w-full text-left p-3 rounded-xl cursor-pointer transition-all border ${
                  i === activeAlert
                    ? "bg-[#c9a84c]/10 border-[#c9a84c]/30"
                    : "bg-gray-800/30 border-gray-700/20 hover:border-gray-600/40"
                }`}
                data-ocid={`god-tier.brief.item.${i + 1}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-white text-sm font-medium">
                    {item.title}
                  </span>
                </div>
                {i === activeAlert && (
                  <p className="text-gray-400 text-xs mt-2 ml-6">{item.desc}</p>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 justify-center">
            {dailyBriefItems.map((_, i) => (
              <button
                key={dailyBriefItems[i].type}
                type="button"
                aria-label={`View brief item ${i + 1}`}
                onClick={() => setActiveAlert(i)}
                className="w-1.5 h-1.5 rounded-full cursor-pointer transition-all"
                style={{
                  backgroundColor: i === activeAlert ? "#c9a84c" : "#374151",
                }}
              />
            ))}
          </div>
        </div>

        {/* Coordination Timeline */}
        <div
          className="bg-gray-900/60 border border-gray-700/40 rounded-xl p-4"
          data-ocid="god-tier.timeline.panel"
        >
          <h3 className="text-white font-semibold text-sm mb-3">
            God Tier Coordination Timeline
          </h3>
          <div className="space-y-3">
            {coordTimeline.map((event) => (
              <div key={event.time} className="flex items-start gap-3">
                <div className="flex flex-col items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                  {coordTimeline.indexOf(event) < coordTimeline.length - 1 && (
                    <div className="w-px h-6 bg-gray-700/60 mt-1" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-gray-600 text-xs">{event.time}</div>
                  <div className="text-purple-300 text-xs font-medium">
                    {event.agent}
                  </div>
                  <div className="text-gray-400 text-xs mt-0.5">
                    {event.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGodTierTab;
