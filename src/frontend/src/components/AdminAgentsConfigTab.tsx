import {
  AI_AGENTS,
  getAgentSettings,
  getAgentUsage,
  saveAgentSettings,
} from "@/utils/aiAgents";
import { Bot, RotateCcw, Save } from "lucide-react";
import React, { useState } from "react";

export default function AdminAgentsConfigTab() {
  const usage = getAgentUsage();
  const existing = getAgentSettings();
  const [settings, setSettings] = useState<
    Record<string, { enabled: boolean; customPrompt: string }>
  >(() => {
    const s: Record<string, { enabled: boolean; customPrompt: string }> = {};
    for (const agent of AI_AGENTS) {
      s[agent.id] = existing[agent.id] ?? { enabled: true, customPrompt: "" };
    }
    return s;
  });
  const [saved, setSaved] = useState(false);

  function toggle(id: string) {
    setSettings((prev) => ({
      ...prev,
      [id]: { ...prev[id], enabled: !prev[id].enabled },
    }));
  }

  function setCustomPrompt(id: string, val: string) {
    setSettings((prev) => ({
      ...prev,
      [id]: { ...prev[id], customPrompt: val },
    }));
  }

  function reset(id: string) {
    setSettings((prev) => ({
      ...prev,
      [id]: { enabled: true, customPrompt: "" },
    }));
  }

  function saveAll() {
    saveAgentSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-yellow-400 font-playfair">
            AI Agents Configuration
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Enable, disable, and customize each AI specialist agent. Changes
            apply to all users.
          </p>
        </div>
        <button
          type="button"
          onClick={saveAll}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg font-medium text-sm hover:bg-yellow-400 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save All Settings"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {AI_AGENTS.map((agent) => {
          const s = settings[agent.id] ?? { enabled: true, customPrompt: "" };
          const uses = usage[agent.id] ?? 0;
          return (
            <div
              key={agent.id}
              className={`rounded-xl border p-4 space-y-3 transition-all ${
                s.enabled
                  ? "border-yellow-800/40 bg-white/5"
                  : "border-gray-700/40 bg-black/20 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{agent.icon}</span>
                  <div>
                    <p className="font-medium text-white text-sm">
                      {agent.name}
                    </p>
                    <p className="text-xs text-gray-400">{agent.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(agent.id)}
                  className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                    s.enabled ? "bg-yellow-500" : "bg-gray-600"
                  }`}
                  aria-label={s.enabled ? "Disable agent" : "Enable agent"}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      s.enabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  <span>{uses} uses</span>
                </div>
                <span className="text-gray-600">•</span>
                <span className="capitalize">{agent.domain}</span>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Custom personality note (optional)
                </label>
                <textarea
                  value={s.customPrompt}
                  onChange={(e) => setCustomPrompt(agent.id, e.target.value)}
                  placeholder="E.g. Always respond in Gujarati. Focus on commercial properties only."
                  rows={2}
                  className="w-full text-xs bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-yellow-600 resize-none"
                />
              </div>

              <button
                type="button"
                onClick={() => reset(agent.id)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-yellow-400 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to default
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
