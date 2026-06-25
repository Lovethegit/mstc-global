import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Building2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const PROJECTS = [
  {
    id: 1,
    name: "Shyamal Cross Roads Tower",
    location: "Shyamal, Ahmedabad",
    consent: 78,
    stage: "Consent",
    timeline: "Mar 2026",
    fsi: 3.5,
    tdr: 0.5,
    developer: "Rajhans Group",
    units: 120,
    value: 180000000,
  },
  {
    id: 2,
    name: "Prahladnagar Redevelopment",
    location: "Prahlad Nagar",
    consent: 95,
    stage: "Approval",
    timeline: "Jan 2026",
    fsi: 4.0,
    tdr: 1.0,
    developer: "Own Initiative",
    units: 85,
    value: 250000000,
  },
  {
    id: 3,
    name: "Bopal Mixed-Use Project",
    location: "Bopal, Ahmedabad",
    consent: 45,
    stage: "Planning",
    timeline: "Dec 2026",
    fsi: 3.0,
    tdr: 0.75,
    developer: "Maple Infra",
    units: 200,
    value: 320000000,
  },
  {
    id: 4,
    name: "New Naroda Affordable Housing",
    location: "Naroda",
    consent: 100,
    stage: "Active",
    timeline: "Oct 2025",
    fsi: 2.5,
    tdr: 0.25,
    developer: "MSTC GLOBAL",
    units: 350,
    value: 280000000,
  },
  {
    id: 5,
    name: "Chandkheda IT Park",
    location: "Chandkheda",
    consent: 100,
    stage: "Completed",
    timeline: "Jun 2025",
    fsi: 3.5,
    tdr: 0.5,
    developer: "Tech Ventures",
    units: 0,
    value: 450000000,
  },
];

const STAGE_COLORS: Record<string, string> = {
  Planning: "bg-gray-800/30 text-muted-foreground border-border",
  Consent: "bg-yellow-900/20 text-yellow-300 border-yellow-800/30",
  Approval: "bg-blue-900/20 text-blue-300 border-blue-800/30",
  Active: "bg-green-900/20 text-green-300 border-green-800/30",
  Completed: "bg-gold-800/20 text-gold-300 border-gold-700/30",
};

export default function RedevelopmentPage() {
  const [fsiArea, setFsiArea] = useState("");
  const [fsiRate, setFsiRate] = useState("3.5");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fsiResult = fsiArea
    ? (Number.parseFloat(fsiArea) * Number.parseFloat(fsiRate)).toFixed(0)
    : null;

  return (
    <SecureAppGate appName="Redevelopment Tracker">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="redevelopment.page"
      >
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gold-400" />
            <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
              Redevelopment Tracker
            </h1>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {
                label: "Active Projects",
                value: PROJECTS.filter(
                  (p) => p.stage === "Active" || p.stage === "Approval",
                ).length,
                color: "text-green-400",
              },
              {
                label: "Total Units",
                value: PROJECTS.reduce((s, p) => s + p.units, 0),
                color: "text-gold-400",
              },
              {
                label: "Total Value",
                value: `₹${(PROJECTS.reduce((s, p) => s + p.value, 0) / 10000000).toFixed(0)}Cr`,
                color: "text-blue-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-gold-800/30 bg-card p-3 text-center"
              >
                <p className={`font-serif text-xl font-bold ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="space-y-3 mb-6">
            {PROJECTS.map((proj, i) => (
              <div
                key={proj.id}
                className="rounded-xl border border-gold-800/30 bg-card"
                data-ocid={`redevelopment.item.${i + 1}`}
              >
                <button
                  type="button"
                  className="w-full px-4 py-3 flex items-center justify-between gap-2 text-left"
                  onClick={() =>
                    setExpandedId(expandedId === proj.id ? null : proj.id)
                  }
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {proj.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {proj.location} • {proj.timeline}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs border shrink-0 ${STAGE_COLORS[proj.stage] ?? ""}`}
                    >
                      {proj.stage}
                    </Badge>
                  </div>
                  {expandedId === proj.id ? (
                    <ChevronUp className="w-4 h-4 text-gold-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gold-600 shrink-0" />
                  )}
                </button>

                {expandedId === proj.id && (
                  <div className="px-4 pb-4 border-t border-gold-800/20 pt-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      {[
                        { label: "Consent", value: `${proj.consent}%` },
                        { label: "FSI", value: proj.fsi },
                        { label: "TDR", value: proj.tdr },
                        { label: "Developer", value: proj.developer },
                      ].map((d) => (
                        <div
                          key={d.label}
                          className="rounded-lg bg-background/50 p-2"
                        >
                          <p className="text-xs text-muted-foreground">
                            {d.label}
                          </p>
                          <p className="text-sm font-medium text-foreground mt-0.5">
                            {d.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    {/* Consent Progress */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">
                          Consent Progress
                        </span>
                        <span className="text-gold-400">{proj.consent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-obsidian-700/50">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-gold-600 to-gold-400"
                          style={{ width: `${proj.consent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* FSI/TDR Calculator */}
          <div className="rounded-xl border border-gold-800/30 bg-card p-4">
            <h3 className="font-serif font-semibold text-foreground mb-3">
              FSI / TDR Calculator
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gold-600 block mb-1">
                  Plot Area (sqm)
                </label>
                <input
                  type="number"
                  value={fsiArea}
                  onChange={(e) => setFsiArea(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                  data-ocid="redevelopment.fsi_area_input"
                />
              </div>
              <div>
                <label className="text-xs text-gold-600 block mb-1">
                  FSI Rate
                </label>
                <input
                  type="number"
                  value={fsiRate}
                  onChange={(e) => setFsiRate(e.target.value)}
                  step="0.5"
                  className="w-full px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                  data-ocid="redevelopment.fsi_rate_input"
                />
              </div>
            </div>
            {fsiResult && (
              <div className="rounded-lg bg-gold-700/10 border border-gold-700/30 p-3 text-center">
                <p className="text-xs text-gold-600">Buildable Area</p>
                <p className="font-serif text-2xl font-bold text-gold-400">
                  {Number.parseFloat(fsiResult).toLocaleString()} sqm
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SecureAppGate>
  );
}
