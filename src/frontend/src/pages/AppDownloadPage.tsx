import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BarChart2,
  Building2,
  Calendar,
  Cpu,
  DollarSign,
  Download,
  FileText,
  Globe,
  Home,
  LayoutDashboard,
  Link2,
  Megaphone,
  MessageSquare,
  Music,
  Search,
  Share2,
  Shield,
  Smartphone,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

const ALL_APPS = [
  {
    id: "master",
    name: "Master Control",
    path: "/master",
    icon: Zap,
    category: "Command",
    desc: "Your single command throne — all apps, all AIs, all data",
  },
  {
    id: "apps",
    name: "App Launcher",
    path: "/apps",
    icon: LayoutDashboard,
    category: "Command",
    desc: "Home screen for all 50 apps with live badges",
  },
  {
    id: "command",
    name: "Command Center",
    path: "/command",
    icon: Cpu,
    category: "Command",
    desc: "Deep operations, AI network map, org chart, cluster health",
  },
  {
    id: "briefing",
    name: "Executive Briefing",
    path: "/briefing",
    icon: Star,
    category: "Command",
    desc: "Daily 2-minute brief — what happened, what needs action",
  },
  {
    id: "ai",
    name: "AI Universe",
    path: "/ai",
    icon: Cpu,
    category: "Command",
    desc: "All 2,000+ AI agents, clusters, and neural models",
  },
  {
    id: "staff",
    name: "Staff Directory",
    path: "/staff",
    icon: Users,
    category: "Command",
    desc: "490+ named AI staff personas, org chart, live status",
  },
  {
    id: "security",
    name: "Security App",
    path: "/security",
    icon: Shield,
    category: "Command",
    desc: "52 dedicated Security AIs across 7 tiers — 24/7 fortress",
  },
  {
    id: "legal-command",
    name: "Legalities App",
    path: "/legal-command",
    icon: FileText,
    category: "Command",
    desc: "30 Legal AIs — contracts, compliance, policy manager",
  },
  {
    id: "builder",
    name: "Website Builder",
    path: "/builder",
    icon: Globe,
    category: "Content",
    desc: "Visual drag-drop builder with 200+ sections and AI assistant",
  },
  {
    id: "crm",
    name: "CRM",
    path: "/crm",
    icon: Users,
    category: "Sales",
    desc: "Pipeline management: leads, deals, and client relationships",
  },
  {
    id: "leads",
    name: "Lead Manager",
    path: "/leads",
    icon: TrendingUp,
    category: "Sales",
    desc: "All leads from all sources, AI scoring, bulk qualification",
  },
  {
    id: "clients",
    name: "Client Portal",
    path: "/clients",
    icon: Users,
    category: "Sales",
    desc: "Full client profiles, LTV, referral chains, service history",
  },
  {
    id: "proposals",
    name: "Proposal Generator",
    path: "/proposals",
    icon: FileText,
    category: "Sales",
    desc: "AI-built proposals and branded property brochures",
  },
  {
    id: "appointments",
    name: "Appointments",
    path: "/appointments",
    icon: Calendar,
    category: "Sales",
    desc: "Calendar for all site visits, calls, and meetings",
  },
  {
    id: "properties-admin",
    name: "Property Manager",
    path: "/properties-admin",
    icon: Home,
    category: "Property",
    desc: "Full listing CRUD, Excel import, AI auto-publisher",
  },
  {
    id: "intelligence",
    name: "Property Intelligence",
    path: "/intelligence",
    icon: TrendingUp,
    category: "Property",
    desc: "Locality data, price trends, valuations, investment scores",
  },
  {
    id: "redevelopment",
    name: "Redevelopment",
    path: "/redevelopment",
    icon: Building2,
    category: "Property",
    desc: "Project pipeline, FSI/TDR calculator, developer scorecards",
  },
  {
    id: "rera-admin",
    name: "RERA Compliance",
    path: "/rera-admin",
    icon: FileText,
    category: "Property",
    desc: "RERA project tracking, deadlines, complaints",
  },
  {
    id: "rentals",
    name: "Rental Manager",
    path: "/rentals",
    icon: Home,
    category: "Property",
    desc: "Tenants, leases, rent due alerts, maintenance requests",
  },
  {
    id: "commercial",
    name: "Commercial Desk",
    path: "/commercial",
    icon: Building2,
    category: "Property",
    desc: "Commercial listings, yield analysis, tenant profiler",
  },
  {
    id: "finance-admin",
    name: "Finance Desk",
    path: "/finance-admin",
    icon: DollarSign,
    category: "Finance",
    desc: "AUM dashboard, 25 calculators, key rate tracker",
  },
  {
    id: "legal-vault",
    name: "Legal Command",
    path: "/legal-command",
    icon: FileText,
    category: "Finance",
    desc: "All legal documents, AI agreement analyzer",
  },
  {
    id: "tax",
    name: "Tax & Compliance",
    path: "/tax",
    icon: DollarSign,
    category: "Finance",
    desc: "Capital gains, 80C tracker, stamp duty, tax summaries",
  },
  {
    id: "billing",
    name: "Billing & Invoices",
    path: "/billing",
    icon: DollarSign,
    category: "Finance",
    desc: "Commission invoices, payment tracking, overdue alerts",
  },
  {
    id: "documents-admin",
    name: "Document Center",
    path: "/documents-admin",
    icon: FileText,
    category: "Finance",
    desc: "AI-classified document vault with risk scores",
  },
  {
    id: "campaigns",
    name: "Campaign Studio",
    path: "/campaigns",
    icon: Megaphone,
    category: "Marketing",
    desc: "WhatsApp/Email campaigns, A/B testing, audience segments",
  },
  {
    id: "whatsapp-admin",
    name: "WhatsApp Manager",
    path: "/whatsapp-admin",
    icon: MessageSquare,
    category: "Marketing",
    desc: "Unified inbox, template library, broadcast manager",
  },
  {
    id: "notifications-admin",
    name: "Notification Center",
    path: "/notifications-admin",
    icon: Megaphone,
    category: "Marketing",
    desc: "All alerts from all apps in a priority-filtered feed",
  },
  {
    id: "reviews-admin",
    name: "Review Manager",
    path: "/reviews-admin",
    icon: Star,
    category: "Marketing",
    desc: "Google/JustDial reviews, sentiment analysis, AI replies",
  },
  {
    id: "referrals-admin",
    name: "Referral Tracker",
    path: "/referrals-admin",
    icon: Link2,
    category: "Marketing",
    desc: "Referral chains, leaderboard, reward payouts",
  },
  {
    id: "events-admin",
    name: "Event Manager",
    path: "/events-admin",
    icon: Calendar,
    category: "Events",
    desc: "Events table, RSVP management, vendor coordination",
  },
  {
    id: "hospitality-admin",
    name: "Hospitality Hub",
    path: "/hospitality-admin",
    icon: Building2,
    category: "Events",
    desc: "Venue management, package builder, client-event matching",
  },
  {
    id: "calendar-admin",
    name: "Unified Calendar",
    path: "/calendar-admin",
    icon: Calendar,
    category: "Events",
    desc: "All deadlines, events, appointments in one color-coded view",
  },
  {
    id: "ngo-admin",
    name: "NGO Hub",
    path: "/ngo-admin",
    icon: Users,
    category: "NGO",
    desc: "Donations, 80G receipts, volunteers, impact tracking",
  },
  {
    id: "csr-admin",
    name: "CSR Dashboard",
    path: "/csr-admin",
    icon: Globe,
    category: "NGO",
    desc: "CSR budget optimizer, impact scorecard, grant opportunities",
  },
  {
    id: "sports-admin",
    name: "Sports Desk",
    path: "/sports-admin",
    icon: Zap,
    category: "Services",
    desc: "Athlete profiles, sponsorship matching, tournament calendar",
  },
  {
    id: "music-admin",
    name: "Music & Culture Hub",
    path: "/music-admin",
    icon: Music,
    category: "Services",
    desc: "Artist directory, booking workflow, royalty tracking",
  },
  {
    id: "tourism-admin",
    name: "Tourism Planner",
    path: "/tourism-admin",
    icon: Globe,
    category: "Services",
    desc: "Itinerary builder, group bookings, destination intelligence",
  },
  {
    id: "analytics-admin",
    name: "Analytics Center",
    path: "/analytics-admin",
    icon: BarChart2,
    category: "Analytics",
    desc: "Revenue charts, lead funnel, conversion metrics, attribution",
  },
  {
    id: "market-admin",
    name: "Market Intelligence",
    path: "/market-admin",
    icon: TrendingUp,
    category: "Analytics",
    desc: "Ahmedabad market pulse, price index, AI weekly report",
  },
  {
    id: "competitors",
    name: "Competitive Intel",
    path: "/competitors",
    icon: TrendingUp,
    category: "Analytics",
    desc: "Competitor listings, market share, campaign monitor",
  },
  {
    id: "health",
    name: "Platform Health",
    path: "/health",
    icon: Shield,
    category: "Platform",
    desc: "Uptime, error rates, response time, active AI count",
  },
  {
    id: "deployments",
    name: "Deployments",
    path: "/deployments",
    icon: Zap,
    category: "Platform",
    desc: "Version history, rollback, live vs draft toggle",
  },
  {
    id: "api-manager",
    name: "API Manager",
    path: "/api-manager",
    icon: Globe,
    category: "Platform",
    desc: "All integrations, API keys, usage charts, rate limits",
  },
  {
    id: "settings",
    name: "Settings",
    path: "/settings",
    icon: Zap,
    category: "Platform",
    desc: "Platform config, security settings, AI thresholds",
  },
];

