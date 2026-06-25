import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, FileText, Plus } from "lucide-react";
import { useState } from "react";

const RERA_PROJECTS = [
  {
    id: 1,
    name: "Rajhans Towers Phase 2",
    regNo: "RAJ/GJ/G008/020345",
    promoter: "Rajhans Group",
    status: "Registered",
    deadline: "2026-03-15",
    complaints: 2,
    daysLeft: 290,
  },
  {
    id: 2,
    name: "Prahladnagar Residency",
    regNo: "RAJ/GJ/P012/018762",
    promoter: "MSTC GLOBAL",
    status: "Registered",
    deadline: "2025-12-31",
    complaints: 0,
    daysLeft: 219,
  },
  {
    id: 3,
    name: "SG Highway Corporate Park",
    regNo: "RAJ/GJ/G004/021109",
    promoter: "Tech Ventures",
    status: "Extension Applied",
    deadline: "2025-08-31",
    complaints: 1,
    daysLeft: 97,
  },
  {
    id: 4,
    name: "Bopal Green Residences",
    regNo: "RAJ/GJ/B007/019884",
    promoter: "Maple Infra",
    status: "Registered",
    deadline: "2026-06-30",
    complaints: 0,
    daysLeft: 397,
  },
  {
    id: 5,
    name: "Naroda Affordable Homes",
    regNo: "RAJ/GJ/N001/022341",
    promoter: "MSTC GLOBAL",
    status: "Lapsed",
    deadline: "2025-05-01",
    complaints: 5,
    daysLeft: -25,
  },
];

const STATUS_COLORS: Record<string, string> = {
  Registered: "bg-green-900/20 text-green-300 border-green-800/30",
  "Extension Applied": "bg-yellow-900/20 text-yellow-300 border-yellow-800/30",
  Lapsed: "bg-red-900/20 text-red-300 border-red-800/30",
};

export default function ReraAdminPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <SecureAppGate appName="RERA Compliance Hub">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="rera_admin.page"
      >
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold-400" />
              <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
                RERA Compliance Hub
              </h1>
            </div>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
              data-ocid="rera_admin.add_button"
            >
              <Plus className="w-3.5 h-3.5" /> Add Project
            </button>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {
                label: "Total Projects",
                value: RERA_PROJECTS.length,
                color: "text-gold-400",
              },
              {
                label: "Active Complaints",
                value: RERA_PROJECTS.reduce((s, p) => s + p.complaints, 0),
                color: "text-red-400",
              },
              {
                label: "Expiring <90 days",
                value: RERA_PROJECTS.filter(
                  (p) => p.daysLeft > 0 && p.daysLeft < 90,
                ).length,
                color: "text-yellow-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-gold-800/30 bg-card p-3 text-center"
              >
                <p className={`font-serif text-xl font-bold ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {RERA_PROJECTS.map((proj, i) => (
              <div
                key={proj.id}
                className="rounded-xl border border-gold-800/30 bg-card"
                data-ocid={`rera_admin.item.${i + 1}`}
              >
                <div className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {proj.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {proj.regNo}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs border shrink-0 ${STATUS_COLORS[proj.status] ?? ""}`}
                    >
                      {proj.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Promoter: {proj.promoter}</span>
                    <span>Deadline: {proj.deadline}</span>
                    {proj.complaints > 0 && (
                      <span className="flex items-center gap-1 text-red-400">
                        <AlertTriangle className="w-3 h-3" />
                        {proj.complaints} complaints
                      </span>
                    )}
                    {proj.complaints === 0 && (
                      <span className="flex items-center gap-1 text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        No complaints
                      </span>
                    )}
                  </div>
                  {proj.daysLeft > 0 && proj.daysLeft < 90 && (
                    <div className="mt-2 px-2 py-1 rounded bg-yellow-900/20 border border-yellow-800/30 text-xs text-yellow-300">
                      ⚠️ Expires in {proj.daysLeft} days — action required
                    </div>
                  )}
                  {proj.daysLeft < 0 && (
                    <div className="mt-2 px-2 py-1 rounded bg-red-900/20 border border-red-800/30 text-xs text-red-300">
                      ❌ Registration lapsed {Math.abs(proj.daysLeft)} days ago
                    </div>
                  )}
                </div>
                {proj.complaints > 0 && (
                  <div className="border-t border-gold-800/20">
                    <button
                      type="button"
                      className="w-full px-4 py-2 text-xs text-gold-600 hover:text-gold-400 text-left transition-colors"
                      onClick={() =>
                        setExpandedId(expandedId === proj.id ? null : proj.id)
                      }
                      data-ocid={`rera_admin.complaints_toggle.${i + 1}`}
                    >
                      {expandedId === proj.id ? "Hide" : "View"} Complaint
                      History
                    </button>
                    {expandedId === proj.id && (
                      <div className="px-4 pb-3 space-y-2">
                        {Array.from({ length: proj.complaints }, (_, ci) => (
                          <div
                            key={`complaint-${proj.id}-${ci}`}
                            className="text-xs text-muted-foreground bg-background/50 rounded-lg p-2"
                          >
                            Complaint #{ci + 1}: Buyer reported delay in
                            possession schedule. Status: Under review.
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SecureAppGate>
  );
}
