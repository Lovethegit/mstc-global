import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";
import { useState } from "react";

type EventType = "appointment" | "event" | "rera" | "deal" | "invoice";
interface CalEvent {
  id: number;
  date: string;
  title: string;
  type: EventType;
  time?: string;
  description?: string;
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
    description: "Rajesh Mehta site visit",
  },
  {
    id: 2,
    date: d(m, y, 5),
    title: "RERA Filing Deadline – Shivalik Heights",
    type: "rera",
    time: "EOD",
    description: "Q2 quarterly RERA report",
  },
  {
    id: 3,
    date: d(m, y, 7),
    title: "Anita Joshi Deal Closing",
    type: "deal",
    time: "3:00 PM",
    description: "SG Highway commercial unit ₹1.2 Cr",
  },
  {
    id: 4,
    date: d(m, y, 8),
    title: "Client Meeting – Priya Shah",
    type: "appointment",
    time: "10:30 AM",
    description: "Home loan file review",
  },
  {
    id: 5,
    date: d(m, y, 10),
    title: "MSTC Corporate Diwali Event",
    type: "event",
    time: "7:00 PM",
    description: "Client appreciation event, 120 guests",
  },
  {
    id: 6,
    date: d(m, y, 12),
    title: "Commission Invoice Due – Dec Batch",
    type: "invoice",
    time: "EOD",
    description: "₹84,000 commission payout",
  },
  {
    id: 7,
    date: d(m, y, 14),
    title: "Site Visit – Bodakdev 2BHK",
    type: "appointment",
    time: "4:00 PM",
    description: "Suresh Kumar property tour",
  },
  {
    id: 8,
    date: d(m, y, 15),
    title: "Rent Agreement Renewal – Vastrapur",
    type: "deal",
    time: "12:00 PM",
    description: "Kavita Desai rental renewal",
  },
  {
    id: 9,
    date: d(m, y, 18),
    title: "RERA Compliance Audit",
    type: "rera",
    time: "10:00 AM",
    description: "Internal RERA audit with Veda AI",
  },
  {
    id: 10,
    date: d(m, y, 20),
    title: "Investment Portfolio Review",
    type: "appointment",
    time: "2:30 PM",
    description: "Mehta & Associates finance meeting",
  },
  {
    id: 11,
    date: d(m, y, 22),
    title: "Property Expo – Science City",
    type: "event",
    time: "9:00 AM",
    description: "MSTC stall at Ahmedabad Realty Expo",
  },
  {
    id: 12,
    date: d(m, y, 25),
    title: "GST Return Filing Deadline",
    type: "invoice",
    time: "EOD",
    description: "Monthly GST compliance",
  },
  {
    id: 13,
    date: d(nm, ny, 2),
    title: "New Quarter Client Review",
    type: "appointment",
    time: "11:00 AM",
    description: "Top 10 client portfolio reviews",
  },
  {
    id: 14,
    date: d(nm, ny, 5),
    title: "RERA Agent Renewal Deadline",
    type: "rera",
    time: "EOD",
    description: "5 agent renewals pending",
  },
  {
    id: 15,
    date: d(nm, ny, 8),
    title: "Music & Culture Event Booking",
    type: "event",
    time: "6:00 PM",
    description: "Annual cultural night, 250 guests",
  },
  {
    id: 16,
    date: d(nm, ny, 10),
    title: "Satellite Residency Deal Closing",
    type: "deal",
    time: "3:30 PM",
    description: "4BHK penthouse ₹2.8 Cr",
  },
  {
    id: 17,
    date: d(nm, ny, 15),
    title: "Staff Salary Invoice",
    type: "invoice",
    time: "EOD",
    description: "Monthly payroll processing",
  },
  {
    id: 18,
    date: d(nm, ny, 18),
    title: "Tourism Package Launch",
    type: "event",
    time: "11:00 AM",
    description: "Rann of Kutch Safari Q1 packages",
  },
  {
    id: 19,
    date: d(nm, ny, 22),
    title: "SG Highway Commercial Deal",
    type: "deal",
    time: "4:00 PM",
    description: "Office space ₹95L closing",
  },
  {
    id: 20,
    date: d(nm, ny, 28),
    title: "Annual Compliance Review",
    type: "rera",
    time: "10:00 AM",
    description: "Full RERA portfolio audit",
  },
];

const TYPE_STYLES: Record<
  EventType,
  { chip: string; label: string; dot: string }
