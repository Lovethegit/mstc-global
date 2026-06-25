import BackButton from "@/components/ui/BackButton";
import CloseButton from "@/components/ui/CloseButton";
import Modal from "@/components/ui/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Archive,
  Download,
  FileText,
  Folder,
  Plus,
  Search,
  Share2,
  Tag,
  Upload,
} from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  "All",
  "Property Documents",
  "Legal",
  "Finance",
  "Marketing",
  "HR",
  "NGO",
  "Events",
  "Internal",
];

const DOCUMENTS = [
  {
    id: 1,
    name: "Bodakdev 4BHK Sale Deed",
    type: "PDF",
    category: "Property Documents",
    date: "2026-05-20",
    size: "2.4 MB",
    owner: "Aria AI",
    sharedWith: "Client",
    tags: ["property", "legal"],
  },
  {
    id: 2,
    name: "SG Highway Office Lease Agreement",
    type: "PDF",
    category: "Legal",
    date: "2026-05-18",
    size: "1.8 MB",
    owner: "Justice AI",
    sharedWith: "Client",
    tags: ["lease", "commercial"],
  },
  {
    id: 3,
    name: "Q1 FY2026 Financial Report",
    type: "XLSX",
    category: "Finance",
    date: "2026-05-15",
    size: "890 KB",
    owner: "Finance AI",
    sharedWith: "Internal",
    tags: ["finance", "quarterly"],
  },
  {
    id: 4,
    name: "MSTC Global Brand Guidelines",
    type: "PDF",
    category: "Marketing",
    date: "2026-05-12",
    size: "5.6 MB",
    owner: "Creative AI",
    sharedWith: "All Staff",
    tags: ["brand", "design"],
  },
  {
    id: 5,
    name: "Staff Employment Contracts FY26",
    type: "ZIP",
    category: "HR",
    date: "2026-05-10",
    size: "3.2 MB",
    owner: "HR AI",
    sharedWith: "Private",
    tags: ["hr", "contracts"],
  },
  {
    id: 6,
    name: "Anand Vihar NGO Grant Proposal",
    type: "DOCX",
    category: "NGO",
    date: "2026-05-08",
    size: "1.1 MB",
    owner: "NGO AI",
    sharedWith: "Board",
    tags: ["ngo", "grant"],
  },
  {
    id: 7,
    name: "Cultural Evening Event Plan 2026",
    type: "PDF",
    category: "Events",
    date: "2026-05-05",
    size: "780 KB",
    owner: "Events AI",
    sharedWith: "Team",
    tags: ["events", "cultural"],
  },
  {
    id: 8,
    name: "Q2 Revenue Forecast",
    type: "XLSX",
    category: "Finance",
    date: "2026-05-03",
    size: "456 KB",
    owner: "Finance AI",
    sharedWith: "Management",
    tags: ["finance", "forecast"],
  },
  {
    id: 9,
    name: "Prahlad Nagar 3BHK Purchase Agreement",
    type: "PDF",
    category: "Property Documents",
    date: "2026-05-01",
    size: "2.1 MB",
    owner: "Lex AI",
    sharedWith: "Client",
    tags: ["property", "residential"],
  },
  {
    id: 10,
    name: "RERA Registration P01234/RERA/2026",
    type: "PDF",
    category: "Legal",
    date: "2026-04-29",
    size: "1.3 MB",
    owner: "Veda AI",
    sharedWith: "RERA Portal",
    tags: ["rera", "registration"],
  },
  {
    id: 11,
    name: "Marketing Campaign Q2 Brief",
    type: "PPTX",
    category: "Marketing",
    date: "2026-04-27",
    size: "3.4 MB",
    owner: "Campaign AI",
    sharedWith: "Team",
    tags: ["marketing", "campaign"],
  },
  {
    id: 12,
    name: "Technology Upgrade Roadmap 2026",
    type: "PDF",
    category: "Internal",
    date: "2026-04-25",
    size: "2.7 MB",
    owner: "Tech AI",
    sharedWith: "Management",
    tags: ["tech", "roadmap"],
  },
  {
    id: 13,
    name: "Satellite Apartment Sale Deed",
    type: "PDF",
    category: "Property Documents",
    date: "2026-04-23",
    size: "1.9 MB",
    owner: "Aria AI",
    sharedWith: "Client",
    tags: ["property", "sale"],
  },
  {
    id: 14,
    name: "Staff Performance Reviews H1 2026",
    type: "XLSX",
    category: "HR",
    date: "2026-04-20",
    size: "670 KB",
    owner: "HR AI",
    sharedWith: "Private",
    tags: ["hr", "performance"],
  },
  {
    id: 15,
    name: "CSR Impact Report FY2025",
    type: "PDF",
    category: "NGO",
    date: "2026-04-18",
    size: "4.2 MB",
    owner: "CSR AI",
    sharedWith: "Public",
    tags: ["csr", "report"],
  },
  {
    id: 16,
    name: "Commercial Lease Portfolio",
    type: "XLSX",
    category: "Finance",
    date: "2026-04-15",
    size: "1.2 MB",
    owner: "Finance AI",
    sharedWith: "Management",
    tags: ["finance", "leases"],
  },
  {
    id: 17,
    name: "Investor Presentation May 2026",
    type: "PPTX",
    category: "Marketing",
    date: "2026-04-12",
    size: "8.9 MB",
    owner: "Creative AI",
    sharedWith: "Investor",
    tags: ["investor", "presentation"],
  },
  {
    id: 18,
    name: "NDA Template — Standard",
    type: "DOCX",
    category: "Legal",
    date: "2026-04-10",
    size: "145 KB",
    owner: "NDA AI",
    sharedWith: "All Staff",
    tags: ["legal", "nda"],
  },
  {
    id: 19,
    name: "Bopal Township Project Report",
    type: "PDF",
    category: "Property Documents",
    date: "2026-04-08",
    size: "3.8 MB",
    owner: "Property AI",
    sharedWith: "Client",
    tags: ["property", "project"],
  },
  {
    id: 20,
    name: "IT Security Policy Manual",
    type: "PDF",
    category: "Internal",
    date: "2026-04-05",
    size: "1.6 MB",
    owner: "Security AI",
    sharedWith: "All Staff",
    tags: ["security", "policy"],
  },
  {
    id: 21,
    name: "Cricket Tournament Sponsorship",
    type: "PDF",
    category: "Events",
    date: "2026-04-03",
    size: "890 KB",
    owner: "Sports AI",
    sharedWith: "Sponsor",
    tags: ["sports", "sponsorship"],
  },
  {
    id: 22,
    name: "Annual Audit Report FY2025",
    type: "PDF",
    category: "Finance",
    date: "2026-04-01",
    size: "6.7 MB",
    owner: "Finance AI",
    sharedWith: "Board",
    tags: ["audit", "annual"],
  },
  {
    id: 23,
    name: "Redevelopment LOI Template",
    type: "DOCX",
    category: "Legal",
    date: "2026-03-28",
    size: "234 KB",
    owner: "Niti AI",
    sharedWith: "All Staff",
    tags: ["redevelopment", "legal"],
  },
  {
    id: 24,
    name: "Music Festival Artist Contracts",
    type: "ZIP",
    category: "Events",
    date: "2026-03-25",
    size: "2.3 MB",
    owner: "Music AI",
    sharedWith: "Artists",
    tags: ["music", "contracts"],
  },
  {
    id: 25,
    name: "Data Privacy Policy PDPB 2023",
    type: "PDF",
    category: "Legal",
    date: "2026-03-20",
    size: "567 KB",
    owner: "Raksha AI",
    sharedWith: "Public",
    tags: ["privacy", "compliance"],
  },
];

