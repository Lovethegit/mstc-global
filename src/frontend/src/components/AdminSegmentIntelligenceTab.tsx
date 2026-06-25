import type React from "react";
import { useState } from "react";
import { SEGMENT_DATA } from "./AIManagerData_Extended";
import type { SegmentData } from "./AIManagerData_Extended";

const segmentColors: Record<string, string> = {
  nri: "#3498db",
  hni: "#9b59b6",
  "first-time": "#27ae60",
  investors: "#c9a84c",
  corporate: "#e67e22",
  senior: "#e91e63",
};

const AdminSegmentIntelligenceTab: React.FC = () => {
  const [selected, setSelected] = useState<SegmentData | null>(null);

  const totalClients = SEGMENT_DATA.reduce((sum, s) => sum + s.totalClients, 0);

  return (
    <div className="space-y-4">
      <div>
        <h2
          className="text-xl font-bold text-[#c9a84c]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Client Segment Intelligence
        </h2>
        <p className="text-gray-400 text-sm">
          6 client segments with 48 dedicated AI agents (
          {totalClients.toLocaleString()} total clients)
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {SEGMENT_DATA.map((seg) => (
          <div
            key={seg.id}
            onClick={() => setSelected(seg)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setSelected(seg);
            }}
            role="button"
            tabIndex={0}
            className="bg-gray-900/60 border border-gray-700/30 rounded-xl p-3 cursor-pointer hover:border-[#c9a84c]/40 transition-all text-center"
          >
            <div className="text-2xl mb-1">{seg.icon}</div>
            <div className="text-white font-bold text-sm">{seg.name}</div>
            <div className="text-[#c9a84c] text-lg font-bold mt-1">
              {seg.totalClients.toLocaleString()}
            </div>
            <div className="text-gray-500 text-xs">clients</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SEGMENT_DATA.map((seg) => (
          <div
            key={seg.id}
            onClick={() => setSelected(seg)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setSelected(seg);
            }}
            role="button"
            tabIndex={0}
            className="bg-gray-900/60 border border-gray-700/30 rounded-xl p-4 cursor-pointer hover:border-[#c9a84c]/40 transition-all"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="text-xl">{seg.icon}</div>
              <div>
                <h3 className="text-white font-bold text-sm">{seg.name}</h3>
                <p className="text-gray-500 text-xs">
                  {seg.totalClients.toLocaleString()} clients
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-gray-800/40 rounded-lg p-2">
                <div
                  className="font-bold text-sm"
                  style={{ color: segmentColors[seg.id] ?? "#c9a84c" }}
                >
                  &#8377;{seg.avgDealSize}Cr
                </div>
                <div className="text-gray-600 text-xs">Avg Deal</div>
              </div>
              <div className="bg-gray-800/40 rounded-lg p-2">
                <div className="font-bold text-sm text-[#c9a84c]">
                  {seg.conversionRate}%
                </div>
                <div className="text-gray-600 text-xs">Conversion</div>
              </div>
            </div>

            <p className="text-gray-500 text-xs line-clamp-2">
              {seg.description}
            </p>
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelected(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelected(null);
          }}
          role="presentation"
        >
          <div
            className="bg-[#06090f] border border-gray-700/60 rounded-2xl p-6 max-w-lg w-full my-4"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{selected.icon}</div>
                <div>
                  <h3
                    className="text-[#c9a84c] text-xl font-bold"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {selected.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {selected.totalClients.toLocaleString()} clients &middot;{" "}
                    {selected.agents.length} dedicated AIs
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-gray-500 hover:text-white text-2xl leading-none"
                aria-label="Close"
              >
                &#10005;
              </button>
            </div>

            <p className="text-gray-300 text-sm mb-4">{selected.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-900/60 rounded-lg p-3">
                <div
                  className="text-2xl font-bold"
                  style={{ color: segmentColors[selected.id] ?? "#c9a84c" }}
                >
                  &#8377;{selected.avgDealSize}Cr
                </div>
                <div className="text-gray-500 text-xs">Avg Deal Size</div>
              </div>
              <div className="bg-gray-900/60 rounded-lg p-3">
                <div className="text-2xl font-bold text-[#c9a84c]">
                  {selected.conversionRate}%
                </div>
                <div className="text-gray-500 text-xs">Conversion Rate</div>
              </div>
            </div>

            <div className="bg-gray-900/60 rounded-lg p-4">
              <div className="text-gray-500 text-xs mb-2">
                Preferred Property Types
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.preferredPropertyTypes.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-gray-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSegmentIntelligenceTab;
