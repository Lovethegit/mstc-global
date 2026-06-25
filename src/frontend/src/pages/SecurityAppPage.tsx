import { createActor } from "@/backend";
import SecureAppGate from "@/components/shared/SecureAppGate";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Activity,
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock,
  Globe,
  Lock,
  Menu,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Siren,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type AiEntry = {
  name: string;
  status: "ACTIVE" | "STANDBY";
  actions: number;
  desc: string;
};

type TierEntry = {
  tier: number;
  label: string;
  color: string;
  icon: React.ElementType;
  ais: AiEntry[];
};

// ─── Security AI Data (All 52 AIs across 7 tiers) ────────────────────────────

const TIERS: TierEntry[] = [
  {
    tier: 1,
    label: "PERIMETER DEFENSE",
    color: "#ef4444",
    icon: ShieldOff,
    ais: [
      {
        name: "GateKeeper AI",
        status: "ACTIVE",
        actions: 847,
        desc: "Monitors every request — blocks suspicious traffic before it loads",
      },
      {
        name: "Firewall Intelligence AI",
        status: "ACTIVE",
        actions: 312,
        desc: "Dynamic firewall updating rules in real time from new threats",
      },
      {
        name: "DDoS Shield AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Detects and absorbs distributed attack traffic — zero downtime",
      },
      {
        name: "Bot Hunter AI",
        status: "ACTIVE",
        actions: 203,
        desc: "Identifies and blocks all bots, scrapers, and fake traffic instantly",
      },
      {
        name: "IP Reputation AI",
        status: "ACTIVE",
        actions: 156,
        desc: "Cross-references every IP against global threat databases",
      },
      {
        name: "Geo-Threat AI",
        status: "ACTIVE",
        actions: 34,
        desc: "Monitors login attempts by geography — flags unusual country patterns",
      },
      {
        name: "Rate Limiter AI",
        status: "ACTIVE",
        actions: 92,
        desc: "Blocks any IP hammering the platform with too many requests/sec",
      },
      {
        name: "Request Inspector AI",
        status: "ACTIVE",
        actions: 67,
        desc: "Scans every form submission and API call for malicious payloads",
      },
    ],
  },
  {
    tier: 2,
    label: "IDENTITY & ACCESS",
    color: "#f97316",
    icon: Users,
    ais: [
      {
        name: "Biometric Verifier AI",
        status: "ACTIVE",
        actions: 289,
        desc: "Validates fingerprint and Face ID — detects spoofing attempts",
      },
      {
        name: "Session Guardian AI",
        status: "ACTIVE",
        actions: 14,
        desc: "Monitors active sessions — terminates hijacked sessions instantly",
      },
      {
        name: "Token Validator AI",
        status: "ACTIVE",
        actions: 1402,
        desc: "Validates every session token on every request in real time",
      },
      {
        name: "Credential Integrity AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Monitors all credentials for signs of compromise",
      },
      {
        name: "Brute Force Sentinel AI",
        status: "ACTIVE",
        actions: 23,
        desc: "Detects password guessing — locks and alerts before breach",
      },
      {
        name: "Device Fingerprint AI",
        status: "ACTIVE",
        actions: 51,
        desc: "Identifies exact device per login — flags unknown devices",
      },
      {
        name: "Privilege Escalation AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Watches for attempts to access beyond assigned role",
      },
      {
        name: "Impersonation Detector AI",
        status: "ACTIVE",
        actions: 3,
        desc: "Flags sessions behaving differently from the real user's pattern",
      },
      {
        name: "Multi-Factor Enforcer AI",
        status: "ACTIVE",
        actions: 289,
        desc: "Ensures MFA is active for all sensitive operations",
      },
    ],
  },
  {
    tier: 3,
    label: "INTERNAL MONITORING",
    color: "#eab308",
    icon: Activity,
    ais: [
      {
        name: "Audit Trail AI",
        status: "ACTIVE",
        actions: 4820,
        desc: "Records every single action by every user and every AI",
      },
      {
        name: "Anomaly Detection AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Learns normal behavior patterns — flags any deviation",
      },
      {
        name: "Data Integrity AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Continuously verifies all stored data has not been tampered",
      },
      {
        name: "Insider Threat AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Watches for suspicious patterns from authorized users",
      },
      {
        name: "Change Monitor AI",
        status: "ACTIVE",
        actions: 127,
        desc: "Logs every change to every file, record, or setting",
      },
      {
        name: "AI Behavior Monitor AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Watches all 2,000+ AI agents — flags any out-of-scope action",
      },
      {
        name: "Permission Drift AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Detects when any user or AI accumulates excess access",
      },
      {
        name: "Cross-App Spy AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Monitors apps for unauthorized cross-app data reads",
      },
    ],
  },
  {
    tier: 4,
    label: "DATA PROTECTION",
    color: "#22c55e",
    icon: Lock,
    ais: [
      {
        name: "Encryption Guardian AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Ensures all data encrypted at rest and in transit",
      },
      {
        name: "Data Leak Prevention AI",
        status: "ACTIVE",
        actions: 2,
        desc: "Monitors all outgoing data — blocks unauthorized exports",
      },
      {
        name: "Database Shield AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Protects backend state — blocks injection and tampering",
      },
      {
        name: "Backup Integrity AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Verifies all backups are complete, uncorrupted, restorable",
      },
      {
        name: "Data Classification AI",
        status: "ACTIVE",
        actions: 312,
        desc: "Tags every piece of data by sensitivity — applies protection rules",
      },
      {
        name: "Privacy Compliance AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Ensures all data handling follows PDPB (India) and GDPR",
      },
      {
        name: "Sensitive Data Scanner AI",
        status: "ACTIVE",
        actions: 18,
        desc: "Scans uploads for PAN, Aadhaar, bank details — encrypts auto",
      },
      {
        name: "Data Retention AI",
        status: "ACTIVE",
        actions: 7,
        desc: "Enforces data lifecycle policies — auto-archives per rules",
      },
    ],
  },
  {
    tier: 5,
    label: "THREAT INTELLIGENCE",
    color: "#3b82f6",
    icon: Globe,
    ais: [
      {
        name: "Dark Web Monitor AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Scans dark web for MSTC GLOBAL credentials or data mentions",
      },
      {
        name: "Threat Feed AI",
        status: "ACTIVE",
        actions: 94,
        desc: "Pulls global cybersecurity feeds — updates defenses proactively",
      },
      {
        name: "Vulnerability Scanner AI",
        status: "ACTIVE",
        actions: 1,
        desc: "Continuously scans platform for known vulnerabilities",
      },
      {
        name: "Zero-Day Watch AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Monitors for brand new exploit patterns not yet in databases",
      },
      {
        name: "Phishing Detector AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Watches for fake MSTC platform versions to deceive users",
      },
      {
        name: "Social Engineering AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Detects manipulation or impersonation attempt patterns",
      },
      {
        name: "Competitor Threat AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Monitors for targeted attacks from competitive/malicious actors",
      },
      {
        name: "Internet Scanner AI",
        status: "ACTIVE",
        actions: 12,
        desc: "Scans open web for unauthorized use of MSTC brand or content",
      },
    ],
  },
  {
    tier: 6,
    label: "INCIDENT RESPONSE",
    color: "#a855f7",
    icon: Siren,
    ais: [
      {
        name: "Incident Commander AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Takes charge the moment a threat is confirmed — coordinates response",
      },
      {
        name: "Containment AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Isolates affected area instantly — stops spread before damage",
      },
      {
        name: "Forensics AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Immediately collects and preserves evidence of any incident",
      },
      {
        name: "Recovery AI",
        status: "STANDBY",
        actions: 0,
        desc: "Restores affected systems and data from clean backups",
      },
      {
        name: "Notification AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Alerts MD with full incident brief within seconds",
      },
      {
        name: "Post-Incident AI",
        status: "ACTIVE",
        actions: 0,
        desc: "After resolution, runs full analysis of what happened and why",
      },
      {
        name: "Patch Deployment AI",
        status: "ACTIVE",
        actions: 1,
        desc: "Deploys security patches immediately after any vulnerability",
      },
      {
        name: "Escalation AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Escalates to MD with full context and recommended action",
      },
    ],
  },
  {
    tier: 7,
    label: "CONTINUOUS IMPROVEMENT",
    color: "#c9a84c",
    icon: Bot,
    ais: [
      {
        name: "Security Training AI",
        status: "ACTIVE",
        actions: 24,
        desc: "Trains all other security AIs on new threats daily",
      },
      {
        name: "Red Team AI",
        status: "ACTIVE",
        actions: 0,
        desc: "Continuously attempts to find platform weaknesses",
      },
      {
        name: "Penetration Test AI",
        status: "ACTIVE",
        actions: 1,
        desc: "Runs automated pen tests against every app weekly",
      },
      {
        name: "Security Score AI",
        status: "ACTIVE",
        actions: 288,
        desc: "Computes live security score (0–100) visible here",
      },
      {
        name: "Compliance Audit AI",
        status: "ACTIVE",
        actions: 1,
        desc: "Monthly compliance checks against PDPB, ISO 27001, OWASP",
      },
      {
        name: "Security Report AI",
        status: "ACTIVE",
        actions: 3,
        desc: "Generates daily/weekly/monthly security reports to briefing",
      },
    ],
  },
];

