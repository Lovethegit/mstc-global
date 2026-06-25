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
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  Calculator,
  IndianRupee,
  Plus,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

const REFERRALS = [
  {
    id: 1,
    referrer: "Rohit Sharma",
    referee: "Ankit Patel",
    date: "2026-05-22",
    service: "Property Purchase",
    status: "Converted",
    commission: 45000,
    notes: "3BHK in Bopal, ₹85L transaction",
  },
  {
    id: 2,
    referrer: "Priya Desai",
    referee: "Neha Joshi",
    date: "2026-05-20",
    service: "Finance Consulting",
    status: "Active",
    commission: 8500,
    notes: "Home loan ₹65L processing",
  },
  {
    id: 3,
    referrer: "Kiran Mehta",
    referee: "Suresh Agarwal",
    date: "2026-05-18",
    service: "RERA Consulting",
    status: "Converted",
    commission: 12000,
    notes: "Promoter registration completed",
  },
  {
    id: 4,
    referrer: "Vijay Shah",
    referee: "Ramesh Gupta",
    date: "2026-05-16",
    service: "Commercial Rental",
    status: "Converted",
    commission: 22000,
    notes: "Office space SG Highway, ₹3.5L/mo",
  },
  {
    id: 5,
    referrer: "Sunita Rao",
    referee: "Mohan Das",
    date: "2026-05-14",
    service: "Property Sale",
    status: "Pending",
    commission: 0,
    notes: "Valuation done, listing in progress",
  },
  {
    id: 6,
    referrer: "Rohit Sharma",
    referee: "Kavita Trivedi",
    date: "2026-05-12",
    service: "Investment Advisory",
    status: "Converted",
    commission: 18000,
    notes: "₹60L commercial property investment",
  },
  {
    id: 7,
    referrer: "Amit Kapoor",
    referee: "Deepak Soni",
    date: "2026-05-10",
    service: "Property Purchase",
    status: "Active",
    commission: 0,
    notes: "Site visits completed, decision pending",
  },
  {
    id: 8,
    referrer: "Meera Pillai",
    referee: "Lalita Chandra",
    date: "2026-05-08",
    service: "Finance Consulting",
    status: "Converted",
    commission: 9500,
    notes: "Business loan ₹1.8Cr approved",
  },
  {
    id: 9,
    referrer: "Priya Desai",
    referee: "Harish Modi",
    date: "2026-05-06",
    service: "Property Purchase",
    status: "Pending",
    commission: 0,
    notes: "Initial consultation done",
  },
  {
    id: 10,
    referrer: "Rajesh Verma",
    referee: "Pooja Bhatt",
    date: "2026-05-04",
    service: "Rental Management",
    status: "Converted",
    commission: 6000,
    notes: "Annual management contract signed",
  },
  {
    id: 11,
    referrer: "Kiran Mehta",
    referee: "Nisha Tiwari",
    date: "2026-05-02",
    service: "CSR Services",
    status: "Converted",
    commission: 15000,
    notes: "Corporate CSR program ₹5L",
  },
  {
    id: 12,
    referrer: "Vijay Shah",
    referee: "Sunil Menon",
    date: "2026-04-30",
    service: "Events Management",
    status: "Active",
    commission: 0,
    notes: "Quotation sent, awaiting approval",
  },
  {
    id: 13,
    referrer: "Rohit Sharma",
    referee: "Prem Jain",
    date: "2026-04-28",
    service: "Property Purchase",
    status: "Converted",
    commission: 38000,
    notes: "4BHK Bodakdev ₹1.2Cr transaction",
  },
  {
    id: 14,
    referrer: "Sunita Rao",
    referee: "Usha Nair",
    date: "2026-04-26",
    service: "NRI Services",
    status: "Converted",
    commission: 25000,
    notes: "NRI property purchase, POA executed",
  },
  {
    id: 15,
    referrer: "Amit Kapoor",
    referee: "Ravi Bhat",
    date: "2026-04-24",
    service: "RERA Consulting",
    status: "Expired",
    commission: 0,
    notes: "Client chose another firm",
  },
  {
    id: 16,
    referrer: "Meera Pillai",
    referee: "Seema Rana",
    date: "2026-04-22",
    service: "Property Purchase",
    status: "Converted",
    commission: 28000,
    notes: "Residential plot Sanand ₹42L",
  },
  {
    id: 17,
    referrer: "Rajesh Verma",
    referee: "Manoj Pandey",
    date: "2026-04-20",
    service: "Finance Consulting",
    status: "Active",
    commission: 0,
    notes: "Loan documents under verification",
  },
  {
    id: 18,
    referrer: "Priya Desai",
    referee: "Dinesh Sharma",
    date: "2026-04-18",
    service: "Property Sale",
    status: "Converted",
    commission: 32000,
    notes: "Satellite flat sold ₹78L",
  },
  {
    id: 19,
    referrer: "Kiran Mehta",
    referee: "Varsha Gupta",
    date: "2026-04-16",
    service: "Commercial Rental",
    status: "Pending",
    commission: 0,
    notes: "Shortlisted 3 properties",
  },
  {
    id: 20,
    referrer: "Vijay Shah",
    referee: "Ashok Kapoor",
    date: "2026-04-14",
    service: "Investment Advisory",
    status: "Converted",
    commission: 21000,
    notes: "Equity-linked investment ₹80L",
  },
];

