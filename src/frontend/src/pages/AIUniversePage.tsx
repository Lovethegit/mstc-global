import TutorialFloatingButton from "@/components/TutorialFloatingButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Brain,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Cpu,
  Globe,
  Scale,
  Search,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Agent {
  id: string;
  name: string;
  type: string;
  cluster: string;
  status: "active" | "processing" | "standby";
  currentTask: string;
  performance: number;
  tasksToday: number;
}

interface Cluster {
  id: string;
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  sampleAgents: string[];
}

interface HierarchyNode {
  id: string;
  name: string;
  role: string;
  tier: number;
  children?: HierarchyNode[];
  agentCount?: number;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const CLUSTERS: Cluster[] = [
  {
    id: "property",
    name: "Property Intelligence",
    count: 45,
    icon: Building2,
    description:
      "Property valuation, listing analysis, market price intelligence, demand forecasting",
    color: "gold",
    sampleAgents: [
      "ValuationBot α",
      "ListingScanner β",
      "DemandPredict γ",
      "PriceAlert δ",
      "RERA Watch ε",
    ],
  },
  {
    id: "security",
    name: "Security Defense",
    count: 52,
    icon: Shield,
    description:
      "GateKeeper, DDoS Shield, Bot Hunter, Anomaly Detection, Incident Response",
    color: "red",
    sampleAgents: [
      "GateKeeper AI",
      "DDoS Shield AI",
      "Bot Hunter AI",
      "Anomaly Detect AI",
      "Forensics AI",
    ],
  },
  {
    id: "legal",
    name: "Legal Operations",
    count: 30,
    icon: Scale,
    description:
      "Contract drafting, RERA compliance, policy writing, legal document generation",
    color: "blue",
    sampleAgents: [
      "Justice AI",
      "Lex AI",
      "Veda AI",
      "Deed Drafter AI",
      "Policy Writer AI",
    ],
  },
  {
    id: "crm",
    name: "CRM & Sales",
    count: 38,
    icon: Users,
    description:
      "Lead scoring, follow-up automation, pipeline management, client insights",
    color: "green",
    sampleAgents: [
      "LeadScore α",
      "FollowUp AI",
      "Pipeline Bot",
      "CLV Analyst",
      "Churn Predict",
    ],
  },
  {
    id: "content",
    name: "Content Creation",
    count: 28,
    icon: Globe,
    description:
      "Blog writing, SEO optimization, social media, market reports, newsletters",
    color: "purple",
    sampleAgents: [
      "Writer AI α",
      "SEO Bot",
      "Social AI",
      "Newsletter Gen",
      "Report Writer",
    ],
  },
  {
    id: "finance",
    name: "Finance Analytics",
    count: 22,
    icon: TrendingUp,
    description:
      "Revenue forecasting, investment analysis, tax compliance, portfolio management",
    color: "gold",
    sampleAgents: [
      "Revenue Forecast",
      "Tax Comply AI",
      "Portfolio AI",
      "Risk Analyzer",
      "Billing Bot",
    ],
  },
  {
    id: "market",
    name: "Market Intelligence",
    count: 18,
    icon: BarChart3,
    description:
      "RBI rate tracking, competitor analysis, news curation, price index monitoring",
    color: "cyan",
    sampleAgents: [
      "News Curator",
      "RBI Monitor",
      "CompetitorSpy",
      "PriceIndex AI",
      "PolicyWatch",
    ],
  },
  {
    id: "client",
    name: "Client Relations",
    count: 35,
    icon: Briefcase,
    description:
      "Client satisfaction, NPS tracking, VIP management, appointment scheduling",
    color: "amber",
    sampleAgents: [
      "Satisfaction AI",
      "NPS Tracker",
      "VIP Manager",
      "Appt Scheduler",
      "Feedback Bot",
    ],
  },
  {
    id: "tech",
    name: "Technology",
    count: 25,
    icon: Cpu,
    description:
      "Platform health, deployment automation, API management, bug detection",
    color: "indigo",
    sampleAgents: [
      "Deploy Bot",
      "Health Monitor",
      "API Guardian",
      "Bug Hunter AI",
      "Patch Deploy",
    ],
  },
  {
    id: "hr",
    name: "HR & Training",
    count: 15,
    icon: Star,
    description:
      "Staff performance, training delivery, onboarding automation, task assignment",
    color: "pink",
    sampleAgents: [
      "HR Bot α",
      "TrainingGen AI",
      "Onboard Assist",
      "Perf Tracker",
      "TaskAssign AI",
    ],
  },
  {
    id: "ngo",
    name: "NGO & CSR",
    count: 12,
    icon: CheckCircle2,
    description:
      "Donation management, impact reporting, grant tracking, volunteer coordination",
    color: "teal",
    sampleAgents: [
      "Donation AI",
      "Impact Report",
      "Grant Tracker",
      "Volunteer Bot",
      "CSR Audit AI",
    ],
  },
  {
    id: "events",
    name: "Events & Hospitality",
    count: 20,
    icon: Zap,
    description:
      "Event planning, venue booking, RSVP management, vendor coordination",
    color: "orange",
    sampleAgents: [
      "RSVP Bot α",
      "Vendor AI",
      "Timeline Gen",
      "Capacity AI",
      "Budget Planner",
    ],
  },
];

const FEATURED_AGENTS: Agent[] = [
  {
    id: "a1",
    name: "Aria — Chief AI",
    type: "Command AI",
    cluster: "Command",
    status: "active",
    currentTask: "Coordinating daily AI briefing for MD",
    performance: 99,
    tasksToday: 312,
  },
  {
    id: "a2",
    name: "GateKeeper AI",
    type: "Security AI",
    cluster: "Security Defense",
    status: "active",
    currentTask: "Monitoring 847 real-time requests/sec",
    performance: 99,
    tasksToday: 847,
  },
  {
    id: "a3",
    name: "Justice AI",
    type: "Legal AI",
    cluster: "Legal Operations",
    status: "active",
    currentTask: "Reviewing 3 RERA filings for compliance",
    performance: 98,
    tasksToday: 24,
  },
  {
    id: "a4",
    name: "ValuationBot α",
    type: "Property AI",
    cluster: "Property Intelligence",
    status: "active",
    currentTask: "Valuing Bopal residential unit — ₹82.4L",
    performance: 97,
    tasksToday: 38,
  },
  {
    id: "a5",
    name: "LeadScore α",
    type: "CRM AI",
    cluster: "CRM & Sales",
    status: "active",
    currentTask: "Scoring 14 new enquiries from website",
    performance: 96,
    tasksToday: 52,
  },
  {
    id: "a6",
    name: "Revenue Forecast",
    type: "Finance AI",
    cluster: "Finance Analytics",
    status: "active",
    currentTask: "Q2 revenue projection — ₹2.3Cr pipeline",
    performance: 95,
    tasksToday: 18,
  },
  {
    id: "a7",
    name: "News Curator",
    type: "Market AI",
    cluster: "Market Intelligence",
    status: "active",
    currentTask: "Curating 28 articles on Ahmedabad RE market",
    performance: 94,
    tasksToday: 28,
  },
  {
    id: "a8",
    name: "Policy Writer AI",
    type: "Legal AI",
    cluster: "Legal Operations",
    status: "active",
    currentTask: "Updating Privacy Policy for PDPB v2.1",
    performance: 97,
    tasksToday: 9,
  },
  {
    id: "a9",
    name: "DDoS Shield AI",
    type: "Security AI",
    cluster: "Security Defense",
    status: "active",
    currentTask: "Absorbing 0 attacks — all clear",
    performance: 100,
    tasksToday: 203,
  },
  {
    id: "a10",
    name: "ListingScanner β",
    type: "Property AI",
    cluster: "Property Intelligence",
    status: "active",
    currentTask: "Scanning 120 new Gujarat RERA listings",
    performance: 95,
    tasksToday: 120,
  },
  {
    id: "a11",
    name: "Writer AI α",
    type: "Content AI",
    cluster: "Content Creation",
    status: "active",
    currentTask: "Drafting blog: 'Top 10 Areas in Ahmedabad 2026'",
    performance: 93,
    tasksToday: 7,
  },
  {
    id: "a12",
    name: "Portfolio AI",
    type: "Finance AI",
    cluster: "Finance Analytics",
    status: "processing",
    currentTask: "Analyzing 5 investment portfolios for ROI",
    performance: 96,
    tasksToday: 15,
  },
  {
    id: "a13",
    name: "NPS Tracker",
    type: "Client AI",
    cluster: "Client Relations",
    status: "active",
    currentTask: "Processing 8 client satisfaction surveys",
    performance: 91,
    tasksToday: 8,
  },
  {
    id: "a14",
    name: "Deploy Bot",
    type: "Tech AI",
    cluster: "Technology",
    status: "active",
    currentTask: "Monitoring deployment pipeline — healthy",
    performance: 99,
    tasksToday: 12,
  },
  {
    id: "a15",
    name: "Deed Drafter AI",
    type: "Legal AI",
    cluster: "Legal Operations",
    status: "active",
    currentTask: "Drafting sale deed for Unit 4B, Satellite",
    performance: 98,
    tasksToday: 5,
  },
  {
    id: "a16",
    name: "SEO Bot",
    type: "Content AI",
    cluster: "Content Creation",
    status: "active",
    currentTask: "Optimizing 12 property listing pages",
    performance: 92,
    tasksToday: 12,
  },
  {
    id: "a17",
    name: "Anomaly Detect AI",
    type: "Security AI",
    cluster: "Security Defense",
    status: "active",
    currentTask: "Baseline learning — 0 anomalies detected",
    performance: 99,
    tasksToday: 1247,
  },
  {
    id: "a18",
    name: "Lex AI",
    type: "Legal AI",
    cluster: "Legal Operations",
    status: "active",
    currentTask: "Reviewing 3 contracts for risk clauses",
    performance: 97,
    tasksToday: 6,
  },
  {
    id: "a19",
    name: "Tax Comply AI",
    type: "Finance AI",
    cluster: "Finance Analytics",
    status: "processing",
    currentTask: "Computing GST for 7 pending invoices",
    performance: 96,
    tasksToday: 22,
  },
  {
    id: "a20",
    name: "RSVP Bot α",
    type: "Events AI",
    cluster: "Events & Hospitality",
    status: "active",
    currentTask: "Managing 84 RSVPs for AGM 2026",
    performance: 94,
    tasksToday: 84,
  },
  {
    id: "a21",
    name: "Donation AI",
    type: "NGO AI",
    cluster: "NGO & CSR",
    status: "active",
    currentTask: "Reconciling ₹1.2L donation receipts",
    performance: 95,
    tasksToday: 14,
  },
  {
    id: "a22",
    name: "HR Bot α",
    type: "HR AI",
    cluster: "HR & Training",
    status: "active",
    currentTask: "Scheduling 3 performance reviews",
    performance: 90,
    tasksToday: 9,
  },
  {
    id: "a23",
    name: "RBI Monitor",
    type: "Market AI",
    cluster: "Market Intelligence",
    status: "active",
    currentTask: "Tracking repo rate at 6.25% — stable",
    performance: 97,
    tasksToday: 4,
  },
  {
    id: "a24",
    name: "Bot Hunter AI",
    type: "Security AI",
    cluster: "Security Defense",
    status: "active",
    currentTask: "Blocked 203 scrapers in last 6 hours",
    performance: 99,
    tasksToday: 203,
  },
  {
    id: "a25",
    name: "Satisfaction AI",
    type: "Client AI",
    cluster: "Client Relations",
    status: "active",
    currentTask: "Sentiment analysis on 22 WhatsApp threads",
    performance: 92,
    tasksToday: 22,
  },
];

const HIERARCHY: HierarchyNode = {
  id: "root",
  name: "Love Vijaybhai Parekh",
  role: "MD / Owner",
  tier: 1,
  children: [
    {
      id: "aria",
      name: "Aria",
      role: "Chief AI (Caffeine AI)",
      tier: 2,
      children: [
        {
          id: "gm1",
          name: "Rajan AI",
          role: "Property GM",
          tier: 3,
          agentCount: 45,
          children: [
            {
              id: "dh1a",
              name: "Listing Head AI",
              role: "Listings Director",
              tier: 4,
              agentCount: 15,
            },
            {
              id: "dh1b",
              name: "Valuation Head AI",
              role: "Valuation Director",
              tier: 4,
              agentCount: 12,
            },
            {
              id: "dh1c",
              name: "RERA Head AI",
              role: "RERA Compliance Director",
              tier: 4,
              agentCount: 18,
            },
          ],
        },
        {
          id: "gm2",
          name: "Priya AI",
          role: "Business Dev GM",
          tier: 3,
          agentCount: 38,
          children: [
            {
              id: "dh2a",
              name: "Lead Head AI",
              role: "Lead Management Director",
              tier: 4,
              agentCount: 14,
            },
            {
              id: "dh2b",
              name: "Proposal Head AI",
              role: "Proposals Director",
              tier: 4,
              agentCount: 12,
            },
            {
              id: "dh2c",
              name: "Partner Head AI",
              role: "Partner Relations Director",
              tier: 4,
              agentCount: 12,
            },
          ],
        },
        {
          id: "gm3",
          name: "Dhruv AI",
          role: "Technology GM",
          tier: 3,
          agentCount: 25,
          children: [
            {
              id: "dh3a",
              name: "Platform Head AI",
              role: "Platform Health Director",
              tier: 4,
              agentCount: 10,
            },
            {
              id: "dh3b",
              name: "Deploy Head AI",
              role: "Deployment Director",
              tier: 4,
              agentCount: 8,
            },
            {
              id: "dh3c",
              name: "API Head AI",
              role: "API Management Director",
              tier: 4,
              agentCount: 7,
            },
          ],
        },
        {
          id: "gm4",
          name: "Vijay AI",
          role: "Finance GM",
          tier: 3,
          agentCount: 22,
          children: [
            {
              id: "dh4a",
              name: "Revenue Head AI",
              role: "Revenue Analytics Director",
              tier: 4,
              agentCount: 8,
            },
            {
              id: "dh4b",
              name: "Tax Head AI",
              role: "Tax Compliance Director",
              tier: 4,
              agentCount: 7,
            },
            {
              id: "dh4c",
              name: "Portfolio Head AI",
              role: "Investment Director",
              tier: 4,
              agentCount: 7,
            },
          ],
        },
        {
          id: "gm5",
          name: "Sunita AI",
          role: "Content GM",
          tier: 3,
          agentCount: 28,
          children: [
            {
              id: "dh5a",
              name: "Blog Head AI",
              role: "Blog & SEO Director",
              tier: 4,
              agentCount: 10,
            },
            {
              id: "dh5b",
              name: "Social Head AI",
              role: "Social Media Director",
              tier: 4,
              agentCount: 9,
            },
            {
              id: "dh5c",
              name: "Media Head AI",
              role: "Media & Press Director",
              tier: 4,
              agentCount: 9,
            },
          ],
        },
        {
          id: "gm6",
          name: "Meera AI",
          role: "Client Relations GM",
          tier: 3,
          agentCount: 35,
          children: [
            {
              id: "dh6a",
              name: "CRM Head AI",
              role: "CRM Director",
              tier: 4,
              agentCount: 12,
            },
            {
              id: "dh6b",
              name: "Support Head AI",
              role: "Client Support Director",
              tier: 4,
              agentCount: 12,
            },
            {
              id: "dh6c",
              name: "VIP Head AI",
              role: "VIP Relations Director",
              tier: 4,
              agentCount: 11,
            },
          ],
        },
        {
          id: "gm7",
          name: "Rohan AI",
          role: "Services GM",
          tier: 3,
          agentCount: 20,
          children: [
            {
              id: "dh7a",
              name: "Events Head AI",
              role: "Events Director",
              tier: 4,
              agentCount: 7,
            },
            {
              id: "dh7b",
              name: "Hosp Head AI",
              role: "Hospitality Director",
              tier: 4,
              agentCount: 7,
            },
            {
              id: "dh7c",
              name: "Music Head AI",
              role: "Music & Arts Director",
              tier: 4,
              agentCount: 6,
            },
          ],
        },
        {
          id: "gm8",
          name: "Amit AI",
          role: "Security GM",
          tier: 3,
          agentCount: 52,
          children: [
            {
              id: "dh8a",
              name: "Perimeter Head AI",
              role: "Perimeter Defense Director",
              tier: 4,
              agentCount: 8,
            },
            {
              id: "dh8b",
              name: "Identity Head AI",
              role: "Identity & Access Director",
              tier: 4,
              agentCount: 9,
            },
            {
              id: "dh8c",
              name: "Incident Head AI",
              role: "Incident Response Director",
              tier: 4,
              agentCount: 8,
            },
          ],
        },
        {
          id: "gm9",
          name: "Sanjay AI",
          role: "Data GM",
          tier: 3,
          agentCount: 18,
          children: [
            {
              id: "dh9a",
              name: "Analytics Head AI",
              role: "Analytics Director",
              tier: 4,
              agentCount: 6,
            },
            {
              id: "dh9b",
              name: "Market Head AI",
              role: "Market Intelligence Director",
              tier: 4,
              agentCount: 6,
            },
            {
              id: "dh9c",
              name: "Forecast Head AI",
              role: "Forecasting Director",
              tier: 4,
              agentCount: 6,
            },
          ],
        },
        {
          id: "gm10",
          name: "Kiran AI",
          role: "People GM",
          tier: 3,
          agentCount: 15,
          children: [
            {
              id: "dh10a",
              name: "HR Head AI",
              role: "HR Director",
              tier: 4,
              agentCount: 5,
            },
            {
              id: "dh10b",
              name: "Training Head AI",
              role: "Training Director",
              tier: 4,
              agentCount: 5,
            },
            {
              id: "dh10c",
              name: "Perf Head AI",
              role: "Performance Director",
              tier: 4,
              agentCount: 5,
            },
          ],
        },
      ],
    },
  ],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusDot({ status }: { status: Agent["status"] }) {
  const cls =
    status === "active"
      ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]"
      : status === "processing"
        ? "bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.8)] animate-pulse"
        : "bg-muted-foreground";
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${cls}`}
    />
  );
}

function HierarchyNodeRow({
  node,
  defaultExpanded = false,
}: { node: HierarchyNode; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasChildren = node.children && node.children.length > 0;

  const tierColors: Record<number, string> = {
    1: "border-l-gold-400 bg-gold-500/10",
    2: "border-l-gold-500/80 bg-gold-500/5",
    3: "border-l-gold-600/60 bg-card",
    4: "border-l-gold-700/50 bg-card",
  };
  const tierBadge: Record<number, string> = {
    1: "bg-gold-500 text-background",
    2: "bg-gold-600/80 text-background",
    3: "bg-gold-800/60 text-gold-100",
    4: "bg-muted text-muted-foreground",
  };

  const indent = (node.tier - 1) * 20;

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 border-l-2 text-left transition-all duration-200 hover:bg-gold-500/5 ${
          tierColors[node.tier] ?? "border-l-border bg-card"
        }`}
        style={{ paddingLeft: `${indent + 16}px` }}
        data-ocid={`ai.hierarchy.node.${node.id}`}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
          )
        ) : (
          <span className="w-3.5 flex-shrink-0" />
        )}
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-sans flex-shrink-0 ${
            tierBadge[node.tier] ?? "bg-muted text-muted-foreground"
          }`}
        >
          T{node.tier}
        </span>
        <span className="font-sans font-semibold text-sm text-foreground truncate">
          {node.name}
        </span>
        <span className="font-sans text-xs text-muted-foreground truncate flex-1 min-w-0">
          {node.role}
        </span>
        {node.agentCount !== undefined && (
          <span className="text-[10px] font-sans text-gold-400 flex-shrink-0 ml-auto">
            {node.agentCount} agents
          </span>
        )}
      </button>
      {expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <HierarchyNodeRow
              key={child.id}
              node={child}
              defaultExpanded={child.tier <= 2}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const CLUSTER_COLOR_MAP: Record<
  string,
  { border: string; badge: string; bg: string }
> = {
  gold: {
    border: "border-gold-500/40",
    badge: "bg-gold-500/20 text-gold-300",
    bg: "bg-gold-500/5",
  },
  red: {
    border: "border-red-500/40",
    badge: "bg-red-500/20 text-red-300",
    bg: "bg-red-500/5",
  },
  blue: {
    border: "border-blue-500/40",
    badge: "bg-blue-500/20 text-blue-300",
    bg: "bg-blue-500/5",
  },
  green: {
    border: "border-green-500/40",
    badge: "bg-green-500/20 text-green-300",
    bg: "bg-green-500/5",
  },
  purple: {
    border: "border-purple-500/40",
    badge: "bg-purple-500/20 text-purple-300",
    bg: "bg-purple-500/5",
  },
  cyan: {
    border: "border-cyan-500/40",
    badge: "bg-cyan-500/20 text-cyan-300",
    bg: "bg-cyan-500/5",
  },
  amber: {
    border: "border-amber-500/40",
    badge: "bg-amber-500/20 text-amber-300",
    bg: "bg-amber-500/5",
  },
  indigo: {
    border: "border-indigo-500/40",
    badge: "bg-indigo-500/20 text-indigo-300",
    bg: "bg-indigo-500/5",
  },
  pink: {
    border: "border-pink-500/40",
    badge: "bg-pink-500/20 text-pink-300",
    bg: "bg-pink-500/5",
  },
  teal: {
    border: "border-teal-500/40",
    badge: "bg-teal-500/20 text-teal-300",
    bg: "bg-teal-500/5",
  },
  orange: {
    border: "border-orange-500/40",
    badge: "bg-orange-500/20 text-orange-300",
    bg: "bg-orange-500/5",
  },
};

function ClusterCard({ cluster }: { cluster: Cluster }) {
  const colors = CLUSTER_COLOR_MAP[cluster.color] ?? CLUSTER_COLOR_MAP.gold;
  const Icon = cluster.icon;
  return (
    <div
      className={`rounded-xl border ${colors.border} ${colors.bg} p-4 flex flex-col gap-3 hover:border-opacity-70 transition-all duration-300`}
      data-ocid={`ai.cluster.${cluster.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg ${colors.badge} flex items-center justify-center flex-shrink-0`}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-serif font-bold text-sm text-foreground leading-tight">
              {cluster.name}
            </h3>
            <span className="text-[10px] font-sans text-muted-foreground">
              {cluster.count} agents
            </span>
          </div>
        </div>
        <span className="text-[9px] font-bold font-sans px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 flex-shrink-0">
          ALL ACTIVE
        </span>
      </div>
      <p className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {cluster.description}
      </p>
      <div className="flex flex-wrap gap-1">
        {cluster.sampleAgents.slice(0, 3).map((a) => (
          <span
            key={a}
            className={`text-[9px] font-sans px-1.5 py-0.5 rounded ${colors.badge}`}
          >
            {a}
          </span>
        ))}
        {cluster.sampleAgents.length > 3 && (
          <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            +{cluster.sampleAgents.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div
      className="rounded-xl border border-gold-800/30 bg-card p-4 flex flex-col gap-2 hover:border-gold-500/40 transition-all duration-300"
      data-ocid={`ai.agent.${agent.id}`}
    >
      <div className="flex items-center gap-2">
        <StatusDot status={agent.status} />
        <span className="font-sans font-semibold text-sm text-foreground truncate">
          {agent.name}
        </span>
        <Badge
          variant="outline"
          className="ml-auto text-[9px] border-gold-700/40 text-gold-400 flex-shrink-0"
        >
          {agent.type}
        </Badge>
      </div>
      <p className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {agent.currentTask}
      </p>
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-sans text-muted-foreground">
            Score:
          </span>
          <span className="text-[10px] font-bold font-sans text-gold-400">
            {agent.performance}%
          </span>
        </div>
        <span className="text-[10px] font-sans text-muted-foreground">
          {agent.tasksToday} tasks today
        </span>
      </div>
      <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400"
          style={{ width: `${agent.performance}%` }}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AIUniversePage() {
  const [search, setSearch] = useState("");
  const [hierarchyExpanded, setHierarchyExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "clusters" | "agents" | "hierarchy"
  >("clusters");

  const filteredClusters = useMemo(
    () =>
      CLUSTERS.filter(
        (c) =>
          !search ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.sampleAgents.some((a) =>
            a.toLowerCase().includes(search.toLowerCase()),
          ),
      ),
    [search],
  );

  const filteredAgents = useMemo(
    () =>
      FEATURED_AGENTS.filter(
        (a) =>
          !search ||
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.type.toLowerCase().includes(search.toLowerCase()) ||
          a.cluster.toLowerCase().includes(search.toLowerCase()) ||
          a.currentTask.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const tabs = [
    { id: "clusters" as const, label: "Clusters" },
    { id: "agents" as const, label: "Featured Agents" },
    { id: "hierarchy" as const, label: "Hierarchy" },
  ];

  return (
    <div className="min-h-screen bg-background" data-ocid="ai.page">
      {/* Sticky Header */}
      <header className="bg-card border-b border-gold-800/30 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/apps" data-ocid="ai.nav.back_link">
              <Button
                variant="ghost"
                size="sm"
                className="p-1.5 h-auto flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-gold-400" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 min-w-0">
              <Brain className="w-5 h-5 text-gold-400 flex-shrink-0" />
              <span className="font-serif font-bold text-lg text-foreground tracking-wide truncate">
                AI UNIVERSE
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-sans text-muted-foreground flex-shrink-0">
            <span className="text-gold-400 font-semibold">2,000+</span> agents ·
            <span className="text-gold-400 font-semibold">50+</span> clusters ·
            <span className="text-gold-400 font-semibold">7</span> tiers
          </div>
          <Link
            to="/staff"
            data-ocid="ai.nav.staff_link"
            className="flex-shrink-0"
          >
            <Button
              variant="outline"
              size="sm"
              className="border-gold-700/40 text-gold-400 text-xs"
            >
              <Users className="w-3.5 h-3.5 mr-1.5" />
              <span className="hidden sm:inline">Staff</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-card/60 border-b border-gold-800/20">
        <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Total Agents", value: "2,000+", color: "text-gold-400" },
            { label: "Active Now", value: "1,847", color: "text-green-400" },
            { label: "Tasks Today", value: "14,293", color: "text-gold-400" },
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

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative max-w-xl" data-ocid="ai.search_input">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents, clusters, tasks…"
            className="pl-9 bg-card border-gold-800/40 focus:border-gold-500/60 font-sans text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gold-800/20 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 font-sans text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === t.id
                  ? "text-gold-400 border-b-2 border-gold-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`ai.tab.${t.id}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Clusters Tab */}
        {activeTab === "clusters" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif font-bold text-lg text-foreground">
                Agent Clusters
                <span className="font-sans text-sm font-normal text-muted-foreground ml-2">
                  ({filteredClusters.length} showing)
                </span>
              </h2>
              <Badge
                variant="outline"
                className="border-green-500/40 text-green-400 text-[10px] flex-shrink-0"
              >
                <Activity className="w-3 h-3 mr-1" /> All Online
              </Badge>
            </div>
            {filteredClusters.length === 0 ? (
              <div
                className="text-center py-12 text-muted-foreground font-sans"
                data-ocid="ai.clusters.empty_state"
              >
                No clusters match your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredClusters.map((c) => (
                  <ClusterCard key={c.id} cluster={c} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === "agents" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif font-bold text-lg text-foreground">
                Featured Agents
                <span className="font-sans text-sm font-normal text-muted-foreground ml-2">
                  ({filteredAgents.length} showing)
                </span>
              </h2>
            </div>
            {filteredAgents.length === 0 ? (
              <div
                className="text-center py-12 text-muted-foreground font-sans"
                data-ocid="ai.agents.empty_state"
              >
                No agents match your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAgents.map((a) => (
                  <AgentCard key={a.id} agent={a} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Hierarchy Tab */}
        {activeTab === "hierarchy" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif font-bold text-lg text-foreground">
                Hierarchy Tree
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHierarchyExpanded((p) => !p)}
                className="text-gold-400 text-xs flex-shrink-0"
                data-ocid="ai.hierarchy.toggle_button"
              >
                {hierarchyExpanded ? (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 mr-1" /> Collapse All
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 mr-1" /> Expand All
                  </>
                )}
              </Button>
            </div>
            <div className="rounded-xl border border-gold-800/30 overflow-hidden">
              <HierarchyNodeRow
                node={HIERARCHY}
                defaultExpanded={hierarchyExpanded}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                {
                  tier: 1,
                  label: "Owner",
                  color: "bg-gold-500 text-background",
                },
                {
                  tier: 2,
                  label: "Chief AI",
                  color: "bg-gold-600/80 text-background",
                },
                {
                  tier: 3,
                  label: "GM AIs (10)",
                  color: "bg-gold-800/60 text-gold-100",
                },
                {
                  tier: 4,
                  label: "Dept Heads",
                  color: "bg-muted text-muted-foreground",
                },
              ].map((t) => (
                <div
                  key={t.tier}
                  className="flex items-center gap-2 p-2 rounded-lg bg-card border border-gold-800/20"
                >
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${t.color}`}
                  >
                    T{t.tier}
                  </span>
                  <span className="font-sans text-xs text-muted-foreground">
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
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
      <TutorialFloatingButton />
    </div>
  );
}