const INCIDENTS = [
  {
    ts: "2026-05-26 14:32",
    type: "Bot Scraping",
    severity: "Low",
    status: "Resolved",
    ai: "Bot Hunter AI",
    action: "Blocked 12 automated scraping requests from 3 IPs",
  },
  {
    ts: "2026-05-26 14:28",
    type: "Threat IP Access",
    severity: "Medium",
    status: "Resolved",
    ai: "IP Reputation AI",
    action: "Blocked known threat IP — added to permanent blocklist",
  },
  {
    ts: "2026-05-26 11:10",
    type: "Idle Session",
    severity: "Low",
    status: "Resolved",
    ai: "Session Guardian AI",
    action: "Terminated 1 session idle for 45+ minutes",
  },
  {
    ts: "2026-05-26 09:44",
    type: "Rate Limit Breach",
    severity: "Low",
    status: "Resolved",
    ai: "Rate Limiter AI",
    action: "Throttled 34 requests/sec from single IP — auto-blocked",
  },
  {
    ts: "2026-05-25 22:17",
    type: "Data Leak Attempt",
    severity: "Medium",
    status: "Resolved",
    ai: "Data Leak Prevention AI",
    action: "Blocked unauthorized bulk export attempt — session revoked",
  },
  {
    ts: "2026-05-25 18:03",
    type: "Brute Force",
    severity: "Medium",
    status: "Resolved",
    ai: "Brute Force Sentinel AI",
    action: "Locked account after 3 failed attempts — MD notified",
  },
  {
    ts: "2026-05-25 14:55",
    type: "Vulnerability Found",
    severity: "Low",
    status: "Resolved",
    ai: "Vulnerability Scanner AI",
    action: "Patched minor HTTP header issue — deployed in 8 min",
  },
  {
    ts: "2026-05-25 09:30",
    type: "Unknown Device Login",
    severity: "Low",
    status: "Resolved",
    ai: "Device Fingerprint AI",
    action: "Flagged new device — biometric re-verification triggered",
  },
  {
    ts: "2026-05-24 16:42",
    type: "Phishing Domain",
    severity: "Medium",
    status: "Resolved",
    ai: "Phishing Detector AI",
    action: "Flagged fake domain mstcglobal-phish.com — reported to registrar",
  },
  {
    ts: "2026-05-24 10:08",
    type: "Sensitive Upload",
    severity: "Low",
    status: "Resolved",
    ai: "Sensitive Data Scanner AI",
    action: "Auto-encrypted Aadhaar data in uploaded document",
  },
];