const TYPE_COLORS: Record<string, string> = {
  PDF: "bg-red-900/30 text-red-400 border-red-700/30",
  XLSX: "bg-green-900/30 text-green-400 border-green-700/30",
  DOCX: "bg-blue-900/30 text-blue-400 border-blue-700/30",
  PPTX: "bg-orange-900/30 text-orange-400 border-orange-700/30",
  ZIP: "bg-purple-900/30 text-purple-400 border-purple-700/30",
};

export default function DocumentCenterPage() {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "folder">("table");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = DOCUMENTS.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some((t) => t.includes(search.toLowerCase()));
    const matchCat = filterCat === "All" || d.category === filterCat;
    return matchSearch && matchCat;
  });

  const archived = 456;

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-ocid="documents.page"
    >
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div
            role="button"
            tabIndex={-1}
            aria-label="Close sidebar"
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Enter" && setSidebarOpen(false)}
          />
          <aside className="relative z-50 w-64 bg-card border-r border-gold-700/30 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gold-700/20">
              <span className="font-serif text-gold-300 font-semibold text-sm">
                Navigation
              </span>
              <CloseButton onClick={() => setSidebarOpen(false)} size="sm" />
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCat(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filterCat === cat ? "bg-gold-700/20 text-gold-300" : "text-muted-foreground hover:bg-gold-700/10"}`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="font-serif text-2xl font-bold gold-text">
                Document Center
              </h1>
              <p className="text-muted-foreground text-sm font-sans">
                Centralized document management for all departments
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="gold-button gap-2"
            data-ocid="documents.upload_button"
          >
            <Upload size={16} /> Upload
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Documents",
              value: "1,847",
              icon: FileText,
              color: "text-blue-400",
            },
            {
              label: "This Month",
              value: "234",
              icon: Plus,
              color: "text-green-400",
            },
            {
              label: "Shared",
              value: "89",
              icon: Share2,
              color: "text-gold-400",
            },
            {
              label: "Archived",
              value: archived,
              icon: Archive,
              color: "text-muted-foreground",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-gold-700/20 rounded-xl p-4"
              data-ocid={`documents.stat.${stat.label.toLowerCase().replace(/ /g, "_")}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={16} className={stat.color} />
                <span className="text-xs text-muted-foreground font-sans">
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-bold font-serif text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters + View Toggle */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search documents or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 bg-card border-gold-700/30 h-9 text-sm"
              data-ocid="documents.search_input"
            />
          </div>
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger
              className="w-44 h-9 bg-card border-gold-700/30 text-sm"
              data-ocid="documents.category_select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-gold-700/30">
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1 border border-gold-700/30 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded text-xs transition-colors ${viewMode === "table" ? "bg-gold-700/30 text-gold-300" : "text-muted-foreground"}`}
              data-ocid="documents.table_view_button"
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode("folder")}
              className={`px-3 py-1.5 rounded text-xs transition-colors ${viewMode === "folder" ? "bg-gold-700/30 text-gold-300" : "text-muted-foreground"}`}
              data-ocid="documents.folder_view_button"
            >
              Folders
            </button>
          </div>
        </div>

        {viewMode === "table" ? (
          <div className="bg-card border border-gold-700/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid="documents.table">
                <thead>
                  <tr className="border-b border-gold-700/20 bg-obsidian-800/40">
                    {[
                      "Name",
                      "Type",
                      "Category",
                      "Date",
                      "Size",
                      "Owner",
                      "Shared With",
                      "Tags",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-gold-400 font-sans whitespace-nowrap"
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
                      className="border-b border-gold-700/10 hover:bg-gold-700/5 transition-colors"
                      data-ocid={`documents.item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText
                            size={14}
                            className="text-gold-400 shrink-0"
                          />
                          <span className="font-semibold text-foreground text-xs whitespace-nowrap">
                            {doc.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`text-xs ${TYPE_COLORS[doc.type] ?? ""}`}
                        >
                          {doc.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="text-xs border-gold-700/30 text-gold-400 whitespace-nowrap"
                        >
                          {doc.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {doc.date}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {doc.size}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {doc.owner}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {doc.sharedWith}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.map((t) => (
                            <Badge
                              key={t}
                              variant="outline"
                              className="text-xs border-gold-700/20 text-gold-600 px-1.5"
                            >
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gold-700/30 text-gold-400 h-7 w-7 p-0"
                            aria-label="Download"
                          >
                            <Download size={12} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gold-700/30 text-gold-400 h-7 w-7 p-0"
                            aria-label="Share"
                          >
                            <Share2 size={12} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.slice(1).map((cat) => {
              const count = DOCUMENTS.filter((d) => d.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setFilterCat(cat);
                    setViewMode("table");
                  }}
                  className="bg-card border border-gold-700/20 rounded-xl p-4 hover:border-gold-500/40 transition-colors text-left"
                  data-ocid={`documents.folder.${cat.toLowerCase().replace(/ /g, "_")}`}
                >
                  <Folder size={32} className="text-gold-400 mb-3" />
                  <p className="font-semibold text-sm text-foreground">{cat}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {count} documents
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Document"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <Label className="text-gold-300 text-xs mb-1 block">
              Document Name
            </Label>
            <Input
              placeholder="Enter document name"
              className="bg-obsidian-800/60 border-gold-700/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gold-300 text-xs mb-1 block">
                Category
              </Label>
              <Select>
                <SelectTrigger className="bg-obsidian-800/60 border-gold-700/30">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-700/30">
                  {CATEGORIES.slice(1).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gold-300 text-xs mb-1 block">
                Share With
              </Label>
              <Select>
                <SelectTrigger className="bg-obsidian-800/60 border-gold-700/30">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-700/30">
                  {[
                    "Private",
                    "Team",
                    "Management",
                    "All Staff",
                    "Client",
                    "Public",
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-gold-300 text-xs mb-1 block">
              Tags (comma separated)
            </Label>
            <Input
              placeholder="e.g. property, sale, legal"
              className="bg-obsidian-800/60 border-gold-700/30"
            />
          </div>
          <div
            className="border-2 border-dashed border-gold-700/30 rounded-lg p-6 text-center cursor-pointer hover:border-gold-500/40 transition-colors"
            data-ocid="documents.dropzone"
          >
            <Upload size={24} className="mx-auto text-gold-400 mb-2" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, DOCX, XLSX, PPTX, ZIP up to 50MB
            </p>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              className="border-gold-700/30"
              onClick={() => setShowUploadModal(false)}
              data-ocid="documents.upload_modal.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="gold-button"
              data-ocid="documents.upload_modal.submit_button"
            >
              Upload Document
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
