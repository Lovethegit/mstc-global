import SecureAppGate from "@/components/shared/SecureAppGate";
import {
  Activity,
  Gavel as AuctionIcon,
  BarChart2,
  Bell,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  Calendar,
  CalendarDays,
  Code,
  CreditCard,
  Crown,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  FileText,
  Folder,
  Handshake as FranchiseIcon,
  Gavel,
  GitBranch,
  Globe,
  GraduationCap,
  Handshake,
  Heart,
  Hotel,
  Image,
  Key,
  LayoutDashboard,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Music,
  Newspaper,
  PartyPopper,
  PenTool,
  QrCode,
  Receipt,
  Rocket,
  Scale,
  Search,
  Settings,
  Share2,
  Shield,
  ShoppingBag,
  Star,
  Target,
  Terminal,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
  Wand2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AppTile {
  name: string;
  path: string;
  icon: React.ElementType;
  desc: string;
  badge?: number;
}

interface AppCategory {
  label: string;
  apps: AppTile[];
}

const appCategories: AppCategory[] = [
  {
    label: "Command & Operations",
    apps: [
      {
        name: "Master Control",
        path: "/master",
        icon: Crown,
        desc: "Your command throne — all apps, all AIs",
        badge: 4,
      },
      {
        name: "Executive Briefing",
        path: "/briefing",
        icon: BookOpen,
        desc: "2-min daily summary & decision digest",
      },
      {
        name: "Command Center",
        path: "/command",
        icon: Terminal,
        desc: "AI ops hub, org chart, live network",
      },
      {
        name: "AI Universe",
        path: "/ai",
        icon: Brain,
        desc: "All 2,000+ agents, clusters, neural lab",
        badge: 2,
      },
      {
        name: "AI Staff Directory",
        path: "/staff",
        icon: Users,
        desc: "490+ personas, org chart, live status",
      },
      {
        name: "Admin Dashboard",
        path: "/admin",
        icon: LayoutDashboard,
        desc: "Site admin, leads, properties",
      },
      {
        name: "Settings & Config",
        path: "/settings",
        icon: Settings,
        desc: "Roles, permissions, integrations",
      },
    ],
  },
  {
    label: "Website & Content",
    apps: [
      {
        name: "Visual Builder",
        path: "/builder",
        icon: Wand2,
        desc: "Drag-drop AI-powered website editor",
      },
      {
        name: "Content Studio",
        path: "/studio",
        icon: PenTool,
        desc: "Blog editor, AI writer, scheduler",
      },
      {
        name: "Media Library",
        path: "/media",
        icon: Image,
        desc: "All images, documents, videos",
      },
      {
        name: "SEO Manager",
        path: "/seo",
        icon: Search,
        desc: "Meta tags, keywords, page scores",
      },
      {
        name: "Announcements",
        path: "/announcements",
        icon: Megaphone,
        desc: "Banners, popups, site alerts",
        badge: 1,
      },
    ],
  },
  {
    label: "Property & Real Estate",
    apps: [
      {
        name: "Property Manager",
        path: "/properties",
        icon: Building2,
        desc: "Listings, Excel import, bulk actions",
        badge: 127,
      },
      {
        name: "Property Intelligence",
        path: "/intelligence",
        icon: TrendingUp,
        desc: "Valuations, demand scores, maps",
      },
      {
        name: "Redevelopment",
        path: "/redevelopment",
        icon: Building2,
        desc: "Consent tracking, FSI, timeline",
      },
      {
        name: "RERA Hub",
        path: "/rera",
        icon: Shield,
        desc: "Deadlines, compliance, complaints",
        badge: 2,
      },
      {
        name: "Rental Manager",
        path: "/rentals",
        icon: Key,
        desc: "Tenants, leases, rental income",
      },
      {
        name: "Commercial Desk",
        path: "/commercial",
        icon: Briefcase,
        desc: "Commercial listings, yield analysis",
      },
    ],
  },
  {
    label: "Client & Sales",
    apps: [
      {
        name: "CRM",
        path: "/crm",
        icon: Target,
        desc: "Pipeline, Kanban, AI lead scoring",
        badge: 12,
      },
      {
        name: "Lead Manager",
        path: "/leads",
        icon: UserPlus,
        desc: "All leads, source tracking, qualification",
        badge: 8,
      },
      {
        name: "Client Portal",
        path: "/clients",
        icon: Heart,
        desc: "Profiles, history, LTV, referrals",
      },
      {
        name: "Proposals",
        path: "/proposals",
        icon: FileText,
        desc: "AI-built PDF proposals and brochures",
      },
      {
        name: "Appointments",
        path: "/appointments",
        icon: Calendar,
        desc: "Site visits, calls, calendar sync",
        badge: 3,
      },
    ],
  },
  {
    label: "Finance & Legal",
    apps: [
      {
        name: "Finance Desk",
        path: "/finance-desk",
        icon: DollarSign,
        desc: "25+ calculators, loan tracking",
      },
      {
        name: "Legal Vault",
        path: "/legal",
        icon: Scale,
        desc: "Documents, templates, agreement AI",
      },
      {
        name: "Tax & Compliance",
        path: "/tax",
        icon: Receipt,
        desc: "Capital gains, stamp duty, 80C tracker",
      },
      {
        name: "Billing",
        path: "/billing",
        icon: CreditCard,
        desc: "Commission tracking, invoices",
      },
      {
        name: "Documents",
        path: "/documents",
        icon: Folder,
        desc: "All docs, AI summaries, risk flags",
      },
    ],
  },
  {
    label: "Communication & Marketing",
    apps: [
      {
        name: "Campaigns",
        path: "/campaigns",
        icon: Mail,
        desc: "WhatsApp/email broadcasts, A/B testing",
      },
      {
        name: "WhatsApp Manager",
        path: "/whatsapp",
        icon: MessageCircle,
        desc: "All threads, templates, broadcasts",
        badge: 7,
      },
      {
        name: "Notifications",
        path: "/notifications",
        icon: Bell,
        desc: "All alerts from all apps",
        badge: 11,
      },
      {
        name: "Reviews",
        path: "/reviews",
        icon: Star,
        desc: "Google/JustDial, sentiment, responses",
      },
      {
        name: "Referrals",
        path: "/referrals",
        icon: Share2,
        desc: "Referral chains, rewards, campaigns",
      },
    ],
  },
  {
    label: "Events & Hospitality",
    apps: [
      {
        name: "Event Manager",
        path: "/events",
        icon: PartyPopper,
        desc: "RSVP, vendors, timeline",
      },
      {
        name: "Hospitality Hub",
        path: "/hospitality",
        icon: Hotel,
        desc: "Venues, packages, client matching",
      },
      {
        name: "Calendar",
        path: "/calendar",
        icon: CalendarDays,
        desc: "All events, deadlines, team schedule",
      },
    ],
  },
  {
    label: "NGO & CSR",
    apps: [
      {
        name: "NGO Hub",
        path: "/ngo",
        icon: Heart,
        desc: "Donations, volunteers, 80G, impact",
      },
      {
        name: "CSR Dashboard",
        path: "/csr",
        icon: Globe,
        desc: "CSR budget, impact scorecard, grants",
      },
    ],
  },
  {
    label: "Sports, Music & Tourism",
    apps: [
      {
        name: "Sports Desk",
        path: "/sports",
        icon: Trophy,
        desc: "Athletes, sponsorship, tournaments",
      },
      {
        name: "Music & Culture",
        path: "/music",
        icon: Music,
        desc: "Artists, bookings, royalties",
      },
      {
        name: "Tourism Planner",
        path: "/tourism",
        icon: MapPin,
        desc: "Itinerary builder, destinations",
      },
    ],
  },
  {
    label: "Analytics & Intelligence",
    apps: [
      {
        name: "Analytics Center",
        path: "/analytics",
        icon: BarChart2,
        desc: "Revenue, leads, forecasts, cohorts",
      },
      {
        name: "Market Intelligence",
        path: "/market",
        icon: Activity,
        desc: "Ahmedabad pulse, price index, news",
      },
      {
        name: "Competitive Intel",
        path: "/competitors",
        icon: Eye,
        desc: "Competitor listings, pricing, campaigns",
      },
    ],
  },
  {
    label: "Platform & Developer",
    apps: [
      {
        name: "Platform Health",
        path: "/health",
        icon: Activity,
        desc: "Uptime, errors, API status",
      },
      {
        name: "Deployments",
        path: "/deployments",
        icon: Rocket,
        desc: "Version history, rollback, live/draft",
      },
      {
        name: "API Manager",
        path: "/api",
        icon: Code,
        desc: "Integrations, API keys, usage stats",
      },
    ],
  },
  {
    label: "Security & Legal Special",
    apps: [
      {
        name: "Security App",
        path: "/security",
        icon: Lock,
        desc: "52 Security AIs, threat map, incidents",
        badge: 0,
      },
      {
        name: "Legalities",
        path: "/legal-command",
        icon: Gavel,
        desc: "30 Legal AIs, vault, policy manager",
      },
      {
        name: "Observer",
        path: "/observe",
        icon: EyeOff,
        desc: "Frosted glass view with access codes",
      },
    ],
  },
  {
    label: "Growth & Expansion",
    apps: [
      {
        name: "MSTC Academy",
        path: "/academy",
        icon: GraduationCap,
        desc: "Training, certifications, real estate courses",
      },
      {
        name: "MSTC Exchange",
        path: "/exchange",
        icon: ShoppingBag,
        desc: "Private property marketplace, live offers",
        badge: 4,
      },
      {
        name: "Auction Platform",
        path: "/auction",
        icon: Rocket,
        desc: "Live property auctions, real-time bidding",
        badge: 2,
      },
      {
        name: "Developer Portal",
        path: "/developer-portal",
        icon: Building2,
        desc: "Builder listings, project pages, B2B portal",
      },
      {
        name: "Franchise System",
        path: "/franchise",
        icon: Globe,
        desc: "Franchise applications, sub-portals, royalty",
      },
      {
        name: "Media House",
        path: "/media-house",
        icon: Newspaper,
        desc: "AI blog, social media, press releases",
      },
      {
        name: "Deal Room",
        path: "/deal-room",
        icon: Briefcase,
        desc: "Private deal space, e-signatures, timeline",
        badge: 3,
      },
      {
        name: "App Download Center",
        path: "/apps/download",
        icon: Download,
        desc: "All apps, QR codes, PWA install, links",
      },
    ],
  },
];

function ShareModal({ app, onClose }: { app: AppTile; onClose: () => void }) {
  const url = `${window.location.origin}${app.path}`;
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="launcher.share.dialog"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="presentation"
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-primary/30 bg-card p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          data-ocid="launcher.share.close_button"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <app.icon className="w-6 h-6 text-primary" />
          <h3 className="font-serif text-lg font-bold text-primary">
            {app.name}
          </h3>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-background px-3 py-2.5 mb-4">
          <span className="font-mono text-xs text-muted-foreground flex-1 truncate">
            {url}
          </span>
          <button
            type="button"
            onClick={copy}
            className="font-sans text-xs text-primary hover:underline shrink-0"
            data-ocid="launcher.share.copy_button"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="flex items-center justify-center h-40 rounded-xl border border-border/30 bg-background mb-4">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <QrCode className="w-16 h-16 opacity-40" />
            <span className="font-sans text-xs">QR Code — scan to open</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              window.open(
                `https://wa.me/?text=${encodeURIComponent(url)}`,
                "_blank",
              )
            }
            className="flex-1 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 font-sans text-xs font-medium"
            data-ocid="launcher.share.whatsapp_button"
          >
            Share via WhatsApp
          </button>
          <button
            type="button"
            onClick={copy}
            className="flex-1 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary font-sans text-xs font-medium"
            data-ocid="launcher.share.install_button"
          >
            Install PWA
          </button>
        </div>
      </div>
    </div>
  );
}