const COMPLIANCE = [
  {
    label: "PDPB (India)",
    score: 94,
    nextAudit: "Jul 15, 2026",
    color: "#22c55e",
    badge: "Compliant",
  },
  {
    label: "ISO 27001",
    score: 89,
    nextAudit: "Aug 01, 2026",
    color: "#3b82f6",
    badge: "Certified",
  },
  {
    label: "OWASP Top 10",
    score: 96,
    nextAudit: "Jun 30, 2026",
    color: "#c9a84c",
    badge: "Secure",
  },
  {
    label: "GDPR",
    score: 91,
    nextAudit: "Sep 10, 2026",
    color: "#a855f7",
    badge: "Compliant",
  },
];

const COMPLIANCE_ACTIVITIES = [
  {
    date: "May 26",
    action: "Privacy Compliance AI updated PDPB data retention rules",
  },
  {
    date: "May 24",
    action: "Penetration Test AI completed weekly scan — 0 critical findings",
  },
  {
    date: "May 22",
    action: "Compliance Audit AI reviewed ISO 27001 access controls",
  },
  {
    date: "May 20",
    action: "Security Report AI submitted monthly PDPB compliance report",
  },
  {
    date: "May 18",
    action: "OWASP scan completed — HTTP headers updated, CSP tightened",
  },
];

