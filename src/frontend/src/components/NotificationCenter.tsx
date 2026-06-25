import {
  AlertTriangle,
  Bell,
  CheckCheck,
  Shield,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type NotifCategory = "security" | "leads" | "deals" | "system" | "ai";

type AppNotification = {
  id: string;
  title: string;
  message: string;
  category: NotifCategory;
  time: string;
  read: boolean;
};

const SAMPLE_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    title: "Security Alert",
    message: "New login attempt from unknown device in Mumbai",
    category: "security",
    time: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    title: "New Lead",
    message: "Vikram Shah enquired about 3BHK in Bopal",
    category: "leads",
    time: "15 min ago",
    read: false,
  },
  {
    id: "n3",
    title: "Deal Update",
    message: "Commercial deal at Navrangpura moved to negotiation stage",
    category: "deals",
    time: "1 hr ago",
    read: false,
  },
  {
    id: "n4",
    title: "AI Agent",
    message:
      "Property Intelligence AI found 12 new listings matching watchlist",
    category: "ai",
    time: "2 hr ago",
    read: true,
  },
  {
    id: "n5",
    title: "System",
    message: "Security audit completed — Score: 94/100",
    category: "system",
    time: "3 hr ago",
    read: true,
  },
  {
    id: "n6",
    title: "New Lead",
    message: "Priya Mehta requested callback for Plot in SG Highway",
    category: "leads",
    time: "4 hr ago",
    read: true,
  },
];

const CATEGORY_ICONS: Record<NotifCategory, React.ReactNode> = {
  security: <Shield size={13} />,
  leads: <Users size={13} />,
  deals: <TrendingUp size={13} />,
  system: <Zap size={13} />,
  ai: <AlertTriangle size={13} />,
};

const CATEGORY_COLORS: Record<NotifCategory, string> = {
  security: "text-red-400 bg-red-500/10 border-red-500/20",
  leads: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  deals: "text-primary bg-primary/10 border-primary/20",
  system: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  ai: "text-orange-400 bg-orange-500/10 border-orange-500/20",
};

type Props = {
  onClose: () => void;
};

export default function NotificationCenter({ onClose }: Props) {
  const [notifications, setNotifications] =
    useState<AppNotification[]>(SAMPLE_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | NotifCategory>("all");
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleKey);
    }, 50);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  const clearAll = () => setNotifications([]);

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.category === filter);

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-[340px] max-w-[90vw] bg-[oklch(0.13_0.015_62)] border border-primary/20 rounded-2xl shadow-2xl z-[150] overflow-hidden"
      data-ocid="notification_center.panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary/15">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-primary" />
          <span className="text-sm font-bold text-foreground font-serif">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              aria-label="Mark all read"
              data-ocid="notification_center.mark_all_read_button"
            >
              <CheckCheck size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={clearAll}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors text-[10px] font-sans"
            aria-label="Clear all notifications"
            data-ocid="notification_center.clear_all_button"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
            aria-label="Close notifications"
            data-ocid="notification_center.close_button"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-primary/10 overflow-x-auto">
        {(["all", "security", "leads", "deals", "ai", "system"] as const).map(
          (cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-colors shrink-0 ${
                filter === cat
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
              }`}
              data-ocid={`notification_center.filter.${cat}`}
            >
              {cat === "all" ? `All (${notifications.length})` : cat}
            </button>
          ),
        )}
      </div>

      {/* Notification list */}
      <div className="max-h-[360px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-10 text-muted-foreground"
            data-ocid="notification_center.empty_state"
          >
            <Bell size={28} className="mb-2 opacity-30" />
            <span className="text-sm">No notifications</span>
          </div>
        ) : (
          filtered.map((notif, i) => (
            <button
              key={notif.id}
              type="button"
              onClick={() => markRead(notif.id)}
              className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-primary/10 hover:bg-primary/5 transition-colors ${notif.read ? "opacity-60" : ""}`}
              data-ocid={`notification_center.item.${i + 1}`}
            >
              <span
                className={`shrink-0 mt-0.5 p-1.5 rounded-lg border ${CATEGORY_COLORS[notif.category]}`}
              >
                {CATEGORY_ICONS[notif.category]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-semibold ${notif.read ? "text-muted-foreground" : "text-foreground"}`}
                  >
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {notif.time}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 text-left">
                  {notif.message}
                </p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
