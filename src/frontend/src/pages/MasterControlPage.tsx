import { createActor } from "@/backend";
import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  BarChart3,
  Brain,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Crown,
  FileText,
  Gavel,
  Globe,
  Home,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Search,
  Shield,
  ShieldCheck,
  Star,
  Target,
  Users,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import OwnerControlCenter from "../components/security/OwnerControlCenter";

const feedItems = [
  {
    id: 1,
    ai: "GateKeeper AI",
    action: "blocked 3 suspicious login attempts",
    time: "2m ago",
    type: "security",
  },
  {
    id: 2,
    ai: "Content AI",
    action: "published Ahmedabad market update article",
    time: "5m ago",
    type: "content",
  },
  {
    id: 3,
    ai: "Lead AI",
    action: "routed 2 new leads to Property division",
    time: "7m ago",
    type: "property",
  },
  {
    id: 4,
    ai: "Valuation AI",
    action: "updated price estimates for 14 listings",
    time: "9m ago",
    type: "property",
  },
  {
    id: 5,
    ai: "Policy Writer AI",
    action: "updated Privacy Policy for PDPB v2.1 compliance",
    time: "12m ago",
    type: "legal",
  },
  {
    id: 6,
    ai: "Bot Hunter AI",
    action: "blocked 47 automated scraping requests",
    time: "15m ago",
    type: "security",
  },
  {
    id: 7,
    ai: "SEO AI",
    action: "optimized meta tags for 8 service pages",
    time: "18m ago",
    type: "content",
  },
  {
    id: 8,
    ai: "Audit Trail AI",
    action: "compiled daily security report",
    time: "22m ago",
    type: "security",
  },
  {
    id: 9,
    ai: "RERA Counsel AI",
    action: "flagged 1 RERA deadline in 8 days",
    time: "25m ago",
    type: "legal",
  },
  {
    id: 10,
    ai: "Analytics AI",
    action: "generated weekly performance dashboard",
    time: "31m ago",
    type: "content",
  },
  {
    id: 11,
    ai: "DDoS Shield AI",
    action: "absorbed burst traffic spike (240 req/s)",
    time: "38m ago",
    type: "security",
  },
  {
    id: 12,
    ai: "Follow-Up AI",
    action: "sent 6 automated follow-ups to warm leads",
    time: "44m ago",
    type: "property",
  },
  {
    id: 13,
    ai: "Tax AI",
    action: "updated stamp duty rates for Q2 2026",
    time: "51m ago",
    type: "finance",
  },
  {
    id: 14,
    ai: "Anomaly Detection AI",
    action: "resolved 1 data integrity flag automatically",
    time: "58m ago",
    type: "security",
  },
  {
    id: 15,
    ai: "Campaign AI",
    action: "scheduled WhatsApp broadcast for 847 leads",
    time: "1h ago",
    type: "content",
  },
];

const decisionQueue = [
  {
    id: 1,
    ai: "Builder AI",
    action: "Add EMI pre-approval widget to Finance page",
    reason:
      "23% of users drop off at the EMI calculator. A pre-approval widget increases conversions by est. 18%.",
    priority: "medium",
  },
  {
    id: 2,
    ai: "Campaign AI",
    action:
      "Send WhatsApp broadcast to 847 leads about new SG Highway listings",
    reason:
      "New listings added in a high-demand corridor. Targeting leads who enquired about SG Highway in last 90 days.",
    priority: "high",
  },
  {
    id: 3,
    ai: "Policy Writer AI",
    action: "Publish updated Privacy Policy (PDPB v2.1 compliant)",
    reason:
      "New data protection bill compliance deadline. Minor updates to consent language and data retention clauses.",
    priority: "high",
  },
  {
    id: 4,
    ai: "Feature Suggestion AI",
    action: "Add Virtual Site Visit request button to all property listings",
    reason:
      "Competitor analysis shows 34% more enquiries with virtual visit options. Low build effort, high impact.",
    priority: "low",
  },
];

const gmTeam = [
  {
    name: "Rajan AI",
    division: "Property",
    status: "Active",
    task: "Monitoring 127 listings for price changes",
    score: 97,
  },
  {
    name: "Kaveri AI",
    division: "Content",
    status: "Active",
    task: "Drafting area guide for Bopal locality",
    score: 94,
  },
  {
    name: "Sameer AI",
    division: "Finance",
    status: "Active",
    task: "Updating home loan rate comparisons",
    score: 96,
  },
  {
    name: "Priya AI",
    division: "Legal",
    status: "Active",
    task: "Reviewing 3 pending contract drafts",
    score: 98,
  },
  {
    name: "Dev AI",
    division: "Technology",
    status: "Active",
    task: "Monitoring platform health & API uptime",
    score: 99,
  },
  {
    name: "Anita AI",
    division: "Client Relations",
    status: "Processing",
    task: "Scoring 12 new leads from portal",
    score: 95,
  },
  {
    name: "Vikram AI",
    division: "Security",
    status: "Active",
    task: "Running penetration scan — all clear",
    score: 100,
  },
  {
    name: "Maya AI",
    division: "Data",
    status: "Active",
    task: "Reconciling property database (847 records)",
    score: 96,
  },
  {
    name: "Arjun AI",
    division: "People",
    status: "Resting",
    task: "Off-hours — resumes at 07:00 IST",
    score: 93,
  },
  {
    name: "Neha AI",
    division: "Services",
    status: "Active",
    task: "Updating hospitality package pricing",
    score: 94,
  },
];

