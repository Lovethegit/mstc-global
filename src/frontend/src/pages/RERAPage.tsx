import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CheckCircle,
  ClipboardList,
  MapPin,
  Menu,
  Plus,
  RefreshCw,
  Search,
  Shield,
  TrendingUp,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

const PROJECTS = [
  {
    id: 1,
    reraNo: "PR/GJ/AHMEDABAD/AUDA/MAA08068/250625",
    name: "Shwet Shikhar Heights",
    builder: "MSTC GLOBAL Infra",
    type: "Residential",
    area: "12,400 sqm",
    units: 84,
    status: "Registered",
    expiry: "Jun 2028",
    comp: "Jun 2026",
  },
  {
    id: 2,
    reraNo: "PR/GJ/AHMEDABAD/AUDA/MAA06241/290524",
    name: "Prahlad Nagar Elara",
    builder: "Elara Developers",
    type: "Residential",
    area: "18,200 sqm",
    units: 120,
    status: "Registered",
    expiry: "May 2027",
    comp: "Mar 2027",
  },
  {
    id: 3,
    reraNo: "PR/GJ/AHMEDABAD/AUDA/MAA04891/120424",
    name: "SG Highway Trade Tower",
    builder: "TradeTower Realty",
    type: "Commercial",
    area: "9,600 sqm",
    units: 48,
    status: "Registered",
    expiry: "Apr 2027",
    comp: "Dec 2026",
  },
  {
    id: 4,
    reraNo: "PR/GJ/AHMEDABAD/AMC/MAA09123/150725",
    name: "Bodakdev Aria",
    builder: "Aria Constructions",
    type: "Residential",
    area: "22,100 sqm",
    units: 156,
    status: "Registered",
    expiry: "Jul 2028",
    comp: "Sep 2027",
  },
  {
    id: 5,
    reraNo: "PR/GJ/AHMEDABAD/AUDA/MAA05672/080325",
    name: "Navrangpura Biz Hub",
    builder: "Biz Hub Developers",
    type: "Commercial",
    area: "7,200 sqm",
    units: 36,
    status: "Compliance Pending",
    expiry: "Mar 2027",
    comp: "Jun 2026",
  },
  {
    id: 6,
    reraNo: "PR/GJ/AHMEDABAD/AUDA/MAA07845/200525",
    name: "Thaltej Premium Villas",
    builder: "MSTC GLOBAL Infra",
    type: "Residential",
    area: "15,400 sqm",
    units: 42,
    status: "Registered",
    expiry: "May 2028",
    comp: "Dec 2027",
  },
  {
    id: 7,
    reraNo: "PR/GJ/AHMEDABAD/AUDA/MAA03412/110124",
    name: "Satellite Grandeur",
    builder: "Grandeur Realty",
    type: "Residential",
    area: "11,800 sqm",
    units: 96,
    status: "Registered",
    expiry: "Jan 2027",
    comp: "Mar 2026",
  },
  {
    id: 8,
    reraNo: "PR/GJ/AHMEDABAD/AUDA/MAA05198/160425",
    name: "Bopal Meadows",
    builder: "Meadows Developers",
    type: "Residential",
    area: "28,600 sqm",
    units: 200,
    status: "Registered",
    expiry: "Apr 2028",
    comp: "Jun 2027",
  },
  {
    id: 9,
    reraNo: "PR/GJ/AHMEDABAD/AMC/MAA06834/250525",
    name: "Vastrapur Lakeside Apt",
    builder: "Lakeside Infra",
    type: "Residential",
    area: "16,900 sqm",
    units: 108,
    status: "Registered",
    expiry: "May 2027",
    comp: "Aug 2027",
  },
  {
    id: 10,
    reraNo: "PR/GJ/AHMEDABAD/AUDA/MAA08921/010625",
    name: "GIFT City Office Park",
    builder: "GIFT Development Corp",
    type: "Commercial",
    area: "41,200 sqm",
    units: 240,
    status: "Registered",
    expiry: "Jun 2029",
    comp: "Dec 2028",
  },
  {
    id: 11,
    reraNo: "PR/GJ/AHMEDABAD/AUDA/MAA02341/050923",
    name: "Chandkheda Galaxy",
    builder: "Galaxy Homes",
    type: "Residential",
    area: "20,400 sqm",
    units: 168,
    status: "Registered",
    expiry: "Sep 2026",
    comp: "Dec 2025",
  },
  {
    id: 12,
    reraNo: "PR/GJ/AHMEDABAD/AUDA/MAA04127/301024",
    name: "Gota Green Acres",
    builder: "Green Acres Realty",
    type: "Residential",
    area: "14,100 sqm",
    units: 112,
    status: "Compliance Pending",
    expiry: "Oct 2027",
    comp: "Mar 2027",
  },
  {
    id: 13,
    reraNo: "PR/GJ/AHMEDABAD/AMC/MAA07342/120325",
    name: "Motera Arena Heights",
    builder: "Arena Developers",
    type: "Residential",
    area: "9,200 sqm",
    units: 72,
    status: "Registered",
    expiry: "Mar 2028",
    comp: "Jun 2027",
  },
  {
    id: 14,
    reraNo: "PR/GJ/AHMEDABAD/AUDA/MAA01829/200823",
    name: "Naranpura Park View",
    builder: "Park View Infra",
    type: "Residential",
    area: "8,700 sqm",
    units: 60,
    status: "Compliance Pending",
    expiry: "Aug 2026",
    comp: "Sep 2025",
  },
  {
    id: 15,
    reraNo: "PR/GJ/AHMEDABAD/AUDA/MAA05923/250225",
    name: "Maninagar Residency",
    builder: "MSTC GLOBAL Infra",
    type: "Residential",
    area: "6,400 sqm",
    units: 48,
    status: "Registered",
    expiry: "Feb 2028",
    comp: "Jun 2026",
  },
];

