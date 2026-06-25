import type React from "react";
import { useEffect, useState } from "react";
import { EXTENDED_AGENTS_5 } from "./AIManagerData_Agents5";
import { AUTOMATION_CAMPAIGNS } from "./AIManagerData_Extended";

interface Campaign {
  id: string;
  name: string;
  status: string;
  sentCount: number;
  openRate: number;
  responseRate: number;
  agent: string;
}

const AdminAutomationCenterTab: React.FC = () => {
  const automationAgents = EXTENDED_AGENTS_5.filter(
    (a) => a.tier === "automation",
  );
  const [triggerFeed, setTriggerFeed] = useState<
    { time: string; action: string }[]
  >([
    {
      time: "09:58:34",
      action:
        "Price drop alert fired \u2014 3 matched buyers notified for Bopal 3BHK",
    },
    {
      time: "09:55:12",
      action: "Enquiry auto-response sent \u2014 Lead from SG Highway form",
    },
    {
      time: "09:52:47",
      action: "New listing alert fired \u2014 8 matched buyers notified",
    },
    {
      time: "09:49:23",
      action: "Re-engagement sequence Day 7 sent to 23 dormant leads",
    },
    {
      time: "09:45:11",
      action: "Birthday campaign sent \u2014 5 client birthdays today",
    },
  ]);

  useEffect(() => {
    const actions = [
      "WhatsApp follow-up sequence Day 3 sent to 12 leads",
      "Price drop alert: Satellite 2BHK \u2014 7 matched buyers notified",
      "New enquiry auto-response sent within 1.8 minutes",
      "Deal stage trigger: 2 leads moved to negotiation \u2014 legal checklist sent",
      "Festival campaign message scheduled for Navratri Day 1",
    ];
    let idx = 0;
    const interval = setInterval(() => {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      setTriggerFeed((prev) => [
        { time, action: actions[idx % actions.length] },
        ...prev.slice(0, 7),
      ]);
      idx++;
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Active Automations", value: "25", color: "#c9a84c" },
    { label: "Messages Sent Today", value: "847", color: "#27ae60" },
    { label: "Avg Response Rate", value: "23.4%", color: "#3498db" },
    {
      label: "Active Campaigns",
      value: String(AUTOMATION_CAMPAIGNS.length),
      color: "#9b59b6",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2
          className="text-xl font-bold text-[#c9a84c]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Automation Intelligence Center
        </h2>
        <p className="text-gray-400 text-sm">
          25 automation AI agents running all client outreach and workflow
          triggers autonomously
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
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

      <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-6 rounded-full bg-[#c9a84c] flex items-center justify-end px-1">
            <div className="w-4 h-4 rounded-full bg-white" />
          </div>
          <div>
            <div className="text-[#c9a84c] font-semibold text-sm">
              Autonomous Mode: ON
            </div>
            <div className="text-gray-500 text-xs">
              All 25 automation agents running without approval
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
          <span className="text-[#c9a84c] text-xs">Active</span>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold text-sm mb-3">
          Active Campaigns
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs border-b border-gray-700/40">
                <th className="pb-2">Campaign</th>
                <th className="pb-2">Sent</th>
                <th className="pb-2">Open %</th>
                <th className="pb-2">Response %</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {(AUTOMATION_CAMPAIGNS as Campaign[]).map((camp) => (
                <tr key={camp.id} className="border-b border-gray-800/40">
                  <td className="py-3 text-gray-200 text-xs font-medium">
                    {camp.name}
                  </td>
                  <td className="py-3 text-gray-400 text-xs">
                    {camp.sentCount.toLocaleString()}
                  </td>
                  <td className="py-3 text-[#c9a84c] text-xs">
                    {camp.openRate}%
                  </td>
                  <td className="py-3 text-green-400 text-xs">
                    {camp.responseRate}%
                  </td>
                  <td className="py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-400">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-900/60 border border-gray-700/40 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            Live Trigger Feed
          </h3>
          <div className="space-y-2">
            {triggerFeed.map((event) => (
              <div
                key={`${event.time}-${event.action}`}
                className="flex items-start gap-3 text-xs"
              >
                <span className="text-gray-600 flex-shrink-0 w-16">
                  {event.time}
                </span>
                <span className="text-gray-300">{event.action}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold text-sm mb-3">
            Automation Agents ({automationAgents.length})
          </h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {automationAgents.map((agent) => (
              <div
                key={agent.id}
                className="bg-gray-900/60 border border-gray-700/30 rounded-lg p-3 flex items-start justify-between"
              >
                <div className="min-w-0">
                  <div className="text-[#c9a84c] text-xs font-medium truncate">
                    {agent.name}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5 truncate">
                    {agent.lastAction}
                  </div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse ml-2 flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAutomationCenterTab;
