import SecureAppGate from "@/components/shared/SecureAppGate";
import BackButton from "@/components/ui/BackButton";
import {
  Bell,
  CheckCircle,
  Edit3,
  Eye,
  EyeOff,
  Megaphone,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

type AnnType = "banner" | "popup" | "alert" | "ticker";
type AnnStatus = "Active" | "Scheduled" | "Draft" | "Expired";

interface Announcement {
  id: number;
  title: string;
  message: string;
  type: AnnType;
  status: AnnStatus;
  pages: string;
  startDate: string;
  endDate: string;
  views: number;
  dismissed: number;
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: "New Property Launch — Bodakdev Heights",
    message:
      "3 & 4 BHK premium apartments launching June 2026. Register interest now.",
    type: "banner",
    status: "Active",
    pages: "Homepage, Properties",
    startDate: "01 Jun 2026",
    endDate: "30 Jun 2026",
    views: 2840,
    dismissed: 412,
  },
  {
    id: 2,
    title: "RERA Compliance Deadline Reminder",
    message:
      "Important: RERA quarterly filing deadline is 15 June 2026. Consult MSTC GLOBAL.",
    type: "alert",
    status: "Active",
    pages: "All pages",
    startDate: "28 May 2026",
    endDate: "15 Jun 2026",
    views: 1140,
    dismissed: 280,
  },
  {
    id: 3,
    title: "Monsoon Property Fair 2026",
    message: "Special offers on Ahmedabad properties. July 5–7 at GMDC Ground.",
    type: "popup",
    status: "Scheduled",
    pages: "Homepage",
    startDate: "01 Jul 2026",
    endDate: "07 Jul 2026",
    views: 0,
    dismissed: 0,
  },
  {
    id: 4,
    title: "RBI Rate Cut Impact — Home Loan at 8.1%",
    message:
      "RBI cuts repo rate by 25bps. Home loans now starting at 8.1% p.a.",
    type: "ticker",
    status: "Active",
    pages: "Homepage, Finance",
    startDate: "20 May 2026",
    endDate: "20 Jun 2026",
    views: 5620,
    dismissed: 1100,
  },
  {
    id: 5,
    title: "Diwali Campaign 2025 Recap",
    message: "Our Diwali 2025 campaign reached 28,000+ prospects. View report.",
    type: "banner",
    status: "Expired",
    pages: "Homepage",
    startDate: "10 Oct 2025",
    endDate: "25 Oct 2025",
    views: 18400,
    dismissed: 4200,
  },
  {
    id: 6,
    title: "New Branch — Gandhinagar Office",
    message: "MSTC GLOBAL now has a dedicated office in Gandhinagar Sector 21.",
    type: "banner",
    status: "Draft",
    pages: "Homepage, About, Contact",
    startDate: "10 Jun 2026",
    endDate: "10 Jul 2026",
    views: 0,
    dismissed: 0,
  },
  {
    id: 7,
    title: "CSR Drive — Plant-a-Tree 2026",
    message:
      "MSTC GLOBAL's plant-a-tree initiative. 10,000 trees this monsoon.",
    type: "ticker",
    status: "Scheduled",
    pages: "Homepage, NGO",
    startDate: "15 Jun 2026",
    endDate: "15 Sep 2026",
    views: 0,
    dismissed: 0,
  },
];

const STATUS_COLOR: Record<AnnStatus, string> = {
  Active: "bg-green-900/20 text-green-400 border-green-800/30",
  Scheduled: "bg-blue-900/20 text-blue-400 border-blue-800/30",
  Draft: "bg-muted/30 text-muted-foreground border-border/30",
  Expired: "bg-red-900/20 text-red-400 border-red-800/30",
};

const TYPE_COLOR: Record<AnnType, string> = {
  banner: "text-gold-400",
  popup: "text-purple-400",
  alert: "text-red-400",
  ticker: "text-blue-400",
};

function CreateModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<AnnType>("banner");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="announcements.create.dialog"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="presentation"
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-gold-800/40 bg-card p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          data-ocid="announcements.create.close_button"
        >
          <X className="w-4 h-4" />
        </button>
        <h3 className="font-serif text-lg font-bold text-gold-400 mb-4">
          New Announcement
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title..."
              className="w-full bg-background border border-gold-800/30 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold-700/50"
              data-ocid="announcements.create.title.input"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Message
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Announcement body..."
              className="w-full bg-background border border-gold-800/30 rounded-lg px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:border-gold-700/50"
              data-ocid="announcements.create.message.textarea"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Type
            </label>
            <div className="flex gap-2 flex-wrap">
              {(["banner", "popup", "alert", "ticker"] as AnnType[]).map(
                (t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs capitalize font-medium border transition-colors ${type === t ? "bg-gold-700/30 text-gold-400 border-gold-700/40" : "border-gold-800/20 text-muted-foreground hover:text-foreground"}`}
                    data-ocid={`announcements.create.type.${t}`}
                  >
                    {t}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gold-700 hover:bg-gold-600 text-background font-semibold text-sm"
            data-ocid="announcements.create.submit_button"
          >
            Create Announcement
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gold-800/30 text-muted-foreground hover:text-foreground text-sm"
            data-ocid="announcements.create.cancel_button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function AnnouncementsInner() {
  const [items, setItems] = useState<Announcement[]>(ANNOUNCEMENTS);
  const [creating, setCreating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<AnnStatus | "All">("All");

  const filtered = items.filter(
    (a) => filterStatus === "All" || a.status === filterStatus,
  );
  const active = items.filter((a) => a.status === "Active").length;
  const scheduled = items.filter((a) => a.status === "Scheduled").length;
  const totalViews = items.reduce((s, a) => s + a.views, 0);

  return (
    <div className="min-h-screen bg-background" data-ocid="announcements.page">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BackButton />
            <Megaphone className="w-4 h-4 text-gold-400" />
            <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
              Announcement Manager
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
            data-ocid="announcements.create_button"
          >
            <Plus className="w-3.5 h-3.5" /> New Announcement
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Active", value: active, color: "text-green-400" },
            { label: "Scheduled", value: scheduled, color: "text-blue-400" },
            {
              label: "Total Announcements",
              value: items.length,
              color: "text-gold-400",
            },
            {
              label: "Total Views",
              value: totalViews.toLocaleString(),
              color: "text-purple-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-gold-800/30 bg-card p-3"
            >
              <p className={`font-serif text-xl font-bold ${s.color}`}>
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-4">
          {(
            ["All", "Active", "Scheduled", "Draft", "Expired"] as (
              | AnnStatus
              | "All"
            )[]
          ).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilterStatus(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filterStatus === f ? "bg-gold-700/30 text-gold-400 border border-gold-700/40" : "text-muted-foreground hover:text-foreground"}`}
              data-ocid={`announcements.filter.${f.toLowerCase()}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.map((ann, i) => (
            <div
              key={ann.id}
              className="rounded-xl border border-gold-800/20 bg-card p-4"
              data-ocid={`announcements.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`text-xs font-medium capitalize ${TYPE_COLOR[ann.type]}`}
                    >
                      {ann.type}
                    </span>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${STATUS_COLOR[ann.status]}`}
                    >
                      {ann.status}
                    </span>
                  </div>
                  <p className="font-sans text-sm font-semibold text-foreground">
                    {ann.title}
                  </p>
                  <p className="font-sans text-xs text-muted-foreground mt-1 line-clamp-2">
                    {ann.message}
                  </p>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <span className="text-[10px] text-muted-foreground">
                      Pages: {ann.pages}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {ann.startDate} → {ann.endDate}
                    </span>
                    {ann.views > 0 && (
                      <span className="text-[10px] text-gold-600">
                        {ann.views.toLocaleString()} views ·{" "}
                        {ann.dismissed.toLocaleString()} dismissed
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    className="p-1.5 rounded-lg border border-gold-800/20 text-muted-foreground hover:text-gold-400 transition-colors"
                    data-ocid={`announcements.edit_button.${i + 1}`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setItems((prev) =>
                        prev.map((a) =>
                          a.id === ann.id
                            ? {
                                ...a,
                                status:
                                  a.status === "Active"
                                    ? "Draft"
                                    : ("Active" as AnnStatus),
                              }
                            : a,
                        ),
                      )
                    }
                    className="p-1.5 rounded-lg border border-gold-800/20 text-muted-foreground hover:text-gold-400 transition-colors"
                    data-ocid={`announcements.toggle_button.${i + 1}`}
                  >
                    {ann.status === "Active" ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setItems((prev) => prev.filter((a) => a.id !== ann.id))
                    }
                    className="p-1.5 rounded-lg border border-red-800/20 text-red-400/60 hover:text-red-400 transition-colors"
                    data-ocid={`announcements.delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div
            className="text-center py-16"
            data-ocid="announcements.empty_state"
          >
            <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-serif text-lg text-muted-foreground">
              No announcements
            </p>
          </div>
        )}
      </div>

      {creating && <CreateModal onClose={() => setCreating(false)} />}
    </div>
  );
}

export default function AnnouncementsPage() {
  return (
    <SecureAppGate appName="Announcements">
      <AnnouncementsInner />
    </SecureAppGate>
  );
}