const _CHECKLIST = [
  { item: "Project Registration Certificate", status: "Verified" },
  { item: "Land Title / Ownership Documents", status: "Verified" },
  { item: "Approved Building Plan", status: "Verified" },
  { item: "Environmental Clearance", status: "Pending" },
  { item: "Occupancy Certificate", status: "Pending" },
  { item: "Fire NOC", status: "Verified" },
  { item: "Water & Sewage Approval", status: "Verified" },
  { item: "Structural Stability Certificate", status: "Verified" },
  { item: "GST Registration", status: "Verified" },
  { item: "Bank Account for Project Funds (70%)", status: "Verified" },
];

const WATCHDOG_FLAGS = [
  {
    id: 1,
    project: "Naranpura Park View",
    issue: "Delayed completion 3+ months past scheduled date",
    severity: "High",
    flagged: "2025-05-10",
  },
  {
    id: 2,
    project: "Navrangpura Biz Hub",
    issue: "Quarterly compliance report overdue by 60 days",
    severity: "High",
    flagged: "2025-05-18",
  },
  {
    id: 3,
    project: "Gota Green Acres",
    issue: "2 consumer complaints filed — pending resolution",
    severity: "Medium",
    flagged: "2025-05-22",
  },
  {
    id: 4,
    project: "Chandkheda Galaxy",
    issue: "Financial escrow less than mandated 70%",
    severity: "Medium",
    flagged: "2025-05-14",
  },
  {
    id: 5,
    project: "Satellite Grandeur",
    issue: "Minor: Signboard display requirement not met",
    severity: "Low",
    flagged: "2025-05-28",
  },
];

