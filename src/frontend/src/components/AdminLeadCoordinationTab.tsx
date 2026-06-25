import {
  CheckCircle2,
  Clock,
  Filter,
  GitBranch,
  Loader2,
  Phone,
  Plus,
  Sparkles,
  Trash2,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type PipelineStepStatus = "pending" | "active" | "done" | "skipped";

interface PipelineStep {
  key: string;
  agent: string;
  result: string;
  status: PipelineStepStatus;
}

interface CoordinationEvent {
  id: string;
  leadName: string;
  phone: string;
  submittedAt: string;
  score: number;
  overallStatus: "processing" | "completed" | "low-score";
  steps: PipelineStep[];
}

type DateFilter = "today" | "week" | "month" | "all";
type ScoreFilter = "all" | "1-4" | "5-7" | "8-10";

// ── Constants ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "ai-coordination-events";

const SAMPLE_EVENTS: CoordinationEvent[] = [
  {
    id: "evt-1",
    leadName: "Rajesh Patel",
    phone: "+91 98765 43210",
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    score: 9,
    overallStatus: "completed",
    steps: [
      {
        key: "qualify",
        agent: "Lead Qualifier AI",
        result: "Score: 9/10 — High Intent",
        status: "done",
      },
      {
        key: "match",
        agent: "Property Matcher",
        result: "14 properties found",
        status: "done",
      },
      {
        key: "proposal",
        agent: "Proposal Generator",
        result: "Draft ready",
        status: "done",
      },
      {
        key: "comms",
        agent: "Client Communication AI",
        result: "Message drafted",
        status: "done",
      },
      {
        key: "followup",
        agent: "Day-1 Follow-up",
        result: "Scheduled for tomorrow 10am",
        status: "done",
      },
    ],
  },
  {
    id: "evt-2",
    leadName: "Priya Sharma",
    phone: "+91 91234 56789",
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    score: 7,
    overallStatus: "completed",
    steps: [
      {
        key: "qualify",
        agent: "Lead Qualifier AI",
        result: "Score: 7/10 — Moderate Intent",
        status: "done",
      },
      {
        key: "match",
        agent: "Property Matcher",
        result: "8 properties found",
        status: "done",
      },
      {
        key: "proposal",
        agent: "Proposal Generator",
        result: "Draft ready",
        status: "done",
      },
      {
        key: "comms",
        agent: "Client Communication AI",
        result: "Message drafted",
        status: "done",
      },
      {
        key: "followup",
        agent: "Day-1 Follow-up",
        result: "Scheduled for tomorrow 2pm",
        status: "done",
      },
    ],
  },
  {
    id: "evt-3",
    leadName: "Amit Mehta",
    phone: "+91 87654 32109",
    submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    score: 3,
    overallStatus: "low-score",
    steps: [
      {
        key: "qualify",
        agent: "Lead Qualifier AI",
        result: "Score: 3/10 — Low Intent",
        status: "done",
      },
      {
        key: "match",
        agent: "Property Matcher",
        result: "Skipped (score < 7)",
        status: "skipped",
      },
      {
        key: "proposal",
        agent: "Proposal Generator",
        result: "Skipped",
        status: "skipped",
      },
      {
        key: "comms",
        agent: "Client Communication AI",
        result: "Basic follow-up drafted",
        status: "done",
      },
      {
        key: "followup",
        agent: "Day-1 Follow-up",
        result: "Scheduled for next week",
        status: "done",
      },
    ],
  },
  {
    id: "evt-4",
    leadName: "Sunita Joshi",
    phone: "+91 99887 76655",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    score: 8,
    overallStatus: "completed",
    steps: [
      {
        key: "qualify",
        agent: "Lead Qualifier AI",
        result: "Score: 8/10 — High Intent",
        status: "done",
      },
      {
        key: "match",
        agent: "Property Matcher",
        result: "11 properties found",
        status: "done",
      },
      {
        key: "proposal",
        agent: "Proposal Generator",
        result: "Draft ready",
        status: "done",
      },
      {
        key: "comms",
        agent: "Client Communication AI",
        result: "Message drafted",
        status: "done",
      },
      {
        key: "followup",
        agent: "Day-1 Follow-up",
        result: "Completed — client responded",
        status: "done",
      },
    ],
  },
  {
    id: "evt-5",
    leadName: "Vikram Shah",
    phone: "+91 78965 41230",
    submittedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    score: 6,
    overallStatus: "processing",
    steps: [
      {
        key: "qualify",
        agent: "Lead Qualifier AI",
        result: "Score: 6/10 — Moderate",
        status: "done",
      },
      {
        key: "match",
        agent: "Property Matcher",
        result: "5 properties found",
        status: "done",
      },
      {
        key: "proposal",
        agent: "Proposal Generator",
        result: "Generating...",
        status: "active",
      },
      {
        key: "comms",
        agent: "Client Communication AI",
        result: "Waiting...",
        status: "pending",
      },
      {
        key: "followup",
        agent: "Day-1 Follow-up",
        result: "Pending",
        status: "pending",
      },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function loadEvents(): CoordinationEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CoordinationEvent[];
      if (parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_EVENTS));
  return SAMPLE_EVENTS;
}

function saveEvents(events: CoordinationEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function scoreBorder(score: number) {
  if (score >= 8) return "border-yellow-500/50";
  if (score >= 5) return "border-white/20";
  return "border-white/8";
}

function scoreBadgeClass(score: number) {
  if (score >= 8)
    return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
  if (score >= 5) return "bg-white/10 text-white/70 border border-white/20";
  return "bg-red-500/10 text-red-400/70 border border-red-500/20";
}

// ── Step icon ───────────────────────────────────────────────────────────────

function StepIcon({ status }: { status: PipelineStepStatus }) {
  if (status === "done")
    return <CheckCircle2 size={14} className="text-green-400 shrink-0" />;
  if (status === "active")
    return (
      <Loader2 size={14} className="text-yellow-400 animate-spin shrink-0" />
    );
  if (status === "skipped")
    return <XCircle size={14} className="text-muted-foreground/40 shrink-0" />;
  return <Clock size={14} className="text-muted-foreground/40 shrink-0" />;
}

// ── Pipeline card ────────────────────────────────────────────────────────────

function CoordinationCard({
  event,
  index,
  onDelete,
}: {
  event: CoordinationEvent;
  index: number;
  onDelete: (id: string) => void;
}) {
  const statusColors = {
    completed: "text-green-400 bg-green-500/10 border-green-500/20",
    processing: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    "low-score": "text-red-400/80 bg-red-500/10 border-red-500/20",
  };

  return (
    <div
      className={`rounded-xl border ${scoreBorder(event.score)} bg-[#0d0f14] p-4 sm:p-5 relative group`}
      data-ocid={`lead-coordination.event.${index + 1}`}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
            <User size={16} className="text-yellow-400" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">
              {event.leadName}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Phone size={10} />
              {event.phone}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${scoreBadgeClass(event.score)}`}
          >
            <Sparkles size={10} /> {event.score}/10
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[event.overallStatus]}`}
          >
            {event.overallStatus === "processing"
              ? "Processing"
              : event.overallStatus === "completed"
                ? "Completed"
                : "Low Score"}
          </span>
          <button
            type="button"
            onClick={() => onDelete(event.id)}
            className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-red-400/50 hover:text-red-400 hover:bg-red-500/10"
            aria-label="Delete event"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Submitted at */}
      <p className="text-xs text-muted-foreground/60 mb-3">
        Submitted {relativeTime(event.submittedAt)} &middot;{" "}
        {new Date(event.submittedAt).toLocaleString("en-IN", {
          dateStyle: "short",
          timeStyle: "short",
        })}
      </p>

      {/* Pipeline steps */}
      <div className="space-y-2">
        {event.steps.map((step) => (
          <div key={step.key} className="flex items-start gap-2.5">
            <StepIcon status={step.status} />
            <div className="min-w-0">
              <span
                className={`text-xs font-medium ${
                  step.status === "done"
                    ? "text-foreground/80"
                    : step.status === "active"
                      ? "text-yellow-300"
                      : "text-muted-foreground/40"
                }`}
              >
                {step.agent}
              </span>
              <span className="text-xs text-muted-foreground/50 ml-1.5">
                &mdash; {step.result}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Simulate form ────────────────────────────────────────────────────────────

function buildInitialEvent(name: string, phone: string): CoordinationEvent {
  return {
    id: `evt-${Date.now()}`,
    leadName: name,
    phone,
    submittedAt: new Date().toISOString(),
    score: 0,
    overallStatus: "processing",
    steps: [
      {
        key: "qualify",
        agent: "Lead Qualifier AI",
        result: "Analysing...",
        status: "active",
      },
      {
        key: "match",
        agent: "Property Matcher",
        result: "Waiting...",
        status: "pending",
      },
      {
        key: "proposal",
        agent: "Proposal Generator",
        result: "Waiting...",
        status: "pending",
      },
      {
        key: "comms",
        agent: "Client Communication AI",
        result: "Waiting...",
        status: "pending",
      },
      {
        key: "followup",
        agent: "Day-1 Follow-up",
        result: "Pending",
        status: "pending",
      },
    ],
  };
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminLeadCoordinationTab() {
  const [events, setEvents] = useState<CoordinationEvent[]>(loadEvents);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "processing" | "low-score"
  >("all");
  const [showSimulate, setShowSimulate] = useState(false);
  const [simName, setSimName] = useState("");
  const [simPhone, setSimPhone] = useState("");
  const [simulating, setSimulating] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  // Filter logic
  const filtered = events.filter((e) => {
    const now = Date.now();
    const evtTime = new Date(e.submittedAt).getTime();
    if (dateFilter === "today" && now - evtTime > 86400000) return false;
    if (dateFilter === "week" && now - evtTime > 7 * 86400000) return false;
    if (dateFilter === "month" && now - evtTime > 30 * 86400000) return false;
    if (scoreFilter === "1-4" && (e.score < 1 || e.score > 4)) return false;
    if (scoreFilter === "5-7" && (e.score < 5 || e.score > 7)) return false;
    if (scoreFilter === "8-10" && (e.score < 8 || e.score > 10)) return false;
    if (statusFilter !== "all" && e.overallStatus !== statusFilter)
      return false;
    return true;
  });

  const animateNewEvent = useCallback(async (base: CoordinationEvent) => {
    const score = Math.floor(Math.random() * 8) + 3; // 3-10
    const highScore = score >= 7;
    const followupDate = new Date(Date.now() + 86400000).toLocaleString(
      "en-IN",
      { dateStyle: "short", timeStyle: "short" },
    );

    const finalSteps: PipelineStep[] = [
      {
        key: "qualify",
        agent: "Lead Qualifier AI",
        result: `Score: ${score}/10 — ${score >= 8 ? "High" : score >= 5 ? "Moderate" : "Low"} Intent`,
        status: "done",
      },
      {
        key: "match",
        agent: "Property Matcher",
        result: highScore
          ? `${Math.floor(Math.random() * 10) + 5} properties found`
          : "Skipped (score < 7)",
        status: highScore ? "done" : "skipped",
      },
      {
        key: "proposal",
        agent: "Proposal Generator",
        result: highScore ? "Draft ready" : "Skipped",
        status: highScore ? "done" : "skipped",
      },
      {
        key: "comms",
        agent: "Client Communication AI",
        result: "Message drafted",
        status: "done",
      },
      {
        key: "followup",
        agent: "Day-1 Follow-up",
        result: `Scheduled for ${followupDate}`,
        status: "done",
      },
    ];

    for (let i = 0; i < finalSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 520));
      setEvents((prev) =>
        prev.map((ev) => {
          if (ev.id !== base.id) return ev;
          const newSteps = ev.steps.map((s, si) => {
            if (si < i) return { ...finalSteps[si] };
            if (si === i)
              return {
                ...finalSteps[i],
                status: "active" as PipelineStepStatus,
              };
            return s;
          });
          return { ...ev, steps: newSteps };
        }),
      );
    }

    await new Promise((r) => setTimeout(r, 520));

    setEvents((prev) => {
      const updated = prev.map((ev) => {
        if (ev.id !== base.id) return ev;
        return {
          ...ev,
          score,
          overallStatus: (score < 5
            ? "low-score"
            : "completed") as CoordinationEvent["overallStatus"],
          steps: finalSteps,
        };
      });
      saveEvents(updated);
      return updated;
    });
  }, []);

  async function handleSimulate(e: React.FormEvent) {
    e.preventDefault();
    if (!simName.trim() || !simPhone.trim()) return;
    const base = buildInitialEvent(simName.trim(), simPhone.trim());
    setEvents((prev) => {
      const updated = [base, ...prev];
      saveEvents(updated);
      return updated;
    });
    setSimName("");
    setSimPhone("");
    setShowSimulate(false);
    setSimulating(true);
    await animateNewEvent(base);
    setSimulating(false);
  }

  function handleDelete(id: string) {
    setEvents((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveEvents(updated);
      return updated;
    });
  }

  function handleClearAll() {
    setEvents([]);
    localStorage.removeItem(STORAGE_KEY);
    setConfirmClear(false);
  }

  // Sync changes to localStorage on every update
  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const filterBtnClass = (active: boolean) =>
    `px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
      active
        ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
        : "bg-transparent text-muted-foreground border border-white/10 hover:bg-white/5"
    }`;

  return (
    <div className="space-y-6 pb-10" data-ocid="lead-coordination.page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-yellow-400"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Lead Coordination AI
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Agent pipeline visualization
          </p>
          <p className="text-xs text-muted-foreground/60 mt-0.5">
            {events.length} total events &middot;{" "}
            {events.filter((e) => e.overallStatus === "completed").length}{" "}
            completed
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowSimulate((v) => !v)}
            disabled={simulating}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30 transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            data-ocid="lead-coordination.simulate_button"
          >
            {simulating ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Plus size={15} />
            )}
            Simulate New Lead
          </button>
          {events.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-500/20 text-red-400/70 hover:bg-red-500/10 transition-colors text-sm"
              data-ocid="lead-coordination.clear_button"
            >
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Simulate form */}
      {showSimulate && (
        <div
          className="rounded-xl border border-yellow-700/30 bg-[#111318] p-5"
          data-ocid="lead-coordination.simulate_form"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GitBranch size={16} className="text-yellow-400" />
              <h3 className="text-sm font-semibold text-yellow-300">
                Simulate Lead Submission
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowSimulate(false)}
              className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <form
            onSubmit={handleSimulate}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-1">
                Lead Name
              </label>
              <input
                required
                value={simName}
                onChange={(e) => setSimName(e.target.value)}
                placeholder="e.g. Rahul Mehta"
                className="w-full px-3 py-2 rounded-lg bg-[#0d0f14] border border-yellow-700/20 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-yellow-500/40"
                data-ocid="lead-coordination.sim_name.input"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-1">
                Phone Number
              </label>
              <input
                required
                value={simPhone}
                onChange={(e) => setSimPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3 py-2 rounded-lg bg-[#0d0f14] border border-yellow-700/20 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-yellow-500/40"
                data-ocid="lead-coordination.sim_phone.input"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30 transition-colors text-sm font-medium"
                data-ocid="lead-coordination.sim_submit.button"
              >
                Run Pipeline
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirm clear */}
      {confirmClear && (
        <div
          className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 flex items-center justify-between gap-4"
          data-ocid="lead-coordination.confirm_clear.dialog"
        >
          <p className="text-sm text-red-300">
            Are you sure? This will delete all {events.length} coordination
            events.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm hover:bg-red-500/30 transition-colors"
              data-ocid="lead-coordination.confirm_button"
            >
              Yes, Clear All
            </button>
            <button
              type="button"
              onClick={() => setConfirmClear(false)}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-muted-foreground text-sm hover:bg-white/5 transition-colors"
              data-ocid="lead-coordination.cancel_button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div
        className="flex flex-wrap gap-4 items-center"
        data-ocid="lead-coordination.filters"
      >
        <div className="flex items-center gap-1.5">
          <Filter size={12} className="text-muted-foreground/60" />
          <span className="text-xs text-muted-foreground/60 font-medium">
            Date:
          </span>
          {(["all", "today", "week", "month"] as DateFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setDateFilter(f)}
              className={filterBtnClass(dateFilter === f)}
              data-ocid={`lead-coordination.filter_date.${f}`}
            >
              {f === "all"
                ? "All"
                : f === "today"
                  ? "Today"
                  : f === "week"
                    ? "This Week"
                    : "This Month"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-muted-foreground/60" />
          <span className="text-xs text-muted-foreground/60 font-medium">
            Score:
          </span>
          {(["all", "8-10", "5-7", "1-4"] as ScoreFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setScoreFilter(f)}
              className={filterBtnClass(scoreFilter === f)}
              data-ocid={`lead-coordination.filter_score.${f}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground/60 font-medium">
            Status:
          </span>
          {(["all", "completed", "processing", "low-score"] as const).map(
            (f) => (
              <button
                key={f}
                type="button"
                onClick={() => setStatusFilter(f)}
                className={filterBtnClass(statusFilter === f)}
                data-ocid={`lead-coordination.filter_status.${f}`}
              >
                {f === "all"
                  ? "All"
                  : f === "low-score"
                    ? "Low Score"
                    : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Events list */}
      {filtered.length === 0 ? (
        <div
          className="rounded-xl border border-yellow-700/10 bg-[#0d0f14] p-12 text-center"
          data-ocid="lead-coordination.empty_state"
        >
          <GitBranch size={36} className="mx-auto mb-4 text-yellow-500/30" />
          <p className="text-foreground/70 font-medium mb-1">
            No coordination events yet
          </p>
          <p className="text-sm text-muted-foreground/60">
            Submit a lead form or use Simulate New Lead to see the AI pipeline
            in action.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((event, i) => (
            <CoordinationCard
              key={event.id}
              event={event}
              index={i}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
