import { Link, useLocation } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, LogOut, X } from "lucide-react";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// ─── Context ────────────────────────────────────────────────────────────────

export type AppSidebarContextType = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  toggleExpanded: () => void;
  openMobile: () => void;
  closeMobile: () => void;
};

export const AppSidebarContext = createContext<AppSidebarContextType>({
  isExpanded: true,
  isMobileOpen: false,
  toggleExpanded: () => {},
  openMobile: () => {},
  closeMobile: () => {},
});

export function useAppSidebar() {
  return useContext(AppSidebarContext);
}

const SIDEBAR_KEY = "mstc_app_sidebar_expanded";

export function AppSidebarProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem(SIDEBAR_KEY);
      return v === null ? true : v === "true";
    } catch {
      return true;
    }
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_KEY, String(next));
      } catch {
        /* noop */
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
    <AppSidebarContext.Provider
      value={{
        isExpanded,
        isMobileOpen,
        toggleExpanded,
        openMobile,
        closeMobile,
      }}
    >
      {children}
    </AppSidebarContext.Provider>
  );
}

// ─── Nav item types ──────────────────────────────────────────────────────────

export type AppNavItem = {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
  badge?: number;
};

export type AppNavGroup = {
  key: string;
  label: string;
  icon: ReactNode;
  items: AppNavItem[];
};

export type AppSidebarProps = {
  /** App title shown in header */
  appTitle: string;
  /** Navigation groups */
  navGroups: AppNavGroup[];
  /** User info */
  userName?: string;
  userRole?: string;
  /** Back-to-launcher path */
  launcherPath?: string;
  onLogout?: () => void;
};

// ─── Tooltip for collapsed icons ─────────────────────────────────────────────

function SidebarTooltip({
  children,
  label,
}: { children: ReactNode; label: string }) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 px-2.5 py-1.5 bg-card border border-primary/20 rounded-lg text-xs text-foreground whitespace-nowrap shadow-lg pointer-events-none">
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-primary/20" />
        </div>
      )}
    </div>
  );
}

// ─── Main AppSidebar component ───────────────────────────────────────────────

