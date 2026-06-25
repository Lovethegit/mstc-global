import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  CheckCircle,
  Key,
  Plus,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ApiStatus = "Active" | "Error" | "Limited";

interface Integration {
  id: number;
  name: string;
  icon: string;
  status: ApiStatus;
  lastCalled: string;
  successRate: number;
  dailyCalls: number;
  description: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 1,
    name: "Google Maps API",
    icon: "🗺️",
    status: "Active",
    lastCalled: "2 min ago",
    successRate: 99.9,
    dailyCalls: 2847,
    description: "Embedded maps, geocoding, place search",
  },
  {
    id: 2,
    name: "WhatsApp Business",
    icon: "💬",
    status: "Active",
    lastCalled: "5 min ago",
    successRate: 99.4,
    dailyCalls: 1204,
    description: "Client messaging, broadcast, templates",
  },
  {
    id: 3,
    name: "RERA Gujarat Portal",
    icon: "🏛️",
    status: "Active",
    lastCalled: "1 hr ago",
    successRate: 97.2,
    dailyCalls: 48,
    description: "Project registration data, complaint tracking",
  },
  {
    id: 4,
    name: "RBI Data Feed",
    icon: "🏦",
    status: "Active",
    lastCalled: "6 hr ago",
    successRate: 99.8,
    dailyCalls: 12,
    description: "Repo rate, policy announcements, lending rates",
  },
  {
    id: 5,
    name: "News API (India)",
    icon: "📰",
    status: "Limited",
    lastCalled: "30 min ago",
    successRate: 94.1,
    dailyCalls: 380,
    description: "Real estate news, market updates",
  },
  {
    id: 6,
    name: "OpenAI / Claude API",
    icon: "🧠",
    status: "Active",
    lastCalled: "30 sec ago",
    successRate: 99.2,
    dailyCalls: 5620,
    description: "AI chat, content generation, analysis",
  },
];

const API_KEYS = [
  {
    id: 1,
    name: "Google Maps Production",
    created: "2025-11-01",
    lastUsed: "Today",
    usage: 847120,
    key: "AIza●●●●●●●●●●●●Xk8m",
  },
  {
    id: 2,
    name: "WhatsApp Business Key",
    created: "2025-10-15",
    lastUsed: "Today",
    usage: 362400,
    key: "EAA●●●●●●●●●●●●Tz9p",
  },
  {
    id: 3,
    name: "OpenAI Prod Key",
    created: "2025-09-20",
    lastUsed: "Today",
    usage: 1682040,
    key: "sk-●●●●●●●●●●●●JKm2",
  },
  {
    id: 4,
    name: "News API India",
    created: "2025-12-01",
    lastUsed: "2 hr ago",
    usage: 113900,
    key: "na-●●●●●●●●●●●●8Rm4",
  },
];

const USAGE_CHART = [
  { day: "Mon", success: 8380, error: 40 },
  { day: "Tue", success: 9080, error: 100 },
  { day: "Wed", success: 7600, error: 50 },
  { day: "Thu", success: 10100, error: 140 },
  { day: "Fri", success: 11240, error: 140 },
  { day: "Sat", success: 6800, error: 40 },
  { day: "Sun", success: 5880, error: 40 },
];

const STATUS_STYLE: Record<
  ApiStatus,
  { badge: string; icon: React.ElementType; iconColor: string }
> = {
  Active: {
    badge: "bg-green-900/30 text-green-300 border-green-700/40",
    icon: CheckCircle,
    iconColor: "text-green-400",
  },
  Error: {
    badge: "bg-red-900/30 text-red-300 border-red-700/40",
    icon: XCircle,
    iconColor: "text-red-400",
  },
  Limited: {
    badge: "bg-amber-900/30 text-amber-300 border-amber-700/40",
    icon: AlertTriangle,
    iconColor: "text-amber-400",
  },
};

