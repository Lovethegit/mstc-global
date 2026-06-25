import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  DollarSign,
  Plus,
  Search,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const CLIENTS = [
  {
    id: 1,
    name: "Rajesh Mehta",
    phone: "+91 9876543210",
    email: "rajesh@example.com",
    type: "Investor",
    interests: ["Commercial", "Residential"],
    status: "Active",
    totalValue: 250,
    lastContact: "2026-05-26",
    deals: 3,
  },
  {
    id: 2,
    name: "Priya Shah",
    phone: "+91 9823456780",
    email: "priya@example.com",
    type: "Buyer",
    interests: ["Residential"],
    status: "Active",
    totalValue: 70,
    lastContact: "2026-05-25",
    deals: 1,
  },
  {
    id: 3,
    name: "Vikram Patel",
    phone: "+91 9988776655",
    email: "vikram@example.com",
    type: "NRI",
    interests: ["Investment", "Residential"],
    status: "Active",
    totalValue: 150,
    lastContact: "2026-05-24",
    deals: 2,
  },
  {
    id: 4,
    name: "Meena Desai",
    phone: "+91 9765432100",
    email: "meena@example.com",
    type: "Corporate",
    interests: ["Commercial", "Leasing"],
    status: "Active",
    totalValue: 420,
    lastContact: "2026-05-23",
    deals: 5,
  },
  {
    id: 5,
    name: "Suresh Kumar",
    phone: "+91 9654321098",
    email: "suresh@example.com",
    type: "Buyer",
    interests: ["Residential"],
    status: "Prospect",
    totalValue: 45,
    lastContact: "2026-05-22",
    deals: 0,
  },
  {
    id: 6,
    name: "Anita Joshi",
    phone: "+91 9543210987",
    email: "anita@example.com",
    type: "Investor",
    interests: ["Commercial", "Redevelopment"],
    status: "Active",
    totalValue: 195,
    lastContact: "2026-05-21",
    deals: 2,
  },
  {
    id: 7,
    name: "Nilesh Shah",
    phone: "+91 9432109876",
    email: "nilesh@example.com",
    type: "Buyer",
    interests: ["Residential"],
    status: "Active",
    totalValue: 82,
    lastContact: "2026-05-20",
    deals: 1,
  },
  {
    id: 8,
    name: "Kavita Rao",
    phone: "+91 9321098765",
    email: "kavita@example.com",
    type: "NRI",
    interests: ["Investment"],
    status: "Prospect",
    totalValue: 60,
    lastContact: "2026-05-19",
    deals: 0,
  },
  {
    id: 9,
    name: "Deepak Verma",
    phone: "+91 9210987654",
    email: "deepak@example.com",
    type: "Corporate",
    interests: ["Commercial"],
    status: "Active",
    totalValue: 380,
    lastContact: "2026-05-18",
    deals: 4,
  },
  {
    id: 10,
    name: "Rekha Sharma",
    phone: "+91 9109876543",
    email: "rekha@example.com",
    type: "Buyer",
    interests: ["Residential"],
    status: "Inactive",
    totalValue: 55,
    lastContact: "2026-04-15",
    deals: 1,
  },
  {
    id: 11,
    name: "Manoj Gupta",
    phone: "+91 9098765432",
    email: "manoj@example.com",
    type: "Investor",
    interests: ["Commercial", "Residential"],
    status: "Active",
    totalValue: 310,
    lastContact: "2026-05-17",
    deals: 3,
  },
  {
    id: 12,
    name: "Sunita Mehta",
    phone: "+91 9876501234",
    email: "sunita@example.com",
    type: "Buyer",
    interests: ["Residential"],
    status: "Prospect",
    totalValue: 40,
    lastContact: "2026-05-16",
    deals: 0,
  },
  {
    id: 13,
    name: "Ravi Patel",
    phone: "+91 9765012345",
    email: "ravi@example.com",
    type: "NRI",
    interests: ["Investment", "Commercial"],
    status: "Active",
    totalValue: 280,
    lastContact: "2026-05-15",
    deals: 2,
  },
  {
    id: 14,
    name: "Pooja Jain",
    phone: "+91 9654023456",
    email: "pooja@example.com",
    type: "Corporate",
    interests: ["Leasing", "Commercial"],
    status: "Active",
    totalValue: 560,
    lastContact: "2026-05-14",
    deals: 6,
  },
  {
    id: 15,
    name: "Ajay Singh",
    phone: "+91 9543034567",
    email: "ajay@example.com",
    type: "Buyer",
    interests: ["Residential"],
    status: "Inactive",
    totalValue: 28,
    lastContact: "2026-03-10",
    deals: 0,
  },
  {
    id: 16,
    name: "Neha Kapoor",
    phone: "+91 9432045678",
    email: "neha@example.com",
    type: "Investor",
    interests: ["Commercial"],
    status: "Active",
    totalValue: 140,
    lastContact: "2026-05-13",
    deals: 1,
  },
  {
    id: 17,
    name: "Sanjay Agarwal",
    phone: "+91 9321056789",
    email: "sanjay@example.com",
    type: "NRI",
    interests: ["Investment", "Residential"],
    status: "Active",
    totalValue: 320,
    lastContact: "2026-05-12",
    deals: 3,
  },
  {
    id: 18,
    name: "Divya Nair",
    phone: "+91 9210067890",
    email: "divya@example.com",
    type: "Buyer",
    interests: ["Residential"],
    status: "Prospect",
    totalValue: 65,
    lastContact: "2026-05-11",
    deals: 0,
  },
  {
    id: 19,
    name: "Harish Reddy",
    phone: "+91 9109078901",
    email: "harish@example.com",
    type: "Corporate",
    interests: ["Commercial", "Leasing"],
    status: "Active",
    totalValue: 490,
    lastContact: "2026-05-10",
    deals: 5,
  },
  {
    id: 20,
    name: "Lalita Trivedi",
    phone: "+91 9098089012",
    email: "lalita@example.com",
    type: "Investor",
    interests: ["Redevelopment"],
    status: "Active",
    totalValue: 175,
    lastContact: "2026-05-09",
    deals: 2,
  },
  {
    id: 21,
    name: "Bharat Shah",
    phone: "+91 9876590123",
    email: "bharat@example.com",
    type: "Buyer",
    interests: ["Residential"],
    status: "Active",
    totalValue: 92,
    lastContact: "2026-05-08",
    deals: 1,
  },
  {
    id: 22,
    name: "Kiran Pandya",
    phone: "+91 9765601234",
    email: "kiran@example.com",
    type: "NRI",
    interests: ["Investment"],
    status: "Prospect",
    totalValue: 120,
    lastContact: "2026-05-07",
    deals: 0,
  },
  {
    id: 23,
    name: "Tara Mishra",
    phone: "+91 9654712345",
    email: "tara@example.com",
    type: "Corporate",
    interests: ["Commercial"],
    status: "Active",
    totalValue: 210,
    lastContact: "2026-05-06",
    deals: 2,
  },
  {
    id: 24,
    name: "Umesh Bhatia",
    phone: "+91 9543823456",
    email: "umesh@example.com",
    type: "Investor",
    interests: ["Commercial", "Residential"],
    status: "Active",
    totalValue: 185,
    lastContact: "2026-05-05",
    deals: 2,
  },
  {
    id: 25,
    name: "Varsha Kulkarni",
    phone: "+91 9432934567",
    email: "varsha@example.com",
    type: "Buyer",
    interests: ["Residential"],
    status: "Inactive",
    totalValue: 38,
    lastContact: "2026-02-20",
    deals: 0,
  },
];

