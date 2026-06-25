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
import {
  ArrowLeft,
  Filter,
  Flame,
  PhoneCall,
  Plus,
  Search,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const LEADS = [
  {
    id: 1,
    name: "Rajesh Mehta",
    phone: "+91 9876543210",
    email: "rajesh@example.com",
    source: "Google Ads",
    status: "Hot",
    stage: "Negotiation",
    value: 85,
    date: "2026-05-28",
  },
  {
    id: 2,
    name: "Priya Shah",
    phone: "+91 9823456780",
    email: "priya@example.com",
    source: "Website",
    status: "Warm",
    stage: "Site Visit",
    value: 45,
    date: "2026-05-27",
  },
  {
    id: 3,
    name: "Vikram Patel",
    phone: "+91 9988776655",
    email: "vikram@example.com",
    source: "Referral",
    status: "Hot",
    stage: "Qualified",
    value: 120,
    date: "2026-05-26",
  },
  {
    id: 4,
    name: "Meena Desai",
    phone: "+91 9765432100",
    email: "meena@example.com",
    source: "Facebook",
    status: "Cold",
    stage: "New",
    value: 30,
    date: "2026-05-26",
  },
  {
    id: 5,
    name: "Suresh Kumar",
    phone: "+91 9654321098",
    email: "suresh@example.com",
    source: "IVR",
    status: "Warm",
    stage: "Follow Up",
    value: 65,
    date: "2026-05-25",
  },
  {
    id: 6,
    name: "Anita Joshi",
    phone: "+91 9543210987",
    email: "anita@example.com",
    source: "WhatsApp",
    status: "Hot",
    stage: "Deal",
    value: 195,
    date: "2026-05-25",
  },
  {
    id: 7,
    name: "Nilesh Shah",
    phone: "+91 9432109876",
    email: "nilesh@example.com",
    source: "Referral",
    status: "Warm",
    stage: "Site Visit",
    value: 78,
    date: "2026-05-24",
  },
  {
    id: 8,
    name: "Kavita Rao",
    phone: "+91 9321098765",
    email: "kavita@example.com",
    source: "Google Ads",
    status: "Cold",
    stage: "New",
    value: 22,
    date: "2026-05-24",
  },
  {
    id: 9,
    name: "Deepak Verma",
    phone: "+91 9210987654",
    email: "deepak@example.com",
    source: "Website",
    status: "Hot",
    stage: "Negotiation",
    value: 145,
    date: "2026-05-23",
  },
  {
    id: 10,
    name: "Rekha Sharma",
    phone: "+91 9109876543",
    email: "rekha@example.com",
    source: "Facebook",
    status: "Warm",
    stage: "Qualified",
    value: 55,
    date: "2026-05-23",
  },
  {
    id: 11,
    name: "Manoj Gupta",
    phone: "+91 9098765432",
    email: "manoj@example.com",
    source: "Referral",
    status: "Hot",
    stage: "Site Visit",
    value: 98,
    date: "2026-05-22",
  },
  {
    id: 12,
    name: "Sunita Mehta",
    phone: "+91 9876501234",
    email: "sunita@example.com",
    source: "Website",
    status: "Cold",
    stage: "New",
    value: 18,
    date: "2026-05-22",
  },
  {
    id: 13,
    name: "Ravi Patel",
    phone: "+91 9765012345",
    email: "ravi@example.com",
    source: "WhatsApp",
    status: "Warm",
    stage: "Follow Up",
    value: 42,
    date: "2026-05-21",
  },
  {
    id: 14,
    name: "Pooja Jain",
    phone: "+91 9654023456",
    email: "pooja@example.com",
    source: "IVR",
    status: "Hot",
    stage: "Deal",
    value: 220,
    date: "2026-05-21",
  },
  {
    id: 15,
    name: "Ajay Singh",
    phone: "+91 9543034567",
    email: "ajay@example.com",
    source: "Google Ads",
    status: "Cold",
    stage: "New",
    value: 28,
    date: "2026-05-20",
  },
  {
    id: 16,
    name: "Neha Kapoor",
    phone: "+91 9432045678",
    email: "neha@example.com",
    source: "Facebook",
    status: "Warm",
    stage: "Qualified",
    value: 72,
    date: "2026-05-20",
  },
  {
    id: 17,
    name: "Sanjay Agarwal",
    phone: "+91 9321056789",
    email: "sanjay@example.com",
    source: "Referral",
    status: "Hot",
    stage: "Negotiation",
    value: 160,
    date: "2026-05-19",
  },
  {
    id: 18,
    name: "Divya Nair",
    phone: "+91 9210067890",
    email: "divya@example.com",
    source: "Website",
    status: "Warm",
    stage: "Site Visit",
    value: 88,
    date: "2026-05-19",
  },
  {
    id: 19,
    name: "Harish Reddy",
    phone: "+91 9109078901",
    email: "harish@example.com",
    source: "WhatsApp",
    status: "Cold",
    stage: "New",
    value: 15,
    date: "2026-05-18",
  },
  {
    id: 20,
    name: "Lalita Trivedi",
    phone: "+91 9098089012",
    email: "lalita@example.com",
    source: "IVR",
    status: "Hot",
    stage: "Deal",
    value: 310,
    date: "2026-05-18",
  },
  {
    id: 21,
    name: "Bharat Shah",
    phone: "+91 9876590123",
    email: "bharat@example.com",
    source: "Referral",
    status: "Warm",
    stage: "Follow Up",
    value: 58,
    date: "2026-05-17",
  },
  {
    id: 22,
    name: "Kiran Pandya",
    phone: "+91 9765601234",
    email: "kiran@example.com",
    source: "Google Ads",
    status: "Hot",
    stage: "Qualified",
    value: 135,
    date: "2026-05-17",
  },
  {
    id: 23,
    name: "Tara Mishra",
    phone: "+91 9654712345",
    email: "tara@example.com",
    source: "Facebook",
    status: "Cold",
    stage: "New",
    value: 20,
    date: "2026-05-16",
  },
  {
    id: 24,
    name: "Umesh Bhatia",
    phone: "+91 9543823456",
    email: "umesh@example.com",
    source: "Website",
    status: "Warm",
    stage: "Site Visit",
    value: 82,
    date: "2026-05-16",
  },
  {
    id: 25,
    name: "Varsha Kulkarni",
    phone: "+91 9432934567",
    email: "varsha@example.com",
    source: "Referral",
    status: "Hot",
    stage: "Negotiation",
    value: 175,
    date: "2026-05-15",
  },
  {
    id: 26,
    name: "Waman Thakkar",
    phone: "+91 9322045678",
    email: "waman@example.com",
    source: "WhatsApp",
    status: "Cold",
    stage: "New",
    value: 25,
    date: "2026-05-15",
  },
  {
    id: 27,
    name: "Xena Dsouza",
    phone: "+91 9211156789",
    email: "xena@example.com",
    source: "IVR",
    status: "Warm",
    stage: "Qualified",
    value: 67,
    date: "2026-05-14",
  },
  {
    id: 28,
    name: "Yogesh Patil",
    phone: "+91 9100267890",
    email: "yogesh@example.com",
    source: "Google Ads",
    status: "Hot",
    stage: "Deal",
    value: 250,
    date: "2026-05-14",
  },
  {
    id: 29,
    name: "Zara Khan",
    phone: "+91 9099378901",
    email: "zara@example.com",
    source: "Facebook",
    status: "Cold",
    stage: "New",
    value: 12,
    date: "2026-05-13",
  },
  {
    id: 30,
    name: "Arjun Rathod",
    phone: "+91 9988489012",
    email: "arjun@example.com",
    source: "Referral",
    status: "Warm",
    stage: "Follow Up",
    value: 91,
    date: "2026-05-13",
  },
];

const STATUS_COLORS: Record<string, string> = {
  Hot: "bg-red-900/30 text-red-300 border-red-700/40",
  Warm: "bg-amber-900/30 text-amber-300 border-amber-700/40",
  Cold: "bg-blue-900/30 text-blue-300 border-blue-700/40",
};

const STAGE_COLORS: Record<string, string> = {
  New: "bg-blue-900/20 text-blue-300 border-blue-800/30",
  Qualified: "bg-purple-900/20 text-purple-300 border-purple-800/30",
  "Site Visit": "bg-yellow-900/20 text-yellow-300 border-yellow-800/30",
  Negotiation: "bg-orange-900/20 text-orange-300 border-orange-800/30",
  Deal: "bg-green-900/20 text-green-300 border-green-800/30",
  "Follow Up": "bg-gold-800/20 text-gold-300 border-gold-700/30",
};

function AddLeadModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      data-ocid="lead_manager.add_modal"
    >
      <div className="bg-card border border-gold-800/30 rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gold-800/20">
          <h3 className="font-serif text-lg font-semibold text-gold-300">
            Add New Lead
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="lead_manager.add_modal.close_button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-gold-400 font-sans uppercase tracking-wide block mb-1.5">
              Full Name *
            </label>
            <Input
              placeholder="Rajesh Mehta"
              className="bg-background border-gold-800/30 text-foreground"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gold-400 font-sans uppercase tracking-wide block mb-1.5">
                Phone *
              </label>
              <Input
                placeholder="+91 98765 43210"
                className="bg-background border-gold-800/30 text-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-gold-400 font-sans uppercase tracking-wide block mb-1.5">
                Email
              </label>
              <Input
                placeholder="email@example.com"
                className="bg-background border-gold-800/30 text-foreground"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gold-400 font-sans uppercase tracking-wide block mb-1.5">
                Source
              </label>
              <Select>
                <SelectTrigger className="bg-background border-gold-800/30 text-foreground">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-800/30">
                  {[
                    "Website",
                    "Google Ads",
                    "Facebook",
                    "Referral",
                    "WhatsApp",
                    "IVR",
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-gold-400 font-sans uppercase tracking-wide block mb-1.5">
                Status
              </label>
              <Select>
                <SelectTrigger className="bg-background border-gold-800/30 text-foreground">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-800/30">
                  {["Hot", "Warm", "Cold"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gold-400 font-sans uppercase tracking-wide block mb-1.5">
              Budget (Lakhs ₹)
            </label>
            <Input
              type="number"
              placeholder="75"
              className="bg-background border-gold-800/30 text-foreground"
            />
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-gold-800/20">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gold-800/30 text-muted-foreground hover:text-foreground transition-colors font-sans text-sm"
            data-ocid="lead_manager.add_modal.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gold-700/80 hover:bg-gold-600/80 text-obsidian-900 font-semibold transition-colors font-sans text-sm"
            data-ocid="lead_manager.add_modal.submit_button"
          >
            Add Lead
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LeadManagerPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = LEADS.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search);
    const matchStatus = statusFilter === "All" || l.status === statusFilter;
    const matchStage = stageFilter === "All" || l.stage === stageFilter;
    return matchSearch && matchStatus && matchStage;
  });

  const stats = [
    {
      label: "New",
      value: LEADS.filter((l) => l.stage === "New").length,
      color: "text-blue-300",
      icon: Users,
    },
    {
      label: "Follow Up",
      value: LEADS.filter((l) => l.stage === "Follow Up").length,
      color: "text-amber-300",
      icon: PhoneCall,
    },
    {
      label: "Hot Leads",
      value: LEADS.filter((l) => l.status === "Hot").length,
      color: "text-red-300",
      icon: Flame,
    },
    {
      label: "Deals Closed",
      value: LEADS.filter((l) => l.stage === "Deal").length,
      color: "text-gold-300",
      icon: TrendingUp,
    },
  ];

  return (
    <SecureAppGate appName="Lead Manager">
      <div className="min-h-screen bg-background">
        <div className="border-b border-gold-800/20 bg-card px-4 sm:px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <a
              href="/apps"
              className="text-muted-foreground hover:text-gold-400 transition-colors"
              data-ocid="lead_manager.back_button"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="font-serif font-bold text-xl text-gold-300">
                Lead Manager
              </h1>
              <p className="text-xs text-muted-foreground font-sans">
                CRM pipeline — {LEADS.length} total leads
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-card border border-gold-800/20 rounded-xl p-4"
                data-ocid={`lead_manager.stat.${s.label.toLowerCase().replace(/ /g, "_")}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                  <span className="text-xs text-muted-foreground font-sans">
                    {s.label}
                  </span>
                </div>
                <p className={`text-2xl font-bold font-sans ${s.color}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card border-gold-800/30 text-foreground"
                data-ocid="lead_manager.search_input"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  className="w-32 bg-card border-gold-800/30 text-foreground"
                  data-ocid="lead_manager.status_filter"
                >
                  <Filter className="w-3 h-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-800/30">
                  {["All", "Hot", "Warm", "Cold"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger
                  className="w-36 bg-card border-gold-800/30 text-foreground"
                  data-ocid="lead_manager.stage_filter"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-800/30">
                  {[
                    "All",
                    "New",
                    "Qualified",
                    "Site Visit",
                    "Negotiation",
                    "Deal",
                    "Follow Up",
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-gold-700/80 hover:bg-gold-600/80 text-obsidian-900 font-semibold rounded-lg transition-colors font-sans text-sm whitespace-nowrap"
                data-ocid="lead_manager.add_button"
              >
                <Plus className="w-4 h-4" /> Add Lead
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card border border-gold-800/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold-800/20">
                    {[
                      "#",
                      "Name",
                      "Phone",
                      "Source",
                      "Status",
                      "Stage",
                      "Budget (L)",
                      "Date",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs text-gold-500 font-sans uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead, i) => (
                    <tr
                      key={lead.id}
                      className="border-b border-gold-800/10 hover:bg-gold-800/5 transition-colors"
                      data-ocid={`lead_manager.item.${i + 1}`}
                    >
                      <td className="px-4 py-3 text-xs text-muted-foreground font-sans">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground font-sans font-medium">
                          {lead.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-sans">
                          {lead.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground font-sans">
                        {lead.phone}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground font-sans">
                        {lead.source}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`text-xs border ${STATUS_COLORS[lead.status] ?? ""}`}
                        >
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`text-xs border ${STAGE_COLORS[lead.stage] ?? ""}`}
                        >
                          {lead.stage}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gold-300 font-sans font-semibold text-right">
                        ₹{lead.value}L
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-sans">
                        {lead.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div
                className="py-12 text-center text-muted-foreground font-sans text-sm"
                data-ocid="lead_manager.empty_state"
              >
                No leads match your filters
              </div>
            )}
          </div>
        </div>

        {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} />}
      </div>
    </SecureAppGate>
  );
}
