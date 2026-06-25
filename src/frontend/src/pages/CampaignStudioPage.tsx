import SecureAppGate from "@/components/shared/SecureAppGate";
import BackButton from "@/components/ui/BackButton";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart2,
  Bot,
  Edit,
  Eye,
  Filter,
  Mail,
  Megaphone,
  MessageSquare,
  Phone,
  Plus,
  Search,
  Send,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

type Channel = "WhatsApp" | "Email" | "SMS";
type CampaignStatus = "Active" | "Paused" | "Completed" | "Draft";

interface Campaign {
  id: number;
  name: string;
  channel: Channel;
  status: CampaignStatus;
  sent: number;
  openRate: number;
  responses: number;
  createdDate: string;
  segment: string;
}

const CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    name: "Diwali Property Offers 2025",
    channel: "WhatsApp",
    status: "Completed",
    sent: 12400,
    openRate: 31,
    responses: 847,
    createdDate: "01 Oct 2025",
    segment: "All Leads",
  },
  {
    id: 2,
    name: "New Year Investment Seminar",
    channel: "Email",
    status: "Completed",
    sent: 8200,
    openRate: 18,
    responses: 312,
    createdDate: "20 Dec 2025",
    segment: "Finance Leads",
  },
  {
    id: 3,
    name: "Bopal Project Launch Alert",
    channel: "WhatsApp",
    status: "Active",
    sent: 5600,
    openRate: 42,
    responses: 634,
    createdDate: "10 May 2025",
    segment: "Property Buyers",
  },
  {
    id: 4,
    name: "RERA Compliance Update May",
    channel: "Email",
    status: "Active",
    sent: 4300,
    openRate: 22,
    responses: 189,
    createdDate: "05 May 2025",
    segment: "RERA Clients",
  },
  {
    id: 5,
    name: "SG Highway Premium Launch",
    channel: "WhatsApp",
    status: "Active",
    sent: 3800,
    openRate: 38,
    responses: 421,
    createdDate: "01 May 2025",
    segment: "HNI Segment",
  },
  {
    id: 6,
    name: "Home Loan Rate Alert",
    channel: "SMS",
    status: "Active",
    sent: 9200,
    openRate: 14,
    responses: 267,
    createdDate: "25 Apr 2025",
    segment: "Finance Leads",
  },
  {
    id: 7,
    name: "Navratri Cultural Event",
    channel: "WhatsApp",
    status: "Active",
    sent: 6100,
    openRate: 45,
    responses: 512,
    createdDate: "20 Apr 2025",
    segment: "All Clients",
  },
  {
    id: 8,
    name: "NRI Investment Webinar",
    channel: "Email",
    status: "Active",
    sent: 2800,
    openRate: 27,
    responses: 198,
    createdDate: "15 Apr 2025",
    segment: "NRI Segment",
  },
  {
    id: 9,
    name: "Q2 Finance Newsletter",
    channel: "Email",
    status: "Active",
    sent: 7400,
    openRate: 21,
    responses: 340,
    createdDate: "10 Apr 2025",
    segment: "All Clients",
  },
  {
    id: 10,
    name: "Bopal Rental Opportunities",
    channel: "SMS",
    status: "Paused",
    sent: 3200,
    openRate: 11,
    responses: 98,
    createdDate: "05 Apr 2025",
    segment: "Investors",
  },
  {
    id: 11,
    name: "Legal Documentation Offer",
    channel: "WhatsApp",
    status: "Paused",
    sent: 2100,
    openRate: 29,
    responses: 134,
    createdDate: "01 Apr 2025",
    segment: "Buyers",
  },
  {
    id: 12,
    name: "Independence Day Special",
    channel: "Email",
    status: "Draft",
    sent: 0,
    openRate: 0,
    responses: 0,
    createdDate: "01 Aug 2025",
    segment: "All Clients",
  },
];

const SEGMENTS = [
  { name: "All Clients", count: 4820 },
  { name: "Property Buyers", count: 2340 },
  { name: "Finance Leads", count: 1890 },
  { name: "HNI Segment", count: 340 },
  { name: "NRI Segment", count: 680 },
  { name: "RERA Clients", count: 1240 },
  { name: "Investors", count: 920 },
];

const CHANNEL_COLORS: Record<Channel, string> = {
  WhatsApp: "bg-emerald-900/20 text-emerald-300 border-emerald-700/30",
  Email: "bg-blue-900/20 text-blue-300 border-blue-800/30",
  SMS: "bg-amber-900/20 text-amber-300 border-amber-700/30",
};

