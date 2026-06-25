import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Users,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SERVICES = [
  {
    name: "Frontend App",
    uptime: "99.98%",
    status: "Operational",
    latency: "124ms",
    incidents: 0,
  },
  {
    name: "Backend Canister",
    uptime: "100.00%",
    status: "Operational",
    latency: "48ms",
    incidents: 0,
  },
  {
    name: "Database Layer",
    uptime: "100.00%",
    status: "Operational",
    latency: "12ms",
    incidents: 0,
  },
  {
    name: "AI Chat API",
    uptime: "99.95%",
    status: "Operational",
    latency: "310ms",
    incidents: 1,
  },
  {
    name: "Google Maps API",
    uptime: "100.00%",
    status: "Operational",
    latency: "95ms",
    incidents: 0,
  },
  {
    name: "Media Storage",
    uptime: "99.90%",
    status: "Operational",
    latency: "280ms",
    incidents: 1,
  },
  {
    name: "Authentication",
    uptime: "100.00%",
    status: "Operational",
    latency: "22ms",
    incidents: 0,
  },
  {
    name: "WhatsApp API",
    uptime: "99.85%",
    status: "Operational",
    latency: "180ms",
    incidents: 2,
  },
  {
    name: "News Feed API",
    uptime: "99.70%",
    status: "Degraded",
    latency: "520ms",
    incidents: 3,
  },
];

const UPTIME_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `D-${30 - i}`,
  uptime: i === 13 ? 99.12 : i === 22 ? 99.48 : 99.85 + Math.random() * 0.15,
}));

export default function PlatformHealthPage() {
  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl font-bold text-gold-400"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Platform Health
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time system status, uptime & performance
              </p>
            </div>
            <div className="flex items-center gap-2 bg-green-900/30 border border-green-700/40 rounded-lg px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-sm font-semibold">
                All Systems Operational
              </span>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Current Response",
                value: "124ms",
                icon: Zap,
                color: "text-green-400",
              },
              {
                label: "Avg Response (30d)",
                value: "145ms",
                icon: Clock,
                color: "text-gold-400",
              },
              {
                label: "P95 Latency",
                value: "280ms",
                icon: Activity,
                color: "text-blue-400",
              },
              {
                label: "Error Rate",
                value: "0.02%",
                icon: AlertTriangle,
                color: "text-amber-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-card/80 border border-gold-800/30 rounded-xl p-4"
                data-ocid={`health.kpi.${s.label.toLowerCase().replace(/ /g, "_")}`}
              >
                <s.icon className={`w-5 h-5 mb-2 ${s.color}`} />
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Service Status */}
            <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
              <h2 className="font-bold text-gold-300 mb-3">Service Status</h2>
              <div className="space-y-2">
                {SERVICES.map((s, i) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between py-2 border-b border-gold-800/10 last:border-0"
                    data-ocid={`health.service.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-2">
                      {s.status === "Operational" ? (
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      )}
                      <span className="text-sm text-foreground">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground font-mono">
                        {s.latency}
                      </span>
                      <span className="text-xs text-green-400">{s.uptime}</span>
                      <Badge
                        className={
                          s.status === "Operational"
                            ? "bg-green-900/30 text-green-300 border-green-700/40 text-[10px]"
                            : "bg-amber-900/30 text-amber-300 border-amber-700/40 text-[10px]"
                        }
                      >
                        {s.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Agents Status */}
            <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4 space-y-4">
              <h2 className="font-bold text-gold-300">AI Agent Status</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gold-900/40 flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gold-300">
                      1,547{" "}
                      <span className="text-sm text-muted-foreground font-normal">
                        / 2,000
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      AI agents online
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-400">
                    77.4% active
                  </p>
                  <p className="text-xs text-muted-foreground">
                    453 on standby
                  </p>
                </div>
              </div>
              <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-500/70 rounded-full"
                  style={{ width: "77.4%" }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Security", count: 52, color: "text-red-400" },
                  { label: "Property", count: 186, color: "text-blue-400" },
                  { label: "CRM", count: 124, color: "text-green-400" },
                ].map((c) => (
                  <div key={c.label} className="bg-[#06090f] rounded-lg p-2">
                    <p className={`text-lg font-bold ${c.color}`}>{c.count}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {c.label} AIs
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gold-800/20 pt-3 space-y-1 text-xs text-muted-foreground">
                <p>
                  ⚡ Last incident:{" "}
                  <span className="text-foreground">14 days ago</span>
                </p>
                <p>
                  🔄 Avg deploy time:{" "}
                  <span className="text-foreground">3.2 minutes</span>
                </p>
                <p>
                  📊 Platform score:{" "}
                  <span className="text-green-400 font-bold">98.7/100</span>
                </p>
              </div>
            </div>
          </div>

          {/* Uptime Chart */}
          <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
            <h2 className="font-bold text-gold-300 mb-4">30-Day Uptime (%)</h2>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart
                data={UPTIME_DATA}
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#c9a84c10" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 9, fill: "#a08050" }}
                  interval={4}
                />
                <YAxis
                  domain={[98.5, 100.1]}
                  tick={{ fontSize: 9, fill: "#a08050" }}
                />
                <Tooltip
                  formatter={(v: number) => [`${v.toFixed(2)}%`, "Uptime"]}
                  contentStyle={{
                    background: "#0d1117",
                    border: "1px solid #c9a84c40",
                    borderRadius: 8,
                    color: "#f5d78e",
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="uptime"
                  stroke="#22c55e"
                  fill="url(#uptimeGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </SecureAppGate>
  );
}
