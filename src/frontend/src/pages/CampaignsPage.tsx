import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { useCampaigns } from "@/hooks/useCrmQueries";
import type { Campaign } from "@/types/crm";
import { BarChart2, Megaphone, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 1n,
    title: "Prahlad Nagar Launch",
    channel: "WhatsApp",
    audience: "Hot Leads",
    messagePreview: "Exclusive 3BHK flats in Prahlad Nagar. Limited units.",
    sentCount: 847n,
    openCount: 612n,
    replyCount: 94n,
    status: "Completed",
    scheduledAt: [],
    createdAt: 0n,
  },
  {
    id: 2n,
    title: "SG Highway Commercial",
    channel: "Email",
    audience: "Investors",
    messagePreview: "Premium commercial units on SG Highway. High yield.",
    sentCount: 420n,
    openCount: 305n,
    replyCount: 45n,
    status: "Active",
    scheduledAt: [],
    createdAt: 0n,
  },
  {
    id: 3n,
    title: "Rental Income Offer",
    channel: "WhatsApp",
    audience: "NRI Clients",
    messagePreview: "Assured rental income properties in Ahmedabad.",
    sentCount: 180n,
    openCount: 145n,
    replyCount: 32n,
    status: "Active",
    scheduledAt: [],
    createdAt: 0n,
  },
  {
    id: 4n,
    title: "RERA Consultation",
    channel: "Social",
    audience: "All Leads",
    messagePreview: "Free RERA consultation with our experts.",
    sentCount: 1200n,
    openCount: 640n,
    replyCount: 88n,
    status: "Completed",
    scheduledAt: [],
    createdAt: 0n,
  },
];

const CHANNEL_COLORS: Record<string, string> = {
  WhatsApp: "bg-green-900/20 text-green-300 border-green-800/30",
  Email: "bg-blue-900/20 text-blue-300 border-blue-800/30",
  Social: "bg-purple-900/20 text-purple-300 border-purple-800/30",
};