const STATUS_COLORS: Record<CampaignStatus, string> = {
  Active: "bg-emerald-900/20 text-emerald-300 border-emerald-700/30",
  Paused: "bg-amber-900/20 text-amber-300 border-amber-700/30",
  Completed: "bg-blue-900/20 text-blue-300 border-blue-800/30",
  Draft: "bg-muted text-muted-foreground border-border",
};

const ANALYTICS = [
  { label: "Sent", value: 48290, color: "bg-gold-500" },
  { label: "Opened", value: 11300, color: "bg-blue-500" },
  { label: "Clicked", value: 4820, color: "bg-emerald-500" },
  { label: "Responded", value: 847, color: "bg-purple-500" },
];

const CHANNEL_ICONS: Record<Channel, React.ElementType> = {
  WhatsApp: Phone,
  Email: Mail,
  SMS: MessageSquare,
};

interface NewCampaign {
  name: string;
  channel: Channel;
  message: string;
  segment: string;
  schedule: string;
}

export default function CampaignStudioPage() {
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState<Channel | "All">("All");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "All">(
    "All",
  );
  const [showModal, setShowModal] = useState(false);
  const [genBrief, setGenBrief] = useState("");
  const [genMsg, setGenMsg] = useState("");
  const [generating, setGenerating] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [newCampaign, setNewCampaign] = useState<NewCampaign>({
    name: "",
    channel: "WhatsApp",
    message: "",
    segment: "All Clients",
    schedule: "",
  });

  const filtered = campaigns.filter(
    (c) =>
      (channelFilter === "All" || c.channel === channelFilter) &&
      (statusFilter === "All" || c.status === statusFilter) &&
      (search === "" || c.name.toLowerCase().includes(search.toLowerCase())),
  );

  const active = campaigns.filter((c) => c.status === "Active").length;
  const _totalSent = campaigns.reduce((s, c) => s + c.sent, 0);
  const _avgOpen = Math.round(
    campaigns.filter((c) => c.sent > 0).reduce((s, c) => s + c.openRate, 0) /
      campaigns.filter((c) => c.sent > 0).length,
  );
  const _totalLeads = campaigns.reduce((s, c) => s + c.responses, 0);

  function handleGenMsg() {
    if (!genBrief.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setGenMsg(
        `🏠 *MSTC Global — ${genBrief}*\n\nDear Valued Client,\n\nWe have an exciting opportunity tailored just for you. Based on your profile, our AI has identified this as a perfect match for your requirements.\n\n✅ Premium properties starting from ₹45 Lakhs\n✅ RERA registered projects only\n✅ Special early-bird pricing\n✅ Flexible payment plans available\n\nReply YES for immediate callback or call us at +91 9512609016.\n\n*MSTC Global | Ahmedabad*\n_Unsubscribe: Reply STOP_`,
      );
      setGenerating(false);
    }, 1500);
  }

  function handleCreate() {
    if (!newCampaign.name.trim()) return;
    const nc: Campaign = {
      id: Date.now(),
      name: newCampaign.name,
      channel: newCampaign.channel,
      status: "Draft",
      sent: 0,
      openRate: 0,
      responses: 0,
      createdDate: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      segment: newCampaign.segment,
    };
    setCampaigns([nc, ...campaigns]);
    setNewCampaign({
      name: "",
      channel: "WhatsApp",
      message: "",
      segment: "All Clients",
      schedule: "",
    });
    setShowModal(false);
  }

  function handleDelete(id: number) {
    setCampaigns(campaigns.filter((c) => c.id !== id));
    setDeleteId(null);
  }

  return (
    <SecureAppGate appName="Campaign Studio">
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="bg-card border-b border-gold-800/30 px-4 py-4 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <BackButton />
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-gold-400" />
                <h1 className="font-serif font-bold text-lg md:text-xl text-gold-300">
                  Campaign Studio
                </h1>
                <span className="hidden sm:inline text-muted-foreground text-sm">
                  |
                </span>
                <span className="hidden sm:inline text-xs text-muted-foreground font-sans">
                  Multi-Channel
                </span>
              </div>
              <span className="ml-auto text-xs text-gold-400 bg-gold-700/20 border border-gold-700/30 px-2 py-1 rounded-full font-sans">
                {active} Active Campaigns
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Active Campaigns", value: "12", icon: Megaphone },
              { label: "Total Sent This Month", value: "48,290", icon: Send },
              { label: "Avg Open Rate", value: "23.4%", icon: Eye },
              { label: "Leads Generated", value: "847", icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="bg-card border border-gold-800/30 rounded-xl p-4 flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-gold-700/15 shrink-0">
                  <Icon className="w-4 h-4 text-gold-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl font-bold font-serif text-gold-400">
                    {value}
                  </div>
                  <div className="text-xs text-muted-foreground font-sans mt-0.5">
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Campaign List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-9 bg-card border-gold-800/30 text-sm h-10"
                    placeholder="Search campaigns..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    data-ocid="campaigns.search_input"
                  />
                </div>
                <select
                  value={channelFilter}
                  onChange={(e) =>
                    setChannelFilter(e.target.value as Channel | "All")
                  }
                  className="h-10 rounded-lg bg-card border border-gold-800/30 text-sm px-3 text-foreground font-sans"
                  data-ocid="campaigns.channel_select"
                >
                  <option value="All">All Channels</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as CampaignStatus | "All")
                  }
                  className="h-10 rounded-lg bg-card border border-gold-800/30 text-sm px-3 text-foreground font-sans"
                  data-ocid="campaigns.status_select"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                  <option value="Draft">Draft</option>
                </select>
                <Button
                  onClick={() => setShowModal(true)}
                  className="h-10 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-semibold font-sans gap-1 shrink-0"
                  data-ocid="campaigns.new_campaign_button"
                >
                  <Plus className="w-4 h-4" /> New
                </Button>
              </div>

              {/* List */}
              <div className="space-y-2">
                {filtered.length === 0 ? (
                  <div
                    className="text-center py-12 text-muted-foreground font-sans"
                    data-ocid="campaigns.empty_state"
                  >
                    No campaigns found.
                  </div>
                ) : (
                  filtered.map((c, i) => {
                    const CIcon = CHANNEL_ICONS[c.channel];
                    return (
                      <div
                        key={c.id}
                        className="bg-card border border-gold-800/25 rounded-xl p-4 hover:border-gold-600/40 transition-all"
                        data-ocid={`campaigns.item.${i + 1}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border font-sans flex items-center gap-1 ${CHANNEL_COLORS[c.channel]}`}
                              >
                                <CIcon className="w-3 h-3" />
                                {c.channel}
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border font-sans ${STATUS_COLORS[c.status]}`}
                              >
                                {c.status}
                              </span>
                            </div>
                            <p className="font-sans text-sm font-medium text-foreground leading-snug">
                              {c.name}
                            </p>
                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground font-sans">
                              <span className="flex items-center gap-1">
                                <Send className="w-3 h-3" />
                                {c.sent.toLocaleString("en-IN")} sent
                              </span>
                              {c.sent > 0 && (
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {c.openRate}% open
                                </span>
                              )}
                              {c.responses > 0 && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {c.responses} responses
                                </span>
                              )}
                              <span className="text-gold-500">{c.segment}</span>
                              <span>{c.createdDate}</span>
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              type="button"
                              className="p-2 rounded-lg hover:bg-gold-700/20 text-muted-foreground hover:text-gold-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                              data-ocid={`campaigns.edit_button.${i + 1}`}
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              className="p-2 rounded-lg hover:bg-gold-700/20 text-muted-foreground hover:text-gold-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                              data-ocid={`campaigns.view_button.${i + 1}`}
                              title="Analytics"
                            >
                              <BarChart2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteId(c.id)}
                              className="p-2 rounded-lg hover:bg-red-900/20 text-muted-foreground hover:text-red-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                              data-ocid={`campaigns.delete_button.${i + 1}`}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-4">
              {/* AI Message Generator */}
              <div className="bg-card border border-gold-700/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-4 h-4 text-gold-400" />
                  <h3 className="font-serif font-semibold text-sm text-gold-300">
                    AI Message Generator
                  </h3>
                </div>
                <Textarea
                  placeholder="Brief: e.g. 'Diwali property offer for HNI investors'"
                  value={genBrief}
                  onChange={(e) => setGenBrief(e.target.value)}
                  className="bg-background border-gold-800/30 text-sm resize-none min-h-[70px] font-sans"
                  data-ocid="campaigns.ai_brief_textarea"
                />
                {genMsg && (
                  <div className="mt-3 p-3 rounded-lg bg-background border border-gold-800/20 text-xs text-muted-foreground font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {genMsg}
                  </div>
                )}
                <Button
                  onClick={handleGenMsg}
                  disabled={generating || !genBrief.trim()}
                  className="mt-3 w-full bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-semibold font-sans text-sm h-10"
                  data-ocid="campaigns.generate_button"
                >
                  {generating ? "Generating…" : "Generate Message"}
                </Button>
              </div>

              {/* Segment Builder */}
              <div className="bg-card border border-gold-800/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-gold-400" />
                  <h3 className="font-serif font-semibold text-sm text-gold-300">
                    Segment Builder
                  </h3>
                </div>
                <div className="space-y-1.5">
                  {SEGMENTS.map((seg) => (
                    <div
                      key={seg.name}
                      className="flex items-center justify-between py-1.5 border-b border-gold-800/15 last:border-0"
                    >
                      <span className="text-xs text-foreground font-sans">
                        {seg.name}
                      </span>
                      <span className="text-xs text-gold-400 font-mono font-bold">
                        {seg.count.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analytics */}
              <div className="bg-card border border-gold-800/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart2 className="w-4 h-4 text-gold-400" />
                  <h3 className="font-serif font-semibold text-sm text-gold-300">
                    This Month Analytics
                  </h3>
                </div>
                <div className="space-y-3">
                  {ANALYTICS.map((a) => (
                    <div key={a.label}>
                      <div className="flex justify-between text-xs font-sans mb-1">
                        <span className="text-muted-foreground">{a.label}</span>
                        <span className="text-foreground font-medium">
                          {a.value.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${a.color}`}
                          style={{
                            width: `${Math.min((a.value / 48290) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="text-center p-2 rounded-lg bg-background border border-gold-800/20">
                    <div className="text-sm font-bold text-gold-400 font-serif">
                      23.4%
                    </div>
                    <div className="text-[10px] text-muted-foreground font-sans">
                      Avg Open Rate
                    </div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-background border border-gold-800/20">
                    <div className="text-sm font-bold text-gold-400 font-serif">
                      1.75%
                    </div>
                    <div className="text-[10px] text-muted-foreground font-sans">
                      Conversion Rate
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Campaign Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="New Campaign"
        >
          <div
            className="space-y-4 p-1"
            data-ocid="campaigns.new_campaign_dialog"
          >
            <div>
              <label className="text-xs font-sans text-muted-foreground block mb-1">
                Campaign Name
              </label>
              <Input
                value={newCampaign.name}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, name: e.target.value })
                }
                placeholder="Campaign name..."
                className="bg-background border-gold-800/30 text-sm"
                data-ocid="campaigns.new_name_input"
              />
            </div>
            <div>
              <label className="text-xs font-sans text-muted-foreground block mb-1">
                Channel
              </label>
              <select
                value={newCampaign.channel}
                onChange={(e) =>
                  setNewCampaign({
                    ...newCampaign,
                    channel: e.target.value as Channel,
                  })
                }
                className="w-full h-10 rounded-lg bg-background border border-gold-800/30 text-sm px-3 text-foreground font-sans"
                data-ocid="campaigns.new_channel_select"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-sans text-muted-foreground block mb-1">
                Target Segment
              </label>
              <select
                value={newCampaign.segment}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, segment: e.target.value })
                }
                className="w-full h-10 rounded-lg bg-background border border-gold-800/30 text-sm px-3 text-foreground font-sans"
                data-ocid="campaigns.new_segment_select"
              >
                {SEGMENTS.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} ({s.count.toLocaleString("en-IN")})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-sans text-muted-foreground block mb-1">
                Message
              </label>
              <Textarea
                value={newCampaign.message}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, message: e.target.value })
                }
                placeholder="Campaign message..."
                className="bg-background border-gold-800/30 text-sm resize-none min-h-[80px] font-sans"
                data-ocid="campaigns.new_message_textarea"
              />
            </div>
            <div>
              <label className="text-xs font-sans text-muted-foreground block mb-1">
                Schedule (optional)
              </label>
              <Input
                type="datetime-local"
                value={newCampaign.schedule}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, schedule: e.target.value })
                }
                className="bg-background border-gold-800/30 text-sm"
                data-ocid="campaigns.new_schedule_input"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1 border-gold-800/30 font-sans"
                data-ocid="campaigns.new_cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                className="flex-1 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-semibold font-sans"
                data-ocid="campaigns.new_submit_button"
              >
                Create Campaign
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirm Modal */}
        <Modal
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          title="Delete Campaign?"
        >
          <div className="space-y-4 p-1" data-ocid="campaigns.delete_dialog">
            <p className="text-sm font-sans text-muted-foreground">
              This will permanently delete the campaign and all its data.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteId(null)}
                className="flex-1 border-gold-800/30 font-sans"
                data-ocid="campaigns.delete_cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={() => deleteId && handleDelete(deleteId)}
                className="flex-1 bg-red-700 hover:bg-red-600 text-white font-sans"
                data-ocid="campaigns.delete_confirm_button"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </SecureAppGate>
  );
}
