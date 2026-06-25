import {
  AlertOctagon,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Eye,
  Filter,
  RefreshCw,
  Shield,
  ShieldCheck,
  ShieldOff,
  ToggleLeft,
  ToggleRight,
  TrendingDown,
  XCircle,
} from "lucide-react";
import { useState } from "react";

type ThreatType = "Spam" | "Bot" | "Suspicious" | "Fraud" | "Duplicate";
type LogStatus = "Blocked" | "Flagged" | "Reviewed";

type SecurityLogEntry = {
  id: string;
  timestamp: string;
  type: ThreatType;
  source: string;
  action: string;
  status: LogStatus;
  score: number;
};

type SecurityRule = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  blocked: number;
};

const SECURITY_LOG: SecurityLogEntry[] = [
  {
    id: "l1",
    timestamp: "Today, 11:42 AM",
    type: "Bot",
    source: "Contact Form",
    action: "Blocked submission — honeypot triggered",
    status: "Blocked",
    score: 95,
  },
  {
    id: "l2",
    timestamp: "Today, 10:18 AM",
    type: "Spam",
    source: "Property Enquiry",
    action: "Flagged — disposable email domain",
    status: "Flagged",
    score: 78,
  },
  {
    id: "l3",
    timestamp: "Today, 9:55 AM",
    type: "Duplicate",
    source: "Callback Request",
    action: "Blocked — same number submitted 4 times in 10 min",
    status: "Blocked",
    score: 85,
  },
  {
    id: "l4",
    timestamp: "Today, 8:30 AM",
    type: "Suspicious",
    source: "Quote Request",
    action: "Flagged — unusual geographic pattern",
    status: "Flagged",
    score: 62,
  },
  {
    id: "l5",
    timestamp: "Yesterday, 6:14 PM",
    type: "Fraud",
    source: "Feedback Form",
    action: "Blocked — known spam IP address",
    status: "Blocked",
    score: 97,
  },
  {
    id: "l6",
    timestamp: "Yesterday, 4:55 PM",
    type: "Bot",
    source: "Property Enquiry",
    action: "Blocked — JavaScript bot detection triggered",
    status: "Blocked",
    score: 99,
  },
  {
    id: "l7",
    timestamp: "Yesterday, 3:20 PM",
    type: "Spam",
    source: "Support Form",
    action: "Flagged — profanity and irrelevant content",
    status: "Reviewed",
    score: 55,
  },
  {
    id: "l8",
    timestamp: "Yesterday, 1:00 PM",
    type: "Suspicious",
    source: "Callback Request",
    action: "Flagged — invalid phone number format",
    status: "Flagged",
    score: 70,
  },
  {
    id: "l9",
    timestamp: "2 days ago, 11:10 AM",
    type: "Duplicate",
    source: "Property Enquiry",
    action: "Blocked — identical submission within 2 hours",
    status: "Blocked",
    score: 88,
  },
  {
    id: "l10",
    timestamp: "2 days ago, 9:05 AM",
    type: "Fraud",
    source: "Quote Request",
    action: "Blocked — email matches known fraud database",
    status: "Blocked",
    score: 93,
  },
];

const INITIAL_RULES: SecurityRule[] = [
  {
    id: "r1",
    name: "Bot Detection",
    description: "Honeypot fields, timing analysis, and JS behavioral checks",
    active: true,
    blocked: 42,
  },
  {
    id: "r2",
    name: "Duplicate Submission Filter",
    description:
      "Blocks same contact submitting more than 2 forms in 15 minutes",
    active: true,
    blocked: 17,
  },
  {
    id: "r3",
    name: "Suspicious Email Detection",
    description: "Flags disposable, known-spam, and malformed email addresses",
    active: true,
    blocked: 28,
  },
  {
    id: "r4",
    name: "Phone Number Validation",
    description:
      "Validates Indian mobile formats and cross-checks known fraud numbers",
    active: true,
    blocked: 11,
  },
  {
    id: "r5",
    name: "Rate Limiting",
    description: "Max 5 submissions per IP per hour across all forms",
    active: true,
    blocked: 63,
  },
  {
    id: "r6",
    name: "IP Reputation Check",
    description:
      "Blocks submissions from known VPNs, proxies, and malicious IPs",
    active: false,
    blocked: 0,
  },
];

const TYPE_STYLES: Record<ThreatType, string> = {
  Spam: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  Bot: "text-red-400 bg-red-400/10 border-red-400/30",
  Suspicious: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  Fraud: "text-red-500 bg-red-500/10 border-red-500/30",
  Duplicate: "text-blue-400 bg-blue-400/10 border-blue-400/30",
};

const STATUS_STYLES: Record<LogStatus, string> = {
  Blocked: "text-red-400 bg-red-400/10 border-red-400/30",
  Flagged: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  Reviewed: "text-green-400 bg-green-400/10 border-green-400/30",
};

