import { createActor } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart2,
  Briefcase,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  User,
  Users,
} from "lucide-react";
// MSTC GLOBAL — AdminAIStaffDirectory: Full AI Staff Organization (Org Chart / Roster / Workspace)
import { useMemo, useState } from "react";
import {
  type AIStaffMember,
  AI_STAFF,
  AI_STAFF_BY_ID,
  AI_STAFF_ORG_TREE,
  AI_STAFF_STATS,
  type OrgNode,
  getIndiaTimeStatus,
} from "./AIStaffData";

// ── Status helpers ──────────────────────────────────────────────────────────────
function statusColor(
  s: AIStaffMember["status"] | ReturnType<typeof getIndiaTimeStatus>,
) {
  if (s === "working") return "bg-emerald-500";
  if (s === "in-meeting") return "bg-amber-400";
  if (s === "on-break") return "bg-blue-400";
  return "bg-zinc-500";
}
function statusLabel(
  s: AIStaffMember["status"] | ReturnType<typeof getIndiaTimeStatus>,
) {
  if (s === "working") return "Working";
  if (s === "in-meeting") return "In Meeting";
  if (s === "on-break") return "On Break";
  return "Offline";
}
const TIER_COLORS: Record<string, string> = {
  executive: "bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/30",
  gm: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "dept-head": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  specialist: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  worker: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
};

