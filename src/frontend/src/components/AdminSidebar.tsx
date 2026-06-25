import {
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Boxes,
  Brain,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  Cog,
  Command,
  Database,
  FileText,
  Flame,
  FlaskConical,
  FolderKanban,
  GitBranch,
  Globe,
  GraduationCap,
  Grid3x3,
  HeartHandshake,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquare,
  Mic2,
  Music2,
  Network,
  Pencil,
  Settings,
  Shield,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
  Users2,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { TabId } from "./AdminSidebarTypes";

export type { TabId };

// ── Sidebar Context + Provider ────────────────────────────────────────────────

export type SidebarContextType = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  toggleExpanded: () => void;
  openMobile: () => void;
  closeMobile: () => void;
};

export const SidebarContext = createContext<SidebarContextType>({
  isExpanded: true,
  isMobileOpen: false,
  toggleExpanded: () => {},
  openMobile: () => {},
  closeMobile: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

const SIDEBAR_STORAGE_KEY = "mstc_sidebar_expanded";

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return stored === null ? true : stored === "true";
    } catch {
      return true;
    }
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const openMobile = useCallback(() => setIsMobileOpen(true), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        isMobileOpen,
        toggleExpanded,
        openMobile,
        closeMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

// ── Nav type definitions ───────────────────────────────────────────────────────

type SidebarItem = {
  id: TabId;
  label: string;
  badge?: number;
  icon?: React.ReactNode;
};

type SidebarCategory = {
  key: string;
  label: string;
  icon: React.ReactNode;
  items?: SidebarItem[];
  singleId?: TabId;
};

export const SIDEBAR_CATEGORIES: SidebarCategory[] = [
  {
    key: "overview",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    singleId: "overview",
  },
  {
    key: "properties",
    label: "Properties",
    icon: <Building2 size={18} />,
    items: [
      {
        id: "manageproperties",
        label: "All Listings",
        icon: <Boxes size={15} />,
      },
      {
        id: "propertyenquiries",
        label: "Enquiries",
        icon: <MessageSquare size={15} />,
      },
      {
        id: "watchlistalerts",
        label: "Watchlist Alerts",
        icon: <Bell size={15} />,
      },
    ],
  },
  {
    key: "leads",
    label: "Leads & CRM",
    icon: <FolderKanban size={18} />,
    items: [
      { id: "pipeline", label: "Lead Pipeline", icon: <Layers size={15} /> },
      {
        id: "leadqualifications",
        label: "Lead Qualifications",
        icon: <ClipboardList size={15} />,
      },
      {
        id: "reminders",
        label: "Follow-ups & Reminders",
        icon: <Bell size={15} />,
      },
      {
        id: "referrals",
        label: "Referrals",
        icon: <HeartHandshake size={15} />,
      },
      { id: "partners", label: "Partners", icon: <Globe size={15} /> },
    ],
  },
  {
    key: "team",
    label: "Team",
    icon: <Users size={18} />,
    items: [
      { id: "team", label: "Staff Management", icon: <Users2 size={15} /> },
    ],
  },
  {
    key: "finance",
    label: "Finance",
    icon: <Wallet size={18} />,
    items: [
      {
        id: "tools",
        label: "Calculators & Tools",
        icon: <Sparkles size={15} />,
      },
    ],
  },
  {
    key: "legal",
    label: "Legal",
    icon: <Shield size={18} />,
    items: [
      {
        id: "legalforms",
        label: "Legal Forms Library",
        icon: <FileText size={15} />,
      },
      {
        id: "legaldocs",
        label: "Legal Documents",
        icon: <BookOpen size={15} />,
      },
    ],
  },
  {
    key: "content",
    label: "Content",
    icon: <Pencil size={18} />,
    items: [
      { id: "blog", label: "Blog Posts", icon: <BookOpen size={15} /> },
      { id: "byservice", label: "By Service", icon: <Database size={15} /> },
      {
        id: "announcements",
        label: "Announcements",
        icon: <Megaphone size={15} />,
      },
    ],
  },
  {
    key: "services",
    label: "Services",
    icon: <Flame size={18} />,
    items: [
      {
        id: "eventbookings",
        label: "Events & Hospitality",
        icon: <Boxes size={15} />,
      },
      {
        id: "artistmanagement",
        label: "Music & Artists",
        icon: <Music2 size={15} />,
      },
      {
        id: "csrmanagement",
        label: "NGO & CSR",
        icon: <HeartHandshake size={15} />,
      },
    ],
  },
  {
    key: "interactions",
    label: "Interactions",
    icon: <MessageSquare size={18} />,
    items: [
      { id: "chatbot", label: "Chatbot", icon: <Mic2 size={15} /> },
      { id: "feedback", label: "Feedback", icon: <ClipboardList size={15} /> },
      { id: "requests", label: "Requests", icon: <Zap size={15} /> },
      { id: "support", label: "Support", icon: <HeartHandshake size={15} /> },
    ],
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: <BarChart3 size={18} />,
    items: [
      {
        id: "analytics",
        label: "Analytics Dashboard",
        icon: <BarChart3 size={15} />,
      },
      {
        id: "market-data",
        label: "Market Intelligence",
        icon: <TrendingUp size={15} />,
      },
    ],
  },
  {
    key: "ai",
    label: "AI Command",
    icon: <Bot size={18} />,
    items: [
      {
        id: "ai-manager",
        label: "AI Operations Center",
        icon: <Sparkles size={15} />,
      },
      { id: "agents", label: "Agent Configuration", icon: <Cog size={15} /> },
      {
        id: "dashboard-enhancer",
        label: "Dashboard Enhancer",
        icon: <Zap size={15} />,
      },
      {
        id: "feature-suggestions",
        label: "Innovation Lab",
        icon: <FlaskConical size={15} />,
      },
      {
        id: "admin-ai",
        label: "Dashboard AI Assistant",
        icon: <Bot size={15} />,
      },
      {
        id: "lead-coordination",
        label: "Lead Coordination AI",
        icon: <GitBranch size={15} />,
      },
      {
        id: "ai-god-tier",
        label: "God Tier Intelligence",
        icon: <Sparkles size={15} />,
      },
      {
        id: "ai-agent-browser",
        label: "808 Agent Browser",
        icon: <Bot size={15} />,
      },
      {
        id: "ai-localities",
        label: "Locality Intelligence",
        icon: <Globe size={15} />,
      },
      {
        id: "ai-segments",
        label: "Client Segments",
        icon: <Users size={15} />,
      },
      {
        id: "ai-neural",
        label: "Neural Models",
        icon: <FlaskConical size={15} />,
      },
      {
        id: "ai-automation",
        label: "Automation Center",
        icon: <Zap size={15} />,
      },
      {
        id: "ai-expansion",
        label: "Innovation & Expansion",
        icon: <TrendingUp size={15} />,
      },
      {
        id: "ai-quality",
        label: "Quality & Security",
        icon: <Shield size={15} />,
      },
      {
        id: "ai-knowledge",
        label: "Knowledge Center",
        icon: <BookOpen size={15} />,
      },
      {
        id: "ai-continuous",
        label: "Self-Improvement",
        icon: <GitBranch size={15} />,
      },
    ],
  },
  {
    key: "ai-universe",
    label: "AI Universe",
    icon: <Brain size={18} />,
    items: [
      {
        id: "ai-command-center",
        label: "AI Command Center",
        icon: <Command size={15} />,
      },
      {
        id: "new-clusters",
        label: "675 Agents (Clusters 26-50)",
        icon: <Grid3x3 size={15} />,
      },
      {
        id: "ai-staff-directory",
        label: "AI Staff Directory",
        icon: <Users size={15} />,
      },
      {
        id: "ai-network-map",
        label: "AI Network Map",
        icon: <Network size={15} />,
      },
      {
        id: "ai-neural-lab",
        label: "Neural Lab",
        icon: <Brain size={15} />,
      },
      {
        id: "ai-learning-center",
        label: "Learning Center",
        icon: <GraduationCap size={15} />,
      },
      {
        id: "tutorial-manager",
        label: "Tutorial Manager",
        icon: <BookOpen size={15} />,
      },
    ],
  },
  {
    key: "security",
    label: "Security",
    icon: <ShieldAlert size={18} />,
    items: [
      {
        id: "security",
        label: "Security & Anti-Fraud",
        icon: <Shield size={15} />,
      },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    icon: <Settings size={18} />,
    items: [
      { id: "settings", label: "General Settings", icon: <Cog size={15} /> },
    ],
  },
  {
    key: "website",
    label: "Back to Website",
    icon: <Home size={18} />,
    singleId: "website" as TabId,
  },
];

// ── AdminSidebar component ──────────────────────────────────────────────────────

type AdminSidebarProps = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  newEnquiryBadgeCount?: number;
};

// ── SidebarTooltip ────────────────────────────────────────────────────────────

function SidebarTooltip({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  return (
    <div
      className="relative flex w-full"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-[200] whitespace-nowrap rounded-lg bg-[#0a0c10] border border-primary/40 px-3 py-1.5 text-xs font-sans text-foreground shadow-2xl pointer-events-none">
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#0a0c10]" />
        </div>
      )}
    </div>
  );
}

export default function AdminSidebar({
  activeTab,
  onTabChange,
  newEnquiryBadgeCount = 0,
}: AdminSidebarProps) {
  // Use ONLY the SidebarContext for state — no duplicate local state
  const { isExpanded, isMobileOpen, toggleExpanded, closeMobile } =
    useSidebar();

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      for (const cat of SIDEBAR_CATEGORIES) {
        if (cat.items?.some((item) => item.id === activeTab)) {
          initial[cat.key] = true;
        }
      }
      return initial;
    },
  );

  const backdropRef = useRef<HTMLDivElement>(null);

  // Escape key closes mobile overlay
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isMobileOpen) closeMobile();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileOpen, closeMobile]);

  function toggleCategory(key: string) {
    setOpenCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleItemClick(id: TabId) {
    // "website" is a special nav item — go back to main site
    if ((id as string) === "website") {
      window.location.href = "/";
      return;
    }
    onTabChange(id);
    if (isMobileOpen) closeMobile();
  }

  function isCategoryActive(cat: SidebarCategory): boolean {
    if (cat.singleId) return activeTab === (cat.singleId as string);
    return cat.items?.some((item) => item.id === activeTab) ?? false;
  }

  const collapsed = !isExpanded;

  const sidebarContent = (
    <div
      className={`flex flex-col h-full bg-[#0a0c10] border-r border-primary/20 transition-[width] duration-300 ease-in-out overflow-hidden ${
        collapsed ? "w-16" : "w-[280px]"
      } ${
        // Mobile overlay: full-screen width; desktop: constrained by w-16/w-[280px]
        isMobileOpen ? "w-full max-w-[280px]" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-primary/20 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-primary uppercase tracking-widest truncate">
              MSTC
            </span>
            <span className="text-[10px] text-muted-foreground/50 font-sans">
              Admin
            </span>
          </div>
        )}
        <div
          className={`flex items-center gap-1 ${collapsed ? "w-full justify-center" : "ml-auto"}`}
        >
          {/* Desktop collapse/expand toggle */}
          <button
            type="button"
            onClick={toggleExpanded}
            className="hidden md:flex p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            data-ocid="admin.sidebar.collapse_button"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          {/* Mobile X close — always functional, calls closeMobile from context */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeMobile();
            }}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
            aria-label="Close sidebar"
            data-ocid="admin.sidebar.close_button"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-0.5 px-2">
        {SIDEBAR_CATEGORIES.map((cat) => {
          const catActive = isCategoryActive(cat);
          const isOpen = openCategories[cat.key] ?? false;

          if (cat.singleId) {
            const btn = (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleItemClick(cat.singleId!)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group border-l-4 ${
                  catActive
                    ? "bg-primary/20 text-primary border-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground border-transparent"
                } ${collapsed ? "justify-center px-2" : ""}`}
                data-ocid={`admin.sidebar.${cat.key}`}
                aria-current={catActive ? "page" : undefined}
              >
                <span
                  className={`shrink-0 ${catActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-primary/80"}`}
                >
                  {cat.icon}
                </span>
                {!collapsed && <span className="truncate">{cat.label}</span>}
              </button>
            );
            return collapsed ? (
              <SidebarTooltip key={cat.key} label={cat.label}>
                {btn}
              </SidebarTooltip>
            ) : (
              btn
            );
          }

          return (
            <div key={cat.key}>
              {collapsed ? (
                <SidebarTooltip label={cat.label}>
                  <button
                    type="button"
                    onClick={() => {
                      // Expand sidebar and open this category
                      toggleExpanded();
                      setOpenCategories((prev) => ({
                        ...prev,
                        [cat.key]: true,
                      }));
                    }}
                    className={`w-full flex items-center justify-center p-2.5 rounded-lg transition-colors ${
                      catActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-white/5"
                    }`}
                    data-ocid={`admin.sidebar.cat.${cat.key}`}
                  >
                    <span className={catActive ? "text-primary" : ""}>
                      {cat.icon}
                    </span>
                  </button>
                </SidebarTooltip>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                    catActive && !isOpen
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                  data-ocid={`admin.sidebar.cat.${cat.key}`}
                >
                  <span
                    className={`shrink-0 ${
                      catActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-primary/80"
                    }`}
                  >
                    {cat.icon}
                  </span>
                  <span className="truncate flex-1 text-left">{cat.label}</span>
                  <span className="text-muted-foreground/50 shrink-0">
                    {isOpen ? (
                      <ChevronUp size={13} />
                    ) : (
                      <ChevronDown size={13} />
                    )}
                  </span>
                </button>
              )}

              {!collapsed && isOpen && (
                <div className="ml-3 mt-0.5 mb-1 space-y-0.5 border-l border-primary/20 pl-3">
                  {cat.items?.map((item) => {
                    const active = activeTab === item.id;
                    const badge =
                      item.id === "propertyenquiries"
                        ? newEnquiryBadgeCount
                        : 0;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 border-l-4 ${
                          active
                            ? "bg-primary/20 text-primary border-primary font-medium"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground border-transparent"
                        }`}
                        data-ocid={`admin.sidebar.${item.id}`}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.icon && (
                          <span
                            className={
                              active
                                ? "text-primary"
                                : "text-muted-foreground/70"
                            }
                          >
                            {item.icon}
                          </span>
                        )}
                        <span className="truncate flex-1 text-left">
                          {item.label}
                        </span>
                        {badge > 0 && (
                          <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold bg-destructive text-destructive-foreground">
                            {badge > 9 ? "9+" : badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className={`shrink-0 border-t border-primary/20 ${
          collapsed ? "px-2 py-3 flex justify-center" : "px-3 py-3"
        }`}
      >
        {collapsed ? (
          <SidebarTooltip label="Logout">
            <button
              type="button"
              className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
              aria-label="Logout"
              data-ocid="admin.sidebar.logout_button"
            >
              <LogOut size={16} />
            </button>
          </SidebarTooltip>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-primary">LP</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate font-sans">
                Love Parekh
              </p>
              <p className="text-[10px] text-muted-foreground/60 truncate font-sans">
                love@mstc
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
              aria-label="Logout"
              data-ocid="admin.sidebar.logout_button"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/*
       * DESKTOP: true flex child — push layout, NEVER position:fixed or position:absolute.
       * Width is 280px when expanded, 64px when collapsed.
       * The aside is a sibling of <main> in a flex-row container — content shifts, never overlaps.
       */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 h-screen overflow-hidden transition-[width] duration-300 ease-in-out ${
          collapsed ? "w-16" : "w-[280px]"
        }`}
        data-ocid="admin.sidebar"
        aria-label="Navigation sidebar"
      >
        {sidebarContent}
      </aside>

      {/*
       * MOBILE: full-screen overlay — ONLY shown on mobile (<768px) when isMobileOpen.
       * Uses position:fixed only for the overlay — not the desktop sidebar.
       * The X button and tapping the backdrop both call closeMobile() from SidebarContext.
       */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[200] flex md:hidden"
          data-ocid="admin.sidebar.mobile"
          aria-modal="true"
          role="dialog"
          aria-label="Navigation menu"
        >
          {/* Backdrop — tap anywhere outside drawer to close */}
          <div
            ref={backdropRef}
            className="fixed inset-0 bg-black/80"
            style={{ backdropFilter: "blur(4px)" }}
            onClick={closeMobile}
            onKeyDown={(e) => e.key === "Enter" && closeMobile()}
            role="button"
            tabIndex={-1}
            aria-label="Close menu"
          />
          {/* Drawer — slides in from left, NEVER covers entire screen */}
          <div className="relative z-[201] flex flex-col w-full max-w-[280px] max-h-screen overflow-y-auto shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
