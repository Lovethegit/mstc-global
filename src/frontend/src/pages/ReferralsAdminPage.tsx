import SecureAppGate from "@/components/shared/SecureAppGate";
import { Copy, Link2, Plus, Trophy, Users, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const REFERRERS = [
  {
    id: 1,
    name: "Mohan Agrawal",
    referrals: 8,
    earned: 40000,
    conversions: 5,
    rate: 62.5,
  },
  {
    id: 2,
    name: "Sonal Mehta",
    referrals: 6,
    earned: 30000,
    conversions: 4,
    rate: 66.7,
  },
  {
    id: 3,
    name: "Kiran Verma",
    referrals: 5,
    earned: 25000,
    conversions: 3,
    rate: 60,
  },
  {
    id: 4,
    name: "Ravi Kumar",
    referrals: 4,
    earned: 20000,
    conversions: 2,
    rate: 50,
  },
  {
    id: 5,
    name: "Nilesh Shah",
    referrals: 3,
    earned: 15000,
    conversions: 2,
    rate: 66.7,
  },
];

const REFERRAL_CHAINS = [
  {
    id: 1,
    root: "Mohan Agrawal",
    level1: ["Rajesh Mehta", "Priya Shah", "Vikram Patel"],
    level2: ["Kavita Desai", "Suresh Kumar"],
  },
  {
    id: 2,
    root: "Sonal Mehta",
    level1: ["Anita Joshi", "Deepa Nair"],
    level2: ["Nilesh Shah"],
  },
];

export default function ReferralsAdminPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [referralLinks, setReferralLinks] = useState([
    {
      id: 1,
      name: "Mohan Agrawal",
      code: "MSTC-MA01",
      link: "https://mstcglobal-kh8.caffeine.xyz?ref=MSTC-MA01",
      clicks: 34,
      conversions: 8,
      commission: 40000,
      active: true,
    },
    {
      id: 2,
      name: "Sonal Mehta",
      code: "MSTC-SM02",
      link: "https://mstcglobal-kh8.caffeine.xyz?ref=MSTC-SM02",
      clicks: 21,
      conversions: 6,
      commission: 30000,
      active: true,
    },
    {
      id: 3,
      name: "Kiran Verma",
      code: "MSTC-KV03",
      link: "https://mstcglobal-kh8.caffeine.xyz?ref=MSTC-KV03",
      clicks: 18,
      conversions: 3,
      commission: 15000,
      active: true,
    },
  ]);
  const [form, setForm] = useState({ name: "", commission: "5000" });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const code = `MSTC-${form.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()}${String(Date.now()).slice(-2)}`;
    setReferralLinks((prev) => [
      {
        id: Date.now(),
        name: form.name,
        code,
        link: `https://mstcglobal-kh8.caffeine.xyz?ref=${code}`,
        clicks: 0,
        conversions: 0,
        commission: Number(form.commission),
        active: true,
      },
      ...prev,
    ]);
    setShowCreate(false);
    setForm({ name: "", commission: "5000" });
    toast.success(`Referral link created for ${form.name}`);
  }

  function copyLink(link: string) {
    navigator.clipboard
      .writeText(link)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => toast.error("Copy failed"));
  }

  function toggleLink(id: number) {
    setReferralLinks((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)),
    );
    toast.success("Link status updated");
  }

  return (
    <SecureAppGate appName="Referral Tracker">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="referrals_admin.page"
      >
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-gold-400" />
              <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
                Referral Tracker
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
              data-ocid="referrals_admin.create_link_button"
            >
              <Plus className="w-3.5 h-3.5" /> Create Link
            </button>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {
                label: "Total Referrers",
                value: REFERRERS.length,
                color: "text-gold-400",
              },
              {
                label: "Total Referrals",
                value: REFERRERS.reduce((s, r) => s + r.referrals, 0),
                color: "text-blue-400",
              },
              {
                label: "Rewards Paid",
                value: `₹${REFERRERS.reduce((s, r) => s + r.earned, 0).toLocaleString()}`,
                color: "text-green-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-gold-800/30 bg-card p-3 text-center"
              >
                <p
                  className={`font-serif text-lg font-bold ${s.color} truncate`}
                >
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <h3 className="font-serif font-semibold text-foreground mb-3 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-gold-400" /> Referral Links
          </h3>
          <div className="space-y-3 mb-6">
            {referralLinks.map((r, i) => (
              <div
                key={r.id}
                className="rounded-xl border border-gold-800/30 bg-card p-4"
                data-ocid={`referrals_admin.link.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">
                      {r.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
                      {r.link}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${r.active ? "bg-green-900/20 text-green-300 border-green-800/30" : "bg-red-900/20 text-red-300 border-red-800/30"}`}
                  >
                    {r.active ? "Active" : "Paused"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span>
                    Clicks: <span className="text-foreground">{r.clicks}</span>
                  </span>
                  <span>
                    Conversions:{" "}
                    <span className="text-green-400">{r.conversions}</span>
                  </span>
                  <span>
                    Commission:{" "}
                    <span className="text-gold-400">
                      ₹{r.commission.toLocaleString()}
                    </span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyLink(r.link)}
                    className="flex-1 py-1.5 rounded-lg border border-gold-800/30 text-gold-500 text-xs hover:bg-gold-800/10 flex items-center justify-center gap-1"
                    data-ocid={`referrals_admin.copy_link.${i + 1}`}
                  >
                    <Copy className="w-3 h-3" /> Copy Link
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleLink(r.id)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs transition-colors ${r.active ? "border-red-800/30 text-red-400 hover:bg-red-900/10" : "border-green-800/30 text-green-400 hover:bg-green-900/10"}`}
                    data-ocid={`referrals_admin.toggle_link.${i + 1}`}
                  >
                    {r.active ? "Pause" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-serif font-semibold text-foreground mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-gold-400" /> Leaderboard
          </h3>
          <div className="overflow-x-auto rounded-xl border border-gold-800/30 mb-6">
            <table className="w-full text-sm">
              <thead className="bg-card border-b border-gold-800/30">
                <tr>
                  {[
                    "#",
                    "Referrer",
                    "Referrals",
                    "Conversions",
                    "Rate",
                    "Earned",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left text-xs font-medium text-gold-600 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {REFERRERS.map((r, i) => (
                  <tr
                    key={r.id}
                    className="border-b border-gold-800/20 hover:bg-card/60 transition-colors"
                    data-ocid={`referrals_admin.item.${i + 1}`}
                  >
                    <td className="px-3 py-2.5 font-bold text-gold-400">
                      {i + 1}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-foreground">
                      {r.name}
                    </td>
                    <td className="px-3 py-2.5 text-center text-muted-foreground">
                      {r.referrals}
                    </td>
                    <td className="px-3 py-2.5 text-center text-green-400">
                      {r.conversions}
                    </td>
                    <td className="px-3 py-2.5 text-center text-blue-400">
                      {r.rate}%
                    </td>
                    <td className="px-3 py-2.5 text-right font-medium text-gold-400">
                      ₹{r.earned.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="font-serif font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-gold-400" /> Referral Chains
          </h3>
          <div className="space-y-3">
            {REFERRAL_CHAINS.map((chain) => (
              <div
                key={chain.id}
                className="rounded-xl border border-gold-800/30 bg-card p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gold-700/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-gold-400">
                      {chain.root[0]}
                    </span>
                  </div>
                  <span className="font-medium text-foreground text-sm">
                    {chain.root}
                  </span>
                </div>
                <div className="pl-6 border-l-2 border-gold-700/30 space-y-1">
                  {chain.level1.map((name) => (
                    <div key={name} className="flex items-center gap-1.5">
                      <div className="w-1.5 h-0.5 bg-gold-700/50" />
                      <span className="text-xs text-muted-foreground">
                        {name}
                      </span>
                    </div>
                  ))}
                  {chain.level2.length > 0 && (
                    <div className="pl-4 border-l border-gold-800/30 space-y-1">
                      {chain.level2.map((name) => (
                        <div key={name} className="flex items-center gap-1.5">
                          <div className="w-1.5 h-0.5 bg-gold-800/50" />
                          <span className="text-[10px] text-muted-foreground">
                            {name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showCreate && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            data-ocid="referrals_admin.dialog"
          >
            <div
              className="absolute inset-0 bg-black/60"
              role="presentation"
              onKeyDown={() => {}}
              onClick={() => setShowCreate(false)}
            />
            <div className="relative bg-card border border-gold-700/40 rounded-2xl p-6 w-full max-w-sm">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                data-ocid="referrals_admin.close_button"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="font-serif text-lg font-bold text-gold-400 mb-4">
                Create Referral Link
              </h2>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="text-xs text-gold-600">
                    Referrer Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                    placeholder="Full name"
                    data-ocid="referrals_admin.name_input"
                  />
                </div>
                <div>
                  <label className="text-xs text-gold-600">
                    Commission per Conversion (₹)
                  </label>
                  <input
                    type="number"
                    value={form.commission}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, commission: e.target.value }))
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                    data-ocid="referrals_admin.commission_input"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gold-800/40 text-muted-foreground text-sm"
                    data-ocid="referrals_admin.cancel_button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg bg-gold-700/30 hover:bg-gold-700/40 text-gold-300 text-sm font-medium"
                    data-ocid="referrals_admin.submit_button"
                  >
                    Create
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
