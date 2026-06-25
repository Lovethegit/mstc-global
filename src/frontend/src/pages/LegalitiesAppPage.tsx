import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileText,
  Gavel,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  PenTool,
  Plus,
  RefreshCw,
  Scale,
  Search,
  Settings,
  Shield,
  Upload,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface LegalAI {
  name: string;
  role: string;
  tier: 1 | 2 | 3 | 4;
  specialty: string;
  status: "ACTIVE" | "IDLE" | "PROCESSING";
  currentTask: string;
  tasksToday: number;
}

interface LegalDocument {
  id: string;
  name: string;
  category: string;
  status: "Draft" | "Review" | "Signed" | "Archived";
  riskScore: "Low" | "Medium" | "High";
  version: string;
  updatedAt: string;
  draftedBy: string;
}

interface Policy {
  name: string;
  lastUpdated: string;
  compliance: "Compliant" | "Review Needed" | "Outdated";
  version: string;
  description: string;
}

interface LegalForm {
  id: string;
  name: string;
  purpose: string;
  category: string;
  fields: number;
  lastUsed: string;
}

interface ComplianceDeadline {
  id: string;
  title: string;
  deadline: string;
  daysLeft: number;
  type: "filing" | "renewal" | "review" | "registration";
  assignedTo: string;
  priority: "High" | "Medium" | "Low";
}

