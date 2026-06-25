import AppShareMenu from "@/components/AppShareMenu";
import GlobalSearch from "@/components/GlobalSearch";
import NotificationCenter from "@/components/NotificationCenter";
import { useAppSidebar } from "@/components/layout/AppSidebar";
import { Bell, Command, Menu, Search, Share2 } from "lucide-react";
import { useState } from "react";

export type AppTopBarProps = {
  /** Title shown in the top bar */
  title: string;
  /** Optional breadcrumb trail */
  breadcrumbs?: { label: string; path?: string }[];
  /** Notification count for badge */
  notificationCount?: number;
  /** User initials for avatar */
  userInitials?: string;
  userName?: string;
  /** Show share button */
  showShare?: boolean;
};

export default function AppTopBar({
  title,
  breadcrumbs,
  notificationCount = 0,
  userInitials = "LP",
  userName = "Love Parekh",
  showShare = true,
}: AppTopBarProps) {
  const { openMobile } = useAppSidebar();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <header
        className="shrink-0 h-14 flex items-center gap-3 px-4 bg-[oklch(0.12_0.015_62)] border-b border-primary/20 sticky top-0 z-30"
        data-ocid="app.topbar"
      >
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={openMobile}
          className="md:hidden p-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors shrink-0"
          aria-label="Open navigation"
          data-ocid="app.topbar.hamburger_button"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumbs / Title */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-hidden">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <nav
              aria-label="breadcrumb"
              className="flex items-center gap-1 text-sm overflow-hidden"
            >
              {breadcrumbs.map((crumb, i) => (
                <span
                  key={crumb.label}
                  className="flex items-center gap-1 min-w-0"
                >
                  {i > 0 && <span className="text-primary/40 shrink-0">/</span>}
                  <span
                    className={`truncate ${
                      i === breadcrumbs.length - 1
                        ? "text-foreground font-semibold font-serif"
                        : "text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    }`}
                  >
                    {crumb.label}
                  </span>
                </span>
              ))}
            </nav>
          ) : (
            <h1 className="text-sm font-bold text-foreground font-serif truncate tracking-wide">
              {title}
            </h1>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Search */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/30 border border-border/40 text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all text-xs hidden sm:flex"
            aria-label="Search (Ctrl+K)"
            data-ocid="app.topbar.search_button"
          >
            <Search size={13} />
            <span>Search</span>
            <div className="flex items-center gap-0.5 ml-1">
              <kbd className="px-1 py-0.5 rounded bg-muted/60 text-[10px] flex items-center gap-0.5">
                <Command size={9} />K
              </kbd>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="sm:hidden p-2 rounded-xl border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
            aria-label="Search"
            data-ocid="app.topbar.search_icon_button"
          >
            <Search size={16} />
          </button>

          {/* Share */}
          {showShare && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShareOpen((prev) => !prev)}
                className="p-2 rounded-xl border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                aria-label="Share this app"
                data-ocid="app.topbar.share_button"
              >
                <Share2 size={16} />
              </button>
              {shareOpen && (
                <AppShareMenu onClose={() => setShareOpen(false)} />
              )}
            </div>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen((prev) => !prev)}
              className="relative p-2 rounded-xl border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} unread)` : ""}`}
              data-ocid="app.topbar.notifications_button"
            >
              <Bell size={16} />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <NotificationCenter onClose={() => setNotifOpen(false)} />
            )}
          </div>

          {/* User Avatar */}
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center hover:bg-primary/30 transition-colors"
            aria-label={`User: ${userName}`}
            data-ocid="app.topbar.user_avatar"
          >
            <span className="text-xs font-bold text-primary font-sans">
              {userInitials}
            </span>
          </button>
        </div>
      </header>

      {/* Global Search Modal */}
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
    </>
  );
}
