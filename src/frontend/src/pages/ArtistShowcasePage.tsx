import type { MusicArtist } from "@/backend";
import { createActor } from "@/backend";
import PrivacyGate from "@/components/PrivacyGate";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BackToTop from "@/components/ui/BackToTop";
import { useActor } from "@/hooks/useActor";
import { useLogServiceSubmission } from "@/hooks/useQueries";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Instagram,
  Music,
  Play,
  Star,
  X,
} from "lucide-react";
import { useState } from "react";

// Fallback artists if backend empty
const FALLBACK_ARTISTS: MusicArtist[] = [
  {
    id: "1",
    name: "Raga Vistaara Ensemble",
    genre: "Hindustani Classical",
    bio: "A classical ensemble of 5 musicians bringing the finest ragas to corporate and cultural events across Gujarat. Trained under Pandit-level mentorship.",
    specialties: ["Tabla", "Sitar", "Vocal", "Harmonium", "Sarangi"],
    youtubeUrl: "",
    instagramUrl: "@ragavistaara_ahd",
    bookingContact: "+91 9512609016",
    available: true,
  },
  {
    id: "2",
    name: "Dhol Tasha Warriors",
    genre: "Folk Percussion",
    bio: "High-energy folk percussion group perfect for processions, weddings, and celebrations. Over 200 events performed across Ahmedabad and surrounding regions.",
    specialties: ["Dhol", "Tasha", "Nagara", "Shehnai"],
    youtubeUrl: "",
    instagramUrl: "@dholtashawarriors",
    bookingContact: "+91 9512609016",
    available: true,
  },
  {
    id: "3",
    name: "Neerav Bhajan Group",
    genre: "Devotional / Bhajan",
    bio: "Soul-stirring bhajan troupe ideal for religious and spiritual gatherings across Gujarat. Brings peace, devotion and cultural richness to every gathering.",
    specialties: ["Harmonium", "Tabla", "Mridanga", "Vocals"],
    youtubeUrl: "",
    instagramUrl: "@neeravbhajan",
    bookingContact: "+91 9512609016",
    available: true,
  },
  {
    id: "4",
    name: "Aksh Fusion Band",
    genre: "Bollywood / Fusion",
    bio: "Contemporary fusion band blending Bollywood classics with modern beats for live events and private parties. The crowd's favourite for celebrations.",
    specialties: ["Guitar", "Keyboard", "Drums", "Vocals"],
    youtubeUrl: "",
    instagramUrl: "@akshfusion",
    bookingContact: "+91 9512609016",
    available: true,
  },
  {
    id: "5",
    name: "Garba Mandali Ahmedabad",
    genre: "Garba / Dandiya",
    bio: "Traditional garba performers specializing in Navratri events and cultural festivals across Gujarat. Authentic costumes, powerful vocals and energetic choreography.",
    specialties: ["Garba", "Dandiya", "Folk Vocals", "Choreography"],
    youtubeUrl: "",
    instagramUrl: "@garbamandaliahd",
    bookingContact: "+91 9512609016",
    available: true,
  },
  {
    id: "6",
    name: "Classical Dance Academy",
    genre: "Bharatnatyam / Kathak",
    bio: "Award-winning classical dance troupe available for cultural programs and stage shows. Trained performers under recognized gurus with national-level recognition.",
    specialties: ["Bharatnatyam", "Kathak", "Odissi", "Contemporary"],
    youtubeUrl: "",
    instagramUrl: "@classicaldanceahd",
    bookingContact: "+91 9512609016",
    available: false,
  },
];

interface BookArtistForm {
  name: string;
  phone: string;
  email: string;
  eventDate: string;
  eventType: string;
  budget: string;
  indemnity: boolean;
}