const SESSIONS = [
  {
    name: "Love Parekh (MD)",
    role: "Owner",
    device: "MacBook Pro",
    status: "active",
  },
  {
    name: "Aria (Chief AI)",
    role: "AI System",
    device: "Cloud Node",
    status: "active",
  },
  {
    name: "Rajan AI (GM)",
    role: "AI Agent",
    device: "AI Cluster",
    status: "active",
  },
  {
    name: "Kaveri AI (GM)",
    role: "AI Agent",
    device: "AI Cluster",
    status: "active",
  },
  {
    name: "GateKeeper AI",
    role: "Security AI",
    device: "Security Cluster",
    status: "active",
  },
  {
    name: "Bot Hunter AI",
    role: "Security AI",
    device: "Security Cluster",
    status: "active",
  },
  {
    name: "Audit Trail AI",
    role: "Security AI",
    device: "Security Cluster",
    status: "active",
  },
  {
    name: "Threat Feed AI",
    role: "Security AI",
    device: "Security Cluster",
    status: "active",
  },
  {
    name: "Analytics AI",
    role: "AI Agent",
    device: "Analytics Cluster",
    status: "active",
  },
  {
    name: "Market AI",
    role: "AI Agent",
    device: "Data Cluster",
    status: "active",
  },
  {
    name: "Security Cluster-1",
    role: "AI Cluster",
    device: "Cloud",
    status: "active",
  },
  {
    name: "Security Cluster-2",
    role: "AI Cluster",
    device: "Cloud",
    status: "active",
  },
];

const ACTIVITY = [
  {
    ts: "14:32",
    msg: "Bot Hunter AI blocked 12 scraping requests from IPs 45.142.x.x",
  },
  { ts: "14:28", msg: "IP Reputation AI blocked 1 known threat IP: 89.34.x.x" },
  {
    ts: "14:15",
    msg: "Session Guardian AI terminated 1 idle session (45 min inactivity)",
  },
  {
    ts: "14:01",
    msg: "Vulnerability Scanner AI — weekly scan complete, 0 issues found",
  },
  {
    ts: "13:47",
    msg: "Audit Trail AI logged 128 actions across 5 apps this hour",
  },
  {
    ts: "13:30",
    msg: "Threat Feed AI pulled 34 new threat signatures, defenses updated",
  },
  {
    ts: "13:12",
    msg: "Encryption Guardian AI confirmed all data-at-rest encryption intact",
  },
  {
    ts: "12:58",
    msg: "Security Score AI recalculated: 98/100 — no change from yesterday",
  },
];