const TYPE_COLORS: Record<string, string> = {
  Buyer: "bg-blue-900/20 text-blue-300 border-blue-800/30",
  Investor: "bg-gold-800/20 text-gold-300 border-gold-700/30",
  NRI: "bg-purple-900/20 text-purple-300 border-purple-800/30",
  Corporate: "bg-green-900/20 text-green-300 border-green-800/30",
};

const STATUS_COLORS: Record<string, string> = {
  Active: "bg-green-900/20 text-green-300 border-green-800/30",
  Inactive: "bg-card text-muted-foreground border-border",
  Prospect: "bg-amber-900/20 text-amber-300 border-amber-800/30",
};

type Client = (typeof CLIENTS)[0];

function ClientModal({
  client,
  onClose,
}: { client: Client; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      data-ocid="client_portal.client_modal"
    >
      <div className="bg-card border border-gold-800/30 rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gold-800/20">
          <h3 className="font-serif text-lg font-semibold text-gold-300">
            {client.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            data-ocid="client_portal.client_modal.close_button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm font-sans">
            <div>
              <span className="text-gold-500 text-xs uppercase tracking-wide">
                Phone
              </span>
              <p className="text-foreground mt-0.5">{client.phone}</p>
            </div>
            <div>
              <span className="text-gold-500 text-xs uppercase tracking-wide">
                Email
              </span>
              <p className="text-foreground mt-0.5 truncate">{client.email}</p>
            </div>
            <div>
              <span className="text-gold-500 text-xs uppercase tracking-wide">
                Type
              </span>
              <p className="mt-0.5">
                <Badge
                  className={`text-xs border ${TYPE_COLORS[client.type] ?? ""}`}
                >
                  {client.type}
                </Badge>
              </p>
            </div>
            <div>
              <span className="text-gold-500 text-xs uppercase tracking-wide">
                Status
              </span>
              <p className="mt-0.5">
                <Badge
                  className={`text-xs border ${STATUS_COLORS[client.status] ?? ""}`}
                >
                  {client.status}
                </Badge>
              </p>
            </div>
            <div>
              <span className="text-gold-500 text-xs uppercase tracking-wide">
                Total Deals
              </span>
              <p className="text-foreground mt-0.5">{client.deals} deals</p>
            </div>
            <div>
              <span className="text-gold-500 text-xs uppercase tracking-wide">
                Total Value
              </span>
              <p className="text-gold-300 font-semibold mt-0.5">
                ₹{client.totalValue}L
              </p>
            </div>
          </div>
          <div>
            <span className="text-gold-500 text-xs uppercase tracking-wide font-sans">
              Property Interests
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {client.interests.map((i) => (
                <Badge
                  key={i}
                  className="bg-gold-800/20 text-gold-400 border-gold-700/30 text-xs"
                >
                  {i}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="text-gold-500 text-xs uppercase tracking-wide font-sans">
              Last Contact
            </span>
            <p className="text-foreground text-sm font-sans mt-0.5">
              {client.lastContact}
            </p>
          </div>
        </div>
        <div className="p-5 border-t border-gold-800/20">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-gold-700/80 hover:bg-gold-600/80 text-obsidian-900 font-semibold transition-colors font-sans text-sm"
            data-ocid="client_portal.client_modal.close_button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClientPortalPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Client | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = CLIENTS.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchType = typeFilter === "All" || c.type === typeFilter;
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const stats = [
    {
      label: "Total Clients",
      value: CLIENTS.length,
      color: "text-gold-300",
      icon: Users,
    },
    {
      label: "Active",
      value: CLIENTS.filter((c) => c.status === "Active").length,
      color: "text-green-300",
      icon: User,
    },
    {
      label: "Prospects",
      value: CLIENTS.filter((c) => c.status === "Prospect").length,
      color: "text-amber-300",
      icon: User,
    },
    {
      label: "Total Value",
      value: `₹${CLIENTS.reduce((a, c) => a + c.totalValue, 0)}L`,
      color: "text-gold-400",
      icon: DollarSign,
    },
  ];

  return (
    <SecureAppGate appName="Client Portal">
      <div className="min-h-screen bg-background">
        <div className="border-b border-gold-800/20 bg-card px-4 sm:px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <a
              href="/apps"
              className="text-muted-foreground hover:text-gold-400 transition-colors"
              data-ocid="client_portal.back_button"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="font-serif font-bold text-xl text-gold-300">
                Client Portal
              </h1>
              <p className="text-xs text-muted-foreground font-sans">
                {CLIENTS.length} clients — full relationship view
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-card border border-gold-800/20 rounded-xl p-4"
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

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card border-gold-800/30 text-foreground"
                data-ocid="client_portal.search_input"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-card border border-gold-800/30 text-foreground text-sm font-sans"
                data-ocid="client_portal.type_filter"
              >
                {["All", "Buyer", "Investor", "NRI", "Corporate"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-card border border-gold-800/30 text-foreground text-sm font-sans"
                data-ocid="client_portal.status_filter"
              >
                {["All", "Active", "Prospect", "Inactive"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-gold-700/80 hover:bg-gold-600/80 text-obsidian-900 font-semibold rounded-lg transition-colors font-sans text-sm"
                data-ocid="client_portal.add_button"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>

          <div className="bg-card border border-gold-800/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold-800/20">
                    {[
                      "#",
                      "Name",
                      "Phone",
                      "Type",
                      "Status",
                      "Interests",
                      "Deals",
                      "Total Value",
                      "Last Contact",
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
                  {filtered.map((c, i) => (
                    <tr
                      key={c.id}
                      className="border-b border-gold-800/10 hover:bg-gold-800/5 cursor-pointer transition-colors"
                      onClick={() => setSelected(c)}
                      onKeyDown={(e) => e.key === "Enter" && setSelected(c)}
                      tabIndex={0}
                      data-ocid={`client_portal.item.${i + 1}`}
                    >
                      <td className="px-4 py-3 text-xs text-muted-foreground font-sans">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground font-sans font-medium">
                          {c.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-sans">
                          {c.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground font-sans">
                        {c.phone}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`text-xs border ${TYPE_COLORS[c.type] ?? ""}`}
                        >
                          {c.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`text-xs border ${STATUS_COLORS[c.status] ?? ""}`}
                        >
                          {c.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {c.interests.map((i) => (
                            <span
                              key={i}
                              className="text-xs text-gold-400 font-sans"
                            >
                              {i}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-foreground font-sans">
                        {c.deals}
                      </td>
                      <td className="px-4 py-3 text-sm text-gold-300 font-semibold font-sans text-right">
                        ₹{c.totalValue}L
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-sans">
                        {c.lastContact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selected && (
          <ClientModal client={selected} onClose={() => setSelected(null)} />
        )}
        {showAdd && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-card border border-gold-800/30 rounded-xl w-full max-w-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-gold-300">Add Client</h3>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="text-muted-foreground hover:text-foreground"
                  data-ocid="client_portal.add_modal.close_button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="Full Name"
                  className="bg-background border-gold-800/30 text-foreground"
                />
                <Input
                  placeholder="Phone"
                  className="bg-background border-gold-800/30 text-foreground"
                />
                <Input
                  placeholder="Email"
                  className="bg-background border-gold-800/30 text-foreground"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2 rounded-lg border border-gold-800/30 text-muted-foreground hover:text-foreground text-sm font-sans"
                  data-ocid="client_portal.add_modal.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2 rounded-lg bg-gold-700/80 text-obsidian-900 font-semibold text-sm font-sans"
                  data-ocid="client_portal.add_modal.submit_button"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SecureAppGate>
  );
}
