import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { useCrmAppointments } from "@/hooks/useCrmQueries";
import type { CrmAppointment } from "@/types/crm";
import { Calendar, Clock, MapPin, Phone, Plus } from "lucide-react";
import { useState } from "react";

const TYPE_COLORS: Record<string, string> = {
  "Site Visit": "bg-blue-900/20 text-blue-300 border-blue-800/30",
  Call: "bg-green-900/20 text-green-300 border-green-800/30",
  Meeting: "bg-purple-900/20 text-purple-300 border-purple-800/30",
};
const STATUS_COLORS: Record<string, string> = {
  Scheduled: "bg-gold-800/20 text-gold-300 border-gold-700/30",
  Completed: "bg-green-900/20 text-green-300 border-green-800/30",
  Cancelled: "bg-red-900/20 text-red-300 border-red-800/30",
};

const MOCK_APPOINTMENTS: CrmAppointment[] = [
  {
    id: 1n,
    clientName: "Rajesh Mehta",
    type_: "Site Visit",
    scheduledAt: BigInt(Date.now() + 86400000) * 1000000n,
    durationMins: 60n,
    location: "Prahlad Nagar, Ahmedabad",
    notes: "3BHK flat walkthrough",
    status: "Scheduled",
    createdBy: "Aria AI",
  },
  {
    id: 2n,
    clientName: "Priya Shah",
    type_: "Call",
    scheduledAt: BigInt(Date.now() + 7200000) * 1000000n,
    durationMins: 30n,
    location: "Phone",
    notes: "Home loan discussion",
    status: "Scheduled",
    createdBy: "Lead AI",
  },
  {
    id: 3n,
    clientName: "Anita Joshi",
    type_: "Meeting",
    scheduledAt: BigInt(Date.now() - 86400000) * 1000000n,
    durationMins: 90n,
    location: "MSTC Office, Shantivan",
    notes: "Commercial lease negotiation",
    status: "Completed",
    createdBy: "Aria AI",
  },
  {
    id: 4n,
    clientName: "Vikram Patel",
    type_: "Site Visit",
    scheduledAt: BigInt(Date.now() + 172800000) * 1000000n,
    durationMins: 45n,
    location: "Navrangpura, Ahmedabad",
    notes: "Plot inspection",
    status: "Scheduled",
    createdBy: "RERA AI",
  },
  {
    id: 5n,
    clientName: "Suresh Kumar",
    type_: "Meeting",
    scheduledAt: BigInt(Date.now() - 3 * 86400000) * 1000000n,
    durationMins: 60n,
    location: "Video Call",
    notes: "Finance discussion",
    status: "Cancelled",
    createdBy: "Finance AI",
  },
];

const DAYS_IN_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function AppointmentsPage() {
  const { data: fetchedAppts = [] } = useCrmAppointments();
  const appointments: CrmAppointment[] =
    fetchedAppts.length > 0
      ? (fetchedAppts as unknown as CrmAppointment[])
      : MOCK_APPOINTMENTS;
  const [view, setView] = useState<"list" | "calendar">("list");
  const [typeFilter, setTypeFilter] = useState("All");

  const now = new Date();
  const calDays = buildCalendarDays(now.getFullYear(), now.getMonth());

  const filtered =
    typeFilter === "All"
      ? appointments
      : appointments.filter((a) => a.type_ === typeFilter);

  const formatDate = (ts: bigint) => {
    const d = new Date(Number(ts) / 1_000_000);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getApptDay = (ts: bigint) => new Date(Number(ts) / 1_000_000).getDate();
  const apptDays = new Set(appointments.map((a) => getApptDay(a.scheduledAt)));

  return (
    <SecureAppGate appName="Appointment Scheduler">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="appointments.page"
      >
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-400" />
              <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
                Appointments
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setView(view === "list" ? "calendar" : "list")}
                className="px-3 py-1.5 rounded-lg border border-gold-800/30 text-gold-500 text-xs hover:border-gold-600/50 transition-colors"
                data-ocid="appointments.view_toggle"
              >
                {view === "list" ? "Calendar" : "List"}
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
                data-ocid="appointments.add_button"
              >
                <Plus className="w-3.5 h-3.5" /> New
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap mb-4">
            {["All", "Site Visit", "Call", "Meeting"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${typeFilter === t ? "bg-gold-700/30 text-gold-300 border-gold-600/50" : "border-gold-800/30 text-gold-600 hover:text-gold-400"}`}
                data-ocid={`appointments.filter.${t.toLowerCase().replace(" ", "_")}`}
              >
                {t}
              </button>
            ))}
          </div>

          {view === "calendar" && (
            <div className="rounded-xl border border-gold-800/30 bg-card overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-gold-800/30">
                <h2 className="font-serif font-semibold text-foreground">
                  {now.toLocaleString("default", { month: "long" })}{" "}
                  {now.getFullYear()}
                </h2>
              </div>
              <div className="grid grid-cols-7">
                {DAYS_IN_WEEK.map((d) => (
                  <div
                    key={d}
                    className="py-2 text-center text-xs text-gold-600 font-medium border-b border-gold-800/20"
                  >
                    {d}
                  </div>
                ))}
                {calDays.map((day, i) => (
                  <div
                    key={`cal-${now.getFullYear()}-${now.getMonth()}-${i}`}
                    className={`min-h-[48px] p-1 border-b border-r border-gold-800/10 text-center ${day === now.getDate() ? "bg-gold-700/10" : ""}`}
                  >
                    {day && (
                      <>
                        <span
                          className={`text-xs ${day === now.getDate() ? "text-gold-400 font-bold" : "text-muted-foreground"}`}
                        >
                          {day}
                        </span>
                        {apptDays.has(day) && (
                          <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mx-auto mt-0.5" />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "list" && (
            <div className="space-y-3">
              {filtered.map((appt, i) => (
                <div
                  key={String(appt.id)}
                  className="rounded-xl border border-gold-800/30 bg-card p-4"
                  data-ocid={`appointments.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-medium text-foreground text-sm">
                        {appt.clientName}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge
                          variant="outline"
                          className={`text-xs border ${TYPE_COLORS[appt.type_] ?? ""}`}
                        >
                          {appt.type_}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs border ${STATUS_COLORS[appt.status] ?? ""}`}
                        >
                          {appt.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(appt.scheduledAt)}
                      </p>
                      <p className="text-xs text-gold-600 mt-0.5">
                        {String(appt.durationMins)} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {appt.location}
                    </span>
                    {appt.notes && (
                      <span className="truncate flex-1">{appt.notes}</span>
                    )}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div
                  className="text-center py-12"
                  data-ocid="appointments.empty_state"
                >
                  <Calendar className="w-12 h-12 text-gold-800/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No appointments
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </SecureAppGate>
  );
}
