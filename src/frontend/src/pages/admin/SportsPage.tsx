import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Award,
  Calendar,
  ChevronLeft,
  DollarSign,
  Plus,
  Search,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TEAMS = [
  {
    id: 1,
    name: "MSTC Cricket XI",
    sport: "Cricket",
    players: 15,
    coach: "Vijay Sharma",
    wins: 8,
    losses: 2,
    status: "Active",
  },
  {
    id: 2,
    name: "Gujarat Athletics Club",
    sport: "Athletics",
    players: 22,
    coach: "Meera Rao",
    wins: 12,
    losses: 4,
    status: "Active",
  },
  {
    id: 3,
    name: "Kabaddi Warriors",
    sport: "Kabaddi",
    players: 12,
    coach: "Rajan Patel",
    wins: 6,
    losses: 3,
    status: "Active",
  },
  {
    id: 4,
    name: "Badminton Academy",
    sport: "Badminton",
    players: 18,
    coach: "Anuj Mehta",
    wins: 9,
    losses: 5,
    status: "Forming",
  },
];

const PLAYERS = [
  {
    id: 1,
    name: "Kiran Patel",
    sport: "Cricket",
    team: "MSTC Cricket XI",
    age: 22,
    city: "Ahmedabad",
    sponsorValue: 150000,
    status: "Available",
  },
  {
    id: 2,
    name: "Meera Thakkar",
    sport: "Athletics",
    team: "Gujarat Athletics Club",
    age: 20,
    city: "Vadodara",
    sponsorValue: 80000,
    status: "Available",
  },
  {
    id: 3,
    name: "Rajiv Solanki",
    sport: "Kabaddi",
    team: "Kabaddi Warriors",
    age: 24,
    city: "Surat",
    sponsorValue: 120000,
    status: "Contracted",
  },
  {
    id: 4,
    name: "Divya Parmar",
    sport: "Badminton",
    team: "Badminton Academy",
    age: 19,
    city: "Ahmedabad",
    sponsorValue: 70000,
    status: "Available",
  },
  {
    id: 5,
    name: "Suresh Baria",
    sport: "Cricket",
    team: "MSTC Cricket XI",
    age: 19,
    city: "Rajkot",
    sponsorValue: 130000,
    status: "Available",
  },
  {
    id: 6,
    name: "Hetal Vasava",
    sport: "Archery",
    team: "—",
    age: 17,
    city: "Nandod",
    sponsorValue: 45000,
    status: "Available",
  },
];

const TOURNAMENTS = [
  {
    id: 1,
    name: "BCCI Junior League – West Zone",
    sport: "Cricket",
    venue: "Sardar Patel Stadium",
    date: "2026-07-10",
    bracket: "Quarter-finals",
    teams: 8,
    status: "Upcoming",
  },
  {
    id: 2,
    name: "Gujarat Athletics Championship",
    sport: "Athletics",
    venue: "SAI Complex, Gandhinagar",
    date: "2026-07-22",
    bracket: "Finals",
    teams: 0,
    status: "Upcoming",
  },
  {
    id: 3,
    name: "Pro Kabaddi Zone Trials",
    sport: "Kabaddi",
    venue: "EKA Arena",
    date: "2026-08-05",
    bracket: "Semi-finals",
    teams: 4,
    status: "Registration",
  },
  {
    id: 4,
    name: "Khelo India Regional Trials",
    sport: "Multi-Sport",
    venue: "Sports Authority Complex",
    date: "2026-09-01",
    bracket: "Heats",
    teams: 16,
    status: "Registration",
  },
  {
    id: 5,
    name: "Inter-Corporate Cricket Cup",
    sport: "Cricket",
    venue: "MSTC Ground",
    date: "2026-06-28",
    bracket: "Group Stage",
    teams: 6,
    status: "Live",
  },
];

const SPONSORS = [
  {
    id: 1,
    name: "Adani Group CSR",
    budget: 1500000,
    sport: "Multi-sport",
    interest: "Gujarat athletes",
    status: "Active",
  },
  {
    id: 2,
    name: "Torrent Pharma Foundation",
    budget: 800000,
    sport: "Athletics",
    interest: "Women athletes",
    status: "Negotiating",
  },
  {
    id: 3,
    name: "HDFC Bank CSR",
    budget: 600000,
    sport: "Cricket",
    interest: "U-25 cricketers",
    status: "Active",
  },
  {
    id: 4,
    name: "Reliance Foundation",
    budget: 2000000,
    sport: "Multi-sport",
    interest: "National players",
    status: "Enquiry",
  },
];

const TABS = ["Players", "Teams", "Tournaments", "Sponsors"] as const;
type Tab = (typeof TABS)[number];

