import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useClients } from "@/hooks/useCrmQueries";
import type { CrmClient } from "@/types/crm";
import { DollarSign, Plus, Search, User, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const CLIENT_TYPE_COLORS: Record<string, string> = {
  Buyer: "bg-blue-900/20 text-blue-300 border-blue-800/30",
  Investor: "bg-gold-800/20 text-gold-300 border-gold-700/30",
  NRI: "bg-purple-900/20 text-purple-300 border-purple-800/30",
  Corporate: "bg-green-900/20 text-green-300 border-green-800/30",
};

const MOCK_CLIENTS: CrmClient[] = [
  {
    id: 1n,
    name: "Rajesh Mehta",
    phone: "+91 9876543210",
    email: "rajesh@example.com",
    clientType: "Investor",
    totalDeals: 3n,
    totalValue: 25000000n,
    ltv: 28000000n,
    createdAt: 0n,
    lastContact: 0n,
    notes: "High-value investor. Interested in commercial properties.",
  },
  {
    id: 2n,
    name: "Priya Shah",
    phone: "+91 9823456780",
    email: "priya@example.com",
    clientType: "Buyer",
    totalDeals: 1n,
    totalValue: 7000000n,
    ltv: 7000000n,
    createdAt: 0n,
    lastContact: 0n,
    notes: "First-time homebuyer. Prahlad Nagar area.",
  },
  {
    id: 3n,
    name: "Vikram Patel",
    phone: "+91 9988776655",
    email: "vikram@example.com",
    clientType: "NRI",
    totalDeals: 2n,
    totalValue: 15000000n,
    ltv: 18000000n,
    createdAt: 0n,
    lastContact: 0n,
    notes: "NRI client based in US. Returning investment.",
  },
  {
    id: 4n,
    name: "Anita Joshi",
    phone: "+91 9512609016",
    email: "anita@example.com",
    clientType: "Corporate",
    totalDeals: 5n,
    totalValue: 50000000n,
    ltv: 60000000n,
    createdAt: 0n,
    lastContact: 0n,
    notes: "Corporate client for office spaces.",
  },
  {
    id: 5n,
    name: "Suresh Kumar",
    phone: "+91 9090909090",
    email: "suresh@example.com",
    clientType: "Buyer",
    totalDeals: 1n,
    totalValue: 5500000n,
    ltv: 5500000n,
    createdAt: 0n,
    lastContact: 0n,
    notes: "2BHK Bodakdev buyer.",
  },
  {
    id: 6n,
    name: "Kavita Desai",
    phone: "+91 9191919191",
    email: "kavita@example.com",
    clientType: "Investor",
    totalDeals: 4n,
    totalValue: 32000000n,
    ltv: 35000000n,
    createdAt: 0n,
    lastContact: 0n,
    notes: "Rental yield focused investor.",
  },
];

function ClientCard({
  client,
  onClick,
}: { client: CrmClient; onClick: () => void }) {
  return (
    <div
      className="rounded-xl border border-gold-800/30 bg-card p-4 cursor-pointer hover:border-gold-500/50 transition-all"
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gold-700/20 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h3 className="font-medium text-foreground text-sm">
              {client.name}
            </h3>
            <p className="text-xs text-muted-foreground">{client.phone}</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`text-xs border shrink-0 ${CLIENT_TYPE_COLORS[client.clientType] ?? ""}`}
        >
          {client.clientType}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-background/50 p-2">
          <p className="font-serif font-bold text-gold-400 text-base">
            {String(client.totalDeals)}
          </p>
          <p className="text-[10px] text-muted-foreground">Deals</p>
        </div>
        <div className="rounded-lg bg-background/50 p-2">
          <p className="font-serif font-bold text-gold-400 text-sm">
            ₹{(Number(client.totalValue) / 10000000).toFixed(1)}Cr
          </p>
          <p className="text-[10px] text-muted-foreground">Total Value</p>
        </div>
        <div className="rounded-lg bg-background/50 p-2">
          <p className="font-serif font-bold text-green-400 text-sm">
            ₹{(Number(client.ltv) / 10000000).toFixed(1)}Cr
          </p>
          <p className="text-[10px] text-muted-foreground">LTV</p>
        </div>
      </div>
    </div>
  );
}

