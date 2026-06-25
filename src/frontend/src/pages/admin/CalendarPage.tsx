import SecureAppGate from "@/components/shared/SecureAppGate";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Calendar as CalIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ViewMode = "month" | "week" | "day";
type EventType =
  | "appointment"
  | "event"
  | "rera"
  | "deal"
  | "invoice"
  | "sport"
  | "music";

interface CalEvent {
  id: number;
  date: string;
  title: string;
  type: EventType;
  time?: string;
  app: string;
}

const now = new Date();
const y = now.getFullYear();
const m = now.getMonth() + 1;
const nm = m === 12 ? 1 : m + 1;
const ny = m === 12 ? y + 1 : y;
function d(mo: number, yr: number, day: number) {
  return `${yr}-${String(mo).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const EVENTS: CalEvent[] = [
  {
    id: 1,
    date: d(m, y, 3),
    title: "Site Visit – Prahlad Nagar 3BHK",
    type: "appointment",
    time: "11:00 AM",
    app: "CRM",
  },
  {
    id: 2,
    date: d(m, y, 5),
    title: "RERA Filing Deadline",
    type: "rera",
    time: "EOD",
    app: "RERA",
  },
  {
    id: 3,
    date: d(m, y, 7),
    title: "Deal Closing – SG Highway",
    type: "deal",
    time: "3:00 PM",
    app: "Deals",
  },
  {
    id: 4,
    date: d(m, y, 10),
    title: "MSTC Corporate Diwali Event",
    type: "event",
    time: "7:00 PM",
    app: "Events",
  },
  {
    id: 5,
    date: d(m, y, 12),
    title: "Commission Invoice Due",
    type: "invoice",
    time: "EOD",
    app: "Finance",
  },
  {
    id: 6,
    date: d(m, y, 15),
    title: "Navratri Booking Finalise",
    type: "music",
    time: "2:00 PM",
    app: "Music",
  },
  {
    id: 7,
    date: d(m, y, 18),
    title: "RERA Compliance Audit",
    type: "rera",
    time: "10:00 AM",
    app: "RERA",
  },
  {
    id: 8,
    date: d(m, y, 20),
    title: "Investment Portfolio Review",
    type: "appointment",
    time: "2:30 PM",
    app: "Finance",
  },
  {
    id: 9,
    date: d(m, y, 22),
    title: "Property Expo – Science City",
    type: "event",
    time: "9:00 AM",
    app: "Events",
  },
  {
    id: 10,
    date: d(m, y, 25),
    title: "GST Return Filing",
    type: "invoice",
    time: "EOD",
    app: "Finance",
  },
  {
    id: 11,
    date: d(nm, ny, 3),
    title: "Cricket Tournament Finals",
    type: "sport",
    time: "10:00 AM",
    app: "Sports",
  },
  {
    id: 12,
    date: d(nm, ny, 8),
    title: "Client Workshop – RERA Awareness",
    type: "event",
    time: "11:00 AM",
    app: "Events",
  },
];

const TYPE_COLORS: Record<EventType, string> = {
  appointment: "bg-blue-900/40 border-blue-700/50 text-blue-300",
  event: "bg-purple-900/40 border-purple-700/50 text-purple-300",
  rera: "bg-amber-900/40 border-amber-700/50 text-amber-300",
  deal: "bg-green-900/40 border-green-700/50 text-green-300",
  invoice: "bg-red-900/40 border-red-700/50 text-red-300",
  sport: "bg-orange-900/40 border-orange-700/50 text-orange-300",
  music: "bg-gold-800/40 border-gold-700/50 text-gold-300",
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}
function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month - 1, 1).getDay();
}

export default function CalendarPage() {
  const today = new Date();
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventType, setNewEventType] = useState<EventType>("appointment");

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  function prevMonth() {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  }
  function nextMonth() {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  }

  function getDateStr(day: number) {
    return `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function eventsForDate(dateStr: string) {
    return EVENTS.filter((e) => e.date === dateStr);
  }

  const selectedEvents = selectedDate ? eventsForDate(selectedDate) : [];

  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              to="/apps"
              className="p-2 rounded-lg border border-gold-800/30 hover:border-gold-600/50 transition-colors"
              data-ocid="calendar.back_button"
            >
              <ChevronLeft className="w-4 h-4 text-gold-400" />
            </Link>
            <div className="flex-1">
              <h1
                className="text-2xl font-bold text-gold-400"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Unified Calendar
              </h1>
              <p className="text-sm text-muted-foreground">
                All events, appointments & deadlines across MSTC
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-primary-foreground"
              data-ocid="calendar.add_button"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Event
            </Button>
          </div>

          {/* View Switcher */}
          <div className="flex gap-2 items-center">
            {(["month", "week", "day"] as ViewMode[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setViewMode(v)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                  viewMode === v
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/60 border border-gold-800/30 text-muted-foreground hover:text-gold-300"
                }`}
                data-ocid={`calendar.view.${v}`}
              >
                {v}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-lg border border-gold-800/30 hover:border-gold-600/50"
                data-ocid="calendar.prev_month_button"
              >
                <ChevronLeft className="w-4 h-4 text-gold-400" />
              </button>
              <span className="text-sm font-medium text-foreground min-w-[140px] text-center">
                {MONTHS[currentMonth - 1]} {currentYear}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-lg border border-gold-800/30 hover:border-gold-600/50"
                data-ocid="calendar.next_month_button"
              >
                <ChevronRight className="w-4 h-4 text-gold-400" />
              </button>
            </div>
          </div>

          {/* Month View */}
          {viewMode === "month" && (
            <div className="bg-card/60 border border-gold-800/30 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-7 border-b border-gold-800/20">
                {DAYS.map((d) => (
                  <div
                    key={d}
                    className="py-2 text-center text-xs font-medium text-muted-foreground"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {Array.from(
                  { length: firstDay },
                  (_, i) => `${currentYear}-${currentMonth}-empty-${i}`,
                ).map((emptyKey) => (
                  <div
                    key={emptyKey}
                    className="min-h-[70px] border-b border-r border-gold-800/10"
                  />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = getDateStr(day);
                  const dayEvents = eventsForDate(dateStr);
                  const isToday =
                    today.getDate() === day &&
                    today.getMonth() + 1 === currentMonth &&
                    today.getFullYear() === currentYear;
                  const isSelected = selectedDate === dateStr;
                  return (
                    <div
                      key={day}
                      onClick={() =>
                        setSelectedDate(isSelected ? null : dateStr)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          setSelectedDate(isSelected ? null : dateStr);
                      }}
                      role="button"
                      tabIndex={0}
                      className={`min-h-[70px] border-b border-r border-gold-800/10 p-1 cursor-pointer transition-colors hover:bg-gold-900/10 ${
                        isSelected ? "bg-gold-900/20" : ""
                      }`}
                      data-ocid={`calendar.day.${day}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1 ${
                          isToday
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map((e) => (
                          <div
                            key={e.id}
                            className={`text-[9px] px-1 py-0.5 rounded border ${TYPE_COLORS[e.type]} truncate`}
                          >
                            {e.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[9px] text-muted-foreground">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Week / Day Views */}
          {(viewMode === "week" || viewMode === "day") && (
            <div className="bg-card/60 border border-gold-800/30 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-gold-400 mb-3">
                {viewMode === "week"
                  ? "This Week's Events"
                  : `${MONTHS[currentMonth - 1]} ${today.getDate()}, ${currentYear}`}
              </h3>
              <div className="space-y-2">
                {EVENTS.filter((e) =>
                  e.date.startsWith(
                    `${currentYear}-${String(currentMonth).padStart(2, "0")}`,
                  ),
                )
                  .slice(0, viewMode === "day" ? 3 : 8)
                  .map((e, i) => (
                    <div
                      key={e.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${TYPE_COLORS[e.type]}`}
                      data-ocid={`calendar.event.${i + 1}`}
                    >
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{e.title}</div>
                        <div className="text-[10px] opacity-70">
                          {e.time} · {e.app}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => toast.info(`Viewing: ${e.title}`)}
                        data-ocid={`calendar.event.view_button.${i + 1}`}
                      >
                        View
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Selected Date Panel */}
          {selectedDate && selectedEvents.length > 0 && (
            <div className="bg-card/80 border border-gold-800/40 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-gold-400 mb-3 flex items-center gap-2">
                <CalIcon className="w-4 h-4" /> Events on {selectedDate}
              </h3>
              <div className="space-y-2">
                {selectedEvents.map((e, i) => (
                  <div
                    key={e.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${TYPE_COLORS[e.type]}`}
                    data-ocid={`calendar.selected_event.${i + 1}`}
                  >
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{e.title}</div>
                      <div className="text-[10px] opacity-70">
                        {e.time} · {e.app}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="h-7 text-xs bg-primary/20 text-primary"
                      onClick={() => toast.info(`Viewing: ${e.title}`)}
                      data-ocid={`calendar.selected_event.edit_button.${i + 1}`}
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Event Modal */}
          {showAddModal && (
            <div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              data-ocid="calendar.add_dialog"
            >
              <div className="bg-card border border-gold-800/40 rounded-2xl p-6 w-full max-w-md">
                <h3 className="font-serif text-lg font-bold text-gold-400 mb-4">
                  Add Event to Calendar
                </h3>
                <div className="space-y-3">
                  <input
                    className="w-full bg-muted/30 border border-gold-800/30 rounded-lg px-3 py-2 text-sm"
                    placeholder="Event title"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    data-ocid="calendar.add.title_input"
                  />
                  <input
                    type="date"
                    className="w-full bg-muted/30 border border-gold-800/30 rounded-lg px-3 py-2 text-sm"
                    data-ocid="calendar.add.date_input"
                  />
                  <input
                    className="w-full bg-muted/30 border border-gold-800/30 rounded-lg px-3 py-2 text-sm"
                    placeholder="Time (e.g. 10:00 AM)"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    data-ocid="calendar.add.time_input"
                  />
                  <select
                    className="w-full bg-muted/30 border border-gold-800/30 rounded-lg px-3 py-2 text-sm"
                    value={newEventType}
                    onChange={(e) =>
                      setNewEventType(e.target.value as EventType)
                    }
                    data-ocid="calendar.add.type_select"
                  >
                    {(
                      [
                        "appointment",
                        "event",
                        "deal",
                        "rera",
                        "invoice",
                        "sport",
                        "music",
                      ] as EventType[]
                    ).map((t) => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2 justify-end mt-4">
                    <Button
                      variant="outline"
                      className="border-gold-800/30"
                      onClick={() => setShowAddModal(false)}
                      data-ocid="calendar.add.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-primary text-primary-foreground"
                      onClick={() => {
                        if (newEventTitle.trim()) {
                          toast.success("Event added!");
                          setShowAddModal(false);
                          setNewEventTitle("");
                          setNewEventTime("");
                        } else {
                          toast.error("Please enter a title");
                        }
                      }}
                      data-ocid="calendar.add.submit_button"
                    >
                      Add Event
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SecureAppGate>
  );
}