const staffList = [
  {
    name: "Love Parekh",
    role: "Owner",
    apps: "All Apps",
    lastActive: "Now",
    status: "Active",
  },
  {
    name: "Aria (Chief AI)",
    role: "Chief AI",
    apps: "All Apps",
    lastActive: "Now",
    status: "Active",
  },
  {
    name: "Rajan AI",
    role: "GM",
    apps: "/properties, /crm, /leads",
    lastActive: "2m ago",
    status: "Active",
  },
  {
    name: "Priya AI",
    role: "Staff",
    apps: "/legal-command, /legal",
    lastActive: "5m ago",
    status: "Active",
  },
  {
    name: "Security Team AI",
    role: "Agent",
    apps: "/security",
    lastActive: "1m ago",
    status: "Active",
  },
  {
    name: "Sunita Patel",
    role: "Staff",
    apps: "CRM, Appointments",
    lastActive: "1h ago",
    status: "Active",
  },
  {
    name: "Amit Shah",
    role: "Agent",
    apps: "Properties, Leads",
    lastActive: "3h ago",
    status: "Active",
  },
  {
    name: "Karan Desai",
    role: "Viewer",
    apps: "Analytics, Briefing",
    lastActive: "1d ago",
    status: "Inactive",
  },
];

const goals = [
  {
    label: "Lead Conversion Rate",
    current: 12.4,
    target: 18,
    unit: "%",
    desc: "Q2 2026 Target",
  },
  {
    label: "Quarterly Revenue",
    current: 42,
    target: 75,
    unit: "L",
    desc: "April–June 2026",
  },
  {
    label: "Property Listings",
    current: 127,
    target: 200,
    unit: "",
    desc: "Active listings on portal",
  },
  {
    label: "Client NPS Score",
    current: 72,
    target: 85,
    unit: "",
    desc: "Net Promoter Score",
  },
];

const STATS = [
  { label: "Active Users", value: "12", icon: Users, color: "text-blue-400" },
  {
    label: "AI Agents Running",
    value: "2,047",
    icon: Brain,
    color: "text-purple-400",
  },
  {
    label: "Apps Running",
    value: "50",
    icon: LayoutGrid,
    color: "text-primary",
  },
  {
    label: "Security Score",
    value: "98/100",
    icon: ShieldCheck,
    color: "text-green-400",
  },
  {
    label: "Legal Health",
    value: "96/100",
    icon: FileText,
    color: "text-yellow-400",
  },
  {
    label: "Active Alerts",
    value: "0",
    icon: AlertTriangle,
    color: "text-green-400",
  },
];

const ALL_APPS = [
  { name: "App Launcher", path: "/apps", icon: LayoutGrid },
  { name: "Command Center", path: "/command", icon: Zap },
  { name: "Executive Briefing", path: "/briefing", icon: Star },
  { name: "AI Universe", path: "/ai", icon: Brain },
  { name: "Staff Directory", path: "/staff", icon: Users },
  { name: "Security", path: "/security", icon: ShieldCheck },
  { name: "Legalities", path: "/legal-command", icon: FileText },
  { name: "Observer", path: "/observe", icon: Globe },
  { name: "CRM", path: "/crm", icon: Users },
  { name: "Property Manager", path: "/properties", icon: Globe },
  { name: "Property Intel", path: "/intelligence", icon: Target },
  { name: "Redevelopment", path: "/redevelopment", icon: Activity },
  { name: "RERA Hub", path: "/rera", icon: CheckCircle2 },
  { name: "Rental Manager", path: "/rentals", icon: Globe },
  { name: "Commercial Desk", path: "/commercial", icon: BarChart2 },
  { name: "Finance Desk", path: "/finance-desk", icon: BarChart2 },
  { name: "Legal Vault", path: "/legal", icon: FileText },
  { name: "Tax & Compliance", path: "/tax", icon: CheckCircle2 },
  { name: "Billing", path: "/billing", icon: Star },
  { name: "Document Center", path: "/documents", icon: FileText },
  { name: "Content Studio", path: "/studio", icon: MessageSquare },
  { name: "Media Library", path: "/media", icon: Globe },
  { name: "SEO Manager", path: "/seo", icon: Search },
  { name: "Campaign Studio", path: "/campaigns", icon: Zap },
  { name: "WhatsApp Manager", path: "/whatsapp", icon: MessageSquare },
  { name: "Notification Center", path: "/notifications", icon: AlertTriangle },
  { name: "Review Manager", path: "/reviews", icon: Star },
  { name: "Referral Tracker", path: "/referrals", icon: Target },
  { name: "Client Portal", path: "/clients", icon: Users },
  { name: "Proposal Generator", path: "/proposals", icon: FileText },
  { name: "Appointment Scheduler", path: "/appointments", icon: Calendar },
  { name: "Event Manager", path: "/events", icon: Calendar },
  { name: "Hospitality Hub", path: "/hospitality", icon: Star },
  { name: "Calendar", path: "/calendar", icon: Calendar },
  { name: "NGO Hub", path: "/ngo", icon: Globe },
  { name: "CSR Dashboard", path: "/csr", icon: CheckCircle2 },
  { name: "Sports Desk", path: "/sports", icon: Target },
  { name: "Music & Culture", path: "/music", icon: Star },
  { name: "Tourism Planner", path: "/tourism", icon: Globe },
  { name: "Analytics Center", path: "/analytics", icon: BarChart2 },
  { name: "Market Intelligence", path: "/market", icon: Brain },
  { name: "Competitive Intel", path: "/competitors", icon: Target },
  { name: "Platform Health", path: "/health", icon: Activity },
  { name: "Deployment Manager", path: "/deployments", icon: Zap },
  { name: "API Manager", path: "/api", icon: Globe },
  { name: "Website Builder", path: "/builder", icon: LayoutGrid },
  { name: "Announcement Mgr", path: "/announcements", icon: MessageSquare },
  { name: "App Download Ctr", path: "/apps/download", icon: Star },
  { name: "Settings", path: "/settings", icon: ShieldCheck },
  { name: "Help & Tutorials", path: "/help", icon: CheckCircle2 },
];

