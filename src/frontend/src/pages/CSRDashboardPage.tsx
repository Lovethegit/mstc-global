import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  Globe,
  Handshake,
  Heart,
  Leaf,
  TrendingUp,
  Users,
} from "lucide-react";

const CSR_FOCUS = [
  {
    label: "Education",
    pct: 30,
    color: "bg-blue-400",
    textColor: "text-blue-300",
    amount: "₹14.4L",
    icon: FileText,
  },
  {
    label: "Healthcare",
    pct: 25,
    color: "bg-red-400",
    textColor: "text-red-300",
    amount: "₹12.0L",
    icon: Heart,
  },
  {
    label: "Environment",
    pct: 20,
    color: "bg-green-400",
    textColor: "text-green-300",
    amount: "₹9.6L",
    icon: Leaf,
  },
  {
    label: "Community Development",
    pct: 15,
    color: "bg-amber-400",
    textColor: "text-amber-300",
    amount: "₹7.2L",
    icon: Building2,
  },
  {
    label: "Women Empowerment",
    pct: 10,
    color: "bg-pink-400",
    textColor: "text-pink-300",
    amount: "₹4.8L",
    icon: Users,
  },
];

const PARTNER_NGOS = [
  {
    id: 1,
    name: "Ahmedabad Education Society",
    focus: "Education",
    projects: 3,
    status: "Active Partner",
  },
  {
    id: 2,
    name: "Gujarat Mahila Vikas Society",
    focus: "Women Empowerment",
    projects: 2,
    status: "Active Partner",
  },
  {
    id: 3,
    name: "Green Gujarat Foundation",
    focus: "Environment",
    projects: 2,
    status: "Active Partner",
  },
  {
    id: 4,
    name: "Sanjivani Health Trust",
    focus: "Healthcare",
    projects: 1,
    status: "Active Partner",
  },
  {
    id: 5,
    name: "Samarthan Community Foundation",
    focus: "Community Dev.",
    projects: 2,
    status: "Onboarding",
  },
  {
    id: 6,
    name: "Deepak Foundation",
    focus: "Education & Health",
    projects: 4,
    status: "Active Partner",
  },
];

const FILINGS = [
  {
    id: 1,
    doc: "Annual CSR Report FY 2024-25",
    ministry: "MCA-21 Portal",
    dueDate: "30 Sep 2025",
    status: "Filed",
    statusColor: "bg-green-500/15 text-green-400",
  },
  {
    id: 2,
    doc: "CSR-1 Form (NGO Registration)",
    ministry: "Ministry of Corporate Affairs",
    dueDate: "31 Mar 2025",
    status: "Filed",
    statusColor: "bg-green-500/15 text-green-400",
  },
  {
    id: 3,
    doc: "CSR Expenditure Report Q4",
    ministry: "Board Resolution",
    dueDate: "30 Apr 2025",
    status: "Filed",
    statusColor: "bg-green-500/15 text-green-400",
  },
  {
    id: 4,
    doc: "Impact Assessment Report",
    ministry: "Internal",
    dueDate: "31 Aug 2025",
    status: "In Progress",
    statusColor: "bg-amber-500/15 text-amber-400",
  },
  {
    id: 5,
    doc: "CSR Annual Report FY 2025-26",
    ministry: "MCA-21 Portal",
    dueDate: "30 Sep 2026",
    status: "Upcoming",
    statusColor: "bg-blue-500/15 text-blue-400",
  },
];

