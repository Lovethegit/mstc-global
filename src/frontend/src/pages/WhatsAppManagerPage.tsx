import BackButton from "@/components/ui/BackButton";
import { Sparkles, X } from "lucide-react";
import { useState } from "react";

type Conversation = {
  id: number;
  contact: string;
  number: string;
  lastMessage: string;
  time: string;
  status: "Replied" | "Pending" | "Read";
  label: string;
};

type Template = {
  id: number;
  name: string;
  category: string;
  message: string;
  usage: number;
};

const TEMPLATES: Template[] = [
  {
    id: 1,
    name: "Property Inquiry Reply",
    category: "Property",
    message:
      "Hello {name}, thank you for your interest in {property}. Our advisor will contact you within 2 hours. MSTC GLOBAL — +91 9512609016",
    usage: 847,
  },
  {
    id: 2,
    name: "Site Visit Confirmation",
    category: "Property",
    message:
      "Dear {name}, your site visit for {property} is confirmed on {date} at {time}. Our advisor will pick you up from {location}. MSTC GLOBAL",
    usage: 634,
  },
  {
    id: 3,
    name: "Follow Up — Day 3",
    category: "CRM",
    message:
      "Hello {name}, following up on your property inquiry. We have 3 new listings matching your requirement. Shall we schedule a call? MSTC GLOBAL",
    usage: 1241,
  },
  {
    id: 4,
    name: "Loan Approval Congratulations",
    category: "Finance",
    message:
      "Congratulations {name}! Your home loan application has been approved. Next steps: documentation. Our finance advisor will call you shortly.",
    usage: 289,
  },
  {
    id: 5,
    name: "RERA Document Request",
    category: "Legal",
    message:
      "Dear {name}, please share the following documents for RERA processing: 1) Title deed 2) Building plan 3) NOC. MSTC GLOBAL Legal Team",
    usage: 178,
  },
  {
    id: 6,
    name: "Event Invitation",
    category: "Events",
    message:
      "You are invited to MSTC GLOBAL Property Expo 2026 on {date} at {venue}. Register at mstcglobal-kh8.caffeine.xyz/event-booking",
    usage: 523,
  },
  {
    id: 7,
    name: "Rental Agreement Ready",
    category: "Legal",
    message:
      "Dear {name}, your rental agreement for {property} is ready for signing. Please visit our office at Shwet Shikhar Society, Ahmedabad.",
    usage: 412,
  },
  {
    id: 8,
    name: "Payment Reminder",
    category: "Finance",
    message:
      "Dear {name}, this is a gentle reminder that your payment of {amount} for {property} is due on {date}. Please contact us if you need assistance.",
    usage: 334,
  },
  {
    id: 9,
    name: "New Listing Alert",
    category: "Property",
    message:
      "Hot New Listing! {property} in {location} — {price}. {bhk}, {area} sq ft. Perfect for your requirement. View details at mstcglobal-kh8.caffeine.xyz",
    usage: 756,
  },
  {
    id: 10,
    name: "Post-Visit Thank You",
    category: "CRM",
    message:
      "Thank you {name} for visiting {property} today. We hope you liked it! Would you like to proceed with booking? Call us: +91 9512609016",
    usage: 489,
  },
  {
    id: 11,
    name: "Birthday Greeting",
    category: "CRM",
    message:
      "Wishing you a very Happy Birthday {name}! 🎂 MSTC GLOBAL family wishes you all the best. We'd love to help you find your dream home this year.",
    usage: 267,
  },
  {
    id: 12,
    name: "GST Invoice Sent",
    category: "Finance",
    message:
      "Dear {name}, your GST invoice #{invoice_no} of {amount} has been sent to {email}. For any queries, contact mstc.gbl@gmail.com",
    usage: 198,
  },
];

