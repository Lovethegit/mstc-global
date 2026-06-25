import { createActor } from "@/backend";
import TutorialFloatingButton from "@/components/TutorialFloatingButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActor } from "@/hooks/useActor";
import {
  Building2,
  ChevronLeft,
  Clock,
  Download,
  Eye,
  Flame,
  IndianRupee,
  MessageCircle,
  Phone,
  Plus,
  Search,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type HeatLevel = "Hot" | "Warm" | "Cold";
type Stage = "new" | "qualified" | "proposal" | "negotiation" | "closed";

interface CrmLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyInterest: string;
  locality: string;
  budgetMin: number;
  budgetMax: number;
  heatScore: number;
  stage: Stage;
  lastContact: string;
  source: string;
  notes: string;
  followUpDate: string;
  dealHistory: { date: string; action: string }[];
}

const _ALL_LEADS: CrmLead[] = [
  {
    id: "L001",
    name: "Rajesh Patel",
    phone: "+91 98765 43210",
    email: "rajesh.patel@gmail.com",
    propertyInterest: "3BHK Apartment",
    locality: "Bopal",
    budgetMin: 80,
    budgetMax: 90,
    heatScore: 95,
    stage: "new",
    lastContact: "2h ago",
    source: "Website Enquiry",
    notes: "Ready to buy within 3 months. Needs parking. Prefers east-facing.",
    followUpDate: "Today 6:00 PM",
    dealHistory: [
      { date: "May 28", action: "Enquiry received via website" },
      { date: "May 29", action: "Called — interested, wants site visit" },
    ],
  },
  {
    id: "L002",
    name: "Sunita Joshi",
    phone: "+91 97654 32109",
    email: "sunita.joshi@outlook.com",
    propertyInterest: "Villa",
    locality: "Satellite",
    budgetMin: 230,
    budgetMax: 270,
    heatScore: 88,
    stage: "new",
    lastContact: "1h ago",
    source: "WhatsApp",
    notes: "Wants 4BHK villa with garden. NRI returning from Dubai.",
    followUpDate: "Today 5:30 PM",
    dealHistory: [{ date: "May 30", action: "WhatsApp message received" }],
  },
  {
    id: "L003",
    name: "Priya Mehta",
    phone: "+91 99876 54321",
    email: "priya.mehta@yahoo.com",
    propertyInterest: "2BHK Apartment",
    locality: "Gota",
    budgetMin: 48,
    budgetMax: 56,
    heatScore: 72,
    stage: "qualified",
    lastContact: "Yesterday",
    source: "Referral",
    notes:
      "First-time buyer. Needs home loan guidance. Looking for ready possession.",
    followUpDate: "Tomorrow 11 AM",
    dealHistory: [
      { date: "May 25", action: "Enquiry via referral" },
      { date: "May 27", action: "Qualification call done" },
      { date: "May 29", action: "Sent loan eligibility report" },
    ],
  },
  {
    id: "L004",
    name: "Vikram Desai",
    phone: "+91 91234 56789",
    email: "vikram.desai@rediffmail.com",
    propertyInterest: "Commercial Shop",
    locality: "Prahlad Nagar",
    budgetMin: 120,
    budgetMax: 160,
    heatScore: 68,
    stage: "qualified",
    lastContact: "2 days ago",
    source: "99acres",
    notes: "Wants ground floor shop near main road. Investment purpose.",
    followUpDate: "June 2",
    dealHistory: [
      { date: "May 23", action: "Online enquiry" },
      { date: "May 26", action: "Qualification call" },
    ],
  },
  {
    id: "L005",
    name: "Amit Shah",
    phone: "+91 98765 12345",
    email: "amit.shah@gmail.com",
    propertyInterest: "Residential Plot",
    locality: "Sanand",
    budgetMin: 110,
    budgetMax: 130,
    heatScore: 45,
    stage: "proposal",
    lastContact: "5 days ago",
    source: "Builder Direct",
    notes: "Looking for NA plot for self-construction. Financing pre-approved.",
    followUpDate: "June 3",
    dealHistory: [
      { date: "May 20", action: "Enquiry via builder" },
      { date: "May 22", action: "Site visit arranged" },
      { date: "May 25", action: "Proposal sent — 3 options" },
    ],
  },
  {
    id: "L006",
    name: "Kavita Sharma",
    phone: "+91 94567 89012",
    email: "kavita.sharma@gmail.com",
    propertyInterest: "2BHK Flat",
    locality: "Chandkheda",
    budgetMin: 38,
    budgetMax: 44,
    heatScore: 60,
    stage: "proposal",
    lastContact: "3 days ago",
    source: "MagicBricks",
    notes: "Teacher, government employee. Wants PMAY-linked property.",
    followUpDate: "June 1",
    dealHistory: [
      { date: "May 21", action: "Online enquiry" },
      { date: "May 28", action: "Proposal sent" },
    ],
  },
  {
    id: "L007",
    name: "Deepak Trivedi",
    phone: "+91 99001 23456",
    email: "deepak.trivedi@gmail.com",
    propertyInterest: "4BHK Penthouse",
    locality: "Bodakdev",
    budgetMin: 340,
    budgetMax: 380,
    heatScore: 82,
    stage: "negotiation",
    lastContact: "Today",
    source: "Direct Walk-in",
    notes: "Negotiating 5% discount. All documentation ready. Very serious.",
    followUpDate: "Today 4:00 PM",
    dealHistory: [
      { date: "May 15", action: "Walk-in visit" },
      { date: "May 18", action: "Site visit x2" },
      { date: "May 22", action: "Offer made" },
      { date: "May 29", action: "Counter-offer received" },
    ],
  },
  {
    id: "L008",
    name: "Nisha Agarwal",
    phone: "+91 97890 12345",
    email: "nisha.agarwal@gmail.com",
    propertyInterest: "3BHK Apartment",
    locality: "Thaltej",
    budgetMin: 145,
    budgetMax: 165,
    heatScore: 77,
    stage: "negotiation",
    lastContact: "Yesterday",
    source: "Instagram",
    notes: "Wants modular kitchen included. Final agreement in progress.",
    followUpDate: "June 1",
    dealHistory: [
      { date: "May 10", action: "Instagram DM" },
      { date: "May 17", action: "Site visit" },
      { date: "May 28", action: "Agreement draft shared" },
    ],
  },
  {
    id: "L009",
    name: "Suresh Panchal",
    phone: "+91 96543 21098",
    email: "suresh.panchal@gmail.com",
    propertyInterest: "3BHK Apartment",
    locality: "SG Highway",
    budgetMin: 130,
    budgetMax: 150,
    heatScore: 100,
    stage: "closed",
    lastContact: "May 28",
    source: "Word of Mouth",
    notes: "Deal closed at ₹1.38Cr. Registration scheduled June 5.",
    followUpDate: "June 5 (Registration)",
    dealHistory: [
      { date: "May 1", action: "Referral enquiry" },
      { date: "May 8", action: "3 site visits" },
      { date: "May 20", action: "Token amount received ₹5L" },
      { date: "May 28", action: "Agreement signed ₹1.38Cr" },
    ],
  },
  {
    id: "L010",
    name: "Meena Kapoor",
    phone: "+91 98900 56789",
    email: "meena.kapoor@gmail.com",
    propertyInterest: "2BHK Flat",
    locality: "Motera",
    budgetMin: 60,
    budgetMax: 68,
    heatScore: 100,
    stage: "closed",
    lastContact: "May 27",
    source: "Housing.com",
    notes: "Deal closed at ₹64L. Keys handed over May 30.",
    followUpDate: "Completed",
    dealHistory: [
      { date: "May 5", action: "Online enquiry" },
      { date: "May 12", action: "Site visit" },
      { date: "May 20", action: "Offer accepted" },
      { date: "May 27", action: "Registration done" },
    ],
  },
];