const PARTNERS = [
  {
    id: 1,
    name: "Vijay Patel",
    type: "Agent",
    referrals: 24,
    conversions: 8,
    rate: 2.0,
    earned: 480000,
    status: "Active",
  },
  {
    id: 2,
    name: "Sunita Mehta",
    type: "Client",
    referrals: 6,
    conversions: 3,
    rate: 1.5,
    earned: 120000,
    status: "Active",
  },
  {
    id: 3,
    name: "Rohit Sharma",
    type: "Agent",
    referrals: 22,
    conversions: 16,
    rate: 2.0,
    earned: 320000,
    status: "Active",
  },
  {
    id: 4,
    name: "Priya Desai",
    type: "Agent",
    referrals: 18,
    conversions: 12,
    rate: 1.75,
    earned: 210000,
    status: "Active",
  },
  {
    id: 5,
    name: "Kiran Mehta",
    type: "Partner",
    referrals: 14,
    conversions: 9,
    rate: 2.5,
    earned: 225000,
    status: "Active",
  },
  {
    id: 6,
    name: "Amit Shah",
    type: "Agent",
    referrals: 11,
    conversions: 5,
    rate: 1.5,
    earned: 75000,
    status: "Active",
  },
  {
    id: 7,
    name: "Meera Pillai",
    type: "Client",
    referrals: 4,
    conversions: 2,
    rate: 1.0,
    earned: 20000,
    status: "Inactive",
  },
  {
    id: 8,
    name: "Rajesh Verma",
    type: "Partner",
    referrals: 9,
    conversions: 6,
    rate: 2.0,
    earned: 120000,
    status: "Active",
  },
  {
    id: 9,
    name: "Neeraj Patel",
    type: "Agent",
    referrals: 7,
    conversions: 4,
    rate: 1.75,
    earned: 70000,
    status: "Active",
  },
  {
    id: 10,
    name: "Shweta Joshi",
    type: "Client",
    referrals: 3,
    conversions: 1,
    rate: 1.0,
    earned: 15000,
    status: "Inactive",
  },
];

const COMMISSION_RATES = ["1.0%", "1.5%", "1.75%", "2.0%", "2.5%", "3.0%"];

const TOP_REFERRERS = [
  { name: "Rohit Sharma", referrals: 24, converted: 18, earnings: 187000 },
  { name: "Priya Desai", referrals: 22, converted: 15, earnings: 145000 },
  { name: "Kiran Mehta", referrals: 19, converted: 14, earnings: 134000 },
  { name: "Vijay Shah", referrals: 18, converted: 13, earnings: 128000 },
  { name: "Sunita Rao", referrals: 16, converted: 11, earnings: 112000 },
  { name: "Amit Kapoor", referrals: 14, converted: 9, earnings: 94000 },
  { name: "Meera Pillai", referrals: 13, converted: 10, earnings: 89000 },
  { name: "Rajesh Verma", referrals: 12, converted: 8, earnings: 76000 },
  { name: "Neeraj Patel", referrals: 10, converted: 7, earnings: 68000 },
  { name: "Shweta Joshi", referrals: 8, converted: 5, earnings: 47000 },
];

