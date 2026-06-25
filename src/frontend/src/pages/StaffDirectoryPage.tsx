import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  Brain,
  CheckCircle2,
  Clock,
  Key,
  MessageCircle,
  Monitor,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type StaffStatus = "ACTIVE" | "STANDBY" | "PROCESSING";
type DeptFilter =
  | "All"
  | "Command"
  | "Property"
  | "Security"
  | "Legal"
  | "CRM"
  | "Finance"
  | "Content"
  | "Technology"
  | "HR"
  | "Events"
  | "NGO";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: DeptFilter;
  type: string;
  status: StaffStatus;
  performance: number;
  tasksToday: number;
  lastActive: string;
  initials: string;
}

// ─── Seed Data (490+ persona pool) ────────────────────────────────────────────────

const STAFF: StaffMember[] = [
  {
    id: "s1",
    name: "Aria Verma",
    role: "Chief AI Officer",
    department: "Command",
    type: "Chief AI",
    status: "ACTIVE",
    performance: 99,
    tasksToday: 312,
    lastActive: "Just now",
    initials: "AV",
  },
  {
    id: "s2",
    name: "Rajan Mehta AI",
    role: "Property GM",
    department: "Property",
    type: "GM AI",
    status: "ACTIVE",
    performance: 97,
    tasksToday: 48,
    lastActive: "Just now",
    initials: "RM",
  },
  {
    id: "s3",
    name: "Priya Shah AI",
    role: "Legal Head",
    department: "Legal",
    type: "Dept Head AI",
    status: "ACTIVE",
    performance: 98,
    tasksToday: 24,
    lastActive: "1m ago",
    initials: "PS",
  },
  {
    id: "s4",
    name: "Amit Patel AI",
    role: "Security Chief",
    department: "Security",
    type: "GM AI",
    status: "ACTIVE",
    performance: 99,
    tasksToday: 203,
    lastActive: "Just now",
    initials: "AP",
  },
  {
    id: "s5",
    name: "Kavita Desai AI",
    role: "CRM Director",
    department: "CRM",
    type: "Dept Head AI",
    status: "ACTIVE",
    performance: 96,
    tasksToday: 52,
    lastActive: "2m ago",
    initials: "KD",
  },
  {
    id: "s6",
    name: "Vijay Kumar AI",
    role: "Finance GM",
    department: "Finance",
    type: "GM AI",
    status: "ACTIVE",
    performance: 95,
    tasksToday: 18,
    lastActive: "1m ago",
    initials: "VK",
  },
  {
    id: "s7",
    name: "Sunita Joshi AI",
    role: "Content Director",
    department: "Content",
    type: "GM AI",
    status: "ACTIVE",
    performance: 93,
    tasksToday: 28,
    lastActive: "3m ago",
    initials: "SJ",
  },
  {
    id: "s8",
    name: "Dhruv Bhatt AI",
    role: "Technology GM",
    department: "Technology",
    type: "GM AI",
    status: "ACTIVE",
    performance: 99,
    tasksToday: 12,
    lastActive: "Just now",
    initials: "DB",
  },
  {
    id: "s9",
    name: "Meera Nair AI",
    role: "Client Relations GM",
    department: "CRM",
    type: "GM AI",
    status: "ACTIVE",
    performance: 92,
    tasksToday: 22,
    lastActive: "2m ago",
    initials: "MN",
  },
  {
    id: "s10",
    name: "Sanjay Gupta AI",
    role: "Data & Analytics GM",
    department: "Command",
    type: "GM AI",
    status: "ACTIVE",
    performance: 97,
    tasksToday: 8,
    lastActive: "5m ago",
    initials: "SG",
  },
  {
    id: "s11",
    name: "Neha Sharma AI",
    role: "Marketing Director",
    department: "Content",
    type: "Dept Head AI",
    status: "ACTIVE",
    performance: 94,
    tasksToday: 15,
    lastActive: "4m ago",
    initials: "NS",
  },
  {
    id: "s12",
    name: "Rohan Trivedi AI",
    role: "Events Director",
    department: "Events",
    type: "Dept Head AI",
    status: "ACTIVE",
    performance: 94,
    tasksToday: 84,
    lastActive: "1m ago",
    initials: "RT",
  },
  {
    id: "s13",
    name: "Anita Rao AI",
    role: "NGO Head",
    department: "NGO",
    type: "Dept Head AI",
    status: "ACTIVE",
    performance: 95,
    tasksToday: 14,
    lastActive: "6m ago",
    initials: "AR",
  },
  {
    id: "s14",
    name: "Kiran Malhotra AI",
    role: "HR Director",
    department: "HR",
    type: "GM AI",
    status: "ACTIVE",
    performance: 90,
    tasksToday: 9,
    lastActive: "8m ago",
    initials: "KM",
  },
  {
    id: "s15",
    name: "Deepak Singh AI",
    role: "Operations Director",
    department: "Command",
    type: "Dept Head AI",
    status: "ACTIVE",
    performance: 91,
    tasksToday: 11,
    lastActive: "3m ago",
    initials: "DS",
  },
  {
    id: "s16",
    name: "Pooja Iyer AI",
    role: "RERA Compliance Head",
    department: "Legal",
    type: "Specialist AI",
    status: "ACTIVE",
    performance: 97,
    tasksToday: 7,
    lastActive: "2m ago",
    initials: "PI",
  },
  {
    id: "s17",
    name: "Arjun Tiwari AI",
    role: "Listing Intelligence AI",
    department: "Property",
    type: "Specialist AI",
    status: "ACTIVE",
    performance: 95,
    tasksToday: 38,
    lastActive: "Just now",
    initials: "AT",
  },
  {
    id: "s18",
    name: "Rekha Pandey AI",
    role: "Client Happiness AI",
    department: "CRM",
    type: "Specialist AI",
    status: "ACTIVE",
    performance: 92,
    tasksToday: 22,
    lastActive: "5m ago",
    initials: "RP",
  },
  {
    id: "s19",
    name: "Sachin More AI",
    role: "Tax Compliance AI",
    department: "Finance",
    type: "Specialist AI",
    status: "PROCESSING",
    performance: 96,
    tasksToday: 22,
    lastActive: "Just now",
    initials: "SM",
  },
  {
    id: "s20",
    name: "Lalita Bose AI",
    role: "Content SEO AI",
    department: "Content",
    type: "Specialist AI",
    status: "ACTIVE",
    performance: 92,
    tasksToday: 12,
    lastActive: "7m ago",
    initials: "LB",
  },
  {
    id: "s21",
    name: "Manish Kaur AI",
    role: "Platform Health AI",
    department: "Technology",
    type: "Specialist AI",
    status: "ACTIVE",
    performance: 99,
    tasksToday: 6,
    lastActive: "Just now",
    initials: "MK",
  },
  {
    id: "s22",
    name: "Geeta Pillai AI",
    role: "Valuation Analyst AI",
    department: "Property",
    type: "Specialist AI",
    status: "ACTIVE",
    performance: 97,
    tasksToday: 15,
    lastActive: "3m ago",
    initials: "GP",
  },
  {
    id: "s23",
    name: "Nikhil Reddy AI",
    role: "Investment Portfolio AI",
    department: "Finance",
    type: "Specialist AI",
    status: "PROCESSING",
    performance: 95,
    tasksToday: 8,
    lastActive: "Just now",
    initials: "NR",
  },
  {
    id: "s24",
    name: "Swati Kulkarni AI",
    role: "Contract Drafter AI",
    department: "Legal",
    type: "Specialist AI",
    status: "ACTIVE",
    performance: 98,
    tasksToday: 5,
    lastActive: "4m ago",
    initials: "SK",
  },
  {
    id: "s25",
    name: "Tarun Bhardwaj AI",
    role: "Market Intel AI",
    department: "Command",
    type: "Specialist AI",
    status: "ACTIVE",
    performance: 94,
    tasksToday: 4,
    lastActive: "10m ago",
    initials: "TB",
  },
  {
    id: "s26",
    name: "Divya Menon AI",
    role: "Social Media AI",
    department: "Content",
    type: "Specialist AI",
    status: "ACTIVE",
    performance: 91,
    tasksToday: 19,
    lastActive: "6m ago",
    initials: "DM",
  },
  {
    id: "s27",
    name: "Harish Jain AI",
    role: "Incident Response AI",
    department: "Security",
    type: "Specialist AI",
    status: "ACTIVE",
    performance: 99,
    tasksToday: 1247,
    lastActive: "Just now",
    initials: "HJ",
  },
  {
    id: "s28",
    name: "Nandita Verma AI",
    role: "Training Director AI",
    department: "HR",
    type: "Specialist AI",
    status: "ACTIVE",
    performance: 88,
    tasksToday: 5,
    lastActive: "15m ago",
    initials: "NV",
  },
  {
    id: "s29",
    name: "Prakash Agarwal AI",
    role: "Hospitality Events AI",
    department: "Events",
    type: "Specialist AI",
    status: "ACTIVE",
    performance: 93,
    tasksToday: 12,
    lastActive: "5m ago",
    initials: "PA",
  },
  {
    id: "s30",
    name: "Monika Sinha AI",
    role: "CSR Impact AI",
    department: "NGO",
    type: "Specialist AI",
    status: "STANDBY",
    performance: 91,
    tasksToday: 3,
    lastActive: "20m ago",
    initials: "MS",
  },
  {
    id: "s31",
    name: "Rajesh Nambiar AI",
    role: "API Guardian AI",
    department: "Technology",
    type: "Specialist AI",
    status: "ACTIVE",
    performance: 98,
    tasksToday: 22,
    lastActive: "Just now",
    initials: "RN",
  },
  {
    id: "s32",
    name: "Laxmi Choudhary AI",
    role: "Lead Scoring AI",
    department: "CRM",
    type: "Specialist AI",
    status: "ACTIVE",
    performance: 95,
    tasksToday: 35,
    lastActive: "2m ago",
    initials: "LC",
  },
  {
    id: "s33",
    name: "Vivek Sridharan AI",
    role: "Revenue Forecasting AI",
    department: "Finance",
    type: "Specialist AI",
    status: "ACTIVE",
    performance: 96,
    tasksToday: 7,
    lastActive: "8m ago",
    initials: "VS",
  },
  {
    id: "s34",
    name: "Archana Dubey AI",
    role: "Policy Writer AI",
    department: "Legal",
    type: "Specialist AI",
    status: "ACTIVE",
    performance: 97,
    tasksToday: 9,
    lastActive: "1m ago",
    initials: "AD",
  },
  {
    id: "s35",
    name: "Parag Saxena AI",
    role: "Blog Writer AI",
    department: "Content",
    type: "Specialist AI",
    status: "ACTIVE",
    performance: 90,
    tasksToday: 7,
    lastActive: "12m ago",
    initials: "PX",
  },
];

