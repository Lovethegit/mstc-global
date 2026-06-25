import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Eye,
  EyeOff,
  Pencil,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface PermissionSet {
  properties: {
    view: boolean;
    edit: boolean;
    delete: boolean;
    importExport: boolean;
  };
  enquiries: { view: boolean; edit: boolean; export: boolean };
  leads: { view: boolean; edit: boolean; export: boolean };
  tickets: { view: boolean; edit: boolean };
  analytics: { view: boolean; export: boolean };
  legalForms: { view: boolean; download: boolean };
  events: { view: boolean; edit: boolean };
  blog: { view: boolean; edit: boolean; publish: boolean };
}

interface StaffMember {
  id: string;
  name: string;
  role: "Staff" | "Agent" | "BOD Member";
  phone: string;
  email: string;
  staffId: string;
  password: string;
  permissions: PermissionSet;
  status: "active" | "inactive";
  createdAt: string;
  lastLogin: string;
}

interface ActivityEntry {
  id: string;
  staffName: string;
  action: string;
  timestamp: string;
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const STORAGE_KEY = "mstc_staff_members";
const ACTIVITY_KEY = "mstc_staff_activity";

const DEFAULT_PERMISSIONS: PermissionSet = {
  properties: { view: false, edit: false, delete: false, importExport: false },
  enquiries: { view: false, edit: false, export: false },
  leads: { view: false, edit: false, export: false },
  tickets: { view: false, edit: false },
  analytics: { view: false, export: false },
  legalForms: { view: false, download: false },
  events: { view: false, edit: false },
  blog: { view: false, edit: false, publish: false },
};

const VIEW_ONLY_PERMISSIONS: PermissionSet = {
  properties: { view: true, edit: false, delete: false, importExport: false },
  enquiries: { view: true, edit: false, export: false },
  leads: { view: true, edit: false, export: false },
  tickets: { view: true, edit: false },
  analytics: { view: true, export: false },
  legalForms: { view: true, download: false },
  events: { view: true, edit: false },
  blog: { view: true, edit: false, publish: false },
};

const AGENT_PERMISSIONS: PermissionSet = {
  properties: { view: true, edit: true, delete: false, importExport: false },
  enquiries: { view: true, edit: true, export: false },
  leads: { view: true, edit: true, export: false },
  tickets: { view: true, edit: false },
  analytics: { view: false, export: false },
  legalForms: { view: true, download: true },
  events: { view: true, edit: false },
  blog: { view: false, edit: false, publish: false },
};

const FULL_PERMISSIONS: PermissionSet = {
  properties: { view: true, edit: true, delete: true, importExport: true },
  enquiries: { view: true, edit: true, export: true },
  leads: { view: true, edit: true, export: true },
  tickets: { view: true, edit: true },
  analytics: { view: true, export: true },
  legalForms: { view: true, download: true },
  events: { view: true, edit: true },
  blog: { view: true, edit: true, publish: true },
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function uuid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadMembers(): StaffMember[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveMembers(members: StaffMember[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

function loadActivity(): ActivityEntry[] {
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function logActivity(staffName: string, action: string) {
  const entries = loadActivity();
  const entry: ActivityEntry = {
    id: uuid(),
    staffName,
    action,
    timestamp: new Date().toISOString(),
  };
  const updated = [entry, ...entries].slice(0, 100);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Permission helpers ──
function backendToFrontendPerms(
  accessLevel: string,
  accessSections: string[],
  canExport: boolean,
  canDelete: boolean,
): PermissionSet {
  if (accessLevel === "full") return FULL_PERMISSIONS;
  if (accessLevel === "agent") return AGENT_PERMISSIONS;
  if (accessLevel === "view") return VIEW_ONLY_PERMISSIONS;

  const perms: PermissionSet = { ...DEFAULT_PERMISSIONS };
  for (const section of accessSections) {
    if (section in perms) {
      (perms[section as keyof PermissionSet] as Record<string, boolean>).view =
        true;
    }
  }
  if (canExport) {
    for (const section of accessSections) {
      const mod = perms[section as keyof PermissionSet] as Record<
        string,
        boolean
      >;
      if (mod && "export" in mod) mod.export = true;
    }
  }
  if (canDelete) {
    perms.properties.delete = true;
  }
  return perms;
}

function deriveBackendPermissions(perms: PermissionSet) {
  const isFull = JSON.stringify(perms) === JSON.stringify(FULL_PERMISSIONS);
  if (isFull) {
    return {
      accessLevel: "full",
      accessSections: Object.keys(perms),
      canExport: true,
      canDelete: true,
    };
  }
  const isAgent = JSON.stringify(perms) === JSON.stringify(AGENT_PERMISSIONS);
  if (isAgent) {
    return {
      accessLevel: "agent",
      accessSections: ["properties", "enquiries", "leads", "legalForms"],
      canExport: false,
      canDelete: false,
    };
  }
  const isViewOnly =
    JSON.stringify(perms) === JSON.stringify(VIEW_ONLY_PERMISSIONS);
  if (isViewOnly) {
    return {
      accessLevel: "view",
      accessSections: Object.keys(perms),
      canExport: false,
      canDelete: false,
    };
  }
  const accessSections = Object.entries(perms)
    .filter(([_, mod]) => (mod as Record<string, boolean>).view)
    .map(([key]) => key);
  const canExport = Object.values(perms).some(
    (mod) => (mod as Record<string, boolean>).export,
  );
  const canDelete = Object.values(perms).some(
    (mod) => (mod as Record<string, boolean>).delete,
  );
  return { accessLevel: "custom", accessSections, canExport, canDelete };
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
function RoleBadge({ role }: { role: StaffMember["role"] }) {
  const styles: Record<string, string> = {
    Staff: "bg-blue-900/40 text-blue-300 border border-blue-500/40",
    Agent: "bg-purple-900/40 text-purple-300 border border-purple-500/40",
    "BOD Member": "bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-semibold ${styles[role]}`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: StaffMember["status"] }) {
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-semibold ${
        status === "active"
          ? "bg-green-900/40 text-green-300 border border-green-500/40"
          : "bg-red-900/40 text-red-300 border border-red-500/40"
      }`}
    >
      {status === "active" ? "Active" : "Inactive"}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
}: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#0f1319",
        border: "1px solid rgba(201,168,76,0.2)",
      }}
      className="rounded-lg p-4 flex items-center gap-3"
    >
      <div style={{ color: "#c9a84c" }}>{icon}</div>
      <div>
        <div style={{ color: "#c9a84c" }} className="text-xl font-bold">
          {value}
        </div>
        <div style={{ color: "#a0a6b0" }} className="text-xs">
          {label}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Permission module config
// ─────────────────────────────────────────────
const PERM_MODULES: {
  key: keyof PermissionSet;
  label: string;
  fields: string[];
}[] = [
  {
    key: "properties",
    label: "Properties",
    fields: ["view", "edit", "delete", "importExport"],
  },
  { key: "enquiries", label: "Enquiries", fields: ["view", "edit", "export"] },
  { key: "leads", label: "Leads", fields: ["view", "edit", "export"] },
  { key: "tickets", label: "Support Tickets", fields: ["view", "edit"] },
  { key: "analytics", label: "Analytics", fields: ["view", "export"] },
  { key: "legalForms", label: "Legal Forms", fields: ["view", "download"] },
  { key: "events", label: "Events", fields: ["view", "edit"] },
  { key: "blog", label: "Blog", fields: ["view", "edit", "publish"] },
];

function fieldLabel(f: string) {
  const map: Record<string, string> = {
    view: "View",
    edit: "Edit",
    delete: "Delete",
    importExport: "Import/Export",
    export: "Export",
    download: "Download",
    publish: "Publish",
  };
  return map[f] ?? f;
}

// ─────────────────────────────────────────────
// AddEditModal
// ─────────────────────────────────────────────
interface ModalProps {
  member: StaffMember | null;
  onClose: () => void;
  onSave: (m: StaffMember) => void;
}

function AddEditModal({ member, onClose, onSave }: ModalProps) {
  const isEdit = !!member;
  const [form, setForm] = useState<StaffMember>(
    member ?? {
      id: uuid(),
      name: "",
      role: "Staff",
      phone: "",
      email: "",
      staffId: "",
      password: "",
      permissions: { ...DEFAULT_PERMISSIONS },
      status: "active",
      createdAt: new Date().toISOString(),
      lastLogin: "",
    },
  );
  const [showPw, setShowPw] = useState(false);
  const [permOpen, setPermOpen] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (
    key: keyof StaffMember,
    value: StaffMember[keyof StaffMember],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const setPermission = (
    mod: keyof PermissionSet,
    field: string,
    val: boolean,
  ) => {
    setForm((f) => ({
      ...f,
      permissions: {
        ...f.permissions,
        [mod]: {
          ...(f.permissions[mod] as Record<string, boolean>),
          [field]: val,
        },
      },
    }));
  };

  const applyPreset = (preset: PermissionSet) =>
    setForm((f) => ({ ...f, permissions: { ...preset } }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.staffId.trim()) e.staffId = "Staff ID is required";
    if (!form.password.trim()) e.password = "Password is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSave(form);
  };

  const inputCls =
    "w-full rounded px-3 py-2 text-sm outline-none transition-colors" +
    " bg-[#0a0e17] border border-[#c9a84c]/30 text-[#e8e8e8]" +
    " focus:border-[#c9a84c] placeholder:text-[#555]";

  const errCls = "text-red-400 text-xs mt-1";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
    >
      <div
        className="w-full max-w-2xl rounded-xl overflow-hidden flex flex-col"
        style={{
          background: "#0f1319",
          border: "1px solid rgba(201,168,76,0.35)",
          maxHeight: "92vh",
        }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(201,168,76,0.2)" }}
        >
          <h3 style={{ color: "#c9a84c" }} className="text-lg font-bold">
            {isEdit ? "Edit Team Member" : "Add Team Member"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#a0a6b0] hover:text-[#c9a84c] transition-colors"
            data-ocid="staff.close_button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#a0a6b0] mb-1 block">
                Full Name *
              </label>
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="e.g. Priya Sharma"
                data-ocid="staff.name_input"
              />
              {errors.name && <p className={errCls}>{errors.name}</p>}
            </div>
            <div>
              <label className="text-xs text-[#a0a6b0] mb-1 block">
                Role *
              </label>
              <select
                className={inputCls}
                value={form.role}
                onChange={(e) =>
                  setField("role", e.target.value as StaffMember["role"])
                }
                data-ocid="staff.role_select"
              >
                <option value="Staff">Staff</option>
                <option value="Agent">Agent</option>
                <option value="BOD Member">BOD Member</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#a0a6b0] mb-1 block">
                Phone *
              </label>
              <input
                className={inputCls}
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="+91 9876543210"
                data-ocid="staff.phone_input"
              />
              {errors.phone && <p className={errCls}>{errors.phone}</p>}
            </div>
            <div>
              <label className="text-xs text-[#a0a6b0] mb-1 block">Email</label>
              <input
                className={inputCls}
                value={form.email}
                type="email"
                onChange={(e) => setField("email", e.target.value)}
                placeholder="staff@example.com"
                data-ocid="staff.email_input"
              />
            </div>
            <div>
              <label className="text-xs text-[#a0a6b0] mb-1 block">
                Staff Login ID *
              </label>
              <input
                className={inputCls}
                value={form.staffId}
                onChange={(e) => setField("staffId", e.target.value)}
                placeholder="e.g. agent001"
                data-ocid="staff.staffid_input"
              />
              {errors.staffId && <p className={errCls}>{errors.staffId}</p>}
            </div>
            <div>
              <label className="text-xs text-[#a0a6b0] mb-1 block">
                Password *
              </label>
              <div className="relative">
                <input
                  className={`${inputCls} pr-10`}
                  value={form.password}
                  type={showPw ? "text" : "password"}
                  onChange={(e) => setField("password", e.target.value)}
                  placeholder="Set a secure password"
                  data-ocid="staff.password_input"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a6b0] hover:text-[#c9a84c]"
                  onClick={() => setShowPw((v) => !v)}
                  data-ocid="staff.password_toggle"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className={errCls}>{errors.password}</p>}
            </div>
            <div>
              <label className="text-xs text-[#a0a6b0] mb-1 block">
                Status
              </label>
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) =>
                  setField("status", e.target.value as StaffMember["status"])
                }
                data-ocid="staff.status_select"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Permission Presets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span
                style={{ color: "#c9a84c" }}
                className="text-sm font-semibold flex items-center gap-2"
              >
                <ShieldCheck size={15} /> Permissions
              </span>
              <button
                type="button"
                onClick={() => setPermOpen((v) => !v)}
                className="text-[#a0a6b0] hover:text-[#c9a84c] flex items-center gap-1 text-xs"
                data-ocid="staff.permissions_toggle"
              >
                {permOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {permOpen ? "Collapse" : "Expand"}
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                className="px-3 py-1 text-xs rounded border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors"
                onClick={() => applyPreset(VIEW_ONLY_PERMISSIONS)}
                data-ocid="staff.preset_viewonly"
              >
                View Only
              </button>
              <button
                type="button"
                className="px-3 py-1 text-xs rounded border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 transition-colors"
                onClick={() => applyPreset(AGENT_PERMISSIONS)}
                data-ocid="staff.preset_agent"
              >
                Agent Access
              </button>
              <button
                type="button"
                className="px-3 py-1 text-xs rounded border border-green-500/40 text-green-300 hover:bg-green-500/10 transition-colors"
                onClick={() => applyPreset(FULL_PERMISSIONS)}
                data-ocid="staff.preset_full"
              >
                Full Access
              </button>
              <button
                type="button"
                className="px-3 py-1 text-xs rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                onClick={() => applyPreset(DEFAULT_PERMISSIONS)}
                data-ocid="staff.preset_none"
              >
                No Access
              </button>
            </div>

            {permOpen && (
              <div
                className="rounded-lg overflow-hidden"
                style={{ border: "1px solid rgba(201,168,76,0.15)" }}
              >
                {PERM_MODULES.map((mod, idx) => (
                  <div
                    key={mod.key}
                    className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3"
                    style={{
                      background: idx % 2 === 0 ? "#0a0e17" : "#0d1018",
                    }}
                  >
                    <span className="text-xs text-[#c9a84c] w-28 shrink-0 font-medium">
                      {mod.label}
                    </span>
                    {mod.fields.map((field) => {
                      const val = (
                        form.permissions[mod.key] as Record<string, boolean>
                      )[field];
                      return (
                        <label
                          key={field}
                          className="flex items-center gap-1.5 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={val}
                            onChange={(e) =>
                              setPermission(mod.key, field, e.target.checked)
                            }
                            className="accent-[#c9a84c] w-3.5 h-3.5"
                            data-ocid={`staff.perm_${mod.key}_${field}`}
                          />
                          <span className="text-xs text-[#a0a6b0]">
                            {fieldLabel(field)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="px-6 py-4 flex justify-end gap-3"
          style={{ borderTop: "1px solid rgba(201,168,76,0.2)" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm rounded border border-[#c9a84c]/30 text-[#a0a6b0] hover:border-[#c9a84c]/60 transition-colors"
            data-ocid="staff.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-sm rounded font-semibold transition-colors hover:opacity-90"
            style={{ background: "#c9a84c", color: "#06090f" }}
            data-ocid="staff.save_button"
          >
            {isEdit ? "Save Changes" : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DeleteConfirmDialog
// ─────────────────────────────────────────────
function DeleteConfirmDialog({
  name,
  onConfirm,
  onCancel,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
    >
      <div
        className="rounded-xl p-6 w-full max-w-sm"
        style={{
          background: "#0f1319",
          border: "1px solid rgba(201,168,76,0.3)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={22} className="text-red-400 shrink-0" />
          <h4 className="text-[#e8e8e8] font-semibold text-base">
            Remove Team Member?
          </h4>
        </div>
        <p className="text-sm text-[#a0a6b0] mb-6">
          Are you sure you want to remove{" "}
          <strong className="text-[#e8e8e8]">{name}</strong>? This action cannot
          be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded border border-[#c9a84c]/30 text-[#a0a6b0] hover:border-[#c9a84c]/60 transition-colors"
            data-ocid="staff.delete_cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded font-semibold bg-red-700 hover:bg-red-600 text-white transition-colors"
            data-ocid="staff.delete_confirm_button"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function AdminStaffManagementTab() {
  const [members, setMembers] = useState<StaffMember[]>(loadMembers);
  const [activity, setActivity] = useState<ActivityEntry[]>(loadActivity);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<StaffMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);
  const [activityOpen, setActivityOpen] = useState(false);

  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  // Backend staff data
  const { data: backendStaff = [] } = useQuery({
    queryKey: ["staffMembers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStaffMembers();
    },
    enabled: !!actor,
  });

  // Merge backend staff with localStorage staff (backend takes priority)
  const allStaff: StaffMember[] =
    backendStaff.length > 0
      ? backendStaff.map((m) => ({
          id: m.id,
          name: m.name,
          role: m.role as StaffMember["role"],
          email: m.email,
          phone: m.phone,
          staffId: m.loginId,
          password: "",
          permissions: backendToFrontendPerms(
            m.accessLevel,
            m.accessSections,
            m.canExport,
            m.canDelete,
          ),
          status: m.isActive ? "active" : "inactive",
          createdAt: new Date(Number(m.createdAt) / 1000000).toISOString(),
          lastLogin: m.lastLogin
            ? new Date(Number(m.lastLogin) / 1000000).toISOString()
            : "Never",
        }))
      : members;

  // Sync to localStorage whenever members change
  useEffect(() => {
    saveMembers(members);
  }, [members]);

  const refreshActivity = useCallback(() => {
    setActivity(loadActivity());
  }, []);

  // ── Stats ──
  const totalMembers = allStaff.length;
  const activeMembers = allStaff.filter((m) => m.status === "active").length;
  const agentCount = allStaff.filter((m) => m.role === "Agent").length;
  const bodCount = allStaff.filter((m) => m.role === "BOD Member").length;

  // ── Handlers ──
  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (m: StaffMember) => {
    setEditTarget(m);
    setModalOpen(true);
  };

  const handleSave = (m: StaffMember) => {
    setMembers((prev) => {
      const exists = prev.find((p) => p.id === m.id);
      if (exists) {
        logActivity(m.name, "profile updated");
        refreshActivity();
        return prev.map((p) => (p.id === m.id ? m : p));
      }
      logActivity(m.name, "added to team");
      refreshActivity();
      return [...prev, m];
    });

    // Sync to backend
    if (actor) {
      const { accessLevel, accessSections, canExport, canDelete } =
        deriveBackendPermissions(m.permissions);
      actor
        .addStaffMember(
          m.name,
          m.role,
          m.email,
          m.phone,
          m.staffId,
          m.password || "",
          accessSections,
          accessLevel,
          canExport,
          canDelete,
        )
        .then(() =>
          queryClient.invalidateQueries({ queryKey: ["staffMembers"] }),
        )
        .catch((err: Error) =>
          console.error("Failed to sync staff to backend:", err),
        );
    }

    setModalOpen(false);
    setEditTarget(null);
  };

  const toggleStatus = (m: StaffMember) => {
    const newStatus = m.status === "active" ? "inactive" : "active";
    setMembers((prev) =>
      prev.map((p) => (p.id === m.id ? { ...p, status: newStatus } : p)),
    );
    logActivity(m.name, `status changed to ${newStatus}`);
    refreshActivity();

    // Sync deactivation to backend
    if (actor && m.status === "active") {
      actor
        .deactivateStaffMember(m.id)
        .then(() =>
          queryClient.invalidateQueries({ queryKey: ["staffMembers"] }),
        )
        .catch((err: Error) =>
          console.error("Failed to deactivate staff on backend:", err),
        );
    }
  };

  const confirmDelete = (m: StaffMember) => setDeleteTarget(m);

  const handleDelete = () => {
    if (!deleteTarget) return;
    logActivity(deleteTarget.name, "removed from team");
    setMembers((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    refreshActivity();
    setDeleteTarget(null);
  };

  const clearActivity = () => {
    localStorage.removeItem(ACTIVITY_KEY);
    setActivity([]);
  };

  // ── Render ──
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#c9a84c" }}>
            Team Management
            <span
              className="block mt-1 h-0.5 w-16 rounded"
              style={{
                background: "linear-gradient(90deg, #c9a84c, transparent)",
              }}
            />
          </h2>
          <p className="text-sm mt-2" style={{ color: "#a0a6b0" }}>
            Manage staff, agents, and board members. Control access per person.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-opacity hover:opacity-85"
          style={{ background: "#c9a84c", color: "#06090f" }}
          data-ocid="staff.open_modal_button"
        >
          <UserPlus size={16} />
          Add Team Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Total Members"
          value={totalMembers}
          icon={<Users size={20} />}
        />
        <StatCard
          label="Active"
          value={activeMembers}
          icon={<ToggleRight size={20} />}
        />
        <StatCard
          label="Agents"
          value={agentCount}
          icon={<ShieldCheck size={20} />}
        />
        <StatCard
          label="BOD Members"
          value={bodCount}
          icon={<ClipboardList size={20} />}
        />
      </div>

      {/* Staff Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          border: "1px solid rgba(201,168,76,0.2)",
          background: "#0f1319",
        }}
      >
        <div
          className="px-5 py-3"
          style={{ borderBottom: "1px solid rgba(201,168,76,0.15)" }}
        >
          <h3 className="font-semibold text-sm" style={{ color: "#c9a84c" }}>
            Team Members ({totalMembers})
          </h3>
        </div>

        {allStaff.length === 0 ? (
          <div className="py-16 text-center" data-ocid="staff.empty_state">
            <Users
              size={40}
              className="mx-auto mb-3 opacity-30"
              style={{ color: "#c9a84c" }}
            />
            <p className="text-[#a0a6b0] text-sm">No team members yet.</p>
            <p className="text-[#555] text-xs mt-1">
              Click "Add Team Member" to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    background: "#0a0e17",
                    borderBottom: "1px solid rgba(201,168,76,0.15)",
                  }}
                >
                  {[
                    "Name",
                    "Role",
                    "Staff ID",
                    "Phone",
                    "Status",
                    "Created",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold tracking-wide"
                      style={{ color: "#c9a84c" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allStaff.map((m, idx) => (
                  <tr
                    key={m.id}
                    style={{
                      background: idx % 2 === 0 ? "#0f1319" : "#0d1018",
                      borderBottom: "1px solid rgba(201,168,76,0.08)",
                    }}
                    data-ocid={`staff.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium" style={{ color: "#e8e8e8" }}>
                        {m.name}
                      </div>
                      {m.email && (
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: "#555" }}
                        >
                          {m.email}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={m.role} />
                    </td>
                    <td className="px-4 py-3">
                      <code
                        className="text-xs bg-[#0a0e17] border border-[#c9a84c]/20 rounded px-1.5 py-0.5"
                        style={{ color: "#c9a84c" }}
                      >
                        {m.staffId}
                      </code>
                    </td>
                    <td
                      className="px-4 py-3 text-xs"
                      style={{ color: "#a0a6b0" }}
                    >
                      {m.phone}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={m.status} />
                    </td>
                    <td
                      className="px-4 py-3 text-xs"
                      style={{ color: "#a0a6b0" }}
                    >
                      {formatDate(m.createdAt)}
                      {m.lastLogin && (
                        <div className="text-[#555] mt-0.5">
                          Last: {formatDate(m.lastLogin)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => openEdit(m)}
                          className="p-1.5 rounded hover:bg-[#c9a84c]/10 text-[#a0a6b0] hover:text-[#c9a84c] transition-colors"
                          data-ocid={`staff.edit_button.${idx + 1}`}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          title={
                            m.status === "active" ? "Deactivate" : "Activate"
                          }
                          onClick={() => toggleStatus(m)}
                          className={`p-1.5 rounded transition-colors ${
                            m.status === "active"
                              ? "hover:bg-red-500/10 text-green-400 hover:text-red-400"
                              : "hover:bg-green-500/10 text-red-400 hover:text-green-400"
                          }`}
                          data-ocid={`staff.toggle.${idx + 1}`}
                        >
                          {m.status === "active" ? (
                            <ToggleRight size={16} />
                          ) : (
                            <ToggleLeft size={16} />
                          )}
                        </button>
                        <button
                          type="button"
                          title="Remove"
                          onClick={() => confirmDelete(m)}
                          className="p-1.5 rounded hover:bg-red-500/10 text-[#a0a6b0] hover:text-red-400 transition-colors"
                          data-ocid={`staff.delete_button.${idx + 1}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Activity Log */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          border: "1px solid rgba(201,168,76,0.2)",
          background: "#0f1319",
        }}
      >
        <button
          type="button"
          className="w-full flex items-center justify-between px-5 py-3 text-left"
          style={{
            borderBottom: activityOpen
              ? "1px solid rgba(201,168,76,0.15)"
              : "none",
          }}
          onClick={() => setActivityOpen((v) => !v)}
          data-ocid="staff.activity_toggle"
        >
          <h3
            className="font-semibold text-sm flex items-center gap-2"
            style={{ color: "#c9a84c" }}
          >
            <ClipboardList size={15} />
            Activity Log
            <span
              className="px-1.5 py-0.5 rounded text-xs"
              style={{ background: "rgba(201,168,76,0.15)", color: "#c9a84c" }}
            >
              {activity.slice(0, 20).length}
            </span>
          </h3>
          {activityOpen ? (
            <ChevronUp size={15} style={{ color: "#a0a6b0" }} />
          ) : (
            <ChevronDown size={15} style={{ color: "#a0a6b0" }} />
          )}
        </button>

        {activityOpen && (
          <div className="px-5 pb-4">
            <div className="flex justify-end pt-3 pb-2">
              <button
                type="button"
                onClick={clearActivity}
                className="text-xs text-red-400 hover:text-red-300 transition-colors border border-red-500/30 hover:border-red-400/50 rounded px-2 py-1"
                data-ocid="staff.clear_log_button"
              >
                Clear Log
              </button>
            </div>
            {activity.length === 0 ? (
              <p className="text-xs text-[#555] text-center py-6">
                No activity recorded yet.
              </p>
            ) : (
              <div className="space-y-1">
                {activity.slice(0, 20).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between py-2 px-3 rounded text-xs"
                    style={{
                      background: "#0a0e17",
                      border: "1px solid rgba(201,168,76,0.08)",
                    }}
                  >
                    <span style={{ color: "#e8e8e8" }}>
                      <strong style={{ color: "#c9a84c" }}>
                        {entry.staffName}
                      </strong>{" "}
                      {entry.action}
                    </span>
                    <span style={{ color: "#555" }} className="ml-4 shrink-0">
                      {formatDateTime(entry.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {modalOpen && (
        <AddEditModal
          member={editTarget}
          onClose={() => {
            setModalOpen(false);
            setEditTarget(null);
          }}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmDialog
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
