import BackButton from "@/components/ui/BackButton";
import CloseButton from "@/components/ui/CloseButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  HardDrive,
  Server,
  Shield,
  Wifi,
  Zap,
} from "lucide-react";
import { useState } from "react";

const SERVICES = [
  {
    name: "Frontend (React)",
    status: "Healthy",
    latency: "145ms",
    uptime: "99.98%",
    region: "Mumbai",
    icon: Zap,
  },
  {
    name: "Backend Canister",
    status: "Healthy",
    latency: "45ms",
    uptime: "99.97%",
    region: "IC Network",
    icon: Server,
  },
  {
    name: "Auth Service",
    status: "Healthy",
    latency: "89ms",
    uptime: "100%",
    region: "IC Network",
    icon: Shield,
  },
  {
    name: "Object Storage",
    status: "Healthy",
    latency: "234ms",
    uptime: "99.99%",
    region: "Mumbai",
    icon: HardDrive,
  },
  {
    name: "CDN / Edge",
    status: "Healthy",
    latency: "12ms",
    uptime: "99.96%",
    region: "Global",
    icon: Wifi,
  },
  {
    name: "DNS",
    status: "Healthy",
    latency: "8ms",
    uptime: "100%",
    region: "Global",
    icon: Globe,
  },
  {
    name: "Email Service",
    status: "Healthy",
    latency: "890ms",
    uptime: "99.92%",
    region: "Singapore",
    icon: CheckCircle,
  },
  {
    name: "SMS Gateway",
    status: "Healthy",
    latency: "1200ms",
    uptime: "99.88%",
    region: "Mumbai",
    icon: Activity,
  },
  {
    name: "Analytics Engine",
    status: "Healthy",
    latency: "267ms",
    uptime: "99.95%",
    region: "IC Network",
    icon: Activity,
  },
  {
    name: "AI Engine",
    status: "Healthy",
    latency: "1240ms",
    uptime: "99.92%",
    region: "IC Network",
    icon: Cpu,
  },
  {
    name: "Database Layer",
    status: "Healthy",
    latency: "23ms",
    uptime: "99.99%",
    region: "IC Network",
    icon: Database,
  },
  {
    name: "Security Layer",
    status: "Healthy",
    latency: "34ms",
    uptime: "100%",
    region: "IC Network",
    icon: Shield,
  },
];

const INCIDENTS = [
  { date: "2026-05-28", status: "None", summary: "All systems operational" },
  { date: "2026-05-27", status: "None", summary: "All systems operational" },
  { date: "2026-05-26", status: "None", summary: "All systems operational" },
  { date: "2026-05-25", status: "None", summary: "All systems operational" },
  { date: "2026-05-24", status: "None", summary: "All systems operational" },
  { date: "2026-05-23", status: "None", summary: "All systems operational" },
  { date: "2026-05-22", status: "None", summary: "All systems operational" },
  { date: "2026-05-21", status: "None", summary: "All systems operational" },
  { date: "2026-05-20", status: "None", summary: "All systems operational" },
  { date: "2026-05-19", status: "None", summary: "All systems operational" },
  {
    date: "2026-05-18",
    status: "Minor",
    summary: "Brief latency spike on CDN edge — resolved in 8 minutes",
  },
  { date: "2026-05-17", status: "None", summary: "All systems operational" },
  { date: "2026-05-16", status: "None", summary: "All systems operational" },
  { date: "2026-05-15", status: "None", summary: "All systems operational" },
  { date: "2026-05-14", status: "None", summary: "All systems operational" },
  { date: "2026-05-13", status: "None", summary: "All systems operational" },
  { date: "2026-05-12", status: "None", summary: "All systems operational" },
  { date: "2026-05-11", status: "None", summary: "All systems operational" },
  { date: "2026-05-10", status: "None", summary: "All systems operational" },
  { date: "2026-05-09", status: "None", summary: "All systems operational" },
  { date: "2026-05-08", status: "None", summary: "All systems operational" },
  { date: "2026-05-07", status: "None", summary: "All systems operational" },
  { date: "2026-05-06", status: "None", summary: "All systems operational" },
  { date: "2026-05-05", status: "None", summary: "All systems operational" },
  { date: "2026-05-04", status: "None", summary: "All systems operational" },
  { date: "2026-05-03", status: "None", summary: "All systems operational" },
  { date: "2026-05-02", status: "None", summary: "All systems operational" },
  { date: "2026-05-01", status: "None", summary: "All systems operational" },
  { date: "2026-04-30", status: "None", summary: "All systems operational" },
  { date: "2026-04-29", status: "None", summary: "All systems operational" },
];

const METRICS = [
  { label: "CPU Usage", value: 23, unit: "%", color: "bg-blue-500" },
  { label: "Memory", value: 41, unit: "%", color: "bg-purple-500" },
  { label: "Storage", value: 67, unit: "%", color: "bg-yellow-500" },
  { label: "Bandwidth", value: 34, unit: "%", color: "bg-green-500" },
];

