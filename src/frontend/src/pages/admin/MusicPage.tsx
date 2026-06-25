import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  ChevronLeft,
  MapPin,
  Mic,
  Music,
  Plus,
  Search,
  Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ARTISTS = [
  {
    id: 1,
    name: "Pandit Vishwanath Vyas",
    genre: "Classical",
    type: "Sarangi",
    fee: "₹85K–15L",
    city: "Ahmedabad",
    status: "Available",
    rating: 5,
  },
  {
    id: 2,
    name: "Komal Narang",
    genre: "Bollywood",
    type: "Vocalist",
    fee: "₹35K–1.2L",
    city: "Mumbai",
    status: "Available",
    rating: 4,
  },
  {
    id: 3,
    name: "Manoj Barot",
    genre: "Devotional",
    type: "Bhajan Singer",
    fee: "₹20K–60K",
    city: "Ahmedabad",
    status: "Booked",
    rating: 5,
  },
  {
    id: 4,
    name: "Falguni Mehta",
    genre: "Folk",
    type: "Garba Vocalist",
    fee: "₹40K–1.5L",
    city: "Ahmedabad",
    status: "Available",
    rating: 5,
  },
  {
    id: 5,
    name: "DJ Sid Sharma",
    genre: "Fusion",
    type: "DJ/Mixer",
    fee: "₹25K–80K",
    city: "Surat",
    status: "Available",
    rating: 4,
  },
  {
    id: 6,
    name: "Swaranand Orchestra",
    genre: "Classical",
    type: "10-piece Orchestra",
    fee: "₹2L–8L",
    city: "Ahmedabad",
    status: "Available",
    rating: 5,
  },
  {
    id: 7,
    name: "Natasha Kapoor",
    genre: "Jazz",
    type: "Pianist",
    fee: "₹50K–1.8L",
    city: "Bangalore",
    status: "Available",
    rating: 4,
  },
  {
    id: 8,
    name: "Rahul Mehta Band",
    genre: "Fusion",
    type: "5-piece Band",
    fee: "₹1L–3L",
    city: "Ahmedabad",
    status: "Available",
    rating: 4,
  },
];

const EVENTS = [
  {
    id: 1,
    name: "Navratri Mahotsav 2026",
    date: "2026-10-03",
    venue: "GMDC Ground, Ahmedabad",
    type: "Festival",
    capacity: 50000,
    artist: "Falguni Mehta",
    status: "Confirmed",
  },
  {
    id: 2,
    name: "MSTC Diwali Gala",
    date: "2026-10-22",
    venue: "Hyatt Regency, Ahmedabad",
    type: "Corporate",
    capacity: 300,
    artist: "Swaranand Orchestra",
    status: "Planning",
  },
  {
    id: 3,
    name: "Wedding – Shah Family",
    date: "2026-12-12",
    venue: "Grand Bhagwati, Ahmedabad",
    type: "Wedding",
    capacity: 800,
    artist: "Swaranand Orchestra",
    status: "Booked",
  },
  {
    id: 4,
    name: "Corporate Anniversary Night",
    date: "2026-11-20",
    venue: "Taj Skyline, Ahmedabad",
    type: "Corporate",
    capacity: 250,
    artist: "Komal Narang",
    status: "Confirmed",
  },
  {
    id: 5,
    name: "Gujarat Heritage Music Night",
    date: "2026-09-15",
    venue: "Sabarmati Riverfront",
    type: "Cultural",
    capacity: 5000,
    artist: "Multiple Artists",
    status: "Planning",
  },
];

const VENUES = [
  {
    id: 1,
    name: "GMDC Ground",
    city: "Ahmedabad",
    capacity: 100000,
    type: "Outdoor",
    rate: "₹5L/day",
    availability: "Check Calendar",
  },
  {
    id: 2,
    name: "EKA Arena",
    city: "Ahmedabad",
    capacity: 18000,
    type: "Indoor",
    rate: "₹8L/day",
    availability: "Available Jun 28",
  },
  {
    id: 3,
    name: "Hyatt Regency Ballroom",
    city: "Ahmedabad",
    capacity: 500,
    type: "Indoor",
    rate: "₹2.5L/event",
    availability: "Available",
  },
  {
    id: 4,
    name: "Grand Bhagwati Lawn",
    city: "Ahmedabad",
    capacity: 2000,
    type: "Outdoor",
    rate: "₹1.8L/event",
    availability: "Booked Dec",
  },
  {
    id: 5,
    name: "Sabarmati Riverfront Amphitheatre",
    city: "Ahmedabad",
    capacity: 8000,
    type: "Outdoor",
    rate: "₹3L/event",
    availability: "Available",
  },
];

