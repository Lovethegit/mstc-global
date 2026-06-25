import BackButton from "@/components/ui/BackButton";
import CloseButton from "@/components/ui/CloseButton";
import Modal from "@/components/ui/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ChevronDown,
  Clock,
  Play,
  RefreshCw,
  RotateCcw,
  Server,
  Terminal,
  Zap,
} from "lucide-react";
import { useState } from "react";

const DEPLOYMENTS = [
  {
    id: 1,
    version: "v55",
    date: "2026-05-28 14:32",
    by: "Aria (Chief AI)",
    status: "Success",
    duration: "2m 14s",
    changes: "Added 8 new app pages, routing updates, mobile responsive fixes",
  },
  {
    id: 2,
    version: "v54",
    date: "2026-05-27 10:18",
    by: "Aria (Chief AI)",
    status: "Success",
    duration: "2m 47s",
    changes: "Security enhancements, CSR dashboard, NGO hub improvements",
  },
  {
    id: 3,
    version: "v53",
    date: "2026-05-26 16:45",
    by: "Builder AI",
    status: "Success",
    duration: "1m 58s",
    changes:
      "Analytics admin page, market intelligence updates, competitor analysis",
  },
  {
    id: 4,
    version: "v52",
    date: "2026-05-25 11:20",
    by: "Aria (Chief AI)",
    status: "Success",
    duration: "3m 02s",
    changes: "Events admin, hospitality hub, calendar admin, tourism planner",
  },
  {
    id: 5,
    version: "v51",
    date: "2026-05-24 09:15",
    by: "Builder AI",
    status: "Success",
    duration: "2m 33s",
    changes: "CRM pipeline, lead manager, client portal enhancements",
  },
  {
    id: 6,
    version: "v50",
    date: "2026-05-23 15:00",
    by: "Deploy AI",
    status: "Success",
    duration: "2m 18s",
    changes: "AI Universe page, Staff Directory, Observer app improvements",
  },
  {
    id: 7,
    version: "v49",
    date: "2026-05-22 12:40",
    by: "Aria (Chief AI)",
    status: "Success",
    duration: "2m 55s",
    changes: "Legal Command center, 30 Legal AI integrations, policy manager",
  },
  {
    id: 8,
    version: "v48",
    date: "2026-05-21 08:30",
    by: "Builder AI",
    status: "Success",
    duration: "1m 42s",
    changes: "Finance desk calculators, tax module, billing system",
  },
  {
    id: 9,
    version: "v47",
    date: "2026-05-20 17:15",
    by: "Deploy AI",
    status: "Success",
    duration: "2m 28s",
    changes: "Security App with all 52 Security AIs, threat map integration",
  },
  {
    id: 10,
    version: "v46",
    date: "2026-05-19 13:55",
    by: "Aria (Chief AI)",
    status: "Success",
    duration: "3m 12s",
    changes:
      "Master Control, App Launcher, Executive Briefing complete rebuild",
  },
  {
    id: 11,
    version: "v45",
    date: "2026-05-18 10:00",
    by: "Builder AI",
    status: "Rolled Back",
    duration: "1m 30s",
    changes:
      "Experimental AI dashboard — rolled back due to performance issues",
  },
  {
    id: 12,
    version: "v44",
    date: "2026-05-17 14:22",
    by: "Deploy AI",
    status: "Success",
    duration: "2m 05s",
    changes: "Property portal improvements, RERA admin, redevelopment tracker",
  },
  {
    id: 13,
    version: "v43",
    date: "2026-05-16 09:48",
    by: "Builder AI",
    status: "Success",
    duration: "2m 38s",
    changes: "Tutorial AI system, observer access code management",
  },
  {
    id: 14,
    version: "v42",
    date: "2026-05-15 16:30",
    by: "Aria (Chief AI)",
    status: "Success",
    duration: "1m 52s",
    changes: "WhatsApp manager, notifications admin, campaigns studio",
  },
  {
    id: 15,
    version: "v41",
    date: "2026-05-14 11:10",
    by: "Deploy AI",
    status: "Success",
    duration: "2m 44s",
    changes: "Content studio, media library, SEO manager, blog improvements",
  },
  {
    id: 16,
    version: "v40",
    date: "2026-05-13 15:25",
    by: "Builder AI",
    status: "Success",
    duration: "2m 17s",
    changes: "App download center, PWA install, QR code generation",
  },
  {
    id: 17,
    version: "v39",
    date: "2026-05-12 08:45",
    by: "Aria (Chief AI)",
    status: "Success",
    duration: "3m 28s",
    changes: "Mobile responsive overhaul, sidebar X buttons, overlay fixes",
  },
  {
    id: 18,
    version: "v38",
    date: "2026-05-11 13:00",
    by: "Deploy AI",
    status: "Success",
    duration: "2m 01s",
    changes: "Sports admin, music hub, tourism planner, media tools",
  },
  {
    id: 19,
    version: "v37",
    date: "2026-05-10 10:30",
    by: "Builder AI",
    status: "Success",
    duration: "2m 22s",
    changes: "NGO hub, CSR dashboard, social impact tracker",
  },
  {
    id: 20,
    version: "v36",
    date: "2026-05-09 14:45",
    by: "Aria (Chief AI)",
    status: "Success",
    duration: "1m 58s",
    changes: "Chat widget improvements, callback button, privacy gate",
  },
];