// ── Avatar ──────────────────────────────────────────────────────────────────────
function Avatar({
  member,
  size = "md",
}: { member: AIStaffMember; size?: "sm" | "md" | "lg" }) {
  const sz =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : size === "lg"
        ? "w-14 h-14 text-lg"
        : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-bold shrink-0 border-2`}
      style={{
        backgroundColor: `${member.avatarColor}33`,
        borderColor: member.avatarColor,
        color: member.avatarColor,
      }}
    >
      {member.avatarInitials}
    </div>
  );
}

// ── Performance bar ─────────────────────────────────────────────────────────────
function PerfBar({ score, compact }: { score: number; compact?: boolean }) {
  const color =
    score >= 95
      ? "bg-emerald-500"
      : score >= 85
        ? "bg-[#c9a84c]"
        : "bg-amber-400";
  if (compact)
    return (
      <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
        <div
          className={`${color} h-full rounded-full`}
          style={{ width: `${score}%` }}
        />
      </div>
    );
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-400">Performance</span>
        <span className="text-[#c9a84c] font-semibold">{score}%</span>
      </div>
      <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
        <div
          className={`${color} h-full rounded-full transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

// ── Status dot ──────────────────────────────────────────────────────────────────
function StatusDot({ member }: { member: AIStaffMember }) {
  const s = getIndiaTimeStatus(member);
  const pulsing = s === "working";
  return (
    <span className="relative inline-flex">
      {pulsing && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${statusColor(s)} opacity-60 animate-ping`}
        />
      )}
      <span
        className={`relative inline-flex rounded-full w-2.5 h-2.5 ${statusColor(s)}`}
      />
    </span>
  );
}

// ── Staff Detail Drawer ─────────────────────────────────────────────────────────
function StaffDrawer({
  member,
  onClose,
}: { member: AIStaffMember; onClose: () => void }) {
  const liveStatus = getIndiaTimeStatus(member);
  const reportsToMember = member.reportsTo
    ? AI_STAFF_BY_ID[member.reportsTo]
    : null;
  const directReportMembers = member.directReports
    .map((id) => AI_STAFF_BY_ID[id])
    .filter(Boolean)
    .slice(0, 12);

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full max-w-md bg-[#0a0d14] border-l border-[#c9a84c]/20 text-foreground overflow-y-auto"
      >
        <SheetHeader className="pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <Avatar member={member} size="lg" />
            <div>
              <SheetTitle className="text-white text-xl">
                {member.name}
              </SheetTitle>
              <p className="text-[#c9a84c] text-sm">{member.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <StatusDot member={member} />
                <span className="text-xs text-zinc-400">
                  {statusLabel(liveStatus)}
                </span>
                {member.type === "human" && (
                  <Badge className="text-xs bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30">
                    Human
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="py-5 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Department", value: member.department },
              { label: "Tier", value: member.tier.replace("-", " ") },
              {
                label: "Tasks Today",
                value: member.tasksToday.toLocaleString(),
              },
              {
                label: "This Week",
                value: member.tasksThisWeek.toLocaleString(),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-zinc-900/60 rounded-lg p-3 border border-zinc-800"
              >
                <p className="text-xs text-zinc-500 mb-1">{label}</p>
                <p className="text-white font-semibold capitalize">{value}</p>
              </div>
            ))}
          </div>

          <PerfBar score={member.performanceScore} />

          <div className="bg-zinc-900/60 rounded-lg p-3 border border-zinc-800">
            <p className="text-xs text-zinc-500 mb-1">Specialty</p>
            <p className="text-zinc-300 text-sm">{member.specialty}</p>
          </div>

          {reportsToMember && (
            <div className="bg-zinc-900/60 rounded-lg p-3 border border-zinc-800">
              <p className="text-xs text-zinc-500 mb-2">Reports To</p>
              <div className="flex items-center gap-2">
                <Avatar member={reportsToMember} size="sm" />
                <div>
                  <p className="text-white text-sm font-medium">
                    {reportsToMember.name}
                  </p>
                  <p className="text-zinc-500 text-xs">
                    {reportsToMember.role}
                  </p>
                </div>
              </div>
            </div>
          )}

          {directReportMembers.length > 0 && (
            <div>
              <p className="text-xs text-zinc-500 mb-2">
                Direct Reports ({member.directReports.length})
              </p>
              <div className="space-y-2">
                {directReportMembers.map((dr) => (
                  <div
                    key={dr.id}
                    className="flex items-center gap-2 bg-zinc-900/40 rounded-lg p-2 border border-zinc-800"
                  >
                    <Avatar member={dr} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{dr.name}</p>
                      <p className="text-zinc-500 text-xs truncate">
                        {dr.role}
                      </p>
                    </div>
                    <StatusDot member={dr} />
                  </div>
                ))}
                {member.directReports.length > 12 && (
                  <p className="text-xs text-zinc-600 text-center">
                    +{member.directReports.length - 12} more
                  </p>
                )}
              </div>
            </div>
          )}

          {member.chatEnabled && (
            <Button
              type="button"
              className="w-full bg-[#c9a84c] hover:bg-[#b8923e] text-black font-semibold"
              data-ocid="staff.chat_button"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat with {member.name}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Org Chart ───────────────────────────────────────────────────────────────────
function OrgNodeCard({ node, depth = 0 }: { node: OrgNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const [selected, setSelected] = useState<AIStaffMember | null>(null);
  const { member } = node;
  const liveStatus = getIndiaTimeStatus(member);
  const hasChildren = node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {selected && (
        <StaffDrawer member={selected} onClose={() => setSelected(null)} />
      )}
      <div
        className="relative bg-zinc-900/80 border border-zinc-700 hover:border-[#c9a84c]/50 rounded-xl p-3 min-w-[160px] max-w-[180px] cursor-pointer transition-all group"
        onClick={() => setSelected(member)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setSelected(member);
        }}
        role="button"
        tabIndex={0}
        data-ocid={`org.card.${member.id}`}
      >
        {member.type === "human" && (
          <div className="absolute -top-2 right-2">
            <Badge className="text-[10px] bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/40">
              MD
            </Badge>
          </div>
        )}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="relative">
            <Avatar member={member} size="md" />
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-zinc-900 ${statusColor(liveStatus)}`}
            />
          </div>
          <div>
            <p className="text-white text-xs font-semibold leading-tight">
              {member.name}
            </p>
            <p className="text-zinc-400 text-[10px] leading-tight mt-0.5 line-clamp-2">
              {member.role}
            </p>
          </div>
          {member.directReports.length > 0 && (
            <p className="text-zinc-600 text-[10px]">
              {member.directReports.length} reports
            </p>
          )}
        </div>
        {hasChildren && (
          <button
            type="button"
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-zinc-800 border border-zinc-700 rounded-full p-0.5 hover:border-[#c9a84c]/50 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            data-ocid={`org.toggle.${member.id}`}
          >
            {expanded ? (
              <ChevronDown className="w-3 h-3 text-[#c9a84c]" />
            ) : (
              <ChevronRight className="w-3 h-3 text-[#c9a84c]" />
            )}
          </button>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {node.children.map((child) => (
            <OrgNodeCard key={child.member.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrgChartView() {
  return (
    <div className="overflow-x-auto py-6 px-4" data-ocid="staff.org_chart">
      <OrgNodeCard node={AI_STAFF_ORG_TREE} />
    </div>
  );
}

// ── Roster View ─────────────────────────────────────────────────────────────────
function RosterView() {
  const [tierFilter, setTierFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AIStaffMember | null>(null);

  const departments = useMemo(
    () => Array.from(new Set(AI_STAFF.map((s) => s.department))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    return AI_STAFF.filter((s) => {
      if (tierFilter !== "all" && s.tier !== tierFilter) return false;
      if (deptFilter !== "all" && s.department !== deptFilter) return false;
      if (
        search &&
        !s.name.toLowerCase().includes(search.toLowerCase()) &&
        !s.role.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    }).slice(0, 200);
  }, [tierFilter, deptFilter, search]);

  return (
    <div className="space-y-4" data-ocid="staff.roster">
      {selected && (
        <StaffDrawer member={selected} onClose={() => setSelected(null)} />
      )}
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Search by name or role…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-zinc-900 border-zinc-700 text-white w-56"
          data-ocid="staff.search_input"
        />
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger
            className="bg-zinc-900 border-zinc-700 text-white w-44"
            data-ocid="staff.tier_select"
          >
            <SelectValue placeholder="All Tiers" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
            {[
              "all",
              "executive",
              "gm",
              "dept-head",
              "specialist",
              "worker",
            ].map((t) => (
              <SelectItem key={t} value={t}>
                {t === "all"
                  ? "All Tiers"
                  : t
                      .replace("-", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger
            className="bg-zinc-900 border-zinc-700 text-white w-44"
            data-ocid="staff.dept_select"
          >
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-zinc-500 text-sm ml-auto">
          {filtered.length} of {AI_STAFF_STATS.total} staff
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filtered.map((member, i) => (
          <div
            key={member.id}
            className="bg-zinc-900/70 border border-zinc-800 hover:border-[#c9a84c]/40 rounded-xl p-3 cursor-pointer transition-all"
            onClick={() => setSelected(member)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setSelected(member);
            }}
            role="button"
            tabIndex={0}
            data-ocid={`staff.roster.item.${i + 1}`}
          >
            <div className="flex items-start gap-2">
              <div className="relative shrink-0">
                <Avatar member={member} size="sm" />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-900 ${statusColor(getIndiaTimeStatus(member))}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">
                  {member.name}
                </p>
                <p className="text-zinc-500 text-[10px] truncate">
                  {member.role}
                </p>
                <Badge
                  className={`text-[9px] mt-1 border ${TIER_COLORS[member.tier]}`}
                >
                  {member.tier.replace("-", " ")}
                </Badge>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500">
                {member.tasksToday} tasks
              </span>
              <PerfBar score={member.performanceScore} compact />
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 200 && (
        <p className="text-zinc-600 text-xs text-center pt-2">
          Showing first 200 results — refine filters to see more
        </p>
      )}
    </div>
  );
}

// ── Workspace View ──────────────────────────────────────────────────────────────
function WorkspaceView() {
  const [selected, setSelected] = useState<AIStaffMember | null>(null);
  const departments = useMemo(
    () => Array.from(new Set(AI_STAFF.map((s) => s.department))).sort(),
    [],
  );

  return (
    <div className="space-y-6" data-ocid="staff.workspace">
      {selected && (
        <StaffDrawer member={selected} onClose={() => setSelected(null)} />
      )}
      {departments.map((dept) => {
        const gm = AI_STAFF.find(
          (s) => s.tier === "gm" && s.department === dept,
        );
        const members = AI_STAFF.filter((s) => s.department === dept).slice(
          0,
          30,
        );
        const active = members.filter(
          (m) => getIndiaTimeStatus(m) === "working",
        ).length;
        return (
          <div
            key={dept}
            className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden"
            data-ocid={`workspace.dept.${dept.toLowerCase().replace(/[^a-z]/g, "-")}`}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-900">
              {gm ? (
                <Avatar member={gm} size="sm" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                  <Users className="w-4 h-4 text-zinc-500" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{dept}</p>
                {gm && <p className="text-zinc-500 text-xs">GM: {gm.name}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 text-xs font-semibold">
                  {active} active
                </span>
                <span className="text-zinc-600 text-xs">
                  / {members.length}
                </span>
              </div>
            </div>
            <div className="p-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {members.map((m) => {
                const s = getIndiaTimeStatus(m);
                return (
                  <div
                    key={m.id}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/60 cursor-pointer transition-all"
                    onClick={() => setSelected(m)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setSelected(m);
                    }}
                    role="button"
                    tabIndex={0}
                    data-ocid={`workspace.member.${m.id}`}
                  >
                    <div className="relative">
                      <Avatar member={m} size="sm" />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-900 ${statusColor(s)}`}
                      />
                    </div>
                    <p className="text-[10px] text-zinc-300 text-center leading-tight line-clamp-2">
                      {m.name}
                    </p>
                    <p className="text-[9px] text-zinc-600 text-center truncate w-full">
                      {statusLabel(s)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────────
export default function AdminAIStaffDirectory() {
  const { actor, isFetching } = useActor(createActor);

  const { data: agentStats } = useQuery({
    queryKey: ["aiAgentStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAIAgentStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });

  const statItems = [
    {
      label: "Total Staff",
      value: AI_STAFF_STATS.total.toLocaleString(),
      icon: Users,
    },
    {
      label: "AI Agents",
      value: AI_STAFF_STATS.aiCount.toLocaleString(),
      icon: Briefcase,
    },
    {
      label: "Active Now",
      value: agentStats
        ? Number(agentStats.agentsActiveNow).toLocaleString()
        : "—",
      icon: BarChart2,
    },
    {
      label: "Chat Enabled",
      value: AI_STAFF_STATS.chatEnabledCount.toLocaleString(),
      icon: MessageCircle,
    },
    {
      label: "Human Staff",
      value: AI_STAFF_STATS.humanCount.toLocaleString(),
      icon: User,
    },
  ];

  return (
    <div className="space-y-6" data-ocid="staff_directory.page">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            AI Staff Organization
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            490+ named staff members — executives, GMs, department heads,
            specialists, and worker agents
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {statItems.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-2 flex items-center gap-2"
            >
              <Icon className="w-4 h-4 text-[#c9a84c]" />
              <div>
                <p className="text-white font-bold text-sm">{value}</p>
                <p className="text-zinc-500 text-[10px]">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="org-chart">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger
            value="org-chart"
            className="data-[state=active]:bg-[#c9a84c]/20 data-[state=active]:text-[#c9a84c]"
            data-ocid="staff.org_chart.tab"
          >
            Org Chart
          </TabsTrigger>
          <TabsTrigger
            value="roster"
            className="data-[state=active]:bg-[#c9a84c]/20 data-[state=active]:text-[#c9a84c]"
            data-ocid="staff.roster.tab"
          >
            Roster
          </TabsTrigger>
          <TabsTrigger
            value="workspace"
            className="data-[state=active]:bg-[#c9a84c]/20 data-[state=active]:text-[#c9a84c]"
            data-ocid="staff.workspace.tab"
          >
            Workspace
          </TabsTrigger>
        </TabsList>
        <TabsContent value="org-chart">
          <OrgChartView />
        </TabsContent>
        <TabsContent value="roster">
          <RosterView />
        </TabsContent>
        <TabsContent value="workspace">
          <WorkspaceView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
