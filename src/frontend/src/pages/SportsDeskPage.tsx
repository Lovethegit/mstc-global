import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  Calendar,
  Download,
  Medal,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

const EVENTS = [
  {
    id: 1,
    name: "MSTC Cricket Premier League",
    sport: "Cricket",
    date: "15 Jun 2025",
    venue: "Sardar Patel Stadium, Motera",
    teams: 8,
    prize: 125000,
    status: "Upcoming",
  },
  {
    id: 2,
    name: "Corporate Badminton Championship",
    sport: "Badminton",
    date: "28 Jun 2025",
    venue: "Tagore Hall, Ahmedabad",
    teams: 16,
    prize: 50000,
    status: "Upcoming",
  },
  {
    id: 3,
    name: "Gujarat Athletics Open",
    sport: "Athletics",
    date: "20 Jul 2025",
    venue: "SAG Ground, Ahmedabad",
    teams: 0,
    prize: 75000,
    status: "Upcoming",
  },
  {
    id: 4,
    name: "MSTC Chess Tournament",
    sport: "Chess",
    date: "05 Aug 2025",
    venue: "Online + Ahmedabad Hub",
    teams: 32,
    prize: 30000,
    status: "Upcoming",
  },
  {
    id: 5,
    name: "Inter-Colony Football Cup",
    sport: "Football",
    date: "10 May 2025",
    venue: "Sabarmati Ground",
    teams: 12,
    prize: 60000,
    status: "Completed",
  },
  {
    id: 6,
    name: "Marathon for a Cause – 5K/10K",
    sport: "Running",
    date: "26 Jan 2025",
    venue: "Riverfront, Ahmedabad",
    teams: 0,
    prize: 80000,
    status: "Completed",
  },
];

const ATHLETES = [
  {
    id: 1,
    name: "Yash Patel",
    sport: "Cricket",
    age: 22,
    achievement: "Guj. U-23 XI – 2024",
    sponsor: true,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Kavya Shah",
    sport: "Badminton",
    age: 19,
    achievement: "Gujarat State Badminton – Runner Up 2024",
    sponsor: true,
    rating: 4.9,
  },
  {
    id: 3,
    name: "Rohan Trivedi",
    sport: "Athletics (100m)",
    age: 20,
    achievement: "SAF Games Silver – 2024",
    sponsor: true,
    rating: 4.7,
  },
  {
    id: 4,
    name: "Dhruv Mehta",
    sport: "Chess",
    age: 17,
    achievement: "National Rating 2150 FIDE",
    sponsor: true,
    rating: 4.6,
  },
  {
    id: 5,
    name: "Priya Joshi",
    sport: "Football",
    age: 21,
    achievement: "Gujarat Women's Team Captain",
    sponsor: false,
    rating: 4.5,
  },
  {
    id: 6,
    name: "Aryan Desai",
    sport: "Cricket (Bowling)",
    age: 24,
    achievement: "Syed Mushtaq Ali Top Wicket-Taker 2024",
    sponsor: true,
    rating: 4.7,
  },
];

const SPONSORS = [
  {
    id: 1,
    name: "Gujarat Infra Corp",
    type: "Title Sponsor",
    events: ["Cricket Premier League"],
    amount: 500000,
  },
  {
    id: 2,
    name: "Ahmedabad Motors Pvt. Ltd.",
    type: "Gold Sponsor",
    events: ["Badminton Championship", "Athletics Open"],
    amount: 200000,
  },
  {
    id: 3,
    name: "Shah Builders",
    type: "Silver Sponsor",
    events: ["Football Cup", "Cricket Premier League"],
    amount: 150000,
  },
  {
    id: 4,
    name: "IndusFirst Bank",
    type: "Associate Sponsor",
    events: ["Marathon", "Chess Tournament"],
    amount: 100000,
  },
];

const RESULTS = [
  {
    id: 1,
    event: "Inter-Colony Football Cup",
    winner: "Maninagar Tigers",
    runner: "Nikol Warriors",
    date: "10 May 2025",
    prize: 60000,
  },
  {
    id: 2,
    event: "Marathon for a Cause",
    winner: "Rohan Trivedi (5K)",
    runner: "Amit Shah (10K)",
    date: "26 Jan 2025",
    prize: 80000,
  },
];