const STATUS_OPTS = ["All", "Active", "Prospect", "Closed"];

export default function ClientsPage() {
  const { data: fetchedClients = [] } = useClients();
  const baseClients: CrmClient[] =
    fetchedClients.length > 0
      ? (fetchedClients as unknown as CrmClient[])
      : MOCK_CLIENTS;
  const [clients, setClients] = useState<CrmClient[]>(baseClients);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<CrmClient | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    phone: "",
    email: "",
    propertyInterest: "",
    budget: "",
    status: "Prospect" as string,
  });

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search);
      const matchStatus =
        statusFilter === "All" ||
        (c as CrmClient & { status?: string }).status === statusFilter ||
        statusFilter === "Active";
      return matchSearch && matchStatus;
    });
  }, [clients, search, statusFilter]);

  function handleAddClient(e: React.FormEvent) {
    e.preventDefault();
    if (!addForm.name || !addForm.phone) return;
    const newClient: CrmClient = {
      id: BigInt(clients.length + 100),
      name: addForm.name,
      phone: addForm.phone,
      email: addForm.email,
      clientType: "Buyer",
      totalDeals: 0n,
      totalValue: 0n,
      ltv: 0n,
      createdAt: 0n,
      lastContact: 0n,
      notes: `Budget: ${addForm.budget || "TBD"}. Interest: ${addForm.propertyInterest || "TBD"}.`,
    };
    setClients((prev) => [newClient, ...prev]);
    setShowAdd(false);
    setAddForm({
      name: "",
      phone: "",
      email: "",
      propertyInterest: "",
      budget: "",
      status: "Prospect",
    });
    toast.success("Client added successfully");
  }

  const totalLTV = clients.reduce((s, c) => s + Number(c.ltv), 0);
  const activeThisMonth = clients.filter(
    (c) => Number(c.lastContact) > Date.now() - 30 * 86400000,
  ).length;
  return (
    <SecureAppGate appName="Client Portal">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="clients.page"
      >
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a
                href="/crm"
                className="text-gold-600 hover:text-gold-400 text-xs"
              >
                CRM
              </a>
              <span className="text-gold-700/40">/</span>
              <Users className="w-4 h-4 text-gold-400" />
              <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
                Client Portal
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
              data-ocid="clients.add_button"
            >
              <Plus className="w-3.5 h-3.5" /> Add Client
            </button>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {
                label: "Total Clients",
                value: clients.length,
                icon: Users,
                color: "text-gold-400",
              },
              {
                label: "Active This Month",
                value: activeThisMonth || clients.length,
                icon: User,
                color: "text-green-400",
              },
              {
                label: "Total LTV",
                value: `₹${(totalLTV / 10000000).toFixed(1)}Cr`,
                icon: DollarSign,
                color: "text-blue-400",
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
                <p
                  className={`font-serif text-lg sm:text-xl font-bold ${stat.color} truncate`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients..."
                className="pl-9 bg-card border-gold-800/30 text-foreground"
                data-ocid="clients.search_input"
              />
            </div>
            <div className="flex gap-1.5">
              {STATUS_OPTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${statusFilter === s ? "border-gold-500/50 bg-gold-700/20 text-gold-300" : "border-gold-800/30 text-gold-600"}`}
                  data-ocid={`clients.status_filter.${s.toLowerCase()}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((client, i) => (
              <div key={String(client.id)} data-ocid={`clients.item.${i + 1}`}>
                <ClientCard
                  client={client}
                  onClick={() => setSelected(client)}
                />
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16" data-ocid="clients.empty_state">
              <Users className="w-12 h-12 text-gold-800/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No clients found</p>
            </div>
          )}
        </div>

        {/* Add Client Modal */}
        {showAdd && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAdd(false)}
            onKeyDown={(e) => e.key === "Escape" && setShowAdd(false)}
            role="dialog"
            aria-modal="true"
          >
            <div className="absolute inset-0 bg-black/60" />
            <form
              onSubmit={handleAddClient}
              className="relative bg-card border border-gold-700/40 rounded-2xl p-5 w-full max-w-sm space-y-3"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={() => {}}
            >
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-serif font-bold text-gold-400">
                  Add Client
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="text-gold-600 hover:text-gold-400"
                  data-ocid="clients.add_modal.close_button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div>
                <label className="text-xs text-gold-600">Full Name *</label>
                <Input
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Rajesh Mehta"
                  className="mt-1 bg-background border-gold-800/40 text-sm"
                  required
                  data-ocid="clients.add.name_input"
                />
              </div>
              <div>
                <label className="text-xs text-gold-600">Phone *</label>
                <Input
                  value={addForm.phone}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="+91 98765 43210"
                  className="mt-1 bg-background border-gold-800/40 text-sm"
                  required
                  data-ocid="clients.add.phone_input"
                />
              </div>
              <div>
                <label className="text-xs text-gold-600">Email</label>
                <Input
                  value={addForm.email}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="email@example.com"
                  type="email"
                  className="mt-1 bg-background border-gold-800/40 text-sm"
                  data-ocid="clients.add.email_input"
                />
              </div>
              <div>
                <label className="text-xs text-gold-600">
                  Property Interest
                </label>
                <Input
                  value={addForm.propertyInterest}
                  onChange={(e) =>
                    setAddForm((f) => ({
                      ...f,
                      propertyInterest: e.target.value,
                    }))
                  }
                  placeholder="3BHK Apartment, Bopal"
                  className="mt-1 bg-background border-gold-800/40 text-sm"
                  data-ocid="clients.add.interest_input"
                />
              </div>
              <div>
                <label className="text-xs text-gold-600">Budget</label>
                <Input
                  value={addForm.budget}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, budget: e.target.value }))
                  }
                  placeholder="e.g. ₹75L – ₹1Cr"
                  className="mt-1 bg-background border-gold-800/40 text-sm"
                  data-ocid="clients.add.budget_input"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2 rounded-lg border border-gold-800/40 text-muted-foreground text-sm hover:border-gold-600/50 transition-colors"
                  data-ocid="clients.add.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-gold-700/30 hover:bg-gold-700/40 text-gold-300 text-sm font-medium transition-colors"
                  data-ocid="clients.add.submit_button"
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Detail Drawer */}
        {selected && (
          <div
            className="fixed inset-0 z-50 flex"
            onClick={() => setSelected(null)}
            onKeyDown={(e) => e.key === "Escape" && setSelected(null)}
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
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-gold-600 hover:text-gold-400"
                data-ocid="clients.detail.close_button"
              >
                ✕
              </button>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 rounded-full bg-gold-700/20 flex items-center justify-center">
                  <User className="w-7 h-7 text-gold-400" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-foreground">
                    {selected.name}
                  </h2>
                  <Badge
                    variant="outline"
                    className={`text-xs border mt-1 ${CLIENT_TYPE_COLORS[selected.clientType] ?? ""}`}
                  >
                    {selected.clientType}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="text-foreground">{selected.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-foreground truncate max-w-[160px]">
                    {selected.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Deals</span>
                  <span className="text-gold-400 font-medium">
                    {String(selected.totalDeals)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Value</span>
                  <span className="text-gold-400 font-medium">
                    ₹{(Number(selected.totalValue) / 10000000).toFixed(2)}Cr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">LTV</span>
                  <span className="text-green-400 font-medium">
                    ₹{(Number(selected.ltv) / 10000000).toFixed(2)}Cr
                  </span>
                </div>
                <div className="pt-2 border-t border-gold-800/20">
                  <p className="text-xs text-gold-600 mb-1">Notes</p>
                  <p className="text-xs text-muted-foreground">
                    {selected.notes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SecureAppGate>
  );
}
