import BackButton from "@/components/ui/BackButton";
import Modal from "@/components/ui/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

type CalEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "site-visit" | "appointment" | "event" | "meeting";
  location: string;
  client?: string;
  notes?: string;
};

const CALENDAR_EVENTS: CalEvent[] = [
  {
    id: "c1",
    title: "Site Visit - Bopal 3BHK",
    date: "2025-06-02",
    time: "10:00 AM",
    type: "site-visit",
    location: "Bopal, Ahmedabad",
    client: "Ankit Patel",
    notes: "Ready-possession flat, Rs 82L",
  },
  {
    id: "c2",
    title: "Client Appointment - Loan Advisory",
    date: "2025-06-02",
    time: "3:00 PM",
    type: "appointment",
    location: "MSTC Office, Shantivan",
    client: "Neha Joshi",
  },
  {
    id: "c3",
    title: "Property Valuation Meeting",
    date: "2025-06-04",
    time: "11:30 AM",
    type: "meeting",
    location: "Satellite, Ahmedabad",
    client: "Ramesh Gupta",
  },
  {
    id: "c4",
    title: "Site Visit - SG Highway Commercial",
    date: "2025-06-05",
    time: "9:00 AM",
    type: "site-visit",
    location: "SG Highway, Ahmedabad",
    client: "Vijay Shah",
  },
  {
    id: "c5",
    title: "NGO Annual Fundraiser Gala",
    date: "2025-06-05",
    time: "6:00 PM",
    type: "event",
    location: "Town Hall, Ahmedabad",
    notes: "300 guests expected",
  },
  {
    id: "c6",
    title: "Site Visit - Prahlad Nagar Office",
    date: "2025-06-07",
    time: "11:00 AM",
    type: "site-visit",
    location: "Prahlad Nagar, Ahmedabad",
    client: "Sunita Rao",
  },
  {
    id: "c7",
    title: "RERA Filing - Builder Review",
    date: "2025-06-09",
    time: "2:00 PM",
    type: "meeting",
    location: "MSTC Office",
    notes: "Promoter registration docs review",
  },
  {
    id: "c8",
    title: "Client Appointment - Investment Advisory",
    date: "2025-06-10",
    time: "4:00 PM",
    type: "appointment",
    location: "MSTC Office, Shantivan",
    client: "Deepak Soni",
  },
  {
    id: "c9",
    title: "Site Visit - Shela Villa",
    date: "2025-06-11",
    time: "10:00 AM",
    type: "site-visit",
    location: "Shela, Ahmedabad",
    client: "Kavita Trivedi",
    notes: "4BHK villa, Rs 1.8Cr",
  },
  {
    id: "c10",
    title: "Site Visit - Motera Apartment",
    date: "2025-06-12",
    time: "3:30 PM",
    type: "site-visit",
    location: "Motera, Ahmedabad",
    client: "Prem Jain",
  },
  {
    id: "c11",
    title: "Staff Review Meeting",
    date: "2025-06-13",
    time: "10:00 AM",
    type: "meeting",
    location: "MSTC Office",
    notes: "Monthly performance review",
  },
  {
    id: "c12",
    title: "Client Appointment - Home Loan",
    date: "2025-06-14",
    time: "2:00 PM",
    type: "appointment",
    location: "MSTC Office",
    client: "Meera Pillai",
  },
  {
    id: "c13",
    title: "Site Visit - Bodakdev Plot",
    date: "2025-06-16",
    time: "9:30 AM",
    type: "site-visit",
    location: "Bodakdev, Ahmedabad",
    client: "Harish Modi",
  },
  {
    id: "c14",
    title: "Real Estate Networking Event",
    date: "2025-06-17",
    time: "5:00 PM",
    type: "event",
    location: "Hotel Pride, Ahmedabad",
    notes: "Industry networking evening",
  },
  {
    id: "c15",
    title: "Site Visit - Gota Residential",
    date: "2025-06-18",
    time: "11:00 AM",
    type: "site-visit",
    location: "Gota, Ahmedabad",
    client: "Rohit Sharma",
  },
  {
    id: "c16",
    title: "Finance Strategy Meeting",
    date: "2025-06-19",
    time: "3:00 PM",
    type: "meeting",
    location: "MSTC Office",
  },
  {
    id: "c17",
    title: "Client Appointment - NRI Services",
    date: "2025-06-21",
    time: "10:00 AM",
    type: "appointment",
    location: "Video Call",
    client: "Suresh Agarwal",
  },
  {
    id: "c18",
    title: "Site Visit - Sanand Industrial",
    date: "2025-06-23",
    time: "9:00 AM",
    type: "site-visit",
    location: "Sanand, Ahmedabad",
    client: "Rajesh Verma",
  },
  {
    id: "c19",
    title: "Board Meeting - Q2 Review",
    date: "2025-06-25",
    time: "11:00 AM",
    type: "meeting",
    location: "MSTC Office",
    notes: "Q2 2025 performance review",
  },
  {
    id: "c20",
    title: "Client Appreciation Event",
    date: "2025-06-27",
    time: "7:00 PM",
    type: "event",
    location: "Ahmedabad Club, Paldi",
    notes: "50 VIP clients invited",
  },
  {
    id: "c21",
    title: "Site Visit - New Ranip 2BHK",
    date: "2025-06-28",
    time: "10:30 AM",
    type: "site-visit",
    location: "New Ranip, Ahmedabad",
    client: "Seema Rana",
  },
  {
    id: "c22",
    title: "Final Handover - Bopal Deal",
    date: "2025-06-30",
    time: "2:00 PM",
    type: "meeting",
    location: "Sub-Registrar Office, Ahmedabad",
    client: "Ankit Patel",
  },
];