const sportColors: Record<string, string> = {
  Cricket: "bg-amber-500/15 text-amber-300",
  Badminton: "bg-blue-500/15 text-blue-300",
  Athletics: "bg-green-500/15 text-green-300",
  "Athletics (100m)": "bg-green-500/15 text-green-300",
  Chess: "bg-purple-500/15 text-purple-300",
  Football: "bg-orange-500/15 text-orange-300",
  Running: "bg-cyan-500/15 text-cyan-300",
  "Cricket (Bowling)": "bg-amber-500/15 text-amber-300",
};

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${(n / 1000).toFixed(0)}K`;
}

export default function SportsDeskPage() {
  const [tab, setTab] = useState<
    "events" | "athletes" | "sponsors" | "results"
  >("events");
  const TABS = ["events", "athletes", "sponsors", "results"] as const;

  return (
    <div className="min-h-screen bg-[#06090f] text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-gold-800/30 px-4 py-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-gold-400" />
                <span className="text-xs text-gold-500 font-sans uppercase tracking-widest">
                  MSTC GLOBAL
                </span>
              </div>
              <h1
                className="text-2xl md:text-3xl font-bold text-gold-300"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Sports Desk
              </h1>
              <p className="text-sm text-muted-foreground font-sans mt-0.5">
                MSTC Sports &amp; Recreation Division ·{" "}
                <span className="text-gold-500">Ahmedabad</span>
              </p>
            </div>
            <Button
              className="h-11 px-5 bg-gold-500/10 border border-gold-600/40 text-gold-300 hover:bg-gold-500/20"
              data-ocid="sports.brochure_button"
            >
              <Download className="w-4 h-4 mr-2" />
              Sports Brochure
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          data-ocid="sports.stats"
        >
          {[
            {
              label: "Events Hosted",
              value: "8",
              icon: Calendar,
              color: "text-gold-400",
            },
            {
              label: "Athletes Supported",
              value: "142",
              icon: Users,
              color: "text-blue-400",
            },
            {
              label: "Sponsors",
              value: "12",
              icon: Star,
              color: "text-amber-400",
            },
            {
              label: "Prize Distributed",
              value: "₹8.4L",
              icon: TrendingUp,
              color: "text-green-400",
            },
          ].map((s, i) => (
            <div
              key={s.label}
              className="bg-card border border-gold-800/30 rounded-xl p-4 flex flex-col gap-1"
              data-ocid={`sports.stat.item.${i + 1}`}
            >
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <div className="text-xl md:text-2xl font-bold text-gold-300">
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground font-sans">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 bg-card border border-gold-800/30 rounded-xl w-fit flex-wrap"
          data-ocid="sports.tabs"
        >
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-sans capitalize min-h-[40px] transition-colors ${
                tab === t
                  ? "bg-gold-500/20 text-gold-300"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`sports.${t}_tab`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Events */}
        {tab === "events" && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            data-ocid="sports.events_list"
          >
            {EVENTS.map((e, i) => (
              <div
                key={e.id}
                className="bg-card border border-gold-800/30 rounded-xl p-5 hover:border-gold-600/40 transition-colors"
                data-ocid={`sports.event.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3
                    className="font-semibold text-foreground"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {e.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                      e.status === "Upcoming"
                        ? "bg-blue-500/15 text-blue-400"
                        : "bg-green-500/15 text-green-400"
                    }`}
                  >
                    {e.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-xs font-sans">
                  <div>
                    <span className="text-muted-foreground">Sport: </span>
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        sportColors[e.sport] ?? "text-foreground"
                      }`}
                    >
                      {e.sport}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date: </span>
                    <span className="text-foreground">{e.date}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Venue: </span>
                    <span className="text-foreground">{e.venue}</span>
                  </div>
                  {e.teams > 0 && (
                    <div>
                      <span className="text-muted-foreground">Teams: </span>
                      <span className="text-foreground">{e.teams}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Prize: </span>
                    <span className="text-gold-300 font-medium">
                      {fmt(e.prize)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Athletes */}
        {tab === "athletes" && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="sports.athletes_list"
          >
            {ATHLETES.map((a, i) => (
              <div
                key={a.id}
                className="bg-card border border-gold-800/30 rounded-xl p-5 flex flex-col gap-2 hover:border-gold-600/40 transition-colors"
                data-ocid={`sports.athlete.item.${i + 1}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{a.name}</h3>
                  {a.sponsor && (
                    <Badge className="bg-gold-500/15 text-gold-400 border-0 text-[10px]">
                      Sponsored
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      sportColors[a.sport] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {a.sport}
                  </span>
                  <span className="text-xs text-muted-foreground font-sans">
                    Age {a.age}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-sans">
                  {a.achievement}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= Math.floor(a.rating)
                          ? "text-gold-400 fill-gold-400"
                          : "text-muted"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">
                    {a.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sponsors */}
        {tab === "sponsors" && (
          <div className="space-y-3" data-ocid="sports.sponsors_list">
            {SPONSORS.map((s, i) => (
              <div
                key={s.id}
                className="bg-card border border-gold-800/30 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                data-ocid={`sports.sponsor.item.${i + 1}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">
                      {s.name}
                    </span>
                    <Badge className="bg-gold-500/15 text-gold-400 border-0 text-[10px]">
                      {s.type}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground font-sans">
                    Events: {s.events.join(", ")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gold-300">
                    {fmt(s.amount)}
                  </div>
                  <div className="text-xs text-muted-foreground font-sans">
                    sponsorship value
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {tab === "results" && (
          <div className="space-y-4" data-ocid="sports.results_section">
            {RESULTS.map((r, i) => (
              <div
                key={r.id}
                className="bg-card border border-gold-800/30 rounded-xl p-5"
                data-ocid={`sports.result.item.${i + 1}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className="font-semibold text-foreground"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {r.event}
                  </h3>
                  <span className="text-xs text-muted-foreground font-sans">
                    {r.date}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm font-sans">
                  <div className="flex items-center gap-2">
                    <Medal className="w-4 h-4 text-gold-400" />
                    <div>
                      <div className="text-[10px] text-muted-foreground">
                        Winner
                      </div>
                      <div className="text-foreground font-medium">
                        {r.winner}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-[10px] text-muted-foreground">
                        Runner-up
                      </div>
                      <div className="text-foreground">{r.runner}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-400" />
                    <div>
                      <div className="text-[10px] text-muted-foreground">
                        Prize Pool
                      </div>
                      <div className="text-gold-300 font-medium">
                        {fmt(r.prize)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div
              className="text-center py-8 text-muted-foreground font-sans text-sm"
              data-ocid="sports.results.empty_state"
            >
              More results will appear as events conclude.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
