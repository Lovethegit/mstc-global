import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mic, Music, Star } from "lucide-react";

type BookingStatus = "Enquiry" | "Contract" | "Confirmed" | "Completed";

const ARTISTS = [
  {
    id: 1,
    name: "Pandit Vishwanath Vyas",
    genre: "Classical",
    instrument: "Sarangi",
    fee: "₹85K–15L",
    city: "Ahmedabad",
    availability: "Available",
  },
  {
    id: 2,
    name: "Komal Narang",
    genre: "Bollywood",
    type: "Vocalist",
    fee: "₹35K–1.2L",
    city: "Mumbai",
    availability: "Available",
  },
  {
    id: 3,
    name: "Manoj Barot",
    genre: "Devotional",
    type: "Bhajan Singer",
    fee: "₹20K–60K",
    city: "Ahmedabad",
    availability: "Booked",
  },
  {
    id: 4,
    name: "Falguni Mehta",
    genre: "Folk",
    type: "Garba Vocalist",
    fee: "₹40K–1.5L",
    city: "Ahmedabad",
    availability: "Available",
  },
  {
    id: 5,
    name: "DJ Sid Sharma",
    genre: "Fusion",
    type: "DJ/Mixer",
    fee: "₹25K–80K",
    city: "Surat",
    availability: "Available",
  },
  {
    id: 6,
    name: "Natasha Kapoor",
    genre: "Jazz",
    type: "Pianist",
    fee: "₹50K–1.8L",
    city: "Bangalore",
    availability: "Available",
  },
  {
    id: 7,
    name: "Ashwin Prajapati",
    genre: "Folk",
    type: "Tabla & Folk",
    fee: "₹15K–40K",
    city: "Gandhinagar",
    availability: "Available",
  },
  {
    id: 8,
    name: "Ritu Chaudhary",
    genre: "Classical",
    type: "Bharatanatyam",
    fee: "₹30K–75K",
    city: "Chennai",
    availability: "Booked",
  },
  {
    id: 9,
    name: "Rahul Mehta Band",
    genre: "Fusion",
    type: "5-piece band",
    fee: "₹1L–3L",
    city: "Ahmedabad",
    availability: "Available",
  },
  {
    id: 10,
    name: "Chetan Gadhvi",
    genre: "Devotional",
    type: "Sugam Sangeet",
    fee: "₹18K–50K",
    city: "Ahmedabad",
    availability: "Available",
  },
  {
    id: 11,
    name: "Anjali Trivedi",
    genre: "Bollywood",
    type: "Emcee & Singer",
    fee: "₹30K–1L",
    city: "Vadodara",
    availability: "Available",
  },
  {
    id: 12,
    name: "Swaranand Orchestra",
    genre: "Classical",
    type: "10-piece Orchestra",
    fee: "₹2L–8L",
    city: "Ahmedabad",
    availability: "Available",
  },
];

const BOOKINGS: {
  id: number;
  artist: string;
  client: string;
  event: string;
  date: string;
  value: number;
  status: BookingStatus;
}[] = [
  {
    id: 1,
    artist: "Falguni Mehta",
    client: "Patel Wedding",
    event: "Navratri Night",
    date: "2026-10-05",
    value: 120000,
    status: "Confirmed",
  },
  {
    id: 2,
    artist: "Komal Narang",
    client: "HDFC Corporate Event",
    event: "Annual Gala",
    date: "2026-11-20",
    value: 85000,
    status: "Contract",
  },
  {
    id: 3,
    artist: "Rahul Mehta Band",
    client: "TCS Ahmedabad",
    event: "Team Day",
    date: "2026-07-15",
    value: 180000,
    status: "Enquiry",
  },
  {
    id: 4,
    artist: "Swaranand Orchestra",
    client: "Shah Wedding",
    event: "Reception Night",
    date: "2026-12-12",
    value: 350000,
    status: "Confirmed",
  },
  {
    id: 5,
    artist: "DJ Sid Sharma",
    client: "Lakeview Resort",
    event: "NYE Party",
    date: "2026-12-31",
    value: 65000,
    status: "Contract",
  },
  {
    id: 6,
    artist: "Chetan Gadhvi",
    client: "Ambaji Trust",
    event: "Bhoomi Puja",
    date: "2026-06-22",
    value: 35000,
    status: "Completed",
  },
];

const ROYALTIES = [
  {
    id: 1,
    artist: "Falguni Mehta",
    event: "Navratri Night",
    amount: 12000,
    status: "Paid",
  },
  {
    id: 2,
    artist: "Swaranand Orchestra",
    event: "Diwali Gala 2025",
    amount: 35000,
    status: "Paid",
  },
  {
    id: 3,
    artist: "Chetan Gadhvi",
    event: "Bhoomi Puja",
    amount: 3500,
    status: "Pending",
  },
  {
    id: 4,
    artist: "Komal Narang",
    event: "HDFC Event",
    amount: 8500,
    status: "Pending",
  },
];