export default function ApiManagerPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIntUrl, setNewIntUrl] = useState("");
  const [newIntAuth, setNewIntAuth] = useState("api-key");
  const [testResult, setTestResult] = useState<
    "idle" | "testing" | "ok" | "fail"
  >("idle");

  function testConnection() {
    setTestResult("testing");
    setTimeout(() => setTestResult(newIntUrl.length > 5 ? "ok" : "fail"), 1500);
  }

  return (
    <SecureAppGate appName="API Manager">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="api_manager.page"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gold-400" />
              <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
                API Manager
              </h1>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-gold-700/40 text-gold-400 hover:bg-gold-700/10 h-8 text-xs gap-1"
              onClick={() => setShowAddModal(true)}
              data-ocid="api_manager.add_button"
            >
              <Plus className="w-3 h-3" /> Add Integration
            </Button>
          </div>
        </div>

        <div className="px-4 py-4 space-y-6">
          {/* Integration Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INTEGRATIONS.map((api, i) => {
              const s = STATUS_STYLE[api.status];
              return (
                <div
                  key={api.id}
                  className="bg-card/80 border border-gold-800/30 rounded-xl p-4 space-y-3"
                  data-ocid={`api_manager.integration.${i + 1}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{api.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {api.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {api.description}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${s.badge} text-[10px] flex-shrink-0`}>
                      {api.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs font-bold text-gold-400">
                        {api.dailyCalls.toLocaleString()}
                      </p>
                      <p className="text-[9px] text-muted-foreground">
                        Calls/day
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-400">
                        {api.successRate}%
                      </p>
                      <p className="text-[9px] text-muted-foreground">
                        Success
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-400">
                        {api.lastCalled}
                      </p>
                      <p className="text-[9px] text-muted-foreground">
                        Last call
                      </p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold-500/60 rounded-full"
                      style={{ width: `${api.successRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Usage Chart — two series */}
          <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
            <h2 className="font-bold text-gold-300 mb-4">
              API Calls – Last 7 Days
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={USAGE_CHART}
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="apiSuccessGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="apiErrorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#c9a84c10" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#a08050" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#a08050" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0d1117",
                    border: "1px solid #c9a84c40",
                    borderRadius: 8,
                    color: "#f5d78e",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
                <Area
                  type="monotone"
                  dataKey="success"
                  name="Success"
                  stroke="#c9a84c"
                  fill="url(#apiSuccessGrad)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="error"
                  name="Errors"
                  stroke="#ef4444"
                  fill="url(#apiErrorGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* API Keys */}
          <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gold-300">API Keys</h2>
              <Button
                size="sm"
                className="bg-gold-700/30 border border-gold-700/50 text-gold-300 hover:bg-gold-700/50 text-xs"
                data-ocid="api_manager.add_key_button"
              >
                <Key className="w-3.5 h-3.5 mr-1" />
                Add Key
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm"
                data-ocid="api_manager.keys.table"
              >
                <thead>
                  <tr className="border-b border-gold-800/30">
                    {[
                      "Key Name",
                      "Created",
                      "Last Used",
                      "Usage Count",
                      "Key",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-3 text-xs text-muted-foreground font-medium whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {API_KEYS.map((k, i) => (
                    <tr
                      key={k.id}
                      className="border-b border-gold-800/10 hover:bg-gold-900/10"
                      data-ocid={`api_manager.key.${i + 1}`}
                    >
                      <td className="py-2 px-3 font-medium text-foreground">
                        {k.name}
                      </td>
                      <td className="py-2 px-3 text-muted-foreground text-xs">
                        {k.created}
                      </td>
                      <td className="py-2 px-3 text-muted-foreground text-xs">
                        {k.lastUsed}
                      </td>
                      <td className="py-2 px-3 text-gold-400 font-semibold">
                        {k.usage.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 font-mono text-xs text-muted-foreground">
                        {k.key}
                      </td>
                      <td className="py-2 px-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 border-red-700/40 text-red-400 hover:bg-red-900/20"
                          data-ocid={`api_manager.revoke_button.${i + 1}`}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Revoke
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Integration Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent
            className="bg-card border border-gold-800/30 text-foreground max-w-md"
            data-ocid="api_manager.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-serif text-gold-400">
                Add Integration
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label
                  className="text-xs text-muted-foreground"
                  htmlFor="int-url"
                >
                  Endpoint URL
                </label>
                <input
                  id="int-url"
                  placeholder="https://api.example.com/v1"
                  value={newIntUrl}
                  onChange={(e) => setNewIntUrl(e.target.value)}
                  className="w-full bg-muted/20 border border-gold-800/30 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-700/60"
                  data-ocid="api_manager.url_input"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  className="text-xs text-muted-foreground"
                  htmlFor="int-auth"
                >
                  Auth Type
                </label>
                <select
                  id="int-auth"
                  value={newIntAuth}
                  onChange={(e) => setNewIntAuth(e.target.value)}
                  className="w-full bg-muted/20 border border-gold-800/30 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none"
                  data-ocid="api_manager.auth_type.select"
                >
                  <option value="api-key">API Key</option>
                  <option value="oauth2">OAuth 2.0</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="basic">Basic Auth</option>
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-gold-700/40 text-gold-400 flex-1"
                  onClick={testConnection}
                  disabled={testResult === "testing"}
                  data-ocid="api_manager.test_button"
                >
                  {testResult === "testing" ? "Testing…" : "Test Connection"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="bg-gold-700 text-background hover:bg-gold-600 flex-1"
                  onClick={() => setShowAddModal(false)}
                  data-ocid="api_manager.confirm_button"
                >
                  Add Integration
                </Button>
              </div>
              {testResult === "ok" && (
                <p className="text-xs text-green-400">
                  ✓ Connection successful
                </p>
              )}
              {testResult === "fail" && (
                <p className="text-xs text-red-400">
                  ✗ Connection failed. Check the URL and auth.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SecureAppGate>
  );
}