const CATEGORIES = [
  "All",
  "Command",
  "Sales",
  "Property",
  "Finance",
  "Marketing",
  "Events",
  "NGO",
  "Services",
  "Analytics",
  "Platform",
  "Content",
];

function AppCard({ app }: { app: (typeof ALL_APPS)[0] }) {
  const Icon = app.icon;
  const appUrl = `${window.location.origin}${app.path}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl).catch(() => {});
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: app.name, url: appUrl }).catch(() => {});
    } else {
      handleCopy();
    }
  };
  return (
    <div
      className="rounded-xl border border-gold-800/30 bg-card p-4 flex flex-col gap-3 hover:border-gold-500/50 transition-all"
      data-ocid={`app_download.card.${app.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-lg bg-gold-700/20 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-gold-400" />
        </div>
        <Badge
          variant="outline"
          className="text-[10px] text-gold-600 border-gold-800/40 bg-gold-700/10"
        >
          {app.category}
        </Badge>
      </div>
      <div>
        <h3 className="font-serif font-semibold text-sm text-foreground truncate">
          {app.name}
        </h3>
        <p className="font-sans text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {app.desc}
        </p>
      </div>
      <div className="flex gap-1.5 mt-auto">
        <a
          href={app.path}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-xs font-medium transition-colors"
          data-ocid={`app_download.open_button.${app.id}`}
        >
          <LayoutDashboard className="w-3 h-3" /> Open
        </a>
        <button
          type="button"
          onClick={handleShare}
          className="px-2 py-1.5 rounded-lg border border-gold-800/30 hover:border-gold-500/50 text-gold-500 text-xs transition-colors"
          title="Share"
          data-ocid={`app_download.share_button.${app.id}`}
        >
          <Share2 className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="px-2 py-1.5 rounded-lg border border-gold-800/30 hover:border-gold-500/50 text-gold-500 text-xs transition-colors"
          title="Copy Link"
          data-ocid={`app_download.copy_button.${app.id}`}
        >
          <Link2 className="w-3 h-3" />
        </button>
        <button
          type="button"
          className="px-2 py-1.5 rounded-lg border border-gold-800/30 hover:border-gold-500/50 text-gold-500 text-xs transition-colors"
          title="Install PWA"
          data-ocid={`app_download.install_button.${app.id}`}
          onClick={() => {
            const deferredPrompt = (
              window as Window & { _pwaInstallPrompt?: { prompt: () => void } }
            )._pwaInstallPrompt;
            if (deferredPrompt) {
              deferredPrompt.prompt();
            } else {
              alert(
                "Open this app in your browser and use the Install option from the browser menu.",
              );
            }
          }}
        >
          <Smartphone className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export default function AppDownloadPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    return ALL_APPS.filter((app) => {
      const matchesSearch =
        !search ||
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.desc.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || app.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const handleShareAll = () => {
    const url = `${window.location.origin}/apps/download`;
    if (navigator.share) {
      navigator.share({ title: "MSTC GLOBAL — All Apps", url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  return (
    <SecureAppGate appName="App Download Center">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="app_download.page"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <a
                href="/master"
                className="text-gold-600 hover:text-gold-400 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
              </a>
              <span className="text-gold-700/50">/</span>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-gold-400" />
                <h1 className="font-serif font-bold text-lg text-foreground">
                  App Download Center
                </h1>
              </div>
            </div>
            <button
              type="button"
              onClick={handleShareAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-700/40 text-gold-400 text-sm hover:border-gold-500/60 transition-colors"
              data-ocid="app_download.share_all_button"
            >
              <Share2 className="w-3.5 h-3.5" /> Share All Apps
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total Apps", value: ALL_APPS.length },
              { label: "Categories", value: CATEGORIES.length - 1 },
              { label: "AI Agents", value: "2,000+" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-gold-800/30 bg-card p-3 text-center"
              >
                <p className="font-serif text-xl font-bold text-gold-400">
                  {s.value}
                </p>
                <p className="font-sans text-xs text-muted-foreground mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search apps..."
              className="pl-9 bg-card border-gold-800/30 text-foreground"
              data-ocid="app_download.search_input"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeCategory === cat ? "bg-gold-700/30 text-gold-300 border border-gold-600/50" : "border border-gold-800/30 text-gold-600 hover:text-gold-400"}`}
                data-ocid={`app_download.filter.${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Apps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div
              className="text-center py-16"
              data-ocid="app_download.empty_state"
            >
              <Search className="w-12 h-12 text-gold-800/50 mx-auto mb-3" />
              <p className="font-sans text-muted-foreground">
                No apps found matching "{search}"
              </p>
            </div>
          )}
        </div>
      </div>
    </SecureAppGate>
  );
}
