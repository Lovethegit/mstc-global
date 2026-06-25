import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLeads } from "@/hooks/useCrmQueries";
import type { Lead } from "@/types/crm";
import {
  Download,
  Flame,
  Search,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

const STAGES = [
  "All",
  "New",
  "Qualified",
  "Site Visit",
  "Negotiation",
  "Deal",
  "Post-Sale",
];
const SCORES = ["All", "Hot", "Warm", "Cold", "Spam"];
const SCORE_COLORS: Record<string, string> = {
  Hot: "bg-red-900/30 text-red-300 border-red-700/40",
  Warm: "bg-amber-900/30 text-amber-300 border-amber-700/40",
  Cold: "bg-blue-900/30 text-blue-300 border-blue-700/40",
  Spam: "bg-card text-muted-foreground border-border",
};
const STAGE_COLORS: Record<string, string> = {
  New: "bg-blue-900/20 text-blue-300 border-blue-800/30",
  Qualified: "bg-purple-900/20 text-purple-300 border-purple-800/30",
  "Site Visit": "bg-yellow-900/20 text-yellow-300 border-yellow-800/30",
  Negotiation: "bg-orange-900/20 text-orange-300 border-orange-800/30",
  Deal: "bg-green-900/20 text-green-300 border-green-800/30",
  "Post-Sale": "bg-gold-800/20 text-gold-300 border-gold-700/30",
};

const _AI_SCORES: Record<number, number> = {
  1: 87,
  2: 63,
  3: 91,
  4: 45,
  5: 72,
  6: 38,
  7: 55,
  8: 79,
};

function exportLeadsCSV(leads: Lead[]) {
  const headers = [
    "Name",
    "Phone",
    "Email",
    "Service",
    "Source",
    "Stage",
    "Score",
    "Value",
    "Assigned To",
  ];
  const rows = leads.map((l, _i) => [
    l.name,
    l.phone,
    l.email,
    l.service,
    l.source,
    l.stage,
    l.score,
    Number(l.estimatedValue),
    l.assignedTo,
  ]);
  const csv = [headers, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const MOCK_LEADS: Lead[] = [
  {
    id: 1n,
    name: "Rajesh Mehta",
    phone: "+91 9876543210",
    email: "rajesh@example.com",
    service: "Infrastructure",
    source: "Google",
    stage: "Negotiation",
    score: "Hot",
    estimatedValue: 8500000n,
    notes: "",
    createdAt: BigInt(Date.now()) * 1000000n,
    updatedAt: 0n,
    assignedTo: "Aria AI",
  },
  {
    id: 2n,
    name: "Priya Shah",
    phone: "+91 9823456780",
    email: "priya@example.com",
    service: "Finance",
    source: "WhatsApp",
    stage: "Qualified",
    score: "Warm",
    estimatedValue: 2000000n,
    notes: "",
    createdAt: 0n,
    updatedAt: 0n,
    assignedTo: "Lead AI",
  },
  {
    id: 3n,
    name: "Vikram Patel",
    phone: "+91 9988776655",
    email: "vikram@example.com",
    service: "RERA",
    source: "Referral",
    stage: "New",
    score: "Warm",
    estimatedValue: 3500000n,
    notes: "",
    createdAt: 0n,
    updatedAt: 0n,
    assignedTo: "RERA AI",
  },
  {
    id: 4n,
    name: "Anita Joshi",
    phone: "+91 9512609016",
    email: "anita@example.com",
    service: "Infrastructure",
    source: "Direct",
    stage: "Deal",
    score: "Hot",
    estimatedValue: 12000000n,
    notes: "",
    createdAt: 0n,
    updatedAt: 0n,
    assignedTo: "Aria AI",
  },
  {
    id: 5n,
    name: "Suresh Kumar",
    phone: "+91 9090909090",
    email: "suresh@example.com",
    service: "Infrastructure",
    source: "JustDial",
    stage: "Site Visit",
    score: "Warm",
    estimatedValue: 5500000n,
    notes: "",
    createdAt: 0n,
    updatedAt: 0n,
    assignedTo: "Property AI",
  },
  {
    id: 6n,
    name: "Kavita Desai",
    phone: "+91 9191919191",
    email: "kavita@example.com",
    service: "Events",
    source: "Google",
    stage: "Post-Sale",
    score: "Cold",
    estimatedValue: 150000n,
    notes: "",
    createdAt: 0n,
    updatedAt: 0n,
    assignedTo: "Events AI",
  },
  {
    id: 7n,
    name: "Mohan Agrawal",
    phone: "+91 9811234567",
    email: "mohan@example.com",
    service: "Infrastructure",
    source: "WhatsApp",
    stage: "New",
    score: "Hot",
    estimatedValue: 7000000n,
    notes: "",
    createdAt: 0n,
    updatedAt: 0n,
    assignedTo: "Lead AI",
  },
  {
    id: 8n,
    name: "Deepa Nair",
    phone: "+91 9922334455",
    email: "deepa@example.com",
    service: "Finance",
    source: "Referral",
    stage: "Qualified",
    score: "Warm",
    estimatedValue: 1500000n,
    notes: "",
    createdAt: 0n,
    updatedAt: 0n,
    assignedTo: "Finance AI",
  },
];

export default function LeadsPage() {
  const { data: fetchedLeads = [] } = useLeads();
  const leads: Lead[] =
    fetchedLeads.length > 0 ? (fetchedLeads as unknown as Lead[]) : MOCK_LEADS;
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [scoreFilter, setScoreFilter] = useState("All");
  const [leads2, setLeads2] = useState<Lead[]>(leads);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return leads2.filter((l) => {
      const matchSearch =
        !search ||
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.phone.includes(search);
      const matchStage = stageFilter === "All" || l.stage === stageFilter;
      const matchScore = scoreFilter === "All" || l.score === scoreFilter;
      return matchSearch && matchStage && matchScore;
    });
  }, [leads2, search, stageFilter, scoreFilter]);

  const stageCounts = STAGES.slice(1).reduce<Record<string, number>>(
    (acc, s) => {
      acc[s] = leads2.filter((l) => l.stage === s).length;
      return acc;
    },
    {},
  );

  function handleBulkDelete() {
    setLeads2((prev) => prev.filter((l) => !selected.has(String(l.id))));
    setSelected(new Set());
  }

  function handleExport() {
    exportLeadsCSV(filtered);
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <SecureAppGate appName="Lead Manager">
      <div className="min-h-screen bg-background pb-20" data-ocid="leads.page">
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="max-w-full flex items-center gap-2">
            <a
              href="/crm"
              className="text-gold-600 hover:text-gold-400 text-xs"
            >
              CRM
            </a>
            <span className="text-gold-700/40">/</span>
            <TrendingUp className="w-4 h-4 text-gold-400" />
            <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
              Lead Manager
            </h1>
          </div>
        </div>

        <div className="px-4 py-4">
          {/* Stage counts */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
            {STAGES.slice(1).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStageFilter(stageFilter === s ? "All" : s)}
                className={`rounded-lg p-2 border text-center transition-all ${stageFilter === s ? "border-gold-500/60 bg-gold-700/20" : "border-gold-800/30 bg-card"}`}
                data-ocid={`leads.stage_filter.${s.toLowerCase().replace(" ", "_")}`}
              >
                <p className="font-serif text-lg font-bold text-gold-400">
                  {stageCounts[s]}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {s}
                </p>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name / phone..."
                className="pl-8 bg-card border-gold-800/30 text-foreground text-sm"
                data-ocid="leads.search_input"
              />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger
                className="w-36 bg-card border-gold-800/30"
                data-ocid="leads.stage_select"
              >
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent className="bg-card border-gold-800/40">
                {STAGES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger
                className="w-32 bg-card border-gold-800/30"
                data-ocid="leads.score_select"
              >
                <SelectValue placeholder="Score" />
              </SelectTrigger>
              <SelectContent className="bg-card border-gold-800/40">
                {SCORES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-800/40 text-gold-500 text-xs hover:border-gold-600/50 transition-colors"
              data-ocid="leads.export_button"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            {selected.size > 0 && (
              <>
                <span className="flex items-center text-xs text-gold-400 px-2">
                  {selected.size} selected
                </span>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-800/40 text-red-400 text-xs hover:bg-red-900/20 transition-colors"
                  data-ocid="leads.bulk_delete_button"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Selected
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-gold-800/30">
            <table className="w-full text-sm">
              <thead className="bg-card border-b border-gold-800/30">
                <tr>
                  <th className="w-8 px-3 py-2.5">
                    <input
                      type="checkbox"
                      className="rounded accent-amber-500"
                      onChange={(e) =>
                        e.target.checked
                          ? setSelected(
                              new Set(filtered.map((l) => String(l.id))),
                            )
                          : setSelected(new Set())
                      }
                    />
                  </th>
                  {[
                    "Name",
                    "Phone",
                    "Service",
                    "Source",
                    "Stage",
                    "Score",
                    "Value",
                    "Assigned To",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left text-xs font-medium text-gold-600 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <tr
                    key={String(lead.id)}
                    className="border-b border-gold-800/20 hover:bg-card/60 transition-colors"
                    data-ocid={`leads.item.${i + 1}`}
                  >
                    <td className="px-3 py-2.5">
                      <input
                        type="checkbox"
                        checked={selected.has(String(lead.id))}
                        onChange={() => toggleSelect(String(lead.id))}
                        className="rounded accent-amber-500"
                      />
                    </td>
                    <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">
                      {lead.name}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                      {lead.phone}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                      {lead.service}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                      {lead.source}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge
                        variant="outline"
                        className={`text-xs border ${STAGE_COLORS[lead.stage] ?? ""} whitespace-nowrap`}
                      >
                        {lead.stage}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${SCORE_COLORS[lead.score] ?? ""}`}
                      >
                        {lead.score === "Hot" && <Flame className="w-3 h-3" />}
                        {lead.score}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-medium text-gold-400 whitespace-nowrap">
                      ₹{(Number(lead.estimatedValue) / 100000).toFixed(1)}L
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                      {lead.assignedTo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12" data-ocid="leads.empty_state">
                <Users className="w-10 h-10 text-gold-800/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No leads match your filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SecureAppGate>
  );
}