const filterTypes = [
  "All",
  "Security",
  "Property",
  "Legal",
  "Content",
  "Finance",
] as const;
type FilterType = (typeof filterTypes)[number];

const typeColors: Record<string, string> = {
  security: "text-red-400",
  property: "text-blue-400",
  legal: "text-purple-400",
  content: "text-green-400",
  finance: "text-yellow-400",
};

const statusColors: Record<string, string> = {
  Active: "bg-green-500/20 text-green-400 border-green-500/30",
  Processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Resting: "bg-muted/40 text-muted-foreground border-border/40",
};

const sidebarItems = [
  { icon: BarChart2, label: "Overview" },
  { icon: LayoutGrid, label: "All Apps" },
  { icon: Zap, label: "Universe Feed" },
  { icon: MessageSquare, label: "Decision Queue" },
  { icon: Users, label: "AI Status" },
  { icon: ShieldCheck, label: "Access Manager" },
  { icon: Globe, label: "Observer Codes" },
  { icon: Target, label: "Goal Dashboard" },
  { icon: AlertTriangle, label: "Anomaly Center" },
  { icon: FileText, label: "Audit Log" },
  { icon: ShieldCheck, label: "Security Control Center" },
];

const auditLog = [
  {
    user: "Love Parekh",
    action: "Approved Campaign AI broadcast to 847 leads",
    time: "Today 09:14",
    device: "iPhone 15 Pro",
  },
  {
    user: "Aria AI",
    action: "Deployed property valuation model v2.4",
    time: "Today 08:52",
    device: "System",
  },
  {
    user: "GateKeeper AI",
    action: "Blocked IP 185.220.101.x — repeated probe attempts",
    time: "Today 08:30",
    device: "System",
  },
  {
    user: "Rajan Mehta",
    action: "Added 4 new listings in SG Highway corridor",
    time: "Today 07:48",
    device: "MacBook Pro",
  },
  {
    user: "Priya AI",
    action: "Updated Privacy Policy draft for PDPB v2.1",
    time: "Today 07:15",
    device: "System",
  },
  {
    user: "Love Parekh",
    action: "Logged in from new device",
    time: "Today 06:58",
    device: "iPad Air",
  },
  {
    user: "Aria AI",
    action: "Generated Monday Executive Briefing",
    time: "Today 06:30",
    device: "System",
  },
  {
    user: "Vikram AI",
    action: "Completed weekly vulnerability scan — 0 issues",
    time: "Yesterday 23:00",
    device: "System",
  },
  {
    user: "Campaign AI",
    action: "Sent WhatsApp broadcast: SG Highway — 847 recipients",
    time: "Yesterday 18:45",
    device: "System",
  },
  {
    user: "Sunita Patel",
    action: "Created appointment: Sharma family site visit",
    time: "Yesterday 16:22",
    device: "Chrome/Windows",
  },
  {
    user: "Bot Hunter AI",
    action: "Blocked 203 fake lead submissions",
    time: "Yesterday 15:10",
    device: "System",
  },
  {
    user: "Sameer AI",
    action: "Updated home loan rates — HDFC base rate change",
    time: "Yesterday 14:30",
    device: "System",
  },
  {
    user: "Rajan Mehta",
    action: "Edited listing price for Unit 4B, Shwet Shikhar",
    time: "Yesterday 13:05",
    device: "Chrome/Android",
  },
  {
    user: "Audit Trail AI",
    action: "Daily compliance audit complete — all clear",
    time: "Yesterday 12:00",
    device: "System",
  },
  {
    user: "Content AI",
    action: "Published Ahmedabad property market weekly wrap",
    time: "Yesterday 11:40",
    device: "System",
  },
  {
    user: "Love Parekh",
    action: "Rejected Feature AI proposal: chatbot auto-escalation",
    time: "Yesterday 10:55",
    device: "iPhone 15 Pro",
  },
  {
    user: "SEO AI",
    action: "Optimized 8 service pages — avg rank 14→9",
    time: "Yesterday 10:22",
    device: "System",
  },
  {
    user: "Pooja Joshi",
    action: "Uploaded 12 photos to Media Library",
    time: "Yesterday 09:45",
    device: "Chrome/Windows",
  },
  {
    user: "Analytics AI",
    action: "Weekly performance report dispatched to briefing",
    time: "Yesterday 09:00",
    device: "System",
  },
  {
    user: "Aria AI",
    action: "Auto-approved 23 low-priority AI decisions",
    time: "Yesterday 08:30",
    device: "System",
  },
];

const observerCodes = [
  {
    code: "MSTC-OBS-2847",
    purpose: "CA / Accountant Review",
    expires: "7 days",
    lastUsed: "2h ago",
    status: "Active",
  },
  {
    code: "MSTC-OBS-3901",
    purpose: "Business Partner — Patel Group",
    expires: "Permanent",
    lastUsed: "Never",
    status: "Active",
  },
  {
    code: "MSTC-OBS-4412",
    purpose: "Investor Review",
    expires: "Expired",
    lastUsed: "3d ago",
    status: "Expired",
  },
];

type ObsExpiry = "1 hour" | "1 day" | "1 week" | "Permanent";
type ObsAccess = "Full View" | "Property Only" | "Finance Only" | "Custom";

interface AddPersonForm {
  name: string;
  role: string;
  apps: string;
}

