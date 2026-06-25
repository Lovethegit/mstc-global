import SecureAppGate from "@/components/shared/SecureAppGate";
import BackButton from "@/components/ui/BackButton";
import type React from "react";
import { useState } from "react";

type AnnouncementTab = "internal" | "public";
type Priority = "Normal" | "Important" | "Urgent";
type Status = "Draft" | "Live" | "Expired";

interface Announcement {
  id: number;
  title: string;
  message: string;
  audience: string;
  priority: Priority;
  status: Status;
  publishDate: string;
  expiry: string;
}

const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Office Hours Updated",
    message:
      "Office will be open 9am-7pm Monday to Saturday effective immediately.",
    audience: "All Staff",
    priority: "Normal",
    status: "Live",
    publishDate: "2026-05-20",
    expiry: "2026-12-31",
  },
  {
    id: 2,
    title: "New Property Launch — Sindhu Bhavan Road",
    message:
      "MSTC GLOBAL is proud to announce a premium 3BHK project launch on Sindhu Bhavan Road. All agents to prepare pitch decks.",
    audience: "Property Team",
    priority: "Important",
    status: "Live",
    publishDate: "2026-05-22",
    expiry: "2026-06-30",
  },
  {
    id: 3,
    title: "Team Meeting — Friday 3pm",
    message:
      "Mandatory all-hands meeting this Friday at 3pm in Conference Room A. Please bring your weekly reports.",
    audience: "All Staff",
    priority: "Normal",
    status: "Live",
    publishDate: "2026-05-25",
    expiry: "2026-05-30",
  },
  {
    id: 4,
    title: "GST Filing Deadline Reminder",
    message:
      "GSTR-3B for May 2026 is due on 20th June 2026. Finance team to ensure all invoices are updated.",
    audience: "Finance Team",
    priority: "Urgent",
    status: "Live",
    publishDate: "2026-05-28",
    expiry: "2026-06-21",
  },
  {
    id: 5,
    title: "New Legal Form Templates Available",
    message:
      "Updated property agreement and rental lease templates are now available in the Legal Vault. Use these for all new transactions.",
    audience: "All Staff",
    priority: "Normal",
    status: "Live",
    publishDate: "2026-05-15",
    expiry: "2026-12-31",
  },
  {
    id: 6,
    title: "Independence Day Office Closure",
    message:
      "MSTC GLOBAL office will be closed on 15th August 2026 for Independence Day. Emergency contact: +91 9512609016.",
    audience: "All Staff",
    priority: "Normal",
    status: "Expired",
    publishDate: "2025-08-10",
    expiry: "2025-08-16",
  },
];

export default function AnnouncementManagerPage() {
  const [activeTab, setActiveTab] = useState<AnnouncementTab>("internal");
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(initialAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "All Staff",
    priority: "Normal" as Priority,
    publishDate: "",
    expiry: "",
  });

  const filtered = announcements.filter((a) =>
    activeTab === "internal"
      ? a.audience !== "Public"
      : a.audience === "Public",
  );

  const priorityColor = (p: Priority) =>
    p === "Urgent"
      ? "bg-red-500/20 text-red-400 border-red-500/30"
      : p === "Important"
        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
        : "bg-slate-700 text-slate-300 border-slate-600";

  const statusColor = (s: Status) =>
    s === "Live"
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : s === "Expired"
        ? "bg-slate-700 text-slate-400 border-slate-600"
        : "bg-blue-500/20 text-blue-400 border-blue-500/30";

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newItem: Announcement = {
      id: announcements.length + 1,
      ...form,
      message: form.message || "No message provided.",
      status: "Draft",
    };
    setAnnouncements((prev) => [newItem, ...prev]);
    setShowForm(false);
    setForm({
      title: "",
      message: "",
      audience: "All Staff",
      priority: "Normal",
      publishDate: "",
      expiry: "",
    });
  }

  return (
    <SecureAppGate appName="Announcement Manager">
      <div className="min-h-screen bg-[#06090f] text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <BackButton to="/apps" />
              <div>
                <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#c9a84c]">
                  Announcement Manager
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Manage internal and public announcements
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-[#c9a84c] text-black rounded-lg font-semibold hover:bg-amber-400 transition-colors text-sm"
            >
              + New Announcement
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-[#c9a84c]/20">
            <button
              type="button"
              onClick={() => setActiveTab("internal")}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "internal" ? "border-[#c9a84c] text-[#c9a84c]" : "border-transparent text-slate-400 hover:text-white"}`}
            >
              Internal (Staff)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("public")}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "public" ? "border-[#c9a84c] text-[#c9a84c]" : "border-transparent text-slate-400 hover:text-white"}`}
            >
              Public (Website)
            </button>
          </div>

          {/* Create Form Modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div className="bg-[#0e1117] border border-[#c9a84c]/30 rounded-xl w-full max-w-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-['Playfair_Display'] text-xl text-[#c9a84c]">
                    New Announcement
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center text-xl"
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      Title
                    </label>
                    <input
                      required
                      value={form.title}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                      className="w-full bg-[#06090f] border border-[#c9a84c]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
                      placeholder="Announcement title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                      className="w-full bg-[#06090f] border border-[#c9a84c]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c] resize-none"
                      placeholder="Announcement message..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">
                        Audience
                      </label>
                      <select
                        value={form.audience}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, audience: e.target.value }))
                        }
                        className="w-full bg-[#06090f] border border-[#c9a84c]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
                      >
                        <option>All Staff</option>
                        <option>Property Team</option>
                        <option>Finance Team</option>
                        <option>Legal Team</option>
                        <option>Management</option>
                        <option>Public</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">
                        Priority
                      </label>
                      <select
                        value={form.priority}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            priority: e.target.value as Priority,
                          }))
                        }
                        className="w-full bg-[#06090f] border border-[#c9a84c]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
                      >
                        <option>Normal</option>
                        <option>Important</option>
                        <option>Urgent</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">
                        Publish Date
                      </label>
                      <input
                        type="date"
                        value={form.publishDate}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            publishDate: e.target.value,
                          }))
                        }
                        className="w-full bg-[#06090f] border border-[#c9a84c]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        value={form.expiry}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, expiry: e.target.value }))
                        }
                        className="w-full bg-[#06090f] border border-[#c9a84c]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-[#c9a84c] text-black rounded-lg font-semibold hover:bg-amber-400 transition-colors text-sm"
                    >
                      Create Announcement
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Announcements List */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              No {activeTab} announcements yet.
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((a) => (
                <div
                  key={a.id}
                  className="bg-[#0e1117] border border-[#c9a84c]/20 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-semibold text-white text-base">
                          {a.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${priorityColor(a.priority)}`}
                        >
                          {a.priority}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${statusColor(a.status)}`}
                        >
                          {a.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {a.message}
                      </p>
                      <div className="flex gap-4 mt-3 text-xs text-slate-500 flex-wrap">
                        <span>
                          Audience:{" "}
                          <span className="text-slate-300">{a.audience}</span>
                        </span>
                        {a.publishDate && (
                          <span>
                            Published:{" "}
                            <span className="text-slate-300">
                              {a.publishDate}
                            </span>
                          </span>
                        )}
                        {a.expiry && (
                          <span>
                            Expires:{" "}
                            <span className="text-slate-300">{a.expiry}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="px-3 py-1 text-xs border border-[#c9a84c]/30 text-[#c9a84c] rounded hover:bg-[#c9a84c]/10 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 text-xs border border-red-500/30 text-red-400 rounded hover:bg-red-500/10 transition-colors"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SecureAppGate>
  );
}
