import { createActor } from "@/backend";
import type {
  ObserverCode,
  TutorialApp,
  TutorialStep,
  TutorialSuggestion,
} from "@/backend";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Edit3,
  Eye,
  EyeOff,
  Plus,
  QrCode,
  RefreshCw,
  Shield,
  Trash2,
  Users,
  Wand2,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

// ─── Constants ───────────────────────────────────────────────────────────────

const HARDCODED_APPS: { key: string; name: string }[] = [
  { key: "main-website", name: "Main Website" },
  { key: "app-launcher", name: "App Launcher" },
  { key: "master-control", name: "Master Control" },
  { key: "executive-briefing", name: "Executive Briefing" },
  { key: "command-center", name: "Command Center" },
  { key: "ai-universe", name: "AI Universe" },
  { key: "ai-staff-directory", name: "AI Staff Directory" },
  { key: "settings-config", name: "Settings & Config" },
  { key: "visual-builder", name: "Visual Website Builder" },
  { key: "content-studio", name: "Content Studio" },
  { key: "media-library", name: "Media Library" },
  { key: "seo-manager", name: "SEO Manager" },
  { key: "announcements", name: "Announcement Manager" },
  { key: "property-manager", name: "Property Manager" },
  { key: "property-intelligence", name: "Property Intelligence" },
  { key: "redevelopment-tracker", name: "Redevelopment Tracker" },
  { key: "rera-hub", name: "RERA Compliance Hub" },
  { key: "rental-manager", name: "Rental Manager" },
  { key: "commercial-desk", name: "Commercial Desk" },
  { key: "crm", name: "CRM" },
  { key: "lead-manager", name: "Lead Manager" },
  { key: "client-portal", name: "Client Portal" },
  { key: "proposal-generator", name: "Proposal Generator" },
  { key: "appointment-scheduler", name: "Appointment Scheduler" },
  { key: "finance-desk", name: "Finance Desk" },
  { key: "legal-vault", name: "Legal Vault" },
  { key: "tax-compliance", name: "Tax & Compliance" },
  { key: "invoice-billing", name: "Invoice & Billing" },
  { key: "document-center", name: "Document Center" },
  { key: "campaign-studio", name: "Campaign Studio" },
  { key: "whatsapp-manager", name: "WhatsApp Manager" },
  { key: "notification-center", name: "Notification Center" },
  { key: "review-manager", name: "Review Manager" },
  { key: "referral-tracker", name: "Referral Tracker" },
  { key: "event-manager", name: "Event Manager" },
  { key: "hospitality-hub", name: "Hospitality Hub" },
  { key: "calendar", name: "Calendar" },
  { key: "ngo-hub", name: "NGO Hub" },
  { key: "csr-dashboard", name: "CSR Dashboard" },
  { key: "sports-desk", name: "Sports Desk" },
  { key: "music-culture", name: "Music & Culture Hub" },
  { key: "tourism-planner", name: "Tourism Planner" },
  { key: "analytics-center", name: "Analytics Center" },
  { key: "market-intelligence", name: "Market Intelligence" },
  { key: "competitive-intel", name: "Competitive Intelligence" },
  { key: "platform-health", name: "Platform Health" },
  { key: "deployment-manager", name: "Deployment Manager" },
  { key: "api-manager", name: "API Manager" },
  { key: "security-app", name: "Security App" },
  { key: "legal-command", name: "Legalities App" },
];

const INPUT_CLS =
  "bg-[#06090f] border border-[#c9a84c]/30 text-white rounded px-3 py-2 w-full text-sm focus:outline-none focus:border-[#c9a84c]/60";
const CARD_CLS = "bg-[#0d1117] border border-[#c9a84c]/20 rounded-lg p-4";
const PRIMARY_BTN =
  "bg-[#c9a84c] text-black font-medium px-4 py-2 rounded hover:bg-[#b8963c] transition-colors text-sm";
const DANGER_BTN =
  "bg-red-900/40 text-red-400 border border-red-800 px-3 py-1.5 rounded text-sm hover:bg-red-900/60 transition-colors";
const GHOST_BTN =
  "bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30 px-3 py-1.5 rounded text-sm hover:bg-[#c9a84c]/20 transition-colors";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LocalStep extends Omit<TutorialStep, "id" | "order" | "stepIndex"> {
  id: bigint;
  order: bigint;
  stepIndex: bigint;
  isNew?: boolean;
}

// ─── Step Editor ──────────────────────────────────────────────────────────────