const SERVICES = [
  "All Services",
  "Property Purchase",
  "Property Sale",
  "Finance Consulting",
  "RERA Consulting",
  "Commercial Rental",
  "Rental Management",
  "Investment Advisory",
  "NRI Services",
  "Events Management",
  "CSR Services",
];
const STATUSES = ["All", "Active", "Converted", "Pending", "Expired"];

export default function ReferralTrackerPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterService, setFilterService] = useState("All Services");
  const [showAddModal, setShowAddModal] = useState(false);
  const [tab, setTab] = useState<
    "partners" | "referrals" | "leaderboard" | "calculator"
  >("partners");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [calcDealValue, setCalcDealValue] = useState("");
  const [calcRate, setCalcRate] = useState("2.0%");
  const [partnerSearch, setPartnerSearch] = useState("");

  const filtered = REFERRALS.filter((r) => {
    const matchSearch =
      r.referrer.toLowerCase().includes(search.toLowerCase()) ||
      r.referee.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    const matchService =
      filterService === "All Services" || r.service === filterService;
    return matchSearch && matchStatus && matchService;
  });

  const totalReferrals = REFERRALS.length;
  const _converted = REFERRALS.filter((r) => r.status === "Converted").length;
  const _pending = REFERRALS.filter(
    (r) => r.status === "Active" || r.status === "Pending",
  ).length;
  const _totalRevenue = REFERRALS.reduce((s, r) => s + r.commission, 0);

  const activePartners = PARTNERS.filter((p) => p.status === "Active").length;
  const totalPartnerCommissions = PARTNERS.reduce((s, p) => s + p.earned, 0);
  const totalPartnerConversions = PARTNERS.reduce(
    (s, p) => s + p.conversions,
    0,
  );

  const filteredPartners = PARTNERS.filter(
    (p) =>
      p.name.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      p.type.toLowerCase().includes(partnerSearch.toLowerCase()),
  );

  const calcCommission = () => {
    const val = Number.parseFloat(calcDealValue.replace(/,/g, ""));
    const rate = Number.parseFloat(calcRate.replace("%", ""));
    if (!val || !rate) return null;
    return Math.round(val * (rate / 100));
  };
  const commission = calcCommission();

  const statusColor = (s: string) =>
    ({
      Converted: "bg-green-900/30 text-green-400 border-green-700/30",
      Active: "bg-blue-900/30 text-blue-400 border-blue-700/30",
      Pending: "bg-yellow-900/30 text-yellow-400 border-yellow-700/30",
      Expired: "bg-red-900/30 text-red-400 border-red-700/30",
    })[s] ?? "";

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-ocid="referrals.page"
    >
      {/* Sidebar */}
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
              {["Dashboard", "Referrals", "Leaderboard", "Analytics"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gold-300 hover:bg-gold-700/10 transition-colors"
                  >
                    {item}
                  </button>
                ),
              )}
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
                Referral Tracker
              </h1>
              <p className="text-muted-foreground text-sm font-sans">
                Track referrals, conversions and commissions
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="gold-button gap-2"
            data-ocid="referrals.add_button"
          >
            <Plus size={16} /> Add Referral
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Active Partners",
              value: activePartners,
              icon: Users,
              color: "text-blue-400",
            },
            {
              label: "Commissions Paid",
              value: `\u20b9${(totalPartnerCommissions / 100000).toFixed(1)}L`,
              icon: IndianRupee,
              color: "text-gold-400",
            },
            {
              label: "Total Referrals",
              value: totalReferrals,
              icon: TrendingUp,
              color: "text-green-400",
            },
            {
              label: "Converted",
              value: totalPartnerConversions,
              icon: Award,
              color: "text-purple-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-gold-700/20 rounded-xl p-4"
              data-ocid={`referrals.stat.${stat.label.toLowerCase().replace(/ /g, "_")}`}
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

        {/* Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(
            [
              { key: "partners", label: "Partners" },
              { key: "referrals", label: "All Referrals" },
              { key: "leaderboard", label: "Leaderboard" },
              { key: "calculator", label: "Commission Calc" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${tab === t.key ? "bg-gold-700/30 text-gold-300 border border-gold-700/40" : "text-muted-foreground hover:text-foreground"}`}
              data-ocid={`referrals.${t.key}_tab`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Partners Tab */}
        {tab === "partners" && (
          <>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search partners..."
                  value={partnerSearch}
                  onChange={(e) => setPartnerSearch(e.target.value)}
                  className="pl-8 bg-card border-gold-700/30 h-9 text-sm"
                  data-ocid="referrals.partner_search_input"
                />
              </div>
              <Button
                onClick={() => setShowAddModal(true)}
                className="gold-button gap-2"
                data-ocid="referrals.add_partner_button"
              >
                <Plus size={14} /> Add Partner
              </Button>
            </div>
            <div className="bg-card border border-gold-700/20 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table
                  className="w-full text-sm"
                  data-ocid="referrals.partners_table"
                >
                  <thead>
                    <tr className="border-b border-gold-700/20 bg-obsidian-800/40">
                      {[
                        "Name",
                        "Type",
                        "Referrals",
                        "Conversions",
                        "Rate",
                        "Total Earned",
                        "Status",
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
                    {filteredPartners.map((p, i) => (
                      <tr
                        key={p.id}
                        className="border-b border-gold-700/10 hover:bg-gold-700/5 transition-colors"
                        data-ocid={`referrals.partner.item.${i + 1}`}
                      >
                        <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                          {p.name}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className="border-gold-700/30 text-gold-400 text-xs"
                          >
                            {p.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-center">
                          {p.referrals}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-center">
                          {p.conversions}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-center">
                          {p.rate.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-gold-300">
                          \u20b9{p.earned.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={`text-xs ${
                              p.status === "Active"
                                ? "bg-green-900/30 text-green-400 border-green-700/30"
                                : "bg-red-900/30 text-red-400 border-red-700/30"
                            }`}
                          >
                            {p.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === "referrals" && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search referrer or referee..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 bg-card border-gold-700/30 h-9 text-sm"
                  data-ocid="referrals.search_input"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger
                  className="w-36 h-9 bg-card border-gold-700/30 text-sm"
                  data-ocid="referrals.status_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-700/30">
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterService} onValueChange={setFilterService}>
                <SelectTrigger
                  className="w-44 h-9 bg-card border-gold-700/30 text-sm"
                  data-ocid="referrals.service_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-700/30">
                  {SERVICES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="bg-card border border-gold-700/20 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-ocid="referrals.table">
                  <thead>
                    <tr className="border-b border-gold-700/20 bg-obsidian-800/40">
                      {[
                        "Referrer",
                        "Referee",
                        "Date",
                        "Service",
                        "Status",
                        "Commission",
                        "Notes",
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
                    {filtered.map((r, i) => (
                      <tr
                        key={r.id}
                        className="border-b border-gold-700/10 hover:bg-gold-700/5 transition-colors"
                        data-ocid={`referrals.item.${i + 1}`}
                      >
                        <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                          {r.referrer}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {r.referee}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {r.date}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className="border-gold-700/30 text-gold-400 text-xs whitespace-nowrap"
                          >
                            {r.service}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`text-xs ${statusColor(r.status)}`}>
                            {r.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-gold-300">
                          {r.commission > 0
                            ? `₹${r.commission.toLocaleString()}`
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs max-w-[180px] truncate">
                          {r.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Commission Calculator Tab */}
        {tab === "calculator" && (
          <div className="max-w-md">
            <div className="bg-card border border-gold-700/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Calculator size={18} className="text-gold-400" />
                <h2 className="font-serif text-lg font-semibold text-gold-300">
                  Commission Calculator
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-gold-300 text-xs mb-1 block">
                    Deal Value (\u20b9)
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g., 8500000"
                    value={calcDealValue}
                    onChange={(e) => setCalcDealValue(e.target.value)}
                    className="bg-obsidian-800/60 border-gold-700/30"
                    data-ocid="referrals.calc.deal_value_input"
                  />
                </div>
                <div>
                  <Label className="text-gold-300 text-xs mb-1 block">
                    Commission Rate
                  </Label>
                  <Select value={calcRate} onValueChange={setCalcRate}>
                    <SelectTrigger
                      className="bg-obsidian-800/60 border-gold-700/30"
                      data-ocid="referrals.calc.rate_select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-gold-700/30">
                      {COMMISSION_RATES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {commission !== null && (
                  <div
                    className="bg-obsidian-800/40 border border-gold-700/30 rounded-xl p-4 mt-2"
                    data-ocid="referrals.calc.result"
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      Calculated Commission
                    </p>
                    <p className="font-serif text-3xl font-bold text-gold-300">
                      \u20b9{commission.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {calcRate} of \u20b9
                      {Number.parseFloat(
                        calcDealValue.replace(/,/g, ""),
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
                {commission === null && calcDealValue && (
                  <p className="text-xs text-muted-foreground">
                    Enter a valid deal value to calculate.
                  </p>
                )}
              </div>
            </div>

            {/* Quick reference */}
            <div className="bg-card border border-gold-700/20 rounded-xl p-5 mt-4">
              <h3 className="font-serif text-sm font-semibold text-gold-300 mb-3">
                Commission Rate Reference
              </h3>
              <div className="space-y-2">
                {[
                  { type: "Property Purchase / Sale", rate: "2.0%" },
                  { type: "Commercial Rental", rate: "1.5 months rent" },
                  { type: "Finance / Loan Advisory", rate: "1.0% - 1.5%" },
                  { type: "RERA / Legal Consulting", rate: "Fixed Fee" },
                  { type: "Investment Advisory", rate: "2.0% - 2.5%" },
                  { type: "NRI Services", rate: "2.5%" },
                ].map((r) => (
                  <div
                    key={r.type}
                    className="flex justify-between text-xs py-1.5 border-b border-gold-700/10"
                  >
                    <span className="text-muted-foreground">{r.type}</span>
                    <span className="text-gold-300 font-medium">{r.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "leaderboard" && (
          <div className="bg-card border border-gold-700/20 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gold-700/20 bg-obsidian-800/40">
              <h2 className="font-serif text-sm font-semibold text-gold-300">
                Top Referrers Leaderboard
              </h2>
            </div>
            <div className="divide-y divide-gold-700/10">
              {TOP_REFERRERS.map((ref, i) => (
                <div
                  key={ref.name}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-gold-700/5 transition-colors"
                  data-ocid={`referrals.leaderboard.item.${i + 1}`}
                >
                  <span
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${i === 0 ? "bg-gold-500 text-obsidian-900" : i === 1 ? "bg-obsidian-500 text-foreground" : i === 2 ? "bg-amber-700 text-foreground" : "bg-obsidian-700/50 text-muted-foreground"}`}
                  >
                    {i < 3 ? <Award size={16} /> : i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      {ref.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ref.referrals} referrals · {ref.converted} converted
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gold-300 font-mono">
                      ₹{ref.earnings.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      total earnings
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Referral Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Referral"
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gold-300 text-xs mb-1 block">
                Referrer Name
              </Label>
              <Input
                placeholder="Who is referring"
                className="bg-obsidian-800/60 border-gold-700/30"
              />
            </div>
            <div>
              <Label className="text-gold-300 text-xs mb-1 block">
                Referee Name
              </Label>
              <Input
                placeholder="Who is being referred"
                className="bg-obsidian-800/60 border-gold-700/30"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gold-300 text-xs mb-1 block">
                Service
              </Label>
              <Select>
                <SelectTrigger className="bg-obsidian-800/60 border-gold-700/30">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-700/30">
                  {SERVICES.slice(1).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gold-300 text-xs mb-1 block">
                Commission (₹)
              </Label>
              <Input
                type="number"
                placeholder="0"
                className="bg-obsidian-800/60 border-gold-700/30"
              />
            </div>
          </div>
          <div>
            <Label className="text-gold-300 text-xs mb-1 block">Notes</Label>
            <Textarea
              placeholder="Deal details, property info..."
              className="bg-obsidian-800/60 border-gold-700/30"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              className="border-gold-700/30"
              onClick={() => setShowAddModal(false)}
              data-ocid="referrals.add_modal.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="gold-button"
              data-ocid="referrals.add_modal.submit_button"
            >
              Add Referral
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
