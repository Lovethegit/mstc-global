import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Plus,
  Search,
  Shield,
  X,
} from "lucide-react";
import { useState } from "react";

const DOCUMENTS = [
  {
    id: 1,
    name: "Prahlad Nagar 3BHK Sale Deed",
    type: "Sale Deed",
    client: "Rajesh Mehta",
    date: "2026-04-15",
    status: "Signed",
    size: "2.4 MB",
  },
  {
    id: 2,
    name: "MSTC-Anita NDA Agreement",
    type: "NDA",
    client: "Anita Joshi",
    date: "2026-05-01",
    status: "Signed",
    size: "0.8 MB",
  },
  {
    id: 3,
    name: "Vastrapur Commercial Lease",
    type: "Agreement",
    client: "Meena Desai",
    date: "2026-05-10",
    status: "Review",
    size: "1.2 MB",
  },
  {
    id: 4,
    name: "Privacy Policy v3.2",
    type: "Policy",
    client: "MSTC Global",
    date: "2026-05-20",
    status: "Signed",
    size: "0.3 MB",
  },
  {
    id: 5,
    name: "Satellite Residency MOU",
    type: "MOU",
    client: "Vikram Patel",
    date: "2026-03-28",
    status: "Signed",
    size: "1.8 MB",
  },
  {
    id: 6,
    name: "Home Loan Agreement - Priya",
    type: "Agreement",
    client: "Priya Shah",
    date: "2026-05-05",
    status: "Draft",
    size: "0.9 MB",
  },
  {
    id: 7,
    name: "RERA Registration P12-AHM",
    type: "RERA",
    client: "MSTC Global",
    date: "2026-04-01",
    status: "Signed",
    size: "3.1 MB",
  },
  {
    id: 8,
    name: "Terms & Conditions v2",
    type: "Policy",
    client: "MSTC Global",
    date: "2026-05-20",
    status: "Signed",
    size: "0.4 MB",
  },
  {
    id: 9,
    name: "Prahladnagar Indemnity Bond",
    type: "Indemnity",
    client: "Deepak Verma",
    date: "2026-04-20",
    status: "Signed",
    size: "0.6 MB",
  },
  {
    id: 10,
    name: "Commercial Lease - Navrangpura",
    type: "Agreement",
    client: "Pooja Jain",
    date: "2026-05-12",
    status: "Review",
    size: "1.4 MB",
  },
  {
    id: 11,
    name: "Power of Attorney - Ravi",
    type: "PoA",
    client: "Ravi Patel",
    date: "2026-04-10",
    status: "Signed",
    size: "0.7 MB",
  },
  {
    id: 12,
    name: "Joint Development Agreement",
    type: "Agreement",
    client: "Harish Reddy",
    date: "2026-05-03",
    status: "Review",
    size: "2.1 MB",
  },
  {
    id: 13,
    name: "Staff NDA Template v4",
    type: "NDA",
    client: "MSTC Global",
    date: "2026-03-15",
    status: "Signed",
    size: "0.5 MB",
  },
  {
    id: 14,
    name: "Maninagar Shop Sale Agreement",
    type: "Sale Deed",
    client: "Ravi Kumar",
    date: "2026-04-28",
    status: "Signed",
    size: "2.0 MB",
  },
  {
    id: 15,
    name: "Cookie Policy v1.1",
    type: "Policy",
    client: "MSTC Global",
    date: "2026-05-18",
    status: "Signed",
    size: "0.2 MB",
  },
  {
    id: 16,
    name: "Service Agreement - Manoj",
    type: "Agreement",
    client: "Manoj Gupta",
    date: "2026-05-08",
    status: "Draft",
    size: "0.8 MB",
  },
  {
    id: 17,
    name: "RERA Agent License",
    type: "RERA",
    client: "MSTC Global",
    date: "2026-01-15",
    status: "Signed",
    size: "1.5 MB",
  },
  {
    id: 18,
    name: "Tenant Agreement - Nilesh",
    type: "Agreement",
    client: "Nilesh Shah",
    date: "2026-03-01",
    status: "Signed",
    size: "1.1 MB",
  },
  {
    id: 19,
    name: "Disclaimer Policy v1",
    type: "Policy",
    client: "MSTC Global",
    date: "2026-05-20",
    status: "Signed",
    size: "0.2 MB",
  },
  {
    id: 20,
    name: "Redevelopment MOU - Bopal",
    type: "MOU",
    client: "Sanjay Agarwal",
    date: "2026-05-15",
    status: "Review",
    size: "1.9 MB",
  },
  {
    id: 21,
    name: "Stamp Duty Receipt - Satellite",
    type: "Receipt",
    client: "Rajesh Mehta",
    date: "2026-04-16",
    status: "Signed",
    size: "0.3 MB",
  },
  {
    id: 22,
    name: "Investment Agreement - Lalita",
    type: "Agreement",
    client: "Lalita Trivedi",
    date: "2026-05-14",
    status: "Draft",
    size: "1.0 MB",
  },
  {
    id: 23,
    name: "Event Venue Contract",
    type: "Agreement",
    client: "Divya Nair",
    date: "2026-05-10",
    status: "Signed",
    size: "0.9 MB",
  },
  {
    id: 24,
    name: "Surety Bond - Varsha",
    type: "Indemnity",
    client: "Varsha Kulkarni",
    date: "2026-04-25",
    status: "Signed",
    size: "0.6 MB",
  },
  {
    id: 25,
    name: "Partition Deed - Mehta Family",
    type: "Sale Deed",
    client: "Rajesh Mehta",
    date: "2026-05-02",
    status: "Review",
    size: "2.8 MB",
  },
];