function StepEditor({
  appKey,
  appName,
  mode,
  onClose,
}: {
  appKey: string;
  appName: string;
  mode: "quick" | "full";
  onClose: () => void;
}) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const [steps, setSteps] = useState<LocalStep[] | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<bigint | null>(null);

  useQuery({
    queryKey: ["tutorial-steps", appKey, mode],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getTutorialSteps(appKey, mode);
      const sorted = [...raw].sort((a, b) => Number(a.order) - Number(b.order));
      setSteps(sorted as LocalStep[]);
      return sorted;
    },
    enabled: !!actor,
  });

  const saveMutation = useMutation({
    mutationFn: async (stepsToSave: LocalStep[]) => {
      if (!actor) throw new Error("No actor");
      const payload: TutorialStep[] = stepsToSave.map((s, i) => ({
        id: s.isNew ? BigInt(0) : s.id,
        appKey,
        mode,
        title: s.title,
        content: s.content,
        targetElement: s.targetElement,
        stepIndex: BigInt(i),
        order: BigInt(i),
        isActive: s.isActive,
      }));
      return actor.bulkSetTutorialSteps(appKey, mode, payload);
    },
    onSuccess: () => {
      toast.success("Tutorial steps saved successfully");
      qc.invalidateQueries({ queryKey: ["tutorial-steps", appKey, mode] });
      qc.invalidateQueries({ queryKey: ["tutorial-apps"] });
    },
    onError: () => toast.error("Failed to save steps"),
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.bulkSetTutorialSteps(appKey, mode, []);
    },
    onSuccess: () => {
      toast.success("Defaults restored");
      setSteps([]);
      qc.invalidateQueries({ queryKey: ["tutorial-steps", appKey, mode] });
    },
    onError: () => toast.error("Failed to reset steps"),
  });

  const updateStep = useCallback(
    (idx: number, field: keyof LocalStep, value: unknown) => {
      setSteps((prev) =>
        prev
          ? prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
          : prev,
      );
    },
    [],
  );

  const moveStep = useCallback((idx: number, dir: -1 | 1) => {
    setSteps((prev) => {
      if (!prev) return prev;
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  }, []);

  const addStep = useCallback(() => {
    setSteps((prev) => [
      ...(prev ?? []),
      {
        id: BigInt(Date.now()),
        appKey,
        mode,
        title: "",
        content: "",
        targetElement: undefined,
        stepIndex: BigInt((prev ?? []).length),
        order: BigInt((prev ?? []).length),
        isActive: true,
        isNew: true,
      },
    ]);
  }, [appKey, mode]);

  const removeStep = useCallback((idx: number) => {
    setSteps((prev) => (prev ? prev.filter((_, i) => i !== idx) : prev));
    setConfirmDeleteId(null);
  }, []);

  if (!steps) {
    return (
      <div className={`${CARD_CLS} mt-4`}>
        <div className="text-[#c9a84c]/60 text-sm animate-pulse">
          Loading steps...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${CARD_CLS} mt-4 space-y-4`}
      data-ocid="tutorial.step_editor"
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[#c9a84c] font-semibold text-sm">
            {appName}
          </span>
          <span className="text-white/40 text-xs ml-2">
            — {mode === "quick" ? "Quick Tutorial" : "Full Tutorial"}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={GHOST_BTN}
          data-ocid="tutorial.step_editor.close_button"
        >
          <X className="w-3.5 h-3.5 inline mr-1" />
          Close
        </button>
      </div>

      <div className="space-y-3">
        {steps.length === 0 && (
          <div
            className="text-white/40 text-sm text-center py-4"
            data-ocid="tutorial.step_editor.empty_state"
          >
            No steps yet. Add your first step below.
          </div>
        )}
        {steps.map((step, idx) => (
          <div
            key={String(step.id)}
            className="bg-[#06090f] border border-[#c9a84c]/15 rounded-lg p-3 space-y-2"
            data-ocid={`tutorial.step_editor.item.${idx + 1}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#c9a84c]/60 text-xs font-mono">
                Step {idx + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveStep(idx, -1)}
                  disabled={idx === 0}
                  className="p-1 rounded text-white/40 hover:text-[#c9a84c] disabled:opacity-30"
                  title="Move up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveStep(idx, 1)}
                  disabled={idx === steps.length - 1}
                  className="p-1 rounded text-white/40 hover:text-[#c9a84c] disabled:opacity-30"
                  title="Move down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                {confirmDeleteId === step.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => removeStep(idx)}
                      className="text-xs text-red-400 px-2 py-0.5 rounded border border-red-800 bg-red-900/40"
                      data-ocid={`tutorial.step_editor.confirm_button.${idx + 1}`}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-xs text-white/40 px-2 py-0.5"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(step.id)}
                    className="p-1 rounded text-red-400/60 hover:text-red-400"
                    title="Delete step"
                    data-ocid={`tutorial.step_editor.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {/* Active toggle */}
                <button
                  type="button"
                  onClick={() => updateStep(idx, "isActive", !step.isActive)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    step.isActive ? "bg-[#c9a84c]" : "bg-white/20"
                  }`}
                  title={step.isActive ? "Active" : "Inactive"}
                  data-ocid={`tutorial.step_editor.toggle.${idx + 1}`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      step.isActive ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <input
              type="text"
              value={step.title}
              onChange={(e) => updateStep(idx, "title", e.target.value)}
              maxLength={60}
              placeholder="Step title (max 60 chars)"
              className={INPUT_CLS}
              data-ocid={`tutorial.step_editor.input.${idx + 1}`}
            />
            <textarea
              value={step.content}
              onChange={(e) => updateStep(idx, "content", e.target.value)}
              maxLength={300}
              rows={2}
              placeholder="Step description (max 300 chars)"
              className={`${INPUT_CLS} resize-none`}
              data-ocid={`tutorial.step_editor.textarea.${idx + 1}`}
            />
            <input
              type="text"
              value={step.targetElement ?? ""}
              onChange={(e) =>
                updateStep(idx, "targetElement", e.target.value || undefined)
              }
              placeholder="CSS selector hint, e.g. .nav-menu (optional)"
              className={INPUT_CLS}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap pt-1">
        <button
          type="button"
          onClick={addStep}
          className={GHOST_BTN}
          data-ocid="tutorial.step_editor.add_button"
        >
          <Plus className="w-3.5 h-3.5 inline mr-1" />
          Add Step
        </button>
        <button
          type="button"
          onClick={() => saveMutation.mutate(steps)}
          disabled={saveMutation.isPending}
          className={PRIMARY_BTN}
          data-ocid="tutorial.step_editor.save_button"
        >
          {saveMutation.isPending ? (
            <RefreshCw className="w-3.5 h-3.5 inline mr-1 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5 inline mr-1" />
          )}
          Save All
        </button>
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                "Reset all steps to defaults? This cannot be undone.",
              )
            ) {
              resetMutation.mutate();
            }
          }}
          disabled={resetMutation.isPending}
          className={DANGER_BTN}
          data-ocid="tutorial.step_editor.reset_button"
        >
          <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}