const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    contact: "Rajesh Patel",
    number: "+91 98250 34512",
    lastMessage: "When can I visit the Bopal flat?",
    time: "2m ago",
    status: "Pending",
    label: "Buyer",
  },
  {
    id: 2,
    contact: "Sunita Mehta",
    number: "+91 99090 12345",
    lastMessage: "Thank you for the details.",
    time: "8m ago",
    status: "Replied",
    label: "Investor",
  },
  {
    id: 3,
    contact: "Amit Shah",
    number: "+91 94278 67890",
    lastMessage: "Is the 3BHK still available?",
    time: "15m ago",
    status: "Pending",
    label: "Buyer",
  },
  {
    id: 4,
    contact: "Priya Joshi",
    number: "+91 87654 32109",
    lastMessage: "Loan approved!",
    time: "1h ago",
    status: "Replied",
    label: "Client",
  },
  {
    id: 5,
    contact: "Vijay Rathod",
    number: "+91 96382 11234",
    lastMessage: "Can you share the floor plan?",
    time: "2h ago",
    status: "Pending",
    label: "Buyer",
  },
  {
    id: 6,
    contact: "Kavita Desai",
    number: "+91 78901 23456",
    lastMessage: "Ok, will come tomorrow.",
    time: "3h ago",
    status: "Read",
    label: "Client",
  },
  {
    id: 7,
    contact: "Nikhil Gupta",
    number: "+91 91234 56789",
    lastMessage: "What's the stamp duty for 80L?",
    time: "4h ago",
    status: "Pending",
    label: "Buyer",
  },
  {
    id: 8,
    contact: "Rupa Agarwal",
    number: "+91 82345 67890",
    lastMessage: "Please send RERA certificate.",
    time: "5h ago",
    status: "Replied",
    label: "Legal",
  },
  {
    id: 9,
    contact: "Deepak Verma",
    number: "+91 73456 78901",
    lastMessage: "Interested in rental at Satellite.",
    time: "6h ago",
    status: "Pending",
    label: "Tenant",
  },
  {
    id: 10,
    contact: "Leena Kapoor",
    number: "+91 64567 89012",
    lastMessage: "Got the agreement, will review.",
    time: "8h ago",
    status: "Read",
    label: "Client",
  },
  {
    id: 11,
    contact: "Sanjay Modi",
    number: "+91 55678 90123",
    lastMessage: "Can you arrange site visit Saturday?",
    time: "10h ago",
    status: "Pending",
    label: "Buyer",
  },
  {
    id: 12,
    contact: "Anita Solanki",
    number: "+91 97810 34567",
    lastMessage: "Yes please send the proposal.",
    time: "12h ago",
    status: "Replied",
    label: "Investor",
  },
  {
    id: 13,
    contact: "Rohit Sharma",
    number: "+91 88901 23456",
    lastMessage: "Thanks for quick response!",
    time: "1d ago",
    status: "Read",
    label: "Client",
  },
  {
    id: 14,
    contact: "Farah Sheikh",
    number: "+91 79012 34567",
    lastMessage: "What are the EMI options?",
    time: "1d ago",
    status: "Pending",
    label: "Buyer",
  },
  {
    id: 15,
    contact: "Manish Trivedi",
    number: "+91 70123 45678",
    lastMessage: "Please book appointment.",
    time: "1d ago",
    status: "Replied",
    label: "Client",
  },
  {
    id: 16,
    contact: "Pooja Nair",
    number: "+91 61234 56789",
    lastMessage: "Documents sent to your email.",
    time: "2d ago",
    status: "Read",
    label: "Legal",
  },
  {
    id: 17,
    contact: "Harish Bhatt",
    number: "+91 52345 67890",
    lastMessage: "Not interested right now.",
    time: "2d ago",
    status: "Read",
    label: "Cold",
  },
  {
    id: 18,
    contact: "Smita Kulkarni",
    number: "+91 93456 78901",
    lastMessage: "Looking for 2BHK under 50L.",
    time: "2d ago",
    status: "Pending",
    label: "Buyer",
  },
  {
    id: 19,
    contact: "Karan Malhotra",
    number: "+91 84567 89012",
    lastMessage: "Great service MSTC team!",
    time: "3d ago",
    status: "Replied",
    label: "Client",
  },
  {
    id: 20,
    contact: "Divya Chauhan",
    number: "+91 75678 90123",
    lastMessage: "Can you confirm the registration date?",
    time: "3d ago",
    status: "Pending",
    label: "Legal",
  },
];

