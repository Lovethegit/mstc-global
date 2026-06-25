import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/useCrmQueries";
import type { CrmEvent } from "@/types/crm";
import {
  Calendar,
  CheckCircle2,
  DollarSign,
  Plus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  Upcoming: "bg-blue-900/20 text-blue-300 border-blue-800/30",
  Active: "bg-green-900/20 text-green-300 border-green-800/30",
  Live: "bg-green-900/20 text-green-300 border-green-800/30",
  Completed: "bg-gold-800/20 text-gold-300 border-gold-700/30",
  Cancelled: "bg-red-900/20 text-red-300 border-red-800/30",
};

const MOCK_ATTENDEES = [
  { name: "Rajesh Mehta", phone: "+91 98250 34512", status: "Confirmed" },
  { name: "Priya Shah", phone: "+91 99090 12345", status: "Confirmed" },
  { name: "Vikram Patel", phone: "+91 94278 67890", status: "Pending" },
  { name: "Sunita Joshi", phone: "+91 87654 32109", status: "Confirmed" },
  { name: "Mohan Agrawal", phone: "+91 96382 11234", status: "Cancelled" },
];

const MOCK_TASKS_INIT = [
  { id: 1, label: "Book venue and confirm deposit", done: true },
  { id: 2, label: "Send invitations to all registered clients", done: true },
  { id: 3, label: "Confirm catering and A/V setup", done: false },
  { id: 4, label: "Print brochures and name badges", done: false },
  { id: 5, label: "Assign staff duties", done: false },
  { id: 6, label: "Setup registration desk", done: false },
];

const BUDGET_ITEMS = [
  { item: "Venue Rental", allocated: 400000, spent: 380000 },
  { item: "Catering", allocated: 300000, spent: 280000 },
  { item: "A/V & Stage", allocated: 200000, spent: 0 },
  { item: "Marketing", allocated: 350000, spent: 210000 },
  { item: "Staff", allocated: 250000, spent: 150000 },
];

type DetailTab = "overview" | "attendees" | "tasks" | "budget";

const MOCK_EVENTS: CrmEvent[] = [
  {
    id: 1n,
    title: "Ahmedabad Property Expo 2025",
    type_: "Expo",
    scheduledAt: BigInt(Date.now() + 7 * 86400000) * 1000000n,
    venue: "GMDC Ground, Ahmedabad",
    capacity: 500n,
    confirmedCount: 312n,
    budget: 1500000n,
    status: "Upcoming",
    description: "Annual property expo featuring 50+ developers",
  },
  {
    id: 2n,
    title: "RERA Compliance Workshop",
    type_: "Workshop",
    scheduledAt: BigInt(Date.now() + 14 * 86400000) * 1000000n,
    venue: "Hotel Courtyard, Ahmedabad",
    capacity: 100n,
    confirmedCount: 78n,
    budget: 250000n,
    status: "Upcoming",
    description: "Workshop for promoters and agents",
  },
  {
    id: 3n,
    title: "Corporate Diwali Celebration",
    type_: "Corporate",
    scheduledAt: BigInt(Date.now() - 30 * 86400000) * 1000000n,
    venue: "Hotel Hyatt, Ahmedabad",
    capacity: 200n,
    confirmedCount: 185n,
    budget: 500000n,
    status: "Completed",
    description: "Annual corporate Diwali event",
  },
  {
    id: 4n,
    title: "NRI Investment Summit",
    type_: "Summit",
    scheduledAt: BigInt(Date.now() + 45 * 86400000) * 1000000n,
    venue: "Sheraton, Ahmedabad",
    capacity: 150n,
    confirmedCount: 45n,
    budget: 800000n,
    status: "Upcoming",
    description: "NRI clients investment opportunities",
  },
];

