import SecureAppGate from "@/components/shared/SecureAppGate";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Shield,
  Terminal,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type TabId = "overview" | "alerts" | "agents" | "logs";

const SYSTEM_SERVICES = [
  {
    id: "backend",
    label: "Backend Canister",
    uptime: "99.98%",
    latency: "12ms",
    icon: Terminal,
  },
  {
    id: "frontend",
    label: "Frontend CDN",
    uptime: "100%",
    latency: "8ms",
    icon: Activity,
  },
  {
    id: "security",
    label: "Security Layer",
    uptime: "100%",
    latency: "2ms",
    icon: Shield,
  },
  {
    id: "ai_agents",
    label: "AI Agents",
    uptime: "99.97%",
    latency: "35ms",
    icon: Zap,
  },
];

const INITIAL_LOGS = [
  {
    id: 1,
    ts: Date.now() - 120000,
    level: "info",
    msg: "GateKeeper AI blocked 14 suspicious IPs from range 45.12.xx.xx",
  },
  {
    id: 2,
    ts: Date.now() - 105000,
    level: "success",
    msg: "Property Intelligence AI imported 32 new RERA listings from Gujarat portal",
  },
  {
    id: 3,
    ts: Date.now() - 90000,
    level: "info",
    msg: "CRM AI scored 8 incoming leads — 3 marked high-priority",
  },
  {
    id: 4,
    ts: Date.now() - 75000,
    level: "info",
    msg: "Legal AI completed contract review for Vastrapur 2BHK — zero risk flags",
  },
  {
    id: 5,
    ts: Date.now() - 60000,
    level: "success",
    msg: "Content AI published blog: '5 Emerging Areas in Ahmedabad 2026'",
  },
  {
    id: 6,
    ts: Date.now() - 48000,
    level: "info",
    msg: "Finance AI updated RBI repo rate tracking — stable at 6.25%",
  },
  {
    id: 7,
    ts: Date.now() - 35000,
    level: "warn",
    msg: "DDoS Shield absorbed spike from 3 IPs — traffic normalized in 4s",
  },
  {
    id: 8,
    ts: Date.now() - 24000,
    level: "info",
    msg: "Analytics AI compiled daily performance summary — 42 KPIs updated",
  },
  {
    id: 9,
    ts: Date.now() - 15000,
    level: "success",
    msg: "Valuation AI priced Bopal 3BHK at ₹82.4L — market aligned",
  },
  {
    id: 10,
    ts: Date.now() - 8000,
    level: "info",
    msg: "Market Intel AI flagged new metro extension to Gota — price impact: +4-6%",
  },
  {
    id: 11,
    ts: Date.now() - 3000,
    level: "success",
    msg: "Security score updated: 98/100 — FORTRESS STATUS",
  },
];

const INITIAL_ALERTS = [
  {
    id: 1,
    level: "resolved",
    title: "Spike in login attempts",
    detail: "45 brute-force attempts blocked from IP 103.xx.xx.12",
    ts: Date.now() - 3600000,
  },
  {
    id: 2,
    level: "resolved",
    title: "RERA filing deadline — Shivalik Heights",
    detail: "Filed on time. No penalty.",
    ts: Date.now() - 86400000,
  },
  {
    id: 3,
    level: "active",
    title: "RERA renewal approaching",
    detail: "3 agent licenses expire in < 60 days. Action required.",
    ts: Date.now() - 7200000,
  },
  {
    id: 4,
    level: "resolved",
    title: "High traffic on AppLauncher",
    detail: "CDN auto-scaled. Response time maintained < 10ms.",
    ts: Date.now() - 172800000,
  },
];