// ─── Data ───────────────────────────────────────────────────────────────────
const LEGAL_AIS: LegalAI[] = [
  // Tier 1
  {
    name: "Justice AI",
    role: "Chief Legal Officer",
    tier: 1,
    specialty: "Legal Command & Strategy",
    status: "ACTIVE",
    currentTask:
      "Overseeing quarterly compliance audit across 14 active matters",
    tasksToday: 14,
  },
  // Tier 2
  {
    name: "Lex AI",
    role: "Senior Lawyer — Contracts",
    tier: 2,
    specialty: "Contracts & Agreements",
    status: "ACTIVE",
    currentTask: "Reviewing JDA for Bodakdev commercial project",
    tasksToday: 8,
  },
  {
    name: "Veda AI",
    role: "Senior Lawyer — Compliance",
    tier: 2,
    specialty: "RERA, GST, Company Law",
    status: "PROCESSING",
    currentTask:
      "Monitoring RERA deadline in 8 days — Satellite Township project",
    tasksToday: 11,
  },
  {
    name: "Sutra AI",
    role: "Senior Lawyer — Litigation",
    tier: 2,
    specialty: "Disputes & Court Proceedings",
    status: "ACTIVE",
    currentTask: "Zero active disputes — monitoring all registered complaints",
    tasksToday: 4,
  },
  {
    name: "Niti AI",
    role: "Senior Lawyer — Property Law",
    tier: 2,
    specialty: "Title, Mutation, Conveyance",
    status: "ACTIVE",
    currentTask:
      "Title search for Plot No. 47, Thaltej — encumbrance verification",
    tasksToday: 7,
  },
  {
    name: "Dharma AI",
    role: "Senior Lawyer — Corporate",
    tier: 2,
    specialty: "Company Structure, M&A, Shareholding",
    status: "ACTIVE",
    currentTask: "Preparing board resolution for MSTC Properties LLP inclusion",
    tasksToday: 5,
  },
  {
    name: "Raksha AI",
    role: "Senior Lawyer — Privacy & Data",
    tier: 2,
    specialty: "PDPB, GDPR, Data Agreements",
    status: "ACTIVE",
    currentTask: "Updated Privacy Policy to PDPB v2.1 — published today",
    tasksToday: 6,
  },
  // Tier 3
  {
    name: "Deed Drafter AI",
    role: "Specialist — Deeds",
    tier: 3,
    specialty: "Sale Deeds, Purchase Deeds",
    status: "ACTIVE",
    currentTask: "Drafted sale deed for Unit 4B, Prahlad Nagar",
    tasksToday: 3,
  },
  {
    name: "Agreement Builder AI",
    role: "Specialist — Agreements",
    tier: 3,
    specialty: "Rental, JDA, Leave & License",
    status: "ACTIVE",
    currentTask:
      "Building commercial lease agreement for client Sharma Enterprises",
    tasksToday: 5,
  },
  {
    name: "NDA Guardian AI",
    role: "Specialist — NDAs",
    tier: 3,
    specialty: "Non-Disclosure Agreements",
    status: "ACTIVE",
    currentTask: "Generated 2 NDAs for investor meetings scheduled this week",
    tasksToday: 2,
  },
  {
    name: "Policy Writer AI",
    role: "Specialist — Policies",
    tier: 3,
    specialty: "Privacy, T&C, Cookie, Disclaimer",
    status: "ACTIVE",
    currentTask:
      "Scanning Privacy Policy for PDPB compliance gaps — weekly review",
    tasksToday: 4,
  },
  {
    name: "RERA Counsel AI",
    role: "Specialist — RERA",
    tier: 3,
    specialty: "RERA Registration & Compliance",
    status: "PROCESSING",
    currentTask:
      "Preparing RERA renewal for Bopal Heights — deadline in 8 days",
    tasksToday: 6,
  },
  {
    name: "GST Legal AI",
    role: "Specialist — GST",
    tier: 3,
    specialty: "GST Compliance, Real Estate GST",
    status: "ACTIVE",
    currentTask:
      "Calculating GST liability for 3 under-construction properties",
    tasksToday: 3,
  },
  {
    name: "Notice Drafter AI",
    role: "Specialist — Legal Notices",
    tier: 3,
    specialty: "Demand Notices, Cease & Desist",
    status: "ACTIVE",
    currentTask: "Drafted demand notice for delayed handover — Sanand project",
    tasksToday: 2,
  },
  {
    name: "Response AI",
    role: "Specialist — Legal Replies",
    tier: 3,
    specialty: "Replies to Notices & Disputes",
    status: "IDLE",
    currentTask: "No incoming notices — on standby",
    tasksToday: 0,
  },
  {
    name: "Court Filing AI",
    role: "Specialist — Court Documents",
    tier: 3,
    specialty: "Affidavits, Submissions, Vakalatnama",
    status: "IDLE",
    currentTask: "No active court matters — monitoring for new filings",
    tasksToday: 0,
  },
  {
    name: "Due Diligence AI",
    role: "Specialist — Due Diligence",
    tier: 3,
    specialty: "Property & Deal Due Diligence",
    status: "ACTIVE",
    currentTask: "Running full legal DD on 2-acre parcel, SG Highway",
    tasksToday: 4,
  },
  {
    name: "Title Examiner AI",
    role: "Specialist — Title",
    tier: 3,
    specialty: "Title Chain, Encumbrance",
    status: "ACTIVE",
    currentTask: "Examining 40-year title chain for Shela plot",
    tasksToday: 2,
  },
  {
    name: "Stamp Duty AI",
    role: "Specialist — Stamp Duty",
    tier: 3,
    specialty: "Stamp Duty Calculations, Gujarat",
    status: "ACTIVE",
    currentTask: "Calculated stamp duty for 5 pending registrations",
    tasksToday: 5,
  },
  {
    name: "Registration AI",
    role: "Specialist — Property Registration",
    tier: 3,
    specialty: "Sub-Registrar Process, Documents",
    status: "ACTIVE",
    currentTask: "Prepared checklist for 3 registrations due this month",
    tasksToday: 3,
  },
  {
    name: "Indemnity AI",
    role: "Specialist — Indemnity",
    tier: 3,
    specialty: "Indemnity Bonds, Guarantees",
    status: "ACTIVE",
    currentTask: "Drafted indemnity bond for property redevelopment client",
    tasksToday: 1,
  },
  {
    name: "Power of Attorney AI",
    role: "Specialist — PoA",
    tier: 3,
    specialty: "General & Special PoA Documents",
    status: "ACTIVE",
    currentTask:
      "Created special PoA for NRI client — property registration purpose",
    tasksToday: 2,
  },
  // Tier 4
  {
    name: "Document OCR AI",
    role: "Worker — OCR Processing",
    tier: 4,
    specialty: "Scan & Digitize Legal Documents",
    status: "ACTIVE",
    currentTask: "Processed 12 scanned agreements from morning batch",
    tasksToday: 12,
  },
  {
    name: "Clause Extractor AI",
    role: "Worker — Clause Analysis",
    tier: 4,
    specialty: "Extract Key Clauses Automatically",
    status: "ACTIVE",
    currentTask: "Extracted clauses from 8 uploaded agreements",
    tasksToday: 8,
  },
  {
    name: "Risk Flag AI",
    role: "Worker — Risk Detection",
    tier: 4,
    specialty: "Flag Risky Clauses in Red",
    status: "ACTIVE",
    currentTask: "Flagged 2 medium-risk clauses in new lease agreement",
    tasksToday: 6,
  },
  {
    name: "Deadline Tracker AI",
    role: "Worker — Deadline Management",
    tier: 4,
    specialty: "Legal Deadlines, Renewals, Filings",
    status: "ACTIVE",
    currentTask: "Tracking 18 active deadlines — next critical: RERA in 8 days",
    tasksToday: 18,
  },
  {
    name: "Form Auto-Fill AI",
    role: "Worker — Form Automation",
    tier: 4,
    specialty: "Auto-Populate Forms from Database",
    status: "ACTIVE",
    currentTask: "Pre-filling 4 enquiry forms for scheduled site visits",
    tasksToday: 4,
  },
  {
    name: "Legal Summary AI",
    role: "Worker — Summarization",
    tier: 4,
    specialty: "Summarize Long Documents",
    status: "ACTIVE",
    currentTask: "Summarized 60-page JDA into 2-page executive brief",
    tasksToday: 3,
  },
  {
    name: "Jargon Explainer AI",
    role: "Worker — Plain Language",
    tier: 4,
    specialty: "Legal → Plain English/Hindi/Gujarati",
    status: "ACTIVE",
    currentTask: "Translated 3 clauses to plain Gujarati for client review",
    tasksToday: 7,
  },
  {
    name: "Precedent Search AI",
    role: "Worker — Research",
    tier: 4,
    specialty: "Case Law & Precedent Research",
    status: "ACTIVE",
    currentTask:
      "Searching precedents for delayed possession compensation cases",
    tasksToday: 5,
  },
  {
    name: "Compliance Calendar AI",
    role: "Worker — Calendar",
    tier: 4,
    specialty: "Regulatory Filing Calendar",
    status: "ACTIVE",
    currentTask: "Updated calendar with 6 new GST and RERA deadlines for June",
    tasksToday: 6,
  },
  {
    name: "Audit AI",
    role: "Worker — Legal Audit",
    tier: 4,
    specialty: "Monthly Legal Health Audit",
    status: "ACTIVE",
    currentTask: "Running monthly compliance audit — 94% complete",
    tasksToday: 1,
  },
  {
    name: "Version Control AI",
    role: "Worker — Versioning",
    tier: 4,
    specialty: "Document Version History",
    status: "ACTIVE",
    currentTask: "Logged 7 document edits with full diff tracking today",
    tasksToday: 7,
  },
  {
    name: "Signature Tracker AI",
    role: "Worker — Signatures",
    tier: 4,
    specialty: "Pending & Completed Signatures",
    status: "ACTIVE",
    currentTask: "Tracking 12 pending signatures — 3 overdue by client side",
    tasksToday: 12,
  },
  {
    name: "Renewal Alert AI",
    role: "Worker — Renewals",
    tier: 4,
    specialty: "30/60/90 Day Renewal Alerts",
    status: "ACTIVE",
    currentTask: "Sent 3 renewal alerts this morning — lease and RERA renewals",
    tasksToday: 3,
  },
  {
    name: "Archive AI",
    role: "Worker — Archiving",
    tier: 4,
    specialty: "Auto-Archive Executed Documents",
    status: "ACTIVE",
    currentTask: "Archived 5 completed agreements with metadata tagging",
    tasksToday: 5,
  },
];

