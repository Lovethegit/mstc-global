import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Download,
  Mail,
  Mic,
  Music,
  Phone,
  Radio,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

const ARTISTS = [
  {
    id: 1,
    name: "Kavya Joshi",
    genre: "Classical Vocal",
    genreKey: "Classical",
    type: "Solo Artist",
    city: "Ahmedabad",
    events: 14,
    status: "Available",
    bio: "Renowned Hindustani classical vocalist trained under Pt. Rajan Mishra tradition. Performs at sabhas and cultural events across Gujarat.",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Ramesh Trivedi",
    genre: "Tabla",
    genreKey: "Classical",
    type: "Instrumentalist",
    city: "Ahmedabad",
    events: 22,
    status: "Available",
    bio: "Master tabla player, 30+ years of performance experience. Accompanist for several national-level vocalists.",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Sunita Bhatt",
    genre: "Garba / Dandiya",
    genreKey: "Folk",
    type: "Group Lead",
    city: "Vadodara",
    events: 38,
    status: "Available",
    bio: "Leading Garba performer and choreographer for Navratri festivals and corporate events across Gujarat.",
    rating: 4.9,
  },
  {
    id: 4,
    name: "DJ Harshit Vyas",
    genre: "Bollywood / EDM",
    genreKey: "Bollywood",
    type: "DJ",
    city: "Ahmedabad",
    events: 45,
    status: "Available",
    bio: "Top-ranked Bollywood DJ in Ahmedabad, specialising in weddings, corporate parties, and sangeet events.",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Bhajan Mandal Prabhu",
    genre: "Devotional",
    genreKey: "Devotional",
    type: "Group (8 members)",
    city: "Ahmedabad",
    events: 19,
    status: "Available",
    bio: "Traditional bhajan and kirtan group performing at temples, religious events, and MSTC cultural festivals.",
    rating: 4.8,
  },
  {
    id: 6,
    name: "Priya Raval",
    genre: "Semi-Classical",
    genreKey: "Semi-Classical",
    type: "Solo Artist",
    city: "Surat",
    events: 11,
    status: "On Tour",
    bio: "Semi-classical vocalist and ghazal singer. Performed at Ahmedabad Literary Festival and Surat Cultural Nights.",
    rating: 4.6,
  },
  {
    id: 7,
    name: "Manthan Patel",
    genre: "Bollywood Acoustic",
    genreKey: "Bollywood",
    type: "Duo",
    city: "Ahmedabad",
    events: 28,
    status: "Available",
    bio: "Acoustic Bollywood duo delivering live music for corporate events, weddings, and private celebrations.",
    rating: 4.7,
  },
  {
    id: 8,
    name: "Shyamal & Saumil",
    genre: "Folk Fusion",
    genreKey: "Folk",
    type: "Duo",
    city: "Ahmedabad",
    events: 16,
    status: "Available",
    bio: "Award-winning folk fusion duo blending Gujarati, Rajasthani, and contemporary elements. Widely recognised for Navratri performances.",
    rating: 4.8,
  },
];

const PRODUCTIONS = [
  {
    id: 1,
    title: "Navratri Mahotsav 2025",
    type: "Live Event",
    date: "02–11 Oct 2025",
    venue: "GMDC Ground, Ahmedabad",
    status: "Planning",
    budget: 3500000,
  },
  {
    id: 2,
    title: "Lok Utsav – Gujarat Folk Music",
    type: "Album Production",
    date: "Aug 2025",
    venue: "MSTC Studios",
    status: "Recording",
    budget: 850000,
  },
  {
    id: 3,
    title: "Corporate Cultural Evening",
    type: "Corporate Event",
    date: "15 Jul 2025",
    venue: "Hyatt Regency, Ahmedabad",
    status: "Confirmed",
    budget: 420000,
  },
  {
    id: 4,
    title: "Sanskriti – Annual Stage Show",
    type: "Stage Show",
    date: "20 Dec 2025",
    venue: "Tagore Hall, Ahmedabad",
    status: "Upcoming",
    budget: 1200000,
  },
];

const BOOKINGS = [
  {
    id: 1,
    event: "Wedding Reception – Patel Family",
    artist: "DJ Harshit Vyas + Kavya Joshi",
    date: "29 Jun 2025",
    venue: "Marriott, Ahmedabad",
    status: "Confirmed",
  },
  {
    id: 2,
    event: "Navratri Corporate Nite – Torrent Pharma",
    artist: "Sunita Bhatt Group",
    date: "04 Oct 2025",
    venue: "AMA Hall, Ahmedabad",
    status: "Pending",
  },
  {
    id: 3,
    event: "Private Bhajan Evening – Shah Family",
    artist: "Bhajan Mandal Prabhu",
    date: "19 Jul 2025",
    venue: "Residence, Satellite",
    status: "Confirmed",
  },
  {
    id: 4,
    event: "Product Launch – Adani Group",
    artist: "Kavya Joshi + Manthan Patel",
    date: "12 Aug 2025",
    venue: "Grand Hyatt, Ahmedabad",
    status: "Negotiation",
  },
];