function AppTileCard({ app, onShare }: { app: AppTile; onShare: () => void }) {
  return (
    <div className="group relative rounded-xl border border-primary/15 bg-card/60 hover:border-primary/40 hover:bg-card transition-all duration-200 flex flex-col">
      <a
        href={app.path}
        className="flex flex-col p-4 flex-1"
        data-ocid={`launcher.app.link.${app.name.toLowerCase().replace(/ /g, "_")}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <app.icon className="w-4 h-4 text-primary" />
          </div>
          {app.badge !== undefined && app.badge > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
              {app.badge}
            </span>
          )}
        </div>
        <p className="font-sans text-sm font-semibold text-foreground leading-tight mb-1">
          {app.name}
        </p>
        <p className="font-sans text-xs text-muted-foreground leading-relaxed flex-1">
          {app.desc}
        </p>
      </a>
      <div className="flex border-t border-border/20">
        <button
          type="button"
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-1 py-2 text-muted-foreground hover:text-primary transition-colors font-sans text-xs"
          data-ocid={`launcher.app.share_button.${app.name.toLowerCase().replace(/ /g, "_")}`}
        >
          <Share2 className="w-3 h-3" /> Share
        </button>
        <div className="w-px bg-border/20" />
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-1 py-2 text-muted-foreground hover:text-primary transition-colors font-sans text-xs"
          data-ocid={`launcher.app.install_button.${app.name.toLowerCase().replace(/ /g, "_")}`}
          onClick={() => {
            if ("serviceWorker" in navigator) {
              window.dispatchEvent(new Event("beforeinstallprompt"));
            }
          }}
        >
          <Download className="w-3 h-3" /> Install
        </button>
      </div>
    </div>
  );
}

function _AppLauncherInner() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [shareModal, setShareModal] = useState<AppTile | null>(null);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const categoryTabs = [
    "All",
    "Operations",
    "Property",
    "Finance",
    "Legal",
    "Content",
    "Analytics",
    "Admin",
    "Platform",
  ];

  const categoryMap: Record<string, string[]> = {
    Operations: ["Command & Operations"],
    Property: ["Property & Real Estate"],
    Finance: ["Finance & Legal"],
    Legal: ["Security & Legal Special"],
    Content: ["Website & Content", "Communication & Marketing"],
    Analytics: ["Analytics & Intelligence"],
    Admin: [
      "Client & Sales",
      "Events & Hospitality",
      "NGO & CSR",
      "Sports, Music & Tourism",
    ],
    Platform: ["Platform & Developer", "Growth & Expansion"],
  };

  const filtered = appCategories
    .filter(
      (cat) =>
        activeCategory === "All" ||
        (categoryMap[activeCategory] ?? []).includes(cat.label),
    )
    .map((cat) => ({
      ...cat,
      apps: cat.apps.filter(
        (a) =>
          !search ||
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.desc.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.apps.length > 0);

  const totalApps = appCategories.reduce((sum, c) => sum + c.apps.length, 0);

  return (
    <div
      className="min-h-screen bg-background"
      style={{ background: "#06090f" }}
      data-ocid="launcher.page"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur border-b border-primary/20">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="font-serif text-xl md:text-2xl font-bold text-primary leading-tight">
                      APP LAUNCHER
                    </h1>
                    <p className="font-sans text-[11px] text-muted-foreground truncate">
                      {totalApps}+ Apps · {today}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:flex items-center gap-3 text-xs font-sans">
                  <span className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                    {totalApps} Apps
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    All Encrypted
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    Role-Based Access
                  </span>
                </div>
              </div>
            </div>
            {/* Search + Filter row */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search all apps..."
                  className="w-full bg-background border border-border/40 rounded-xl pl-9 pr-4 py-2.5 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                  data-ocid="launcher.search_input"
                />
              </div>
            </div>
            {/* Category filter pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {categoryTabs.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-3 py-1 rounded-full font-sans text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-card/60 border border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary"
                  }`}
                  data-ocid={`launcher.filter.${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {filtered.map((cat) => (
          <div key={cat.label} className="mb-8">
            <h2 className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              {cat.label}{" "}
              <span className="text-primary/60">({cat.apps.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {cat.apps.map((app) => (
                <AppTileCard
                  key={app.name}
                  app={app}
                  onShare={() => setShareModal(app)}
                />
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16" data-ocid="launcher.empty_state">
            <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-serif text-lg text-muted-foreground">
              No apps match "{search}"
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-3 font-sans text-xs text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* App Download Center link */}
        <div className="mt-8 rounded-xl border border-primary/20 bg-card/60 p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-serif text-base font-semibold text-primary">
              App Download Center
            </p>
            <p className="font-sans text-xs text-muted-foreground mt-0.5">
              Download, install, and share all apps. QR codes, PWA installs, and
              access management.
            </p>
          </div>
          <a
            href="/apps/download"
            className="px-4 py-2 rounded-lg bg-primary/20 border border-primary/40 text-primary font-sans text-sm font-medium hover:bg-primary/30 transition-colors shrink-0"
            data-ocid="launcher.download_center_link"
          >
            Open Download Center →
          </a>
        </div>

        {/* Footer stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Total Apps", value: `${String(totalApps)}+` },
            { label: "AI Agents", value: "2,000+" },
            { label: "Security", value: "Military-Grade" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-primary/15 bg-card/40 p-3 text-center"
            >
              <p className="font-serif text-lg font-bold text-primary">
                {s.value}
              </p>
              <p className="font-sans text-[10px] text-muted-foreground mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {shareModal && (
        <ShareModal app={shareModal} onClose={() => setShareModal(null)} />
      )}
    </div>
  );
}

export default function AppLauncherPage() {
  const [search, setSearch] = useState("");
  const [qrApp, setQrApp] = useState<AppTile | null>(null);

  const allApps = appCategories.flatMap((c) => c.apps);
  const filteredCategories = search
    ? [
        {
          label: "Search Results",
          apps: allApps.filter(
            (a) =>
              a.name.toLowerCase().includes(search.toLowerCase()) ||
              a.desc.toLowerCase().includes(search.toLowerCase()),
          ),
        },
      ]
    : appCategories;

  function handleInstall(app: AppTile) {
    toast.success("Added to home screen", {
      description: `${app.name} installed as app`,
    });
  }

  function handleShare(app: AppTile) {
    const url = `${window.location.origin}${app.path}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Copied!", { description: url });
      })
      .catch(() => {
        toast.info("Share link", { description: url });
      });
  }

  return (
    <SecureAppGate appName="App Launcher">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="app_launcher.page"
      >
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/95 backdrop-blur-md px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-5 h-5 text-gold-400 shrink-0" />
            <h1 className="font-serif font-bold text-lg text-foreground">
              MSTC App Launcher
            </h1>
            <span className="ml-auto text-xs text-muted-foreground">
              {allApps.length} apps
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search apps…"
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-background border border-gold-800/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-500/60"
              data-ocid="app_launcher.search_input"
            />
          </div>
        </div>

        <div className="px-4 py-4 space-y-6">
          {filteredCategories.map((cat) =>
            cat.apps.length === 0 ? null : (
              <div key={cat.label}>
                <h2 className="text-xs font-semibold text-gold-600 uppercase tracking-widest mb-3">
                  {cat.label}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {cat.apps.map((app, i) => {
                    const Icon = app.icon;
                    return (
                      <div
                        key={`${app.path}-${i}`}
                        className="relative bg-card border border-gold-800/25 rounded-xl p-3 hover:border-gold-500/40 transition-all cursor-pointer group"
                        data-ocid={`app_launcher.tile.${app.path.replace(/\//g, "") || "home"}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          window.location.href = app.path;
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            window.location.href = app.path;
                          }
                        }}
                      >
                        {app.badge != null && (
                          <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
                            {app.badge}
                          </span>
                        )}
                        <div className="flex flex-col gap-2">
                          <div className="w-9 h-9 rounded-lg bg-gold-700/20 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-gold-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-sans font-semibold text-xs text-foreground leading-tight truncate">
                              {app.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2 mt-0.5">
                              {app.desc}
                            </p>
                          </div>
                          <div className="flex gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInstall(app);
                              }}
                              className="flex-1 text-[9px] py-1 rounded bg-gold-700/20 text-gold-400 hover:bg-gold-700/30 transition-colors"
                              data-ocid={`app_launcher.install_button.${app.path.replace(/\//g, "")}`}
                            >
                              Install
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(app);
                              }}
                              className="flex-1 text-[9px] py-1 rounded bg-gold-700/10 text-gold-500 hover:bg-gold-700/20 transition-colors"
                              data-ocid={`app_launcher.share_button.${app.path.replace(/\//g, "")}`}
                            >
                              Share
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setQrApp(app);
                              }}
                              className="px-1.5 py-1 rounded bg-gold-700/10 text-gold-500 hover:bg-gold-700/20 transition-colors"
                              data-ocid={`app_launcher.qr_button.${app.path.replace(/\//g, "")}`}
                            >
                              <QrCode className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
          )}

          {search && filteredCategories[0]?.apps.length === 0 && (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="app_launcher.empty_state"
            >
              <Search className="w-10 h-10 mx-auto mb-3 text-gold-800/40" />
              <p>No apps found for "{search}"</p>
            </div>
          )}
        </div>

        {qrApp && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            data-ocid="app_launcher.qr_dialog"
          >
            <div
              className="absolute inset-0 bg-black/70"
              role="presentation"
              onKeyDown={(e) => {
                if (e.key === "Escape") setQrApp(null);
              }}
              onClick={() => setQrApp(null)}
            />
            <div className="relative bg-card border border-gold-700/40 rounded-2xl p-6 w-full max-w-xs">
              <button
                type="button"
                onClick={() => setQrApp(null)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                data-ocid="app_launcher.qr_close_button"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-serif font-bold text-gold-400 mb-4 text-center">
                {qrApp.name}
              </h3>
              <div className="bg-background border border-gold-800/30 rounded-xl p-4 text-center mb-3">
                <QrCode className="w-16 h-16 mx-auto text-gold-400 mb-2" />
                <p className="text-xs text-muted-foreground font-mono break-all">
                  {window.location.origin}
                  {qrApp.path}
                </p>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Scan QR at: {window.location.origin}
                {qrApp.path}
              </p>
            </div>
          </div>
        )}
      </div>
    </SecureAppGate>
  );
}