const DOCUMENTS: LegalDocument[] = [
  {
    id: "D001",
    name: "Sale Deed — Prahlad Nagar Unit 4B",
    category: "Property Agreements",
    status: "Signed",
    riskScore: "Low",
    version: "v1.2",
    updatedAt: "30 May 2026",
    draftedBy: "Deed Drafter AI",
  },
  {
    id: "D002",
    name: "Commercial Lease — Sharma Enterprises",
    category: "Rental & Lease",
    status: "Review",
    riskScore: "Medium",
    version: "v2.0",
    updatedAt: "29 May 2026",
    draftedBy: "Agreement Builder AI",
  },
  {
    id: "D003",
    name: "NDA — Investor Meeting, June 2026",
    category: "Corporate",
    status: "Signed",
    riskScore: "Low",
    version: "v1.0",
    updatedAt: "28 May 2026",
    draftedBy: "NDA Guardian AI",
  },
  {
    id: "D004",
    name: "Property Purchase Agreement — SG Highway Plot",
    category: "Property Agreements",
    status: "Draft",
    riskScore: "Medium",
    version: "v0.9",
    updatedAt: "27 May 2026",
    draftedBy: "Lex AI",
  },
  {
    id: "D005",
    name: "Privacy Policy v2.1 — MSTC GLOBAL",
    category: "Privacy & Policies",
    status: "Signed",
    riskScore: "Low",
    version: "v2.1",
    updatedAt: "30 May 2026",
    draftedBy: "Policy Writer AI",
  },
  {
    id: "D006",
    name: "RERA Registration — Bopal Heights",
    category: "Regulatory",
    status: "Review",
    riskScore: "High",
    version: "v1.5",
    updatedAt: "26 May 2026",
    draftedBy: "RERA Counsel AI",
  },
  {
    id: "D007",
    name: "Service Agreement — Standard Client",
    category: "Client Facing",
    status: "Signed",
    riskScore: "Low",
    version: "v3.0",
    updatedAt: "25 May 2026",
    draftedBy: "Agreement Builder AI",
  },
  {
    id: "D008",
    name: "Event Participation Waiver — Summer Gala",
    category: "Client Facing",
    status: "Signed",
    riskScore: "Low",
    version: "v1.0",
    updatedAt: "24 May 2026",
    draftedBy: "Agreement Builder AI",
  },
  {
    id: "D009",
    name: "Joint Development Agreement — Anand Township",
    category: "Property Agreements",
    status: "Review",
    riskScore: "High",
    version: "v1.8",
    updatedAt: "23 May 2026",
    draftedBy: "Lex AI",
  },
  {
    id: "D010",
    name: "Demand Notice — Sanand Delayed Handover",
    category: "Legal Notices",
    status: "Signed",
    riskScore: "Medium",
    version: "v1.0",
    updatedAt: "22 May 2026",
    draftedBy: "Notice Drafter AI",
  },
  {
    id: "D011",
    name: "Indemnity Bond — Redevelopment Project",
    category: "Property Agreements",
    status: "Review",
    riskScore: "Medium",
    version: "v1.1",
    updatedAt: "21 May 2026",
    draftedBy: "Indemnity AI",
  },
  {
    id: "D012",
    name: "Special Power of Attorney — NRI Client",
    category: "Property Agreements",
    status: "Draft",
    riskScore: "Low",
    version: "v1.0",
    updatedAt: "20 May 2026",
    draftedBy: "Power of Attorney AI",
  },
];