const BROADCASTS = [
  {
    id: 1,
    name: "Summer Property Offers",
    sent: 1847,
    delivered: 1803,
    read: 1241,
    date: "2026-05-25",
    status: "Completed",
  },
  {
    id: 2,
    name: "NRI Investment Webinar",
    sent: 567,
    delivered: 553,
    read: 312,
    date: "2026-05-20",
    status: "Completed",
  },
  {
    id: 3,
    name: "New Listing Alert — Prahlad Nagar",
    sent: 2340,
    delivered: 2287,
    read: 1893,
    date: "2026-05-18",
    status: "Completed",
  },
  {
    id: 4,
    name: "RERA Compliance Reminder",
    sent: 340,
    delivered: 334,
    read: 289,
    date: "2026-05-15",
    status: "Completed",
  },
  {
    id: 5,
    name: "Navratri Event Invitation",
    sent: 3500,
    delivered: 3421,
    read: 0,
    date: "2026-09-25",
    status: "Scheduled",
  },
  {
    id: 6,
    name: "Q2 Finance Rates Update",
    sent: 780,
    delivered: 762,
    read: 589,
    date: "2026-05-10",
    status: "Completed",
  },
];

const SEGMENTS = [
  { id: "all_clients", label: "All Clients", count: 1247 },
  { id: "hot_leads", label: "Hot Leads", count: 89 },
  { id: "cold_leads", label: "Cold Leads", count: 234 },
  { id: "premium_clients", label: "Premium Clients", count: 156 },
  { id: "investors", label: "Investors", count: 78 },
  { id: "nri", label: "NRI Clients", count: 45 },
];

const statusColor: Record<string, string> = {
  Replied: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
  Pending: "bg-amber-900/40 text-amber-300 border-amber-700/40",
  Read: "bg-blue-900/40 text-blue-300 border-blue-700/40",
  Completed: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
  Scheduled: "bg-amber-900/40 text-amber-300 border-amber-700/40",
};