export default function CSRDashboardPage() {
  return (
    <div className="min-h-screen bg-[#06090f] text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-gold-800/30 px-4 py-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-5 h-5 text-gold-400" />
                <span className="text-xs text-gold-500 font-sans uppercase tracking-widest">
                  MSTC GLOBAL
                </span>
              </div>
              <h1
                className="text-2xl md:text-3xl font-bold text-gold-300"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                CSR Dashboard
              </h1>
              <p className="text-sm text-muted-foreground font-sans mt-0.5">
                MSTC GLOBAL Social Responsibility ·{" "}
                <span className="text-gold-500">FY 2025–26</span>
              </p>
            </div>
            <Button
              className="h-11 px-4 bg-gold-500/10 border border-gold-600/40 text-gold-300 hover:bg-gold-500/20 text-sm"
              data-ocid="csr.download_report_button"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Annual Report
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
        {/* Compliance Overview */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          data-ocid="csr.stats"
        >
          {[
            {
              label: "Budget Allocated",
              value: "₹48L",
              sub: "FY 2025-26",
              icon: TrendingUp,
              color: "text-gold-400",
            },
            {
              label: "Amount Spent",
              value: "₹36.2L",
              sub: "75.4% utilized",
              icon: ClipboardList,
              color: "text-green-400",
            },
            {
              label: "Compliance Score",
              value: "94%",
              sub: "Section 135, CA 2013",
              icon: CheckCircle2,
              color: "text-blue-400",
            },
            {
              label: "Partner NGOs",
              value: "6",
              sub: "Active collaborations",
              icon: Handshake,
              color: "text-pink-400",
            },
          ].map((s, i) => (
            <div
              key={s.label}
              className="bg-card border border-gold-800/30 rounded-xl p-4 flex flex-col gap-1"
              data-ocid={`csr.stat.item.${i + 1}`}
            >
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <div className="text-xl md:text-2xl font-bold text-gold-300">
                {s.value}
              </div>
              <div className="text-xs font-semibold text-foreground font-sans">
                {s.label}
              </div>
              <div className="text-[10px] text-muted-foreground font-sans">
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Budget Progress */}
        <div className="bg-card border border-gold-800/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2
              className="font-bold text-gold-300"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Annual Budget Utilization
            </h2>
            <span className="text-sm text-gold-400 font-sans font-medium">
              ₹36.2L / ₹48L (75.4%)
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
              style={{ width: "75.4%" }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground font-sans">
            <span>
              Unspent balance: ₹11.8L (must be transferred to PM CARES /
              Schedule VII fund)
            </span>
            <span>Q4 FY25-26</span>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-card border border-gold-800/30 rounded-xl p-5">
          <h2
            className="font-bold text-gold-300 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            CSR Focus Areas
          </h2>
          <div className="space-y-4">
            {CSR_FOCUS.map((f, i) => (
              <div
                key={f.label}
                className="flex items-center gap-4"
                data-ocid={`csr.focus.item.${i + 1}`}
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <f.icon className={`w-4 h-4 ${f.textColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground font-sans">
                      {f.label}
                    </span>
                    <span className="text-xs font-sans">
                      <span className={f.textColor}>{f.pct}%</span>
                      <span className="text-muted-foreground ml-2">
                        {f.amount}
                      </span>
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${f.color} transition-all duration-700`}
                      style={{ width: `${f.pct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ministry Filings */}
        <div
          className="bg-card border border-gold-800/30 rounded-xl p-5"
          data-ocid="csr.filings_section"
        >
          <h2
            className="font-bold text-gold-300 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Ministry Filings &amp; Compliance
          </h2>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm font-sans min-w-[580px]">
              <thead>
                <tr className="border-b border-gold-800/20">
                  {["Document", "Portal / Ministry", "Due Date", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-2 text-muted-foreground text-xs font-medium"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {FILINGS.map((f, i) => (
                  <tr
                    key={f.id}
                    className="border-b border-gold-800/10 hover:bg-muted/20"
                    data-ocid={`csr.filing.item.${i + 1}`}
                  >
                    <td className="py-2.5 px-2 text-foreground">{f.doc}</td>
                    <td className="py-2.5 px-2 text-muted-foreground">
                      {f.ministry}
                    </td>
                    <td className="py-2.5 px-2 text-muted-foreground">
                      {f.dueDate}
                    </td>
                    <td className="py-2.5 px-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${f.statusColor}`}
                      >
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Partner NGOs */}
        <div
          className="bg-card border border-gold-800/30 rounded-xl p-5"
          data-ocid="csr.partners_section"
        >
          <h2
            className="font-bold text-gold-300 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Partner NGOs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PARTNER_NGOS.map((ngo, i) => (
              <div
                key={ngo.id}
                className="bg-background border border-gold-800/20 rounded-lg p-4 flex flex-col gap-1.5"
                data-ocid={`csr.ngo.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-foreground text-sm leading-tight">
                    {ngo.name}
                  </span>
                  <Badge
                    className={`text-[10px] border-0 flex-shrink-0 ${
                      ngo.status === "Active Partner"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {ngo.status}
                  </Badge>
                </div>
                <div className="text-xs text-gold-500 font-sans">
                  {ngo.focus}
                </div>
                <div className="text-xs text-muted-foreground font-sans">
                  {ngo.projects} active project{ngo.projects !== 1 ? "s" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-3 justify-center pb-4">
          <Button
            className="h-11 px-5 bg-gold-500/10 border border-gold-600/40 text-gold-300 hover:bg-gold-500/20"
            data-ocid="csr.annual_report_button"
          >
            <Download className="w-4 h-4 mr-2" />
            Annual CSR Report
          </Button>
          <Button
            className="h-11 px-5 bg-blue-500/10 border border-blue-600/40 text-blue-300 hover:bg-blue-500/20"
            data-ocid="csr.board_resolution_button"
          >
            <FileText className="w-4 h-4 mr-2" />
            Board Resolution
          </Button>
          <Button
            className="h-11 px-5 bg-green-500/10 border border-green-600/40 text-green-300 hover:bg-green-500/20"
            data-ocid="csr.impact_assessment_button"
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Impact Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
