import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload } from "lucide-react";
import { useState } from "react";

const CATEGORIES = ["All", "Property", "Legal", "Corporate", "Finance", "HR"];
const MOCK_DOCUMENTS = [
  {
    id: 1,
    name: "Prahlad Nagar Sale Deed",
    category: "Property",
    status: "Executed",
    uploaded: "2025-05-24",
    summary:
      "Sale deed for 3BHK flat, Prahlad Nagar. Seller: A, Buyer: B. Value: ₹8.5L",
    risk: "Low",
  },
  {
    id: 2,
    name: "NDA — Bopal Developer",
    category: "Corporate",
    status: "Active",
    uploaded: "2025-05-22",
    summary:
      "5-year NDA with developer for Bopal project. Bilateral confidentiality clause.",
    risk: "Low",
  },
  {
    id: 3,
    name: "Satellite Lease Agreement",
    category: "Legal",
    status: "Active",
    uploaded: "2025-05-20",
    summary:
      "2-year lease for Satellite 2BHK. Tenant: Nilesh Shah. Rent: ₹22,000/mo",
    risk: "Low",
  },
  {
    id: 4,
    name: "GST Compliance Report Q1",
    category: "Finance",
    status: "Filed",
    uploaded: "2025-05-18",
    summary: "Q1 FY2025 GST return. Total input tax credit claimed: ₹1.2L",
    risk: "Low",
  },
  {
    id: 5,
    name: "Board Resolution — Property Auth",
    category: "Corporate",
    status: "Executed",
    uploaded: "2025-05-15",
    summary: "Board authorizes MD to sign property deals above ₹50L",
    risk: "Low",
  },
  {
    id: 6,
    name: "Pending RERA Filing",
    category: "Legal",
    status: "Pending",
    uploaded: "2025-05-10",
    summary: "RERA registration renewal for SG Highway project",
    risk: "High",
  },
];

const RISK_COLORS: Record<string, string> = {
  Low: "bg-green-900/20 text-green-300 border-green-800/30",
  Medium: "bg-yellow-900/20 text-yellow-300 border-yellow-800/30",
  High: "bg-red-900/20 text-red-300 border-red-800/30",
};

export default function DocumentsAdminPage() {
  const [category, setCategory] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered =
    category === "All"
      ? MOCK_DOCUMENTS
      : MOCK_DOCUMENTS.filter((d) => d.category === category);

  return (
    <SecureAppGate appName="Document Center">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="documents_admin.page"
      >
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold-400" />
              <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
                Document Center
              </h1>
            </div>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
              data-ocid="documents_admin.upload_button"
            >
              <Upload className="w-3.5 h-3.5" /> Upload
            </button>
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs border whitespace-nowrap transition-colors ${category === cat ? "bg-gold-700/30 text-gold-300 border-gold-600/50" : "border-gold-800/30 text-gold-600"}`}
                data-ocid={`documents_admin.filter.${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="space-y-2">
            {filtered.map((doc, i) => (
              <div
                key={doc.id}
                className="rounded-xl border border-gold-800/30 bg-card"
                data-ocid={`documents_admin.item.${i + 1}`}
              >
                <button
                  type="button"
                  className="w-full px-4 py-3 flex items-center gap-3 text-left"
                  onClick={() =>
                    setExpanded(expanded === doc.id ? null : doc.id)
                  }
                >
                  <FileText className="w-5 h-5 text-gold-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doc.category} • {doc.uploaded}
                    </p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Badge
                      variant="outline"
                      className="text-[10px] border border-gold-800/30 text-gold-600"
                    >
                      {doc.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] border ${RISK_COLORS[doc.risk] ?? ""}`}
                    >
                      {doc.risk}
                    </Badge>
                  </div>
                </button>
                {expanded === doc.id && (
                  <div className="px-4 pb-3 border-t border-gold-800/20 pt-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      🤖 AI Summary: {doc.summary}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div
              className="text-center py-12"
              data-ocid="documents_admin.empty_state"
            >
              <FileText className="w-12 h-12 text-gold-800/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No documents in this category
              </p>
            </div>
          )}
        </div>
      </div>
    </SecureAppGate>
  );
}
