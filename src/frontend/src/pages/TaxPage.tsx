import SecureAppGate from "@/components/shared/SecureAppGate";
import BackButton from "@/components/ui/BackButton";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck,
  FileText,
  Landmark,
  ShieldCheck,
  TrendingUp,
  XCircle,
} from "lucide-react";

/* ─── Data ─── */

const GSTIN = "24AABCM1234A1Z5";

const GST_SUMMARY = {
  collected: 184200,
  itcPending: 23400,
  itcClaimed: 156800,
  netPayable: 27400,
};

const GSTR_STATUS = [
  {
    form: "GSTR-1",
    period: "May 2026",
    status: "Filed",
    filedDate: "11 May 2026",
    dueDate: "13 May 2026",
  },
  {
    form: "GSTR-3B",
    period: "May 2026",
    status: "Filed",
    filedDate: "20 May 2026",
    dueDate: "20 May 2026",
  },
  {
    form: "GSTR-1",
    period: "Jun 2026",
    status: "Pending",
    filedDate: "—",
    dueDate: "13 Jun 2026",
  },
  {
    form: "GSTR-3B",
    period: "Jun 2026",
    status: "Due",
    filedDate: "—",
    dueDate: "20 Jun 2026",
  },
];

interface ComplianceItem {
  title: string;
  dueDate: string;
  daysLeft: number;
  type: "gst" | "tds" | "tax" | "itr";
  urgent: boolean;
}

const COMPLIANCE_CALENDAR: ComplianceItem[] = [
  {
    title: "GSTR-1 Filing (Q2)",
    dueDate: "13 Jun 2026",
    daysLeft: 15,
    type: "gst",
    urgent: false,
  },
  {
    title: "GSTR-3B Monthly",
    dueDate: "20 Jun 2026",
    daysLeft: 22,
    type: "gst",
    urgent: false,
  },
  {
    title: "TDS Return (26Q)",
    dueDate: "31 Jul 2026",
    daysLeft: 63,
    type: "tds",
    urgent: false,
  },
  {
    title: "Advance Tax — Q4",
    dueDate: "15 Jun 2026",
    daysLeft: 17,
    type: "tax",
    urgent: true,
  },
  {
    title: "ITR Filing (AY 2026-27)",
    dueDate: "31 Jul 2026",
    daysLeft: 63,
    type: "itr",
    urgent: false,
  },
];

interface TDSTransaction {
  id: string;
  property: string;
  buyer: string;
  saleValue: number;
  tdsRate: string;
  tdsAmount: number;
  depositedDate: string;
  challanNo: string;
  status: "Deposited" | "Pending";
}

const TDS_TRANSACTIONS: TDSTransaction[] = [
  {
    id: "TDS-2026-041",
    property: "Prahlad Nagar 3BHK",
    buyer: "Rajesh Mehta",
    saleValue: 8500000,
    tdsRate: "1%",
    tdsAmount: 85000,
    depositedDate: "12 May 2026",
    challanNo: "CHL-28475631",
    status: "Deposited",
  },
  {
    id: "TDS-2026-042",
    property: "Bodakdev 4BHK Villa",
    buyer: "Sanjay Agarwal",
    saleValue: 12500000,
    tdsRate: "1%",
    tdsAmount: 125000,
    depositedDate: "15 May 2026",
    challanNo: "CHL-28476192",
    status: "Deposited",
  },
  {
    id: "TDS-2026-043",
    property: "Navrangpura Plot",
    buyer: "Vikram Patel",
    saleValue: 6200000,
    tdsRate: "1%",
    tdsAmount: 62000,
    depositedDate: "—",
    challanNo: "—",
    status: "Pending",
  },
  {
    id: "TDS-2026-044",
    property: "S.G. Highway Commercial",
    buyer: "Sunita Kapoor",
    saleValue: 18000000,
    tdsRate: "1%",
    tdsAmount: 180000,
    depositedDate: "22 May 2026",
    challanNo: "CHL-28477345",
    status: "Deposited",
  },
  {
    id: "TDS-2026-045",
    property: "Ambli 3BHK",
    buyer: "Rakesh Gupta",
    saleValue: 7800000,
    tdsRate: "1%",
    tdsAmount: 78000,
    depositedDate: "—",
    challanNo: "—",
    status: "Pending",
  },
];

interface FilingRecord {
  type: string;
  period: string;
  amount: number;
  filedDate: string;
  status: "Filed" | "Pending" | "Due";
}