function MasterControlInner() {
  const [activeSection, setActiveSection] = useState("Overview");
  const [feedFilter, setFeedFilter] = useState<FilterType>("All");
  const [decisions, setDecisions] = useState(decisionQueue);
  const [obsCode, setObsCode] = useState("");
  const [obsExpiry, setObsExpiry] = useState<ObsExpiry>("1 day");
  const [obsAccess, setObsAccess] = useState<ObsAccess>("Full View");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [command, setCommand] = useState("");
  const feedRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { actor } = useActor(createActor);
  const [_realStaff, setRealStaff] = useState<Record<string, unknown>[]>([]);
  const [_realAuditLog, setRealAuditLog] = useState<Record<string, unknown>[]>(
    [],
  );

  useEffect(() => {
    if (!actor) return;
    actor
      .getAllStaff()
      .then((s: unknown) => setRealStaff(s as Record<string, unknown>[]))
      .catch(console.error);
    actor
      .getAuditLog(50n, 0n)
      .then((a: unknown) => setRealAuditLog(a as Record<string, unknown>[]))
      .catch(console.error);
  }, [actor]);

  const [staffData, setStaffData] = useState(staffList);
  const [addPersonOpen, setAddPersonOpen] = useState(false);
  const [addForm, setAddForm] = useState<AddPersonForm>({
    name: "",
    role: "Staff",
    apps: "",
  });

  const filteredFeed =
    feedFilter === "All"
      ? feedItems
      : feedItems.filter((i) => i.type === feedFilter.toLowerCase());

  const handleApprove = (id: number) =>
    setDecisions((d) => d.filter((i) => i.id !== id));
  const handleReject = (id: number) =>
    setDecisions((d) => d.filter((i) => i.id !== id));

  const generateObsCode = () => {
    const code = `MSTC-OBS-${Math.floor(1000 + Math.random() * 9000)}`;
    setObsCode(code);
    toast.success(`Observer code generated: ${code}`);
  };

  const copyObsCode = () => {
    if (!obsCode) return;
    navigator.clipboard.writeText(obsCode).then(() => {
      toast.success("Observer code copied to clipboard!");
    });
  };

  const handleAddPerson = () => {
    if (!addForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setStaffData((prev) => [
      ...prev,
      {
        name: addForm.name.trim(),
        role: addForm.role,
        apps: addForm.apps.trim() || "Assigned Apps",
        lastActive: "Never",
        status: "Active",
      },
    ]);
    setAddPersonOpen(false);
    setAddForm({ name: "", role: "Staff", apps: "" });
    toast.success(
      `${addForm.name} has been added with ${addForm.role} access.`,
    );
  };

  const handleRevokePerson = (name: string) => {
    setStaffData((prev) => prev.filter((s) => s.name !== name));
    if (actor) actor.forceLogoutStaff(name).catch(console.error);
    toast.success(`Access revoked for ${name}.`);
  };

  return (
    <div
      className="flex min-h-screen bg-background"
      data-ocid="master.page"
      style={{ background: "#06090f" }}
    >
      {/* Mobile overlay backdrop — only renders on small screens when sidebar is open */}
      {sidebarOpen && (
        <div
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
          className="fixed inset-0 bg-black/70 z-[200] md:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
        />
      )}

      {/* Mobile slide-in sidebar panel (small screens only) */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#0e1623] border-r border-primary/20 z-[201] flex flex-col transition-transform duration-300 md:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-primary/20">
          <Crown className="w-6 h-6 text-primary shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-serif text-sm font-bold text-primary truncate">
              MASTER CONTROL
            </p>
            <p className="font-sans text-[10px] text-muted-foreground truncate">
              Command Throne
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-primary/10 transition-colors"
            aria-label="Close sidebar"
            data-ocid="master.sidebar.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setActiveSection(item.label);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm transition-all duration-200 cursor-pointer text-left w-full
                ${
                  activeSection === item.label
                    ? "bg-primary/15 text-primary border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                }`}
              data-ocid={`master.sidebar.${item.label.toLowerCase().replace(/ /g, "_")}`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {item.label === "Decision Queue" && decisions.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                  {decisions.length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-primary/20">
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("mstc_internal_auth");
              window.location.reload();
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-red-400 font-sans text-xs transition-colors w-full"
            data-ocid="master.logout_button.mobile"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Desktop push-layout sidebar — always visible, shifts content right */}
      <aside className="hidden md:flex flex-col flex-shrink-0 w-64 h-screen sticky top-0 bg-[#0e1623] border-r border-primary/20 overflow-y-auto">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-primary/20">
          <Crown className="w-6 h-6 text-primary shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-serif text-sm font-bold text-primary truncate">
              MASTER CONTROL
            </p>
            <p className="font-sans text-[10px] text-muted-foreground truncate">
              Command Throne
            </p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveSection(item.label)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm transition-all duration-200 cursor-pointer text-left w-full
                ${
                  activeSection === item.label
                    ? "bg-primary/15 text-primary border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                }`}
              data-ocid={`master.sidebar.${item.label.toLowerCase().replace(/ /g, "_")}`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {item.label === "Decision Queue" && decisions.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                  {decisions.length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-primary/20">
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("mstc_internal_auth");
              window.location.reload();
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-red-400 font-sans text-xs transition-colors w-full"
            data-ocid="master.logout_button"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content — always starts after the desktop sidebar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-card/95 backdrop-blur border-b border-primary/20 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-muted-foreground hover:text-primary p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
              aria-label="Open sidebar"
              data-ocid="master.sidebar.open_button"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <a href="/" className="hidden sm:flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              <span className="font-serif text-sm font-bold text-primary">
                MSTC GLOBAL
              </span>
            </a>
            <div className="flex-1 relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Search or type a command for any app..."
                className="w-full bg-background border border-border/40 rounded-xl pl-9 pr-4 py-2.5 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                data-ocid="master.command_input"
              />
            </div>
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/30 font-sans text-xs text-green-400">
              <Activity className="w-3 h-3" />
              All Systems Active
            </span>
          </div>
        </header>

        <main
          className="flex-1 overflow-y-auto p-4 md:p-6"
          data-ocid="master.main.panel"
        >
          {/* Overview */}
          {activeSection === "Overview" && (
            <div data-ocid="master.overview.section">
              <div className="flex items-center gap-3 mb-6">
                <a
                  href="/"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 font-sans text-xs transition-colors"
                  data-ocid="master.back_link"
                >
                  ← Back
                </a>
                <h2 className="font-serif text-2xl font-bold text-primary">
                  Master Control
                </h2>
              </div>
              <div className="flex gap-2 flex-wrap mb-6 mt-4">
                <a
                  href="/apps"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/50 bg-primary/15 text-primary hover:bg-primary/25 transition-colors text-sm font-semibold shadow-sm"
                  data-ocid="master.overview.all_apps_button"
                >
                  <LayoutGrid className="w-4 h-4" /> Launch All Apps
                </a>
                <a
                  href="/security"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gold/40 bg-obsidian-800 text-gold hover:bg-gold/10 transition-colors text-sm font-medium"
                >
                  <span>🛡️</span> Security
                </a>
                <a
                  href="/legal-command"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gold/40 bg-obsidian-800 text-gold hover:bg-gold/10 transition-colors text-sm font-medium"
                >
                  <span>⚖️</span> Legal
                </a>
                <a
                  href="/analytics"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gold/40 bg-obsidian-800 text-gold hover:bg-gold/10 transition-colors text-sm font-medium"
                >
                  <span>📊</span> Analytics
                </a>
                <a
                  href="/crm"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gold/40 bg-obsidian-800 text-gold hover:bg-gold/10 transition-colors text-sm font-medium"
                >
                  <span>👥</span> CRM
                </a>
                <a
                  href="/properties"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gold/40 bg-obsidian-800 text-gold hover:bg-gold/10 transition-colors text-sm font-medium"
                >
                  <span>🏠</span> Properties
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
                {STATS.map((s, idx) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-primary/20 bg-card/60 px-4 py-4 flex flex-col gap-1"
                    data-ocid={`master.stat.item.${idx + 1}`}
                  >
                    <s.icon className={`w-5 h-5 ${s.color} mb-1`} />
                    <p className={`font-serif text-xl font-bold ${s.color}`}>
                      {s.value}
                    </p>
                    <p className="font-sans text-[11px] text-muted-foreground leading-tight">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {[
                  {
                    label: "All Apps Launcher",
                    desc: "Access all 50 internal apps",
                    section: "All Apps",
                  },
                  {
                    label: "Decision Queue",
                    desc: `${decisions.length} pending AI decisions`,
                    section: "Decision Queue",
                  },
                  {
                    label: "Audit Log",
                    desc: "20+ recent system actions",
                    section: "Audit Log",
                  },
                ].map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => setActiveSection(q.section)}
                    className="flex items-center justify-between rounded-xl border border-primary/20 bg-card/60 px-4 py-4 hover:bg-primary/10 hover:border-primary/40 transition-all text-left"
                    data-ocid={`master.quicknav.${q.section.toLowerCase().replace(/ /g, "_")}`}
                  >
                    <div>
                      <p className="font-sans text-sm font-semibold text-foreground">
                        {q.label}
                      </p>
                      <p className="font-sans text-xs text-muted-foreground mt-0.5">
                        {q.desc}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                  </button>
                ))}
              </div>
              <h3 className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Live Universe Feed (Preview)
              </h3>
              <div className="rounded-xl border border-primary/20 bg-card/60 overflow-hidden">
                <div className="divide-y divide-border/20">
                  {feedItems.slice(0, 6).map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 px-4 py-3"
                      data-ocid={`master.preview.item.${idx + 1}`}
                    >
                      <Zap
                        className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${typeColors[item.type] || "text-muted-foreground"}`}
                      />
                      <p className="flex-1 font-sans text-sm text-foreground min-w-0">
                        <span
                          className={`font-semibold ${typeColors[item.type]}`}
                        >
                          [{item.ai}]
                        </span>{" "}
                        {item.action}
                      </p>
                      <span className="font-sans text-xs text-muted-foreground shrink-0">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection("Universe Feed")}
                  className="w-full text-center py-3 font-sans text-xs text-primary hover:bg-primary/5 transition-colors border-t border-primary/10"
                  data-ocid="master.preview.view_all_button"
                >
                  View full feed →
                </button>
              </div>
            </div>
          )}

          {/* All Apps Launcher */}
          {activeSection === "All Apps" && (
            <div data-ocid="master.apps.section">
              <h2 className="font-serif text-xl font-bold text-primary mb-2">
                All Apps
              </h2>
              <p className="font-sans text-sm text-muted-foreground mb-5">
                50 internal apps — click any tile to open
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {ALL_APPS.map((app, idx) => (
                  <a
                    key={app.path}
                    href={app.path}
                    className="flex flex-col items-center gap-2 rounded-xl border border-primary/20 bg-card/60 px-3 py-4 hover:bg-primary/10 hover:border-primary/40 transition-all group text-center"
                    data-ocid={`master.apps.item.${idx + 1}`}
                  >
                    <app.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="font-sans text-[11px] text-foreground leading-tight">
                      {app.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Universe Feed */}
          {activeSection === "Universe Feed" && (
            <div data-ocid="master.universe_feed.section">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="font-serif text-xl font-bold text-primary">
                  Live Universe Feed
                </h2>
                <div className="flex gap-1.5 flex-wrap">
                  {filterTypes.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFeedFilter(f)}
                      className={`px-2.5 py-1 rounded-lg font-sans text-xs font-medium border transition-all
                        ${feedFilter === f ? "bg-primary/20 text-primary border-primary/40" : "bg-card border-border/40 text-muted-foreground hover:text-foreground"}`}
                      data-ocid={`master.feed.filter.${f.toLowerCase()}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div
                ref={feedRef}
                className="rounded-xl border border-primary/20 bg-card/60 overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="divide-y divide-border/20">
                  {filteredFeed.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-primary/5 transition-colors"
                      data-ocid={`master.feed.item.${idx + 1}`}
                    >
                      <Zap
                        className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${typeColors[item.type] || "text-muted-foreground"}`}
                      />
                      <p className="flex-1 font-sans text-sm text-foreground min-w-0">
                        <span
                          className={`font-semibold ${typeColors[item.type]}`}
                        >
                          [{item.ai}]
                        </span>{" "}
                        {item.action}
                      </p>
                      <span className="font-sans text-xs text-muted-foreground shrink-0">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
                {isPaused && (
                  <div className="text-center py-1.5 bg-primary/5 border-t border-primary/20">
                    <span className="font-sans text-xs text-muted-foreground">
                      Feed paused — move cursor away to resume
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Decision Queue */}
          {activeSection === "Decision Queue" && (
            <div data-ocid="master.decisions.section">
              <h2 className="font-serif text-xl font-bold text-primary mb-4">
                Decision Queue
              </h2>
              {decisions.length === 0 ? (
                <div
                  className="rounded-xl border border-green-500/30 bg-green-500/5 p-8 text-center"
                  data-ocid="master.decisions.empty_state"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
                  <p className="font-serif text-lg text-green-400">All clear</p>
                  <p className="font-sans text-sm text-muted-foreground mt-1">
                    No pending decisions. All AI actions were auto-approved.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {decisions.map((item, idx) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-primary/20 bg-card/60 p-5"
                      data-ocid={`master.decisions.item.${idx + 1}`}
                    >
                      <div className="flex items-start gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-sans text-xs font-semibold text-primary">
                              {item.ai}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${item.priority === "high" ? "border-red-500/40 text-red-400" : item.priority === "medium" ? "border-yellow-500/40 text-yellow-400" : "border-border/40 text-muted-foreground"}`}
                            >
                              {item.priority}
                            </Badge>
                          </div>
                          <p className="font-sans text-sm font-medium text-foreground">
                            {item.action}
                          </p>
                        </div>
                      </div>
                      <p className="font-sans text-xs text-muted-foreground leading-relaxed mb-4">
                        {item.reason}
                      </p>
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(item.id)}
                          className="bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 font-sans text-xs"
                          data-ocid={`master.decisions.approve_button.${idx + 1}`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(item.id)}
                          className="border-red-500/40 text-red-400 hover:bg-red-500/10 font-sans text-xs"
                          data-ocid={`master.decisions.reject_button.${idx + 1}`}
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AI Status */}
          {activeSection === "AI Status" && (
            <div data-ocid="master.ai_status.section">
              <h2 className="font-serif text-xl font-bold text-primary mb-4">
                AI Status Board
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {gmTeam.map((gm, idx) => (
                  <div
                    key={gm.name}
                    className="rounded-xl border border-primary/20 bg-card/60 p-4 flex flex-col gap-2"
                    data-ocid={`master.ai_status.item.${idx + 1}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-semibold text-primary">
                        {gm.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${statusColors[gm.status]}`}
                      >
                        {gm.status}
                      </Badge>
                    </div>
                    <span className="font-sans text-[11px] text-muted-foreground uppercase tracking-wide">
                      {gm.division}
                    </span>
                    <p className="font-sans text-xs text-foreground/80 leading-relaxed flex-1">
                      {gm.task}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-border/30 rounded-full h-1.5">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${gm.score}%` }}
                        />
                      </div>
                      <span className="font-sans text-[10px] text-primary font-semibold">
                        {gm.score}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Access Manager */}
          {activeSection === "Access Manager" && (
            <div data-ocid="master.access.section">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="font-serif text-xl font-bold text-primary">
                  Access Manager
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveSection("Observer Codes")}
                    className="border-primary/40 text-primary hover:bg-primary/10 font-sans text-xs"
                    data-ocid="master.access.generate_obs_button"
                  >
                    <Globe className="w-3.5 h-3.5 mr-1" /> Observer Codes
                  </Button>
                  <Dialog open={addPersonOpen} onOpenChange={setAddPersonOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 font-sans text-xs"
                        data-ocid="master.access.add_person_button"
                      >
                        <Users className="w-3.5 h-3.5 mr-1" /> + Add Person
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-primary/30 text-foreground max-w-sm w-full">
                      <DialogHeader>
                        <DialogTitle className="font-serif text-primary">
                          Add Authorized Person
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-4 mt-2">
                        <div className="flex flex-col gap-1.5">
                          <Label className="font-sans text-xs text-muted-foreground">
                            Full Name
                          </Label>
                          <Input
                            placeholder="e.g. Kavita Sharma"
                            value={addForm.name}
                            onChange={(e) =>
                              setAddForm((f) => ({
                                ...f,
                                name: e.target.value,
                              }))
                            }
                            className="bg-background border-border/40 font-sans text-sm"
                            data-ocid="master.add_person.name_input"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label className="font-sans text-xs text-muted-foreground">
                            Role
                          </Label>
                          <Select
                            value={addForm.role}
                            onValueChange={(v) =>
                              setAddForm((f) => ({ ...f, role: v }))
                            }
                          >
                            <SelectTrigger
                              className="bg-background border-border/40 font-sans text-sm"
                              data-ocid="master.add_person.role_select"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-primary/20">
                              {[
                                "Owner",
                                "Chief AI",
                                "GM",
                                "Staff",
                                "Agent",
                                "Viewer",
                                "Temporary",
                              ].map((r) => (
                                <SelectItem
                                  key={r}
                                  value={r}
                                  className="font-sans text-sm"
                                >
                                  {r}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label className="font-sans text-xs text-muted-foreground">
                            Apps Access (comma-separated paths or names)
                          </Label>
                          <Input
                            placeholder="e.g. /crm, /properties"
                            value={addForm.apps}
                            onChange={(e) =>
                              setAddForm((f) => ({
                                ...f,
                                apps: e.target.value,
                              }))
                            }
                            className="bg-background border-border/40 font-sans text-sm"
                            data-ocid="master.add_person.apps_input"
                          />
                        </div>
                        <div className="flex gap-2 justify-end mt-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setAddPersonOpen(false)}
                            className="border-border/40 text-muted-foreground font-sans text-xs"
                            data-ocid="master.add_person.cancel_button"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleAddPerson}
                            className="bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 font-sans text-xs"
                            data-ocid="master.add_person.confirm_button"
                          >
                            <Check className="w-3.5 h-3.5 mr-1" /> Add Person
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="rounded-xl border border-primary/20 bg-card/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-primary/20 bg-primary/5">
                        {[
                          "Name",
                          "Role",
                          "Apps Access",
                          "Last Active",
                          "Status",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3 text-left"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {staffData.map((s, idx) => (
                        <tr
                          key={`${s.name}-${idx}`}
                          className="border-b border-border/20 hover:bg-primary/5"
                          data-ocid={`master.access.item.${idx + 1}`}
                        >
                          <td className="px-4 py-3 font-sans text-sm text-foreground font-medium">
                            {s.name}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${s.role === "Owner" ? "border-primary/40 text-primary" : s.role === "Chief AI" ? "border-purple-500/40 text-purple-400" : s.role === "GM" ? "border-blue-500/40 text-blue-400" : "border-border/40 text-muted-foreground"}`}
                            >
                              {s.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 font-sans text-xs text-muted-foreground max-w-[160px] truncate">
                            {s.apps}
                          </td>
                          <td className="px-4 py-3 font-sans text-xs text-muted-foreground">
                            {s.lastActive}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`font-sans text-xs px-2 py-0.5 rounded-full ${s.status === "Active" ? "bg-green-500/15 text-green-400" : "bg-muted/40 text-muted-foreground"}`}
                            >
                              {s.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  toast.info(
                                    `Edit access for ${s.name} coming soon.`,
                                  )
                                }
                                className="font-sans text-xs text-primary hover:underline"
                                data-ocid={`master.access.edit_button.${idx + 1}`}
                              >
                                Edit
                              </button>
                              {s.role !== "Owner" && (
                                <button
                                  type="button"
                                  onClick={() => handleRevokePerson(s.name)}
                                  className="font-sans text-xs text-red-400 hover:underline"
                                  data-ocid={`master.access.revoke_button.${idx + 1}`}
                                >
                                  Revoke
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Observer Codes */}
          {activeSection === "Observer Codes" && (
            <div data-ocid="master.observer.section">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="font-serif text-xl font-bold text-primary">
                  Observer Code Manager
                </h2>
              </div>

              {/* Generate Code Panel */}
              <div className="rounded-xl border border-primary/20 bg-card/60 p-5 mb-5">
                <p className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                  Generate New Observer Code
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-1.5">
                    <Label className="font-sans text-xs text-muted-foreground">
                      Expiry
                    </Label>
                    <Select
                      value={obsExpiry}
                      onValueChange={(v) => setObsExpiry(v as ObsExpiry)}
                    >
                      <SelectTrigger
                        className="bg-background border-border/40 font-sans text-sm"
                        data-ocid="master.observer.expiry_select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-primary/20">
                        {(
                          [
                            "1 hour",
                            "1 day",
                            "1 week",
                            "Permanent",
                          ] as ObsExpiry[]
                        ).map((e) => (
                          <SelectItem
                            key={e}
                            value={e}
                            className="font-sans text-sm"
                          >
                            {e}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="font-sans text-xs text-muted-foreground">
                      Access Level
                    </Label>
                    <Select
                      value={obsAccess}
                      onValueChange={(v) => setObsAccess(v as ObsAccess)}
                    >
                      <SelectTrigger
                        className="bg-background border-border/40 font-sans text-sm"
                        data-ocid="master.observer.access_select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-primary/20">
                        {(
                          [
                            "Full View",
                            "Property Only",
                            "Finance Only",
                            "Custom",
                          ] as ObsAccess[]
                        ).map((a) => (
                          <SelectItem
                            key={a}
                            value={a}
                            className="font-sans text-sm"
                          >
                            {a}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={generateObsCode}
                  className="bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 font-sans text-xs w-full sm:w-auto"
                  data-ocid="master.observer.generate_button"
                >
                  <Globe className="w-3.5 h-3.5 mr-1.5" /> Generate Observer
                  Code
                </Button>

                {obsCode && (
                  <div
                    className="rounded-xl border border-primary/30 bg-primary/10 px-5 py-4 mt-4 flex items-center justify-between gap-4"
                    data-ocid="master.observer.new_code_display"
                  >
                    <div className="min-w-0">
                      <p className="font-sans text-xs text-muted-foreground">
                        Observer Code — {obsAccess} · {obsExpiry}
                      </p>
                      <p className="font-mono text-xl font-bold text-primary mt-1 tracking-wider">
                        {obsCode}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={copyObsCode}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/10 font-sans text-xs text-primary hover:bg-primary/20 transition-colors shrink-0"
                      data-ocid="master.observer.copy_button"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </button>
                  </div>
                )}
              </div>
              <div className="rounded-xl border border-primary/20 bg-card/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="border-b border-primary/20 bg-primary/5">
                        {[
                          "Code",
                          "Purpose",
                          "Expires",
                          "Last Used",
                          "Status",
                          "Action",
                        ].map((h) => (
                          <th
                            key={h}
                            className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3 text-left"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {observerCodes.map((c, idx) => (
                        <tr
                          key={c.code}
                          className="border-b border-border/20 hover:bg-primary/5"
                          data-ocid={`master.observer.item.${idx + 1}`}
                        >
                          <td className="px-4 py-3 font-mono text-sm text-primary font-semibold">
                            {c.code}
                          </td>
                          <td className="px-4 py-3 font-sans text-xs text-foreground">
                            {c.purpose}
                          </td>
                          <td className="px-4 py-3 font-sans text-xs text-muted-foreground">
                            {c.expires}
                          </td>
                          <td className="px-4 py-3 font-sans text-xs text-muted-foreground">
                            {c.lastUsed}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`font-sans text-xs px-2 py-0.5 rounded-full ${c.status === "Active" ? "bg-green-500/15 text-green-400" : "bg-muted/40 text-muted-foreground"}`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {c.status === "Active" && (
                              <button
                                type="button"
                                className="font-sans text-xs text-red-400 hover:underline"
                                data-ocid={`master.observer.revoke_button.${idx + 1}`}
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Goal Dashboard */}
          {activeSection === "Goal Dashboard" && (
            <div data-ocid="master.goals.section">
              <h2 className="font-serif text-xl font-bold text-primary mb-4">
                Goal Dashboard
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goals.map((g, idx) => (
                  <div
                    key={g.label}
                    className="rounded-xl border border-primary/20 bg-card/60 p-5"
                    data-ocid={`master.goals.item.${idx + 1}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-serif text-sm font-semibold text-foreground">
                          {g.label}
                        </p>
                        <p className="font-sans text-xs text-muted-foreground mt-0.5">
                          {g.desc}
                        </p>
                      </div>
                      <span className="font-serif text-xl font-bold text-primary">
                        {g.current}
                        {g.unit}
                        <span className="text-muted-foreground text-sm">
                          /{g.target}
                          {g.unit}
                        </span>
                      </span>
                    </div>
                    <div className="bg-border/30 rounded-full h-2">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (g.current / g.target) * 100).toFixed(1)}%`,
                        }}
                      />
                    </div>
                    <p className="font-sans text-xs text-muted-foreground mt-2">
                      {((g.current / g.target) * 100).toFixed(1)}% of target
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Anomaly Center */}
          {activeSection === "Anomaly Center" && (
            <div data-ocid="master.anomaly.section">
              <h2 className="font-serif text-xl font-bold text-primary mb-4">
                Anomaly Center
              </h2>
              <div
                className="rounded-xl border border-green-500/30 bg-green-500/5 p-8 text-center mb-6"
                data-ocid="master.anomaly.empty_state"
              >
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="font-serif text-xl text-green-400">
                  0 anomalies detected
                </p>
                <p className="font-sans text-sm text-muted-foreground mt-2">
                  All systems operating within normal parameters.
                </p>
              </div>
              <h3 className="font-sans text-sm font-semibold text-muted-foreground mb-3">
                Recently Resolved
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  {
                    event:
                      "Data integrity flag in property price field resolved by Data Integrity AI",
                    time: "2h ago",
                  },
                  {
                    event:
                      "Unusual login pattern from new device — verified as Love Parekh's new mobile",
                    time: "1d ago",
                  },
                  {
                    event:
                      "API rate limit spike from NoBroker integration — throttling applied automatically",
                    time: "3d ago",
                  },
                ].map((a, idx) => (
                  <div
                    key={`anomaly-${a.time}-${idx}`}
                    className="flex items-start gap-3 rounded-xl border border-border/30 bg-card/40 px-4 py-3"
                    data-ocid={`master.anomaly.resolved.${idx + 1}`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <p className="flex-1 font-sans text-sm text-foreground min-w-0">
                      {a.event}
                    </p>
                    <span className="font-sans text-xs text-muted-foreground shrink-0">
                      {a.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Log */}
          {activeSection === "Audit Log" && (
            <div data-ocid="master.audit.section">
              <h2 className="font-serif text-xl font-bold text-primary mb-4">
                Audit Log
              </h2>
              <div className="rounded-xl border border-primary/20 bg-card/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px]">
                    <thead>
                      <tr className="border-b border-primary/20 bg-primary/5">
                        {["User / Agent", "Action", "Timestamp", "Device"].map(
                          (h) => (
                            <th
                              key={h}
                              className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3 text-left"
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {auditLog.map((log, idx) => (
                        <tr
                          key={`${log.user}-${idx}`}
                          className="border-b border-border/20 hover:bg-primary/5"
                          data-ocid={`master.audit.item.${idx + 1}`}
                        >
                          <td className="px-4 py-3 font-sans text-sm text-primary font-medium">
                            {log.user}
                          </td>
                          <td className="px-4 py-3 font-sans text-xs text-foreground">
                            {log.action}
                          </td>
                          <td className="px-4 py-3 font-sans text-xs text-muted-foreground whitespace-nowrap">
                            {log.time}
                          </td>
                          <td className="px-4 py-3 font-sans text-xs text-muted-foreground">
                            {log.device}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeSection === "Security Control Center" && (
            <div className="p-6">
              <OwnerControlCenter />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function MasterControlPage() {
  return (
    <SecureAppGate appName="Master Control">
      <MasterControlInner />
    </SecureAppGate>
  );
}