const TYPE_META: Record<
  CalEvent["type"],
  { label: string; dot: string; badge: string }
> = {
  "site-visit": {
    label: "Site Visit",
    dot: "bg-blue-400",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  appointment: {
    label: "Appointment",
    dot: "bg-amber-400",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  event: {
    label: "Event",
    dot: "bg-green-400",
    badge: "bg-green-500/15 text-green-400 border-green-500/30",
  },
  meeting: {
    label: "Meeting",
    dot: "bg-purple-400",
    badge: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  },
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstWeekday(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return (d + 6) % 7; // 0=Mon
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(
    today.getDate(),
  );
  const [detailEvent, setDetailEvent] = useState<CalEvent | null>(null);

  const numDays = daysInMonth(year, month);
  const startOffset = firstWeekday(year, month);
  const totalCells = Math.ceil((startOffset + numDays) / 7) * 7;

  const monthName = new Date(year, month, 1).toLocaleString("en-IN", {
    month: "long",
  });
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateKey = (d: number) => `${year}-${pad(month + 1)}-${pad(d)}`;
  const monthPrefix = `${year}-${pad(month + 1)}`;

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalEvent[]> = {};
    for (const ev of CALENDAR_EVENTS) {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    }
    return map;
  }, []);

  const selectedEvents = selectedDay
    ? (eventsByDate[dateKey(selectedDay)] ?? [])
    : [];

  const navigate = (dir: -1 | 1) => {
    setSelectedDay(null);
    if (dir === -1) {
      if (month === 0) {
        setMonth(11);
        setYear((y) => y - 1);
      } else setMonth((m) => m - 1);
    } else {
      if (month === 11) {
        setMonth(0);
        setYear((y) => y + 1);
      } else setMonth((m) => m + 1);
    }
  };

  const siteVisits = CALENDAR_EVENTS.filter(
    (e) => e.type === "site-visit" && e.date.startsWith(monthPrefix),
  ).length;
  const appointments = CALENDAR_EVENTS.filter(
    (e) => e.type === "appointment" && e.date.startsWith(monthPrefix),
  ).length;
  const events = CALENDAR_EVENTS.filter(
    (e) => e.type === "event" && e.date.startsWith(monthPrefix),
  ).length;
  const meetings = CALENDAR_EVENTS.filter(
    (e) => e.type === "meeting" && e.date.startsWith(monthPrefix),
  ).length;

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-ocid="calendar.page"
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <BackButton />
          <div>
            <h1 className="font-serif text-2xl font-bold gold-text">
              Calendar
            </h1>
            <p className="text-muted-foreground text-sm font-sans">
              Schedule, visits and appointments
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { label: "Site Visits", count: siteVisits, dot: "bg-blue-400" },
            { label: "Appointments", count: appointments, dot: "bg-amber-400" },
            { label: "Events", count: events, dot: "bg-green-400" },
            { label: "Meetings", count: meetings, dot: "bg-purple-400" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 bg-card border border-gold-700/20 rounded-lg px-3 py-2 text-sm"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
              <span className="text-foreground font-semibold">{s.count}</span>
              <span className="text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar grid */}
          <div className="flex-1 min-w-0">
            <div className="bg-card border border-gold-700/20 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gold-700/20">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-gold-700/10 transition-colors"
                  data-ocid="calendar.prev_button"
                >
                  <ChevronLeft size={18} />
                </button>
                <h2 className="font-serif text-lg font-bold text-gold-300">
                  {monthName} {year}
                </h2>
                <button
                  type="button"
                  onClick={() => navigate(1)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-gold-700/10 transition-colors"
                  data-ocid="calendar.next_button"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="grid grid-cols-7 border-b border-gold-700/10">
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    className="py-2 text-center text-xs font-semibold text-muted-foreground"
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {Array.from({ length: totalCells }).map((_, idx) => {
                  const dayNum = idx - startOffset + 1;
                  const isValidDay = dayNum >= 1 && dayNum <= numDays;
                  const key = isValidDay ? dateKey(dayNum) : "";
                  const dayEvents = isValidDay ? (eventsByDate[key] ?? []) : [];
                  const isToday =
                    isValidDay &&
                    today.getFullYear() === year &&
                    today.getMonth() === month &&
                    today.getDate() === dayNum;
                  const isSelected = isValidDay && selectedDay === dayNum;

                  return (
                    <button
                      key={isValidDay ? dateKey(dayNum) : `empty-${idx}`}
                      type="button"
                      disabled={!isValidDay}
                      onClick={() =>
                        isValidDay &&
                        setSelectedDay((d) => (d === dayNum ? null : dayNum))
                      }
                      className={`relative min-h-[60px] md:min-h-[72px] p-1.5 border-b border-r border-gold-700/10 text-left transition-colors ${
                        !isValidDay
                          ? "bg-obsidian-800/30 cursor-default"
                          : isSelected
                            ? "bg-gold-700/20 cursor-pointer"
                            : isToday
                              ? "cursor-pointer hover:bg-gold-700/10"
                              : "cursor-pointer hover:bg-obsidian-700/30"
                      }`}
                      data-ocid={
                        isValidDay ? `calendar.day.${dayNum}` : undefined
                      }
                    >
                      {isValidDay && (
                        <>
                          <span
                            className={`text-xs font-semibold inline-flex w-6 h-6 items-center justify-center rounded-full mb-1 ${
                              isToday
                                ? "bg-gold-500 text-obsidian-900"
                                : isSelected
                                  ? "text-gold-300"
                                  : "text-foreground"
                            }`}
                          >
                            {dayNum}
                          </span>
                          <div className="flex flex-wrap gap-0.5 mt-0.5">
                            {dayEvents.slice(0, 3).map((ev) => (
                              <span
                                key={ev.id}
                                className={`w-1.5 h-1.5 rounded-full ${TYPE_META[ev.type].dot}`}
                              />
                            ))}
                            {dayEvents.length > 3 && (
                              <span className="text-[9px] text-muted-foreground leading-none">
                                +{dayEvents.length - 3}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-3 px-1">
              {(
                Object.values(TYPE_META) as {
                  label: string;
                  dot: string;
                  badge: string;
                }[]
              ).map((meta) => (
                <div key={meta.label} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                  <span className="text-xs text-muted-foreground">
                    {meta.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Side panel */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-card border border-gold-700/20 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gold-700/20 flex items-center gap-2">
                <CalendarDays size={16} className="text-gold-400" />
                <h3 className="font-serif text-sm font-semibold text-gold-300">
                  {selectedDay
                    ? new Date(year, month, selectedDay).toLocaleDateString(
                        "en-IN",
                        { weekday: "long", day: "numeric", month: "long" },
                      )
                    : "Select a day"}
                </h3>
              </div>

              {selectedDay && selectedEvents.length === 0 && (
                <div
                  className="p-6 text-center text-muted-foreground text-sm"
                  data-ocid="calendar.day_events.empty_state"
                >
                  <Calendar size={24} className="mx-auto mb-2 opacity-40" />
                  No scheduled items
                </div>
              )}

              {!selectedDay && (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  <Calendar size={24} className="mx-auto mb-2 opacity-40" />
                  Click any day to see schedule
                </div>
              )}

              {selectedEvents.length > 0 && (
                <div
                  className="divide-y divide-gold-700/10"
                  data-ocid="calendar.day_events.list"
                >
                  {selectedEvents.map((ev, i) => (
                    <button
                      key={ev.id}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-gold-700/5 transition-colors"
                      onClick={() => setDetailEvent(ev)}
                      data-ocid={`calendar.event.item.${i + 1}`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${TYPE_META[ev.type].dot}`}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {ev.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            <Clock size={10} className="inline mr-1" />
                            {ev.time}
                          </p>
                          {ev.location && (
                            <p className="text-xs text-muted-foreground truncate">
                              <MapPin size={10} className="inline mr-1" />
                              {ev.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!selectedDay && (
                <div>
                  <div className="px-4 py-2 border-b border-gold-700/10">
                    <p className="text-xs font-semibold text-gold-400">
                      Upcoming this month
                    </p>
                  </div>
                  <div className="divide-y divide-gold-700/10 max-h-96 overflow-y-auto">
                    {CALENDAR_EVENTS.filter((e) =>
                      e.date.startsWith(monthPrefix),
                    )
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .slice(0, 10)
                      .map((ev, i) => (
                        <button
                          key={ev.id}
                          type="button"
                          className="w-full text-left px-4 py-3 hover:bg-gold-700/5 transition-colors"
                          onClick={() => setDetailEvent(ev)}
                          data-ocid={`calendar.upcoming.item.${i + 1}`}
                        >
                          <div className="flex items-start gap-2">
                            <span
                              className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${TYPE_META[ev.type].dot}`}
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">
                                {ev.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(ev.date).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                })}{" "}
                                at {ev.time}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={detailEvent !== null}
        onClose={() => setDetailEvent(null)}
        title={detailEvent?.title ?? ""}
        size="sm"
      >
        {detailEvent && (
          <div>
            <div className="mb-4">
              <Badge
                variant="outline"
                className={`text-xs ${TYPE_META[detailEvent.type].badge}`}
              >
                {TYPE_META[detailEvent.type].label}
              </Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Clock size={14} className="text-gold-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-muted-foreground text-xs">
                    Date and Time
                  </div>
                  <div className="text-foreground">
                    {new Date(detailEvent.date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    at {detailEvent.time}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-gold-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-muted-foreground text-xs">Location</div>
                  <div className="text-foreground">{detailEvent.location}</div>
                </div>
              </div>
              {detailEvent.client && (
                <div className="flex items-start gap-2">
                  <Users size={14} className="text-gold-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-muted-foreground text-xs">Client</div>
                    <div className="text-foreground">{detailEvent.client}</div>
                  </div>
                </div>
              )}
              {detailEvent.notes && (
                <div className="bg-obsidian-800/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Notes</p>
                  <p className="text-sm text-foreground">{detailEvent.notes}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-5">
              <Button
                className="flex-1 gold-button"
                data-ocid="calendar.event_detail.confirm_button"
              >
                Confirm
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gold-700/30 text-gold-400"
                onClick={() => setDetailEvent(null)}
                data-ocid="calendar.event_detail.close_button"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
