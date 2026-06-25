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
  AlertTriangle,
  Calculator,
  CheckCircle,
  FileText,
  Upload,
} from "lucide-react";
import { useState } from "react";

const FILINGS = [
  {
    id: 1,
    type: "GST Return",
    period: "Apr 2026",
    dueDate: "2026-06-20",
    amount: "₹1,24,750",
    status: "Due",
    filedDate: "",
    reference: "GSTR-3B",
  },
  {
    id: 2,
    type: "TDS Return",
    period: "Q4 FY2025-26",
    dueDate: "2026-07-31",
    amount: "₹34,200",
    status: "Upcoming",
    filedDate: "",
    reference: "Form 26Q",
  },
  {
    id: 3,
    type: "Income Tax",
    period: "FY2025-26",
    dueDate: "2026-07-31",
    amount: "₹3,48,000",
    status: "Upcoming",
    filedDate: "",
    reference: "ITR-4",
  },
  {
    id: 4,
    type: "Professional Tax",
    period: "May 2026",
    dueDate: "2026-06-15",
    amount: "₹2,500",
    status: "Due",
    filedDate: "",
    reference: "PT-Return",
  },
  {
    id: 5,
    type: "GST Return",
    period: "Mar 2026",
    dueDate: "2026-05-20",
    amount: "₹1,18,340",
    status: "Filed",
    filedDate: "2026-05-15",
    reference: "GSTR-3B/Mar",
  },
  {
    id: 6,
    type: "TDS Return",
    period: "Q3 FY2025-26",
    dueDate: "2026-04-30",
    amount: "₹28,650",
    status: "Filed",
    filedDate: "2026-04-24",
    reference: "Form 26Q/Q3",
  },
  {
    id: 7,
    type: "GST Return",
    period: "Feb 2026",
    dueDate: "2026-04-20",
    amount: "₹1,09,880",
    status: "Filed",
    filedDate: "2026-04-18",
    reference: "GSTR-3B/Feb",
  },
  {
    id: 8,
    type: "GST Annual Return",
    period: "FY2024-25",
    dueDate: "2025-12-31",
    amount: "₹12,34,200",
    status: "Filed",
    filedDate: "2025-12-28",
    reference: "GSTR-9",
  },
  {
    id: 9,
    type: "Professional Tax",
    period: "Apr 2026",
    dueDate: "2026-05-15",
    amount: "₹2,500",
    status: "Filed",
    filedDate: "2026-05-12",
    reference: "PT/Apr",
  },
  {
    id: 10,
    type: "TDS Return",
    period: "Q2 FY2025-26",
    dueDate: "2026-01-31",
    amount: "₹31,400",
    status: "Filed",
    filedDate: "2026-01-29",
    reference: "Form 26Q/Q2",
  },
  {
    id: 11,
    type: "GST Return",
    period: "Jan 2026",
    dueDate: "2026-03-20",
    amount: "₹98,450",
    status: "Filed",
    filedDate: "2026-03-17",
    reference: "GSTR-3B/Jan",
  },
  {
    id: 12,
    type: "Income Tax Advance",
    period: "Mar 2026",
    dueDate: "2026-03-15",
    amount: "₹87,000",
    status: "Filed",
    filedDate: "2026-03-12",
    reference: "Advance Tax Q4",
  },
];

const PT_RATES = [
  { slab: "Up to ₹5,999", monthly: "₹0" },
  { slab: "₹6,000 – ₹8,999", monthly: "₹80" },
  { slab: "₹9,000 – ₹11,999", monthly: "₹150" },
  { slab: "₹12,000 and above", monthly: "₹200" },
];

const DOCUMENTS = [
  {
    name: "GST Registration Certificate",
    category: "GST",
    date: "2019-04-01",
    size: "245 KB",
  },
  {
    name: "PAN Card – MSTC GLOBAL",
    category: "Income Tax",
    date: "2018-11-15",
    size: "120 KB",
  },
  {
    name: "TAN Certificate",
    category: "TDS",
    date: "2020-02-10",
    size: "98 KB",
  },
  {
    name: "Professional Tax Registration",
    category: "Professional Tax",
    date: "2019-06-20",
    size: "180 KB",
  },
  {
    name: "GSTR-9 FY2024-25 Filed Copy",
    category: "GST",
    date: "2025-12-28",
    size: "1.2 MB",
  },
  {
    name: "ITR Filing FY2024-25 Acknowledgement",
    category: "Income Tax",
    date: "2025-07-28",
    size: "340 KB",
  },
  {
    name: "TDS Challan Q3 FY2025-26",
    category: "TDS",
    date: "2026-01-15",
    size: "156 KB",
  },
  {
    name: "Balance Sheet FY2024-25",
    category: "Income Tax",
    date: "2025-07-20",
    size: "890 KB",
  },
];