// ─── Tab 1: App Tutorials ─────────────────────────────────────────────────────

function AppTutorialsTab() {
  const { actor, isFetching } = useActor(createActor);
  const [search, setSearch] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingMode, setEditingMode] = useState<"quick" | "full">("quick");

  const { data: backendApps = [] } = useQuery<TutorialApp[]>({
    queryKey: ["tutorial-apps"],
    queryFn: () => (actor ? actor.getAllTutorialApps() : Promise.resolve([])),
    enabled: !!actor && !isFetching,
  });

  const merged = HARDCODED_APPS.map((app) => {
    const backend = backendApps.find((b) => b.appKey === app.key);
    return {
      key: app.key,
      name: app.name,
      quickCount: backend ? Number(backend.quickStepCount) : null,
      fullCount: backend ? Number(backend.fullStepCount) : null,
    };
  });

  const filtered = merged.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4" data-ocid="tutorial.apps_tab">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search apps..."
          className={`${INPUT_CLS} max-w-xs`}
          data-ocid="tutorial.apps_tab.search_input"
        />
        <span className="text-white/40 text-xs">{filtered.length} apps</span>
      </div>

      <div className={CARD_CLS}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#c9a84c]/10">
              <th className="text-left text-[#c9a84c]/60 font-medium pb-2 pr-4">
                App
              </th>
              <th className="text-center text-[#c9a84c]/60 font-medium pb-2 px-4">
                Quick Steps
              </th>
              <th className="text-center text-[#c9a84c]/60 font-medium pb-2 px-4">
                Full Steps
              </th>
              <th className="text-right text-[#c9a84c]/60 font-medium pb-2 pl-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c9a84c]/5">
            {filtered.map((app, i) => (
              <tr
                key={app.key}
                className="hover:bg-[#c9a84c]/5 transition-colors"
                data-ocid={`tutorial.apps_tab.item.${i + 1}`}
              >
                <td className="py-2.5 pr-4 text-white font-medium">
                  {app.name}
                </td>
                <td className="py-2.5 px-4 text-center">
                  <span
                    className={
                      app.quickCount === null ? "text-white/30" : "text-white"
                    }
                  >
                    {app.quickCount === null ? "Defaults" : app.quickCount}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-center">
                  <span
                    className={
                      app.fullCount === null ? "text-white/30" : "text-white"
                    }
                  >
                    {app.fullCount === null ? "Defaults" : app.fullCount}
                  </span>
                </td>
                <td className="py-2.5 pl-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingKey(app.key);
                        setEditingMode("quick");
                      }}
                      className={GHOST_BTN}
                      data-ocid={`tutorial.apps_tab.edit_quick_button.${i + 1}`}
                    >
                      <Edit3 className="w-3 h-3 inline mr-1" />
                      Quick
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingKey(app.key);
                        setEditingMode("full");
                      }}
                      className={GHOST_BTN}
                      data-ocid={`tutorial.apps_tab.edit_full_button.${i + 1}`}
                    >
                      <BookOpen className="w-3 h-3 inline mr-1" />
                      Full
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingKey && (
        <StepEditor
          appKey={editingKey}
          appName={merged.find((a) => a.key === editingKey)?.name ?? editingKey}
          mode={editingMode}
          onClose={() => setEditingKey(null)}
        />
      )}
    </div>
  );
}