function Globe({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default function PlatformHealthPageNew() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const allHealthy = SERVICES.every((s) => s.status === "Healthy");

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-ocid="platform.page"
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
              {["Overview", "Services", "Metrics", "Incidents", "Canister"].map(
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
                Platform Health
              </h1>
              <p className="text-muted-foreground text-sm font-sans">
                Real-time platform metrics and service status
              </p>
            </div>
          </div>
          <Badge
            className={
              allHealthy
                ? "bg-green-900/30 text-green-400 border-green-700/30 text-sm px-3 py-1"
                : "bg-red-900/30 text-red-400 border-red-700/30 text-sm px-3 py-1"
            }
          >
            {allHealthy ? "All Systems Operational" : "Issues Detected"}
          </Badge>
        </div>

        {/* Overall health + vitals */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Overall Uptime",
              value: "99.8%",
              icon: Activity,
              color: "text-green-400",
            },
            { label: "FCP", value: "1.2s", icon: Zap, color: "text-blue-400" },
            {
              label: "LCP",
              value: "2.1s",
              icon: Clock,
              color: "text-yellow-400",
            },
            {
              label: "TTI",
              value: "2.8s",
              icon: Clock,
              color: "text-purple-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-gold-700/20 rounded-xl p-4"
              data-ocid={`platform.stat.${stat.label.toLowerCase().replace(/ /g, "_")}`}
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

        {/* System Metrics */}
        <div className="bg-card border border-gold-700/20 rounded-xl p-4 mb-6">
          <h2 className="font-serif text-sm font-semibold text-gold-300 mb-4">
            System Metrics
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {METRICS.map((m) => (
              <div
                key={m.label}
                data-ocid={`platform.metric.${m.label.toLowerCase().replace(/ /g, "_")}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground font-sans">
                    {m.label}
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {m.value}
                    {m.unit}
                  </span>
                </div>
                <div className="h-2 bg-obsidian-700/40 rounded-full">
                  <div
                    className={`h-2 rounded-full ${m.color} transition-all`}
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Status Grid */}
        <div className="bg-card border border-gold-700/20 rounded-xl p-4 mb-6">
          <h2 className="font-serif text-sm font-semibold text-gold-300 mb-4">
            Service Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SERVICES.map((s, i) => (
              <div
                key={s.name}
                className="flex items-center gap-3 p-3 rounded-lg bg-obsidian-800/30 border border-gold-700/10"
                data-ocid={`platform.service.${i + 1}`}
              >
                <div className="w-8 h-8 rounded-lg bg-green-900/20 flex items-center justify-center shrink-0">
                  <s.icon size={16} className="text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {s.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {s.latency} · {s.region}
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-2 h-2 rounded-full bg-green-400 ml-auto mb-1" />
                  <p className="text-xs text-green-400">{s.uptime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Canister health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-gold-700/20 rounded-xl p-4">
            <h2 className="font-serif text-sm font-semibold text-gold-300 mb-3">
              Internet Computer Canister
            </h2>
            <div className="space-y-2">
              {[
                { label: "Canister ID", value: "rdmx6-jaaaa-aaaaa-aaadq-cai" },
                { label: "Cycles Balance", value: "4.87T cycles (Healthy)" },
                { label: "Memory Used", value: "2.3 GB / 8 GB" },
                { label: "Instructions/Day", value: "12.4B instructions" },
                { label: "Last Upgrade", value: "28 May 2026 14:32" },
                { label: "Subnet", value: "System Subnet NNS" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-2 rounded-lg bg-obsidian-800/30"
                >
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-xs text-foreground font-mono">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-gold-700/20 rounded-xl p-4">
            <h2 className="font-serif text-sm font-semibold text-gold-300 mb-3">
              Performance Scores
            </h2>
            <div className="space-y-3">
              {[
                {
                  metric: "First Contentful Paint",
                  value: "1.2s",
                  score: 92,
                  color: "bg-green-500",
                },
                {
                  metric: "Largest Contentful Paint",
                  value: "2.1s",
                  score: 85,
                  color: "bg-yellow-500",
                },
                {
                  metric: "Time to Interactive",
                  value: "2.8s",
                  score: 80,
                  color: "bg-yellow-500",
                },
                {
                  metric: "Cumulative Layout Shift",
                  value: "0.03",
                  score: 98,
                  color: "bg-green-500",
                },
                {
                  metric: "Total Blocking Time",
                  value: "120ms",
                  score: 88,
                  color: "bg-green-500",
                },
              ].map((p) => (
                <div key={p.metric}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      {p.metric}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {p.value}
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        {p.score}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-obsidian-700/40 rounded-full">
                    <div
                      className={`h-1.5 rounded-full ${p.color}`}
                      style={{ width: `${p.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Incident history */}
        <div className="bg-card border border-gold-700/20 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gold-700/20 bg-obsidian-800/40">
            <h2 className="font-serif text-sm font-semibold text-gold-300">
              Incident History — Last 30 Days
            </h2>
          </div>
          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table
              className="w-full text-sm"
              data-ocid="platform.incidents_table"
            >
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-gold-700/20">
                  {["Date", "Status", "Summary"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-xs font-semibold text-gold-400 font-sans"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INCIDENTS.map((inc, i) => (
                  <tr
                    key={inc.date}
                    className="border-b border-gold-700/10 hover:bg-gold-700/5 transition-colors"
                    data-ocid={`platform.incident.${i + 1}`}
                  >
                    <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">
                      {inc.date}
                    </td>
                    <td className="px-4 py-2">
                      <Badge
                        className={
                          inc.status === "None"
                            ? "bg-green-900/30 text-green-400 border-green-700/30 text-xs"
                            : "bg-yellow-900/30 text-yellow-400 border-yellow-700/30 text-xs"
                        }
                      >
                        {inc.status === "None" ? "No Incidents" : inc.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground text-xs">
                      {inc.summary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4 justify-end">
          <Button
            variant="outline"
            className="border-gold-700/30 text-gold-400 gap-2"
            data-ocid="platform.refresh_button"
          >
            <Activity size={16} /> Refresh Status
          </Button>
          <Button
            variant="outline"
            className="border-gold-700/30 text-gold-400 gap-2"
            data-ocid="platform.report_button"
          >
            <CheckCircle size={16} /> Download Report
          </Button>
        </div>
      </div>
    </div>
  );
}