const DEPT_FILTERS: DeptFilter[] = [
  "All",
  "Command",
  "Property",
  "Security",
  "Legal",
  "CRM",
  "Finance",
  "Content",
  "Technology",
  "HR",
  "Events",
  "NGO",
];

// ─── Staff Card Component ────────────────────────────────────────────────────────

function StaffCard({ member }: { member: StaffMember }) {
  const statusConfig = {
    ACTIVE: {
      dot: "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]",
      badge: "bg-green-500/15 text-green-400 border-green-500/30",
    },
    STANDBY: {
      dot: "bg-muted-foreground",
      badge: "bg-muted/60 text-muted-foreground border-border",
    },
    PROCESSING: {
      dot: "bg-yellow-400 animate-pulse shadow-[0_0_6px_rgba(250,204,21,0.8)]",
      badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    },
  };
  const sc = statusConfig[member.status];

  return (
    <div
      className="bg-card border border-gold-800/30 rounded-xl p-4 flex flex-col gap-3 hover:border-gold-500/40 transition-all duration-300"
      data-ocid={`staff.card.${member.id}`}
    >
      {/* Avatar + Name */}
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-600 to-gold-800 flex items-center justify-center font-serif font-bold text-sm text-background">
            {member.initials}
          </div>
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${sc.dot}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-sans font-semibold text-sm text-foreground truncate">
            {member.name}
          </h3>
          <p className="font-sans text-xs text-muted-foreground truncate">
            {member.role}
          </p>
        </div>
        <span
          className={`text-[9px] font-bold font-sans px-1.5 py-0.5 rounded-full border flex-shrink-0 ${sc.badge}`}
        >
          {member.status}
        </span>
      </div>

      {/* Dept + Type badges */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Badge
          variant="outline"
          className="text-[9px] border-gold-700/40 text-gold-400 px-1.5 py-0"
        >
          {member.department}
        </Badge>
        <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
          {member.type}
        </Badge>
      </div>

      {/* Performance bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-sans text-muted-foreground">
            Performance
          </span>
          <span className="text-[10px] font-bold font-sans text-gold-400">
            {member.performance}%
          </span>
        </div>
        <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-500"
            style={{ width: `${member.performance}%` }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-[10px] font-sans">
        <span className="text-muted-foreground">
          <span className="text-foreground font-semibold">
            {member.tasksToday}
          </span>{" "}
          tasks today
        </span>
        <span className="text-muted-foreground">
          Active: {member.lastActive}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs border-gold-700/40 text-gold-400 hover:bg-gold-500/10"
          onClick={() =>
            toast.success(`Viewing ${member.name}'s profile`, {
              description: "Profile panel opening...",
            })
          }
          data-ocid={`staff.view_profile.${member.id}`}
        >
          <UserCheck className="w-3 h-3 mr-1" />
          Profile
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs border-gold-800/40 text-muted-foreground hover:text-foreground"
          onClick={() =>
            toast.info(`Message sent to ${member.name}`, {
              description: "Message queued in AI inbox.",
            })
          }
          data-ocid={`staff.message.${member.id}`}
        >
          <MessageCircle className="w-3 h-3 mr-1" />
          Message
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StaffDirectoryPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<DeptFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StaffStatus | "All">("All");

  const filtered = useMemo(() => {
    return STAFF.filter((m) => {
      const matchSearch =
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.role.toLowerCase().includes(search.toLowerCase()) ||
        m.department.toLowerCase().includes(search.toLowerCase()) ||
        m.type.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === "All" || m.department === deptFilter;
      const matchStatus = statusFilter === "All" || m.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [search, deptFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-background" data-ocid="staff.page">
      {/* Sticky Header */}
      <header className="bg-card border-b border-gold-800/30 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/apps" data-ocid="staff.nav.back_link">
              <Button
                variant="ghost"
                size="sm"
                className="p-1.5 h-auto flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-gold-400" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 min-w-0">
              <Users className="w-5 h-5 text-gold-400 flex-shrink-0" />
              <span className="font-serif font-bold text-lg text-foreground tracking-wide truncate">
                AI STAFF DIRECTORY
              </span>
            </div>
          </div>
          <Link
            to="/ai"
            data-ocid="staff.nav.universe_link"
            className="flex-shrink-0"
          >
            <Button
              variant="outline"
              size="sm"
              className="border-gold-700/40 text-gold-400 text-xs"
            >
              <Brain className="w-3.5 h-3.5 mr-1.5" />
              <span className="hidden sm:inline">Universe</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-card/60 border-b border-gold-800/20">
        <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Total Personas", value: "490+", color: "text-gold-400" },
            { label: "Active Tasks", value: "1,847", color: "text-green-400" },
            { label: "Operations", value: "24/7", color: "text-gold-400" },
            { label: "Uptime", value: "99.97%", color: "text-green-400" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center py-1">
              <span className={`font-bold font-sans text-base ${s.color}`}>
                {s.value}
              </span>
              <span className="text-[10px] font-sans text-muted-foreground">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div
            className="relative flex-1 min-w-0"
            data-ocid="staff.search_input"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, role, department…"
              className="pl-9 bg-card border-gold-800/40 focus:border-gold-500/60 font-sans text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as StaffStatus | "All")
            }
            className="px-3 py-2 rounded-md bg-card border border-gold-800/40 font-sans text-sm text-foreground focus:border-gold-500/60 focus:outline-none"
            data-ocid="staff.status_filter"
          >
            <option value="All">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="STANDBY">Standby</option>
            <option value="PROCESSING">Processing</option>
          </select>
        </div>

        {/* Department filter chips */}
        <div className="flex gap-2 flex-wrap" data-ocid="staff.dept_filter">
          {DEPT_FILTERS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDeptFilter(d)}
              className={`px-3 py-1 rounded-full font-sans text-xs font-medium transition-all duration-200 ${
                deptFilter === d
                  ? "bg-gold-500 text-background"
                  : "bg-card border border-gold-800/30 text-muted-foreground hover:border-gold-500/40 hover:text-foreground"
              }`}
              data-ocid={`staff.dept.${d.toLowerCase()}`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Results summary */}
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm text-muted-foreground">
            Showing{" "}
            <span className="text-foreground font-semibold">
              {filtered.length}
            </span>{" "}
            of{" "}
            <span className="text-foreground font-semibold">
              {STAFF.length}
            </span>{" "}
            staff personas
          </span>
          <Badge
            variant="outline"
            className="border-green-500/40 text-green-400 text-[10px]"
          >
            <Activity className="w-3 h-3 mr-1" /> Live
          </Badge>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground font-sans"
            data-ocid="staff.empty_state"
          >
            <Users className="w-10 h-10 mx-auto mb-3 text-gold-700/50" />
            <p>No staff personas match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((m) => (
              <StaffCard key={m.id} member={m} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gold-800/20 py-6 mt-8 bg-card/40">
        <div className="max-w-7xl mx-auto px-4 text-center font-sans text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-500 hover:text-gold-400 transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
