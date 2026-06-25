import BackButton from "@/components/ui/BackButton";
import CloseButton from "@/components/ui/CloseButton";
import Modal from "@/components/ui/Modal";
import { useState } from "react";

type NotifRow = {
  id: number;
  recipient: string;
  type: string;
  messagePreview: string;
  sentTime: string;
  status: "Delivered" | "Opened" | "Failed" | "Pending";
  channel: "Email" | "WhatsApp" | "In-App" | "Push";
};

const NOTIFS: NotifRow[] = [
  {
    id: 1,
    recipient: "Rajesh Patel",
    type: "Property Alert",
    messagePreview: "New 3BHK listing in Bopal matches your search",
    sentTime: "2026-05-28 14:32",
    status: "Opened",
    channel: "Email",
  },
  {
    id: 2,
    recipient: "Sunita Mehta",
    type: "Appointment Reminder",
    messagePreview: "Your site visit tomorrow at 10 AM — Prahlad Nagar",
    sentTime: "2026-05-28 12:15",
    status: "Delivered",
    channel: "WhatsApp",
  },
  {
    id: 3,
    recipient: "Amit Shah",
    type: "Loan Update",
    messagePreview: "Your home loan application status: Under Review",
    sentTime: "2026-05-28 11:05",
    status: "Opened",
    channel: "Email",
  },
  {
    id: 4,
    recipient: "Priya Joshi",
    type: "System",
    messagePreview: "Your MSTC portal login from new device detected",
    sentTime: "2026-05-28 10:44",
    status: "Delivered",
    channel: "In-App",
  },
  {
    id: 5,
    recipient: "All Staff (45)",
    type: "Announcement",
    messagePreview: "New RERA compliance checklist released",
    sentTime: "2026-05-28 09:30",
    status: "Delivered",
    channel: "In-App",
  },
  {
    id: 6,
    recipient: "Vijay Rathod",
    type: "Price Alert",
    messagePreview: "Property you saved dropped 2.5% in price",
    sentTime: "2026-05-28 08:45",
    status: "Opened",
    channel: "Push",
  },
  {
    id: 7,
    recipient: "Kavita Desai",
    type: "Payment Due",
    messagePreview: "EMI of ₹38,200 due on 01 Jun 2026",
    sentTime: "2026-05-27 18:20",
    status: "Opened",
    channel: "WhatsApp",
  },
  {
    id: 8,
    recipient: "Nikhil Gupta",
    type: "Document Ready",
    messagePreview: "Your sale deed draft is ready for review",
    sentTime: "2026-05-27 17:10",
    status: "Delivered",
    channel: "Email",
  },
  {
    id: 9,
    recipient: "Rupa Agarwal",
    type: "Appointment Reminder",
    messagePreview: "Meeting with RERA consultant at 3 PM today",
    sentTime: "2026-05-27 10:00",
    status: "Failed",
    channel: "Push",
  },
  {
    id: 10,
    recipient: "Finance Team (8)",
    type: "Announcement",
    messagePreview: "RBI rate cut: Update home loan calculators",
    sentTime: "2026-05-27 09:15",
    status: "Delivered",
    channel: "Email",
  },
  {
    id: 11,
    recipient: "Deepak Verma",
    type: "Property Alert",
    messagePreview: "Rental property available in Satellite area",
    sentTime: "2026-05-26 16:45",
    status: "Opened",
    channel: "WhatsApp",
  },
  {
    id: 12,
    recipient: "Leena Kapoor",
    type: "Legal Update",
    messagePreview: "Your rental agreement valid until Aug 2026",
    sentTime: "2026-05-26 15:30",
    status: "Opened",
    channel: "Email",
  },
  {
    id: 13,
    recipient: "Sanjay Modi",
    type: "System",
    messagePreview: "Password changed successfully",
    sentTime: "2026-05-26 14:20",
    status: "Delivered",
    channel: "In-App",
  },
  {
    id: 14,
    recipient: "Anita Solanki",
    type: "Investment Alert",
    messagePreview: "Plot prices in Shela up 4.2% this month",
    sentTime: "2026-05-26 11:00",
    status: "Opened",
    channel: "Email",
  },
  {
    id: 15,
    recipient: "All Clients (247)",
    type: "Campaign",
    messagePreview: "Summer Property Bonanza — Limited offers!",
    sentTime: "2026-05-25 09:00",
    status: "Delivered",
    channel: "Email",
  },
  {
    id: 16,
    recipient: "Rohit Sharma",
    type: "Appointment Reminder",
    messagePreview: "Property registration appointment confirmed",
    sentTime: "2026-05-25 08:30",
    status: "Opened",
    channel: "WhatsApp",
  },
  {
    id: 17,
    recipient: "Farah Sheikh",
    type: "Property Alert",
    messagePreview: "3 new properties match your criteria",
    sentTime: "2026-05-24 17:45",
    status: "Pending",
    channel: "Push",
  },
  {
    id: 18,
    recipient: "Manish Trivedi",
    type: "Payment Due",
    messagePreview: "Token amount receipt — Bodakdev Heights",
    sentTime: "2026-05-24 14:20",
    status: "Opened",
    channel: "Email",
  },
  {
    id: 19,
    recipient: "Admin (love@mstc)",
    type: "System",
    messagePreview: "Daily briefing: 12 new leads, 3 appointments",
    sentTime: "2026-05-24 08:00",
    status: "Opened",
    channel: "In-App",
  },
  {
    id: 20,
    recipient: "Sales Team (12)",
    type: "Announcement",
    messagePreview: "New property listings added — Prahlad Nagar",
    sentTime: "2026-05-23 16:30",
    status: "Delivered",
    channel: "WhatsApp",
  },
  {
    id: 21,
    recipient: "Harish Bhatt",
    type: "Re-engagement",
    messagePreview: "We miss you! Check latest properties",
    sentTime: "2026-05-23 10:15",
    status: "Opened",
    channel: "Email",
  },
  {
    id: 22,
    recipient: "Smita Kulkarni",
    type: "Property Alert",
    messagePreview: "2BHK under ₹50L available in Nikol",
    sentTime: "2026-05-22 15:00",
    status: "Opened",
    channel: "WhatsApp",
  },
  {
    id: 23,
    recipient: "Karan Malhotra",
    type: "System",
    messagePreview: "Document upload confirmed — 3 files",
    sentTime: "2026-05-22 12:40",
    status: "Delivered",
    channel: "In-App",
  },
  {
    id: 24,
    recipient: "Divya Chauhan",
    type: "Legal Update",
    messagePreview: "Registration date confirmed: 01 Jun 2026",
    sentTime: "2026-05-21 11:20",
    status: "Failed",
    channel: "Push",
  },
  {
    id: 25,
    recipient: "Property Leads (67)",
    type: "Campaign",
    messagePreview: "Exclusive NRI Investment Webinar — Register Now",
    sentTime: "2026-05-20 09:00",
    status: "Delivered",
    channel: "Email",
  },
];