const POLICIES: Policy[] = [
  {
    name: "Privacy Policy",
    lastUpdated: "30 May 2026",
    compliance: "Compliant",
    version: "v2.1",
    description:
      "PDPB + GDPR compliant — covers data collection, processing, retention, and user rights",
  },
  {
    name: "Terms & Conditions",
    lastUpdated: "15 May 2026",
    compliance: "Compliant",
    version: "v4.3",
    description:
      "Service terms for all MSTC divisions — property, finance, events, hospitality",
  },
  {
    name: "Cookie Policy",
    lastUpdated: "10 May 2026",
    compliance: "Compliant",
    version: "v1.8",
    description:
      "Cookie categorization, consent mechanism, and third-party cookie disclosure",
  },
  {
    name: "Disclaimer",
    lastUpdated: "01 May 2026",
    compliance: "Compliant",
    version: "v2.0",
    description:
      "Property, financial, and general disclaimers for MSTC GLOBAL services",
  },
  {
    name: "Refund & Cancellation Policy",
    lastUpdated: "25 Apr 2026",
    compliance: "Review Needed",
    version: "v1.5",
    description:
      "Refund process for events, bookings, and service fees — update needed post-GST change",
  },
];

const FORMS: LegalForm[] = [
  {
    id: "F001",
    name: "Property Enquiry with Indemnity",
    purpose: "Legal gate before sharing property details",
    category: "Property",
    fields: 14,
    lastUsed: "Today",
  },
  {
    id: "F002",
    name: "Site Visit Authorization",
    purpose: "Permission form before site visits",
    category: "Property",
    fields: 8,
    lastUsed: "Yesterday",
  },
  {
    id: "F003",
    name: "Investment Intent Letter",
    purpose: "Client formal interest in a property",
    category: "Property",
    fields: 12,
    lastUsed: "28 May 2026",
  },
  {
    id: "F004",
    name: "Rental Application Form",
    purpose: "Full tenant screening and verification",
    category: "Rental",
    fields: 22,
    lastUsed: "27 May 2026",
  },
  {
    id: "F005",
    name: "RERA Complaint Form",
    purpose: "Structured complaint against builder",
    category: "Regulatory",
    fields: 18,
    lastUsed: "26 May 2026",
  },
  {
    id: "F006",
    name: "Legal Notice Request",
    purpose: "Client requests MSTC to send legal notice",
    category: "Litigation",
    fields: 10,
    lastUsed: "25 May 2026",
  },
  {
    id: "F007",
    name: "Data Consent Form",
    purpose: "PDPB-compliant data collection consent",
    category: "Privacy",
    fields: 6,
    lastUsed: "Today",
  },
  {
    id: "F008",
    name: "NDA for Business Meetings",
    purpose: "Quick NDA before sensitive discussions",
    category: "Corporate",
    fields: 8,
    lastUsed: "29 May 2026",
  },
  {
    id: "F009",
    name: "Service Agreement Initiation",
    purpose: "Client-MSTC service terms acceptance",
    category: "Client",
    fields: 16,
    lastUsed: "28 May 2026",
  },
  {
    id: "F010",
    name: "Event Participation Waiver",
    purpose: "Liability waiver for all MSTC events",
    category: "Events",
    fields: 9,
    lastUsed: "24 May 2026",
  },
];

const DEADLINES: ComplianceDeadline[] = [
  {
    id: "CD001",
    title: "RERA Renewal — Bopal Heights",
    deadline: "7 Jun 2026",
    daysLeft: 8,
    type: "renewal",
    assignedTo: "RERA Counsel AI + Veda AI",
    priority: "High",
  },
  {
    id: "CD002",
    title: "GST Quarterly Filing (Apr–Jun 2026)",
    deadline: "15 Jun 2026",
    daysLeft: 16,
    type: "filing",
    assignedTo: "GST Legal AI + Veda AI",
    priority: "High",
  },
  {
    id: "CD003",
    title: "Lease Renewal — Anand Client",
    deadline: "28 Jun 2026",
    daysLeft: 29,
    type: "renewal",
    assignedTo: "Renewal Alert AI",
    priority: "Medium",
  },
  {
    id: "CD004",
    title: "Privacy Policy Annual Review",
    deadline: "30 Jun 2026",
    daysLeft: 31,
    type: "review",
    assignedTo: "Policy Writer AI + Raksha AI",
    priority: "Medium",
  },
  {
    id: "CD005",
    title: "Company Annual Return Filing",
    deadline: "30 Sep 2026",
    daysLeft: 123,
    type: "filing",
    assignedTo: "Dharma AI + Veda AI",
    priority: "Low",
  },
  {
    id: "CD006",
    title: "RERA Agent Registration Renewal",
    deadline: "31 Oct 2026",
    daysLeft: 154,
    type: "registration",
    assignedTo: "RERA Counsel AI",
    priority: "Low",
  },
];

// ─── Nav Items ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "ai-team", label: "Legal AI Team", icon: Brain },
  { id: "documents", label: "Document Vault", icon: Archive },
  { id: "policies", label: "Policy Manager", icon: Shield },
  { id: "forms", label: "Form Builder", icon: ClipboardList },
  { id: "calendar", label: "Compliance Calendar", icon: Calendar },
] as const;

type TabId = (typeof NAV_ITEMS)[number]["id"];