export default function EventsAdminPage() {
  const { data: fetchedEvents = [] } = useEvents();
  const [events, setEvents] = useState<CrmEvent[]>(
    fetchedEvents.length > 0
      ? (fetchedEvents as unknown as CrmEvent[])
      : MOCK_EVENTS,
  );
  const [showAdd, setShowAdd] = useState(false);
  const [detailEvent, setDetailEvent] = useState<CrmEvent | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [typeFilter, setTypeFilter] = useState("All");
  const [tasks, setTasks] = useState(MOCK_TASKS_INIT);
  const [form, setForm] = useState({
    title: "",
    venue: "",
    type_: "Corporate",
    date: "",
    description: "",
    capacity: "100",
    budget: "100000",
  });

  const EVENT_TYPES = [
    "All",
    "Corporate",
    "Cultural",
    "Sports",
    "Property",
    "Summit",
    "Workshop",
    "Expo",
  ];

  const displayed =
    typeFilter === "All"
      ? events
      : events.filter((e) => e.type_ === typeFilter);

  const formatDate = (ts: bigint) => {
    const d = new Date(Number(ts) / 1_000_000);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    const dateMs = form.date ? new Date(form.date).getTime() : Date.now();
    const newEv: CrmEvent = {
      id: BigInt(Date.now()),
      title: form.title,
      type_: form.type_,
      scheduledAt: BigInt(dateMs) * 1000000n,
      venue: form.venue,
      capacity: BigInt(form.capacity || 100),
      confirmedCount: 0n,
      budget: 100000n,
      status: "Upcoming",
      description: form.description,
    };
    setEvents((prev) => [newEv, ...prev]);
    setShowAdd(false);
    setForm({
      title: "",
      venue: "",
      type_: "Corporate",
      date: "",
      description: "",
      capacity: "100",
      budget: "100000",
    });
    toast.success("Event added successfully");
  }

  function updateStatus(id: bigint, status: string) {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    toast.success(`Event status updated to ${status}`);
  }

  function toggleTask(id: number) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  return (
    <SecureAppGate appName="Event Manager">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="events_admin.page"
      >
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-400" />
              <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
                Event Manager
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => toast.success("Calendar exported")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-800/30 text-gold-500 text-xs font-medium transition-colors hover:bg-gold-700/10"
                data-ocid="events_admin.export_button"
              >
                Export
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
                data-ocid="events_admin.add_button"
              >
                <Plus className="w-3.5 h-3.5" /> Add Event
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {EVENT_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-full text-xs border whitespace-nowrap transition-colors ${
                  typeFilter === t
                    ? "bg-gold-700/30 text-gold-300 border-gold-600/50"
                    : "border-gold-800/30 text-gold-600"
                }`}
                data-ocid={`events_admin.filter.${t.toLowerCase()}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              {
                label: "Total Events",
                value: events.length,
                color: "text-gold-400",
              },
              {
                label: "Upcoming",
                value: events.filter((e) => e.status === "Upcoming").length,
                color: "text-blue-400",
              },
              {
                label: "Completed",
                value: events.filter((e) => e.status === "Completed").length,
                color: "text-green-400",
              },
              {
                label: "Total Budget",
                value: `₹${(events.reduce((s, e) => s + Number(e.budget), 0) / 100000).toFixed(0)}L`,
                color: "text-gold-300",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-gold-800/30 bg-card p-3 text-center"
              >
                <p className={`font-serif text-xl font-bold ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {displayed.map((event, i) => (
              <div
                key={String(event.id)}
                className="rounded-xl border border-gold-800/30 bg-card p-4 cursor-pointer hover:border-gold-500/40 transition-colors"
                data-ocid={`events_admin.item.${i + 1}`}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setDetailEvent(event);
                  setDetailTab("overview");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setDetailEvent(event);
                    setDetailTab("overview");
                  }
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground text-sm">
                      {event.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.type_} • {event.venue}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs border shrink-0 ${STATUS_COLORS[event.status] ?? ""}`}
                  >
                    {event.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(event.scheduledAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {String(event.confirmedCount)}/{String(event.capacity)}
                  </span>
                  <span className="text-gold-400">
                    ₹{(Number(event.budget) / 100000).toFixed(0)}L budget
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/50">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-gold-600 to-gold-400"
                    style={{
                      width: `${Math.min(100, (Number(event.confirmedCount) / Number(event.capacity)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {displayed.length === 0 && (
            <div
              className="text-center py-12"
              data-ocid="events_admin.empty_state"
            >
              <Calendar className="w-12 h-12 text-gold-800/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No events for this filter
              </p>
            </div>
          )}
        </div>

        {/* Add Event Modal */}
        {showAdd && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            data-ocid="events_admin.dialog"
          >
            <div
              className="absolute inset-0 bg-black/60"
              role="presentation"
              onKeyDown={() => {}}
              onClick={() => setShowAdd(false)}
            />
            <div className="relative bg-card border border-gold-700/40 rounded-2xl p-6 w-full max-w-md">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                data-ocid="events_admin.close_button"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="font-serif text-lg font-bold text-gold-400 mb-4">
                Add Event
              </h2>
              <form onSubmit={handleAddEvent} className="space-y-3">
                <div>
                  <label className="text-xs text-gold-600">Event Name *</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                    placeholder="Ahmedabad Property Expo"
                    data-ocid="events_admin.title_input"
                  />
                </div>
                <div>
                  <label className="text-xs text-gold-600">Date *</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date: e.target.value }))
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                    data-ocid="events_admin.date_input"
                  />
                </div>
                <div>
                  <label className="text-xs text-gold-600">Venue *</label>
                  <input
                    required
                    value={form.venue}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, venue: e.target.value }))
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                    placeholder="Hotel / Venue Name"
                    data-ocid="events_admin.venue_input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gold-600">Type</label>
                    <select
                      value={form.type_}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, type_: e.target.value }))
                      }
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                      data-ocid="events_admin.type_select"
                    >
                      {[
                        "Corporate",
                        "Cultural",
                        "Sports",
                        "Property",
                        "Summit",
                        "Workshop",
                        "Expo",
                      ].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gold-600">Capacity</label>
                    <input
                      type="number"
                      value={form.capacity}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, capacity: e.target.value }))
                      }
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                      data-ocid="events_admin.capacity_input"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gold-600">Budget (₹)</label>
                  <input
                    type="number"
                    value={form.budget}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, budget: e.target.value }))
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                    data-ocid="events_admin.budget_input"
                  />
                </div>
                <div>
                  <label className="text-xs text-gold-600">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    rows={2}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm resize-none"
                    data-ocid="events_admin.description_input"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gold-800/40 text-muted-foreground text-sm"
                    data-ocid="events_admin.cancel_button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg bg-gold-700/30 hover:bg-gold-700/40 text-gold-300 text-sm font-medium"
                    data-ocid="events_admin.submit_button"
                  >
                    Add Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {detailEvent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            data-ocid="events_admin.detail_dialog"
          >
            <div
              className="absolute inset-0 bg-black/60"
              role="presentation"
              onKeyDown={() => {}}
              onClick={() => setDetailEvent(null)}
            />
            <div className="relative bg-card border border-gold-700/40 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
              <div className="flex items-start justify-between gap-2 p-5 border-b border-gold-800/20">
                <div className="flex-1 min-w-0">
                  <Badge
                    variant="outline"
                    className={`text-xs border mb-2 ${STATUS_COLORS[detailEvent.status] ?? ""}`}
                  >
                    {detailEvent.status}
                  </Badge>
                  <h2 className="font-serif text-lg font-bold text-foreground">
                    {detailEvent.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {detailEvent.type_} • {detailEvent.venue}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailEvent(null)}
                  className="shrink-0 text-muted-foreground hover:text-foreground p-1"
                  data-ocid="events_admin.detail_close_button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-1 px-5 pt-3">
                {(
                  ["overview", "attendees", "tasks", "budget"] as DetailTab[]
                ).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDetailTab(t)}
                    className={`px-3 py-1 rounded-full text-xs border capitalize transition-colors ${
                      detailTab === t
                        ? "bg-gold-700/30 text-gold-300 border-gold-600/50"
                        : "border-gold-800/30 text-gold-600"
                    }`}
                    data-ocid={`events_admin.detail_tab.${t}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {detailTab === "overview" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg bg-background p-3 border border-gold-800/20">
                        <span className="text-muted-foreground text-xs">
                          Date
                        </span>
                        <p className="font-medium mt-0.5">
                          {formatDate(detailEvent.scheduledAt)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-background p-3 border border-gold-800/20">
                        <span className="text-muted-foreground text-xs">
                          Attendees
                        </span>
                        <p className="font-medium mt-0.5">
                          {String(detailEvent.confirmedCount)}/
                          {String(detailEvent.capacity)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-background p-3 border border-gold-800/20">
                        <span className="text-muted-foreground text-xs">
                          Budget
                        </span>
                        <p className="font-medium text-gold-400 mt-0.5">
                          ₹{(Number(detailEvent.budget) / 100000).toFixed(0)}L
                        </p>
                      </div>
                      <div className="rounded-lg bg-background p-3 border border-gold-800/20">
                        <span className="text-muted-foreground text-xs">
                          Type
                        </span>
                        <p className="font-medium mt-0.5">
                          {detailEvent.type_}
                        </p>
                      </div>
                    </div>
                    {detailEvent.description && (
                      <p className="text-xs text-muted-foreground bg-background/50 rounded-lg p-3 border border-gold-800/15">
                        {detailEvent.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      {["Upcoming", "Live", "Completed", "Cancelled"].map(
                        (s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              updateStatus(detailEvent.id, s);
                              setDetailEvent((prev) =>
                                prev ? { ...prev, status: s } : null,
                              );
                            }}
                            className={`flex-1 px-2 py-1.5 rounded-lg text-xs border transition-colors ${
                              detailEvent.status === s
                                ? "bg-gold-700/30 text-gold-300 border-gold-600/50"
                                : "border-gold-800/30 text-gold-600 hover:bg-gold-800/20"
                            }`}
                            data-ocid={`events_admin.status.${s.toLowerCase()}`}
                          >
                            {s}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}
                {detailTab === "attendees" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-foreground">
                        {MOCK_ATTENDEES.length} Registered
                      </p>
                      <button
                        type="button"
                        onClick={() => toast.success("Attendee list exported")}
                        className="text-xs text-gold-500 hover:text-gold-400"
                        data-ocid="events_admin.export_attendees_button"
                      >
                        Export List
                      </button>
                    </div>
                    {MOCK_ATTENDEES.map((a, i) => (
                      <div
                        key={a.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-background border border-gold-800/20"
                        data-ocid={`events_admin.attendee.${i + 1}`}
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {a.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {a.phone}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${
                            a.status === "Confirmed"
                              ? "bg-green-900/20 text-green-300 border-green-800/30"
                              : a.status === "Cancelled"
                                ? "bg-red-900/20 text-red-300 border-red-800/30"
                                : "bg-amber-900/20 text-amber-300 border-amber-800/30"
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {detailTab === "tasks" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-foreground">
                        {tasks.filter((t) => t.done).length}/{tasks.length}{" "}
                        completed
                      </p>
                    </div>
                    {tasks.map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-background border border-gold-800/20 hover:border-gold-700/30 transition-colors text-left"
                        data-ocid={`events_admin.task.${task.id}`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 ${task.done ? "text-green-400" : "text-muted-foreground/30"}`}
                        />
                        <span
                          className={`text-sm ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}
                        >
                          {task.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {detailTab === "budget" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="rounded-lg bg-background p-3 border border-gold-800/20">
                        <p className="text-xs text-muted-foreground">
                          Total Budget
                        </p>
                        <p className="font-bold text-gold-400 text-lg">
                          ₹{(Number(detailEvent.budget) / 100000).toFixed(0)}L
                        </p>
                      </div>
                      <div className="rounded-lg bg-background p-3 border border-gold-800/20">
                        <p className="text-xs text-muted-foreground">Spent</p>
                        <p className="font-bold text-foreground text-lg">
                          ₹
                          {(
                            BUDGET_ITEMS.reduce((s, b) => s + b.spent, 0) /
                            100000
                          ).toFixed(1)}
                          L
                        </p>
                      </div>
                    </div>
                    {BUDGET_ITEMS.map((item) => (
                      <div key={item.item} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-foreground">{item.item}</span>
                          <span className="text-muted-foreground">
                            ₹{(item.spent / 1000).toFixed(0)}K / ₹
                            {(item.allocated / 1000).toFixed(0)}K
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted/40">
                          <div
                            className={`h-1.5 rounded-full ${item.spent / item.allocated > 0.9 ? "bg-red-500" : "bg-gradient-to-r from-gold-600 to-gold-400"}`}
                            style={{
                              width: `${Math.min(100, (item.spent / item.allocated) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => toast.success("Budget report exported")}
                      className="w-full mt-3 py-2 rounded-lg border border-gold-800/30 text-gold-500 text-xs hover:bg-gold-800/10 transition-colors flex items-center justify-center gap-1.5"
                      data-ocid="events_admin.export_budget_button"
                    >
                      <DollarSign className="w-3.5 h-3.5" /> Export Budget
                      Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </SecureAppGate>
  );
}
