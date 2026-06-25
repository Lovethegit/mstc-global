import SecureAppGate from "@/components/shared/SecureAppGate";
import BackButton from "@/components/ui/BackButton";
import { CreditCard, Download, FileText, Plus, Send, X } from "lucide-react";
import { useState } from "react";

type InvoiceStatus = "Paid" | "Pending" | "Overdue";

interface Invoice {
  id: string;
  client: string;
  service: string;
  amount: number;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
}

const INVOICES: Invoice[] = [
  {
    id: "IN-2026-001",
    client: "Rajesh Mehta",
    service: "Property Sale — Prahlad Nagar 3BHK",
    amount: 170000,
    date: "01 May 2026",
    dueDate: "15 May 2026",
    status: "Paid",
  },
  {
    id: "IN-2026-002",
    client: "Anita Joshi",
    service: "Commercial Lease Facilitation",
    amount: 66000,
    date: "03 May 2026",
    dueDate: "18 May 2026",
    status: "Pending",
  },
  {
    id: "IN-2026-003",
    client: "Priya Shah",
    service: "Home Loan Processing — ₹70L",
    amount: 35000,
    date: "05 May 2026",
    dueDate: "20 May 2026",
    status: "Paid",
  },
  {
    id: "IN-2026-004",
    client: "Vikram Patel",
    service: "Property Sale — Navrangpura Plot",
    amount: 130000,
    date: "07 May 2026",
    dueDate: "22 May 2026",
    status: "Overdue",
  },
  {
    id: "IN-2026-005",
    client: "Kavita Desai",
    service: "Corporate Event Facilitation",
    amount: 25000,
    date: "09 May 2026",
    dueDate: "24 May 2026",
    status: "Pending",
  },
  {
    id: "IN-2026-006",
    client: "Sanjay Agarwal",
    service: "Property Sale — Bodakdev 4BHK",
    amount: 280000,
    date: "11 May 2026",
    dueDate: "26 May 2026",
    status: "Paid",
  },
  {
    id: "IN-2026-007",
    client: "Meera Trivedi",
    service: "RERA Compliance Consulting",
    amount: 45000,
    date: "12 May 2026",
    dueDate: "27 May 2026",
    status: "Paid",
  },
  {
    id: "IN-2026-008",
    client: "Harish Bhatt",
    service: "Business Loan Facilitation — ₹1.2Cr",
    amount: 48000,
    date: "14 May 2026",
    dueDate: "29 May 2026",
    status: "Pending",
  },
  {
    id: "IN-2026-009",
    client: "Sunita Kapoor",
    service: "Property Sale — S.G. Highway Commercial",
    amount: 320000,
    date: "15 May 2026",
    dueDate: "30 May 2026",
    status: "Paid",
  },
  {
    id: "IN-2026-010",
    client: "Deepak Modi",
    service: "Redevelopment Advisory",
    amount: 75000,
    date: "16 May 2026",
    dueDate: "31 May 2026",
    status: "Paid",
  },
  {
    id: "IN-2026-011",
    client: "Pooja Sharma",
    service: "Residential Rental — Vastrapur 2BHK",
    amount: 18000,
    date: "17 May 2026",
    dueDate: "01 Jun 2026",
    status: "Paid",
  },
  {
    id: "IN-2026-012",
    client: "Amit Kumar",
    service: "Property Sale — Satellite City Villa",
    amount: 520000,
    date: "18 May 2026",
    dueDate: "02 Jun 2026",
    status: "Pending",
  },
  {
    id: "IN-2026-013",
    client: "Reena Nair",
    service: "Home Loan — ₹55L",
    amount: 27500,
    date: "19 May 2026",
    dueDate: "03 Jun 2026",
    status: "Overdue",
  },
  {
    id: "IN-2026-014",
    client: "Kiran Rao",
    service: "CSR Fund Advisory",
    amount: 35000,
    date: "20 May 2026",
    dueDate: "04 Jun 2026",
    status: "Paid",
  },
  {
    id: "IN-2026-015",
    client: "Nirav Shah",
    service: "Commercial Property Lease",
    amount: 92000,
    date: "21 May 2026",
    dueDate: "05 Jun 2026",
    status: "Paid",
  },
  {
    id: "IN-2026-016",
    client: "Bhavna Patel",
    service: "Music Artist Management",
    amount: 28000,
    date: "22 May 2026",
    dueDate: "06 Jun 2026",
    status: "Pending",
  },
  {
    id: "IN-2026-017",
    client: "Rakesh Gupta",
    service: "Property Sale — Ambli 3BHK",
    amount: 198000,
    date: "23 May 2026",
    dueDate: "07 Jun 2026",
    status: "Paid",
  },
  {
    id: "IN-2026-018",
    client: "Lalita Mehta",
    service: "Tourism Package — Gir + Rann",
    amount: 15000,
    date: "24 May 2026",
    dueDate: "08 Jun 2026",
    status: "Paid",
  },
  {
    id: "IN-2026-019",
    client: "Suresh Pandya",
    service: "Industrial Plot Advisory",
    amount: 155000,
    date: "25 May 2026",
    dueDate: "09 Jun 2026",
    status: "Pending",
  },
  {
    id: "IN-2026-020",
    client: "Jyoti Thakkar",
    service: "NRI Property Consultation",
    amount: 42000,
    date: "26 May 2026",
    dueDate: "10 Jun 2026",
    status: "Paid",
  },
];

const STATUS_CLASS: Record<InvoiceStatus, string> = {
  Paid: "bg-green-900/20 text-green-300 border-green-800/30",
  Pending: "bg-yellow-900/20 text-yellow-300 border-yellow-800/30",
  Overdue: "bg-red-900/20 text-red-300 border-red-800/30",
};

function CreateInvoiceModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="billing.create.dialog"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="presentation"
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-gold-800/40 bg-card p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          data-ocid="billing.create.close_button"
        >
          <X className="w-4 h-4" />
        </button>
        <h3 className="font-serif text-lg font-bold text-gold-400 mb-4">
          Create Invoice
        </h3>
        <div className="space-y-3">
          {[
            ["Client Name", "client_name"],
            ["Service Description", "service"],
            ["Amount (₹)", "amount"],
          ].map(([label, id]) => (
            <div key={id}>
              <label className="text-xs text-muted-foreground block mb-1">
                {label}
              </label>
              <input
                type={id === "amount" ? "number" : "text"}
                placeholder={label}
                className="w-full bg-background border border-gold-800/30 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold-700/50"
                data-ocid={`billing.create.${id}.input`}
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                className="w-full bg-background border border-gold-800/30 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold-700/50"
                data-ocid="billing.create.date.input"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                Due Date
              </label>
              <input
                type="date"
                className="w-full bg-background border border-gold-800/30 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold-700/50"
                data-ocid="billing.create.due_date.input"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gold-700 hover:bg-gold-600 text-background font-semibold text-sm"
            data-ocid="billing.create.submit_button"
          >
            Create Invoice
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gold-800/30 text-muted-foreground hover:text-foreground text-sm"
            data-ocid="billing.create.cancel_button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const [creating, setCreating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | "All">(
    "All",
  );

  const totalRevenue = INVOICES.reduce((s, i) => s + i.amount, 0);
  const paid = INVOICES.filter((i) => i.status === "Paid").reduce(
    (s, i) => s + i.amount,
    0,
  );
  const pending = INVOICES.filter((i) => i.status === "Pending").reduce(
    (s, i) => s + i.amount,
    0,
  );
  const overdue = INVOICES.filter((i) => i.status === "Overdue").reduce(
    (s, i) => s + i.amount,
    0,
  );

  const filtered = INVOICES.filter(
    (i) => filterStatus === "All" || i.status === filterStatus,
  );

  return (
    <SecureAppGate appName="Billing & Invoices">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="billing.page"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <BackButton />
              <CreditCard className="w-4 h-4 text-gold-400" />
              <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
                Billing & Invoices
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-800/30 text-muted-foreground hover:text-foreground text-sm transition-colors"
                data-ocid="billing.export_button"
              >
                <Download className="w-3.5 h-3.5" /> Export PDF
              </button>
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
                data-ocid="billing.create_button"
              >
                <Plus className="w-3.5 h-3.5" /> Create Invoice
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              {
                label: "Total Revenue",
                value: `₹${(totalRevenue / 100000).toFixed(1)}L`,
                color: "text-gold-400",
              },
              {
                label: "Paid This Month",
                value: `₹${(paid / 100000).toFixed(1)}L`,
                color: "text-green-400",
              },
              {
                label: "Pending",
                value: `₹${(pending / 100000).toFixed(1)}L`,
                color: "text-yellow-400",
              },
              {
                label: "Overdue",
                value: `₹${(overdue / 100000).toFixed(1)}L`,
                color: "text-red-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-gold-800/30 bg-card p-3"
              >
                <p className={`font-serif text-xl font-bold ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap mb-4">
            {(
              ["All", "Paid", "Pending", "Overdue"] as (InvoiceStatus | "All")[]
            ).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilterStatus(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filterStatus === f ? "bg-gold-700/30 text-gold-400 border border-gold-700/40" : "text-muted-foreground hover:text-foreground"}`}
                data-ocid={`billing.filter.${f.toLowerCase()}`}
              >
                {f}
              </button>
            ))}
            <span className="ml-auto text-xs text-muted-foreground self-center">
              {filtered.length} invoices
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gold-800/30">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-card border-b border-gold-800/30">
                <tr>
                  {[
                    "Invoice #",
                    "Client",
                    "Service",
                    "Amount",
                    "Date",
                    "Due Date",
                    "Status",
                    "Actions",
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
                {filtered.map((inv, i) => (
                  <tr
                    key={inv.id}
                    className="border-b border-gold-800/20 hover:bg-card/60 transition-colors"
                    data-ocid={`billing.item.${i + 1}`}
                  >
                    <td className="px-3 py-2.5 font-mono text-xs text-gold-500 whitespace-nowrap">
                      {inv.id}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">
                      {inv.client}
                    </td>
                    <td
                      className="px-3 py-2.5 text-muted-foreground max-w-[200px] truncate"
                      title={inv.service}
                    >
                      {inv.service}
                    </td>
                    <td className="px-3 py-2.5 text-right font-medium text-gold-400 whitespace-nowrap">
                      ₹{inv.amount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {inv.date}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {inv.dueDate}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${STATUS_CLASS[inv.status]}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="p-1 rounded text-muted-foreground hover:text-gold-400 transition-colors"
                          title="View"
                          data-ocid={`billing.view_button.${i + 1}`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        {inv.status !== "Paid" && (
                          <button
                            type="button"
                            className="p-1 rounded text-muted-foreground hover:text-blue-400 transition-colors"
                            title="Send Reminder"
                            data-ocid={`billing.remind_button.${i + 1}`}
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          className="p-1 rounded text-muted-foreground hover:text-gold-400 transition-colors"
                          title="Export PDF"
                          data-ocid={`billing.pdf_button.${i + 1}`}
                        >
                          <Download className="w-3.5 h-3.5" />
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
      {creating && <CreateInvoiceModal onClose={() => setCreating(false)} />}
    </SecureAppGate>
  );
}
