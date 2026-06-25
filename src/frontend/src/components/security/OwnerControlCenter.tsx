import {
  AlertTriangle,
  BarChart3,
  Check,
  Copy,
  Download,
  Edit3,
  Eye,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  ScrollText,
  Shield,
  Unlock,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

type Tab = "sessions" | "staff" | "audit" | "score" | "observer";

interface Session {
  id: string;
  name: string;
  device: string;
  ip: string;
  activity: string;
  duration: string;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "agent" | "viewer";
  biometric: "enrolled" | "pending";
  status: "active" | "suspended";
}

interface AuditRow {
  ts: string;
  staff: string;
  action: string;
  ip: string;
  details: string;
}

interface ObserverCode {
  id: string;
  code: string;
  label: string;
  expiry: string;
  uses: number;
  status: "active" | "revoked";
}

const MOCK_SESSIONS: Session[] = [
  {
    id: "s1",
    name: "Love Parekh",
    device: "Chrome / Windows",
    ip: "103.45.67.89",
    activity: "Viewing Master Control",
    duration: "2h 14m",
  },
  {
    id: "s2",
    name: "Ravi Shah",
    device: "Safari / iPhone",
    ip: "49.36.128.204",
    activity: "CRM — Leads List",
    duration: "28m",
  },
  {
    id: "s3",
    name: "Priya Modi",
    device: "Firefox / Mac",
    ip: "157.37.55.122",
    activity: "Finance Desk",
    duration: "47m",
  },
];

const MOCK_STAFF: StaffMember[] = [
  {
    id: "u1",
    name: "Love Parekh",
    email: "love@mstc",
    role: "admin",
    biometric: "enrolled",
    status: "active",
  },
  {
    id: "u2",
    name: "Ravi Shah",
    email: "ravi@mstc",
    role: "agent",
    biometric: "enrolled",
    status: "active",
  },
  {
    id: "u3",
    name: "Priya Modi",
    email: "priya@mstc",
    role: "agent",
    biometric: "pending",
    status: "active",
  },
  {
    id: "u4",
    name: "Ankit Patel",
    email: "ankit@mstc",
    role: "viewer",
    biometric: "pending",
    status: "suspended",
  },
];

const ACTION_TYPES = [
  "LOGIN_SUCCESS",
  "LOGIN_FAIL",
  "FILE_DOWNLOAD",
  "PAGE_ACCESS",
  "LOGOUT",
  "SETTINGS_CHANGE",
  "STAFF_ADDED",
  "STAFF_SUSPENDED",
  "OBSERVER_CODE_GENERATED",
  "EMERGENCY_LOCKDOWN",
];

const MOCK_AUDIT: AuditRow[] = [
  {
    ts: "2026-06-03 09:14",
    staff: "Love Parekh",
    action: "LOGIN_SUCCESS",
    ip: "103.45.67.89",
    details: "Admin login — Chrome/Windows",
  },
  {
    ts: "2026-06-03 09:10",
    staff: "Ravi Shah",
    action: "LOGIN_SUCCESS",
    ip: "49.36.128.204",
    details: "Staff login — Safari/iPhone",
  },
  {
    ts: "2026-06-03 08:55",
    staff: "Priya Modi",
    action: "FILE_DOWNLOAD",
    ip: "157.37.55.122",
    details: "Agreement_2024_KP.pdf",
  },
  {
    ts: "2026-06-03 08:41",
    staff: "Ankit Patel",
    action: "LOGIN_FAIL",
    ip: "98.34.12.66",
    details: "Wrong password — attempt 3/5",
  },
  {
    ts: "2026-06-03 08:30",
    staff: "Love Parekh",
    action: "STAFF_ADDED",
    ip: "103.45.67.89",
    details: "Added Priya Modi (agent)",
  },
  {
    ts: "2026-06-03 08:20",
    staff: "Ravi Shah",
    action: "PAGE_ACCESS",
    ip: "49.36.128.204",
    details: "CRM → Leads List",
  },
  {
    ts: "2026-06-03 07:55",
    staff: "Love Parekh",
    action: "OBSERVER_CODE_GENERATED",
    ip: "103.45.67.89",
    details: "Code for CA audit session",
  },
  {
    ts: "2026-06-03 07:40",
    staff: "Priya Modi",
    action: "PAGE_ACCESS",
    ip: "157.37.55.122",
    details: "Finance Desk",
  },
  {
    ts: "2026-06-03 07:35",
    staff: "Love Parekh",
    action: "SETTINGS_CHANGE",
    ip: "103.45.67.89",
    details: "Updated OTP number for Ravi Shah",
  },
  {
    ts: "2026-06-03 07:20",
    staff: "Ravi Shah",
    action: "LOGOUT",
    ip: "49.36.128.204",
    details: "Manual logout",
  },
  {
    ts: "2026-06-02 22:14",
    staff: "Ankit Patel",
    action: "LOGIN_FAIL",
    ip: "98.34.12.66",
    details: "Wrong password — attempt 1/5",
  },
  {
    ts: "2026-06-02 20:55",
    staff: "Love Parekh",
    action: "EMERGENCY_LOCKDOWN",
    ip: "103.45.67.89",
    details: "Lockdown triggered by admin",
  },
  {
    ts: "2026-06-02 20:40",
    staff: "Priya Modi",
    action: "FILE_DOWNLOAD",
    ip: "157.37.55.122",
    details: "Site_plan_Shantivan.pdf",
  },
  {
    ts: "2026-06-02 19:30",
    staff: "Ravi Shah",
    action: "PAGE_ACCESS",
    ip: "49.36.128.204",
    details: "Properties Admin",
  },
  {
    ts: "2026-06-02 18:14",
    staff: "Love Parekh",
    action: "STAFF_SUSPENDED",
    ip: "103.45.67.89",
    details: "Suspended Ankit Patel",
  },
  {
    ts: "2026-06-02 17:00",
    staff: "Priya Modi",
    action: "LOGIN_SUCCESS",
    ip: "157.37.55.122",
    details: "Staff login — Firefox/Mac",
  },
  {
    ts: "2026-06-02 16:45",
    staff: "Ankit Patel",
    action: "LOGIN_SUCCESS",
    ip: "98.34.12.66",
    details: "Staff login — Edge/Windows",
  },
  {
    ts: "2026-06-02 16:20",
    staff: "Love Parekh",
    action: "SETTINGS_CHANGE",
    ip: "103.45.67.89",
    details: "Biometric enrolled for Ravi Shah",
  },
  {
    ts: "2026-06-02 15:55",
    staff: "Ravi Shah",
    action: "FILE_DOWNLOAD",
    ip: "49.36.128.204",
    details: "Client_Portfolio_Q2.xlsx",
  },
  {
    ts: "2026-06-02 15:30",
    staff: "Love Parekh",
    action: "OBSERVER_CODE_GENERATED",
    ip: "103.45.67.89",
    details: "Code for investor walkthrough",
  },
];

const MOCK_OBSERVER_CODES: ObserverCode[] = [
  {
    id: "oc1",
    code: "MSTC-7X4K-W9PQ",
    label: "CA Audit Session",
    expiry: "2026-06-10",
    uses: 2,
    status: "active",
  },
  {
    id: "oc2",
    code: "MSTC-3N8R-BJLM",
    label: "Investor Walkthrough",
    expiry: "2026-06-05",
    uses: 1,
    status: "active",
  },
  {
    id: "oc3",
    code: "MSTC-5A2T-HCVY",
    label: "Bank Verification Q1",
    expiry: "2026-05-30",
    uses: 4,
    status: "revoked",
  },
];

const SCORE_CATEGORIES = [
  { label: "Perimeter Defense", score: 95 },
  { label: "Identity & Access", score: 82 },
  { label: "Data Protection", score: 90 },
  { label: "Threat Intelligence", score: 78 },
  { label: "Incident Response", score: 88 },
  { label: "Compliance", score: 85 },
];

function actionColor(action: string): string {
  if (action.includes("FAIL") || action.includes("LOCKDOWN"))
    return "text-red-400";
  if (action.includes("DOWNLOAD")) return "text-yellow-400";
  if (action.includes("ADDED") || action.includes("SUCCESS"))
    return "text-emerald-400";
  if (action.includes("SUSPENDED")) return "text-orange-400";
  return "text-[#c9a84c]";
}

function roleBadge(role: StaffMember["role"]) {
  if (role === "admin")
    return "bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40";
  if (role === "agent")
    return "bg-slate-400/10 text-slate-300 border border-slate-500/30";
  return "bg-blue-400/10 text-blue-300 border border-blue-500/30";
}

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = (n: number) =>
    Array.from(
      { length: n },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  return `MSTC-${seg(4)}-${seg(4)}`;
}

function ScoreRing({ score }: { score: number }) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width="180" height="180" className="mx-auto">
      <circle
        cx="90"
        cy="90"
        r={r}
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="14"
      />
      <circle
        cx="90"
        cy="90"
        r={r}
        fill="none"
        stroke="#c9a84c"
        strokeWidth="14"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 90 90)"
      />
      <text
        x="90"
        y="85"
        textAnchor="middle"
        fill="#c9a84c"
        fontSize="32"
        fontWeight="bold"
        fontFamily="Playfair Display, serif"
      >
        {score}
      </text>
      <text
        x="90"
        y="108"
        textAnchor="middle"
        fill="#8a7a5a"
        fontSize="13"
        fontFamily="Inter, sans-serif"
      >
        / 100
      </text>
    </svg>
  );
}