const RECENT_FILINGS: FilingRecord[] = [
  {
    type: "GSTR-3B",
    period: "May 2026",
    amount: 27400,
    filedDate: "20 May 2026",
    status: "Filed",
  },
  {
    type: "GSTR-1",
    period: "May 2026",
    amount: 184200,
    filedDate: "11 May 2026",
    status: "Filed",
  },
  {
    type: "TDS (26Q)",
    period: "Q1 2026",
    amount: 452000,
    filedDate: "30 Apr 2026",
    status: "Filed",
  },
  {
    type: "Advance Tax",
    period: "Q3 2025-26",
    amount: 125000,
    filedDate: "15 Mar 2026",
    status: "Filed",
  },
  {
    type: "ITR-4",
    period: "AY 2025-26",
    amount: 0,
    filedDate: "25 Jul 2025",
    status: "Filed",
  },
  {
    type: "GSTR-1",
    period: "Jun 2026",
    amount: 0,
    filedDate: "—",
    status: "Due",
  },
];

/* ─── Helpers ─── */

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  Filed: <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />,
  Pending: <Clock className="w-3.5 h-3.5 text-yellow-400" />,
  Due: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
};

const STATUS_CLASS: Record<string, string> = {
  Filed: "bg-green-900/20 text-green-300 border-green-800/30",
  Pending: "bg-yellow-900/20 text-yellow-300 border-yellow-800/30",
  Due: "bg-amber-900/20 text-amber-300 border-amber-800/30",
  Deposited: "bg-green-900/20 text-green-300 border-green-800/30",
};

const TYPE_ICON: Record<ComplianceItem["type"], React.ReactNode> = {
  gst: <FileText className="w-4 h-4 text-gold-400" />,
  tds: <Landmark className="w-4 h-4 text-blue-400" />,
  tax: <TrendingUp className="w-4 h-4 text-red-400" />,
  itr: <FileCheck className="w-4 h-4 text-green-400" />,
};

/* ─── Page ─── */