// ─── Sub-Components ──────────────────────────────────────────────────────────
function StatusDot({ status }: { status: LegalAI["status"] }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${
        status === "ACTIVE"
          ? "bg-[oklch(0.7_0.18_148)]"
          : status === "PROCESSING"
            ? "bg-[oklch(0.72_0.18_76)] animate-pulse"
            : "bg-[oklch(0.5_0.04_270)]"
      }`}
    />
  );
}

function TierBadge({ tier }: { tier: 1 | 2 | 3 | 4 }) {
  const labels = {
    1: "TIER 1 · CLO",
    2: "TIER 2 · SENIOR",
    3: "TIER 3 · SPECIALIST",
    4: "TIER 4 · WORKER",
  };
  const colors = {
    1: "border-[oklch(0.72_0.18_76)] bg-[oklch(0.72_0.18_76/0.15)] text-[oklch(0.78_0.16_78)]",
    2: "border-[oklch(0.65_0.17_74)] bg-[oklch(0.65_0.17_74/0.12)] text-[oklch(0.72_0.14_76)]",
    3: "border-[oklch(0.55_0.14_72)] bg-[oklch(0.55_0.14_72/0.10)] text-[oklch(0.62_0.12_74)]",
    4: "border-[oklch(0.42_0.08_70)] bg-[oklch(0.42_0.08_70/0.10)] text-[oklch(0.55_0.08_72)]",
  };
  return (
    <span
      className={`text-[9px] font-mono font-bold border rounded px-1.5 py-0.5 ${
        colors[tier]
      }`}
    >
      {labels[tier]}
    </span>
  );
}

function DocStatusBadge({ status }: { status: LegalDocument["status"] }) {
  const map: Record<LegalDocument["status"], string> = {
    Draft:
      "bg-[oklch(0.6_0.06_270/0.2)] text-[oklch(0.7_0.06_270)] border-[oklch(0.5_0.05_270/0.4)]",
    Review:
      "bg-[oklch(0.72_0.18_76/0.2)] text-[oklch(0.78_0.16_78)] border-[oklch(0.65_0.17_74/0.4)]",
    Signed:
      "bg-[oklch(0.7_0.18_148/0.2)] text-[oklch(0.7_0.18_148)] border-[oklch(0.6_0.16_148/0.4)]",
    Archived:
      "bg-[oklch(0.4_0.04_70/0.2)] text-[oklch(0.55_0.06_72)] border-[oklch(0.35_0.04_70/0.4)]",
  };
  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
        map[status]
      }`}
    >
      {status}
    </span>
  );
}

function RiskBadge({ risk }: { risk: LegalDocument["riskScore"] }) {
  const map: Record<LegalDocument["riskScore"], string> = {
    Low: "text-[oklch(0.7_0.18_148)]",
    Medium: "text-[oklch(0.72_0.18_76)]",
    High: "text-[oklch(0.704_0.191_22.216)]",
  };
  return <span className={`text-xs font-semibold ${map[risk]}`}>{risk}</span>;
}

