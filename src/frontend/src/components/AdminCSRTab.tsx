import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import type { CsrImpactEntry } from "../backend";
import { createActor } from "../backend";
import { useActor } from "../hooks/useActor";

const ADMIN_TOKEN = "Lovemstc@2019";

function useCsrImpact() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CsrImpactEntry[]>({
    queryKey: ["csrImpact"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCsrImpact();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

function useUpdateCsrEntry() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      id: string;
      value: bigint;
      description: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateCsrEntry(
        ADMIN_TOKEN,
        vars.id,
        vars.value,
        vars.description,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["csrImpact"] });
    },
  });
}

function fmt(ts: bigint) {
  const n = Number(ts) / 1_000_000;
  return new Date(n).toLocaleDateString("en-IN", { dateStyle: "medium" });
}

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    Environment: "bg-green-600/20 text-green-300 border-green-600/40",
    Education: "bg-blue-600/20 text-blue-300 border-blue-600/40",
    Health: "bg-red-600/20 text-red-300 border-red-600/40",
    Community: "bg-purple-600/20 text-purple-300 border-purple-600/40",
    Women: "bg-pink-600/20 text-pink-300 border-pink-600/40",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
        colors[category] ?? "bg-muted/20 text-foreground border-border"
      }`}
    >
      {category}
    </span>
  );
}

function CsrEditRow({
  entry,
  onCancel,
}: { entry: CsrImpactEntry; onCancel: () => void }) {
  const [value, setValue] = useState(Number(entry.value).toString());
  const [desc, setDesc] = useState(entry.description);
  const update = useUpdateCsrEntry();

  async function handleSave() {
    await update.mutateAsync({
      id: entry.id,
      value: BigInt(Math.max(0, Number(value) || 0)),
      description: desc,
    });
    onCancel();
  }

  return (
    <tr data-ocid={`csr.edit_row.${entry.id}`}>
      <td colSpan={6} className="p-4 bg-muted/10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge category={entry.category} />
            <span className="font-semibold text-sm text-foreground">
              {entry.metric}
            </span>
            <span className="text-xs text-muted-foreground">
              Year {Number(entry.year)}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                Value
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="px-3 py-2 bg-obsidian-900 border border-gold-700/40 text-foreground text-sm rounded-lg focus:outline-none focus:border-gold-500"
                data-ocid={`csr.value_input.${entry.id}`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                Description
              </label>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="px-3 py-2 bg-obsidian-900 border border-gold-700/40 text-foreground text-sm rounded-lg focus:outline-none focus:border-gold-500"
                placeholder="Description…"
                data-ocid={`csr.desc_input.${entry.id}`}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={update.isPending}
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg gold-gradient text-obsidian-900 text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
              data-ocid={`csr.save_button.${entry.id}`}
            >
              <Save size={13} /> {update.isPending ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm transition-colors"
              data-ocid={`csr.cancel_button.${entry.id}`}
            >
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

export function CSRManagementTab() {
  const { data: entries = [], isLoading } = useCsrImpact();
  const [editingId, setEditingId] = useState<string | null>(null);

  const totalBeneficiaries = entries.reduce(
    (s, e) =>
      e.category === "Community" ||
      e.metric.toLowerCase().includes("beneficiar")
        ? s + Number(e.value)
        : s,
    0,
  );

  return (
    <div className="space-y-6" data-ocid="csr.section">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="admin-stats-card">
          <span className="admin-stats-label">Total Metrics</span>
          <span className="admin-stats-value">{entries.length}</span>
        </div>
        <div className="admin-stats-card">
          <span className="admin-stats-label">Categories</span>
          <span className="admin-stats-value">
            {new Set(entries.map((e) => e.category)).size}
          </span>
        </div>
        <div className="admin-stats-card">
          <span className="admin-stats-label">Total Beneficiaries</span>
          <span className="admin-stats-value">
            {totalBeneficiaries > 0
              ? totalBeneficiaries.toLocaleString("en-IN")
              : "—"}
          </span>
        </div>
        <div className="admin-stats-card">
          <span className="admin-stats-label">Years Covered</span>
          <span className="admin-stats-value">
            {entries.length > 0
              ? `${Math.min(...entries.map((e) => Number(e.year)))}–${Math.max(...entries.map((e) => Number(e.year)))}`
              : "—"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-xs text-muted-foreground">
          Click the edit button on any row to update the metric value and
          description.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        {isLoading ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="csr.loading_state"
          >
            Loading CSR data…
          </div>
        ) : entries.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="csr.empty_state"
          >
            No CSR impact entries found. They appear here when added via the
            public CSR page.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Category</th>
                <th>Value</th>
                <th>Year</th>
                <th>Description</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) =>
                editingId === e.id ? (
                  <CsrEditRow
                    key={e.id}
                    entry={e}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <tr key={e.id} data-ocid={`csr.table.item.${i + 1}`}>
                    <td className="font-medium text-sm">{e.metric}</td>
                    <td>
                      <CategoryBadge category={e.category} />
                    </td>
                    <td className="font-mono text-lg font-bold text-gold-300">
                      {Number(e.value).toLocaleString("en-IN")}
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {Number(e.year)}
                    </td>
                    <td className="text-xs text-muted-foreground max-w-48">
                      <span className="line-clamp-2">
                        {e.description || "—"}
                      </span>
                    </td>
                    <td className="text-xs text-muted-foreground whitespace-nowrap">
                      {fmt(e.updatedAt)}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="p-1.5 rounded hover:bg-primary/10 text-primary transition-colors"
                        aria-label="Edit entry"
                        onClick={() => setEditingId(e.id)}
                        data-ocid={`csr.edit_button.${i + 1}`}
                      >
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
