import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpCircle,
  Bot,
  CheckCircle,
  Clock,
  RotateCcw,
  User,
} from "lucide-react";

type DeployStatus = "Live" | "Previous" | "Rolled Back" | "Failed";

interface Version {
  version: string;
  deployedAt: string;
  deployedBy: string;
  byType: "human" | "ai";
  changes: number;
  status: DeployStatus;
  notes: string;
}

const VERSIONS: Version[] = [
  {
    version: "v2.4.1",
    deployedAt: "Today, 09:14 AM",
    deployedBy: "Aria AI",
    byType: "ai",
    changes: 8,
    status: "Live",
    notes: "Analytics page added, minor bug fixes",
  },
  {
    version: "v2.4.0",
    deployedAt: "Yesterday, 3:45 PM",
    deployedBy: "Love Parekh",
    byType: "human",
    changes: 24,
    status: "Previous",
    notes: "Security app, legalities app, observer view",
  },
  {
    version: "v2.3.9",
    deployedAt: "May 20, 11:22 AM",
    deployedBy: "Aria AI",
    byType: "ai",
    changes: 5,
    status: "Previous",
    notes: "WhatsApp API integration fix",
  },
  {
    version: "v2.3.8",
    deployedAt: "May 18, 4:00 PM",
    deployedBy: "Aria AI",
    byType: "ai",
    changes: 12,
    status: "Previous",
    notes: "CRM kanban view, mobile fixes",
  },
  {
    version: "v2.3.7",
    deployedAt: "May 15, 10:30 AM",
    deployedBy: "Love Parekh",
    byType: "human",
    changes: 31,
    status: "Previous",
    notes: "AI Universe, Staff Directory, Command Center",
  },
  {
    version: "v2.3.6",
    deployedAt: "May 12, 2:18 PM",
    deployedBy: "Aria AI",
    byType: "ai",
    changes: 4,
    status: "Previous",
    notes: "Performance optimizations, lazy loading",
  },
  {
    version: "v2.3.5",
    deployedAt: "May 10, 9:00 AM",
    deployedBy: "Aria AI",
    byType: "ai",
    changes: 7,
    status: "Previous",
    notes: "News API integration, live feed",
  },
  {
    version: "v2.3.4",
    deployedAt: "May 8, 5:45 PM",
    deployedBy: "Love Parekh",
    byType: "human",
    changes: 19,
    status: "Previous",
    notes: "Property portal, RERA checklist tools",
  },
  {
    version: "v2.3.3",
    deployedAt: "May 5, 11:00 AM",
    deployedBy: "Aria AI",
    byType: "ai",
    changes: 3,
    status: "Rolled Back",
    notes: "Hotfix for map rendering issue (rolled back)",
  },
  {
    version: "v2.3.2",
    deployedAt: "May 2, 8:30 AM",
    deployedBy: "Aria AI",
    byType: "ai",
    changes: 6,
    status: "Previous",
    notes: "Finance tools, EMI calculator fix",
  },
];

const STATUS_STYLE: Record<DeployStatus, string> = {
  Live: "bg-green-900/40 text-green-300 border-green-700/40",
  Previous: "bg-muted/30 text-muted-foreground border-border",
  "Rolled Back": "bg-red-900/30 text-red-300 border-red-700/40",
  Failed: "bg-red-900/50 text-red-200 border-red-600/50",
};

export default function DeploymentsPage() {
  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1
              className="text-2xl font-bold text-gold-400"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Deployment Manager
            </h1>
            <p className="text-sm text-muted-foreground">
              Version history, rollbacks & deployment stats
            </p>
          </div>

          {/* Deployment Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Deploys This Month",
                value: "24",
                icon: ArrowUpCircle,
                color: "text-green-400",
              },
              {
                label: "Failed Deploys",
                value: "0",
                icon: CheckCircle,
                color: "text-gold-400",
              },
              {
                label: "Avg Deploy Time",
                value: "3.2 min",
                icon: Clock,
                color: "text-blue-400",
              },
              {
                label: "Rollbacks",
                value: "1",
                icon: RotateCcw,
                color: "text-amber-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-card/80 border border-gold-800/30 rounded-xl p-4"
                data-ocid={`deploy.stat.${s.label.toLowerCase().replace(/ /g, "_")}`}
              >
                <s.icon className={`w-5 h-5 mb-2 ${s.color}`} />
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Version Table */}
          <div className="bg-card/80 border border-gold-800/30 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gold-800/20">
              <h2 className="font-bold text-gold-300">Version History</h2>
            </div>
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm"
                data-ocid="deploy.versions.table"
              >
                <thead>
                  <tr className="border-b border-gold-800/30 bg-[#06090f]">
                    {[
                      "Version",
                      "Deployed At",
                      "Deployed By",
                      "Changes",
                      "Notes",
                      "Status",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-4 text-xs text-muted-foreground font-medium whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {VERSIONS.map((v, i) => (
                    <tr
                      key={v.version}
                      className={`border-b border-gold-800/10 transition-colors ${
                        v.status === "Live"
                          ? "bg-gold-900/15 hover:bg-gold-900/20"
                          : "hover:bg-gold-900/10"
                      }`}
                      data-ocid={`deploy.version.item.${i + 1}`}
                    >
                      <td className="py-3 px-4">
                        <span
                          className={`font-mono font-bold text-sm ${v.status === "Live" ? "text-gold-400" : "text-foreground"}`}
                        >
                          {v.version}
                        </span>
                        {v.status === "Live" && (
                          <span className="ml-2 text-[9px] bg-green-900/40 text-green-300 border border-green-700/40 rounded-full px-1.5 py-0.5">
                            CURRENT
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {v.deployedAt}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {v.byType === "ai" ? (
                            <Bot className="w-3.5 h-3.5 text-purple-400" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-gold-400" />
                          )}
                          <span className="text-xs text-foreground">
                            {v.deployedBy}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-gold-400 font-bold">
                          {v.changes}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground max-w-[200px] truncate">
                        {v.notes}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={`${STATUS_STYLE[v.status]} text-[10px]`}
                        >
                          {v.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {v.status !== "Live" && v.status !== "Failed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 border-gold-700/40 text-gold-400 hover:bg-gold-700/20"
                            data-ocid={`deploy.rollback_button.${i + 1}`}
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Rollback
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SecureAppGate>
  );
}
