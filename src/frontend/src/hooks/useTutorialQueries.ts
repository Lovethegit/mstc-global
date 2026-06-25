import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { TutorialStep } from "../backend.d";
import { useActor } from "./useActor";

// ── Default tutorial content ──────────────────────────────────────────────────

export type TutorialMode = "quick" | "full";

export interface TutorialStepLocal {
  title: string;
  content: string;
  targetElement: string | null;
}

interface TutorialDef {
  quick: TutorialStepLocal[];
  full: TutorialStepLocal[];
}

export const DEFAULT_TUTORIALS: Record<string, TutorialDef> = {
  home: {
    quick: [
      {
        title: "Welcome to MSTC GLOBAL",
        content:
          "Your luxury conglomerate platform. Explore 8 core service divisions all in one place.",
        targetElement: null,
      },
      {
        title: "Explore Our 8 Service Divisions",
        content:
          "From Infrastructure & Property to Music & Culture — click any service card to dive in.",
        targetElement: "#services",
      },
      {
        title: "Chat with Our AI Assistant",
        content:
          "The gold chat button at the bottom-right connects you to our AI concierge — available 24/7.",
        targetElement: null,
      },
      {
        title: "Install the App",
        content:
          "Tap 'Install MSTC App' below the brochure button to add this to your home screen for offline access.",
        targetElement: null,
      },
    ],
    full: [
      {
        title: "Welcome to MSTC GLOBAL",
        content:
          "MSTC GLOBAL is a diversified luxury conglomerate led by Love Vijaybhai Parekh, MD. This portal is your gateway to all services.",
        targetElement: null,
      },
      {
        title: "Navigation Menu",
        content:
          "Use the top navigation bar to access all 8 service divisions. On mobile, tap the hamburger icon.",
        targetElement: "header",
      },
      {
        title: "Hero Section",
        content:
          "The hero section displays our brand promise and lets you download our corporate brochure or contact us directly.",
        targetElement: "#hero",
      },
      {
        title: "8 Core Service Divisions",
        content:
          "Each card represents a major business vertical. Click to explore inner pages, tools, and forms for that division.",
        targetElement: "#services",
      },
      {
        title: "About & Leadership",
        content:
          "Learn about MSTC GLOBAL and our Managing Director, Love Vijaybhai Parekh, in the About section.",
        targetElement: "#about",
      },
      {
        title: "Live Market News",
        content:
          "The General section streams live real-estate and business news curated for Ahmedabad & Gujarat.",
        targetElement: null,
      },
      {
        title: "Contact & Support",
        content:
          "Reach us at +91 9512609016 or via WhatsApp. The Contact section has all methods and business hours.",
        targetElement: "#contact",
      },
      {
        title: "AI Chat Assistant",
        content:
          "Our AI concierge handles property queries, bookings, legal questions and more — in real time.",
        targetElement: null,
      },
      {
        title: "Install as a PWA",
        content:
          "Install MSTC GLOBAL as a Progressive Web App for a full app-like experience — works offline too.",
        targetElement: null,
      },
    ],
  },
  admin: {
    quick: [
      {
        title: "Admin Dashboard",
        content:
          "Central control for all MSTC operations. Only authorised personnel can access this area.",
        targetElement: null,
      },
      {
        title: "Manage Leads & Submissions",
        content:
          "View, search and export all enquiries, form submissions and lead data from this dashboard.",
        targetElement: null,
      },
      {
        title: "Chat History",
        content:
          "Review every AI chat interaction, search by keyword, and export conversation logs.",
        targetElement: null,
      },
      {
        title: "Secure Logout",
        content:
          "Always logout when finished. Your session is protected with role-based access controls.",
        targetElement: null,
      },
    ],
    full: [
      {
        title: "Admin Dashboard Overview",
        content:
          "This is the MSTC GLOBAL admin hub. All operations, leads, chat history and analytics are here.",
        targetElement: null,
      },
      {
        title: "Tab Navigation",
        content:
          "Switch between Overview, Interactions, Submissions, Properties and Analytics using the tabs.",
        targetElement: null,
      },
      {
        title: "Overview Tab",
        content:
          "The Overview shows live stats: total interactions, leads, properties and chat response rate.",
        targetElement: null,
      },
      {
        title: "Interactions Tab",
        content:
          "All AI chat logs are here. Search, filter and export. Click a row to see the full conversation.",
        targetElement: null,
      },
      {
        title: "Service Submissions",
        content:
          "Every form submitted across all 8 divisions lands here — searchable and filterable by category.",
        targetElement: null,
      },
      {
        title: "Property Manager",
        content:
          "Add, edit, import via Excel, bulk update prices, or archive listings — all from the Properties tab.",
        targetElement: null,
      },
      {
        title: "Analytics",
        content:
          "Track lead conversion, service popularity, and submission trends over time.",
        targetElement: null,
      },
    ],
  },
  properties: {
    quick: [
      {
        title: "Property Portal",
        content:
          "Browse all MSTC GLOBAL properties — residential, commercial and industrial listings.",
        targetElement: null,
      },
      {
        title: "Search & Filter",
        content:
          "Use the filters at the top to narrow by type, location, price range and status.",
        targetElement: null,
      },
      {
        title: "Property Cards",
        content:
          "Each card shows key details. Click for full specifications, location and enquiry form.",
        targetElement: null,
      },
      {
        title: "Enquire on WhatsApp",
        content:
          "Tap the WhatsApp button on any listing to send a direct message to our property team.",
        targetElement: null,
      },
    ],
    full: [
      {
        title: "MSTC Property Portal",
        content:
          "This portal hosts all MSTC GLOBAL property listings — curated, verified, and regularly updated.",
        targetElement: null,
      },
      {
        title: "Filter by Category",
        content:
          "Choose Residential, Commercial, Industrial or Land using the category filter tabs.",
        targetElement: null,
      },
      {
        title: "Search by Keyword",
        content:
          "Search by area name, project name or property type. Results update instantly.",
        targetElement: null,
      },
      {
        title: "Sort Options",
        content:
          "Sort by Newest, Price (Low→High), Price (High→Low) or by Area to find your match faster.",
        targetElement: null,
      },
      {
        title: "Property Detail Card",
        content:
          "Every card shows RERA status, possession date, price per sq ft and key highlights.",
        targetElement: null,
      },
      {
        title: "Direct Enquiry",
        content:
          "Tap the enquiry button to fill a privacy-gated form. Your details stay confidential.",
        targetElement: null,
      },
      {
        title: "EMI & Stamp Duty Tools",
        content:
          "Use the built-in calculators to estimate your EMI, stamp duty and registration costs.",
        targetElement: null,
      },
    ],
  },
  crm: {
    quick: [
      {
        title: "CRM — Lead Pipeline",
        content:
          "All leads across all services are here. AI scores every lead automatically.",
        targetElement: null,
      },
      {
        title: "Pipeline Stages",
        content:
          "Move leads through: New → Qualified → Site Visit → Negotiation → Deal → Post-Sale.",
        targetElement: null,
      },
      {
        title: "AI Lead Scoring",
        content:
          "Each lead has a Hot / Warm / Cold / Spam score assigned by AI based on behaviour.",
        targetElement: null,
      },
      {
        title: "Quick Actions",
        content:
          "Click any lead to update stage, add a note, schedule a follow-up or open WhatsApp.",
        targetElement: null,
      },
    ],
    full: [
      {
        title: "CRM Overview",
        content:
          "The MSTC CRM tracks every lead from all 8 service divisions in one unified pipeline.",
        targetElement: null,
      },
      {
        title: "Kanban vs List View",
        content:
          "Switch between Kanban (visual pipeline) and List (sortable table) using the view toggle.",
        targetElement: null,
      },
      {
        title: "AI Lead Intelligence",
        content:
          "Every lead is scored 0–100 by AI. Red = hot, Blue = cold. The score updates with each interaction.",
        targetElement: null,
      },
      {
        title: "Adding a Lead Manually",
        content:
          "Tap '+ Add Lead' to create a manual entry. Set source, service category and initial stage.",
        targetElement: null,
      },
      {
        title: "Follow-Up Sequences",
        content:
          "Assign an automated follow-up sequence — AI sends reminders at 1, 3, 7 and 14 day intervals.",
        targetElement: null,
      },
      {
        title: "Search & Filter",
        content:
          "Filter by stage, source, service category, AI score range or assigned staff member.",
        targetElement: null,
      },
      {
        title: "Bulk Actions",
        content:
          "Select multiple leads and apply bulk: stage update, export to CSV, or assign to staff.",
        targetElement: null,
      },
      {
        title: "Lead Detail View",
        content:
          "Click any lead to see full history, all interactions, notes, documents and relationship map.",
        targetElement: null,
      },
    ],
  },
  security: {
    quick: [
      {
        title: "Security Command Center",
        content:
          "Monitor 52+ Security AIs protecting the entire MSTC ecosystem in real time.",
        targetElement: null,
      },
      {
        title: "Security Score",
        content:
          "Live score (0–100) shows the platform's overall security health. Green = safe.",
        targetElement: null,
      },
      {
        title: "AI Status Board",
        content:
          "All active Security AIs are listed with live status, tasks handled today and alert count.",
        targetElement: null,
      },
      {
        title: "Incident Log",
        content:
          "All security events — blocked, resolved or active — are logged here with timestamps.",
        targetElement: null,
      },
    ],
    full: [
      {
        title: "Security Fortress",
        content:
          "MSTC GLOBAL's security layer has 52 specialised AIs across 7 tiers — Perimeter, Identity, Internal, Data, Threat Intelligence, Incident Response, and Improvement.",
        targetElement: null,
      },
      {
        title: "Live Threat Map",
        content:
          "The world map shows where threats are being detected and blocked in real time.",
        targetElement: null,
      },
      {
        title: "Security Score Breakdown",
        content:
          "Tap the score to see a breakdown by tier — which areas are strongest and which need attention.",
        targetElement: null,
      },
      {
        title: "Perimeter Defense AIs",
        content:
          "8 AIs including GateKeeper, Bot Hunter and DDoS Shield watch all incoming traffic.",
        targetElement: null,
      },
      {
        title: "Identity & Access AIs",
        content:
          "Biometric Verifier, Session Guardian and Device Fingerprint AI ensure only authorised access.",
        targetElement: null,
      },
      {
        title: "Incident Response AIs",
        content:
          "On any breach, Incident Commander AI takes charge in milliseconds — you are notified instantly.",
        targetElement: null,
      },
      {
        title: "Red Team & Penetration Testing",
        content:
          "Red Team AI continuously probes the platform for weaknesses. Results appear in the Audit tab.",
        targetElement: null,
      },
      {
        title: "Access Control Panel",
        content:
          "Manage all user credentials, observer codes and role assignments from the Access Manager.",
        targetElement: null,
      },
    ],
  },
  "legal-command": {
    quick: [
      {
        title: "Legal Command Centre",
        content:
          "A full AI-powered legal department with 30 specialised legal AIs working for MSTC GLOBAL.",
        targetElement: null,
      },
      {
        title: "Document Vault",
        content:
          "All legal documents — contracts, deeds, policies, notices — stored, versioned and searchable.",
        targetElement: null,
      },
      {
        title: "AI Policy Manager",
        content:
          "Privacy Policy, Terms & Conditions and all public policies — maintained live by AI, one-click publish.",
        targetElement: null,
      },
      {
        title: "Legal Form Builder",
        content:
          "Create or use pre-built legal forms with e-signature, PDF export and indemnity checkboxes.",
        targetElement: null,
      },
    ],
    full: [
      {
        title: "Legal Command Overview",
        content:
          "This is your complete AI legal department. Justice AI (CLO) oversees all legal work 24/7.",
        targetElement: null,
      },
      {
        title: "Legal AI Hierarchy",
        content:
          "Justice AI → 6 Senior Lawyers (Lex, Veda, Sutra, Niti, Dharma, Raksha) → 15 Specialists → 14 Workers.",
        targetElement: null,
      },
      {
        title: "Document Vault",
        content:
          "847+ documents organised by category. Each has version history, risk score, signature status.",
        targetElement: null,
      },
      {
        title: "Policy Manager",
        content:
          "All public-facing policies live here. Raksha AI keeps them PDPB & GDPR compliant automatically.",
        targetElement: null,
      },
      {
        title: "Legal Form Builder",
        content:
          "Drag-drop form creator with 50+ field types, smart logic, e-signature and PDF generation.",
        targetElement: null,
      },
      {
        title: "Due Diligence AI",
        content:
          "Paste any property address — Due Diligence AI runs a full title, encumbrance and RERA check.",
        targetElement: null,
      },
      {
        title: "Compliance Calendar",
        content:
          "All RERA deadlines, GST filing dates, renewal alerts — in one AI-maintained calendar.",
        targetElement: null,
      },
      {
        title: "Legal Health Score",
        content:
          "A live score shows overall legal compliance health. Tap to see what's contributing to the score.",
        targetElement: null,
      },
    ],
  },
  observe: {
    quick: [
      {
        title: "Welcome, Observer",
        content:
          "You have been granted limited read-only access to the MSTC GLOBAL universe. No actions can be taken.",
        targetElement: null,
      },
      {
        title: "What You Can See",
        content:
          "The panels visible to you show live data from the parts of the platform your access code permits.",
        targetElement: null,
      },
      {
        title: "Observer Mode Badge",
        content:
          "The OBSERVER badge in the top corner confirms your view-only status at all times.",
        targetElement: null,
      },
      {
        title: "Confidentiality",
        content:
          "All panels are watermarked MSTC GLOBAL CONFIDENTIAL. Screenshots retain this watermark.",
        targetElement: null,
      },
    ],
    full: [
      {
        title: "Observer Access — Welcome",
        content:
          "You are viewing the live MSTC GLOBAL operations through a secure, read-only glass.",
        targetElement: null,
      },
      {
        title: "Your Access Level",
        content:
          "Your observer code grants access to specific panels. Other parts of the platform remain hidden.",
        targetElement: null,
      },
      {
        title: "Live Data",
        content:
          "All metrics, AI activity feeds and status indicators show real, live data — refreshed continuously.",
        targetElement: null,
      },
      {
        title: "AI Operations Panel",
        content:
          "If visible, this shows 2,000+ AIs and their current tasks. Blue = active, Grey = idle.",
        targetElement: null,
      },
      {
        title: "Business Metrics Panel",
        content:
          "If visible, key metrics show leads, conversions and service performance — no client details shown.",
        targetElement: null,
      },
      {
        title: "Security Status Panel",
        content:
          "If visible, shows the current security score and threat activity — no credential data is shown.",
        targetElement: null,
      },
      {
        title: "Watermark & Confidentiality",
        content:
          "All screens are watermarked. Sharing this view without authorisation violates your access agreement.",
        targetElement: null,
      },
      {
        title: "Code Expiry",
        content:
          "Your access code may expire. When it does, this view will close automatically.",
        targetElement: null,
      },
    ],
  },
  master: {
    quick: [
      {
        title: "Master Control",
        content:
          "This is your command throne. Every AI, every app, every metric — visible and controllable here.",
        targetElement: null,
      },
      {
        title: "Decision Queue",
        content:
          "AIs escalate decisions here. Tap Approve or Reject — each item has AI's recommendation pre-written.",
        targetElement: null,
      },
      {
        title: "Global Command Bar",
        content:
          "Type or speak any instruction at the bottom — AI executes it across any app instantly.",
        targetElement: null,
      },
      {
        title: "AI Status Board",
        content:
          "All 10 GM AIs and Aria (Chief AI) show their current focus and today's actions.",
        targetElement: null,
      },
    ],
    full: [
      {
        title: "Master Control — Your Universe",
        content:
          "You are the sole owner of this view. Every app, AI and metric in the MSTC ecosystem reports here.",
        targetElement: null,
      },
      {
        title: "Live Universe Feed",
        content:
          "A real-time feed of everything happening across all 50 apps — new leads, AI actions, builds, alerts.",
        targetElement: null,
      },
      {
        title: "Decision Queue",
        content:
          "Any action an AI cannot approve autonomously lands here with context and a recommendation. One tap.",
        targetElement: null,
      },
      {
        title: "AI Status Board",
        content:
          "All GM AIs: Property, CRM, Finance, Legal, Content, Security, Analytics, Services, People, Tech.",
        targetElement: null,
      },
      {
        title: "Anomaly Center",
        content:
          "Unusual patterns detected by any AI surface here — security threats, price anomalies, spike in leads.",
        targetElement: null,
      },
      {
        title: "Global Command Bar",
        content:
          "Natural language commands: 'show me today's hot leads', 'pause content AI', 'export property report'.",
        targetElement: null,
      },
      {
        title: "Access Manager",
        content:
          "Issue, edit or revoke credentials for all staff, AI agents and observers from the Access tab.",
        targetElement: null,
      },
      {
        title: "Direct Line to Aria",
        content:
          "Aria (Chief AI) is always in the bottom panel — briefed, context-aware, and ready for any question.",
        targetElement: null,
      },
      {
        title: "Takeover Controls",
        content:
          "The Override panel lets you pause any AI, revert any change, or take full manual control instantly.",
        targetElement: null,
      },
    ],
  },
  builder: {
    quick: [
      {
        title: "Visual Website Builder",
        content:
          "Drag, drop and publish. Edit any part of the MSTC website without writing a single line of code.",
        targetElement: null,
      },
      {
        title: "Section Library",
        content:
          "200+ pre-built sections: heroes, cards, forms, calculators — drag any into your page.",
        targetElement: null,
      },
      {
        title: "AI Section Builder",
        content:
          "Describe what you need in plain language — AI builds the section and drops it in for you.",
        targetElement: null,
      },
      {
        title: "Publish",
        content:
          "One-click publish pushes your changes live. Or save as draft and schedule for later.",
        targetElement: null,
      },
    ],
    full: [
      {
        title: "Builder Overview",
        content:
          "The MSTC Visual Builder gives you WordPress-level editing power with AI intelligence built in.",
        targetElement: null,
      },
      {
        title: "Canvas",
        content:
          "The canvas shows your live page. Click any section to select, drag handle to reorder.",
        targetElement: null,
      },
      {
        title: "Section Library Panel",
        content:
          "200+ ready sections on the left. Search, preview and drag into position.",
        targetElement: null,
      },
      {
        title: "Style Panel",
        content:
          "On the right: fonts, colors, spacing, shadows and borders — fully customisable without code.",
        targetElement: null,
      },
      {
        title: "AI Section Builder",
        content:
          "Type a description: 'Add a testimonials grid with 3 cards and MSTC gold accents' → AI builds it.",
        targetElement: null,
      },
      {
        title: "Mobile Preview",
        content:
          "Switch to mobile/tablet/desktop preview mode at any time before publishing.",
        targetElement: null,
      },
      {
        title: "Version History",
        content:
          "Every saved version is stored. Click History → select any point → restore instantly.",
        targetElement: null,
      },
      {
        title: "SEO Panel",
        content:
          "Set meta title, description and OG image per page — AI can auto-generate optimised copy.",
        targetElement: null,
      },
      {
        title: "One-Click Publish",
        content:
          "Publish live, save as draft, or schedule for a specific date and time.",
        targetElement: null,
      },
    ],
  },
  analytics: {
    quick: [
      {
        title: "Analytics Center",
        content:
          "Revenue, leads, conversions and platform performance — all in one live dashboard.",
        targetElement: null,
      },
      {
        title: "Date Range",
        content:
          "Use the date picker to filter all charts to today, this week, this month or custom range.",
        targetElement: null,
      },
      {
        title: "Drilldown",
        content:
          "Click any chart bar or data point to drill down to the underlying records.",
        targetElement: null,
      },
      {
        title: "Export",
        content:
          "Download any report as CSV or PDF using the export button on each chart card.",
        targetElement: null,
      },
    ],
    full: [
      {
        title: "Analytics — Full Overview",
        content:
          "The Analytics Center is your intelligence layer — powered by Data Scientist AI and Time-Series AI.",
        targetElement: null,
      },
      {
        title: "Revenue Dashboard",
        content:
          "Track total revenue, deal value by service, monthly growth and deal velocity.",
        targetElement: null,
      },
      {
        title: "Lead Funnel",
        content:
          "See exactly where leads drop off across the pipeline stages — with AI-suggested improvements.",
        targetElement: null,
      },
      {
        title: "Conversion Rates",
        content:
          "Conversion tracked per service, per source and per staff member — with trend lines.",
        targetElement: null,
      },
      {
        title: "Channel Attribution",
        content:
          "Which source drives the best leads? WhatsApp, Google, referral, direct — all attributed.",
        targetElement: null,
      },
      {
        title: "Cohort Analysis",
        content:
          "See how different cohorts of leads behave over time — retention, repeat enquiries, upsells.",
        targetElement: null,
      },
      {
        title: "AI Insights Panel",
        content:
          "Weekly patterns surfaced automatically by AI: 'Tuesday afternoons drive 3x more site visits'.",
        targetElement: null,
      },
      {
        title: "Benchmarks",
        content:
          "Compare MSTC performance vs Ahmedabad market benchmarks for key metrics.",
        targetElement: null,
      },
    ],
  },
};

