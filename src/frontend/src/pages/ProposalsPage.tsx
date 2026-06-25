import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProposals } from "@/hooks/useCrmQueries";
import type { Proposal } from "@/types/crm";
import {
  CheckCircle,
  DollarSign,
  FileText,
  Plus,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

const STATUS_COLORS: Record<string, string> = {
  Draft: "bg-card text-muted-foreground border-border",
  Sent: "bg-blue-900/20 text-blue-300 border-blue-800/30",
  Accepted: "bg-green-900/20 text-green-300 border-green-800/30",
  Rejected: "bg-red-900/20 text-red-300 border-red-800/30",
};

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 1n,
    clientName: "Rajesh Mehta",
    propertyTitle: "Prahlad Nagar 3BHK",
    amount: 8500000n,
    status: "Accepted",
    createdAt: 0n,
    expiresAt: 0n,
    notes: "Luxury apartment, fully furnished",
  },
  {
    id: 2n,
    clientName: "Anita Joshi",
    propertyTitle: "SG Highway Commercial Unit",
    amount: 12000000n,
    status: "Sent",
    createdAt: 0n,
    expiresAt: 0n,
    notes: "Prime office space, 2000 sqft",
  },
  {
    id: 3n,
    clientName: "Vikram Patel",
    propertyTitle: "Navrangpura Plot",
    amount: 6500000n,
    status: "Draft",
    createdAt: 0n,
    expiresAt: 0n,
    notes: "Residential plot, corner",
  },
  {
    id: 4n,
    clientName: "Priya Shah",
    propertyTitle: "Satellite 2BHK",
    amount: 5200000n,
    status: "Accepted",
    createdAt: 0n,
    expiresAt: 0n,
    notes: "Ready-to-move apartment",
  },
  {
    id: 5n,
    clientName: "Suresh Kumar",
    propertyTitle: "Bodakdev Row House",
    amount: 9800000n,
    status: "Rejected",
    createdAt: 0n,
    expiresAt: 0n,
    notes: "Budget mismatch",
  },
];

export default function ProposalsPage() {
  const { data: fetchedProposals = [] } = useProposals();
  const proposals: Proposal[] =
    fetchedProposals.length > 0
      ? (fetchedProposals as Proposal[])
      : MOCK_PROPOSALS;
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    client: "",
    property: "",
    amount: "",
    notes: "",
  });

  const filtered = useMemo(() => {
    if (statusFilter === "All") return proposals;
    return proposals.filter((p) => p.status === statusFilter);
  }, [proposals, statusFilter]);

  const accepted = proposals.filter((p) => p.status === "Accepted").length;
  const sent = proposals.filter(
    (p) => p.status === "Sent" || p.status === "Accepted",
  ).length;
  const avgValue =
    proposals.reduce((s, p) => s + Number(p.amount), 0) /
    (proposals.length || 1);

  return (
    <SecureAppGate appName="Proposal Generator">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="proposals.page"
      >
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold-400" />
              <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
                Proposal Generator
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
              data-ocid="proposals.generate_button"
            >
              <Plus className="w-3.5 h-3.5" /> Generate Proposal
            </button>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {
                label: "Total Sent",
                value: sent,
                icon: FileText,
                color: "text-blue-400",
              },
              {
                label: "Acceptance Rate",
                value: `${Math.round((accepted / Math.max(sent, 1)) * 100)}%`,
                icon: CheckCircle,
                color: "text-green-400",
              },
              {
                label: "Avg Value",
                value: `₹${(avgValue / 100000).toFixed(1)}L`,
                icon: DollarSign,
                color: "text-gold-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-gold-800/30 bg-card p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">
                    {stat.label}
                  </span>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className={`font-serif text-xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Status Filters */}
          <div className="flex gap-2 flex-wrap mb-4">
            {["All", "Draft", "Sent", "Accepted", "Rejected"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${statusFilter === s ? "bg-gold-700/30 text-gold-300 border-gold-600/50" : "border-gold-800/30 text-gold-600 hover:text-gold-400"}`}
                data-ocid={`proposals.filter.${s.toLowerCase()}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto rounded-xl border border-gold-800/30">
            <table className="w-full text-sm">
              <thead className="bg-card border-b border-gold-800/30">
                <tr>
                  {["Client", "Property", "Amount", "Status", "Notes"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-3 py-2.5 text-left text-xs font-medium text-gold-600 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr
                    key={String(p.id)}
                    className="border-b border-gold-800/20 hover:bg-card/60 transition-colors"
                    data-ocid={`proposals.item.${i + 1}`}
                  >
                    <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">
                      {p.clientName}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {p.propertyTitle}
                    </td>
                    <td className="px-3 py-2.5 text-right font-medium text-gold-400 whitespace-nowrap">
                      ₹{(Number(p.amount) / 100000).toFixed(1)}L
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge
                        variant="outline"
                        className={`text-xs border ${STATUS_COLORS[p.status] ?? ""} whitespace-nowrap`}
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground text-xs max-w-[200px] truncate">
                      {p.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Generate Modal */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            data-ocid="proposals.dialog"
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowModal(false)}
              onKeyDown={() => {}}
              role="button"
              tabIndex={-1}
            />
            <div className="relative bg-card border border-gold-700/40 rounded-2xl p-6 w-full max-w-md">
              <h2 className="font-serif text-lg font-bold text-gold-400 mb-4">
                Generate Proposal
              </h2>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gold-600">Client Name</Label>
                  <Input
                    value={form.client}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, client: e.target.value }))
                    }
                    className="mt-1 bg-background border-gold-800/40 text-foreground"
                    data-ocid="proposals.client_input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gold-600">
                    Property Title
                  </Label>
                  <Input
                    value={form.property}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, property: e.target.value }))
                    }
                    className="mt-1 bg-background border-gold-800/40 text-foreground"
                    data-ocid="proposals.property_input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gold-600">Amount (₹)</Label>
                  <Input
                    type="number"
                    value={form.amount}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, amount: e.target.value }))
                    }
                    className="mt-1 bg-background border-gold-800/40 text-foreground"
                    data-ocid="proposals.amount_input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gold-600">Notes</Label>
                  <Textarea
                    value={form.notes}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, notes: e.target.value }))
                    }
                    className="mt-1 bg-background border-gold-800/40 text-foreground resize-none"
                    rows={3}
                    data-ocid="proposals.notes_textarea"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gold-800/40 text-muted-foreground text-sm hover:border-gold-600/50"
                  data-ocid="proposals.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gold-700/30 hover:bg-gold-700/40 text-gold-300 text-sm font-medium"
                  data-ocid="proposals.submit_button"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SecureAppGate>
  );
}
