import { useQuery } from "@tanstack/react-query";
import { Bell, Mail, MapPin, Phone, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { PropertyAlert } from "../backend";
import { createActor } from "../backend";
import { useActor } from "../hooks/useActor";

function usePropertyAlerts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PropertyAlert[]>({
    queryKey: ["propertyAlerts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPropertyAlerts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
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

function formatBudget(v: bigint): string {
  const n = Number(v);
  if (!n) return "Any";
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(0)} L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n}`;
}

export function WatchlistAlertsTab() {
  const { data: alerts = [], isLoading } = usePropertyAlerts();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return alerts;
    const q = search.toLowerCase();
    return alerts.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.propertyType.toLowerCase().includes(q),
    );
  }, [alerts, search]);

  // Summary counts
  const actionCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const a of alerts) c[a.action] = (c[a.action] ?? 0) + 1;
    return c;
  }, [alerts]);

  return (
    <div className="space-y-6" data-ocid="watchlist.section">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="admin-stats-card">
          <span className="admin-stats-label">Total Alerts</span>
          <span className="admin-stats-value">{alerts.length}</span>
        </div>
        {Object.entries(actionCounts).map(([action, count]) => (
          <div key={action} className="admin-stats-card">
            <span className="admin-stats-label">{action}</span>
            <span className="admin-stats-value">{count}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search alerts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
          data-ocid="watchlist.search_input"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        {isLoading ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="watchlist.loading_state"
          >
            Loading watchlist alerts…
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="watchlist.empty_state"
          >
            <Bell size={32} className="mx-auto mb-3 text-muted-foreground/40" />
            <p>No property alerts set by users yet.</p>
            <p className="text-xs mt-1">
              Alerts appear here when users subscribe to property notifications.
            </p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Property Type</th>
                <th>Action</th>
                <th>Location</th>
                <th>BHK</th>
                <th>Max Budget</th>
                <th>Alert Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id} data-ocid={`watchlist.table.item.${i + 1}`}>
                  <td className="font-medium text-sm">{a.name}</td>
                  <td>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs flex items-center gap-1 text-muted-foreground">
                        <Phone size={10} /> {a.phone}
                      </span>
                      {a.email && (
                        <span className="text-xs flex items-center gap-1 text-muted-foreground">
                          <Mail size={10} /> {a.email}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="text-xs px-2 py-0.5 rounded bg-muted/20 text-foreground border border-border">
                      {a.propertyType || "Any"}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs px-2 py-0.5 rounded bg-gold-700/15 text-gold-300 border border-gold-700/30">
                      {a.action}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs flex items-center gap-1 text-muted-foreground">
                      <MapPin size={10} /> {a.location || "Any"}
                    </span>
                  </td>
                  <td className="text-xs text-muted-foreground">
                    {a.bhk || "Any"}
                  </td>
                  <td className="font-mono text-sm text-gold-300">
                    {formatBudget(a.maxBudget)}
                  </td>
                  <td className="text-xs text-muted-foreground whitespace-nowrap">
                    {fmt(a.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