const STAGES_CONFIG: { key: Stage; label: string; color: string }[] = [
  {
    key: "new",
    label: "New Lead",
    color: "border-2 border-blue-400/40 bg-blue-950/10",
  },
  {
    key: "qualified",
    label: "Qualified",
    color: "border-2 border-emerald-400/40 bg-emerald-950/10",
  },
  {
    key: "proposal",
    label: "Proposal Sent",
    color: "border-2 border-amber-400/40 bg-amber-950/10",
  },
  {
    key: "negotiation",
    label: "Negotiation",
    color: "border-2 border-orange-400/40 bg-orange-950/10",
  },
  {
    key: "closed",
    label: "Closed Won",
    color: "border-2 border-gold-400/40 bg-gold-950/10",
  },
];

const HEAT_COLORS: Record<HeatLevel, string> = {
  Hot: "text-red-400",
  Warm: "text-amber-400",
  Cold: "text-blue-400",
};

function getHeatLevel(score: number): HeatLevel {
  if (score >= 80) return "Hot";
  if (score >= 60) return "Warm";
  return "Cold";
}

function exportCRMCSV(leads: CrmLead[]) {
  const headers = [
    "ID",
    "Name",
    "Phone",
    "Email",
    "Property",
    "Locality",
    "Budget Min",
    "Budget Max",
    "Heat Score",
    "Stage",
    "Source",
  ];
  const rows = leads.map((l) => [
    l.id,
    l.name,
    l.phone,
    l.email,
    l.propertyInterest,
    l.locality,
    l.budgetMin,
    l.budgetMax,
    l.heatScore,
    l.stage,
    l.source,
  ]);
  const csv = [headers, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `crm-leads-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Exported as CSV");
}

function _formatBudget(min: number, max: number) {
  const fmt = (n: number) =>
    n >= 100 ? `₹${(n / 100).toFixed(1)}Cr` : `₹${n}L`;
  return `${fmt(min)}–${fmt(max)}`;
}

export default function CrmPage() {
  const { actor, isFetching } = useActor(createActor);
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [_isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [activeStage, setActiveStage] = useState<Stage | "all">("all");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [detail, setDetail] = useState<CrmLead | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<Stage | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    propertyInterest: "",
    locality: "",
    budgetMin: "",
    budgetMax: "",
    source: "Website",
    notes: "",
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!actor || isFetching) return;
    const fetchLeads = async () => {
      try {
        setIsLoadingLeads(true);
        const result = await actor.getLeads();
        setLeads(result as unknown as CrmLead[]);
      } catch (e) {
        console.error("Failed to fetch leads", e);
      } finally {
        setIsLoadingLeads(false);
      }
    };
    fetchLeads();
  }, [actor, isFetching]);

  const byStage = useMemo(() => {
    const m: Record<Stage, CrmLead[]> = {
      new: [],
      qualified: [],
      proposal: [],
      negotiation: [],
      closed: [],
    };
    for (const l of leads) {
      m[l.stage].push(l);
    }
    return m;
  }, [leads]);

  const filteredByStage = useMemo(() => {
    const m: Record<Stage, CrmLead[]> = {
      new: [],
      qualified: [],
      proposal: [],
      negotiation: [],
      closed: [],
    };
    const staged = leads.filter((l) => {
      const q = search.toLowerCase();
      return (
        (!search || l.name.toLowerCase().includes(q) || l.phone.includes(q)) &&
        (activeStage === "all" || l.stage === activeStage)
      );
    });
    for (const l of staged) {
      m[l.stage].push(l);
    }
    return m;
  }, [leads, search, activeStage]);

  function moveToNext(lead: CrmLead) {
    const order: Stage[] = [
      "new",
      "qualified",
      "proposal",
      "negotiation",
      "closed",
    ];
    const idx = order.indexOf(lead.stage);
    if (idx < order.length - 1) {
      const next = order[idx + 1];
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, stage: next } : l)),
      );
      actor?.updateLeadStage(lead.id, next).catch(console.error);
      toast.success(
        `${lead.name} moved to ${STAGES_CONFIG.find((s) => s.key === next)?.label}`,
      );
    }
  }

  function handleDrop(targetStage: Stage) {
    if (!dragId) return;
    const moved = leads.find((l) => l.id === dragId);
    setLeads((prev) =>
      prev.map((l) => (l.id === dragId ? { ...l, stage: targetStage } : l)),
    );
    if (moved)
      toast.success(
        `${moved.name} moved to ${STAGES_CONFIG.find((s) => s.key === targetStage)?.label}`,
      );
    setDragId(null);
    setDragOver(null);
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setAdding(true);
    setTimeout(() => {
      const newLead: CrmLead = {
        id: `L${String(leads.length + 1).padStart(3, "0")}`,
        name: form.name,
        phone: form.phone,
        email: form.email,
        propertyInterest: form.propertyInterest,
        locality: form.locality,
        budgetMin: Number(form.budgetMin) || 0,
        budgetMax: Number(form.budgetMax) || 0,
        heatScore: 60,
        stage: "new",
        lastContact: "Just now",
        source: form.source,
        notes: form.notes,
        followUpDate: "Tomorrow",
        dealHistory: [
          {
            date: new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            }),
            action: "New lead added",
          },
        ],
      };
      setLeads((prev) => [newLead, ...prev]);
      actor
        ?.createLead(
          newLead.name,
          newLead.phone,
          newLead.email || "",
          newLead.source || "Direct",
          newLead.budgetMax?.toString() || "",
          newLead.propertyInterest || "",
          "",
        )
        .catch(console.error);
      setShowAdd(false);
      setForm({
        name: "",
        phone: "",
        email: "",
        propertyInterest: "",
        locality: "",
        budgetMin: "",
        budgetMax: "",
        source: "Website",
        notes: "",
      });
      setAdding(false);
      toast.success("Lead added successfully");
    }, 700);
  }

  return (
    <div className="min-h-screen bg-background pb-20" data-ocid="crm.page">
      <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="text-gold-600 hover:text-gold-400 text-xs flex items-center gap-1"
              data-ocid="crm.back_button"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>
            <span className="text-gold-700/40">/</span>
            <TrendingUp className="w-4 h-4 text-gold-400" />
            <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
              CRM Pipeline
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportCRMCSV(leads)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-800/40 text-gold-500 text-xs hover:border-gold-600/50 transition-colors"
              data-ocid="crm.export_button"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
              data-ocid="crm.add_lead_button"
            >
              <Plus className="w-3.5 h-3.5" /> Add Lead
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name / phone..."
              className="pl-8 bg-card border-gold-800/30 text-foreground text-sm"
              data-ocid="crm.search_input"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveStage("all")}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${activeStage === "all" ? "border-gold-500/50 bg-gold-700/20 text-gold-300" : "border-gold-800/30 text-gold-600"}`}
              data-ocid="crm.filter.all"
            >
              All ({leads.length})
            </button>
            {STAGES_CONFIG.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() =>
                  setActiveStage(activeStage === s.key ? "all" : s.key)
                }
                className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${activeStage === s.key ? "border-gold-500/50 bg-gold-700/20 text-gold-300" : "border-gold-800/30 text-gold-600"}`}
                data-ocid={`crm.filter.${s.key}`}
              >
                {s.label} ({byStage[s.key].length})
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {STAGES_CONFIG.map((stage) => {
              const cards = filteredByStage[stage.key];
              return (
                <div
                  key={stage.key}
                  className={`w-64 rounded-xl flex flex-col transition-all ${dragOver === stage.key ? "border-2 border-gold-400/60 bg-gold-700/10" : stage.color}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(stage.key);
                  }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={() => handleDrop(stage.key)}
                  data-ocid={`crm.stage.${stage.key}`}
                >
                  <div className="px-3 py-2.5 border-b border-gold-800/20 flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      {stage.label}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-gold-700/30 text-gold-500"
                    >
                      {byStage[stage.key].length}
                    </Badge>
                  </div>
                  <div className="flex-1 overflow-y-auto max-h-[65vh] p-2 space-y-2">
                    {cards.map((lead) => {
                      const heat = getHeatLevel(lead.heatScore);
                      return (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={() => setDragId(lead.id)}
                          onDragEnd={() => {
                            setDragId(null);
                            setDragOver(null);
                          }}
                          className={`rounded-lg border border-gold-800/30 bg-card p-3 cursor-grab active:cursor-grabbing hover:border-gold-500/40 transition-all select-none ${dragId === lead.id ? "opacity-40 scale-95" : ""}`}
                          data-ocid={`crm.lead_card.${lead.id}`}
                        >
                          <div className="flex items-start justify-between gap-1 mb-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <div className="w-6 h-6 rounded-full bg-gold-700/20 flex items-center justify-center shrink-0">
                                <User className="w-3 h-3 text-gold-400" />
                              </div>
                              <span className="text-xs font-medium text-foreground truncate">
                                {lead.name}
                              </span>
                            </div>
                            <span
                              className={`text-xs font-bold shrink-0 flex items-center gap-0.5 ${HEAT_COLORS[heat]}`}
                            >
                              {heat === "Hot" && <Flame className="w-3 h-3" />}
                              {lead.heatScore}
                            </span>
                          </div>
                          <div className="space-y-1 mb-2">
                            <p className="text-[10px] text-muted-foreground">
                              {lead.phone}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {lead.propertyInterest} — {lead.locality}
                            </p>
                            <p className="text-[10px] text-gold-500">
                              ₹{lead.budgetMin}–{lead.budgetMax}L
                            </p>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => setDetail(lead)}
                              className="flex-1 text-[10px] py-1 rounded-md bg-gold-700/10 hover:bg-gold-700/20 text-gold-500 transition-colors"
                              data-ocid={`crm.view_button.${lead.id}`}
                            >
                              <Eye className="w-3 h-3 inline mr-0.5" />
                              View
                            </button>
                            {lead.stage !== "closed" && (
                              <button
                                type="button"
                                onClick={() => moveToNext(lead)}
                                className="flex-1 text-[10px] py-1 rounded-md bg-green-900/20 hover:bg-green-900/30 text-green-400 transition-colors"
                                data-ocid={`crm.advance_button.${lead.id}`}
                              >
                                Advance →
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {cards.length === 0 && (
                      <div className="text-center py-8 text-[10px] text-muted-foreground/50 border-2 border-dashed border-gold-800/20 rounded-lg m-1">
                        Drop cards here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent
          className="bg-card border-gold-700/40 max-w-md"
          data-ocid="crm.add_lead_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-serif text-gold-300">
              Add New Lead
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gold-600">Full Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Rajesh Patel"
                  className="mt-1 bg-background border-gold-800/40 text-sm"
                  required
                  data-ocid="crm.add_name_input"
                />
              </div>
              <div>
                <Label className="text-xs text-gold-600">Phone *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="+91 98765 43210"
                  className="mt-1 bg-background border-gold-800/40 text-sm"
                  required
                  data-ocid="crm.add_phone_input"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-gold-600">Email</Label>
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="email@example.com"
                type="email"
                className="mt-1 bg-background border-gold-800/40 text-sm"
                data-ocid="crm.add_email_input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gold-600">
                  Property Interest
                </Label>
                <Input
                  value={form.propertyInterest}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, propertyInterest: e.target.value }))
                  }
                  placeholder="3BHK Flat"
                  className="mt-1 bg-background border-gold-800/40 text-sm"
                  data-ocid="crm.add_interest_input"
                />
              </div>
              <div>
                <Label className="text-xs text-gold-600">Locality</Label>
                <Input
                  value={form.locality}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, locality: e.target.value }))
                  }
                  placeholder="Bopal"
                  className="mt-1 bg-background border-gold-800/40 text-sm"
                  data-ocid="crm.add_locality_input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gold-600">Budget Min (L)</Label>
                <Input
                  value={form.budgetMin}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, budgetMin: e.target.value }))
                  }
                  placeholder="50"
                  type="number"
                  className="mt-1 bg-background border-gold-800/40 text-sm"
                  data-ocid="crm.add_budget_min_input"
                />
              </div>
              <div>
                <Label className="text-xs text-gold-600">Budget Max (L)</Label>
                <Input
                  value={form.budgetMax}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, budgetMax: e.target.value }))
                  }
                  placeholder="80"
                  type="number"
                  className="mt-1 bg-background border-gold-800/40 text-sm"
                  data-ocid="crm.add_budget_max_input"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-gold-600">Source</Label>
              <Select
                value={form.source}
                onValueChange={(v) => setForm((f) => ({ ...f, source: v }))}
              >
                <SelectTrigger
                  className="mt-1 bg-background border-gold-800/40"
                  data-ocid="crm.add_source_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-800/40">
                  {[
                    "Website",
                    "WhatsApp",
                    "Referral",
                    "Google",
                    "JustDial",
                    "LinkedIn",
                    "99acres",
                    "Direct",
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gold-600">Notes</Label>
              <Input
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Initial notes..."
                className="mt-1 bg-background border-gold-800/40 text-sm"
                data-ocid="crm.add_notes_input"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdd(false)}
                className="flex-1 border-gold-800/40 text-gold-500"
                data-ocid="crm.add_cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={adding}
                className="flex-1 bg-gold-700/30 hover:bg-gold-700/40 text-gold-300 border border-gold-600/40"
                data-ocid="crm.add_submit_button"
              >
                {adding ? "Adding..." : "Add Lead"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {detail && (
        <div
          className="fixed inset-0 z-50 flex"
          onClick={() => setDetail(null)}
          onKeyDown={(e) => e.key === "Escape" && setDetail(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative ml-auto w-full max-w-sm bg-card border-l border-gold-700/40 h-full overflow-y-auto p-5"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={() => {}}
          >
            <button
              type="button"
              onClick={() => setDetail(null)}
              className="absolute top-4 right-4 text-gold-600 hover:text-gold-400"
              data-ocid="crm.detail.close_button"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-gold-700/20 flex items-center justify-center">
                <User className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-foreground">
                  {detail.name}
                </h2>
                <span
                  className={`text-xs font-semibold ${HEAT_COLORS[getHeatLevel(detail.heatScore)]}`}
                >
                  {getHeatLevel(detail.heatScore)} — Score: {detail.heatScore}
                  /100
                </span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {(
                [
                  ["Phone", detail.phone],
                  ["Email", detail.email || "—"],
                  ["Interest", detail.propertyInterest || "—"],
                  ["Locality", detail.locality || "—"],
                  ["Budget", `₹${detail.budgetMin}L – ₹${detail.budgetMax}L`],
                  [
                    "Stage",
                    STAGES_CONFIG.find((s) => s.key === detail.stage)?.label ??
                      detail.stage,
                  ],
                  ["Source", detail.source],
                  ["Last Contact", detail.lastContact],
                  ["Follow Up", detail.followUpDate],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between border-b border-gold-800/10 pb-1.5"
                >
                  <span className="text-muted-foreground shrink-0">{k}</span>
                  <span className="text-foreground font-medium text-right max-w-[180px] truncate">
                    {v}
                  </span>
                </div>
              ))}
              {detail.notes && (
                <div className="pt-2">
                  <p className="text-xs text-gold-600 mb-1">Notes</p>
                  <p className="text-xs text-muted-foreground">
                    {detail.notes}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <a href={`tel:${detail.phone}`} className="flex-1">
                <button
                  type="button"
                  className="w-full py-2 rounded-lg bg-emerald-900/20 text-emerald-400 text-sm border border-emerald-800/30 flex items-center justify-center gap-1.5"
                  data-ocid="crm.detail.call_button"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call
                </button>
              </a>
              <a
                href={`https://wa.me/${detail.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <button
                  type="button"
                  className="w-full py-2 rounded-lg bg-green-900/20 text-green-400 text-sm border border-green-800/30 flex items-center justify-center gap-1.5"
                  data-ocid="crm.detail.whatsapp_button"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </button>
              </a>
            </div>
            {detail.stage !== "closed" && (
              <button
                type="button"
                onClick={() => {
                  moveToNext(detail);
                  setDetail(null);
                }}
                className="mt-3 w-full py-2.5 rounded-lg bg-green-900/20 hover:bg-green-900/30 text-green-400 text-sm font-medium border border-green-800/30 transition-colors"
                data-ocid="crm.detail.advance_button"
              >
                Move to Next Stage →
              </button>
            )}
          </div>
        </div>
      )}
      <TutorialFloatingButton />
    </div>
  );
}