export default function WhatsAppManagerPage() {
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [bulkComposerOpen, setBulkComposerOpen] = useState(false);
  const [_aiWriterOpen, setAiWriterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "conversations" | "templates" | "broadcasts"
  >("conversations");
  const [selectedSegment, setSelectedSegment] = useState("hot_leads");
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkSendStatus, setBulkSendStatus] = useState<
    "idle" | "sending" | "sent"
  >("idle");
  const [aiPrompt, _setAiPrompt] = useState("");
  const [_aiLoading, setAiLoading] = useState(false);
  const [bcastForm, setBcastForm] = useState({
    name: "",
    template: "",
    recipients: "",
    schedule: "now",
  });
  const [search, setSearch] = useState("");

  const seg = SEGMENTS.find((s) => s.id === selectedSegment) ?? SEGMENTS[0];

  function sendBulkMessage() {
    if (!bulkMessage.trim()) return;
    setBulkSendStatus("sending");
    setTimeout(() => {
      setBulkSendStatus("sent");
      setTimeout(() => {
        setBulkComposerOpen(false);
        setBulkMessage("");
        setBulkSendStatus("idle");
      }, 2000);
    }, 1500);
  }

  function _generateAiMessage() {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      const aiTemplates: Record<string, string> = {
        listing:
          "Dear {name}, exciting news! A stunning new property is now available in Prahlad Nagar, Ahmedabad. 3BHK | 1,850 sq ft | Prime location. Perfect for your investment portfolio. Call us: +91 9512609016. MSTC GLOBAL — LETUS MANAGE",
        expo: "Hello {name}, you are personally invited to the MSTC GLOBAL Property Expo 2026! Meet 50+ top developers, discover exclusive deals. Register at mstcglobal-kh8.caffeine.xyz/event-booking. See you there!",
        loan: "Congratulations {name}! Your home loan application has been approved! Our finance advisor will call you shortly with next steps. Thank you for choosing MSTC GLOBAL — LETUS MANAGE.",
        follow:
          "Hello {name}, hope you enjoyed your property visit! We have 3 new listings matching your requirements. Shall we schedule a follow-up call? MSTC GLOBAL — +91 9512609016",
        nri: "Dear {name}, exciting investment opportunities await in Ahmedabad! Premium plots with 12-15% annual appreciation. Tax benefits for NRI investors. Contact: mstc.gbl@gmail.com | +91 9512609016. MSTC GLOBAL",
      };
      const key =
        Object.keys(aiTemplates).find((k) =>
          aiPrompt.toLowerCase().includes(k),
        ) ?? "listing";
      setBulkMessage(aiTemplates[key]);
      setAiLoading(false);
      setAiWriterOpen(false);
      setBulkComposerOpen(true);
    }, 1800);
  }

  const stats = [
    { label: "Messages Sent", value: "12,847", icon: "💬" },
    { label: "Replies", value: "4,234", icon: "↩️" },
    { label: "Response Rate", value: "32.9%", icon: "📊" },
    { label: "Leads", value: "156", icon: "👥" },
  ];

  const filteredConvos = CONVERSATIONS.filter(
    (c) =>
      !search ||
      c.contact.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar — push layout: always visible desktop, hidden mobile */}
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-card border-r border-gold-700/30 flex-col">
        <div className="flex items-center px-5 py-4 border-b border-gold-700/20">
          <span className="font-serif text-gold-400 font-bold text-lg">
            WhatsApp
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {(["conversations", "templates", "broadcasts"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-sans capitalize transition-colors ${
                activeTab === t
                  ? "bg-gold-700/20 text-gold-300 border border-gold-700/40"
                  : "text-muted-foreground hover:bg-obsidian-800/60 hover:text-gold-300"
              }`}
              data-ocid={`whatsapp.sidebar.${t}_tab`}
            >
              {t === "conversations"
                ? "💬 Conversations"
                : t === "templates"
                  ? "📝 Templates"
                  : "📢 Broadcasts"}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gold-700/20 space-y-2">
          <button
            type="button"
            onClick={() => setBulkComposerOpen(true)}
            className="w-full px-4 py-2 rounded-lg bg-emerald-700/20 border border-emerald-700/40 text-emerald-300 text-sm font-sans hover:bg-emerald-700/30 transition-colors"
            data-ocid="whatsapp.bulk_compose_button"
          >
            ✉️ Bulk Message
          </button>
          <button
            type="button"
            onClick={() => setAiWriterOpen(true)}
            className="w-full px-4 py-2 rounded-lg bg-purple-700/20 border border-purple-700/40 text-purple-300 text-sm font-sans hover:bg-purple-700/30 transition-colors"
            data-ocid="whatsapp.ai_writer_button"
          >
            <span className="flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Writer
            </span>
          </button>
          <button
            type="button"
            onClick={() => setBroadcastOpen(true)}
            className="w-full px-4 py-2 rounded-lg bg-gold-600/20 border border-gold-600/40 text-gold-300 text-sm font-sans hover:bg-gold-600/30 transition-colors"
            data-ocid="whatsapp.send_broadcast_button"
          >
            📢 Send Broadcast
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-card border-b border-gold-700/20">
          <BackButton />
          <h1 className="font-serif font-bold text-gold-300 text-xl">
            WhatsApp Manager
          </h1>
          <span className="ml-auto text-xs text-muted-foreground font-sans">
            MSTC GLOBAL
          </span>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-card border border-gold-700/20 rounded-xl p-4"
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-serif text-xl text-gold-300 font-bold">
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground font-sans mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto lg:hidden pb-1">
            {(["conversations", "templates", "broadcasts"] as const).map(
              (t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-sans capitalize whitespace-nowrap border transition-colors ${
                    activeTab === t
                      ? "bg-gold-700/20 text-gold-300 border-gold-700/40"
                      : "text-muted-foreground border-gold-800/20"
                  }`}
                  data-ocid={`whatsapp.tab.${t}`}
                >
                  {t}
                </button>
              ),
            )}
          </div>

          {activeTab === "conversations" && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-serif text-lg text-gold-300">
                  Active Conversations
                </h2>
                <input
                  type="search"
                  placeholder="Search..."
                  className="bg-obsidian-800 border border-gold-700/30 rounded-lg px-3 py-1.5 text-sm text-foreground w-40 sm:w-56"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-ocid="whatsapp.conversations.search_input"
                />
              </div>
              <div className="overflow-x-auto rounded-xl border border-gold-700/20">
                <table className="w-full min-w-[520px] text-sm font-sans">
                  <thead>
                    <tr className="bg-obsidian-800/60">
                      {[
                        "#",
                        "Contact",
                        "Number",
                        "Last Message",
                        "Time",
                        "Status",
                        "Label",
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
                    {filteredConvos.map((c, i) => (
                      <tr
                        key={c.id}
                        className="border-t border-gold-800/15 hover:bg-obsidian-800/30"
                        data-ocid={`whatsapp.conversation.item.${i + 1}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3 text-foreground font-medium">
                          {c.contact}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {c.number}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[180px] truncate">
                          {c.lastMessage}
                        </td>
                        <td className="px-4 py-3 text-gold-500 text-xs">
                          {c.time}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs border ${statusColor[c.status]}`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {c.label}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "templates" && (
            <section>
              <h2 className="font-serif text-lg text-gold-300 mb-3">
                Message Templates ({TEMPLATES.length})
              </h2>
              <div className="space-y-3">
                {TEMPLATES.map((t, i) => (
                  <div
                    key={t.id}
                    className="bg-card border border-gold-700/20 rounded-xl p-4"
                    data-ocid={`whatsapp.template.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="font-serif text-gold-300 font-semibold text-sm">
                          {t.name}
                        </div>
                        <span className="text-xs text-muted-foreground font-sans">
                          {t.category} · Used {t.usage} times
                        </span>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-1 rounded-lg bg-gold-700/20 border border-gold-700/30 text-gold-300 text-xs hover:bg-gold-700/30 transition-colors"
                        data-ocid={`whatsapp.template.use_button.${i + 1}`}
                      >
                        Use
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground font-sans leading-relaxed line-clamp-2">
                      {t.message}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "broadcasts" && (
            <section>
              <h2 className="font-serif text-lg text-gold-300 mb-3">
                Broadcast History
              </h2>
              <div className="overflow-x-auto rounded-xl border border-gold-700/20">
                <table className="w-full min-w-[600px] text-sm font-sans">
                  <thead>
                    <tr className="bg-obsidian-800/60">
                      {[
                        "Campaign",
                        "Sent",
                        "Delivered",
                        "Read",
                        "Date",
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
                    {BROADCASTS.map((b, i) => (
                      <tr
                        key={b.id}
                        className="border-t border-gold-800/15 hover:bg-obsidian-800/30"
                        data-ocid={`whatsapp.broadcast.item.${i + 1}`}
                      >
                        <td className="px-4 py-3 text-foreground font-medium">
                          {b.name}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {b.sent.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-emerald-400">
                          {b.delivered.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-blue-400">
                          {b.read.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-xs text-gold-500">
                          {b.date}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs border ${statusColor[b.status]}`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>

      {broadcastOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setBroadcastOpen(false)}
          onKeyDown={() => {}}
          role="button"
          tabIndex={0}
        >
          <div
            className="bg-card border border-gold-700/30 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-bold text-gold-300">
                Send Broadcast
              </h2>
              <button
                type="button"
                onClick={() => setBroadcastOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted/30 text-muted-foreground"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              className="space-y-4 font-sans"
              onSubmit={(e) => {
                e.preventDefault();
                setBroadcastOpen(false);
              }}
            >
              <div>
                <label className="text-xs text-gold-400 mb-1 block">
                  Broadcast Name
                </label>
                <input
                  className="w-full bg-obsidian-800 border border-gold-700/30 rounded-lg px-3 py-2 text-sm text-foreground"
                  value={bcastForm.name}
                  onChange={(e) =>
                    setBcastForm((f) => ({ ...f, name: e.target.value }))
                  }
                  data-ocid="whatsapp.broadcast.name_input"
                />
              </div>
              <div>
                <label className="text-xs text-gold-400 mb-1 block">
                  Template
                </label>
                <select
                  className="w-full bg-obsidian-800 border border-gold-700/30 rounded-lg px-3 py-2 text-sm text-foreground"
                  value={bcastForm.template}
                  onChange={(e) =>
                    setBcastForm((f) => ({ ...f, template: e.target.value }))
                  }
                  data-ocid="whatsapp.broadcast.template_select"
                >
                  <option value="">Select template</option>
                  {TEMPLATES.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gold-400 mb-1 block">
                  Recipients Group
                </label>
                <select
                  className="w-full bg-obsidian-800 border border-gold-700/30 rounded-lg px-3 py-2 text-sm text-foreground"
                  value={bcastForm.recipients}
                  onChange={(e) =>
                    setBcastForm((f) => ({ ...f, recipients: e.target.value }))
                  }
                  data-ocid="whatsapp.broadcast.recipients_select"
                >
                  <option value="">Select group</option>
                  <option>All Clients</option>
                  <option>Active Buyers</option>
                  <option>NRI Investors</option>
                  <option>Property Leads</option>
                  <option>Finance Clients</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gold-400 mb-1 block">
                  Schedule
                </label>
                <select
                  className="w-full bg-obsidian-800 border border-gold-700/30 rounded-lg px-3 py-2 text-sm text-foreground"
                  value={bcastForm.schedule}
                  onChange={(e) =>
                    setBcastForm((f) => ({ ...f, schedule: e.target.value }))
                  }
                  data-ocid="whatsapp.broadcast.schedule_select"
                >
                  <option value="now">Send Now</option>
                  <option value="later">Schedule for Later</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gold-600/30 border border-gold-600/50 text-gold-300 text-sm font-semibold hover:bg-gold-600/40 transition-colors"
                data-ocid="whatsapp.broadcast.submit_button"
              >
                Send Broadcast
              </button>
            </form>
          </div>
        </div>
      )}

      {bulkComposerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setBulkComposerOpen(false)}
          onKeyDown={() => {}}
          role="button"
          tabIndex={0}
        >
          <div
            className="bg-card border border-emerald-700/30 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-bold text-emerald-300">
                Bulk Message Composer
              </h2>
              <button
                type="button"
                onClick={() => setBulkComposerOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted/30 text-muted-foreground"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4 font-sans">
              <div>
                <label className="text-xs text-emerald-400 mb-1 block">
                  Target Segment
                </label>
                <select
                  className="w-full bg-obsidian-800 border border-emerald-700/30 rounded-lg px-3 py-2 text-sm text-foreground"
                  value={selectedSegment}
                  onChange={(e) => setSelectedSegment(e.target.value)}
                  data-ocid="whatsapp.bulk.segment_select"
                >
                  {SEGMENTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} ({s.count})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-emerald-400 mb-1 block">
                  Message
                </label>
                <textarea
                  className="w-full bg-obsidian-800 border border-emerald-700/30 rounded-lg px-3 py-2 text-sm text-foreground min-h-[120px] resize-y"
                  value={bulkMessage}
                  onChange={(e) => setBulkMessage(e.target.value)}
                  placeholder="Type your message..."
                  data-ocid="whatsapp.bulk.message_textarea"
                />
              </div>
              {bulkSendStatus === "sent" ? (
                <p className="text-emerald-400 text-sm text-center font-semibold">
                  ✓ Messages sent to {seg.count} contacts!
                </p>
              ) : (
                <button
                  type="button"
                  onClick={sendBulkMessage}
                  disabled={bulkSendStatus === "sending" || !bulkMessage.trim()}
                  className="w-full py-2.5 rounded-lg bg-emerald-600/30 border border-emerald-600/50 text-emerald-300 text-sm font-semibold hover:bg-emerald-600/40 transition-colors disabled:opacity-50"
                  data-ocid="whatsapp.bulk.send_button"
                >
                  {bulkSendStatus === "sending"
                    ? "Sending..."
                    : `Send to ${seg.count} contacts`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