export default function TaxCompliancePage() {
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [propertyValue, setPropertyValue] = useState("");
  const [stampDuty, setStampDuty] = useState<string | null>(null);

  const dueFilings = FILINGS.filter((f) => f.status === "Due").length;
  const upcoming = FILINGS.filter((f) => f.status === "Upcoming").length;
  const filed = FILINGS.filter((f) => f.status === "Filed").length;

  const calculateStampDuty = () => {
    const val = Number.parseFloat(propertyValue.replace(/,/g, ""));
    if (!val || Number.isNaN(val)) return;
    const duty = val * 0.045;
    const regFee = Math.min(val * 0.01, 30000);
    setStampDuty(
      `Stamp Duty: ₹${duty.toLocaleString()} (4.5%) | Registration: ₹${regFee.toLocaleString()} | Total: ₹${(duty + regFee).toLocaleString()}`,
    );
  };

  const statusColor = (s: string) =>
    ({
      Filed: "bg-green-900/30 text-green-400 border-green-700/30",
      Due: "bg-red-900/30 text-red-400 border-red-700/30",
      Upcoming: "bg-yellow-900/30 text-yellow-400 border-yellow-700/30",
    })[s] ?? "";

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-ocid="tax.page"
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
              {[
                "Dashboard",
                "Filings",
                "Documents",
                "Calculators",
                "Calendar",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gold-300 hover:bg-gold-700/10 transition-colors"
                >
                  {item}
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
                Tax & Compliance
              </h1>
              <p className="text-muted-foreground text-sm font-sans">
                GST, TDS, Income Tax & Professional Tax management
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-gold-700/30 text-gold-400 gap-2"
              onClick={() => setShowCalcModal(true)}
              data-ocid="tax.calculator_button"
            >
              <Calculator size={16} /> Calculator
            </Button>
            <Button
              className="gold-button gap-2"
              onClick={() => setShowUploadModal(true)}
              data-ocid="tax.upload_button"
            >
              <Upload size={16} /> Upload Doc
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Due Filings",
              value: dueFilings,
              icon: AlertTriangle,
              color: "text-red-400",
            },
            {
              label: "Compliant Status",
              value: "100%",
              icon: CheckCircle,
              color: "text-green-400",
            },
            {
              label: "Next Deadline",
              value: "20 Jun",
              icon: FileText,
              color: "text-yellow-400",
            },
            {
              label: "Tax Saved FY26",
              value: "₹2.3L",
              icon: Calculator,
              color: "text-gold-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-gold-700/20 rounded-xl p-4"
              data-ocid={`tax.stat.${stat.label.toLowerCase().replace(/ /g, "_")}`}
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

        {/* Filing Calendar highlight */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <div className="bg-card border border-gold-700/20 rounded-xl p-4 mb-4">
              <h2 className="font-serif text-sm font-semibold text-gold-300 mb-3">
                Filing Calendar — Upcoming Deadlines
              </h2>
              <div className="space-y-2">
                {FILINGS.filter((f) => f.status !== "Filed").map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-obsidian-800/30"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${f.status === "Due" ? "bg-red-400" : "bg-yellow-400"}`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-semibold">
                        {f.type} — {f.period}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due: {f.dueDate} · {f.reference}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-gold-300">
                        {f.amount}
                      </p>
                      <Badge className={`text-xs ${statusColor(f.status)}`}>
                        {f.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="bg-card border border-gold-700/20 rounded-xl p-4">
              <h2 className="font-serif text-sm font-semibold text-gold-300 mb-3">
                Gujarat Professional Tax Rates
              </h2>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gold-700/20">
                    <th className="py-1 text-left text-gold-400 font-sans">
                      Salary Slab
                    </th>
                    <th className="py-1 text-right text-gold-400 font-sans">
                      Monthly
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PT_RATES.map((r) => (
                    <tr key={r.slab} className="border-b border-gold-700/10">
                      <td className="py-2 text-muted-foreground">{r.slab}</td>
                      <td className="py-2 text-right text-gold-300 font-mono">
                        {r.monthly}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 pt-3 border-t border-gold-700/20">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Due Filed</span>
                  <span className="text-green-400">{filed} filings</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Due Soon</span>
                  <span className="text-yellow-400">{upcoming} upcoming</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Overdue</span>
                  <span className="text-red-400">{dueFilings} due now</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All filings table */}
        <div className="bg-card border border-gold-700/20 rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-gold-700/20 bg-obsidian-800/40">
            <h2 className="font-serif text-sm font-semibold text-gold-300">
              All Tax Records
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="tax.table">
              <thead>
                <tr className="border-b border-gold-700/20">
                  {[
                    "Type",
                    "Period",
                    "Due Date",
                    "Amount",
                    "Status",
                    "Filed Date",
                    "Reference",
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
                {FILINGS.map((f, i) => (
                  <tr
                    key={f.id}
                    className="border-b border-gold-700/10 hover:bg-gold-700/5 transition-colors"
                    data-ocid={`tax.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-semibold text-foreground">
                      {f.type}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {f.period}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {f.dueDate}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gold-300 whitespace-nowrap">
                      {f.amount}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs ${statusColor(f.status)}`}>
                        {f.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {f.filedDate || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {f.reference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-card border border-gold-700/20 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gold-700/20 bg-obsidian-800/40">
            <h2 className="font-serif text-sm font-semibold text-gold-300">
              Tax Documents
            </h2>
          </div>
          <div className="divide-y divide-gold-700/10">
            {DOCUMENTS.map((doc, i) => (
              <div
                key={doc.name}
                className="flex items-center gap-4 px-4 py-3 hover:bg-gold-700/5 transition-colors"
                data-ocid={`tax.document.${i + 1}`}
              >
                <FileText size={16} className="text-gold-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-foreground font-semibold">
                    {doc.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {doc.category} · {doc.date} · {doc.size}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gold-700/30 text-gold-400 h-7 text-xs"
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calculator Modal */}
      <Modal
        isOpen={showCalcModal}
        onClose={() => setShowCalcModal(false)}
        title="Stamp Duty & Registration Calculator"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Calculate stamp duty and registration charges for Gujarat
            properties.
          </p>
          <div>
            <Label className="text-gold-300 text-xs mb-1 block">
              Property Value (₹)
            </Label>
            <Input
              type="text"
              placeholder="e.g. 85,00,000"
              value={propertyValue}
              onChange={(e) => setPropertyValue(e.target.value)}
              className="bg-obsidian-800/60 border-gold-700/30"
              data-ocid="tax.calc.property_input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-obsidian-800/40 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">
                Stamp Duty Rate
              </p>
              <p className="text-lg font-bold text-gold-300">4.5%</p>
            </div>
            <div className="bg-obsidian-800/40 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">
                Registration Fee
              </p>
              <p className="text-lg font-bold text-gold-300">1% (Max ₹30K)</p>
            </div>
          </div>
          {stampDuty && (
            <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
              <p className="text-sm text-green-300 font-semibold">
                {stampDuty}
              </p>
            </div>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              className="border-gold-700/30"
              onClick={() => setShowCalcModal(false)}
              data-ocid="tax.calc.cancel_button"
            >
              Close
            </Button>
            <Button
              className="gold-button"
              onClick={calculateStampDuty}
              data-ocid="tax.calc.submit_button"
            >
              Calculate
            </Button>
          </div>
        </div>
      </Modal>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Tax Document"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <Label className="text-gold-300 text-xs mb-1 block">
              Document Name
            </Label>
            <Input
              placeholder="e.g. GST Return Apr 2026"
              className="bg-obsidian-800/60 border-gold-700/30"
            />
          </div>
          <div>
            <Label className="text-gold-300 text-xs mb-1 block">Category</Label>
            <Select>
              <SelectTrigger className="bg-obsidian-800/60 border-gold-700/30">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-gold-700/30">
                {["GST", "Income Tax", "TDS", "Professional Tax", "Other"].map(
                  (c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="border-2 border-dashed border-gold-700/30 rounded-lg p-6 text-center">
            <Upload size={24} className="mx-auto text-gold-400 mb-2" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, JPG, PNG up to 10MB
            </p>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              className="border-gold-700/30"
              onClick={() => setShowUploadModal(false)}
              data-ocid="tax.upload.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="gold-button"
              data-ocid="tax.upload.submit_button"
            >
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