const JANTRI_RATES = [
  {
    area: "Prahlad Nagar",
    residential: 32000,
    commercial: 48000,
    plotted: 24000,
    change: "+4.2%",
  },
  {
    area: "Bodakdev",
    residential: 30000,
    commercial: 45000,
    plotted: 22000,
    change: "+3.8%",
  },
  {
    area: "Satellite",
    residential: 28000,
    commercial: 42000,
    plotted: 20000,
    change: "+3.5%",
  },
  {
    area: "SG Highway",
    residential: 24000,
    commercial: 38000,
    plotted: 18000,
    change: "+2.9%",
  },
  {
    area: "Thaltej",
    residential: 22000,
    commercial: 35000,
    plotted: 16500,
    change: "+2.6%",
  },
  {
    area: "Vastrapur",
    residential: 20000,
    commercial: 32000,
    plotted: 15000,
    change: "+2.1%",
  },
  {
    area: "Navrangpura",
    residential: 26000,
    commercial: 40000,
    plotted: 19000,
    change: "+3.0%",
  },
  {
    area: "Bopal",
    residential: 15000,
    commercial: 24000,
    plotted: 11000,
    change: "+3.2%",
  },
  {
    area: "Chandkheda",
    residential: 12000,
    commercial: 18000,
    plotted: 9000,
    change: "+1.8%",
  },
  {
    area: "Motera",
    residential: 14000,
    commercial: 21000,
    plotted: 10500,
    change: "+1.5%",
  },
];

const BUILDERS = [
  {
    name: "MSTC GLOBAL Infra",
    reraProjects: 8,
    complaints: 0,
    delivered: 6,
    onTime: 6,
    score: 98,
    grade: "A+",
  },
  {
    name: "Elara Developers",
    reraProjects: 5,
    complaints: 1,
    delivered: 4,
    onTime: 4,
    score: 91,
    grade: "A",
  },
  {
    name: "Grandeur Realty",
    reraProjects: 6,
    complaints: 0,
    delivered: 5,
    onTime: 5,
    score: 95,
    grade: "A+",
  },
  {
    name: "GIFT Development Corp",
    reraProjects: 3,
    complaints: 0,
    delivered: 2,
    onTime: 2,
    score: 97,
    grade: "A+",
  },
  {
    name: "Arena Developers",
    reraProjects: 4,
    complaints: 1,
    delivered: 3,
    onTime: 2,
    score: 78,
    grade: "B",
  },
  {
    name: "Lakeside Infra",
    reraProjects: 3,
    complaints: 2,
    delivered: 2,
    onTime: 1,
    score: 64,
    grade: "C",
  },
  {
    name: "Meadows Developers",
    reraProjects: 5,
    complaints: 0,
    delivered: 4,
    onTime: 4,
    score: 93,
    grade: "A",
  },
  {
    name: "Aria Constructions",
    reraProjects: 4,
    complaints: 1,
    delivered: 3,
    onTime: 3,
    score: 82,
    grade: "B+",
  },
  {
    name: "Galaxy Homes",
    reraProjects: 7,
    complaints: 3,
    delivered: 5,
    onTime: 3,
    score: 58,
    grade: "C",
  },
  {
    name: "Green Acres Realty",
    reraProjects: 3,
    complaints: 2,
    delivered: 2,
    onTime: 1,
    score: 60,
    grade: "C",
  },
];

const INFRA_PROJECTS = [
  {
    name: "Metro Phase 2 — East–West Corridor",
    type: "Metro",
    affected: ["Bodakdev", "Satellite", "Thaltej", "SG Highway"],
    eta: "Dec 2027",
    impact: "+12–18% price uplift expected",
  },
  {
    name: "Ahmedabad Ring Road (BRTS Extension)",
    type: "Road",
    affected: ["Bopal", "Gota", "Chandkheda"],
    eta: "Mar 2027",
    impact: "+8–10% connectivity premium",
  },
  {
    name: "GIFT City Phase 3 Expansion",
    type: "Zone",
    affected: ["GIFT City", "Gandhinagar"],
    eta: "Jun 2026",
    impact: "+20–25% commercial demand surge",
  },
  {
    name: "Vastrapur Lake Rejuvenation",
    type: "Civic",
    affected: ["Vastrapur", "Prahlad Nagar"],
    eta: "Sep 2026",
    impact: "+5–8% residential premium",
  },
  {
    name: "SG Highway 8-Lane Widening",
    type: "Road",
    affected: ["SG Highway", "Bopal"],
    eta: "Aug 2026",
    impact: "+6–9% traffic decongestion uplift",
  },
  {
    name: "Sabarmati Riverfront North",
    type: "Civic",
    affected: ["Motera", "Chandkheda", "Gota"],
    eta: "Dec 2026",
    impact: "+10–15% waterfront premium",
  },
];