const GENRES = [
  "All",
  "Classical",
  "Semi-Classical",
  "Folk",
  "Bollywood",
  "Devotional",
];

const genreColors: Record<string, string> = {
  Classical: "bg-purple-500/15 text-purple-300",
  "Semi-Classical": "bg-blue-500/15 text-blue-300",
  Folk: "bg-amber-500/15 text-amber-300",
  Bollywood: "bg-pink-500/15 text-pink-300",
  Devotional: "bg-orange-500/15 text-orange-300",
};

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${(n / 1000).toFixed(0)}K`;
}

export default function MusicCulturePage() {
  const [genreFilter, setGenreFilter] = useState("All");
  const [bookingGenre, setBookingGenre] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");

  const filteredArtists =
    genreFilter === "All"
      ? ARTISTS
      : ARTISTS.filter((a) => a.genreKey === genreFilter);

  return (
    <div className="min-h-screen bg-[#06090f] text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-gold-800/30 px-4 py-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Music className="w-5 h-5 text-gold-400" />
                <span className="text-xs text-gold-500 font-sans uppercase tracking-widest">
                  MSTC GLOBAL
                </span>
              </div>
              <h1
                className="text-2xl md:text-3xl font-bold text-gold-300"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Music &amp; Culture Hub
              </h1>
              <p className="text-sm text-muted-foreground font-sans mt-0.5">
                MSTC Creative Division ·{" "}
                <span className="text-gold-500">Ahmedabad &amp; Gujarat</span>
              </p>
            </div>
            <Button
              className="h-11 px-5 bg-gold-500/10 border border-gold-600/40 text-gold-300 hover:bg-gold-500/20"
              data-ocid="music.brochure_button"
            >
              <Download className="w-4 h-4 mr-2" />
              Artists Brochure
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
        {/* Stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          data-ocid="music.stats"
        >
          {[
            {
              label: "Artists",
              value: "34",
              icon: Mic,
              color: "text-gold-400",
            },
            {
              label: "Productions",
              value: "18",
              icon: Radio,
              color: "text-blue-400",
            },
            {
              label: "Events",
              value: "24",
              icon: Calendar,
              color: "text-pink-400",
            },
            {
              label: "Revenue",
              value: "₹28L",
              icon: TrendingUp,
              color: "text-green-400",
            },
          ].map((s, i) => (
            <div
              key={s.label}
              className="bg-card border border-gold-800/30 rounded-xl p-4 flex flex-col gap-1"
              data-ocid={`music.stat.item.${i + 1}`}
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

        {/* Artist Roster */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2
              className="font-bold text-gold-300 text-lg"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Artist Roster
            </h2>
            <div
              className="flex flex-wrap gap-2"
              data-ocid="music.genre_filter"
            >
              {GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenreFilter(g)}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all min-h-[36px] ${
                    genreFilter === g
                      ? "bg-gold-500/20 border border-gold-500/60 text-gold-300"
                      : "border border-gold-800/30 text-muted-foreground hover:border-gold-700/50"
                  }`}
                  data-ocid={`music.filter.${g.toLowerCase()}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArtists.map((a, i) => (
              <div
                key={a.id}
                className="bg-card border border-gold-800/30 rounded-xl p-5 flex flex-col gap-2 hover:border-gold-600/40 transition-colors"
                data-ocid={`music.artist.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div
                      className="font-semibold text-foreground"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      {a.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-sans">
                      {a.type} · {a.city}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                      a.status === "Available"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
                <Badge
                  className={`${
                    genreColors[a.genreKey] ?? "bg-muted text-muted-foreground"
                  } border-0 text-[10px] w-fit`}
                >
                  {a.genre}
                </Badge>
                <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                  {a.bio}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= Math.floor(a.rating)
                            ? "text-gold-400 fill-gold-400"
                            : "text-muted"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      {a.rating}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-sans">
                    {a.events} events
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productions */}
        <div className="bg-card border border-gold-800/30 rounded-xl p-5">
          <h2
            className="font-bold text-gold-300 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Productions &amp; Events
          </h2>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm font-sans min-w-[560px]">
              <thead>
                <tr className="border-b border-gold-800/20">
                  {[
                    "Production",
                    "Type",
                    "Date",
                    "Venue",
                    "Status",
                    "Budget",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 px-2 text-muted-foreground text-xs font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRODUCTIONS.map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-b border-gold-800/10 hover:bg-muted/20"
                    data-ocid={`music.production.item.${i + 1}`}
                  >
                    <td className="py-2.5 px-2 text-foreground font-medium">
                      {p.title}
                    </td>
                    <td className="py-2.5 px-2 text-muted-foreground">
                      {p.type}
                    </td>
                    <td className="py-2.5 px-2 text-muted-foreground">
                      {p.date}
                    </td>
                    <td className="py-2.5 px-2 text-muted-foreground">
                      {p.venue}
                    </td>
                    <td className="py-2.5 px-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          p.status === "Confirmed"
                            ? "bg-green-500/15 text-green-400"
                            : p.status === "Recording"
                              ? "bg-blue-500/15 text-blue-400"
                              : p.status === "Planning"
                                ? "bg-amber-500/15 text-amber-400"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-gold-300 font-medium text-right">
                      {fmt(p.budget)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bookings */}
        <div
          className="bg-card border border-gold-800/30 rounded-xl p-5"
          data-ocid="music.bookings_section"
        >
          <h2
            className="font-bold text-gold-300 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Event Bookings
          </h2>
          <div className="space-y-3">
            {BOOKINGS.map((b, i) => (
              <div
                key={b.id}
                className="bg-background border border-gold-800/20 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                data-ocid={`music.booking.item.${i + 1}`}
              >
                <div className="flex-1">
                  <div className="font-medium text-foreground text-sm">
                    {b.event}
                  </div>
                  <div className="text-xs text-gold-500 font-sans mt-0.5">
                    {b.artist}
                  </div>
                  <div className="text-xs text-muted-foreground font-sans">
                    {b.date} · {b.venue}
                  </div>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full self-start sm:self-auto ${
                    b.status === "Confirmed"
                      ? "bg-green-500/15 text-green-400"
                      : b.status === "Pending"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-blue-500/15 text-blue-400"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Enquiry Form */}
        <div
          className="bg-card border border-gold-800/30 rounded-xl p-5"
          data-ocid="music.enquiry_section"
        >
          <h2
            className="font-bold text-gold-300 mb-1"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Book an Artist / Cultural Programme
          </h2>
          <p className="text-xs text-muted-foreground font-sans mb-4">
            Select your genre preference and event date to get availability and
            pricing.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs text-muted-foreground font-sans"
                htmlFor="genre-select"
              >
                Genre / Type
              </label>
              <select
                id="genre-select"
                className="h-11 px-3 bg-background border border-gold-800/30 rounded-lg text-sm text-foreground font-sans focus:outline-none focus:border-gold-500/60"
                value={bookingGenre}
                onChange={(e) => setBookingGenre(e.target.value)}
                data-ocid="music.booking.genre_select"
              >
                <option value="">Select genre…</option>
                {GENRES.filter((g) => g !== "All").map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs text-muted-foreground font-sans"
                htmlFor="event-date"
              >
                Event Date
              </label>
              <input
                id="event-date"
                type="date"
                className="h-11 px-3 bg-background border border-gold-800/30 rounded-lg text-sm text-foreground font-sans focus:outline-none focus:border-gold-500/60"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                data-ocid="music.booking.date_input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs text-muted-foreground font-sans"
                htmlFor="event-msg"
              >
                Event Details
              </label>
              <input
                id="event-msg"
                type="text"
                placeholder="Wedding, Corporate, Festival…"
                className="h-11 px-3 bg-background border border-gold-800/30 rounded-lg text-sm text-foreground font-sans focus:outline-none focus:border-gold-500/60 placeholder:text-muted-foreground"
                value={bookingMsg}
                onChange={(e) => setBookingMsg(e.target.value)}
                data-ocid="music.booking.details_input"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button
              className="h-11 px-5 bg-gold-500/10 border border-gold-600/40 text-gold-300 hover:bg-gold-500/20"
              data-ocid="music.booking.submit_button"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Enquiry
            </Button>
            <a
              href="tel:+919512609016"
              className="inline-flex items-center gap-2 h-11 px-5 bg-green-500/10 border border-green-600/40 text-green-300 hover:bg-green-500/20 rounded-md text-sm font-sans transition-colors"
              data-ocid="music.booking.call_button"
            >
              <Phone className="w-4 h-4" />
              +91 9512609016
            </a>
          </div>
        </div>

        {/* Genre Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {GENRES.filter((g) => g !== "All").map((g, i) => {
            const count = ARTISTS.filter((a) => a.genreKey === g).length;
            return (
              <div
                key={g}
                className="bg-card border border-gold-800/20 rounded-xl p-4 text-center"
                data-ocid={`music.genre_stat.item.${i + 1}`}
              >
                <div className="text-2xl font-bold text-gold-300 mb-1">
                  {count}
                </div>
                <div className="text-xs text-muted-foreground font-sans">
                  {g}
                </div>
                <div className="text-[10px] text-gold-500 font-sans">
                  Artists
                </div>
              </div>
            );
          })}
        </div>

        {/* Unused state suppressor */}
        {(bookingGenre || bookingDate || bookingMsg) && null}
      </div>
    </div>
  );
}