export default function CampaignsPage() {
  const { data: fetchedCampaigns = [] } = useCampaigns();
  const [campaigns, setCampaigns] = useState<Campaign[]>(
    fetchedCampaigns.length > 0
      ? (fetchedCampaigns as unknown as Campaign[])
      : MOCK_CAMPAIGNS,
  );
  const [showCreate, setShowCreate] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    type: "WhatsApp",
    target: "All Leads",
    message: "",
  });

  const totalSent = campaigns.reduce((s, c) => s + Number(c.sentCount), 0);
  const totalOpen = campaigns.reduce((s, c) => s + Number(c.openCount), 0);
  const openRate =
    totalSent > 0 ? Math.round((totalOpen / totalSent) * 100) : 0;

  function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return;
    const newCampaign: Campaign = {
      id: BigInt(Date.now()),
      title: form.title,
      channel: form.type,
      audience: form.target,
      messagePreview: form.message || "Campaign message preview",
      sentCount: 0n,
      openCount: 0n,
      replyCount: 0n,
      status: "Draft",
      scheduledAt: [],
      createdAt: BigInt(Date.now()),
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
    setShowCreate(false);
    setStep(1);
    setForm({ title: "", type: "WhatsApp", target: "All Leads", message: "" });
    toast.success("Campaign created", {
      description: `${form.title} saved as Draft`,
    });
  }

  function handleLaunch(id: bigint) {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Active" } : c)),
    );
    toast.success("Campaign launched");
  }

  function handlePause(id: bigint) {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Paused" } : c)),
    );
    toast.info("Campaign paused");
  }

  return (
    <SecureAppGate appName="Campaign Studio">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="campaigns.page"
      >
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-gold-400" />
              <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
                Campaign Studio
              </h1>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowCreate(true);
                setStep(1);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
              data-ocid="campaigns.create_button"
            >
              <Plus className="w-3.5 h-3.5" /> Create Campaign
            </button>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {
                label: "Total Sent",
                value: totalSent.toLocaleString(),
                color: "text-gold-400",
              },
              {
                label: "Avg Open Rate",
                value: `${openRate}%`,
                color: "text-green-400",
              },
              {
                label: "Active Campaigns",
                value: campaigns.filter((c) => c.status === "Active").length,
                color: "text-blue-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-gold-800/30 bg-card p-3 text-center"
              >
                <p className={`font-serif text-xl font-bold ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {campaigns.map((camp, i) => {
              const sent = Number(camp.sentCount);
              const open = Number(camp.openCount);
              const reply = Number(camp.replyCount);
              return (
                <div
                  key={String(camp.id)}
                  className="rounded-xl border border-gold-800/30 bg-card p-4"
                  data-ocid={`campaigns.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-medium text-foreground text-sm">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {camp.audience}
                      </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0 items-center">
                      <Badge
                        variant="outline"
                        className={`text-xs border ${CHANNEL_COLORS[camp.channel] ?? ""}`}
                      >
                        {camp.channel}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs border ${
                          camp.status === "Active"
                            ? "bg-green-900/20 text-green-300 border-green-800/30"
                            : camp.status === "Draft"
                              ? "bg-muted text-muted-foreground border-border"
                              : camp.status === "Paused"
                                ? "bg-yellow-900/20 text-yellow-300 border-yellow-800/30"
                                : "bg-card text-muted-foreground border-border"
                        }`}
                      >
                        {camp.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic mb-3 line-clamp-1">
                    "{camp.messagePreview}"
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <div className="rounded-lg bg-background/50 p-2">
                      <p className="text-sm font-bold text-gold-400">
                        {sent.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Sent</p>
                    </div>
                    <div className="rounded-lg bg-background/50 p-2">
                      <p className="text-sm font-bold text-blue-400">
                        {sent > 0 ? Math.round((open / sent) * 100) : 0}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Open Rate
                      </p>
                    </div>
                    <div className="rounded-lg bg-background/50 p-2">
                      <p className="text-sm font-bold text-green-400">
                        {sent > 0 ? Math.round((reply / sent) * 100) : 0}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Reply Rate
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {camp.status === "Draft" && (
                      <button
                        type="button"
                        onClick={() => handleLaunch(camp.id)}
                        className="flex-1 py-1.5 rounded-lg bg-green-700/20 text-green-400 text-xs font-medium hover:bg-green-700/30 transition-colors"
                        data-ocid={`campaigns.launch_button.${i + 1}`}
                      >
                        Launch
                      </button>
                    )}
                    {camp.status === "Active" && (
                      <button
                        type="button"
                        onClick={() => handlePause(camp.id)}
                        className="flex-1 py-1.5 rounded-lg bg-yellow-700/20 text-yellow-400 text-xs font-medium hover:bg-yellow-700/30 transition-colors"
                        data-ocid={`campaigns.pause_button.${i + 1}`}
                      >
                        Pause
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Multi-step Create Campaign Modal */}
        {showCreate && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            data-ocid="campaigns.dialog"
          >
            <div
              className="absolute inset-0 bg-black/60"
              role="presentation"
              onKeyDown={() => {}}
              onClick={() => setShowCreate(false)}
            />
            <div className="relative bg-card border border-gold-700/40 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-bold text-gold-400">
                  Create Campaign
                </h2>
                <span className="text-xs text-muted-foreground">
                  Step {step} of 3
                </span>
              </div>
              <form onSubmit={handleCreateSubmit}>
                {step === 1 && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gold-600">
                        Campaign Name
                      </label>
                      <input
                        required
                        value={form.title}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, title: e.target.value }))
                        }
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                        data-ocid="campaigns.create_title_input"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gold-600">
                        Channel / Type
                      </label>
                      <select
                        value={form.type}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, type: e.target.value }))
                        }
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                        data-ocid="campaigns.create_channel_select"
                      >
                        {["WhatsApp", "Email", "Social"].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => form.title && setStep(2)}
                      className="w-full py-2 rounded-lg bg-gold-700/30 text-gold-300 text-sm font-medium mt-2"
                    >
                      Next →
                    </button>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gold-600">
                        Target Audience
                      </label>
                      <select
                        value={form.target}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, target: e.target.value }))
                        }
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                        data-ocid="campaigns.create_target_select"
                      >
                        {[
                          "All Leads",
                          "New Leads",
                          "Clients",
                          "Hot Leads",
                          "NRI Clients",
                        ].map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-2 rounded-lg border border-gold-800/40 text-muted-foreground text-sm"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 py-2 rounded-lg bg-gold-700/30 text-gold-300 text-sm font-medium"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gold-600">
                        Message Preview
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, message: e.target.value }))
                        }
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm resize-none"
                        rows={3}
                        data-ocid="campaigns.create_message_textarea"
                        placeholder="Your campaign message..."
                      />
                    </div>
                    <div className="rounded-lg bg-background/50 p-3 text-xs text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">
                        Summary
                      </p>
                      <p>Name: {form.title}</p>
                      <p>
                        Channel: {form.type} • Target: {form.target}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCreate(false)}
                        className="flex-1 px-4 py-2 rounded-lg border border-gold-800/40 text-muted-foreground text-sm"
                        data-ocid="campaigns.cancel_button"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 rounded-lg bg-gold-700/30 text-gold-300 text-sm font-medium"
                        data-ocid="campaigns.submit_button"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </SecureAppGate>
  );
}