const TABS = ["Artists", "Events", "Venues"] as const;
type Tab = (typeof TABS)[number];

export default function MusicPage() {
  const [tab, setTab] = useState<Tab>("Artists");
  const [search, setSearch] = useState("");
  const [showBook, setShowBook] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState("");

  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              to="/apps"
              className="p-2 rounded-lg border border-gold-800/30 hover:border-gold-600/50 transition-colors"
              data-ocid="music.back_button"
            >
              <ChevronLeft className="w-4 h-4 text-gold-400" />
            </Link>
            <div className="flex-1">
              <h1
                className="text-2xl font-bold text-gold-400"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Music & Cultural Services
              </h1>
              <p className="text-sm text-muted-foreground">
                Artist registry, events calendar & venue management
              </p>
            </div>
            <Button
              onClick={() => {
                setShowBook(true);
              }}
              className="bg-primary text-primary-foreground"
              data-ocid="music.add_button"
            >
              <Plus className="w-4 h-4 mr-1" /> New Booking
            </Button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Registered Artists",
                value: ARTISTS.length.toString(),
                icon: Mic,
                color: "text-gold-400",
              },
              {
                label: "Upcoming Events",
                value: EVENTS.filter(
                  (e) => e.status !== "Completed",
                ).length.toString(),
                icon: Calendar,
                color: "text-blue-400",
              },
              {
                label: "Managed Venues",
                value: VENUES.length.toString(),
                icon: MapPin,
                color: "text-green-400",
              },
              {
                label: "Confirmed Bookings",
                value: EVENTS.filter(
                  (e) => e.status === "Confirmed" || e.status === "Booked",
                ).length.toString(),
                icon: Star,
                color: "text-purple-400",
              },
            ].map((k) => (
              <div
                key={k.label}
                className="bg-card/80 border border-gold-800/30 rounded-xl p-4"
                data-ocid={`music.kpi.${k.label.toLowerCase().replace(/ /g, "_")}`}
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
                type="button"
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  tab === t
                    ? "bg-card text-gold-400 border border-b-0 border-gold-800/30"
                    : "text-muted-foreground hover:text-gold-300"
                }`}
                data-ocid={`music.tab.${t.toLowerCase()}`}
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
              data-ocid="music.search_input"
            />
          </div>

          {/* Artists */}
          {tab === "Artists" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {ARTISTS.filter(
                (a) =>
                  a.name.toLowerCase().includes(search.toLowerCase()) ||
                  a.genre.toLowerCase().includes(search.toLowerCase()),
              ).map((a, i) => (
                <div
                  key={a.id}
                  className="bg-card/80 border border-gold-800/30 rounded-xl p-4 hover:border-gold-600/40 transition-all"
                  data-ocid={`music.artist.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-foreground">
                        {a.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {a.type} · {a.genre}
                      </div>
                    </div>
                    <Badge
                      className={
                        a.status === "Available"
                          ? "bg-green-900/30 text-green-300 border-green-700/40"
                          : "bg-amber-900/30 text-amber-300 border-amber-700/40"
                      }
                    >
                      {a.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: a.rating }).map((_, idx) => (
                      <Star
                        key={`star-${a.id}-${idx}`}
                        className="w-3 h-3 fill-gold-400 text-gold-400"
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      {a.city}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gold-400">
                      {a.fee}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-gold-800/30 text-gold-400"
                        onClick={() => toast.info(`Viewing ${a.name} profile`)}
                        data-ocid={`music.artist.view_button.${i + 1}`}
                      >
                        Profile
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-primary/20 text-primary hover:bg-primary/30"
                        onClick={() => {
                          setSelectedArtist(a.name);
                          setShowBook(true);
                        }}
                        data-ocid={`music.artist.book_button.${i + 1}`}
                      >
                        Book
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Events */}
          {tab === "Events" && (
            <div className="space-y-3">
              {EVENTS.filter((e) =>
                e.name.toLowerCase().includes(search.toLowerCase()),
              ).map((e, i) => (
                <div
                  key={e.id}
                  className="bg-card/80 border border-gold-800/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3"
                  data-ocid={`music.event.item.${i + 1}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">
                        {e.name}
                      </span>
                      <Badge
                        className={
                          e.status === "Confirmed"
                            ? "bg-green-900/30 text-green-300 border-green-700/40"
                            : e.status === "Booked"
                              ? "bg-blue-900/30 text-blue-300 border-blue-700/40"
                              : "bg-amber-900/30 text-amber-300 border-amber-700/40"
                        }
                      >
                        {e.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {e.date} · {e.venue} · Capacity:{" "}
                      {e.capacity.toLocaleString()}
                    </div>
                    <div className="text-xs text-gold-400 mt-0.5">
                      Artist: {e.artist}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gold-800/30 text-gold-400 text-xs"
                      onClick={() => toast.info(`Viewing event: ${e.name}`)}
                      data-ocid={`music.event.view_button.${i + 1}`}
                    >
                      Details
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary/20 text-primary text-xs"
                      onClick={() => toast.success(`Editing event: ${e.name}`)}
                      data-ocid={`music.event.edit_button.${i + 1}`}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Venues */}
          {tab === "Venues" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VENUES.filter((v) =>
                v.name.toLowerCase().includes(search.toLowerCase()),
              ).map((v, i) => (
                <div
                  key={v.id}
                  className="bg-card/80 border border-gold-800/30 rounded-xl p-4"
                  data-ocid={`music.venue.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-foreground">
                        {v.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {v.city} · {v.type} · Capacity:{" "}
                        {v.capacity.toLocaleString()}
                      </div>
                    </div>
                    <span className="text-xs text-gold-400 font-medium">
                      {v.rate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-400">
                      {v.availability}
                    </span>
                    <Button
                      size="sm"
                      className="bg-primary/20 text-primary text-xs"
                      onClick={() => toast.success(`Booking ${v.name}`)}
                      data-ocid={`music.venue.book_button.${i + 1}`}
                    >
                      <MapPin className="w-3 h-3 mr-1" /> Book Venue
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Booking Modal */}
          {showBook && (
            <div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              data-ocid="music.booking_dialog"
            >
              <div className="bg-card border border-gold-800/40 rounded-2xl p-6 w-full max-w-md">
                <h3 className="font-serif text-lg font-bold text-gold-400 mb-4">
                  New Performance Booking
                </h3>
                <div className="space-y-3">
                  <input
                    className="w-full bg-muted/30 border border-gold-800/30 rounded-lg px-3 py-2 text-sm"
                    placeholder="Client name"
                    defaultValue=""
                    data-ocid="music.booking.client_input"
                  />
                  <input
                    className="w-full bg-muted/30 border border-gold-800/30 rounded-lg px-3 py-2 text-sm"
                    placeholder="Artist"
                    defaultValue={selectedArtist}
                    data-ocid="music.booking.artist_input"
                  />
                  <input
                    className="w-full bg-muted/30 border border-gold-800/30 rounded-lg px-3 py-2 text-sm"
                    placeholder="Event name"
                    data-ocid="music.booking.event_input"
                  />
                  <input
                    type="date"
                    className="w-full bg-muted/30 border border-gold-800/30 rounded-lg px-3 py-2 text-sm"
                    data-ocid="music.booking.date_input"
                  />
                  <div className="flex gap-2 justify-end mt-4">
                    <Button
                      variant="outline"
                      className="border-gold-800/30"
                      onClick={() => {
                        setShowBook(false);
                        setSelectedArtist("");
                      }}
                      data-ocid="music.booking.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-primary text-primary-foreground"
                      onClick={() => {
                        toast.success("Booking created!");
                        setShowBook(false);
                        setSelectedArtist("");
                      }}
                      data-ocid="music.booking.submit_button"
                    >
                      Create Booking
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