const NAV_ITEMS = [
  { id: "projects", label: "RERA Projects", icon: ClipboardList },
  { id: "watchdog", label: "Watchdog AI", icon: AlertCircle },
  { id: "jantri", label: "Jantri Rates", icon: BarChart3 },
  { id: "builders", label: "Builder Trust", icon: Shield },
  { id: "infra", label: "Infrastructure", icon: TrendingUp },
];

export default function RERAPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("projects");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    builder: "",
    reraNo: "",
    type: "Residential",
    units: "",
    locality: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const filtered = useMemo(() => {
    return PROJECTS.filter((p: (typeof PROJECTS)[number]) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.builder.toLowerCase().includes(search.toLowerCase()) ||
        p.reraNo.toLowerCase().includes(search.toLowerCase()) ||
        (p as (typeof PROJECTS)[number] & { locality: string }).locality
          ?.toLowerCase()
          .includes(search.toLowerCase());
      const matchType = filterType === "All" || p.type === filterType;
      const matchStatus = filterStatus === "All" || p.status === filterStatus;
      return matchSearch && matchType && matchStatus;
    });
  }, [search, filterType, filterStatus]);

  function handleAddSubmit() {
    if (!newProject.name || !newProject.builder) return;
    setSubmitted(true);
    setTimeout(() => {
      setShowAdd(false);
      setSubmitted(false);
      setNewProject({
        name: "",
        builder: "",
        reraNo: "",
        type: "Residential",
        units: "",
        locality: "",
      });
    }, 1500);
  }

  const SeverityBadge = ({ sev }: { sev: string }) => {
    const cls =
      sev === "High"
        ? "bg-red-900/20 text-red-300 border-red-800/30"
        : sev === "Medium"
          ? "bg-amber-900/20 text-amber-300 border-amber-800/30"
          : "bg-blue-900/20 text-blue-300 border-blue-800/30";
    return (
      <Badge variant="outline" className={`text-[10px] ${cls}`}>
        {sev}
      </Badge>
    );
  };

  const GradeBadge = ({ grade }: { grade: string }) => {
    const cls = grade.startsWith("A")
      ? "bg-green-900/20 text-green-300 border-green-800/30"
      : grade === "B+" || grade === "B"
        ? "bg-blue-900/20 text-blue-300 border-blue-800/30"
        : "bg-red-900/20 text-red-300 border-red-800/30";
    return (
      <Badge variant="outline" className={`text-xs font-bold ${cls}`}>
        {grade}
      </Badge>
    );
  };

  return (
    <SecureAppGate appName="RERA Compliance Hub">
      <div
        className="min-h-screen bg-[#06090f] text-gold-100"
        data-ocid="rera.page"
      >
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gold-800/30 bg-[#0a0e1a] sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gold-900/20 md:hidden"
            data-ocid="rera.menu_toggle"
          >
            <Menu className="w-5 h-5 text-gold-400" />
          </button>
          <Link
            to="/apps"
            className="flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-sm"
            data-ocid="rera.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Apps</span>
          </Link>
          <h1
            className="flex-1 text-lg font-bold text-gold-400"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            RERA Compliance Hub
          </h1>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-700/30 border border-gold-600/40 rounded-lg text-gold-300 text-xs hover:bg-gold-700/50 transition-colors"
            data-ocid="rera.add_button"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Project
          </button>
        </div>

        {/* PUSH LAYOUT — outer flex row */}
        <div className="flex" style={{ minHeight: "calc(100vh - 57px)" }}>
          {/* Mobile overlay */}
          {mobileOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
            />
          )}

          {/* Sidebar — desktop: flex sibling (push), mobile: fixed overlay */}
          <aside
            className={`
            hidden md:flex md:flex-col md:flex-shrink-0 md:w-52
            fixed inset-y-0 left-0 z-50 w-52 flex flex-col
            bg-[#0a0e1a] border-r border-gold-800/30
            transition-transform duration-200
            ${mobileOpen ? "!flex translate-x-0 fixed" : ""}
          `}
            style={{ top: mobileOpen ? 0 : 57 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gold-800/20">
              <span className="font-bold text-gold-400 text-sm">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="md:hidden p-1 hover:bg-gold-900/20 rounded"
                data-ocid="rera.close_sidebar"
              >
                <X className="w-4 h-4 text-gold-400" />
              </button>
            </div>
            <nav className="p-2 space-y-0.5 flex-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                    activeSection === item.id
                      ? "bg-gold-700/30 text-gold-300"
                      : "text-gold-500 hover:bg-gold-900/20 hover:text-gold-400"
                  }`}
                  data-ocid={`rera.nav.${item.id}`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="p-3 border-t border-gold-800/20">
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gold-600 hover:bg-gold-900/20 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Sync RERA Data
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 overflow-y-auto p-4">
            {activeSection === "projects" && (
              <div data-ocid="rera.projects_section">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold-600" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search projects, builder, RERA no..."
                      className="pl-8 h-8 text-xs bg-[#0a0e1a] border-gold-800/40"
                      data-ocid="rera.search_input"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="h-8 px-2 rounded-lg bg-[#0a0e1a] border border-gold-800/40 text-gold-400 text-xs"
                    data-ocid="rera.filter_type"
                  >
                    <option>All</option>
                    <option>Residential</option>
                    <option>Commercial</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="h-8 px-2 rounded-lg bg-[#0a0e1a] border border-gold-800/40 text-gold-400 text-xs"
                    data-ocid="rera.filter_status"
                  >
                    <option>All</option>
                    <option>Registered</option>
                    <option>Compliance Pending</option>
                  </select>
                </div>
                <p className="text-xs text-gold-700 mb-3">
                  {filtered.length} of {PROJECTS.length} projects shown
                </p>
                <div className="overflow-x-auto rounded-xl border border-gold-800/30">
                  <table className="w-full text-xs">
                    <thead className="bg-[#0a0e1a] border-b border-gold-800/30">
                      <tr>
                        {[
                          "RERA No",
                          "Project",
                          "Builder",
                          "Type",
                          "Units",
                          "Locality",
                          "Completion",
                          "Status",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-3 py-2.5 text-left font-medium text-gold-600 whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p, i) => (
                        <tr
                          key={p.id}
                          className="border-b border-gold-800/20 hover:bg-gold-900/10 transition-colors"
                          data-ocid={`rera.project.item.${i + 1}`}
                        >
                          <td className="px-3 py-2.5 font-mono text-gold-600 text-[10px] whitespace-nowrap">
                            {p.reraNo.split("/").slice(-2).join("/")}
                          </td>
                          <td className="px-3 py-2.5 font-medium text-foreground">
                            {p.name}
                          </td>
                          <td className="px-3 py-2.5 text-muted-foreground">
                            {p.builder}
                          </td>
                          <td className="px-3 py-2.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${p.type === "Commercial" ? "bg-blue-900/20 text-blue-300 border-blue-800/30" : "bg-purple-900/20 text-purple-300 border-purple-800/30"}`}
                            >
                              {p.type}
                            </Badge>
                          </td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">
                            {p.units}
                          </td>
                          <td className="px-3 py-2.5 text-muted-foreground">
                            {(
                              p as (typeof PROJECTS)[number] & {
                                locality?: string;
                              }
                            ).locality ?? "—"}
                          </td>
                          <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                            {p.comp}
                          </td>
                          <td className="px-3 py-2.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${p.status === "Registered" ? "bg-green-900/20 text-green-300 border-green-800/30" : "bg-amber-900/20 text-amber-300 border-amber-800/30"}`}
                            >
                              {p.status === "Registered" ? (
                                <CheckCircle className="inline w-2.5 h-2.5 mr-0.5" />
                              ) : (
                                <AlertCircle className="inline w-2.5 h-2.5 mr-0.5" />
                              )}
                              {p.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeSection === "watchdog" && (
              <div data-ocid="rera.watchdog_section">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <h2 className="font-serif font-bold text-lg text-foreground">
                    RERA Watchdog AI
                  </h2>
                  <Badge
                    variant="outline"
                    className="bg-red-900/20 text-red-300 border-red-800/30 text-xs ml-auto"
                  >
                    {WATCHDOG_FLAGS.filter((f) => f.severity === "High").length}{" "}
                    High Priority
                  </Badge>
                </div>
                <div className="space-y-3">
                  {WATCHDOG_FLAGS.map((flag, i) => (
                    <div
                      key={flag.id}
                      className="rounded-xl border border-gold-800/30 bg-[#0a0e1a] p-4"
                      data-ocid={`rera.flag.item.${i + 1}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm">
                            {flag.project}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {flag.issue}
                          </p>
                          <p className="text-[10px] text-gold-700 mt-1">
                            Flagged: {flag.flagged}
                          </p>
                        </div>
                        <SeverityBadge sev={flag.severity} />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 border-gold-700/40 text-gold-400"
                          type="button"
                        >
                          Send Notice
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 border-gold-700/40 text-gold-400"
                          type="button"
                        >
                          Mark Reviewed
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "jantri" && (
              <div data-ocid="rera.jantri_section">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-gold-400" />
                  <h2 className="font-serif font-bold text-lg text-foreground">
                    Jantri Rates — Ahmedabad
                  </h2>
                  <span className="text-xs text-gold-600 ml-auto">
                    FY 2025–26
                  </span>
                </div>
                <div className="overflow-x-auto rounded-xl border border-gold-800/30">
                  <table className="w-full text-xs">
                    <thead className="bg-[#0a0e1a] border-b border-gold-800/30">
                      <tr>
                        {[
                          "Area",
                          "Residential (₹/sqm)",
                          "Commercial (₹/sqm)",
                          "Plotted (₹/sqm)",
                          "YoY Change",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-3 py-2.5 text-left font-medium text-gold-600 whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {JANTRI_RATES.map((r, i) => (
                        <tr
                          key={r.area}
                          className="border-b border-gold-800/20 hover:bg-gold-900/10"
                          data-ocid={`rera.jantri.item.${i + 1}`}
                        >
                          <td className="px-3 py-2.5 font-medium text-foreground">
                            {r.area}
                          </td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">
                            ₹{r.residential.toLocaleString()}
                          </td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">
                            ₹{r.commercial.toLocaleString()}
                          </td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">
                            ₹{r.plotted.toLocaleString()}
                          </td>
                          <td className="px-3 py-2.5 text-right text-green-400 font-medium">
                            {r.change}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeSection === "builders" && (
              <div data-ocid="rera.builders_section">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-gold-400" />
                  <h2 className="font-serif font-bold text-lg text-foreground">
                    Builder Trust Scores
                  </h2>
                </div>
                <div className="grid gap-3">
                  {BUILDERS.map((b, i) => (
                    <div
                      key={b.name}
                      className="rounded-xl border border-gold-800/30 bg-[#0a0e1a] p-4"
                      data-ocid={`rera.builder.item.${i + 1}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">
                            {b.name}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span>Projects: {b.reraProjects}</span>
                            <span>
                              Complaints:{" "}
                              <span
                                className={
                                  b.complaints > 1
                                    ? "text-red-400"
                                    : "text-muted-foreground"
                                }
                              >
                                {b.complaints}
                              </span>
                            </span>
                            <span>
                              On-time: {b.onTime}/{b.delivered}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xl font-bold text-gold-400">
                              {b.score}
                            </p>
                            <p className="text-[10px] text-gold-700">
                              Trust Score
                            </p>
                          </div>
                          <GradeBadge grade={b.grade} />
                        </div>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-gold-900/30 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold-700 to-gold-400 transition-all"
                          style={{ width: `${b.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "infra" && (
              <div data-ocid="rera.infra_section">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-gold-400" />
                  <h2 className="font-serif font-bold text-lg text-foreground">
                    Infrastructure Impact Tracker
                  </h2>
                </div>
                <div className="grid gap-3">
                  {INFRA_PROJECTS.map((proj, i) => (
                    <div
                      key={proj.name}
                      className="rounded-xl border border-gold-800/30 bg-[#0a0e1a] p-4"
                      data-ocid={`rera.infra.item.${i + 1}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-blue-900/20 text-blue-300 border-blue-800/30"
                            >
                              {proj.type}
                            </Badge>
                            <span className="text-xs text-gold-600">
                              ETA: {proj.eta}
                            </span>
                          </div>
                          <p className="font-medium text-foreground text-sm">
                            {proj.name}
                          </p>
                          <p className="text-xs text-green-400 mt-1">
                            {proj.impact}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {proj.affected.map((area) => (
                              <span
                                key={area}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-gold-900/20 text-gold-500 border border-gold-800/20"
                              >
                                <MapPin className="inline w-2.5 h-2.5 mr-0.5" />
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Add Project Modal */}
        {showAdd && (
          <div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            data-ocid="rera.add_project.dialog"
          >
            <div className="bg-[#0a0e1a] border border-gold-700/40 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-bold text-foreground">
                  Add RERA Project
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  data-ocid="rera.add_project.close_button"
                >
                  <X className="w-4 h-4 text-gold-400" />
                </button>
              </div>
              {submitted ? (
                <div
                  className="text-center py-6"
                  data-ocid="rera.add_project.success_state"
                >
                  <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
                  <p className="text-green-300">Project added successfully!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(
                    [
                      {
                        label: "Project Name",
                        key: "name" as const,
                        placeholder: "e.g. Bopal Heights",
                      },
                      {
                        label: "Builder",
                        key: "builder" as const,
                        placeholder: "Builder name",
                      },
                      {
                        label: "RERA No",
                        key: "reraNo" as const,
                        placeholder: "PR/GJ/...",
                      },
                      {
                        label: "Units",
                        key: "units" as const,
                        placeholder: "Number of units",
                      },
                      {
                        label: "Locality",
                        key: "locality" as const,
                        placeholder: "e.g. Bopal",
                      },
                    ] as const
                  ).map((f) => (
                    <div key={f.key}>
                      <label className="text-xs text-gold-600 mb-1 block">
                        {f.label}
                      </label>
                      <Input
                        value={newProject[f.key]}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            [f.key]: e.target.value,
                          })
                        }
                        placeholder={f.placeholder}
                        className="h-8 text-xs bg-[#06090f] border-gold-800/40"
                        data-ocid={`rera.add_project.${f.key}_input`}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs text-gold-600 mb-1 block">
                      Type
                    </label>
                    <select
                      value={newProject.type}
                      onChange={(e) =>
                        setNewProject({ ...newProject, type: e.target.value })
                      }
                      className="w-full h-8 px-2 rounded-lg bg-[#06090f] border border-gold-800/40 text-gold-400 text-xs"
                      data-ocid="rera.add_project.type_select"
                    >
                      <option>Residential</option>
                      <option>Commercial</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gold-700/40 text-gold-400"
                      onClick={() => setShowAdd(false)}
                      type="button"
                      data-ocid="rera.add_project.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gold-700 hover:bg-gold-600 text-black"
                      onClick={handleAddSubmit}
                      type="button"
                      data-ocid="rera.add_project.submit_button"
                    >
                      Add Project
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SecureAppGate>
  );
}