export function OwnerControlCenter() {
  const [activeTab, setActiveTab] = useState<Tab>("sessions");
  const [lockdown, setLockdown] = useState(false);
  const [lockdownConfirm, setLockdownConfirm] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [auditFilter, setAuditFilter] = useState({
    staff: "",
    type: "",
    date: "",
  });
  const [observerCodes, setObserverCodes] =
    useState<ObserverCode[]>(MOCK_OBSERVER_CODES);
  const [newCodeLabel, setNewCodeLabel] = useState("");
  const [newCodeExpiry, setNewCodeExpiry] = useState("");
  const [newCodeSingleUse, setNewCodeSingleUse] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState("");
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent",
    mobile: "",
  });

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "sessions", label: "Active Sessions", icon: <Users size={14} /> },
    { id: "staff", label: "Staff Management", icon: <UserCheck size={14} /> },
    { id: "audit", label: "Audit Trail", icon: <ScrollText size={14} /> },
    { id: "score", label: "Security Score", icon: <BarChart3 size={14} /> },
    { id: "observer", label: "Observer Codes", icon: <Eye size={14} /> },
  ];

  function forceLogout(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  function triggerLockdown() {
    setLockdownConfirm(false);
    setLockdown(true);
    setSessions((prev) => prev.filter((s) => s.name === "Love Parekh"));
  }

  function suspendStaff(id: string) {
    setStaff((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "active" ? "suspended" : "active" }
          : m,
      ),
    );
  }

  function removeStaff(id: string) {
    setStaff((prev) => prev.filter((m) => m.id !== id));
  }

  function addStaff() {
    if (!newStaff.name || !newStaff.email) return;
    setStaff((prev) => [
      ...prev,
      {
        id: `u${Date.now()}`,
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role as StaffMember["role"],
        biometric: "pending",
        status: "active",
      },
    ]);
    setNewStaff({
      name: "",
      email: "",
      password: "",
      role: "agent",
      mobile: "",
    });
    setShowAddStaff(false);
  }

  const filteredAudit = MOCK_AUDIT.filter((row) => {
    if (auditFilter.staff && row.staff !== auditFilter.staff) return false;
    if (auditFilter.type && row.action !== auditFilter.type) return false;
    if (auditFilter.date && !row.ts.startsWith(auditFilter.date)) return false;
    return true;
  });

  function exportCsv() {
    const header = "Timestamp,Staff,Action,IP,Details";
    const rows = filteredAudit.map(
      (r) => `${r.ts},"${r.staff}",${r.action},${r.ip},"${r.details}"`,
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mstc_audit_trail.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function generateObserverCode() {
    if (!newCodeLabel) return;
    const code = generateCode();
    setGeneratedCode(code);
    setObserverCodes((prev) => [
      {
        id: `oc${Date.now()}`,
        code,
        label: newCodeLabel,
        expiry: newCodeExpiry || "No expiry",
        uses: 0,
        status: "active",
      },
      ...prev,
    ]);
    setNewCodeLabel("");
    setNewCodeExpiry("");
    setNewCodeSingleUse(false);
  }

  function revokeCode(id: string) {
    setObserverCodes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "revoked" } : c)),
    );
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    });
  }

  const inp =
    "w-full px-3 py-2 rounded-lg bg-[#06090f] border border-[#c9a84c]/20 text-[#e8d5a3] text-sm font-sans placeholder:text-[#4a4030] focus:outline-none focus:border-[#c9a84c]/50";
  const sel =
    "px-3 py-2 rounded-lg bg-[#0b0e16] border border-[#c9a84c]/20 text-[#e8d5a3] text-xs font-sans focus:outline-none focus:border-[#c9a84c]/40";

  return (
    <div
      className="bg-[#06090f] border border-[#c9a84c]/20 rounded-2xl overflow-hidden"
      data-ocid="owner_control.panel"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#c9a84c]/20 flex items-center gap-3 bg-[#0b0e16]">
        <Shield size={20} className="text-[#c9a84c]" />
        <h2 className="font-serif text-lg font-bold text-[#c9a84c]">
          Owner Security Command Center
        </h2>
        <span className="ml-auto text-xs text-emerald-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-[#c9a84c]/15 bg-[#08090f]">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            data-ocid={`owner_control.${t.id}_tab`}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-sans font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === t.id
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/5"
                : "border-transparent text-[#7a6e52] hover:text-[#c9a84c]/70"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* TAB 1: Active Sessions */}
        {activeTab === "sessions" && (
          <div className="space-y-5">
            <div className="flex justify-end">
              {lockdown ? (
                <div className="flex-1 flex items-center justify-between rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Lock size={16} className="text-red-400" />
                    <span className="text-red-300 font-sans font-semibold text-sm">
                      LOCKDOWN ACTIVE — All staff sessions terminated
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLockdown(false)}
                    data-ocid="owner_control.lift_lockdown_button"
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-300 text-xs font-sans hover:bg-emerald-500/10 transition-colors"
                  >
                    <Unlock size={12} /> Lift Lockdown
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setLockdownConfirm(true)}
                  data-ocid="owner_control.emergency_lockdown_button"
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-sans font-semibold text-sm transition-colors"
                >
                  <Lock size={14} /> EMERGENCY LOCKDOWN
                </button>
              )}
            </div>

            {lockdownConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
                <div
                  className="bg-[#0e1018] border border-red-500/40 rounded-2xl p-8 max-w-sm w-full mx-4"
                  data-ocid="owner_control.lockdown_dialog"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle size={20} className="text-red-400" />
                    <h3 className="font-serif text-lg font-bold text-red-300">
                      Confirm Emergency Lockdown
                    </h3>
                  </div>
                  <p className="text-sm font-sans text-[#9a8c72] mb-6">
                    This will immediately terminate all staff sessions. Only
                    your account remains active.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setLockdownConfirm(false)}
                      data-ocid="owner_control.lockdown_cancel_button"
                      className="flex-1 py-2 rounded-lg border border-[#c9a84c]/30 text-[#c9a84c]/70 font-sans text-sm hover:border-[#c9a84c]/50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={triggerLockdown}
                      data-ocid="owner_control.lockdown_confirm_button"
                      className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-sans font-semibold text-sm transition-colors"
                    >
                      Confirm Lockdown
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-[#c9a84c]/15">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-[#c9a84c]/15 bg-[#0b0e16]">
                    {[
                      "Staff Name",
                      "Device",
                      "IP Address",
                      "Activity",
                      "Duration",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs text-[#7a6e52] font-semibold uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessions.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-[#5a5040] text-sm"
                        data-ocid="owner_control.sessions_empty_state"
                      >
                        No active sessions
                      </td>
                    </tr>
                  )}
                  {sessions.map((s, i) => (
                    <tr
                      key={s.id}
                      data-ocid={`owner_control.session.item.${i + 1}`}
                      className="border-b border-[#c9a84c]/8 hover:bg-[#c9a84c]/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-[#e8d5a3] font-medium">
                        {s.name}
                      </td>
                      <td className="px-4 py-3 text-[#9a8c72]">{s.device}</td>
                      <td className="px-4 py-3 text-[#9a8c72] font-mono text-xs">
                        {s.ip}
                      </td>
                      <td className="px-4 py-3 text-[#c9a84c]/80 text-xs">
                        {s.activity}
                      </td>
                      <td className="px-4 py-3 text-[#9a8c72] text-xs">
                        {s.duration}
                      </td>
                      <td className="px-4 py-3">
                        {s.name !== "Love Parekh" && (
                          <button
                            type="button"
                            onClick={() => forceLogout(s.id)}
                            data-ocid={`owner_control.force_logout_button.${i + 1}`}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-600/20 border border-red-500/30 text-red-400 text-xs hover:bg-red-600/30 transition-colors"
                          >
                            <LogOut size={11} /> Force Logout
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Staff Management */}
        {activeTab === "staff" && (
          <div className="space-y-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddStaff(!showAddStaff)}
                data-ocid="owner_control.add_staff_button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#c9a84c]/15 border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-sans hover:bg-[#c9a84c]/25 transition-colors"
              >
                <Plus size={13} /> Add New Staff
              </button>
            </div>

            {showAddStaff && (
              <div className="rounded-xl border border-[#c9a84c]/25 bg-[#0b0e16] p-5 space-y-4">
                <h4 className="text-[#c9a84c] font-sans text-sm font-semibold">
                  New Staff Member
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    [
                      { label: "Full Name", key: "name", type: "text" },
                      { label: "Email / Login ID", key: "email", type: "text" },
                      { label: "Password", key: "password", type: "password" },
                      { label: "Mobile Number", key: "mobile", type: "tel" },
                    ] as const
                  ).map((f) => (
                    <div key={f.key}>
                      <label
                        className="block text-xs text-[#7a6e52] mb-1"
                        htmlFor={`ns-${f.key}`}
                      >
                        {f.label}
                      </label>
                      <input
                        id={`ns-${f.key}`}
                        type={f.type}
                        value={newStaff[f.key]}
                        onChange={(e) =>
                          setNewStaff((p) => ({
                            ...p,
                            [f.key]: e.target.value,
                          }))
                        }
                        data-ocid={`owner_control.new_staff_${f.key}_input`}
                        className={inp}
                      />
                    </div>
                  ))}
                  <div>
                    <label
                      className="block text-xs text-[#7a6e52] mb-1"
                      htmlFor="ns-role"
                    >
                      Role
                    </label>
                    <select
                      id="ns-role"
                      value={newStaff.role}
                      onChange={(e) =>
                        setNewStaff((p) => ({ ...p, role: e.target.value }))
                      }
                      data-ocid="owner_control.new_staff_role_select"
                      className={`${inp} cursor-pointer`}
                    >
                      <option value="agent">Agent</option>
                      <option value="viewer">Viewer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddStaff(false)}
                    data-ocid="owner_control.cancel_add_staff_button"
                    className="px-4 py-2 rounded-lg border border-[#c9a84c]/20 text-[#7a6e52] text-xs font-sans hover:border-[#c9a84c]/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={addStaff}
                    data-ocid="owner_control.submit_add_staff_button"
                    className="px-5 py-2 rounded-lg bg-[#c9a84c] text-[#06090f] text-xs font-sans font-bold hover:bg-[#e0be6c] transition-colors"
                  >
                    Add Staff Member
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {staff.map((m, i) => (
                <div
                  key={m.id}
                  data-ocid={`owner_control.staff.item.${i + 1}`}
                  className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-[#c9a84c]/15 bg-[#0b0e16] hover:border-[#c9a84c]/25 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] font-serif font-bold text-sm shrink-0">
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#e8d5a3] text-sm font-sans font-medium truncate">
                      {m.name}
                    </p>
                    <p className="text-[#7a6e52] text-xs font-sans truncate">
                      {m.email}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-sans font-medium ${roleBadge(m.role)}`}
                  >
                    {m.role}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-sans ${
                      m.biometric === "enrolled"
                        ? "bg-emerald-400/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-orange-400/10 text-orange-400 border border-orange-500/30"
                    }`}
                  >
                    {m.biometric === "enrolled"
                      ? "Biometric ✓"
                      : "Biometric Pending"}
                  </span>
                  {m.status === "suspended" && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-sans bg-red-400/10 text-red-400 border border-red-500/30">
                      Suspended
                    </span>
                  )}
                  {m.name !== "Love Parekh" && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => suspendStaff(m.id)}
                        data-ocid={`owner_control.suspend_staff_button.${i + 1}`}
                        className={`px-3 py-1 rounded-md text-xs font-sans border transition-colors ${
                          m.status === "active"
                            ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                        }`}
                      >
                        {m.status === "active" ? "Suspend" : "Reinstate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStaff(m.id)}
                        data-ocid={`owner_control.remove_staff_button.${i + 1}`}
                        className="p-1.5 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <UserX size={12} />
                      </button>
                      <button
                        type="button"
                        data-ocid={`owner_control.edit_role_button.${i + 1}`}
                        className="p-1.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors"
                      >
                        <Edit3 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Audit Trail */}
        {activeTab === "audit" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs text-[#7a6e52] mb-1">
                  Staff
                </label>
                <select
                  value={auditFilter.staff}
                  onChange={(e) =>
                    setAuditFilter((p) => ({ ...p, staff: e.target.value }))
                  }
                  data-ocid="owner_control.audit_staff_filter"
                  className={`${sel} min-w-[140px]`}
                >
                  <option value="">All Staff</option>
                  {[...new Set(MOCK_AUDIT.map((r) => r.staff))].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#7a6e52] mb-1">
                  Event Type
                </label>
                <select
                  value={auditFilter.type}
                  onChange={(e) =>
                    setAuditFilter((p) => ({ ...p, type: e.target.value }))
                  }
                  data-ocid="owner_control.audit_type_filter"
                  className={`${sel} min-w-[160px]`}
                >
                  <option value="">All Events</option>
                  {ACTION_TYPES.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#7a6e52] mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={auditFilter.date}
                  onChange={(e) =>
                    setAuditFilter((p) => ({ ...p, date: e.target.value }))
                  }
                  data-ocid="owner_control.audit_date_filter"
                  className={sel}
                />
              </div>
              <button
                type="button"
                onClick={exportCsv}
                data-ocid="owner_control.audit_export_button"
                className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-[#c9a84c]/15 border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-sans hover:bg-[#c9a84c]/25 transition-colors"
              >
                <Download size={12} /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[#c9a84c]/15">
              <table className="w-full text-xs font-sans">
                <thead>
                  <tr className="border-b border-[#c9a84c]/15 bg-[#0b0e16]">
                    {[
                      "Timestamp",
                      "Staff",
                      "Action",
                      "IP Address",
                      "Details",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[#7a6e52] font-semibold uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAudit.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-[#5a5040]"
                        data-ocid="owner_control.audit_empty_state"
                      >
                        No matching records
                      </td>
                    </tr>
                  )}
                  {filteredAudit.map((row, i) => (
                    <tr
                      key={`${row.ts}-${i}`}
                      data-ocid={`owner_control.audit.item.${i + 1}`}
                      className={`border-b border-[#c9a84c]/8 hover:bg-[#c9a84c]/5 transition-colors ${i % 2 === 1 ? "bg-[#08090c]" : ""}`}
                    >
                      <td className="px-4 py-2.5 text-[#7a6e52] whitespace-nowrap">
                        {row.ts}
                      </td>
                      <td className="px-4 py-2.5 text-[#c9a84c]/80 whitespace-nowrap">
                        {row.staff}
                      </td>
                      <td
                        className={`px-4 py-2.5 font-mono font-semibold whitespace-nowrap ${actionColor(row.action)}`}
                      >
                        {row.action}
                      </td>
                      <td className="px-4 py-2.5 text-[#7a6e52] font-mono whitespace-nowrap">
                        {row.ip}
                      </td>
                      <td className="px-4 py-2.5 text-[#9a8c72]">
                        {row.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Security Score */}
        {activeTab === "score" && (
          <div className="space-y-8">
            <div className="text-center">
              <ScoreRing score={87} />
              <p className="text-[#c9a84c] font-serif text-lg font-bold mt-2">
                Security Health Score
              </p>
              <p className="text-[#7a6e52] text-xs font-sans mt-1">
                Last updated: today at 09:14 IST
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SCORE_CATEGORIES.map((cat) => (
                <div
                  key={cat.label}
                  className="p-4 rounded-xl border border-[#c9a84c]/15 bg-[#0b0e16]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#c9a84c]/80 text-xs font-sans font-medium">
                      {cat.label}
                    </span>
                    <span className="text-[#c9a84c] text-xs font-bold font-sans">
                      {cat.score}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#1a1a1a] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${cat.score}%`,
                        background:
                          cat.score >= 90
                            ? "oklch(0.7 0.18 148)"
                            : cat.score >= 80
                              ? "#c9a84c"
                              : "oklch(0.65 0.18 45)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-center">
                <p className="text-3xl font-bold text-red-400 font-serif">
                  247
                </p>
                <p className="text-xs text-[#7a6e52] font-sans mt-1">
                  Threats blocked today
                </p>
              </div>
              {(
                [
                  { label: "PDPB", status: "Compliant", ok: true },
                  { label: "ISO 27001", status: "Pending", ok: false },
                  { label: "OWASP Top 10", status: "Compliant", ok: true },
                ] as const
              ).map((badge) => (
                <div
                  key={badge.label}
                  className={`p-4 rounded-xl border text-center ${
                    badge.ok
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : "border-amber-500/20 bg-amber-500/5"
                  }`}
                >
                  <p
                    className={`text-sm font-bold font-sans ${badge.ok ? "text-emerald-400" : "text-amber-400"}`}
                  >
                    {badge.label}
                  </p>
                  <p
                    className={`text-xs mt-1 font-sans ${badge.ok ? "text-emerald-600" : "text-amber-600"}`}
                  >
                    {badge.ok ? "✓ " : "⏳ "}
                    {badge.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Observer Codes */}
        {activeTab === "observer" && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl border border-[#c9a84c]/25 bg-[#0b0e16] space-y-4">
              <h4 className="text-[#c9a84c] font-sans text-sm font-semibold">
                Generate New Observer Code
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    className="block text-xs text-[#7a6e52] mb-1"
                    htmlFor="oc-label"
                  >
                    Label / Purpose
                  </label>
                  <input
                    id="oc-label"
                    type="text"
                    placeholder="e.g. CA Audit, Investor"
                    value={newCodeLabel}
                    onChange={(e) => setNewCodeLabel(e.target.value)}
                    data-ocid="owner_control.observer_label_input"
                    className={inp}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs text-[#7a6e52] mb-1"
                    htmlFor="oc-expiry"
                  >
                    Expiry Date
                  </label>
                  <input
                    id="oc-expiry"
                    type="date"
                    value={newCodeExpiry}
                    onChange={(e) => setNewCodeExpiry(e.target.value)}
                    data-ocid="owner_control.observer_expiry_input"
                    className={inp}
                  />
                </div>
                <div className="flex flex-col justify-end gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCodeSingleUse}
                      onChange={(e) => setNewCodeSingleUse(e.target.checked)}
                      data-ocid="owner_control.observer_single_use_checkbox"
                      className="accent-[#c9a84c] w-4 h-4"
                    />
                    <span className="text-xs text-[#9a8c72] font-sans">
                      Single-use only
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={generateObserverCode}
                    disabled={!newCodeLabel}
                    data-ocid="owner_control.generate_observer_code_button"
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#c9a84c] text-[#06090f] text-xs font-sans font-bold hover:bg-[#e0be6c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <RefreshCw size={12} /> Generate Code
                  </button>
                </div>
              </div>
              {generatedCode && (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                  <Check size={13} className="text-emerald-400 shrink-0" />
                  <span className="text-emerald-300 font-mono font-semibold text-sm">
                    {generatedCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedCode, "new")}
                    data-ocid="owner_control.copy_new_code_button"
                    className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded border border-emerald-500/30 text-emerald-400 text-xs font-sans hover:bg-emerald-500/10 transition-colors"
                  >
                    {copied === "new" ? (
                      <Check size={11} />
                    ) : (
                      <Copy size={11} />
                    )}
                    {copied === "new" ? "Copied!" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGeneratedCode("")}
                    className="text-[#5a5040] hover:text-[#9a8c72] transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-[#c9a84c] font-sans text-sm font-semibold">
                Existing Observer Codes
              </h4>
              {observerCodes.map((c, i) => (
                <div
                  key={c.id}
                  data-ocid={`owner_control.observer_code.item.${i + 1}`}
                  className={`flex flex-wrap items-center gap-3 p-4 rounded-xl border transition-colors ${
                    c.status === "revoked"
                      ? "border-[#2a2020] bg-[#0a0808] opacity-50"
                      : "border-[#c9a84c]/20 bg-[#0b0e16] hover:border-[#c9a84c]/30"
                  }`}
                >
                  <span className="font-mono font-semibold text-[#c9a84c] text-sm tracking-wider">
                    {c.code}
                  </span>
                  <span className="text-[#9a8c72] text-xs font-sans">
                    {c.label}
                  </span>
                  <span className="text-[#7a6e52] text-xs font-sans">
                    Exp: {c.expiry}
                  </span>
                  <span className="text-[#7a6e52] text-xs font-sans">
                    {c.uses} use{c.uses !== 1 ? "s" : ""}
                  </span>
                  <span
                    className={`ml-auto px-2 py-0.5 rounded-full text-xs font-sans ${
                      c.status === "active"
                        ? "bg-emerald-400/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-400/10 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {c.status}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(c.code, c.id)}
                      data-ocid={`owner_control.copy_code_button.${i + 1}`}
                      className="p-1.5 rounded border border-[#c9a84c]/20 text-[#c9a84c]/70 hover:border-[#c9a84c]/40 transition-colors"
                    >
                      {copied === c.id ? (
                        <Check size={11} />
                      ) : (
                        <Copy size={11} />
                      )}
                    </button>
                    {c.status === "active" && (
                      <button
                        type="button"
                        onClick={() => revokeCode(c.id)}
                        data-ocid={`owner_control.revoke_code_button.${i + 1}`}
                        className="px-3 py-1 rounded border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-sans hover:bg-red-500/20 transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerControlCenter;