export default function AdminSecurityTab() {
  const [rules, setRules] = useState<SecurityRule[]>(INITIAL_RULES);
  const [viewAll, setViewAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const totalToday = 143;
  const blockedToday = SECURITY_LOG.filter(
    (l) => l.timestamp.startsWith("Today") && l.status === "Blocked",
  ).length;
  const flaggedToday = SECURITY_LOG.filter(
    (l) => l.timestamp.startsWith("Today") && l.status === "Flagged",
  ).length;
  const cleanToday = totalToday - blockedToday - flaggedToday;

  const visibleLogs = viewAll ? SECURITY_LOG : SECURITY_LOG.slice(0, 6);

  function toggleRule(id: string) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)),
    );
  }

  function refresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-yellow-400 font-playfair flex items-center gap-2">
            <Shield size={22} className="text-yellow-500" />
            Security & Anti-Fraud
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Real-time monitoring of all form submissions, threat detection, and
            security rule management.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-yellow-700/40 bg-yellow-700/10 text-yellow-300 text-sm hover:bg-yellow-700/20 transition-colors"
          data-ocid="security.refresh_button"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Total Submissions",
            value: totalToday,
            icon: <Eye size={16} />,
            color: "text-blue-400",
          },
          {
            label: "Blocked Bots",
            value: blockedToday,
            icon: <XCircle size={16} />,
            color: "text-red-400",
          },
          {
            label: "Flagged",
            value: flaggedToday,
            icon: <AlertTriangle size={16} />,
            color: "text-yellow-400",
          },
          {
            label: "Clean",
            value: cleanToday,
            icon: <CheckCircle2 size={16} />,
            color: "text-green-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-yellow-800/30 bg-white/[0.03] p-4"
          >
            <div className={`flex items-center gap-1.5 mb-1 ${stat.color}`}>
              {stat.icon}
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <span className="text-2xl font-bold text-white">{stat.value}</span>
            <p className="text-[10px] text-gray-500 mt-0.5">Today</p>
          </div>
        ))}
      </div>

      {/* Fraud Score Distribution */}
      <div className="rounded-xl border border-yellow-800/30 bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <TrendingDown size={14} className="text-yellow-500" />
          Fraud Score Distribution (Today)
        </h3>
        <div className="space-y-3">
          {[
            {
              label: "Low Risk (0–30)",
              count: 118,
              color: "bg-green-500",
              pct: 82,
            },
            {
              label: "Medium Risk (31–60)",
              count: 14,
              color: "bg-yellow-500",
              pct: 10,
            },
            {
              label: "High Risk (61–100)",
              count: 11,
              color: "bg-red-500",
              pct: 8,
            },
          ].map((band) => (
            <div key={band.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{band.label}</span>
                <span className="text-gray-300 font-medium">{band.count}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full ${band.color}`}
                  style={{ width: `${band.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Log */}
      <div className="rounded-xl border border-yellow-800/30 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-yellow-800/20 bg-white/[0.02]">
          <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <AlertOctagon size={14} className="text-red-400" />
            Suspicious Activity Log
          </h3>
          <span className="text-xs text-gray-500">
            {SECURITY_LOG.length} entries
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-yellow-800/20 bg-white/[0.02]">
                {["Time", "Type", "Source", "Action", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-gray-400 font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleLogs.map((entry, i) => (
                <tr
                  key={entry.id}
                  className="border-b border-yellow-800/10 hover:bg-white/[0.02] transition-colors"
                  data-ocid={`security.log.item.${i + 1}`}
                >
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {entry.timestamp}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium border ${TYPE_STYLES[entry.type]}`}
                    >
                      {entry.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{entry.source}</td>
                  <td className="px-4 py-3 text-gray-400 max-w-[200px]">
                    <span className="line-clamp-2">{entry.action}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium border ${STATUS_STYLES[entry.status]}`}
                    >
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {SECURITY_LOG.length > 6 && (
          <div className="px-5 py-3 border-t border-yellow-800/20">
            <button
              type="button"
              onClick={() => setViewAll((v) => !v)}
              className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1"
              data-ocid="security.toggle_all_logs"
            >
              {viewAll
                ? "Show less"
                : `Show all ${SECURITY_LOG.length} entries`}
            </button>
          </div>
        )}
      </div>

      {/* Security Rules */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <ShieldCheck size={14} className="text-yellow-500" />
          Active Security Rules
        </h3>
        <div className="space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`rounded-xl border p-4 flex items-start justify-between gap-4 transition-all ${
                rule.active
                  ? "border-yellow-800/30 bg-white/[0.03]"
                  : "border-gray-700/30 bg-black/20 opacity-70"
              }`}
              data-ocid={`security.rule.${rule.id}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {rule.active ? (
                    <ShieldCheck
                      size={13}
                      className="text-green-400 shrink-0"
                    />
                  ) : (
                    <ShieldOff size={13} className="text-gray-500 shrink-0" />
                  )}
                  <p className="text-sm font-medium text-white">{rule.name}</p>
                  {rule.blocked > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-400/10 text-red-400 border border-red-400/20">
                      {rule.blocked} blocked
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{rule.description}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleRule(rule.id)}
                className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors mt-0.5 ${
                  rule.active ? "bg-yellow-500" : "bg-gray-600"
                }`}
                aria-label={
                  rule.active ? `Disable ${rule.name}` : `Enable ${rule.name}`
                }
                data-ocid={`security.rule.${rule.id}.toggle`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    rule.active ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
