import { SidebarProvider, useSidebar } from "@/components/AdminSidebar";
import AdminSidebar from "@/components/AdminSidebar";
import type { TabId } from "@/components/AdminSidebarTypes";
import AppTopBar from "@/components/layout/AppTopBar";
import type React from "react";

// Re-export for convenience
export { useSidebar, SidebarProvider };
// Re-export new shared layout components
export {
  default as AppSidebar,
  AppSidebarProvider,
  useAppSidebar,
} from "@/components/layout/AppSidebar";
export type {
  AppNavItem,
  AppNavGroup,
  AppSidebarProps,
} from "@/components/layout/AppSidebar";

type AppLayoutProps = {
  children: React.ReactNode;
  /** Optional: controlled active tab for the admin sidebar */
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
  newEnquiryBadgeCount?: number;
  /** If true, renders with the admin sidebar (internal app layout) */
  withSidebar?: boolean;
  /** App title shown in the top bar */
  appTitle?: string;
  /** Notification count for the top bar bell */
  notificationCount?: number;
  /** Show the app top bar */
  showTopBar?: boolean;
};

/**
 * AppLayout wraps the entire internal app shell.
 *
 * Desktop push-layout:
 *   <div.flex.flex-row.h-screen>
 *     <AdminSidebar />   ← fixed-width flex child (280px / 64px)
 *     <main.flex-1 />    ← takes remaining space, never obscured
 *   </div>
 *
 * Mobile:
 *   Sidebar renders as an overlay (fixed, z-[200]) with backdrop.
 *   The main content area is never shifted — it fills the full width.
 */
export default function AppLayout({
  children,
  activeTab = "overview",
  onTabChange,
  newEnquiryBadgeCount = 0,
  withSidebar = true,
  appTitle,
  notificationCount = 0,
  showTopBar = false,
}: AppLayoutProps) {
  if (!withSidebar) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppLayoutInner
        activeTab={activeTab}
        onTabChange={onTabChange}
        newEnquiryBadgeCount={newEnquiryBadgeCount}
        appTitle={appTitle}
        notificationCount={notificationCount}
        showTopBar={showTopBar}
      >
        {children}
      </AppLayoutInner>
    </SidebarProvider>
  );
}

// Inner component — has access to SidebarProvider context
function AppLayoutInner({
  children,
  activeTab = "overview",
  onTabChange,
  newEnquiryBadgeCount = 0,
  appTitle,
  notificationCount = 0,
  showTopBar = false,
}: Omit<AppLayoutProps, "withSidebar">) {
  const { openMobile } = useSidebar();

  return (
    /*
     * ╔══════════════════════════════════════════════════════════════╗
     * ║  PUSH LAYOUT — flex-row root                                 ║
     * ║  AdminSidebar → hidden md:flex flex-col flex-shrink-0        ║
     * ║  (width: 280px expanded / 64px collapsed, position:relative) ║
     * ║  Content div → flex-1 min-w-0 (fills remaining space)        ║
     * ║  Sidebar NEVER overlaps content on desktop.                  ║
     * ╚══════════════════════════════════════════════════════════════╝
     */
    <div
      className="flex flex-row h-screen w-screen overflow-hidden bg-[oklch(0.1_0.01_60)]"
      data-ocid="app.layout.root"
    >
      {/*
       * AdminSidebar renders:
       *   Desktop: <aside className="hidden md:flex flex-col flex-shrink-0 ..."> — true flex child
       *   Mobile: fixed overlay — only when isMobileOpen=true
       */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={(tab) => onTabChange?.(tab)}
        newEnquiryBadgeCount={newEnquiryBadgeCount}
      />

      {/*
       * Main content — flex-1 means it fills ALL remaining space after sidebar.
       * min-w-0 prevents flex overflow on narrow screens.
       * Never obscured by sidebar on desktop.
       */}
      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden"
        data-ocid="app.layout.content_area"
      >
        {/* Top bar — shown on mobile as hamburger, on desktop when showTopBar=true */}
        {showTopBar && appTitle ? (
          <AppTopBar title={appTitle} notificationCount={notificationCount} />
        ) : (
          <div
            className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-primary/20 bg-[oklch(0.08_0.008_60)] shrink-0"
            data-ocid="app.layout.mobile_topbar"
          >
            <button
              type="button"
              onClick={openMobile}
              className="p-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors tap-target"
              aria-label="Open navigation menu"
              data-ocid="app.layout.hamburger_button"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span className="text-sm font-bold text-primary tracking-widest font-serif">
              MSTC
            </span>
          </div>
        )}

        {/* Page content — scrolls independently, never clipped by sidebar */}
        <main
          className="flex-1 overflow-y-auto min-w-0"
          data-ocid="app.layout.main_content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