// ─── Tab 2: AI Suggestions ────────────────────────────────────────────────────

function AISuggestionsTab() {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const { data: suggestions = [], isLoading } = useQuery<TutorialSuggestion[]>({
    queryKey: ["tutorial-suggestions"],
    queryFn: () =>
      actor ? actor.getTutorialSuggestions() : Promise.resolve([]),
    enabled: !!actor && !isFetching,
  });

  const approveMutation = useMutation({
    mutationFn: (id: bigint) =>
      actor ? actor.approveTutorialSuggestion(id) : Promise.reject(),
    onSuccess: () => {
      toast.success("Suggestion approved and applied");
      qc.invalidateQueries({ queryKey: ["tutorial-suggestions"] });
    },
    onError: () => toast.error("Failed to approve suggestion"),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: bigint) =>
      actor ? actor.rejectTutorialSuggestion(id) : Promise.reject(),
    onSuccess: () => {
      toast.success("Suggestion rejected");
      qc.invalidateQueries({ queryKey: ["tutorial-suggestions"] });
    },
    onError: () => toast.error("Failed to reject suggestion"),
  });

  const statusBadge = (status: string) => {
    if (status === "approved")
      return (
        <Badge className="bg-green-900/50 text-green-400 border-green-700 text-xs">
          Approved
        </Badge>
      );
    if (status === "rejected")
      return (
        <Badge className="bg-white/10 text-white/40 border-white/20 text-xs">
          Rejected
        </Badge>
      );
    return (
      <Badge className="bg-yellow-900/50 text-yellow-400 border-yellow-700 text-xs">
        Pending
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="text-[#c9a84c]/60 text-sm animate-pulse py-4">
        Loading suggestions...
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="tutorial.suggestions_tab">
      {suggestions.length === 0 ? (
        <div
          className={`${CARD_CLS} text-center py-10`}
          data-ocid="tutorial.suggestions_tab.empty_state"
        >
          <Wand2 className="w-8 h-8 text-[#c9a84c]/30 mx-auto mb-3" />
          <p className="text-white/50 text-sm">No pending suggestions.</p>
          <p className="text-white/30 text-xs mt-1">
            Tutorial AIs are reviewing content and will suggest improvements
            here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((s, i) => (
            <div
              key={String(s.id)}
              className={`${CARD_CLS} space-y-3`}
              data-ocid={`tutorial.suggestions_tab.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {statusBadge(s.status)}
                  <span className="text-[#c9a84c] text-xs font-medium">
                    {HARDCODED_APPS.find((a) => a.key === s.appKey)?.name ??
                      s.appKey}
                  </span>
                  <span className="text-white/30 text-xs">
                    • {s.mode === "quick" ? "Quick Tutorial" : "Full Tutorial"}{" "}
                    • Step {Number(s.stepIndex) + 1}
                  </span>
                </div>
                {s.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => approveMutation.mutate(s.id)}
                      disabled={approveMutation.isPending}
                      className="flex items-center gap-1 bg-green-900/40 text-green-400 border border-green-700 px-3 py-1.5 rounded text-xs hover:bg-green-900/60 transition-colors"
                      data-ocid={`tutorial.suggestions_tab.confirm_button.${i + 1}`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectMutation.mutate(s.id)}
                      disabled={rejectMutation.isPending}
                      className={`${DANGER_BTN} flex items-center gap-1`}
                      data-ocid={`tutorial.suggestions_tab.delete_button.${i + 1}`}
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-[#06090f] rounded p-3 text-white/80 text-sm">
                {s.suggestedContent}
              </div>

              <div className="text-white/40 text-xs italic">{s.reason}</div>

              <div className="flex items-center gap-1.5 text-[#c9a84c]/50 text-xs">
                <Wand2 className="w-3 h-3" />
                This suggestion was generated by Tutorial Improvement AI and
                pre-reviewed by Aria (Caffeine AI)
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab 3: Completion Stats ──────────────────────────────────────────────────

function CompletionStatsTab() {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const { data: stats = [], isLoading } = useQuery<
    { completions: bigint; skips: bigint; appKey: string }[]
  >({
    queryKey: ["tutorial-stats"],
    queryFn: () => (actor ? actor.getTutorialStats() : Promise.resolve([])),
    enabled: !!actor && !isFetching,
  });

  const resetMutation = useMutation({
    mutationFn: (appKey: string) =>
      actor ? actor.resetTutorialCompletion("all", appKey) : Promise.reject(),
    onSuccess: (_, appKey) => {
      toast.success(`Tutorial reset for all users — ${appKey}`);
      qc.invalidateQueries({ queryKey: ["tutorial-stats"] });
    },
    onError: () => toast.error("Failed to reset tutorial"),
  });

  const totalCompletions = stats.reduce(
    (sum, s) => sum + Number(s.completions),
    0,
  );
  const totalSkips = stats.reduce((sum, s) => sum + Number(s.skips), 0);
  const totalAll = totalCompletions + totalSkips;
  const overallSkipRate =
    totalAll === 0 ? 0 : Math.round((totalSkips / totalAll) * 100);

  const merged = stats.map((s) => ({
    ...s,
    name: HARDCODED_APPS.find((a) => a.key === s.appKey)?.name ?? s.appKey,
    skipRate:
      Number(s.completions) + Number(s.skips) === 0
        ? 0
        : Math.round(
            (Number(s.skips) / (Number(s.completions) + Number(s.skips))) * 100,
          ),
  }));

  return (
    <div className="space-y-4" data-ocid="tutorial.stats_tab">
      {/* Summary card */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Completions", value: totalCompletions },
          { label: "Total Skips", value: totalSkips },
          { label: "Overall Skip Rate", value: `${overallSkipRate}%` },
        ].map((stat) => (
          <div key={stat.label} className={CARD_CLS}>
            <div className="text-[#c9a84c] text-lg font-bold">{stat.value}</div>
            <div className="text-white/50 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="text-[#c9a84c]/60 text-sm animate-pulse py-4">
          Loading stats...
        </div>
      ) : merged.length === 0 ? (
        <div
          className={`${CARD_CLS} text-center py-10`}
          data-ocid="tutorial.stats_tab.empty_state"
        >
          <p className="text-white/40 text-sm">
            No tutorial activity recorded yet.
          </p>
        </div>
      ) : (
        <div className={CARD_CLS}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#c9a84c]/10">
                <th className="text-left text-[#c9a84c]/60 font-medium pb-2 pr-4">
                  App
                </th>
                <th className="text-center text-[#c9a84c]/60 font-medium pb-2 px-3">
                  Completions
                </th>
                <th className="text-center text-[#c9a84c]/60 font-medium pb-2 px-3">
                  Skips
                </th>
                <th className="text-center text-[#c9a84c]/60 font-medium pb-2 px-3">
                  Skip Rate
                </th>
                <th className="text-right text-[#c9a84c]/60 font-medium pb-2 pl-3">
                  Reset
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c9a84c]/5">
              {merged.map((row, i) => (
                <tr
                  key={row.appKey}
                  className="hover:bg-[#c9a84c]/5 transition-colors"
                  data-ocid={`tutorial.stats_tab.item.${i + 1}`}
                >
                  <td className="py-2.5 pr-4 text-white">{row.name}</td>
                  <td className="py-2.5 px-3 text-center text-white">
                    {Number(row.completions)}
                  </td>
                  <td className="py-2.5 px-3 text-center text-white/70">
                    {Number(row.skips)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        row.skipRate >= 70
                          ? "bg-red-900/40 text-red-400"
                          : row.skipRate >= 40
                            ? "bg-yellow-900/40 text-yellow-400"
                            : "bg-green-900/40 text-green-400"
                      }`}
                    >
                      {row.skipRate}%
                    </span>
                  </td>
                  <td className="py-2.5 pl-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Reset tutorial for all users — ${row.name}?`,
                          )
                        ) {
                          resetMutation.mutate(row.appKey);
                        }
                      }}
                      disabled={resetMutation.isPending}
                      className={DANGER_BTN}
                      data-ocid={`tutorial.stats_tab.delete_button.${i + 1}`}
                    >
                      <RefreshCw className="w-3 h-3 inline mr-1" />
                      Reset
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Tab 4: Observer Codes ────────────────────────────────────────────────────

const PERMISSION_OPTIONS = [
  { id: "ai_universe", label: "AI Universe Status" },
  { id: "platform_overview", label: "Platform Overview" },
  { id: "security_status", label: "Security Status" },
  { id: "operations_pulse", label: "Operations Pulse" },
  { id: "full_access", label: "Full Access" },
];

function ObserverCodesTab() {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const [createOpen, setCreateOpen] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [newCodeResult, setNewCodeResult] = useState<string | null>(null);
  const [confirmRevokeId, setConfirmRevokeId] = useState<bigint | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<bigint | null>(null);

  // Form state
  const [formLabel, setFormLabel] = useState("");
  const [formPerms, setFormPerms] = useState<string[]>([]);
  const [formExpiry, setFormExpiry] = useState("permanent");
  const [formHours, setFormHours] = useState("24");

  const { data: codes = [], isLoading } = useQuery<ObserverCode[]>({
    queryKey: ["observer-codes"],
    queryFn: () => (actor ? actor.getAllObserverCodes() : Promise.resolve([])),
    enabled: !!actor && !isFetching,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const durationHours: bigint | null =
        formExpiry === "timed"
          ? BigInt(Number.parseInt(formHours) || 24)
          : null;
      return actor.createObserverCode(
        formLabel,
        formPerms,
        formExpiry,
        durationHours as any,
      );
    },
    onSuccess: (result) => {
      setNewCodeResult(result.code);
      toast.success("Observer code created");
      qc.invalidateQueries({ queryKey: ["observer-codes"] });
    },
    onError: () => toast.error("Failed to create observer code"),
  });

  const revokeMutation = useMutation({
    mutationFn: (id: bigint) =>
      actor ? actor.revokeObserverCode(id as any) : Promise.reject(),
    onSuccess: () => {
      toast.success("Code revoked");
      qc.invalidateQueries({ queryKey: ["observer-codes"] });
    },
    onError: () => toast.error("Failed to revoke code"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: bigint) =>
      actor ? actor.deleteObserverCode(id) : Promise.reject(),
    onSuccess: () => {
      toast.success("Code deleted");
      qc.invalidateQueries({ queryKey: ["observer-codes"] });
    },
    onError: () => toast.error("Failed to delete code"),
  });

  const copyLink = (code: string) => {
    const url = `${window.location.origin}/observe?code=${code}`;
    navigator.clipboard.writeText(url).then(() => toast.success("Link copied"));
  };

  const fmtDate = (ts?: bigint) => {
    if (!ts) return "—";
    return new Date(Number(ts) / 1_000_000).toLocaleDateString();
  };

  const resetForm = () => {
    setFormLabel("");
    setFormPerms([]);
    setFormExpiry("permanent");
    setFormHours("24");
    setNewCodeResult(null);
  };

  return (
    <div className="space-y-4" data-ocid="tutorial.observer_tab">
      <div className="flex items-center justify-between">
        <p className="text-white/50 text-sm">
          Observer codes allow secure, read-only view access to the MSTC
          universe.
        </p>
        <Dialog
          open={createOpen}
          onOpenChange={(open) => {
            setCreateOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <button
              type="button"
              className={PRIMARY_BTN}
              data-ocid="tutorial.observer_tab.open_modal_button"
            >
              <Plus className="w-3.5 h-3.5 inline mr-1" />
              Create New Code
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#0d1117] border border-[#c9a84c]/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#c9a84c]">
                Create Observer Code
              </DialogTitle>
            </DialogHeader>

            {newCodeResult ? (
              <div className="space-y-4">
                <p className="text-white/60 text-sm">
                  Your code has been created. Share this with the observer:
                </p>
                <div className="bg-[#06090f] border border-[#c9a84c]/40 rounded-lg p-4 text-center">
                  <div className="text-[#c9a84c] text-2xl font-bold font-mono tracking-widest">
                    {newCodeResult}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard
                        .writeText(newCodeResult)
                        .then(() => toast.success("Code copied"))
                    }
                    className="mt-2 text-xs text-[#c9a84c]/60 hover:text-[#c9a84c] flex items-center gap-1 mx-auto"
                    data-ocid="tutorial.observer_tab.copy_button"
                  >
                    <Copy className="w-3 h-3" />
                    Copy code
                  </button>
                </div>
                <p className="text-white/30 text-xs">
                  Observer URL: {window.location.origin}/observe?code=
                  {newCodeResult}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCreateOpen(false);
                    resetForm();
                  }}
                  className={`${PRIMARY_BTN} w-full`}
                  data-ocid="tutorial.observer_tab.close_button"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-xs mb-1 block">
                    Label (required)
                  </label>
                  <input
                    type="text"
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    placeholder="e.g. CA Review, Investor Access"
                    className={INPUT_CLS}
                    data-ocid="tutorial.observer_tab.input"
                  />
                </div>

                <div>
                  <label className="text-white/60 text-xs mb-2 block">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {PERMISSION_OPTIONS.map((perm) => (
                      <label
                        key={perm.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formPerms.includes(perm.id)}
                          onChange={(e) =>
                            setFormPerms((prev) =>
                              e.target.checked
                                ? [...prev, perm.id]
                                : prev.filter((p) => p !== perm.id),
                            )
                          }
                          className="accent-[#c9a84c]"
                          data-ocid="tutorial.observer_tab.checkbox"
                        />
                        <span className="text-white/80 text-sm">
                          {perm.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-xs mb-1 block">
                    Expiry
                  </label>
                  <select
                    value={formExpiry}
                    onChange={(e) => setFormExpiry(e.target.value)}
                    className={INPUT_CLS}
                    data-ocid="tutorial.observer_tab.select"
                  >
                    <option value="permanent">Permanent</option>
                    <option value="timed">Timed</option>
                    <option value="single-use">Single-use</option>
                  </select>
                </div>

                {formExpiry === "timed" && (
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">
                      Duration (hours)
                    </label>
                    <input
                      type="number"
                      value={formHours}
                      onChange={(e) => setFormHours(e.target.value)}
                      min="1"
                      className={INPUT_CLS}
                      data-ocid="tutorial.observer_tab.hours_input"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => createMutation.mutate()}
                  disabled={!formLabel.trim() || createMutation.isPending}
                  className={`${PRIMARY_BTN} w-full`}
                  data-ocid="tutorial.observer_tab.submit_button"
                >
                  {createMutation.isPending ? (
                    <RefreshCw className="w-3.5 h-3.5 inline mr-1 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5 inline mr-1" />
                  )}
                  Create Code
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={!!qrCode} onOpenChange={() => setQrCode(null)}>
        <DialogContent
          className="bg-[#0d1117] border border-[#c9a84c]/20 text-white max-w-sm"
          data-ocid="tutorial.observer_tab.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-[#c9a84c]">
              Observer QR Code
            </DialogTitle>
          </DialogHeader>
          {qrCode && (
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG
                  value={`${window.location.origin}/observe?code=${qrCode}`}
                  size={200}
                />
              </div>
              <p className="text-white/40 text-xs text-center">
                {window.location.origin}/observe?code={qrCode}
              </p>
              <button
                type="button"
                onClick={() => copyLink(qrCode)}
                className={GHOST_BTN}
                data-ocid="tutorial.observer_tab.copy_button"
              >
                <Copy className="w-3.5 h-3.5 inline mr-1" />
                Copy Link
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="text-[#c9a84c]/60 text-sm animate-pulse py-4">
          Loading codes...
        </div>
      ) : codes.length === 0 ? (
        <div
          className={`${CARD_CLS} text-center py-10`}
          data-ocid="tutorial.observer_tab.empty_state"
        >
          <Shield className="w-8 h-8 text-[#c9a84c]/30 mx-auto mb-3" />
          <p className="text-white/50 text-sm">No observer codes yet.</p>
          <p className="text-white/30 text-xs mt-1">
            Create a code to grant read-only access.
          </p>
        </div>
      ) : (
        <div className={CARD_CLS}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#c9a84c]/10">
                <th className="text-left text-[#c9a84c]/60 font-medium pb-2 pr-3">
                  Code
                </th>
                <th className="text-left text-[#c9a84c]/60 font-medium pb-2 pr-3">
                  Label
                </th>
                <th className="text-left text-[#c9a84c]/60 font-medium pb-2 pr-3 hidden md:table-cell">
                  Permissions
                </th>
                <th className="text-center text-[#c9a84c]/60 font-medium pb-2 px-2 hidden sm:table-cell">
                  Uses
                </th>
                <th className="text-center text-[#c9a84c]/60 font-medium pb-2 px-2 hidden md:table-cell">
                  Expiry
                </th>
                <th className="text-center text-[#c9a84c]/60 font-medium pb-2 px-2">
                  Status
                </th>
                <th className="text-right text-[#c9a84c]/60 font-medium pb-2 pl-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c9a84c]/5">
              {codes.map((code, i) => (
                <tr
                  key={String(code.id)}
                  className={`hover:bg-[#c9a84c]/5 transition-colors ${
                    !code.isActive ? "opacity-50" : ""
                  }`}
                  data-ocid={`tutorial.observer_tab.item.${i + 1}`}
                >
                  <td className="py-2.5 pr-3">
                    <code
                      className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                        code.isActive
                          ? "bg-[#c9a84c]/10 text-[#c9a84c] line-through-none"
                          : "bg-white/5 text-white/30 line-through"
                      }`}
                    >
                      {code.code}
                    </code>
                  </td>
                  <td className="py-2.5 pr-3 text-white">{code.labelText}</td>
                  <td className="py-2.5 pr-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {code.permissions.map((p) => (
                        <span
                          key={p}
                          className="text-xs bg-[#c9a84c]/10 text-[#c9a84c]/70 px-1.5 py-0.5 rounded"
                        >
                          {PERMISSION_OPTIONS.find((o) => o.id === p)?.label ??
                            p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center text-white/60 hidden sm:table-cell">
                    {Number(code.useCount)}
                  </td>
                  <td className="py-2.5 px-2 text-center text-white/50 text-xs hidden md:table-cell">
                    {code.expiryType === "permanent" ? (
                      <span className="text-green-400/60">Permanent</span>
                    ) : code.expiryType === "single-use" ? (
                      <span className="text-yellow-400/60">Single-use</span>
                    ) : (
                      fmtDate(code.expiresAt)
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {code.isActive ? (
                      <Badge className="bg-green-900/40 text-green-400 border-green-700 text-xs">
                        <Eye className="w-2.5 h-2.5 inline mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-white/10 text-white/30 border-white/20 text-xs">
                        <EyeOff className="w-2.5 h-2.5 inline mr-1" />
                        Revoked
                      </Badge>
                    )}
                  </td>
                  <td className="py-2.5 pl-3">
                    <div className="flex justify-end gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => copyLink(code.code)}
                        className={GHOST_BTN}
                        title="Copy link"
                        data-ocid={`tutorial.observer_tab.secondary_button.${i + 1}`}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setQrCode(code.code)}
                        className={GHOST_BTN}
                        title="QR Code"
                        data-ocid={`tutorial.observer_tab.qr_button.${i + 1}`}
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                      {code.isActive &&
                        (confirmRevokeId === code.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                revokeMutation.mutate(code.id);
                                setConfirmRevokeId(null);
                              }}
                              className="text-xs text-red-400 px-2 py-0.5 rounded border border-red-800 bg-red-900/40"
                              data-ocid={`tutorial.observer_tab.confirm_button.${i + 1}`}
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmRevokeId(null)}
                              className="text-xs text-white/40 px-2 py-0.5"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmRevokeId(code.id)}
                            className={DANGER_BTN}
                            title="Revoke"
                            data-ocid={`tutorial.observer_tab.edit_button.${i + 1}`}
                          >
                            <EyeOff className="w-3.5 h-3.5 inline mr-1" />
                            Revoke
                          </button>
                        ))}
                      {confirmDeleteId === code.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              deleteMutation.mutate(code.id);
                              setConfirmDeleteId(null);
                            }}
                            className="text-xs text-red-400 px-2 py-0.5 rounded border border-red-800 bg-red-900/40"
                          >
                            Delete?
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-xs text-white/40 px-2 py-0.5"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(code.id)}
                          className={DANGER_BTN}
                          title="Delete"
                          data-ocid={`tutorial.observer_tab.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AdminTutorialManagerTab() {
  return (
    <div className="space-y-6" data-ocid="tutorial.panel">
      <div>
        <h2 className="text-lg font-semibold text-[#c9a84c]">
          Tutorial Manager
        </h2>
        <p className="text-white/40 text-sm mt-0.5">
          Manage tutorial steps, AI suggestions, completion stats, and observer
          access codes.
        </p>
      </div>

      <Tabs defaultValue="apps">
        <TabsList className="bg-[#0d1117] border border-[#c9a84c]/20 p-1 mb-6">
          <TabsTrigger
            value="apps"
            className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-black text-white/60 text-sm"
            data-ocid="tutorial.apps.tab"
          >
            <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />
            App Tutorials
          </TabsTrigger>
          <TabsTrigger
            value="suggestions"
            className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-black text-white/60 text-sm"
            data-ocid="tutorial.suggestions.tab"
          >
            <Wand2 className="w-3.5 h-3.5 inline mr-1.5" />
            AI Suggestions
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-black text-white/60 text-sm"
            data-ocid="tutorial.stats.tab"
          >
            <Users className="w-3.5 h-3.5 inline mr-1.5" />
            Completion Stats
          </TabsTrigger>
          <TabsTrigger
            value="observer"
            className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-black text-white/60 text-sm"
            data-ocid="tutorial.observer.tab"
          >
            <Shield className="w-3.5 h-3.5 inline mr-1.5" />
            Observer Codes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="apps">
          <AppTutorialsTab />
        </TabsContent>
        <TabsContent value="suggestions">
          <AISuggestionsTab />
        </TabsContent>
        <TabsContent value="stats">
          <CompletionStatsTab />
        </TabsContent>
        <TabsContent value="observer">
          <ObserverCodesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
