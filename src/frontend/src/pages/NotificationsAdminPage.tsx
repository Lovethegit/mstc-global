import SecureAppGate from "@/components/shared/SecureAppGate";
import BackButton from "@/components/ui/BackButton";
import { useCrmNotifications } from "@/hooks/useCrmQueries";
import { Bell, Plus, Send, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PRIORITY_COLORS: Record<string, string> = {
  Urgent: "bg-red-900/20 text-red-300 border-red-800/30",
  Normal: "bg-gold-800/20 text-gold-300 border-gold-700/30",
  Info: "bg-blue-900/20 text-blue-300 border-blue-800/30",
};

const _MOCK_NOTIFICATIONS = [
  {
    id: 1n,
    appName: "Security",
    title: "2 suspicious login attempts blocked",
    message: "IP 45.12.xx.xx attempted access 2 times",
    priority: "Urgent",
    isRead: false,
    createdAt: 0n,
    targetRole: "admin",
  },
  {
    id: 2n,
    appName: "CRM",
    title: "3 new Hot leads added",
    message: "Rajesh Mehta, Kavita Desai, Mohan Agrawal added as hot leads",
    priority: "Normal",
    isRead: false,
    createdAt: 0n,
    targetRole: "admin",
  },
  {
    id: 3n,
    appName: "RERA",
    title: "SG Highway registration expires in 97 days",
    message: "Action required before Aug 31, 2025",
    priority: "Normal",
    isRead: true,
    createdAt: 0n,
    targetRole: "admin",
  },
  {
    id: 4n,
    appName: "Billing",
    title: "Vikram Patel commission overdue",
    message: "₹1,30,000 commission due for Navrangpura sale",
    priority: "Urgent",
    isRead: false,
    createdAt: 0n,
    targetRole: "admin",
  },
  {
    id: 5n,
    appName: "Platform",
    title: "System health check complete",
    message: "All 52 AIs active. Security score: 98/100",
    priority: "Info",
    isRead: true,
    createdAt: 0n,
    targetRole: "admin",
  },
  {
    id: 6n,
    appName: "Legal",
    title: "Privacy policy updated by Raksha AI",
    message: "PDPB v2.1 compliance update applied",
    priority: "Info",
    isRead: true,
    createdAt: 0n,
    targetRole: "admin",
  },
];

export default function NotificationsAdminPage() {
  const { data: fetchedNotifs = [] } = useCrmNotifications();

  type NotifItem = {
    id: bigint;
    appName: string;
    title: string;
    message: string;
    priority: string;
    isRead: boolean;
    createdAt: bigint;
    targetRole: string;
  };

  const SEEDED_NOTIFICATIONS: NotifItem[] = [
    {
      id: 1n,
      appName: "Security",
      title: "2 suspicious login attempts blocked",
      message: "IP 45.12.xx.xx attempted access 2 times",
      priority: "Urgent",
      isRead: false,
      createdAt: BigInt(Date.now() - 2 * 60000),
      targetRole: "admin",
    },
    {
      id: 2n,
      appName: "CRM",
      title: "3 new Hot leads added",
      message: "Rajesh Mehta, Kavita Desai, Mohan Agrawal added as hot leads",
      priority: "Normal",
      isRead: false,
      createdAt: BigInt(Date.now() - 5 * 60000),
      targetRole: "admin",
    },
    {
      id: 3n,
      appName: "RERA",
      title: "SG Highway registration expires in 97 days",
      message: "Action required before Aug 31, 2025",
      priority: "Normal",
      isRead: true,
      createdAt: BigInt(Date.now() - 20 * 60000),
      targetRole: "admin",
    },
    {
      id: 4n,
      appName: "Billing",
      title: "Vikram Patel commission overdue",
      message: "₹1,30,000 commission due for Navrangpura sale",
      priority: "Urgent",
      isRead: false,
      createdAt: BigInt(Date.now() - 35 * 60000),
      targetRole: "admin",
    },
    {
      id: 5n,
      appName: "Platform",
      title: "System health check complete",
      message: "All 52 AIs active. Security score: 98/100",
      priority: "Info",
      isRead: true,
      createdAt: BigInt(Date.now() - 60 * 60000),
      targetRole: "admin",
    },
    {
      id: 6n,
      appName: "Legal",
      title: "Privacy policy updated by Raksha AI",
      message: "PDPB v2.1 compliance update applied",
      priority: "Info",
      isRead: true,
      createdAt: BigInt(Date.now() - 90 * 60000),
      targetRole: "admin",
    },
    {
      id: 7n,
      appName: "Security",
      title: "Bot attack blocked — 47 requests filtered",
      message: "GateKeeper AI blocked automated scraping from 3 IPs",
      priority: "Normal",
      isRead: false,
      createdAt: BigInt(Date.now() - 110 * 60000),
      targetRole: "admin",
    },
    {
      id: 8n,
      appName: "Property",
      title: "New Gujarat RERA listing imported",
      message: "6 new listings added by ListingScanner AI",
      priority: "Info",
      isRead: true,
      createdAt: BigInt(Date.now() - 2 * 3600000),
      targetRole: "admin",
    },
    {
      id: 9n,
      appName: "Finance",
      title: "Q2 revenue projection updated",
      message: "Revenue Forecast AI updated pipeline to ₹2.3Cr",
      priority: "Normal",
      isRead: true,
      createdAt: BigInt(Date.now() - 3 * 3600000),
      targetRole: "admin",
    },
    {
      id: 10n,
      appName: "CRM",
      title: "Follow-up overdue: 4 leads",
      message:
        "Rajesh Iyer, Divya Nair, Prakash Patel, Sunil Bose require follow-up",
      priority: "Urgent",
      isRead: false,
      createdAt: BigInt(Date.now() - 5 * 3600000),
      targetRole: "admin",
    },
  ];

  const [notifications, setNotifications] = useState<NotifItem[]>(
    fetchedNotifs.length > 0
      ? (fetchedNotifs as unknown as NotifItem[])
      : SEEDED_NOTIFICATIONS,
  );
  const [tabFilter, setTabFilter] = useState("All");
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    type: "Email",
    segment: "All Clients",
    message: "",
    schedule: "now",
  });
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Summer Property Bonanza",
      type: "Email",
      segment: "All Clients",
      status: "Active",
      sent: 2340,
      opened: 41,
      clicked: 8,
    },
    {
      id: 2,
      name: "NRI Investment Webinar",
      type: "WhatsApp",
      segment: "NRI Clients",
      status: "Completed",
      sent: 567,
      opened: 67,
      clicked: 23,
    },
    {
      id: 3,
      name: "RERA Compliance Alert",
      type: "In-App",
      segment: "Agents",
      status: "Scheduled",
      sent: 0,
      opened: 0,
      clicked: 0,
    },
    {
      id: 4,
      name: "June EMI Due Reminders",
      type: "WhatsApp",
      segment: "Borrowers",
      status: "Active",
      sent: 780,
      opened: 72,
      clicked: 31,
    },
  ]);
  const [activeView, setActiveView] = useState<"notifications" | "campaigns">(
    "notifications",
  );

  const CAMPAIGN_STATUS_COLORS: Record<string, string> = {
    Active: "bg-green-900/20 text-green-300 border-green-800/30",
    Completed: "bg-blue-900/20 text-blue-300 border-blue-800/30",
    Scheduled: "bg-amber-900/20 text-amber-300 border-amber-800/30",
  };

  function handleCreateCampaign(e: React.FormEvent) {
    e.preventDefault();
    const newCampaign = {
      id: Date.now(),
      name: campaignForm.name,
      type: campaignForm.type,
      segment: campaignForm.segment,
      status: campaignForm.schedule === "now" ? "Active" : "Scheduled",
      sent: campaignForm.schedule === "now" ? 847 : 0,
      opened: campaignForm.schedule === "now" ? 34 : 0,
      clicked: campaignForm.schedule === "now" ? 8 : 0,
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
    setShowCreateCampaign(false);
    setCampaignForm({
      name: "",
      type: "Email",
      segment: "All Clients",
      message: "",
      schedule: "now",
    });
    toast.success(
      campaignForm.schedule === "now"
        ? `Campaign launched to ${campaignForm.segment}`
        : "Campaign scheduled",
    );
  }

  const FILTER_TABS = ["All", "Unread", "Security", "System"];

  const filtered = notifications.filter((n) => {
    if (tabFilter === "Unread") return !n.isRead;
    if (tabFilter === "Security") return n.appName === "Security";
    if (tabFilter === "System") return n.appName === "Platform";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  }

  function deleteNotif(id: bigint) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function sendTestNotif() {
    const now = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const testNotif: NotifItem = {
      id: BigInt(Date.now()),
      appName: "System",
      title: `Test notification sent at ${now}`,
      message: "This is a test notification from the admin panel.",
      priority: "Info",
      isRead: false,
      createdAt: BigInt(Date.now()),
      targetRole: "admin",
    };
    setNotifications((prev) => [testNotif, ...prev]);
    toast.success(`Test notification sent at ${now}`);
  }

  function timeAgo(ts: bigint) {
    const diff = Date.now() - Number(ts);
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  }

  return (
    <SecureAppGate appName="Notification Center">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="notifications_admin.page"
      >
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BackButton />
              <Bell className="w-4 h-4 text-gold-400" />
              <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
                Notification Center
              </h1>
              {unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={sendTestNotif}
                className="text-xs px-2 py-1 rounded bg-gold-700/10 text-gold-500 hover:bg-gold-700/20 transition-colors"
                data-ocid="notifications_admin.send_test_button"
              >
                Send Test
              </button>
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-gold-600 hover:text-gold-400 transition-colors"
                data-ocid="notifications_admin.mark_all_read_button"
              >
                Mark all read
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {(["notifications", "campaigns"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setActiveView(v)}
                className={`px-3 py-1 rounded-full text-xs border capitalize transition-colors ${
                  activeView === v
                    ? "bg-gold-700/30 text-gold-300 border-gold-600/50"
                    : "border-gold-800/30 text-gold-600"
                }`}
                data-ocid={`notifications_admin.view.${v}`}
              >
                {v}
              </button>
            ))}
          </div>
          {activeView === "notifications" && (
            <div className="flex gap-2 mt-2">
              {FILTER_TABS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTabFilter(p)}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${tabFilter === p ? "bg-gold-700/30 text-gold-300 border-gold-600/50" : "border-gold-800/30 text-gold-600"}`}
                  data-ocid={`notifications_admin.filter.${p.toLowerCase().replace(" ", "_")}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-4">
          {activeView === "notifications" && (
            <div className="space-y-2">
              {filtered.map((notif, i) => (
                <div
                  key={String(notif.id)}
                  className={`rounded-xl border p-4 transition-all ${notif.isRead ? "border-gold-800/20 bg-card/50" : "border-gold-700/40 bg-card"}`}
                  data-ocid={`notifications_admin.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-medium text-gold-600 uppercase tracking-wide">
                          {notif.appName}
                        </span>
                        <span
                          className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] border ${PRIORITY_COLORS[notif.priority] ?? ""}`}
                        >
                          {notif.priority}
                        </span>
                        {!notif.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                        )}
                        <span className="text-[10px] text-muted-foreground ml-auto">
                          {timeAgo(notif.createdAt)}
                        </span>
                      </div>
                      <p
                        className={`text-sm text-foreground ${!notif.isRead ? "font-semibold" : "font-medium"}`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {notif.message}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteNotif(notif.id)}
                      className="shrink-0 text-muted-foreground hover:text-red-400 transition-colors p-1"
                      data-ocid={`notifications_admin.delete_button.${i + 1}`}
                      aria-label="Delete notification"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div
                  className="text-center py-12"
                  data-ocid="notifications_admin.empty_state"
                >
                  <Bell className="w-12 h-12 text-gold-800/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No notifications
                  </p>
                </div>
              )}
            </div>
          )}

          {activeView === "campaigns" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-serif text-lg text-gold-300">Campaigns</h2>
                <button
                  type="button"
                  onClick={() => setShowCreateCampaign(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
                  data-ocid="notifications_admin.create_campaign_button"
                >
                  <Plus className="w-3.5 h-3.5" /> New Campaign
                </button>
              </div>
              {campaigns.map((c, i) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-gold-800/30 bg-card p-4"
                  data-ocid={`notifications_admin.campaign.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-medium text-foreground text-sm">
                        {c.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {c.type} • {c.segment}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${CAMPAIGN_STATUS_COLORS[c.status] ?? ""}`}
                    >
                      {c.status}
                    </span>
                  </div>
                  {c.sent > 0 && (
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {c.sent.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Sent
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-400">
                          {c.opened}%
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Opened
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-green-400">
                          {c.clicked}%
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Clicked
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {showCreateCampaign && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            data-ocid="notifications_admin.campaign_dialog"
          >
            <div
              className="absolute inset-0 bg-black/60"
              role="presentation"
              onKeyDown={() => {}}
              onClick={() => setShowCreateCampaign(false)}
            />
            <div className="relative bg-card border border-gold-700/40 rounded-2xl p-6 w-full max-w-md">
              <button
                type="button"
                onClick={() => setShowCreateCampaign(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                data-ocid="notifications_admin.close_button"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="font-serif text-lg font-bold text-gold-400 mb-4">
                New Campaign
              </h2>
              <form onSubmit={handleCreateCampaign} className="space-y-3">
                <div>
                  <label className="text-xs text-gold-600">
                    Campaign Name *
                  </label>
                  <input
                    required
                    value={campaignForm.name}
                    onChange={(e) =>
                      setCampaignForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                    data-ocid="notifications_admin.campaign_name_input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gold-600">Type</label>
                    <select
                      value={campaignForm.type}
                      onChange={(e) =>
                        setCampaignForm((f) => ({ ...f, type: e.target.value }))
                      }
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                      data-ocid="notifications_admin.campaign_type_select"
                    >
                      {["Email", "WhatsApp", "In-App", "Push"].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gold-600">Audience</label>
                    <select
                      value={campaignForm.segment}
                      onChange={(e) =>
                        setCampaignForm((f) => ({
                          ...f,
                          segment: e.target.value,
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                      data-ocid="notifications_admin.campaign_segment_select"
                    >
                      {[
                        "All Clients",
                        "Hot Leads",
                        "Cold Leads",
                        "Premium Clients",
                        "NRI Clients",
                        "Agents",
                        "Borrowers",
                      ].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gold-600">Message</label>
                  <textarea
                    required
                    value={campaignForm.message}
                    onChange={(e) =>
                      setCampaignForm((f) => ({
                        ...f,
                        message: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm resize-none"
                    data-ocid="notifications_admin.campaign_message_input"
                  />
                </div>
                <div>
                  <label className="text-xs text-gold-600">Schedule</label>
                  <select
                    value={campaignForm.schedule}
                    onChange={(e) =>
                      setCampaignForm((f) => ({
                        ...f,
                        schedule: e.target.value,
                      }))
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                    data-ocid="notifications_admin.campaign_schedule_select"
                  >
                    <option value="now">Send Now</option>
                    <option value="scheduled">Schedule Later</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateCampaign(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gold-800/40 text-muted-foreground text-sm"
                    data-ocid="notifications_admin.cancel_button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg bg-gold-700/30 hover:bg-gold-700/40 text-gold-300 text-sm font-medium flex items-center justify-center gap-1.5"
                    data-ocid="notifications_admin.launch_button"
                  >
                    <Send className="w-3.5 h-3.5" /> Launch
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SecureAppGate>
  );
}
