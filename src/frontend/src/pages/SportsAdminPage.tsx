import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Star, Trophy } from "lucide-react";

const ATHLETES = [
  {
    id: 1,
    name: "Kiran Patel",
    sport: "Cricket",
    achievements: "Ranji Trophy 2023, U-25 Gujarat XI",
    sponsorValue: 150000,
    availability: "Available",
    age: 22,
    city: "Ahmedabad",
  },
  {
    id: 2,
    name: "Meera Thakkar",
    sport: "Athletics",
    achievements: "State 400m Champion 2024, National Bronze",
    sponsorValue: 80000,
    availability: "Available",
    age: 20,
    city: "Vadodara",
  },
  {
    id: 3,
    name: "Rajiv Solanki",
    sport: "Kabaddi",
    achievements: "Pro Kabaddi Reserve, Gujarat State Gold",
    sponsorValue: 120000,
    availability: "Booked",
    age: 24,
    city: "Surat",
  },
  {
    id: 4,
    name: "Ananya Rao",
    sport: "Swimming",
    achievements: "Junior Nationals Silver 2024, State Record 200m",
    sponsorValue: 60000,
    availability: "Available",
    age: 18,
    city: "Ahmedabad",
  },
  {
    id: 5,
    name: "Bharat Gamit",
    sport: "Wrestling",
    achievements: "Inter-University Gold, Khelo India 2023 Bronze",
    sponsorValue: 90000,
    availability: "Available",
    age: 21,
    city: "Navsari",
  },
  {
    id: 6,
    name: "Divya Parmar",
    sport: "Badminton",
    achievements: "Gujarat State Champion 2023, All India Bronze",
    sponsorValue: 70000,
    availability: "Booked",
    age: 19,
    city: "Ahmedabad",
  },
  {
    id: 7,
    name: "Suresh Baria",
    sport: "Cricket",
    achievements: "Saurashtra T20 League, U-19 Gujarat Captain",
    sponsorValue: 130000,
    availability: "Available",
    age: 19,
    city: "Rajkot",
  },
  {
    id: 8,
    name: "Hetal Vasava",
    sport: "Archery",
    achievements: "Tribal Games Gold 2023, State Silver 2024",
    sponsorValue: 45000,
    availability: "Available",
    age: 17,
    city: "Nandod",
  },
];

const TOURNAMENTS = [
  {
    id: 1,
    name: "BCCI Junior League – West Zone",
    sport: "Cricket",
    venue: "Sardar Patel Stadium, Ahmedabad",
    date: "2026-07-10",
    type: "Regional",
  },
  {
    id: 2,
    name: "Gujarat Athletics Championship",
    sport: "Athletics",
    venue: "SAI Sports Complex, Gandhinagar",
    date: "2026-07-22",
    type: "State",
  },
  {
    id: 3,
    name: "Pro Kabaddi Zone Trials",
    sport: "Kabaddi",
    venue: "EKA Arena, Ahmedabad",
    date: "2026-08-05",
    type: "National",
  },
  {
    id: 4,
    name: "Aquatic Federation Gujarat Open",
    sport: "Swimming",
    venue: "YMCA Pool, Ahmedabad",
    date: "2026-08-18",
    type: "State",
  },
  {
    id: 5,
    name: "Khelo India Regional Trials",
    sport: "Multi-Sport",
    venue: "Sports Authority Complex",
    date: "2026-09-01",
    type: "National",
  },
];

const SPONSORS = [
  {
    name: "Adani Group CSR",
    budget: 1500000,
    sport: "Multi-sport",
    interest: "Gujarat athletes",
    status: "Active",
  },
  {
    name: "Torrent Pharma Foundation",
    budget: 800000,
    sport: "Athletics",
    interest: "Women athletes",
    status: "Negotiating",
  },
  {
    name: "HDFC Bank CSR",
    budget: 600000,
    sport: "Cricket",
    interest: "U-25 cricketers",
    status: "Active",
  },
];

export default function SportsAdminPage() {
  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1
              className="text-2xl font-bold text-gold-400"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Sports Desk
            </h1>
            <p className="text-sm text-muted-foreground">
              Athletes, sponsorships & tournaments – Gujarat
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Athletes", value: "8", color: "text-gold-400" },
              { label: "Tournaments", value: "5", color: "text-blue-400" },
              { label: "Active Sponsors", value: "3", color: "text-green-400" },
              {
                label: "Sponsor Pool",
                value: "₹29L",
                color: "text-purple-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-card/80 border border-gold-800/30 rounded-xl p-4"
              >
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Athlete Grid */}
          <div>
            <h2 className="font-bold text-gold-300 mb-3">Athlete Profiles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ATHLETES.map((a, i) => (
                <div
                  key={a.id}
                  className="bg-card/80 border border-gold-800/30 rounded-xl p-4 space-y-2"
                  data-ocid={`sports.athlete.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-full bg-gold-800/40 flex items-center justify-center text-gold-400 font-bold text-sm">
                      {a.name.charAt(0)}
                    </div>
                    <Badge
                      className={
                        a.availability === "Available"
                          ? "bg-green-900/30 text-green-300 border-green-700/40 text-[10px]"
                          : "bg-amber-900/30 text-amber-300 border-amber-700/40 text-[10px]"
                      }
                    >
                      {a.availability}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {a.name}
                    </p>
                    <p className="text-[11px] text-gold-500">
                      {a.sport} · Age {a.age} · {a.city}
                    </p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {a.achievements}
                  </p>
                  <div className="flex items-center gap-1 text-xs">
                    <DollarSign className="w-3 h-3 text-gold-400" />
                    <span className="text-gold-400 font-semibold">
                      ₹{(a.sponsorValue / 1000).toFixed(0)}K
                    </span>
                    <span className="text-muted-foreground">/event</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sponsorship Panel */}
            <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
              <h2 className="font-bold text-gold-300 mb-3">
                Sponsorship Matching
              </h2>
              <div className="space-y-3">
                {SPONSORS.map((s, i) => (
                  <div
                    key={s.name}
                    className="border border-gold-800/20 rounded-lg p-3"
                    data-ocid={`sports.sponsor.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {s.name}
                      </span>
                      <Badge
                        className={
                          s.status === "Active"
                            ? "bg-green-900/30 text-green-300 border-green-700/40 text-[10px]"
                            : "bg-amber-900/30 text-amber-300 border-amber-700/40 text-[10px]"
                        }
                      >
                        {s.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {s.sport} · {s.interest}
                    </p>
                    <p className="text-sm font-semibold text-green-400 mt-1">
                      ₹{(s.budget / 100000).toFixed(1)}L budget
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tournament Calendar */}
            <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
              <h2 className="font-bold text-gold-300 mb-3">
                Tournament Calendar
              </h2>
              <div className="space-y-2">
                {TOURNAMENTS.map((t, i) => (
                  <div
                    key={t.id}
                    className="flex items-start gap-3 border border-gold-800/20 rounded-lg p-3"
                    data-ocid={`sports.tournament.item.${i + 1}`}
                  >
                    <Calendar className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {t.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {t.venue}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gold-400">
                          {t.date}
                        </span>
                        <Badge className="text-[9px] px-1.5 py-0 bg-blue-900/30 text-blue-300 border-blue-700/40">
                          {t.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SecureAppGate>
  );
}