const SCHEDULED = [
  {
    id: 1,
    name: "Monthly Newsletter — June 2026",
    channel: "Email",
    recipients: "2,340 clients",
    scheduledFor: "2026-06-01 09:00",
    status: "Pending",
  },
  {
    id: 2,
    name: "Navratri Property Offers",
    channel: "WhatsApp",
    recipients: "1,847 buyers",
    scheduledFor: "2026-10-01 08:00",
    status: "Pending",
  },
  {
    id: 3,
    name: "RERA Filing Reminder",
    channel: "Email",
    recipients: "234 advisors",
    scheduledFor: "2026-06-10 10:00",
    status: "Pending",
  },
  {
    id: 4,
    name: "EMI Due Alert — June",
    channel: "WhatsApp",
    recipients: "567 borrowers",
    scheduledFor: "2026-06-01 08:00",
    status: "Pending",
  },
  {
    id: 5,
    name: "New Listing Push Alert",
    channel: "Push",
    recipients: "1,200 app users",
    scheduledFor: "2026-06-05 18:00",
    status: "Pending",
  },
];

const statusColor: Record<string, string> = {
  Delivered: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
  Opened: "bg-blue-900/40 text-blue-300 border-blue-700/40",
  Failed: "bg-red-900/40 text-red-300 border-red-700/40",
  Pending: "bg-amber-900/40 text-amber-300 border-amber-700/40",
};

const channelColor: Record<string, string> = {
  Email: "bg-blue-900/40 text-blue-300 border-blue-700/40",
  WhatsApp: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
  "In-App": "bg-purple-900/40 text-purple-300 border-purple-700/40",
  Push: "bg-amber-900/40 text-amber-300 border-amber-700/40",
};