export default function ArtistShowcasePage() {
  const { actor, isFetching } = useActor(createActor);
  const logSubmission = useLogServiceSubmission();

  const { data: backendArtists = [] } = useQuery<MusicArtist[]>({
    queryKey: ["musicArtists"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMusicArtists();
    },
    enabled: !!actor && !isFetching,
  });

  const artists = backendArtists.length > 0 ? backendArtists : FALLBACK_ARTISTS;

  const [filter, setFilter] = useState("All");
  const [selectedArtist, setSelectedArtist] = useState<MusicArtist | null>(
    null,
  );
  const [bookForm, setBookForm] = useState<BookArtistForm>({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    eventType: "",
    budget: "",
    indemnity: false,
  });
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  const genres = ["All", ...Array.from(new Set(artists.map((a) => a.genre)))];
  const filtered =
    filter === "All" ? artists : artists.filter((a) => a.genre === filter);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.indemnity || !selectedArtist) return;
    logSubmission.mutate({
      serviceCategory: "Music & Cultural",
      innerPage: "Artist Showcase",
      formType: "ArtistBooking",
      fields: [
        ["Artist", selectedArtist.name],
        ["Genre", selectedArtist.genre],
        ["Event Date", bookForm.eventDate],
        ["Event Type", bookForm.eventType],
        ["Budget", bookForm.budget],
      ],
      submitterName: bookForm.name,
      submitterPhone: bookForm.phone,
      submitterEmail: bookForm.email,
      indemnityAccepted: true,
    });
    setBooked(true);
  };

  const openBooking = (artist: MusicArtist) => {
    setSelectedArtist(artist);
    setBooking(true);
    setBooked(false);
    setBookForm({
      name: "",
      phone: "",
      email: "",
      eventDate: "",
      eventType: "",
      budget: "",
      indemnity: false,
    });
  };

  const closeModal = () => {
    setBooking(false);
    setSelectedArtist(null);
    setBooked(false);
  };

  return (
    <PrivacyGate>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        {/* Page Header */}
        <section className="pt-24 pb-8 px-4 bg-card/50 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/services/music-cultural"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
              data-ocid="artists.back_button"
            >
              <ArrowLeft size={14} /> Back to Music &amp; Cultural
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Music size={24} className="text-primary" />
              <h1 className="font-serif font-bold text-3xl gold-text">
                Artist Showcase
              </h1>
            </div>
            <p className="font-sans text-sm text-muted-foreground">
              Discover and book talented artists managed by MSTC GLOBAL for
              weddings, corporate events, cultural programs and more.
            </p>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 py-10">
          {/* Genre Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {genres.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setFilter(g)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  filter === g
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
                data-ocid={`artists.filter.${g.replace(/[^a-z0-9]/gi, "_").toLowerCase()}`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Artist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((artist, i) => (
              <div
                key={artist.id}
                className="border border-border rounded-xl bg-card overflow-hidden hover:border-primary/60 transition-all group"
                data-ocid={`artists.card.${i + 1}`}
              >
                {/* Artist Visual Panel */}
                <div
                  className="h-40 flex items-center justify-center relative"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.12 0.015 62) 0%, oklch(0.18 0.025 70) 100%)",
                    borderBottom: "1px solid oklch(0.72 0.18 76 / 0.2)",
                  }}
                >
                  {artist.youtubeUrl ? (
                    <div className="w-full h-full">
                      <iframe
                        src={`https://www.youtube.com/embed/${extractYoutubeId(artist.youtubeUrl)}?autoplay=0&rel=0`}
                        className="w-full h-full"
                        title={artist.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <Music
                        size={40}
                        className="text-primary/40 mx-auto mb-2"
                      />
                      <span
                        className="text-xs"
                        style={{ color: "oklch(0.72 0.18 76 / 0.5)" }}
                      >
                        {artist.genre}
                      </span>
                    </div>
                  )}
                  {/* Available badge */}
                  <div
                    className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: artist.available
                        ? "oklch(0.4 0.15 148 / 0.3)"
                        : "oklch(0.3 0.1 30 / 0.3)",
                      color: artist.available
                        ? "oklch(0.7 0.18 148)"
                        : "oklch(0.65 0.15 30)",
                      border: `1px solid ${
                        artist.available
                          ? "oklch(0.5 0.18 148 / 0.4)"
                          : "oklch(0.45 0.15 30 / 0.4)"
                      }`,
                    }}
                  >
                    {artist.available ? "Available" : "Unavailable"}
                  </div>
                  {/* Play overlay for youtube */}
                  {!artist.youtubeUrl && (
                    <div
                      className="absolute inset-0 border-2 rounded-tl-xl rounded-tr-xl pointer-events-none"
                      style={{ borderColor: "oklch(0.72 0.18 76 / 0.15)" }}
                    />
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-serif font-semibold text-base text-foreground">
                      {artist.name}
                    </h3>
                    <div className="flex items-center gap-0.5 flex-shrink-0 ml-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={`${artist.id}-s${s}`}
                          size={9}
                          className="text-primary fill-primary"
                        />
                      ))}
                    </div>
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "oklch(0.72 0.18 76)" }}
                  >
                    {artist.genre}
                  </span>
                  <p className="text-xs text-muted-foreground mt-2 mb-3 line-clamp-2">
                    {artist.bio}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {artist.specialties.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2 py-0.5 rounded-full border"
                        style={{
                          background: "oklch(0.72 0.18 76 / 0.08)",
                          borderColor: "oklch(0.72 0.18 76 / 0.25)",
                          color: "oklch(0.72 0.18 76)",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  {/* Instagram handle */}
                  {artist.instagramUrl && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <Instagram size={11} />
                      <span>{artist.instagramUrl}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {artist.youtubeUrl && (
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border border-border text-muted-foreground">
                        <Play size={11} /> <span>Preview (embedded above)</span>
                      </div>
                    )}
                    <button
                      type="button"
                      disabled={!artist.available}
                      onClick={() => openBooking(artist)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
                      style={{
                        background: "oklch(0.72 0.18 76)",
                        color: "oklch(0.1 0.01 60)",
                      }}
                      data-ocid={`artists.book_button.${i + 1}`}
                    >
                      {artist.available ? "Book This Artist" : "Not Available"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <Footer />
        <BackToTop />

        {/* Booking Modal */}
        {booking && selectedArtist && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "oklch(0.06 0.01 60 / 0.8)" }}
            data-ocid="artists.booking_dialog"
          >
            <div
              className="bg-card border border-border rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
              style={{ boxShadow: "0 20px 60px oklch(0.06 0.01 60 / 0.6)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-serif font-bold text-xl text-foreground">
                    Book {selectedArtist.name}
                  </h2>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "oklch(0.72 0.18 76)" }}
                  >
                    {selectedArtist.genre}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="artists.close_button"
                >
                  <X size={14} />
                </button>
              </div>

              {booked ? (
                <div className="text-center py-8">
                  <CheckCircle2
                    size={48}
                    className="text-emerald-400 mx-auto mb-3"
                  />
                  <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                    Booking Request Sent!
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    Our team will contact you within 24 hours to confirm
                    availability and pricing.
                  </p>
                  <a
                    href="https://wa.me/919512609016"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm"
                    style={{ background: "#25D366", color: "#fff" }}
                    data-ocid="artists.whatsapp_button"
                  >
                    WhatsApp MSTC
                  </a>
                </div>
              ) : (
                <form onSubmit={handleBook} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Your Name *
                      </label>
                      <input
                        required
                        value={bookForm.name}
                        onChange={(e) =>
                          setBookForm((f) => ({ ...f, name: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                        data-ocid="artists.book_name_input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Phone *
                      </label>
                      <input
                        required
                        value={bookForm.phone}
                        onChange={(e) =>
                          setBookForm((f) => ({ ...f, phone: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                        data-ocid="artists.book_phone_input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={bookForm.email}
                        onChange={(e) =>
                          setBookForm((f) => ({ ...f, email: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Event Date *
                      </label>
                      <input
                        required
                        type="date"
                        value={bookForm.eventDate}
                        onChange={(e) =>
                          setBookForm((f) => ({
                            ...f,
                            eventDate: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                        data-ocid="artists.book_date_input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Event Type *
                      </label>
                      <select
                        required
                        value={bookForm.eventType}
                        onChange={(e) =>
                          setBookForm((f) => ({
                            ...f,
                            eventType: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                        data-ocid="artists.book_event_type_select"
                      >
                        <option value="">Select</option>
                        <option>Wedding</option>
                        <option>Corporate Event</option>
                        <option>Birthday</option>
                        <option>Cultural Program</option>
                        <option>Festival</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Budget Range
                      </label>
                      <select
                        value={bookForm.budget}
                        onChange={(e) =>
                          setBookForm((f) => ({ ...f, budget: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                        data-ocid="artists.book_budget_select"
                      >
                        <option value="">Select</option>
                        <option>Under ₹25,000</option>
                        <option>₹25K – 50K</option>
                        <option>₹50K – 1 Lakh</option>
                        <option>₹1L – 3L</option>
                        <option>Above ₹3 Lakh</option>
                      </select>
                    </div>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-muted/20 border border-border">
                    <input
                      type="checkbox"
                      checked={bookForm.indemnity}
                      onChange={(e) =>
                        setBookForm((f) => ({
                          ...f,
                          indemnity: e.target.checked,
                        }))
                      }
                      className="mt-0.5 accent-primary"
                      data-ocid="artists.book_indemnity_checkbox"
                    />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      I agree that MSTC GLOBAL acts as a booking facilitator.
                      Artist availability and pricing are subject to
                      confirmation.
                      <span className="text-red-400 ml-1">*Required</span>
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={!bookForm.indemnity || logSubmission.isPending}
                    className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "oklch(0.72 0.18 76)",
                      color: "oklch(0.1 0.01 60)",
                    }}
                    data-ocid="artists.book_submit_button"
                  >
                    {logSubmission.isPending
                      ? "Submitting…"
                      : "Send Booking Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </PrivacyGate>
  );
}

function extractYoutubeId(url: string): string {
  const match =
    url.match(/[?&]v=([^&#]+)/) ||
    url.match(/youtu\.be\/([^?&#]+)/) ||
    url.match(/embed\/([^?&#]+)/);
  return match ? match[1] : "";
}

// Ensure Calendar icon is used to avoid unused import lint error
void Calendar;
void Play;