const STATUS_COLUMNS: BookingStatus[] = [
  "Enquiry",
  "Contract",
  "Confirmed",
  "Completed",
];
const STATUS_STYLE: Record<BookingStatus, string> = {
  Enquiry: "bg-blue-900/30 text-blue-300 border-blue-700/40",
  Contract: "bg-amber-900/30 text-amber-300 border-amber-700/40",
  Confirmed: "bg-green-900/30 text-green-300 border-green-700/40",
  Completed: "bg-muted/30 text-muted-foreground border-border",
};

const GENRE_COLORS: Record<string, string> = {
  Classical: "bg-purple-900/30 text-purple-300 border-purple-700/40",
  Bollywood: "bg-pink-900/30 text-pink-300 border-pink-700/40",
  Folk: "bg-gold-800/30 text-gold-300 border-gold-700/40",
  Fusion: "bg-cyan-900/30 text-cyan-300 border-cyan-700/40",
  Devotional: "bg-orange-900/30 text-orange-300 border-orange-700/40",
  Jazz: "bg-indigo-900/30 text-indigo-300 border-indigo-700/40",
};

export default function MusicAdminPage() {
  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1
              className="text-2xl font-bold text-gold-400"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Music & Culture Hub
            </h1>
            <p className="text-sm text-muted-foreground">
              Artist directory, bookings & royalty management
            </p>
          </div>

          {/* Artists */}
          <div>
            <h2 className="font-bold text-gold-300 mb-3">
              Artist Directory ({ARTISTS.length} Artists)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid="music.artists.table">
                <thead>
                  <tr className="border-b border-gold-800/30">
                    {[
                      "Artist",
                      "Genre",
                      "Type/Instrument",
                      "Fee Range",
                      "City",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-3 text-xs text-muted-foreground font-medium whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ARTISTS.map((a, i) => (
                    <tr
                      key={a.id}
                      className="border-b border-gold-800/10 hover:bg-gold-900/10"
                      data-ocid={`music.artist.item.${i + 1}`}
                    >
                      <td className="py-2 px-3 font-semibold text-foreground whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gold-800/40 flex items-center justify-center text-gold-400 text-xs font-bold flex-shrink-0">
                            {a.name.charAt(0)}
                          </div>
                          {a.name}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <Badge
                          className={`${GENRE_COLORS[a.genre] ?? "bg-muted/30 text-muted-foreground"} text-[10px]`}
                        >
                          {a.genre}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-muted-foreground text-xs">
                        {(a as { type?: string }).type ?? ""}
                      </td>
                      <td className="py-2 px-3 text-gold-400 font-medium">
                        {a.fee}
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {a.city}
                      </td>
                      <td className="py-2 px-3">
                        <Badge
                          className={
                            a.availability === "Available"
                              ? "bg-green-900/30 text-green-300 border-green-700/40 text-[10px]"
                              : "bg-amber-900/30 text-amber-300 border-amber-700/40 text-[10px]"
                          }
                        >
                          {a.availability}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Booking Kanban */}
          <div>
            <h2 className="font-bold text-gold-300 mb-3">Booking Workflow</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {STATUS_COLUMNS.map((status) => {
                const items = BOOKINGS.filter((b) => b.status === status);
                return (
                  <div
                    key={status}
                    className="bg-card/60 border border-gold-800/20 rounded-xl p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLE[status]}`}
                      >
                        {status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {items.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {items.map((b, i) => (
                        <div
                          key={b.id}
                          className="bg-[#06090f] border border-gold-800/20 rounded-lg p-2.5"
                          data-ocid={`music.booking.${status.toLowerCase()}.item.${i + 1}`}
                        >
                          <p className="text-xs font-semibold text-foreground">
                            {b.artist}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {b.event}
                          </p>
                          <p className="text-[10px] text-gold-400 mt-1">
                            ₹{(b.value / 1000).toFixed(0)}K · {b.date}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Royalties */}
          <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
            <h2 className="font-bold text-gold-300 mb-3">Royalty Tracker</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid="music.royalty.table">
                <thead>
                  <tr className="border-b border-gold-800/30">
                    {["Artist", "Event", "Royalty Amount", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left py-2 px-3 text-xs text-muted-foreground font-medium"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {ROYALTIES.map((r, i) => (
                    <tr
                      key={r.id}
                      className="border-b border-gold-800/10 hover:bg-gold-900/10"
                      data-ocid={`music.royalty.item.${i + 1}`}
                    >
                      <td className="py-2 px-3 font-medium text-foreground">
                        {r.artist}
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {r.event}
                      </td>
                      <td className="py-2 px-3 text-green-400 font-semibold">
                        ₹{r.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-2 px-3">
                        <Badge
                          className={
                            r.status === "Paid"
                              ? "bg-green-900/30 text-green-300 border-green-700/40"
                              : "bg-amber-900/30 text-amber-300 border-amber-700/40"
                          }
                        >
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SecureAppGate>
  );
}
