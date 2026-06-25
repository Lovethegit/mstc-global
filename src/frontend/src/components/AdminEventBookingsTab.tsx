import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { EventBooking } from "../backend";
import { createActor } from "../backend";
import { useActor } from "../hooks/useActor";

const ADMIN_TOKEN = "Lovemstc@2019";

const EVENT_STATUSES = [
  "Pending",
  "Confirmed",
  "Cancelled",
  "Completed",
] as const;
type EventStatus = (typeof EVENT_STATUSES)[number];

function useEventBookings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<EventBooking[]>({
    queryKey: ["eventBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEventBookings();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

function useUpdateEventBookingStatus() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; status: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateEventBookingStatus(ADMIN_TOKEN, vars.id, vars.status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["eventBookings"] });
    },
  });
}

function fmt(ts: bigint | string | number) {
  if (!ts) return "—";
  const n = typeof ts === "bigint" ? Number(ts) / 1_000_000 : Number(ts);
  return new Date(n).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-gold-700/20 text-gold-300 border-gold-700/40",
    Confirmed: "bg-green-600/20 text-green-400 border-green-600/40",
    Cancelled: "bg-destructive/20 text-destructive border-destructive/40",
    Completed: "bg-blue-600/20 text-blue-300 border-blue-600/40",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
        styles[status] ?? "bg-muted/20 text-foreground border-border"
      }`}
    >
      {status}
    </span>
  );
}

export function EventBookingsTab() {
  const { data: bookings = [], isLoading } = useEventBookings();
  const updateStatus = useUpdateEventBookingStatus();
  const [statusFilter, setStatusFilter] = useState<EventStatus | "All">("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (statusFilter === "All") return bookings;
    return bookings.filter((b) => b.status === statusFilter);
  }, [bookings, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: bookings.length };
    for (const s of EVENT_STATUSES)
      c[s] = bookings.filter((b) => b.status === s).length;
    return c;
  }, [bookings]);

  return (
    <div className="space-y-6" data-ocid="eventbookings.section">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {EVENT_STATUSES.map((s) => (
          <div key={s} className="admin-stats-card">
            <span className="admin-stats-label">{s}</span>
            <span className="admin-stats-value">{counts[s] ?? 0}</span>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["All", ...EVENT_STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              statusFilter === s
                ? "border-gold-500/60 bg-gold-700/20 text-gold-300"
                : "border-border text-muted-foreground hover:text-foreground hover:border-gold-700/40"
            }`}
            data-ocid={`eventbookings.filter.${s.toLowerCase()}.tab`}
          >
            {s}
            <span className="ml-1.5 text-xs opacity-70">
              ({counts[s] ?? 0})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        {isLoading ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="eventbookings.loading_state"
          >
            Loading event bookings…
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="eventbookings.empty_state"
          >
            No event bookings found.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Event Type</th>
                <th>Date</th>
                <th>Guests</th>
                <th>Venue</th>
                <th>Status</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <>
                  <tr
                    key={b.id}
                    className="cursor-pointer"
                    onClick={() =>
                      setExpandedId(expandedId === b.id ? null : b.id)
                    }
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      setExpandedId(expandedId === b.id ? null : b.id)
                    }
                    tabIndex={0}
                    data-ocid={`eventbookings.table.item.${i + 1}`}
                  >
                    <td>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-sm">
                          {b.clientName}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone size={10} /> {b.clientPhone}
                        </span>
                      </div>
                    </td>
                    <td className="text-sm">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted/20 text-foreground border border-border text-xs">
                        <Calendar size={10} /> {b.eventType}
                      </span>
                    </td>
                    <td className="text-sm whitespace-nowrap">
                      <span className="flex items-center gap-1 text-foreground">
                        <Clock size={12} className="text-gold-400" />
                        {b.eventDate || "—"}
                      </span>
                    </td>
                    <td className="text-sm">
                      <span className="flex items-center gap-1">
                        <Users size={12} className="text-muted-foreground" />
                        {b.guestCount || "—"}
                      </span>
                    </td>
                    <td className="text-sm text-muted-foreground max-w-32 truncate">
                      {b.venue || "—"}
                    </td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="text-xs text-muted-foreground whitespace-nowrap">
                      {fmt(b.createdAt)}
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <select
                        className="px-2 py-1 rounded bg-card border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                        value={b.status}
                        onChange={(e) =>
                          updateStatus.mutate({
                            id: b.id,
                            status: e.target.value,
                          })
                        }
                        data-ocid={`eventbookings.status_select.${i + 1}`}
                      >
                        {EVENT_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {expandedId === b.id && (
                    <tr key={`${b.id}-expand`}>
                      <td colSpan={8} className="bg-muted/5 px-5 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Client Email
                            </span>
                            <span className="text-xs text-foreground flex items-center gap-1">
                              <Mail size={11} />
                              {b.clientEmail || "—"}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Booking ID
                            </span>
                            <span className="text-xs font-mono text-gold-400">
                              {b.id}
                            </span>
                          </div>
                          {b.notes && (
                            <div className="sm:col-span-2 flex flex-col gap-0.5">
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Notes
                              </span>
                              <span className="text-xs text-foreground leading-relaxed">
                                {b.notes}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {EVENT_STATUSES.filter((s) => s !== b.status).map(
                            (s) => (
                              <button
                                key={s}
                                type="button"
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium border border-gold-700/40 text-gold-400 hover:bg-gold-700/10 transition-colors"
                                onClick={() =>
                                  updateStatus.mutate({ id: b.id, status: s })
                                }
                                data-ocid={`eventbookings.set_${s.toLowerCase()}_button.${i + 1}`}
                              >
                                <CheckCircle2 size={11} /> Set {s}
                              </button>
                            ),
                          )}
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-foreground transition-colors ml-auto"
                            onClick={() => setExpandedId(null)}
                            data-ocid={`eventbookings.collapse_button.${i + 1}`}
                          >
                            <X size={11} /> Collapse
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