export default function TaxPage() {
  return (
    <SecureAppGate appName="Tax & Compliance">
      <div className="min-h-screen bg-background pb-20" data-ocid="tax.page">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gold-400" />
              <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
                Tax & Compliance
              </h1>
            </div>
            <BackButton to="/apps" />
          </div>
        </div>

        <div className="px-4 py-4 space-y-5 max-w-6xl mx-auto">
          {/* Tax Health Score */}
          <div className="rounded-xl border border-gold-800/30 bg-card p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-900/20 border border-green-800/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-foreground text-lg">
                  Tax Health Score
                </h2>
                <p className="text-xs text-muted-foreground">
                  Overall compliance status for MSTC GLOBAL
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-serif text-3xl font-bold text-green-400">
                  94<span className="text-lg text-muted-foreground">/100</span>
                </p>
                <p className="text-xs text-green-400 font-medium">COMPLIANT</p>
              </div>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: "94%" }}
              />
            </div>
            <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-400" /> All GST
                returns filed
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-400" /> TDS deposits
                on track
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" /> 2 pending
                items
              </span>
            </div>
          </div>

          {/* GST Section */}
          <div className="rounded-xl border border-gold-800/30 bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <Landmark className="w-4 h-4 text-gold-400" />
              <h2 className="font-serif font-bold text-foreground text-base">
                GST Overview
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <div className="rounded-lg border border-gold-800/20 bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">GSTIN</p>
                <p className="font-mono text-sm text-gold-400 font-medium mt-1">
                  {GSTIN}
                </p>
                <p className="text-[10px] text-green-400 mt-0.5">
                  Active · Ahmedabad
                </p>
              </div>
              <div className="rounded-lg border border-gold-800/20 bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">
                  GST Collected (May)
                </p>
                <p className="font-serif text-lg text-gold-400 font-bold mt-1">
                  {formatCurrency(GST_SUMMARY.collected)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  18% on services
                </p>
              </div>
              <div className="rounded-lg border border-gold-800/20 bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">ITC Pending</p>
                <p className="font-serif text-lg text-yellow-400 font-bold mt-1">
                  {formatCurrency(GST_SUMMARY.itcPending)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Awaiting vendor invoices
                </p>
              </div>
              <div className="rounded-lg border border-gold-800/20 bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">Net Payable</p>
                <p className="font-serif text-lg text-foreground font-bold mt-1">
                  {formatCurrency(GST_SUMMARY.netPayable)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  After ITC adjustment
                </p>
              </div>
            </div>

            {/* GSTR Status */}
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Return Filing Status
            </h3>
            <div className="overflow-x-auto rounded-xl border border-gold-800/20">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-background border-b border-gold-800/20">
                  <tr>
                    {["Form", "Period", "Status", "Filed Date", "Due Date"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left text-xs font-medium text-gold-600 whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {GSTR_STATUS.map((g, i) => (
                    <tr
                      key={`${g.form}-${g.period}-${i}`}
                      className="border-b border-gold-800/10 hover:bg-card/60 transition-colors"
                    >
                      <td className="px-3 py-2 font-medium text-foreground whitespace-nowrap">
                        {g.form}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground text-xs whitespace-nowrap">
                        {g.period}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${STATUS_CLASS[g.status]}`}
                        >
                          {STATUS_ICON[g.status]}
                          {g.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground text-xs whitespace-nowrap">
                        {g.filedDate}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground text-xs whitespace-nowrap">
                        {g.dueDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Compliance Calendar */}
          <div className="rounded-xl border border-gold-800/30 bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-gold-400" />
              <h2 className="font-serif font-bold text-foreground text-base">
                Compliance Calendar
              </h2>
            </div>
            <div className="space-y-2">
              {COMPLIANCE_CALENDAR.map((item, i) => (
                <div
                  key={item.title}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    item.urgent
                      ? "border-red-800/30 bg-red-900/10"
                      : "border-gold-800/20 bg-background/40 hover:bg-background/60"
                  }`}
                  data-ocid={`tax.compliance.item.${i + 1}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-card border border-gold-800/20 flex items-center justify-center shrink-0">
                    {TYPE_ICON[item.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due: {item.dueDate}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm font-bold ${
                        item.daysLeft <= 7
                          ? "text-red-400"
                          : item.daysLeft <= 30
                            ? "text-amber-400"
                            : "text-green-400"
                      }`}
                    >
                      {item.daysLeft} days
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      remaining
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* TDS Section (194-IA) */}
          <div className="rounded-xl border border-gold-800/30 bg-card p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-gold-400" />
                <h2 className="font-serif font-bold text-foreground text-base">
                  TDS Compliance (Section 194-IA)
                </h2>
              </div>
              <span className="text-xs text-muted-foreground bg-background/60 px-2 py-1 rounded-lg border border-gold-800/20">
                Properties above ₹50L require 1% TDS at source
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gold-800/20">
              <table className="w-full text-sm min-w-[800px]">
                <thead className="bg-background border-b border-gold-800/20">
                  <tr>
                    {[
                      "TDS ID",
                      "Property",
                      "Buyer",
                      "Sale Value",
                      "TDS @1%",
                      "Deposited",
                      "Challan No.",
                      "Status",
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
                  {TDS_TRANSACTIONS.map((t, i) => (
                    <tr
                      key={t.id}
                      className="border-b border-gold-800/10 hover:bg-card/60 transition-colors"
                      data-ocid={`tax.tds.item.${i + 1}`}
                    >
                      <td className="px-3 py-2.5 font-mono text-xs text-gold-500 whitespace-nowrap">
                        {t.id}
                      </td>
                      <td className="px-3 py-2.5 text-foreground text-xs max-w-[140px] truncate">
                        {t.property}
                      </td>
                      <td className="px-3 py-2.5 text-foreground text-xs whitespace-nowrap">
                        {t.buyer}
                      </td>
                      <td className="px-3 py-2.5 text-right text-gold-400 text-xs font-medium whitespace-nowrap">
                        {formatCurrency(t.saleValue)}
                      </td>
                      <td className="px-3 py-2.5 text-right text-foreground text-xs font-medium whitespace-nowrap">
                        {formatCurrency(t.tdsAmount)}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground text-xs whitespace-nowrap">
                        {t.depositedDate}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {t.challanNo}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${STATUS_CLASS[t.status]}`}
                        >
                          {t.status === "Deposited" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Filings */}
          <div className="rounded-xl border border-gold-800/30 bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="w-4 h-4 text-gold-400" />
              <h2 className="font-serif font-bold text-foreground text-base">
                Recent Filings & Returns
              </h2>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gold-800/20">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-background border-b border-gold-800/20">
                  <tr>
                    {["Type", "Period", "Amount", "Filed Date", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-3 py-2.5 text-left text-xs font-medium text-gold-600 whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_FILINGS.map((f, i) => (
                    <tr
                      key={`${f.type}-${f.period}-${i}`}
                      className="border-b border-gold-800/10 hover:bg-card/60 transition-colors"
                      data-ocid={`tax.filing.item.${i + 1}`}
                    >
                      <td className="px-3 py-2.5 font-medium text-foreground text-xs whitespace-nowrap">
                        {f.type}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground text-xs whitespace-nowrap">
                        {f.period}
                      </td>
                      <td className="px-3 py-2.5 text-right text-gold-400 text-xs font-medium whitespace-nowrap">
                        {f.amount > 0 ? formatCurrency(f.amount) : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground text-xs whitespace-nowrap">
                        {f.filedDate}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${STATUS_CLASS[f.status]}`}
                        >
                          {STATUS_ICON[f.status]}
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SecureAppGate>
  );
}
