import SecureAppGate from "@/components/shared/SecureAppGate";
import BackButton from "@/components/ui/BackButton";
import { MessageSquare, Send } from "lucide-react";
import { useState } from "react";

const CONVERSATIONS = [
  {
    id: 1,
    name: "Rajesh Mehta",
    preview: "Thanks, will confirm the site visit tomorrow",
    time: "2m ago",
    unread: 2,
    phone: "+91 9876543210",
  },
  {
    id: 2,
    name: "Priya Shah",
    preview: "Can you share the loan eligibility calculator?",
    time: "15m ago",
    unread: 0,
    phone: "+91 9823456780",
  },
  {
    id: 3,
    name: "Anita Joshi",
    preview: "The commercial unit looks perfect!",
    time: "1h ago",
    unread: 1,
    phone: "+91 9512609016",
  },
  {
    id: 4,
    name: "Vikram Patel",
    preview: "Need RERA consultation ASAP",
    time: "3h ago",
    unread: 0,
    phone: "+91 9988776655",
  },
  {
    id: 5,
    name: "Suresh Kumar",
    preview: "Interested in Bodakdev 2BHK",
    time: "1d ago",
    unread: 0,
    phone: "+91 9090909090",
  },
];

const TEMPLATES = [
  {
    id: 1,
    name: "Welcome Message",
    preview: "Welcome to MSTC GLOBAL! We're delighted to assist you.",
  },
  {
    id: 2,
    name: "Property Enquiry Reply",
    preview: "Thank you for your enquiry. Our team will contact you shortly.",
  },
  {
    id: 3,
    name: "Site Visit Confirmation",
    preview: "Your site visit is confirmed for [DATE] at [TIME].",
  },
  {
    id: 4,
    name: "Follow Up",
    preview: "Hi [NAME], following up on your property search.",
  },
  {
    id: 5,
    name: "Festival Greetings",
    preview: "Warm wishes from MSTC GLOBAL on this special occasion!",
  },
];

export default function WhatsappAdminPage() {
  const [activeTab, setActiveTab] = useState<
    "inbox" | "templates" | "broadcast"
  >("inbox");
  const [draft, setDraft] = useState("");

  return (
    <SecureAppGate appName="WhatsApp Manager">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="whatsapp_admin.page"
      >
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center gap-2">
            <BackButton />
            <MessageSquare className="w-4 h-4 text-gold-400" />
            <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
              WhatsApp Manager
            </h1>
          </div>
          <div className="flex gap-2 mt-3">
            {(["inbox", "templates", "broadcast"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-full text-xs border capitalize transition-colors ${activeTab === tab ? "bg-gold-700/30 text-gold-300 border-gold-600/50" : "border-gold-800/30 text-gold-600"}`}
                data-ocid={`whatsapp_admin.tab.${tab}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-4">
          {activeTab === "inbox" && (
            <div className="space-y-2">
              {CONVERSATIONS.map((conv, i) => (
                <div
                  key={conv.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gold-800/30 bg-card hover:border-gold-600/40 transition-all cursor-pointer"
                  data-ocid={`whatsapp_admin.conversation.item.${i + 1}`}
                >
                  <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-green-400">
                      {conv.name[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {conv.name}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {conv.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {conv.preview}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-white">
                        {conv.unread}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "templates" && (
            <div className="space-y-2">
              {TEMPLATES.map((tpl, i) => (
                <div
                  key={tpl.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-gold-800/30 bg-card"
                  data-ocid={`whatsapp_admin.template.item.${i + 1}`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {tpl.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      "{tpl.preview}"
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-gold-500 hover:text-gold-400 whitespace-nowrap"
                    data-ocid={`whatsapp_admin.template.use_button.${i + 1}`}
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "broadcast" && (
            <div className="rounded-xl border border-gold-800/30 bg-card p-4 space-y-3">
              <h3 className="font-serif font-semibold text-foreground">
                Broadcast Message
              </h3>
              <div>
                <label className="text-xs text-gold-600">Audience</label>
                <select
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                  data-ocid="whatsapp_admin.broadcast_audience_select"
                >
                  {[
                    "All Contacts",
                    "Hot Leads",
                    "Active Clients",
                    "NRI Clients",
                    "Investors",
                  ].map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gold-600">Message</label>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type your broadcast message..."
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm resize-none"
                  rows={4}
                  data-ocid="whatsapp_admin.broadcast_message_textarea"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 rounded-lg border border-gold-800/40 text-muted-foreground text-sm"
                >
                  Preview
                </button>
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-green-900/30 hover:bg-green-900/40 text-green-400 text-sm font-medium transition-colors"
                  data-ocid="whatsapp_admin.broadcast_send_button"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Broadcast
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SecureAppGate>
  );
}