export default function NotificationCenterPage() {
  const [sendOpen, setSendOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "recent" | "scheduled" | "channels"
  >("recent");
  const [form, setForm] = useState({
    recipient: "",
    type: "",
    channel: "Email",
    message: "",
    schedule: "now",
  });

  const stats = [
    { label: "Sent Today", value: "847", icon: "📨", color: "text-gold-300" },
    { label: "Open Rate", value: "34%", icon: "👁️", color: "text-blue-400" },
    {
      label: "Click Rate",
      value: "8.7%",
      icon: "🔗",
      color: "text-emerald-400",
    },
    { label: "Failed", value: "3", icon: "❌", color: "text-red-400" },
  ];

  const CHANNELS = [
    {
      name: "Email",
      active: true,
      sent: "4,234",
      openRate: "41.2%",
      icon: "📧",
    },
    {
      name: "WhatsApp",
      active: true,
      sent: "3,812",
      openRate: "67.4%",
      icon: "💬",
    },
    {
      name: "In-App",
      active: true,
      sent: "2,156",
      openRate: "89.1%",
      icon: "🔔",
    },
    {
      name: "Push",
      active: true,
      sent: "2,645",
      openRate: "18.3%",
      icon: "📱",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar — push layout: always visible desktop */}
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-card border-r border-gold-700/30 flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gold-700/20">
          <span className="font-serif text-gold-400 font-bold text-lg">
            Notifications
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {(["recent", "scheduled", "channels"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-sans capitalize transition-colors ${
                activeTab === t
                  ? "bg-gold-700/20 text-gold-300 border border-gold-700/40"
                  : "text-muted-foreground hover:bg-obsidian-800/60 hover:text-gold-300"
              }`}
              data-ocid={`notifs.sidebar.${t}_tab`}
            >
              {t === "recent"
                ? "📮 Recent (25)"
                : t === "scheduled"
                  ? "⏰ Scheduled"
                  : "📶 Channels"}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gold-700/20">
          <button
            type="button"
            onClick={() => setSendOpen(true)}
            className="w-full px-4 py-2 rounded-lg bg-gold-600/20 border border-gold-600/40 text-gold-300 text-sm font-sans hover:bg-gold-600/30 transition-colors"
            data-ocid="notifs.send_button"
          >
            + Send Notification
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-card border-b border-gold-700/20">
          <BackButton />
          <h1 className="font-serif font-bold text-gold-300 text-xl">
            Notification Center
          </h1>
          <button
            type="button"
            onClick={() => setSendOpen(true)}
            className="ml-auto px-4 py-2 rounded-lg bg-gold-600/20 border border-gold-600/40 text-gold-300 text-sm font-sans hover:bg-gold-600/30 transition-colors hidden sm:block"
            data-ocid="notifs.header_send_button"
          >
            + Send
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-card border border-gold-700/20 rounded-xl p-4"
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className={`font-serif text-xl font-bold ${s.color}`}>
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground font-sans mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto lg:hidden pb-1">
            {(["recent", "scheduled", "channels"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-sans capitalize whitespace-nowrap border transition-colors ${
                  activeTab === t
                    ? "bg-gold-700/20 text-gold-300 border-gold-700/40"
                    : "text-muted-foreground border-gold-800/20"
                }`}
                data-ocid={`notifs.tab.${t}`}
              >
                {t}
              </button>
            ))}
          </div>

          {activeTab === "recent" && (
            <section>
              <h2 className="font-serif text-lg text-gold-300 mb-3">
                Recent Notifications (25)
              </h2>
              <div className="overflow-x-auto rounded-xl border border-gold-700/20">
                <table className="w-full min-w-[700px] text-sm font-sans">
                  <thead>
                    <tr className="bg-obsidian-800/60">
                      {[
                        "#",
                        "Recipient",
                        "Type",
                        "Message",
                        "Sent",
                        "Channel",
                        "Status",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-gold-400 font-semibold text-xs uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {NOTIFS.map((n, i) => (
                      <tr
                        key={n.id}
                        className="border-t border-gold-800/15 hover:bg-obsidian-800/30"
                        data-ocid={`notifs.item.${i + 1}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3 text-foreground font-medium max-w-[140px] truncate">
                          {n.recipient}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {n.type}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate text-xs">
                          {n.messagePreview}
                        </td>
                        <td className="px-4 py-3 text-gold-500 text-xs">
                          {n.sentTime}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs border ${channelColor[n.channel]}`}
                          >
                            {n.channel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs border ${statusColor[n.status]}`}
                          >
                            {n.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "scheduled" && (
            <section>
              <h2 className="font-serif text-lg text-gold-300 mb-3">
                Scheduled Notifications
              </h2>
              <div className="space-y-3">
                {SCHEDULED.map((s, i) => (
                  <div
                    key={s.id}
                    className="bg-card border border-gold-700/20 rounded-xl p-4"
                    data-ocid={`notifs.scheduled.item.${i + 1}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-serif text-gold-300 font-semibold">
                          {s.name}
                        </div>
                        <div className="text-xs text-muted-foreground font-sans mt-1">
                          {s.recipients} · via {s.channel}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-gold-500">
                          {s.scheduledFor}
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-amber-900/40 text-amber-300 border border-amber-700/40">
                          Pending
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "channels" && (
            <section>
              <h2 className="font-serif text-lg text-gold-300 mb-3">
                Notification Channels
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {CHANNELS.map((c, i) => (
                  <div
                    key={c.name}
                    className="bg-card border border-gold-700/20 rounded-xl p-5"
                    data-ocid={`notifs.channel.item.${i + 1}`}
                  >
                    <div className="text-3xl mb-3">{c.icon}</div>
                    <div className="font-serif text-gold-300 font-bold text-lg mb-1">
                      {c.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-sans mb-2">
                      {c.sent} sent this month
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gold-500">Open rate</span>
                      <span className="text-sm font-bold text-emerald-400">
                        {c.openRate}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${c.active ? "bg-emerald-400" : "bg-red-400"}`}
                      />
                      <span
                        className={`text-xs ${c.active ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {c.active ? "Active" : "Disabled"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      <Modal
        isOpen={sendOpen}
        onClose={() => setSendOpen(false)}
        title="Send Notification"
        size="lg"
      >
        <form
          className="space-y-4 font-sans"
          onSubmit={(e) => {
            e.preventDefault();
            setSendOpen(false);
          }}
        >
          <div>
            <label className="text-xs text-gold-400 mb-1 block">
              Recipient / Group
            </label>
            <select
              className="w-full bg-obsidian-800 border border-gold-700/30 rounded-lg px-3 py-2 text-sm text-foreground"
              value={form.recipient}
              onChange={(e) =>
                setForm((f) => ({ ...f, recipient: e.target.value }))
              }
              data-ocid="notifs.form.recipient_select"
            >
              <option value="">Select recipient</option>
              <option>All Users</option>
              <option>All Clients</option>
              <option>All Staff</option>
              <option>Finance Team</option>
              <option>Sales Team</option>
              <option>Specific Person</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gold-400 mb-1 block">
              Notification Type
            </label>
            <select
              className="w-full bg-obsidian-800 border border-gold-700/30 rounded-lg px-3 py-2 text-sm text-foreground"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              data-ocid="notifs.form.type_select"
            >
              <option value="">Select type</option>
              <option>Announcement</option>
              <option>Property Alert</option>
              <option>Payment Due</option>
              <option>Appointment Reminder</option>
              <option>Legal Update</option>
              <option>System</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gold-400 mb-1 block">Channel</label>
            <select
              className="w-full bg-obsidian-800 border border-gold-700/30 rounded-lg px-3 py-2 text-sm text-foreground"
              value={form.channel}
              onChange={(e) =>
                setForm((f) => ({ ...f, channel: e.target.value }))
              }
              data-ocid="notifs.form.channel_select"
            >
              <option>Email</option>
              <option>WhatsApp</option>
              <option>In-App</option>
              <option>Push</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gold-400 mb-1 block">Message</label>
            <textarea
              className="w-full bg-obsidian-800 border border-gold-700/30 rounded-lg px-3 py-2 text-sm text-foreground"
              rows={4}
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              data-ocid="notifs.form.message_textarea"
            />
          </div>
          <div>
            <label className="text-xs text-gold-400 mb-1 block">Schedule</label>
            <select
              className="w-full bg-obsidian-800 border border-gold-700/30 rounded-lg px-3 py-2 text-sm text-foreground"
              value={form.schedule}
              onChange={(e) =>
                setForm((f) => ({ ...f, schedule: e.target.value }))
              }
              data-ocid="notifs.form.schedule_select"
            >
              <option value="now">Send Now</option>
              <option value="later">Schedule for Later</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-gold-600/30 border border-gold-600/50 text-gold-300 text-sm font-semibold hover:bg-gold-600/40 transition-colors"
            data-ocid="notifs.form.submit_button"
          >
            Send Notification
          </button>
        </form>
      </Modal>
    </div>
  );
}
