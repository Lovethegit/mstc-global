import type React from "react";
import { useState } from "react";
import { LOCALITY_DATA } from "./AIManagerData_Extended";
import type { LocalityData } from "./AIManagerData_Extended";

const gradeColors: Record<string, string> = {
  A: "#27ae60",
  B: "#c9a84c",
  C: "#e67e22",
  D: "#e74c3c",
};

const AdminLocalityIntelligenceTab: React.FC = () => {
  const [selected, setSelected] = useState<LocalityData | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h2
          className="text-xl font-bold text-[#c9a84c]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Locality Intelligence
        </h2>
        <p className="text-gray-400 text-sm">
          11 Ahmedabad localities monitored by 55 dedicated AI agents — 5 agents
          per locality
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Grade A Localities",
            value: String(
              LOCALITY_DATA.filter((l) => l.investmentGrade === "A").length,
            ),
            color: "#27ae60",
          },
          {
            label: "Grade B Localities",
            value: String(
              LOCALITY_DATA.filter((l) => l.investmentGrade === "B").length,
            ),
            color: "#c9a84c",
          },
          {
            label: "Grade C Localities",
            value: String(
              LOCALITY_DATA.filter((l) => l.investmentGrade === "C").length,
            ),
            color: "#e67e22",
          },
          { label: "Locality AI Agents", value: "55", color: "#3498db" },
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
        {LOCALITY_DATA.map((locality) => (
          <div
            key={locality.id}
            onClick={() => setSelected(locality)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setSelected(locality);
            }}
            role="button"
            tabIndex={0}
            className="bg-gray-900/60 border border-gray-700/30 rounded-xl p-4 cursor-pointer hover:border-[#c9a84c]/40 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-white font-bold text-sm">
                  {locality.name}
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  {locality.currentPriceRange}
                </p>
              </div>
              <div
                className="text-lg font-bold px-2.5 py-0.5 rounded-lg text-white"
                style={{
                  backgroundColor: `${gradeColors[locality.investmentGrade]}33`,
                  color: gradeColors[locality.investmentGrade],
                }}
              >
                {locality.investmentGrade}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: "1Y", value: `+${locality.appreciationForecast1Y}%` },
                { label: "3Y", value: `+${locality.appreciationForecast3Y}%` },
                { label: "5Y", value: `+${locality.appreciationForecast5Y}%` },
              ].map((f) => (
                <div
                  key={f.label}
                  className="bg-gray-800/40 rounded-lg p-2 text-center"
                >
                  <div className="text-[#c9a84c] font-bold text-sm">
                    {f.value}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {f.label} Forecast
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Lifestyle Score:{" "}
                <span className="text-[#c9a84c]">
                  {locality.lifestyleScore}/10
                </span>
              </span>
              <span className="text-gray-600">
                {locality.infrastructureProjects.length} infra projects
              </span>
            </div>
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
              <div>
                <h3
                  className="text-[#c9a84c] text-xl font-bold"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {selected.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {selected.currentPriceRange}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="text-lg font-bold px-2.5 py-0.5 rounded-lg"
                  style={{
                    backgroundColor: `${gradeColors[selected.investmentGrade]}33`,
                    color: gradeColors[selected.investmentGrade],
                  }}
                >
                  Grade {selected.investmentGrade}
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
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                {
                  label: "1-Year Forecast",
                  value: `+${selected.appreciationForecast1Y}%`,
                },
                {
                  label: "3-Year Forecast",
                  value: `+${selected.appreciationForecast3Y}%`,
                },
                {
                  label: "5-Year Forecast",
                  value: `+${selected.appreciationForecast5Y}%`,
                },
              ].map((f) => (
                <div
                  key={f.label}
                  className="bg-gray-900/60 rounded-lg p-3 text-center"
                >
                  <div className="text-[#c9a84c] text-xl font-bold">
                    {f.value}
                  </div>
                  <div className="text-gray-500 text-xs">{f.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-gray-900/60 rounded-lg p-4 mb-4">
              <div className="text-gray-500 text-xs mb-2">
                Infrastructure Projects
              </div>
              <div className="space-y-1">
                {selected.infrastructureProjects.map((p) => (
                  <div key={p} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] flex-shrink-0" />
                    <span className="text-gray-300">{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-900/60 rounded-lg p-3">
              <span className="text-gray-400 text-sm">Lifestyle Score</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((dotIdx) => (
                    <div
                      key={`lifestyle-dot-${dotIdx}`}
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          dotIdx < selected.lifestyleScore
                            ? "#c9a84c"
                            : "#374151",
                      }}
                    />
                  ))}
                </div>
                <span className="text-[#c9a84c] font-bold text-sm">
                  {selected.lifestyleScore}/10
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLocalityIntelligenceTab;