export default function SportsPage() {
  const [tab, setTab] = useState<Tab>("Players");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const totalSponsorBudget = SPONSORS.filter(
    (s) => s.status === "Active",
  ).reduce((a, s) => a + s.budget, 0);

  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              to="/apps"
              className="p-2 rounded-lg border border-gold-800/30 hover:border-gold-600/50 transition-colors"
              data-ocid="sports.back_button"
            >
              <ChevronLeft className="w-4 h-4 text-gold-400" />
            </Link>
            <div className="flex-1">
              <h1
                className="text-2xl font-bold text-gold-400"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Sports Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Player registry, teams, tournaments & sponsorships
              </p>
            </div>
            <Button
              onClick={() => {
                setShowAdd(true);
                toast.success("Add form opened");
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="sports.add_button"
            >
              <Plus className="w-4 h-4 mr-1" /> Add{" "}
              {tab === "Players"
                ? "Player"
                : tab === "Teams"
                  ? "Team"
                  : tab === "Tournaments"
                    ? "Tournament"
                    : "Sponsor"}
            </Button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Registered Players",
                value: PLAYERS.length.toString(),
                icon: Users,
                color: "text-blue-400",
              },
              {
                label: "Active Teams",
                value: TEAMS.filter(
                  (t) => t.status === "Active",
                ).length.toString(),
                icon: Trophy,
                color: "text-gold-400",
              },
              {
                label: "Upcoming Tournaments",
                value: TOURNAMENTS.filter(
                  (t) => t.status !== "Live",
                ).length.toString(),
                icon: Calendar,
                color: "text-green-400",
              },
              {
                label: "Sponsor Budget",
                value: `₹${(totalSponsorBudget / 100000).toFixed(1)}L`,
                icon: DollarSign,
                color: "text-purple-400",
              },
            ].map((k) => (
              <div
                key={k.label}
                className="bg-card/80 border border-gold-800/30 rounded-xl p-4"
                data-ocid={`sports.kpi.${k.label.toLowerCase().replace(/ /g, "_")}`}
              >
                <k.icon className={`w-5 h-5 mb-2 ${k.color}`} />
                <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
                <div className="text-xs text-muted-foreground">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gold-800/30">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  tab === t
                    ? "bg-card text-gold-400 border border-b-0 border-gold-800/30"
                    : "text-muted-foreground hover:text-gold-300"
                }`}
                data-ocid={`sports.tab.${t.toLowerCase()}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full bg-card/60 border border-gold-800/30 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-600/50"
              placeholder={`Search ${tab.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="sports.search_input"
            />
          </div>

          {/* Players Tab */}
          {tab === "Players" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {PLAYERS.filter(
                (p) =>
                  p.name.toLowerCase().includes(search.toLowerCase()) ||
                  p.sport.toLowerCase().includes(search.toLowerCase()),
              ).map((p, i) => (
                <div
                  key={p.id}
                  className="bg-card/80 border border-gold-800/30 rounded-xl p-4 hover:border-gold-600/40 transition-all"
                  data-ocid={`sports.player.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-foreground">
                        {p.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {p.sport} · {p.city}
                      </div>
                    </div>
                    <Badge
                      className={
                        p.status === "Available"
                          ? "bg-green-900/30 text-green-300 border-green-700/40"
                          : "bg-amber-900/30 text-amber-300 border-amber-700/40"
                      }
                    >
                      {p.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Team: {p.team}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gold-400">
                      Sponsor Value: ₹{(p.sponsorValue / 1000).toFixed(0)}K
                    </span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-gold-800/30 text-gold-400"
                        onClick={() => toast.success(`Viewing ${p.name}`)}
                        data-ocid={`sports.player.view_button.${i + 1}`}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-primary/20 text-primary hover:bg-primary/30"
                        onClick={() => toast.success(`Sponsoring ${p.name}`)}
                        data-ocid={`sports.player.sponsor_button.${i + 1}`}
                      >
                        Sponsor
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Teams Tab */}
          {tab === "Teams" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold-800/30 text-muted-foreground text-xs">
                    {[
                      "Team",
                      "Sport",
                      "Players",
                      "Coach",
                      "Record",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th key={h} className="text-left py-2 px-3 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TEAMS.filter((t) =>
                    t.name.toLowerCase().includes(search.toLowerCase()),
                  ).map((t, i) => (
                    <tr
                      key={t.id}
                      className="border-b border-gold-800/20 hover:bg-card/40 transition-colors"
                      data-ocid={`sports.team.item.${i + 1}`}
                    >
                      <td className="py-3 px-3 font-medium text-foreground">
                        {t.name}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {t.sport}
                      </td>
                      <td className="py-3 px-3 text-blue-400">{t.players}</td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {t.coach}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-green-400">{t.wins}W</span>{" "}
                        <span className="text-red-400">{t.losses}L</span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          className={
                            t.status === "Active"
                              ? "bg-green-900/30 text-green-300 border-green-700/40"
                              : "bg-amber-900/30 text-amber-300 border-amber-700/40"
                          }
                        >
                          {t.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-gold-800/30 text-gold-400"
                          onClick={() => toast.success(`Managing ${t.name}`)}
                          data-ocid={`sports.team.manage_button.${i + 1}`}
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tournaments Tab */}
          {tab === "Tournaments" && (
            <div className="space-y-3">
              {TOURNAMENTS.filter((t) =>
                t.name.toLowerCase().includes(search.toLowerCase()),
              ).map((t, i) => (
                <div
                  key={t.id}
                  className="bg-card/80 border border-gold-800/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3"
                  data-ocid={`sports.tournament.item.${i + 1}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">
                        {t.name}
                      </span>
                      <Badge
                        className={
                          t.status === "Live"
                            ? "bg-green-900/30 text-green-300 border-green-700/40"
                            : t.status === "Registration"
                              ? "bg-blue-900/30 text-blue-300 border-blue-700/40"
                              : "bg-muted/30 text-muted-foreground border-border"
                        }
                      >
                        {t.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t.sport} · {t.venue} · {t.date} · Bracket: {t.bracket}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gold-800/30 text-gold-400 text-xs"
                      onClick={() =>
                        toast.info(`Viewing bracket for ${t.name}`)
                      }
                      data-ocid={`sports.tournament.bracket_button.${i + 1}`}
                    >
                      <Award className="w-3 h-3 mr-1" /> Bracket
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary/20 text-primary hover:bg-primary/30 text-xs"
                      onClick={() => toast.success(`Registering for ${t.name}`)}
                      data-ocid={`sports.tournament.register_button.${i + 1}`}
                    >
                      Register
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sponsors Tab */}
          {tab === "Sponsors" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SPONSORS.filter((s) =>
                s.name.toLowerCase().includes(search.toLowerCase()),
              ).map((s, i) => (
                <div
                  key={s.id}
                  className="bg-card/80 border border-gold-800/30 rounded-xl p-5"
                  data-ocid={`sports.sponsor.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-foreground">
                        {s.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {s.sport} · Interest: {s.interest}
                      </div>
                    </div>
                    <Badge
                      className={
                        s.status === "Active"
                          ? "bg-green-900/30 text-green-300 border-green-700/40"
                          : s.status === "Negotiating"
                            ? "bg-amber-900/30 text-amber-300 border-amber-700/40"
                            : "bg-blue-900/30 text-blue-300 border-blue-700/40"
                      }
                    >
                      {s.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gold-400">
                      ₹{(s.budget / 100000).toFixed(1)}L
                      <span className="text-xs text-muted-foreground ml-1">
                        budget
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gold-800/30 text-gold-400 text-xs"
                        onClick={() => toast.info(`Viewing ${s.name} details`)}
                        data-ocid={`sports.sponsor.view_button.${i + 1}`}
                      >
                        Details
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary/20 text-primary hover:bg-primary/30 text-xs"
                        onClick={() => toast.success(`Contacting ${s.name}`)}
                        data-ocid={`sports.sponsor.contact_button.${i + 1}`}
                      >
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showAdd && (
            <div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              data-ocid="sports.add_dialog"
            >
              <div className="bg-card border border-gold-800/40 rounded-2xl p-6 w-full max-w-md">
                <h3 className="font-serif text-lg font-bold text-gold-400 mb-4">
                  Add {tab === "Players" ? "Player" : tab}
                </h3>
                <div className="space-y-3">
                  <input
                    className="w-full bg-muted/30 border border-gold-800/30 rounded-lg px-3 py-2 text-sm"
                    placeholder="Name"
                    data-ocid="sports.add.name_input"
                  />
                  <input
                    className="w-full bg-muted/30 border border-gold-800/30 rounded-lg px-3 py-2 text-sm"
                    placeholder="Sport"
                    data-ocid="sports.add.sport_input"
                  />
                  <div className="flex gap-2 justify-end mt-4">
                    <Button
                      variant="outline"
                      className="border-gold-800/30"
                      onClick={() => setShowAdd(false)}
                      data-ocid="sports.add.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-primary text-primary-foreground"
                      onClick={() => {
                        toast.success("Record added successfully!");
                        setShowAdd(false);
                      }}
                      data-ocid="sports.add.submit_button"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SecureAppGate>
  );
}