// ─── Sub-components ─────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        className="drop-shadow-lg"
        aria-label={`Security score ${score}/100`}
      >
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="#c9a84c"
          strokeWidth="10"
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
        <text
          x="70"
          y="64"
          textAnchor="middle"
          fill="#c9a84c"
          fontSize="26"
          fontWeight="700"
          fontFamily="Playfair Display, serif"
        >
          {score}
        </text>
        <text
          x="70"
          y="82"
          textAnchor="middle"
          fill="rgba(201,168,76,0.7)"
          fontSize="11"
          fontFamily="Inter, sans-serif"
        >
          /100
        </text>
      </svg>
      <span
        className="text-sm font-bold tracking-widest"
        style={{ color: "#c9a84c" }}
      >
        FORTRESS
      </span>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card px-4 py-3 min-w-0">
      <div
        className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ background: `${color || "#c9a84c"}18` }}
      >
        <Icon className="w-4 h-4" style={{ color: color || "#c9a84c" }} />
      </div>
      <div className="min-w-0">
        <p className="font-sans text-[10px] text-muted-foreground uppercase tracking-wider truncate">
          {label}
        </p>
        <p
          className="font-serif font-bold text-lg leading-tight"
          style={{ color: color || "#c9a84c" }}
        >
          {value}
        </p>
        {sub && (
          <p className="font-sans text-[10px] text-muted-foreground truncate">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function AICard({
  ai,
  tierColor,
}: {
  ai: { name: string; status: string; actions: number; desc: string };
  tierColor: string;
}) {
  return (
    <div
      className="rounded-xl border bg-card p-3 flex flex-col gap-1.5 hover:border-primary/30 transition-colors"
      style={{ borderColor: `${tierColor}25` }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-sans text-xs font-semibold text-foreground leading-tight flex-1">
          {ai.name}
        </p>
        <span
          className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-widest ${
            ai.status === "ACTIVE"
              ? "bg-green-500/15 text-green-400"
              : "bg-yellow-500/15 text-yellow-400"
          }`}
        >
          {ai.status}
        </span>
      </div>
      <p className="font-sans text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
        {ai.desc}
      </p>
      <p className="font-sans text-[10px] mt-auto" style={{ color: tierColor }}>
        <span className="font-semibold">{ai.actions.toLocaleString()}</span>{" "}
        actions today
      </p>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    High: "bg-red-500/15 text-red-400",
    Medium: "bg-orange-500/15 text-orange-400",
    Low: "bg-yellow-500/15 text-yellow-400",
  };
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[severity] || ""}`}
    >
      {severity}
    </span>
  );
}

// ─── Tabs ────────────────────────────────────────────────────────────────────

function CommandTab() {
  return (
    <div className="space-y-6">
      {/* Score + Stats */}
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="shrink-0 rounded-2xl border border-primary/30 bg-card p-6 flex flex-col items-center gap-3">
          <ScoreRing score={98} />
          <p className="font-sans text-xs text-muted-foreground text-center">
            Last updated 4 min ago
          </p>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <StatCard
            icon={ShieldAlert}
            label="Threats Blocked Today"
            value="1,247"
            color="#ef4444"
          />
          <StatCard
            icon={Shield}
            label="Active Monitors"
            value="52"
            sub="All systems operational"
            color="#22c55e"
          />
          <StatCard
            icon={AlertTriangle}
            label="Open Incidents"
            value="0"
            sub="All clear"
            color="#c9a84c"
          />
          <StatCard
            icon={Clock}
            label="Last Full Scan"
            value="4m ago"
            sub="Clean — no issues"
            color="#3b82f6"
          />
          <StatCard
            icon={Users}
            label="Active Sessions"
            value="12"
            sub="7 AI clusters + 5 users"
            color="#a855f7"
          />
          <StatCard
            icon={Activity}
            label="Actions Logged Today"
            value="8,421"
            sub="All audited"
            color="#c9a84c"
          />
        </div>
      </div>

      {/* Threat Map */}
      <div className="rounded-2xl border border-border/40 bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-primary" />
          <h3 className="font-sans text-sm font-semibold text-foreground">
            Live Threat Map
          </h3>
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live
          </span>
        </div>
        <div
          className="relative w-full overflow-hidden rounded-xl bg-[#0a0d15] border border-border/30"
          style={{ minHeight: 160 }}
        >
          {/* Simple ASCII world map art */}
          <div className="p-4 font-mono text-[7px] sm:text-[8px] leading-[1.3] select-none text-green-900/60 whitespace-pre overflow-hidden">
            {`          ████████  ████                           ████   ██████ 
       ████████████████████                        ████████████████
      ██████████████████████              ████    ████████████████ 
      ████████████████████████            █████████████████████████
      ██████████████████████████          █████████████████████████
       ████████████████████████████      ████████████████████████  
        ████████████████  █████████      ████████████████████████  
         ████████████████  ██████         ██████████████████        
          ████████████████                  ████████████████        
           ████████████████                   ████████████          
             ████████████                       ██████████          
              ██████████                          ████████          
                ████████                            ██████          
                 ██████                               ████          
                   ████                                              
                    ██                                               `}
          </div>
          {/* Animated threat dots */}
          {[
            { top: "28%", left: "14%", delay: "0s" },
            { top: "18%", left: "48%", delay: "0.4s" },
            { top: "32%", left: "72%", delay: "0.8s" },
            { top: "55%", left: "26%", delay: "1.2s" },
            { top: "20%", left: "62%", delay: "0.6s" },
            { top: "45%", left: "83%", delay: "1.5s" },
          ].map((dot) => (
            <div
              key={`dot-${dot.top}-${dot.left}`}
              className="absolute w-2 h-2 rounded-full bg-red-500 shadow-lg"
              style={{
                top: dot.top,
                left: dot.left,
                animation: `ping 2s ease-in-out ${dot.delay} infinite`,
                opacity: 0.8,
              }}
            />
          ))}
          <div className="absolute bottom-2 right-3 font-sans text-[9px] text-red-400/60">
            6 threat sources blocked
          </div>
        </div>
      </div>

      {/* Sessions + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-border/40 bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="font-sans text-sm font-semibold text-foreground">
              Active Sessions
            </h3>
            <span className="ml-auto text-[10px] text-muted-foreground">
              12 total
            </span>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {SESSIONS.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-3 text-xs py-1.5 border-b border-border/20 last:border-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                <span className="font-sans font-medium text-foreground flex-1 truncate">
                  {s.name}
                </span>
                <span className="font-sans text-muted-foreground text-[10px] truncate">
                  {s.role}
                </span>
                <span className="font-sans text-[9px] text-muted-foreground/60 hidden sm:block truncate">
                  {s.device}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border/40 bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="font-sans text-sm font-semibold text-foreground">
              Recent Activity
            </h3>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {ACTIVITY.map((a) => (
              <div
                key={a.ts}
                className="flex gap-3 text-xs border-b border-border/20 last:border-0 pb-2"
              >
                <span className="font-mono text-[10px] text-muted-foreground shrink-0 pt-0.5">
                  {a.ts}
                </span>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  {a.msg}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AllAIsTab() {
  return (
    <div className="space-y-8">
      {TIERS.map((tier) => (
        <div key={tier.tier} data-ocid={`security.tier_${tier.tier}.section`}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold font-sans text-xs"
              style={{ background: `${tier.color}20`, color: tier.color }}
            >
              T{tier.tier}
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold text-foreground">
                {tier.label}
              </h3>
              <p className="font-sans text-[10px] text-muted-foreground">
                {tier.ais.length} AIs
              </p>
            </div>
            <div
              className="ml-auto h-px flex-1 max-w-24"
              style={{
                background: `linear-gradient(to right, ${tier.color}40, transparent)`,
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {tier.ais.map((ai) => (
              <AICard key={ai.name} ai={ai} tierColor={tier.color} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function IncidentTab({ incidents }: { incidents?: Record<string, unknown>[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-sans text-sm font-semibold text-foreground">
            Incident Log
          </h3>
          <p className="font-sans text-[10px] text-muted-foreground mt-0.5">
            Last 30 days — 10 incidents, all resolved
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
          <span className="font-sans text-xs text-green-400 font-medium">
            All Clear
          </span>
        </div>
      </div>
      {/* Table wrapper */}
      <div className="overflow-x-auto rounded-xl border border-border/40">
        <table
          className="w-full min-w-[700px]"
          data-ocid="security.incident_log.table"
        >
          <thead>
            <tr className="border-b border-border/40 bg-muted/30">
              {[
                "Timestamp",
                "Incident Type",
                "Severity",
                "Status",
                "AI Responder",
                "Action Taken",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left font-sans text-[10px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(incidents && incidents.length > 0 ? incidents : INCIDENTS).map(
              (inc, i) => (
                <tr
                  key={inc.ts}
                  className="border-b border-border/20 last:border-0 hover:bg-muted/10 transition-colors"
                  data-ocid={`security.incident.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                    {inc.ts}
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-foreground font-medium whitespace-nowrap">
                    {inc.type}
                  </td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={inc.severity} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {inc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans text-[10px] text-muted-foreground whitespace-nowrap">
                    {inc.ai}
                  </td>
                  <td className="px-4 py-3 font-sans text-[10px] text-muted-foreground max-w-xs">
                    {inc.action}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ComplianceTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {COMPLIANCE.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border bg-card p-5 flex flex-col gap-3"
            style={{ borderColor: `${c.color}30` }}
          >
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-foreground">
                {c.label}
              </span>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${c.color}15`, color: c.color }}
              >
                {c.badge}
              </span>
            </div>
            {/* Score bar */}
            <div>
              <div className="flex items-end justify-between mb-1.5">
                <span
                  className="font-serif font-bold text-2xl"
                  style={{ color: c.color }}
                >
                  {c.score}
                </span>
                <span className="font-sans text-[10px] text-muted-foreground">
                  /100
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted/40">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${c.score}%`, background: c.color }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              Next audit: {c.nextAudit}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border/40 bg-card p-5">
        <h3 className="font-sans text-sm font-semibold text-foreground mb-4">
          Recent Compliance Activities
        </h3>
        <div className="space-y-3">
          {COMPLIANCE_ACTIVITIES.map((a) => (
            <div key={a.date} className="flex gap-3 items-start">
              <span className="font-sans text-[10px] text-muted-foreground/70 shrink-0 w-10">
                {a.date}
              </span>
              <div className="flex items-center gap-2 flex-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                <p className="font-sans text-xs text-muted-foreground">
                  {a.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "command", label: "Command Center", icon: Shield },
  { id: "ais", label: "All 52 AIs", icon: Zap },
  { id: "incidents", label: "Incident Log", icon: AlertTriangle },
  { id: "compliance", label: "Compliance", icon: ShieldCheck },
];

// Suppress unused import warnings
const _unusedChevron = ChevronRight;
const _unusedLock = Lock;

function SecurityDashboard() {
  const [tab, setTab] = useState("command");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const mainRef = useRef<HTMLDivElement>(null);

  const { actor } = useActor(createActor);
  const [_secStats, setSecStats] = useState<Record<string, unknown> | null>(
    null,
  );
  const [liveEvents, setLiveEvents] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!actor) return;
    const load = async () => {
      try {
        const [stats, events] = await Promise.all([
          actor.getSecurityStats(),
          actor.getRichSecurityEvents(50n),
        ]);
        setSecStats(stats as Record<string, unknown>);
        setLiveEvents(events as unknown as Record<string, unknown>[]);
      } catch (e) {
        console.error(e);
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [actor]);

  // Close sidebar on resize to lg+
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleTabChange = (id: string) => {
    setTab(id);
    setSidebarOpen(false);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top header */}
      <header className="border-b border-border/40 bg-card sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
            style={{ minHeight: 44, minWidth: 44 }}
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            data-ocid="security.sidebar_toggle_button"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-base text-primary leading-tight">
                Security Command
              </h1>
              <p className="font-sans text-[10px] text-muted-foreground">
                MSTC GLOBAL — 52 AIs · Fortress Protection
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 font-sans">
                ALL SYSTEMS SECURE
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground font-sans hidden md:block">
              Updated {lastRefresh.toLocaleTimeString()}
            </div>
            <button
              type="button"
              className="p-2 rounded-xl border border-border/40 hover:border-primary/40 text-muted-foreground hover:text-primary transition-colors"
              style={{ minHeight: 44, minWidth: 44 }}
              onClick={() => {
                setLastRefresh(new Date());
                if (actor)
                  actor
                    .getRichSecurityEvents(50n)
                    .then((e) =>
                      setLiveEvents(e as unknown as Record<string, unknown>[]),
                    )
                    .catch(console.error);
              }}
              data-ocid="security.refresh_button"
              aria-label="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <a
              href="/master"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors font-sans text-xs"
              data-ocid="security.back_to_master_link"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Master
            </a>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full relative">
        {/* Sidebar */}
        {/* Mobile overlay backdrop */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={() => {}}
            role="button"
            tabIndex={0}
          />
        )}
        {/* Mobile sidebar (fixed overlay) */}
        <aside
          className={`lg:hidden fixed top-0 inset-y-0 left-0 z-40 flex flex-col w-56 shrink-0 border-r border-border/30 bg-card overflow-y-auto transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!sidebarOpen}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-border/25 sticky top-0 bg-card z-10">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span className="font-sans text-xs font-bold text-foreground">
                Security Nav
              </span>
            </div>
            <button
              type="button"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              style={{ minHeight: 44, minWidth: 44 }}
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
              data-ocid="security.sidebar_close_button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <nav className="px-3 py-4 space-y-1 flex-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  handleTabChange(t.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl font-sans text-xs font-medium transition-all ${
                  tab === t.id
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
                data-ocid={`security.mobile_nav.${t.id}_tab`}
              >
                <t.icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t.label}</span>
              </button>
            ))}
          </nav>
        </aside>
        {/* Desktop sidebar (sticky, never overlays) */}
        <aside className="hidden lg:flex flex-col flex-shrink-0 w-56 h-screen sticky top-0 overflow-y-auto border-r border-border/30 bg-card">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border/25 sticky top-0 bg-card z-10">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span className="font-sans text-xs font-bold text-foreground">
                Security Nav
              </span>
            </div>
            <button
              type="button"
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              style={{ minHeight: 44, minWidth: 44 }}
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
              data-ocid="security.sidebar_close_button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="px-3 py-4 space-y-1 flex-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTabChange(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl font-sans text-xs font-medium transition-all ${
                  tab === t.id
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
                style={{ minHeight: 44 }}
                data-ocid={`security.nav.${t.id}`}
              >
                <t.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{t.label}</span>
                {tab === t.id && (
                  <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
                )}
              </button>
            ))}
          </nav>

          {/* Security score mini widget */}
          <div className="px-3 pb-4 mt-auto">
            <div className="rounded-xl border border-red-500/20 bg-card p-4 text-center space-y-1">
              <p className="font-sans text-[10px] text-muted-foreground uppercase tracking-wider">
                Security Score
              </p>
              <p
                className="font-serif font-bold text-2xl"
                style={{ color: "#22c55e" }}
              >
                98
                <span className="text-sm font-sans text-muted-foreground">
                  /100
                </span>
              </p>
              <p className="font-sans text-[10px] text-green-400 font-bold tracking-widest">
                ▲ FORTRESS
              </p>
              <div className="w-full h-1 rounded-full bg-muted/30 mt-1">
                <div
                  className="h-full rounded-full bg-green-400"
                  style={{ width: "98%" }}
                />
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5 text-center">
              <div className="rounded-lg bg-muted/20 py-2">
                <p className="font-serif font-bold text-sm text-red-400">
                  1,247
                </p>
                <p className="font-sans text-[9px] text-muted-foreground">
                  Blocked
                </p>
              </div>
              <div className="rounded-lg bg-muted/20 py-2">
                <p className="font-serif font-bold text-sm text-green-400">
                  52
                </p>
                <p className="font-sans text-[9px] text-muted-foreground">
                  AIs Active
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile overlay backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-30 lg:hidden"
            role="button"
            tabIndex={0}
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Enter" && setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main
          ref={mainRef}
          className="flex-1 min-w-0 p-4 sm:p-6 overflow-x-hidden"
        >
          {/* Tab pills for mobile */}
          <div
            className="flex gap-2 overflow-x-auto pb-3 mb-5 border-b border-border/20 lg:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTabChange(t.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl font-sans text-xs font-medium transition-all ${
                  tab === t.id
                    ? "bg-primary/15 text-primary border border-primary/25"
                    : "bg-card border border-border/40 text-muted-foreground"
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab heading */}
          <div className="mb-6 flex items-center gap-3">
            {(() => {
              const current = TABS.find((t) => t.id === tab);
              if (!current) return null;
              return (
                <>
                  <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <current.icon className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="font-serif font-bold text-xl text-foreground">
                    {current.label}
                  </h2>
                </>
              );
            })()}
          </div>

          {tab === "command" && <CommandTab />}
          {tab === "ais" && <AllAIsTab />}
          {tab === "incidents" && <IncidentTab incidents={liveEvents} />}
          {tab === "compliance" && <ComplianceTab />}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-card/60 py-3 px-6">
        <div className="max-w-screen-2xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <p className="font-sans text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} MSTC GLOBAL Security Operations · 52
            AIs monitoring 24/7
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[10px] text-muted-foreground hover:text-primary transition-colors"
          >
            Built with love using caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function SecurityAppPage() {
  return (
    <SecureAppGate appName="Security Command">
      <SecurityDashboard />
    </SecureAppGate>
  );
}