const AGENT_CLUSTERS = [
  { name: "Property Intelligence", agents: 247, active: 240, tasks: 340 },
  { name: "Security Defense", agents: 52, active: 52, tasks: 1240 },
  { name: "Legal Operations", agents: 30, active: 28, tasks: 45 },
  { name: "Finance Analytics", agents: 85, active: 82, tasks: 128 },
  { name: "Content Creation", agents: 120, active: 118, tasks: 87 },
  { name: "CRM & Sales", agents: 95, active: 94, tasks: 210 },
  { name: "Data & Analytics", agents: 180, active: 175, tasks: 520 },
  { name: "Events & Hospitality", agents: 40, active: 38, tasks: 30 },
];

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function CommandCenterInner() {
  const [tab, setTab] = useState<TabId>("overview");
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [diagRunning, setDiagRunning] = useState(false);
  const [diagDone, setDiagDone] = useState(false);
  const nextId = useRef(20);

  useEffect(() => {
    const pool = [
      "Anomaly AI baseline updated — no deviations detected",
      "Lead scoring AI processed 6 new enquiries from website",
      "Security AI blocked bot crawl (47 requests/sec)",
      "Content AI scheduled 3 social posts for tomorrow",
      "RERA AI verified Q2 compliance for 5 projects",
      "Platform health check passed — all endpoints 200 OK",
    ];
    let i = 0;
    const id = setInterval(() => {
      const msg = pool[i % pool.length];
      i++;
      setLogs((prev) => [
        { id: nextId.current++, ts: Date.now(), level: "info", msg },
        ...prev.slice(0, 19),
      ]);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  function runDiagnostics() {
    setDiagRunning(true);
    setDiagDone(false);
    setTimeout(() => {
      setDiagRunning(false);
      setDiagDone(true);
      setLogs((prev) => [
        {
          id: nextId.current++,
          ts: Date.now(),
          level: "success",
          msg: "Diagnostics complete — all systems healthy. 52 AIs active, 0 errors.",
        },
        ...prev.slice(0, 19),
      ]);
      toast.success("All systems healthy", {
        description:
          "52 AIs active, 0 errors, 100% uptime across all services.",
      });
    }, 2000);
  }

  const TABS: { id: TabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "agents", label: "AI Agents" },
    {
      id: "alerts",
      label: `Alerts (${alerts.filter((a) => a.level === "active").length})`,
    },
    { id: "logs", label: "Activity Log" },
  ];

  const levelStyles: Record<string, string> = {
    info: "text-blue-400",
    success: "text-green-400",
    warn: "text-yellow-400",
    error: "text-red-400",
  };
  const levelDot: Record<string, string> = {
    info: "bg-blue-400",
    success: "bg-green-400",
    warn: "bg-yellow-400",
    error: "bg-red-400",
  };

  return (
    <div className="min-h-screen bg-background pb-20" data-ocid="command.page">
      <div className="sticky top-0 z-10 border-b border-primary/20 bg-card/90 backdrop-blur-md px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary" />
            <h1 className="font-serif font-bold text-lg text-foreground">
              Command Center
            </h1>
          </div>
          <button
            type="button"
            onClick={runDiagnostics}
            disabled={diagRunning}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary text-sm font-medium transition-all disabled:opacity-50"
            data-ocid="command.run_diagnostics_button"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${diagRunning ? "animate-spin" : ""}`}
            />
            {diagRunning ? "Running…" : "Run Diagnostics"}
          </button>
        </div>
        {diagDone && (
          <div
            className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30"
            data-ocid="command.success_state"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-green-400 font-medium">
              All systems healthy — 52 AIs active, 0 errors
            </span>
            <button
              type="button"
              onClick={() => setDiagDone(false)}
              className="ml-auto text-green-600 hover:text-green-400"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex gap-1 mt-3 overflow-x-auto scrollbar-none">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                tab === t.id
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`command.tab.${t.id}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 max-w-5xl mx-auto">
        {tab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SYSTEM_SERVICES.map((svc) => (
                <div
                  key={svc.id}
                  className="rounded-xl border border-primary/15 bg-card p-4 flex flex-col gap-2"
                  data-ocid={`command.service.${svc.id}`}
                >
                  <div className="flex items-center justify-between">
                    <svc.icon className="w-4 h-4 text-primary" />
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                      OPERATIONAL
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-foreground leading-tight">
                    {svc.label}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{svc.uptime}</span>
                    <span>{svc.latency}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Active AIs", value: "2,049", sub: "of 2,049 total" },
                {
                  label: "Tasks/Hour",
                  value: "4,820",
                  sub: "across all clusters",
                },
                {
                  label: "Blocked Threats",
                  value: "203",
                  sub: "last 24 hours",
                },
                {
                  label: "Security Score",
                  value: "98/100",
                  sub: "FORTRESS STATUS",
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-primary/15 bg-card p-4"
                >
                  <p className="font-serif text-2xl font-bold text-primary">
                    {m.value}
                  </p>
                  <p className="text-xs text-foreground font-medium mt-0.5">
                    {m.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {m.sub}
                  </p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-primary/15 bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Recent Activity
              </p>
              <div className="space-y-2">
                {logs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-start gap-2 text-xs">
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${levelDot[log.level] ?? "bg-muted-foreground"}`}
                    />
                    <span
                      className={`shrink-0 font-mono w-14 ${levelStyles[log.level] ?? ""}`}
                    >
                      {timeAgo(log.ts)}
                    </span>
                    <span className="text-foreground/80">{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "agents" && (
          <div className="space-y-3">
            {AGENT_CLUSTERS.map((cluster) => (
              <div
                key={cluster.name}
                className="rounded-xl border border-primary/15 bg-card p-4 flex items-center gap-4"
                data-ocid={`command.cluster.${cluster.name.toLowerCase().replace(/ /g, "_")}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">
                    {cluster.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {cluster.active}/{cluster.agents} active · {cluster.tasks}{" "}
                    tasks/hr
                  </p>
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all"
                      style={{
                        width: `${Math.round((cluster.active / cluster.agents) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-green-400">
                    {Math.round((cluster.active / cluster.agents) * 100)}%
                  </span>
                  <p className="text-[10px] text-muted-foreground">active</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "alerts" && (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-xl border p-4 flex items-start gap-3 ${
                  alert.level === "active"
                    ? "border-yellow-500/30 bg-yellow-500/5"
                    : "border-primary/10 bg-card/60"
                }`}
                data-ocid={`command.alert.${alert.id}`}
              >
                <div
                  className={`mt-0.5 shrink-0 ${alert.level === "active" ? "text-yellow-400" : "text-green-500"}`}
                >
                  {alert.level === "active" ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">
                      {alert.title}
                    </p>
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                        alert.level === "active"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {alert.level === "active" ? "Active" : "Resolved"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {alert.detail}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {timeAgo(alert.ts)}
                  </p>
                </div>
                {alert.level === "active" && (
                  <button
                    type="button"
                    onClick={() =>
                      setAlerts((prev) =>
                        prev.map((a) =>
                          a.id === alert.id ? { ...a, level: "resolved" } : a,
                        ),
                      )
                    }
                    className="shrink-0 text-xs px-2.5 py-1 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                    data-ocid={`command.resolve_button.${alert.id}`}
                  >
                    Resolve
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "logs" && (
          <div
            className="rounded-xl border border-primary/15 bg-card/80 overflow-hidden"
            data-ocid="command.logs_panel"
          >
            <div className="px-4 py-3 border-b border-primary/10 flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Activity Log
              </p>
              <span className="text-[10px] text-muted-foreground">
                {logs.length} entries · auto-updating
              </span>
            </div>
            <div className="divide-y divide-primary/5">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="px-4 py-2.5 flex items-start gap-3 hover:bg-primary/5 transition-colors"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${levelDot[log.level] ?? "bg-muted-foreground"}`}
                  />
                  <span
                    className={`font-mono text-[11px] shrink-0 w-14 ${levelStyles[log.level] ?? ""}`}
                  >
                    {timeAgo(log.ts)}
                  </span>
                  <span className="text-xs text-foreground/80 flex-1">
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommandCenterPage() {
  return (
    <SecureAppGate appName="Command Center">
      <CommandCenterInner />
    </SecureAppGate>
  );
}