function PriorityBadge({
  priority,
}: {
  priority: ComplianceDeadline["priority"];
}) {
  const map: Record<ComplianceDeadline["priority"], string> = {
    High: "bg-[oklch(0.704_0.191_22.216/0.15)] text-[oklch(0.704_0.191_22.216)] border-[oklch(0.704_0.191_22.216/0.4)]",
    Medium:
      "bg-[oklch(0.72_0.18_76/0.15)] text-[oklch(0.78_0.16_78)] border-[oklch(0.65_0.17_74/0.4)]",
    Low: "bg-[oklch(0.7_0.18_148/0.15)] text-[oklch(0.7_0.18_148)] border-[oklch(0.6_0.16_148/0.4)]",
  };
  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
        map[priority]
      }`}
    >
      {priority}
    </span>
  );
}

function DeadlineTypeIcon({
  type,
}: {
  type: ComplianceDeadline["type"];
}) {
  const icons = {
    filing: FileText,
    renewal: RefreshCw,
    review: Eye,
    registration: FileCheck,
  };
  const Icon = icons[type];
  return <Icon className="w-4 h-4 text-muted-foreground" />;
}

// ─── Sections ────────────────────────────────────────────────────────────────
function DashboardSection() {
  const stats = [
    {
      label: "Legal Health Score",
      value: "96/100",
      sub: "FORTRESS STRONG",
      icon: Shield,
      color: "text-[oklch(0.7_0.18_148)]",
    },
    {
      label: "Active Documents",
      value: "847",
      sub: "+12 this week",
      icon: Archive,
      color: "text-primary",
    },
    {
      label: "Pending Signatures",
      value: "12",
      sub: "3 overdue",
      icon: PenTool,
      color: "text-[oklch(0.72_0.18_76)]",
    },
    {
      label: "Expiring (30 days)",
      value: "3",
      sub: "Review needed",
      icon: AlertCircle,
      color: "text-[oklch(0.704_0.191_22.216)]",
    },
    {
      label: "Open Legal Issues",
      value: "0",
      sub: "All clear",
      icon: CheckCircle2,
      color: "text-[oklch(0.7_0.18_148)]",
    },
    {
      label: "Compliance Status",
      value: "COMPLIANT",
      sub: "Last audit: today",
      icon: FileCheck,
      color: "text-[oklch(0.7_0.18_148)]",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="bg-card border-gold-800/30 p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted/50">
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`font-bold text-lg leading-tight ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-[11px] text-muted-foreground font-sans">
                  {s.label}
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                  {s.sub}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card border-gold-800/30 p-4">
          <h3 className="font-serif font-semibold text-sm text-primary mb-3">
            Recent Legal AI Activity
          </h3>
          <div className="space-y-2">
            {[
              {
                ai: "Deed Drafter AI",
                action: "Drafted sale deed for Unit 4B, Prahlad Nagar",
                time: "12:34",
              },
              {
                ai: "Renewal Alert AI",
                action: "Sent alert — Anand client lease expires in 28 days",
                time: "11:52",
              },
              {
                ai: "Policy Writer AI",
                action: "Updated Privacy Policy to PDPB v2.1 — published",
                time: "10:18",
              },
              {
                ai: "Compliance Calendar AI",
                action: "GST filing due in 16 days — reminder scheduled",
                time: "09:45",
              },
              {
                ai: "Risk Flag AI",
                action: "Flagged 2 medium-risk clauses in commercial lease",
                time: "08:30",
              },
            ].map((a) => (
              <div
                key={a.time + a.ai}
                className="flex items-start gap-2 py-1.5 border-b border-border/30 last:border-0"
              >
                <span className="text-[10px] text-muted-foreground/60 w-10 shrink-0 pt-0.5">
                  {a.time}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-primary">
                    {a.ai}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {" "}
                    — {a.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-card border-gold-800/30 p-4">
          <h3 className="font-serif font-semibold text-sm text-primary mb-3">
            Upcoming Critical Deadlines
          </h3>
          <div className="space-y-2">
            {DEADLINES.slice(0, 4).map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 py-1.5 border-b border-border/30 last:border-0"
              >
                <div
                  className={`text-center shrink-0 w-10 ${
                    d.daysLeft <= 10
                      ? "text-[oklch(0.704_0.191_22.216)]"
                      : d.daysLeft <= 30
                        ? "text-primary"
                        : "text-muted-foreground"
                  }`}
                >
                  <p className="text-base font-bold leading-none">
                    {d.daysLeft}
                  </p>
                  <p className="text-[9px] uppercase tracking-wide">days</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground truncate">
                    {d.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {d.deadline}
                  </p>
                </div>
                <PriorityBadge priority={d.priority} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AITeamSection() {
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState<number | null>(null);

  const filtered = LEGAL_AIS.filter((ai) => {
    const matchSearch =
      ai.name.toLowerCase().includes(search.toLowerCase()) ||
      ai.role.toLowerCase().includes(search.toLowerCase());
    const matchTier = filterTier === null || ai.tier === filterTier;
    return matchSearch && matchTier;
  });

  const tierGroups = [1, 2, 3, 4] as const;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full bg-card border border-border/60 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
            placeholder="Search legal AI agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="legal.ai_search_input"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {([null, 1, 2, 3, 4] as const).map((t) => (
            <button
              key={t ?? "all"}
              type="button"
              onClick={() => setFilterTier(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filterTier === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border/60 text-muted-foreground hover:border-primary/40"
              }`}
              data-ocid={`legal.ai_tier_filter.${t ?? "all"}`}
            >
              {t === null ? "All" : `Tier ${t}`}
            </button>
          ))}
        </div>
      </div>

      {(filterTier !== null ? [filterTier] : [...tierGroups]).map((tier) => {
        const agents = filtered.filter((a) => a.tier === tier);
        if (agents.length === 0) return null;
        const tierLabel =
          tier === 1
            ? "Tier 1 — Chief Legal Officer"
            : tier === 2
              ? "Tier 2 — Senior Lawyer AIs"
              : tier === 3
                ? "Tier 3 — Specialist Lawyer AIs"
                : "Tier 4 — Worker Legal AIs";
        return (
          <div key={tier}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                {tierLabel}
              </span>
              <div className="flex-1 border-t border-gold-800/20" />
              <span className="text-[10px] text-muted-foreground">
                {agents.length} agent{agents.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {agents.map((ai, i) => (
                <Card
                  key={ai.name}
                  className="bg-card border-gold-800/30 p-4 hover:border-gold-600/50 transition-all duration-200"
                  data-ocid={`legal.ai_card.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <StatusDot status={ai.status} />
                        <h4 className="font-serif font-bold text-sm text-primary truncate">
                          {ai.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-sans mt-0.5 truncate">
                        {ai.role}
                      </p>
                    </div>
                    <TierBadge tier={ai.tier} />
                  </div>
                  <div className="text-[10px] text-muted-foreground/70 mb-2 font-mono">
                    ⚡ {ai.specialty}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {ai.currentTask}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/20">
                    <span
                      className={`text-[10px] font-medium ${
                        ai.status === "ACTIVE"
                          ? "text-[oklch(0.7_0.18_148)]"
                          : ai.status === "PROCESSING"
                            ? "text-primary"
                            : "text-muted-foreground"
                      }`}
                    >
                      {ai.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {ai.tasksToday} tasks today
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DocumentVaultSection() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filtered = DOCUMENTS.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full bg-card border border-border/60 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="legal.doc_search_input"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Draft", "Review", "Signed", "Archived"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filterStatus === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border/60 text-muted-foreground hover:border-primary/40"
              }`}
              data-ocid={`legal.doc_filter.${s.toLowerCase()}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} document{filtered.length !== 1 ? "s" : ""} found
        </p>
        <Button size="sm" className="gap-1.5" data-ocid="legal.upload_button">
          <Upload className="w-3.5 h-3.5" /> Upload Document
        </Button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gold-800/30">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b border-border/40">
              {[
                "Document",
                "Category",
                "Status",
                "Risk",
                "Ver.",
                "Updated",
                "Drafted By",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {filtered.map((doc, i) => (
              <tr
                key={doc.id}
                className="hover:bg-muted/20 transition-colors"
                data-ocid={`legal.doc_row.${i + 1}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-medium text-foreground text-sm">
                      {doc.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                  {doc.category}
                </td>
                <td className="px-4 py-3">
                  <DocStatusBadge status={doc.status} />
                </td>
                <td className="px-4 py-3">
                  <RiskBadge risk={doc.riskScore} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                  {doc.version}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                  {doc.updatedAt}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {doc.draftedBy}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                      data-ocid={`legal.doc_view.${i + 1}`}
                      aria-label="View document"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                      data-ocid={`legal.doc_download.${i + 1}`}
                      aria-label="Download document"
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

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((doc, i) => (
          <Card
            key={doc.id}
            className="bg-card border-gold-800/30 p-4"
            data-ocid={`legal.doc_card.${i + 1}`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <p className="text-sm font-medium text-foreground truncate">
                  {doc.name}
                </p>
              </div>
              <DocStatusBadge status={doc.status} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground mb-3">
              <span>{doc.category}</span>
              <span>
                Risk: <RiskBadge risk={doc.riskScore} />
              </span>
              <span>
                {doc.version} · {doc.updatedAt}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1.5 text-xs h-8"
                data-ocid={`legal.doc_view_mobile.${i + 1}`}
              >
                <Eye className="w-3 h-3" /> View
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1.5 text-xs h-8"
                data-ocid={`legal.doc_download_mobile.${i + 1}`}
              >
                <Download className="w-3 h-3" /> Download
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PolicyManagerSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          5 public-facing policies — AI-maintained and version-controlled
        </p>
        <Button
          size="sm"
          className="gap-1.5"
          data-ocid="legal.add_policy_button"
        >
          <Plus className="w-3.5 h-3.5" /> Add Policy
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {POLICIES.map((policy, i) => (
          <Card
            key={policy.name}
            className="bg-card border-gold-800/30 p-5"
            data-ocid={`legal.policy_card.${i + 1}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-serif font-bold text-base text-foreground">
                    {policy.name}
                  </h3>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {policy.version}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                      policy.compliance === "Compliant"
                        ? "bg-[oklch(0.7_0.18_148/0.15)] text-[oklch(0.7_0.18_148)] border-[oklch(0.6_0.16_148/0.4)]"
                        : "bg-[oklch(0.72_0.18_76/0.15)] text-[oklch(0.78_0.16_78)] border-[oklch(0.65_0.17_74/0.4)]"
                    }`}
                  >
                    {policy.compliance}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {policy.description}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  Last updated: {policy.lastUpdated}
                </p>
              </div>
              <div className="flex sm:flex-col gap-2 shrink-0">
                <Button
                  size="sm"
                  className="gap-1.5 text-xs"
                  data-ocid={`legal.policy_publish.${i + 1}`}
                >
                  <Upload className="w-3 h-3" /> Publish
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs"
                  data-ocid={`legal.policy_edit.${i + 1}`}
                >
                  <PenTool className="w-3 h-3" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs"
                  data-ocid={`legal.policy_history.${i + 1}`}
                >
                  <Clock className="w-3 h-3" /> History
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FormBuilderSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          10 pre-built legal forms — mobile-friendly with mandatory indemnity
          checkbox
        </p>
        <Button
          size="sm"
          className="gap-1.5"
          data-ocid="legal.create_form_button"
        >
          <Plus className="w-3.5 h-3.5" /> Create Form
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FORMS.map((form, i) => (
          <Card
            key={form.id}
            className="bg-card border-gold-800/30 p-4 hover:border-gold-600/50 transition-colors"
            data-ocid={`legal.form_card.${i + 1}`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">
                    {form.category}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-foreground">
                  {form.name}
                </h4>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{form.purpose}</p>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-3">
              <span>{form.fields} fields</span>
              <span>Last used: {form.lastUsed}</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1.5 text-xs h-8"
                data-ocid={`legal.form_view.${i + 1}`}
              >
                <Eye className="w-3 h-3" /> View
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1.5 text-xs h-8"
                data-ocid={`legal.form_download.${i + 1}`}
              >
                <Download className="w-3 h-3" /> Download
              </Button>
              <Button
                size="sm"
                className="flex-1 gap-1.5 text-xs h-8"
                data-ocid={`legal.form_use.${i + 1}`}
              >
                <Zap className="w-3 h-3" /> Use
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ComplianceCalendarSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Tracked by Compliance Calendar AI + Deadline Tracker AI
        </p>
        <Button
          size="sm"
          className="gap-1.5"
          data-ocid="legal.add_deadline_button"
        >
          <Plus className="w-3.5 h-3.5" /> Add Deadline
        </Button>
      </div>

      <div className="space-y-3">
        {DEADLINES.map((d, i) => (
          <Card
            key={d.id}
            className={`bg-card border p-4 transition-colors ${
              d.daysLeft <= 10
                ? "border-[oklch(0.704_0.191_22.216/0.5)]"
                : d.daysLeft <= 30
                  ? "border-gold-600/50"
                  : "border-gold-800/30"
            }`}
            data-ocid={`legal.deadline_card.${i + 1}`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border shrink-0 ${
                  d.daysLeft <= 10
                    ? "bg-[oklch(0.704_0.191_22.216/0.1)] border-[oklch(0.704_0.191_22.216/0.4)]"
                    : d.daysLeft <= 30
                      ? "bg-primary/10 border-primary/30"
                      : "bg-muted/50 border-border/40"
                }`}
              >
                <span
                  className={`text-xl font-bold leading-none ${
                    d.daysLeft <= 10
                      ? "text-[oklch(0.704_0.191_22.216)]"
                      : d.daysLeft <= 30
                        ? "text-primary"
                        : "text-muted-foreground"
                  }`}
                >
                  {d.daysLeft}
                </span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wide">
                  days
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                  <h4 className="font-serif font-semibold text-sm text-foreground">
                    {d.title}
                  </h4>
                  <PriorityBadge priority={d.priority} />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <DeadlineTypeIcon type={d.type} />
                  <span className="capitalize">{d.type}</span>
                  <span>·</span>
                  <span>{d.deadline}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Assigned to: {d.assignedTo}
                </p>
              </div>
            </div>
            {d.daysLeft <= 10 && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-[oklch(0.704_0.191_22.216)] bg-[oklch(0.704_0.191_22.216/0.08)] rounded-lg px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Urgent — action required within {d.daysLeft} days</span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function LegalitiesAppPage() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeName =
    NAV_ITEMS.find((n) => n.id === activeTab)?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-gold-800/40 shadow-sm">
        <div className="flex items-center h-14 px-4 gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors lg:hidden"
            aria-label="Toggle menu"
            data-ocid="legal.menu_toggle"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Scale className="w-5 h-5 text-primary shrink-0" />
            <div className="min-w-0">
              <h1 className="font-serif font-bold text-sm text-primary leading-none">
                MSTC LEGAL COMMAND
              </h1>
              <p className="text-[10px] text-muted-foreground font-mono">
                30 Legal AIs · Fully Active
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[oklch(0.7_0.18_148/0.1)] border border-[oklch(0.7_0.18_148/0.3)]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.7_0.18_148)]" />
            <span className="text-[11px] font-semibold text-[oklch(0.7_0.18_148)]">
              FULLY COMPLIANT
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Settings"
              data-ocid="legal.settings_button"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
            <a
              href="/master"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Back to Master Control"
              data-ocid="legal.back_button"
            >
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            role="presentation"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col flex-shrink-0 w-64 bg-card border-r border-gold-800/30">
          {/* Sidebar Header with X button */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-gold-800/20 shrink-0">
            <span className="font-serif font-semibold text-sm text-primary">
              Navigation
            </span>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors lg:hidden"
              aria-label="Close sidebar"
              data-ocid="legal.sidebar_close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Legal Health Score */}
          <div className="m-3 p-3 rounded-xl bg-[oklch(0.7_0.18_148/0.08)] border border-[oklch(0.7_0.18_148/0.2)]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Legal Health Score
              </span>
              <span className="text-[11px] font-bold text-[oklch(0.7_0.18_148)]">
                96/100
              </span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-[oklch(0.7_0.18_148)]"
                style={{ width: "96%" }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground/70 mt-1">
              FORTRESS STRONG
            </p>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                    activeTab === item.id
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
                  }`}
                  data-ocid={`legal.nav.${item.id}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                  {activeTab === item.id && (
                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-gold-800/20 shrink-0">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <Lock className="w-3 h-3 text-primary" />
              <span>Secured · Biometric Active</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
              <Users className="w-3 h-3" />
              <span>30 Legal AIs · 0 issues</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 lg:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
              <a
                href="/master"
                className="hover:text-primary transition-colors"
                data-ocid="legal.breadcrumb_master"
              >
                Master Control
              </a>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground font-medium">{activeName}</span>
            </div>

            {/* Section Title */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif font-bold text-xl lg:text-2xl text-primary">
                  {activeName}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {activeTab === "dashboard" &&
                    "Legal operations overview — all 30 AIs active"}
                  {activeTab === "ai-team" &&
                    "Complete legal AI hierarchy across 4 tiers"}
                  {activeTab === "documents" &&
                    "Document vault — 847 documents, AI-classified and version-controlled"}
                  {activeTab === "policies" &&
                    "Public-facing policies — AI-maintained, one-click publish"}
                  {activeTab === "forms" &&
                    "Pre-built legal forms — mobile-ready with mandatory indemnity"}
                  {activeTab === "calendar" &&
                    "Regulatory deadlines tracked 24/7 by Compliance Calendar AI"}
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Active Issues</p>
                  <p className="text-sm font-bold text-[oklch(0.7_0.18_148)]">
                    0
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    Pending Signatures
                  </p>
                  <p className="text-sm font-bold text-primary">12</p>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "dashboard" && <DashboardSection />}
            {activeTab === "ai-team" && <AITeamSection />}
            {activeTab === "documents" && <DocumentVaultSection />}
            {activeTab === "policies" && <PolicyManagerSection />}
            {activeTab === "forms" && <FormBuilderSection />}
            {activeTab === "calendar" && <ComplianceCalendarSection />}
          </div>
        </main>
      </div>
    </div>
  );
}