export default function AppSidebar({
  appTitle,
  navGroups,
  userName = "Admin",
  userRole = "Administrator",
  launcherPath = "/apps",
  onLogout,
}: AppSidebarProps) {
  const { isExpanded, isMobileOpen, toggleExpanded, closeMobile } =
    useAppSidebar();
  const location = useLocation();
  const backdropRef = useRef<HTMLDivElement>(null);
  const collapsed = !isExpanded;

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sidebarContent = (
    <div
      className="flex flex-col h-full bg-[oklch(0.12_0.015_62)] border-r border-primary/20"
      style={{ minWidth: collapsed ? 56 : 280, maxWidth: collapsed ? 56 : 280 }}
    >
      {/* Header */}
      <div
        className={`shrink-0 flex items-center border-b border-primary/20 h-14 ${collapsed ? "justify-center px-2" : "px-4 gap-3"}`}
      >
        {collapsed ? (
          <SidebarTooltip label={appTitle}>
            <button
              type="button"
              onClick={toggleExpanded}
              className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center hover:bg-primary/25 transition-colors"
              aria-label="Expand sidebar"
              data-ocid="app.sidebar.expand_button"
            >
              <span className="text-xs font-bold text-primary font-serif">
                {appTitle.charAt(0)}
              </span>
            </button>
          </SidebarTooltip>
        ) : (
          <>
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary font-serif">
                {appTitle.charAt(0)}
              </span>
            </div>
            <span className="flex-1 min-w-0 text-sm font-bold text-foreground tracking-wide font-serif truncate">
              {appTitle}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={toggleExpanded}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="Collapse sidebar"
                data-ocid="app.sidebar.collapse_button"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={closeMobile}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors md:hidden"
                aria-label="Close menu"
                data-ocid="app.sidebar.close_button"
              >
                <X size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-0.5 px-2">
        {navGroups.map((group) => (
          <div key={group.key} className="mb-1">
            {!collapsed && (
              <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <span className="opacity-60">{group.icon}</span>
                <span>{group.label}</span>
              </div>
            )}
            {group.items.map((item) => {
              const active = isActive(item.path);
              const btn = (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center rounded-xl transition-all duration-150 ${
                    collapsed
                      ? "justify-center w-10 h-10 mx-auto"
                      : "gap-2.5 px-2.5 py-2 w-full"
                  } ${
                    active
                      ? "bg-primary/15 border border-primary/30 text-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                  }`}
                  aria-current={active ? "page" : undefined}
                  data-ocid={`app.sidebar.nav.${item.id}`}
                >
                  <span
                    className={
                      active ? "text-primary" : "text-muted-foreground/70"
                    }
                  >
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="truncate flex-1 text-sm">
                        {item.label}
                      </span>
                      {(item.badge ?? 0) > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold bg-destructive text-destructive-foreground">
                          {(item.badge ?? 0) > 9 ? "9+" : item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
              return collapsed ? (
                <SidebarTooltip key={item.id} label={item.label}>
                  {btn}
                </SidebarTooltip>
              ) : (
                <div key={item.path}>{btn}</div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={`shrink-0 border-t border-primary/20 ${collapsed ? "px-2 py-3 flex flex-col items-center gap-2" : "px-3 py-3 space-y-2"}`}
      >
        {/* Back to launcher */}
        {collapsed ? (
          <SidebarTooltip label="App Launcher">
            <Link
              to={launcherPath}
              className="w-10 h-10 rounded-xl border border-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              data-ocid="app.sidebar.launcher_button"
            >
              <ChevronRight size={16} />
            </Link>
          </SidebarTooltip>
        ) : (
          <Link
            to={launcherPath}
            className="flex items-center gap-2 px-2.5 py-2 rounded-xl border border-primary/20 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors text-sm w-full"
            data-ocid="app.sidebar.launcher_button"
          >
            <ChevronRight size={15} />
            <span className="truncate">App Launcher</span>
          </Link>
        )}
        {/* User info */}
        {collapsed ? (
          <SidebarTooltip label={userName}>
            <button
              type="button"
              onClick={onLogout}
              className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center hover:bg-red-500/10 transition-colors"
              aria-label="User menu"
              data-ocid="app.sidebar.user_avatar"
            >
              <span className="text-xs font-bold text-primary">{initials}</span>
            </button>
          </SidebarTooltip>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-primary">
                {initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {userName}
              </p>
              <p className="text-[10px] text-muted-foreground/60 truncate">
                {userRole}
              </p>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                aria-label="Logout"
                data-ocid="app.sidebar.logout_button"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/*
       * DESKTOP SIDEBAR — true flex child, NEVER position:fixed or position:absolute.
       * Width animates between w-14 (collapsed) and w-[280px] (expanded).
       * The <aside> is a SIBLING of <main> inside a flex-row container.
       * Content area is flex-1 and fills the remaining space automatically.
       * This is what prevents the sidebar from overlapping content.
       */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 h-screen overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] relative ${
          collapsed ? "w-14" : "w-[280px]"
        }`}
        style={{
          position: "relative",
        }} /* hard override — ensure never fixed */
        data-ocid="app.sidebar"
        aria-label="App navigation sidebar"
      >
        {sidebarContent}
      </aside>

      {/*
       * MOBILE SIDEBAR — fixed overlay ONLY on small screens (<768px).
       * Desktop <aside> above is hidden on mobile via `hidden md:flex`.
       * This overlay is only rendered when isMobileOpen is true.
       * Tapping the backdrop calls closeMobile().
       */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[200] flex md:hidden"
          data-ocid="app.sidebar.mobile"
          aria-modal="true"
          role="dialog"
          aria-label="Navigation menu"
        >
          {/* Backdrop — tap to close */}
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
          {/* Drawer panel */}
          <div className="relative z-[201] flex flex-col w-full max-w-[280px] max-h-screen overflow-y-auto shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