const SERVICES = [
  {
    name: "Frontend (React)",
    status: "Healthy",
    version: "v55",
    uptime: "99.98%",
  },
  {
    name: "Backend Canister",
    status: "Healthy",
    version: "motoko-v2.1",
    uptime: "99.97%",
  },
  {
    name: "Auth Service",
    status: "Healthy",
    version: "IC-Auth-v3",
    uptime: "100%",
  },
  {
    name: "Storage Layer",
    status: "Healthy",
    version: "IC-Store-v2",
    uptime: "99.99%",
  },
  { name: "CDN", status: "Healthy", version: "edge-v4", uptime: "99.96%" },
  {
    name: "AI Engine",
    status: "Healthy",
    version: "ai-core-v7",
    uptime: "99.92%",
  },
];

export default function DeploymentManagerPage() {
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState<
    (typeof DEPLOYMENTS)[0] | null
  >(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const successRate = Math.round(
    (DEPLOYMENTS.filter((d) => d.status === "Success").length /
      DEPLOYMENTS.length) *
      100,
  );
  const avgTime = "2.3min";

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-ocid="deployment.page"
    >
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div
            role="button"
            tabIndex={-1}
            aria-label="Close sidebar"
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Enter" && setSidebarOpen(false)}
          />
          <aside className="relative z-50 w-64 bg-card border-r border-gold-700/30 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gold-700/20">
              <span className="font-serif text-gold-300 font-semibold text-sm">
                Navigation
              </span>
              <CloseButton onClick={() => setSidebarOpen(false)} size="sm" />
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {["Dashboard", "Deployments", "Services", "Logs", "Settings"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gold-300 hover:bg-gold-700/10 transition-colors"
                  >
                    {item}
                  </button>
                ),
              )}
            </nav>
          </aside>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="font-serif text-2xl font-bold gold-text">
                Deployment Manager
              </h1>
              <p className="text-muted-foreground text-sm font-sans">
                Deploy, monitor and rollback platform releases
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowDeployModal(true)}
            className="gold-button gap-2"
            data-ocid="deployment.deploy_button"
          >
            <Play size={16} /> New Deploy
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Deploys Today",
              value: "3",
              icon: Zap,
              color: "text-blue-400",
            },
            {
              label: "Success Rate",
              value: `${successRate}%`,
              icon: CheckCircle,
              color: "text-green-400",
            },
            {
              label: "Avg Deploy Time",
              value: avgTime,
              icon: Clock,
              color: "text-yellow-400",
            },
            {
              label: "Rollbacks",
              value: "1",
              icon: RotateCcw,
              color: "text-red-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-gold-700/20 rounded-xl p-4"
              data-ocid={`deployment.stat.${stat.label.toLowerCase().replace(/ /g, "_")}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={16} className={stat.color} />
                <span className="text-xs text-muted-foreground font-sans">
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-bold font-serif text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Current Version + Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-gold-700/20 rounded-xl p-4">
            <h2 className="font-serif text-sm font-semibold text-gold-300 mb-3">
              Current Production
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gold-700/20 flex items-center justify-center">
                <Server size={24} className="text-gold-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gold-300 font-serif">
                  v55
                </p>
                <p className="text-xs text-muted-foreground">
                  Internet Computer · Deployed 28 May 2026 14:32
                </p>
              </div>
              <Badge className="ml-auto bg-green-900/30 text-green-400 border-green-700/30">
                Live
              </Badge>
            </div>
            <div className="space-y-2">
              {SERVICES.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center gap-3 p-2 rounded-lg bg-obsidian-800/30"
                >
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-sm text-foreground flex-1">
                    {s.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {s.version}
                  </span>
                  <span className="text-xs text-green-400">{s.uptime}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-gold-700/20 rounded-xl p-4">
            <h2 className="font-serif text-sm font-semibold text-gold-300 mb-3">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Button
                className="w-full gold-button gap-2 justify-start"
                onClick={() => setShowDeployModal(true)}
                data-ocid="deployment.quick_deploy_button"
              >
                <Play size={16} /> Deploy New Version
              </Button>
              <Button
                variant="outline"
                className="w-full border-gold-700/30 text-gold-400 gap-2 justify-start"
                data-ocid="deployment.rollback_button"
              >
                <RotateCcw size={16} /> Rollback to v54
              </Button>
              <Button
                variant="outline"
                className="w-full border-gold-700/30 text-gold-400 gap-2 justify-start"
                data-ocid="deployment.refresh_button"
              >
                <RefreshCw size={16} /> Refresh Services
              </Button>
              <Button
                variant="outline"
                className="w-full border-gold-700/30 text-gold-400 gap-2 justify-start"
                data-ocid="deployment.logs_button"
              >
                <Terminal size={16} /> View All Logs
              </Button>
            </div>
          </div>
        </div>

        {/* Deployment History */}
        <div className="bg-card border border-gold-700/20 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gold-700/20 bg-obsidian-800/40">
            <h2 className="font-serif text-sm font-semibold text-gold-300">
              Deployment History
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="deployment.table">
              <thead>
                <tr className="border-b border-gold-700/20">
                  {[
                    "Version",
                    "Date & Time",
                    "Deployed By",
                    "Status",
                    "Duration",
                    "Changes",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gold-400 font-sans whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEPLOYMENTS.map((d, i) => (
                  <tr
                    key={d.id}
                    className="border-b border-gold-700/10 hover:bg-gold-700/5 transition-colors"
                    data-ocid={`deployment.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-bold text-gold-300 font-mono">
                      {d.version}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {d.date}
                    </td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">
                      {d.by}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          d.status === "Success"
                            ? "bg-green-900/30 text-green-400 border-green-700/30"
                            : "bg-red-900/30 text-red-400 border-red-700/30"
                        }
                      >
                        {d.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {d.duration}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-[220px] truncate">
                      {d.changes}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gold-700/30 text-gold-400 h-7 text-xs gap-1"
                        onClick={() => setShowLogsModal(d)}
                        data-ocid={`deployment.logs_button.${i + 1}`}
                      >
                        <Terminal size={12} /> Logs
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Deploy Modal */}
      <Modal
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
        title="Deploy New Version"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-obsidian-800/40 rounded-lg p-3 border border-gold-700/20">
            <p className="text-sm text-gold-300 font-semibold">
              Current: v55 → Next: v56
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Platform: Internet Computer · Environment: Production
            </p>
          </div>
          <div>
            <Label className="text-gold-300 text-xs mb-1 block">
              Change Description
            </Label>
            <Textarea
              placeholder="Describe what changes are being deployed..."
              className="bg-obsidian-800/60 border-gold-700/30 min-h-[80px]"
            />
          </div>
          <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <ChevronDown size={16} className="text-yellow-400" />
              <p className="text-xs text-yellow-300">
                This will deploy to production. All users will receive the new
                version immediately.
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              className="border-gold-700/30"
              onClick={() => setShowDeployModal(false)}
              data-ocid="deployment.deploy_modal.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="gold-button"
              data-ocid="deployment.deploy_modal.confirm_button"
            >
              Deploy to Production
            </Button>
          </div>
        </div>
      </Modal>

      {/* Logs Modal */}
      <Modal
        isOpen={!!showLogsModal}
        onClose={() => setShowLogsModal(null)}
        title={`Logs — ${showLogsModal?.version}`}
        size="lg"
      >
        {showLogsModal && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-3">
              <Badge
                className={
                  showLogsModal.status === "Success"
                    ? "bg-green-900/30 text-green-400 border-green-700/30"
                    : "bg-red-900/30 text-red-400 border-red-700/30"
                }
              >
                {showLogsModal.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {showLogsModal.date} · {showLogsModal.duration}
              </span>
            </div>
            <div className="bg-obsidian-900 rounded-lg p-4 font-mono text-xs text-green-400 space-y-1 max-h-64 overflow-y-auto">
              <p>
                [{showLogsModal.date}] Starting deployment{" "}
                {showLogsModal.version}...
              </p>
              <p>[+0:12] Building frontend assets...</p>
              <p>[+0:45] TypeScript compilation complete ✓</p>
              <p>[+1:02] Running tests... all passed ✓</p>
              <p>[+1:28] Uploading to Internet Computer canister...</p>
              <p>[+1:55] Canister upgrade complete ✓</p>
              <p>[+2:08] Health checks passing ✓</p>
              <p>
                [+{showLogsModal.duration}] Deployment {showLogsModal.version}{" "}
                {showLogsModal.status === "Success"
                  ? "succeeded ✓"
                  : "FAILED ✗ — initiating rollback"}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {showLogsModal.changes}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Textarea({
  placeholder,
  className,
}: { placeholder: string; className: string }) {
  return (
    <textarea
      placeholder={placeholder}
      className={`w-full px-3 py-2 rounded-lg text-sm resize-none ${className}`}
      rows={3}
    />
  );
}

function Label({
  children,
  className,
}: { children: React.ReactNode; className: string }) {
  return <label className={className}>{children}</label>;
}