const STATUS_COLORS: Record<string, string> = {
  Signed: "bg-green-900/20 text-green-300 border-green-800/30",
  Draft: "bg-amber-900/20 text-amber-300 border-amber-800/30",
  Review: "bg-blue-900/20 text-blue-300 border-blue-800/30",
};

const TYPE_COLORS: Record<string, string> = {
  "Sale Deed": "bg-gold-800/20 text-gold-300 border-gold-700/30",
  NDA: "bg-purple-900/20 text-purple-300 border-purple-800/30",
  Agreement: "bg-blue-900/20 text-blue-300 border-blue-800/30",
  Policy: "bg-green-900/20 text-green-300 border-green-800/30",
  MOU: "bg-orange-900/20 text-orange-300 border-orange-800/30",
  RERA: "bg-red-900/20 text-red-300 border-red-800/30",
  Indemnity: "bg-card text-muted-foreground border-border",
  PoA: "bg-card text-muted-foreground border-border",
  Receipt: "bg-card text-muted-foreground border-border",
};

export default function LegalVaultPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);

  const types = ["All", ...Array.from(new Set(DOCUMENTS.map((d) => d.type)))];

  const filtered = DOCUMENTS.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.client.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || d.type === typeFilter;
    const matchStatus = statusFilter === "All" || d.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const stats = [
    {
      label: "Total Documents",
      value: DOCUMENTS.length,
      color: "text-gold-300",
    },
    {
      label: "Signed",
      value: DOCUMENTS.filter((d) => d.status === "Signed").length,
      color: "text-green-300",
    },
    {
      label: "In Review",
      value: DOCUMENTS.filter((d) => d.status === "Review").length,
      color: "text-blue-300",
    },
    {
      label: "Drafts",
      value: DOCUMENTS.filter((d) => d.status === "Draft").length,
      color: "text-amber-300",
    },
  ];

  return (
    <SecureAppGate appName="Legal Vault">
      <div className="min-h-screen bg-background">
        <div className="border-b border-gold-800/20 bg-card px-4 sm:px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <a
              href="/legal-command"
              className="text-muted-foreground hover:text-gold-400 transition-colors"
              data-ocid="legal_vault.back_button"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <Shield className="w-5 h-5 text-gold-400" />
            <div>
              <h1 className="font-serif font-bold text-xl text-gold-300">
                Legal Vault
              </h1>
              <p className="text-xs text-muted-foreground font-sans">
                Secure document storage — {DOCUMENTS.length} documents
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
                  <FileText className={`w-4 h-4 ${s.color}`} />
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
                placeholder="Search by name or client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card border-gold-800/30 text-foreground"
                data-ocid="legal_vault.search_input"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-card border border-gold-800/30 text-foreground text-sm font-sans"
                data-ocid="legal_vault.type_filter"
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-card border border-gold-800/30 text-foreground text-sm font-sans"
                data-ocid="legal_vault.status_filter"
              >
                {["All", "Signed", "Draft", "Review"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-gold-700/80 hover:bg-gold-600/80 text-obsidian-900 font-semibold rounded-lg transition-colors font-sans text-sm"
                data-ocid="legal_vault.add_button"
              >
                <Plus className="w-4 h-4" /> Add Doc
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
                      "Document Name",
                      "Type",
                      "Client",
                      "Date",
                      "Status",
                      "Size",
                      "Actions",
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
                  {filtered.map((doc, i) => (
                    <tr
                      key={doc.id}
                      className="border-b border-gold-800/10 hover:bg-gold-800/5 transition-colors"
                      data-ocid={`legal_vault.item.${i + 1}`}
                    >
                      <td className="px-4 py-3 text-xs text-muted-foreground font-sans">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                          <span className="text-sm text-foreground font-sans">
                            {doc.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`text-xs border ${TYPE_COLORS[doc.type] ?? ""}`}
                        >
                          {doc.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground font-sans">
                        {doc.client}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-sans">
                        {doc.date}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`text-xs border ${STATUS_COLORS[doc.status] ?? ""}`}
                        >
                          {doc.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-sans">
                        {doc.size}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="text-gold-400 hover:text-gold-300 transition-colors"
                            data-ocid={`legal_vault.view_button.${i + 1}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            data-ocid={`legal_vault.download_button.${i + 1}`}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showAdd && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-card border border-gold-800/30 rounded-xl w-full max-w-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-gold-300">
                  Add Document
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="text-muted-foreground hover:text-foreground"
                  data-ocid="legal_vault.add_modal.close_button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="Document Name"
                  className="bg-background border-gold-800/30 text-foreground"
                />
                <Input
                  placeholder="Client Name"
                  className="bg-background border-gold-800/30 text-foreground"
                />
                <select className="w-full px-3 py-2 rounded-lg bg-background border border-gold-800/30 text-foreground text-sm font-sans">
                  {[
                    "Sale Deed",
                    "NDA",
                    "Agreement",
                    "Policy",
                    "MOU",
                    "RERA",
                    "Indemnity",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2 rounded-lg border border-gold-800/30 text-muted-foreground text-sm font-sans"
                  data-ocid="legal_vault.add_modal.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2 rounded-lg bg-gold-700/80 text-obsidian-900 font-semibold text-sm font-sans"
                  data-ocid="legal_vault.add_modal.submit_button"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SecureAppGate>
  );
}