// ── Hooks ────────────────────────────────────────────────────────────────────

export function useTutorialSteps(appKey: string, mode: TutorialMode) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<TutorialStepLocal[]>({
    queryKey: ["tutorialSteps", appKey, mode],
    queryFn: async () => {
      if (!actor) return getDefaultSteps(appKey, mode);
      try {
        const backendSteps = await (
          actor as unknown as ActorWithTutorial
        ).getTutorialSteps(appKey, mode);
        if (backendSteps.length > 0) {
          return backendSteps
            .sort((a, b) => Number(a.order) - Number(b.order))
            .map((s) => ({
              title: s.title,
              content: s.content,
              targetElement: s.targetElement ?? null,
            }));
        }
      } catch {
        // fall through to defaults
      }
      return getDefaultSteps(appKey, mode);
    },
    enabled: !isFetching,
    staleTime: 5 * 60_000,
  });
}

export function useRecordCompletion() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      userId: string;
      appKey: string;
      mode: TutorialMode;
      skipped: boolean;
    }) => {
      if (!actor) return;
      try {
        await (actor as unknown as ActorWithTutorial).recordTutorialCompletion(
          vars.userId,
          vars.appKey,
          vars.mode,
          vars.skipped,
        );
      } catch {
        // non-critical — completion recording should not throw UI errors
      }
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["tutorialStats"] });
      qc.invalidateQueries({ queryKey: ["tutorialSteps", vars.appKey] });
    },
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getDefaultSteps(
  appKey: string,
  mode: TutorialMode,
): TutorialStepLocal[] {
  const def = DEFAULT_TUTORIALS[appKey];
  if (!def) {
    return [
      {
        title: `Welcome to ${appKey.charAt(0).toUpperCase() + appKey.slice(1)}`,
        content:
          "Explore the features of this section. Use the navigation to get started.",
        targetElement: null,
      },
    ];
  }
  return mode === "quick" ? def.quick : def.full;
}

type ActorWithTutorial = {
  getTutorialSteps: (appKey: string, mode: string) => Promise<TutorialStep[]>;
  recordTutorialCompletion: (
    userId: string,
    appKey: string,
    mode: string,
    skipped: boolean,
  ) => Promise<void>;
};