> = {
  appointment: {
    chip: "bg-blue-900/40 text-blue-300 border-blue-700/40",
    label: "Appointment",
    dot: "bg-blue-400",
  },
  event: {
    chip: "bg-gold-800/40 text-gold-300 border-gold-700/40",
    label: "Event",
    dot: "bg-yellow-400",
  },
  rera: {
    chip: "bg-red-900/40 text-red-300 border-red-700/40",
    label: "RERA",
    dot: "bg-red-400",
  },
  deal: {
    chip: "bg-green-900/40 text-green-300 border-green-700/40",
    label: "Deal",
    dot: "bg-green-400",
  },
  invoice: {
    chip: "bg-amber-900/40 text-amber-300 border-amber-700/40",
    label: "Invoice",
    dot: "bg-amber-400",
  },
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

export default function CalendarAdminPage() {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [view, setView] = useState<"month" | "week">("month");
  const [selected, setSelected] = useState<CalEvent | null>(null);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const monthKey = `${viewYear}-${String(viewMonth).padStart(2, "0")}`;

  const eventsByDay: Record<number, CalEvent[]> = {};
  for (const ev of EVENTS) {
    if (ev.date.startsWith(monthKey)) {
      const day = Number.parseInt(ev.date.split("-")[2], 10);
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(ev);
    }
  }

  const upcomingEvents = [...EVENTS]
    .filter((e) => e.date >= today.toISOString().split("T")[0])
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);

  const monthNames = [
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

  function prevMonth() {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1
                className="text-2xl font-bold text-gold-400"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Unified Calendar
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                All appointments, events, deadlines & deals
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-gold-800/40 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setView("month")}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "month" ? "bg-gold-700/30 text-gold-300" : "text-muted-foreground hover:text-gold-400"}`}
                  data-ocid="calendar.month_tab"
                >
                  Month
                </button>
                <button
                  type="button"
                  onClick={() => setView("week")}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "week" ? "bg-gold-700/30 text-gold-300" : "text-muted-foreground hover:text-gold-400"}`}
                  data-ocid="calendar.week_tab"
                >
                  Week
                </button>
              </div>
              <Button
                size="sm"
                className="bg-gold-700/30 border border-gold-700/50 text-gold-300 hover:bg-gold-700/50"
                data-ocid="calendar.add_button"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(TYPE_STYLES).map(([type, s]) => (
              <div
                key={type}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Calendar Grid */}
            <div className="lg:col-span-2 bg-card/80 rounded-xl border border-gold-800/30 p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg hover:bg-gold-800/20 text-gold-400"
                  data-ocid="calendar.pagination_prev"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span
                  className="font-bold text-gold-300"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {monthNames[viewMonth - 1]} {viewYear}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg hover:bg-gold-800/20 text-gold-400"
                  data-ocid="calendar.pagination_next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {weekDays.map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs font-medium text-muted-foreground py-1"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: positional placeholders, never reordered
                  <div key={`empty-pos-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isToday =
                    today.getFullYear() === viewYear &&
                    today.getMonth() + 1 === viewMonth &&
                    today.getDate() === day;
                  const dayEvents = eventsByDay[day] ?? [];
                  return (
                    <div
                      key={day}
                      className={`min-h-[64px] rounded-lg p-1 border transition-colors cursor-pointer ${isToday ? "border-gold-500/60 bg-gold-900/20" : "border-gold-800/20 hover:border-gold-700/40"}`}
                      data-ocid={`calendar.item.${day}`}
                    >
                      <div
                        className={`text-xs font-medium mb-1 w-5 h-5 flex items-center justify-center rounded-full ${isToday ? "bg-gold-500 text-[#06090f]" : "text-muted-foreground"}`}
                      >
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map((ev) => (
                          <button
                            key={ev.id}
                            type="button"
                            onClick={() => setSelected(ev)}
                            className={`w-full text-left text-[9px] px-1 py-0.5 rounded truncate border ${TYPE_STYLES[ev.type].chip}`}
                          >
                            {ev.title}
                          </button>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[9px] text-muted-foreground px-1">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Sidebar */}
            <div className="space-y-3">
              <h3 className="font-bold text-gold-300 text-sm">
                Upcoming Events
              </h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {upcomingEvents.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setSelected(ev)}
                    className="w-full text-left bg-card/70 border border-gold-800/30 rounded-lg p-3 hover:border-gold-600/40 transition-all"
                    data-ocid={`calendar.upcoming.item.${ev.id}`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${TYPE_STYLES[ev.type].dot}`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground truncate">
                          {ev.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground">
                            {ev.date}
                          </span>
                          {ev.time && (
                            <span className="text-[10px] text-gold-600">
                              <Clock className="w-2.5 h-2.5 inline mr-0.5" />
                              {ev.time}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge
                        className={`text-[9px] px-1.5 py-0 border ${TYPE_STYLES[ev.type].chip} flex-shrink-0`}
                      >
                        {TYPE_STYLES[ev.type].label}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Event Detail Modal */}
        {selected && (
          <div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            role="presentation"
            onKeyDown={(e) => e.key === "Escape" && setSelected(null)}
          >
            <div
              className="bg-[#0d1117] border border-gold-700/40 rounded-2xl p-6 max-w-md w-full"
              role="dialog"
              aria-modal="true"
              data-ocid="calendar.dialog"
            >
              <div className="flex items-start justify-between mb-4">
                <Badge className={`border ${TYPE_STYLES[selected.type].chip}`}>
                  {TYPE_STYLES[selected.type].label}
                </Badge>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-muted-foreground hover:text-gold-400 text-xl"
                  data-ocid="calendar.close_button"
                >
                  ✕
                </button>
              </div>
              <h3
                className="text-lg font-bold text-gold-300 mb-2"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {selected.title}
              </h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  📅 {selected.date}
                  {selected.time && ` at ${selected.time}`}
                </p>
                {selected.description && (
                  <p className="text-foreground mt-2">{selected.description}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </SecureAppGate>
  );
}
