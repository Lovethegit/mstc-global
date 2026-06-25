import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Globe,
  MapPin,
  Plane,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

const PACKAGES = [
  {
    id: 1,
    destination: "Rann of Kutch",
    title: "Rann Utsav Festival Special",
    duration: "3N/4D",
    price: 18500,
    minPax: 2,
    highlights: [
      "White Rann at Sunrise",
      "Cultural Village Tour",
      "Handicraft Market",
      "AC Resort Stay",
    ],
    includes: "Transfers, Accommodation, Breakfast & Dinner, Sightseeing",
    rating: 4.8,
    bookingsCount: 18,
    category: "Heritage",
  },
  {
    id: 2,
    destination: "Gir National Park",
    title: "Gir Asiatic Lion Safari",
    duration: "2N/3D",
    price: 12000,
    minPax: 2,
    highlights: [
      "Jeep Safari (2 entries)",
      "Forest Dept. Guide",
      "Gir Interpretation Zone",
      "Jungle Lodge",
    ],
    includes: "Accommodation, All Meals, Safari Entry, Guide",
    rating: 4.9,
    bookingsCount: 24,
    category: "Wildlife",
  },
  {
    id: 3,
    destination: "Somnath & Dwarka",
    title: "Somnath–Dwarka Pilgrimage",
    duration: "4N/5D",
    price: 22000,
    minPax: 4,
    highlights: [
      "Somnath Jyotirlinga Darshan",
      "Dwarkadhish Temple",
      "Beyt Dwarka Island",
      "Nageshwar Mahadev",
    ],
    includes: "AC Bus / Cab, Accommodation, Breakfast, Temple Guide",
    rating: 4.7,
    bookingsCount: 31,
    category: "Pilgrimage",
  },
  {
    id: 4,
    destination: "Ahmedabad",
    title: "Ahmedabad Heritage Walk",
    duration: "1 Day",
    price: 2500,
    minPax: 1,
    highlights: [
      "Old City Heritage Pols",
      "Sidi Saiyyed Mosque",
      "Sabarmati Ashram",
      "Law Garden Market",
    ],
    includes: "Expert Guide, E-rickshaw, Lunch, Entry Tickets",
    rating: 4.6,
    bookingsCount: 47,
    category: "Heritage",
  },
  {
    id: 5,
    destination: "Goa",
    title: "Goa Beach Holiday",
    duration: "4N/5D",
    price: 38000,
    minPax: 2,
    highlights: [
      "North & South Goa Beaches",
      "Spice Plantation Tour",
      "Old Goa Churches",
      "Water Sports Package",
    ],
    includes: "Flights, Hotel, Breakfast, Airport Transfers",
    rating: 4.7,
    bookingsCount: 15,
    category: "Beach",
  },
  {
    id: 6,
    destination: "Saputara & Dang",
    title: "Gujarat Hill Station Escape",
    duration: "2N/3D",
    price: 10500,
    minPax: 2,
    highlights: [
      "Saputara Lake Boating",
      "Sunrise Point",
      "Tribal Village Visit",
      "Girmal Waterfalls",
    ],
    includes: "AC Cab from Ahmedabad, Stay, Breakfast",
    rating: 4.5,
    bookingsCount: 12,
    category: "Nature",
  },
];

const INTERNATIONAL = [
  {
    id: 1,
    destination: "Dubai, UAE",
    duration: "4N/5D",
    price: 85000,
    highlights: [
      "Burj Khalifa Entry",
      "Desert Safari",
      "Dubai Mall",
      "Marina Cruise",
    ],
    visa: "On Arrival (Indian passport)",
    bookingsCount: 8,
  },
  {
    id: 2,
    destination: "Singapore",
    duration: "4N/5D",
    price: 92000,
    highlights: [
      "Universal Studios",
      "Gardens by the Bay",
      "Sentosa",
      "Marina Bay Sands",
    ],
    visa: "e-Visa (₹5,800 extra)",
    bookingsCount: 6,
  },
  {
    id: 3,
    destination: "Thailand (Bangkok + Phuket)",
    duration: "5N/6D",
    price: 78000,
    highlights: [
      "Grand Palace Bangkok",
      "Phi Phi Islands",
      "Elephant Sanctuary",
      "Floating Market",
    ],
    visa: "Visa on Arrival",
    bookingsCount: 11,
  },
];

const BOOKINGS_TABLE = [
  {
    id: 1,
    client: "Mehta Family (4 pax)",
    pkg: "Gir National Park Safari",
    date: "14 Jun 2025",
    amount: 48000,
    status: "Confirmed",
  },
  {
    id: 2,
    client: "Rajan Shah (2 pax)",
    pkg: "Rann Utsav Festival",
    date: "25 Nov 2025",
    amount: 37000,
    status: "Advance Paid",
  },
  {
    id: 3,
    client: "Patel Group (8 pax)",
    pkg: "Somnath–Dwarka Pilgrimage",
    date: "02 Jul 2025",
    amount: 176000,
    status: "Confirmed",
  },
  {
    id: 4,
    client: "Corporate – TCS Ahmedabad",
    pkg: "Dubai 4N/5D",
    date: "20 Sep 2025",
    amount: 1020000,
    status: "Negotiation",
  },
  {
    id: 5,
    client: "Joshi Family (3 pax)",
    pkg: "Ahmedabad Heritage Walk",
    date: "08 Jun 2025",
    amount: 7500,
    status: "Completed",
  },
];

const categoryColors: Record<string, string> = {
  Heritage: "bg-amber-500/15 text-amber-300",
  Wildlife: "bg-green-500/15 text-green-300",
  Pilgrimage: "bg-orange-500/15 text-orange-300",
  Beach: "bg-cyan-500/15 text-cyan-300",
  Nature: "bg-emerald-500/15 text-emerald-300",
};

function fmtPrice(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

export default function TourismPlannerPage() {
  const [dest, setDest] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [travelDate, setTravelDate] = useState("");
  const [quote, setQuote] = useState<string | null>(null);

  const handleQuote = () => {
    if (!dest || !travelDate) return;
    const selectedPkg = PACKAGES.find((p) => p.destination === dest);
    const perHead = selectedPkg ? selectedPkg.price : 15000;
    const total = perHead * travelers;
    setQuote(
      `Estimated quote for ${travelers} traveller${
        travelers > 1 ? "s" : ""
      } to ${dest}: ₹${total.toLocaleString("en-IN")} (approx.). Our team will call within 2 hours to confirm and customise your itinerary.`,
    );
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-gold-800/30 px-4 py-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Plane className="w-5 h-5 text-gold-400" />
            <span className="text-xs text-gold-500 font-sans uppercase tracking-widest">
              MSTC GLOBAL
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold text-gold-300"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Tourism Planner
          </h1>
          <p className="text-sm text-muted-foreground font-sans mt-0.5">
            MSTC Travel Division ·{" "}
            <span className="text-gold-500">
              Domestic &amp; International Packages
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
        {/* Stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          data-ocid="tourism.stats"
        >
          {[
            {
              label: "Tour Packages",
              value: "28",
              icon: Globe,
              color: "text-gold-400",
            },
            {
              label: "Bookings This Month",
              value: "47",
              icon: Calendar,
              color: "text-blue-400",
            },
            {
              label: "Revenue",
              value: "₹12.8L",
              icon: TrendingUp,
              color: "text-green-400",
            },
            {
              label: "Client Rating",
              value: "4.7/5",
              icon: Star,
              color: "text-amber-400",
            },
          ].map((s, i) => (
            <div
              key={s.label}
              className="bg-card border border-gold-800/30 rounded-xl p-4 flex flex-col gap-1"
              data-ocid={`tourism.stat.item.${i + 1}`}
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

        {/* Trip Planner Tool */}
        <div
          className="bg-card border border-gold-800/30 rounded-xl p-5"
          data-ocid="tourism.planner_section"
        >
          <h2
            className="font-bold text-gold-300 mb-1"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Instant Trip Planner
          </h2>
          <p className="text-xs text-muted-foreground font-sans mb-4">
            Select destination, dates &amp; travellers to get an instant quote.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs text-muted-foreground font-sans"
                htmlFor="dest-select"
              >
                Destination
              </label>
              <select
                id="dest-select"
                className="h-11 px-3 bg-background border border-gold-800/30 rounded-lg text-sm text-foreground font-sans focus:outline-none focus:border-gold-500/60"
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                data-ocid="tourism.planner.dest_select"
              >
                <option value="">Select destination…</option>
                {PACKAGES.map((p) => (
                  <option key={p.id} value={p.destination}>
                    {p.destination}
                  </option>
                ))}
                {INTERNATIONAL.map((p) => (
                  <option key={p.id} value={p.destination}>
                    {p.destination}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs text-muted-foreground font-sans"
                htmlFor="travel-date"
              >
                Travel Date
              </label>
              <input
                id="travel-date"
                type="date"
                className="h-11 px-3 bg-background border border-gold-800/30 rounded-lg text-sm text-foreground font-sans focus:outline-none focus:border-gold-500/60"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                data-ocid="tourism.planner.date_input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs text-muted-foreground font-sans"
                htmlFor="traveler-count"
              >
                Travellers
              </label>
              <input
                id="traveler-count"
                type="number"
                min={1}
                max={50}
                className="h-11 px-3 bg-background border border-gold-800/30 rounded-lg text-sm text-foreground font-sans focus:outline-none focus:border-gold-500/60"
                value={travelers}
                onChange={(e) =>
                  setTravelers(Math.max(1, Number(e.target.value)))
                }
                data-ocid="tourism.planner.travelers_input"
              />
            </div>
            <div className="flex flex-col gap-1.5 justify-end">
              <Button
                className="h-11 w-full bg-gold-500/15 border border-gold-600/40 text-gold-300 hover:bg-gold-500/25"
                onClick={handleQuote}
                data-ocid="tourism.planner.quote_button"
              >
                Get Instant Quote
              </Button>
            </div>
          </div>
          {quote && (
            <div
              className="mt-4 p-4 bg-gold-500/10 border border-gold-600/30 rounded-lg text-sm text-gold-200 font-sans"
              data-ocid="tourism.planner.quote_result"
            >
              {quote}
            </div>
          )}
        </div>

        {/* Domestic Packages */}
        <div>
          <h2
            className="font-bold text-gold-300 text-lg mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Domestic Tour Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PACKAGES.map((p, i) => (
              <div
                key={p.id}
                className="bg-card border border-gold-800/30 rounded-xl p-5 flex flex-col gap-3 hover:border-gold-600/40 transition-colors"
                data-ocid={`tourism.package.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3
                      className="font-semibold text-foreground text-sm"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-gold-500" />
                      <span className="text-xs text-muted-foreground font-sans">
                        {p.destination}
                      </span>
                    </div>
                  </div>
                  <Badge
                    className={`${
                      categoryColors[p.category] ??
                      "bg-muted text-muted-foreground"
                    } border-0 text-[10px] flex-shrink-0`}
                  >
                    {p.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs font-sans">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {p.duration}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-3 h-3" />
                    Min {p.minPax} pax
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                    <span className="text-gold-400">{p.rating}</span>
                  </div>
                </div>
                <ul className="space-y-1">
                  {p.highlights.map((h) => (
                    <li
                      key={h}
                      className="text-xs text-muted-foreground font-sans flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-gold-500 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="text-[10px] text-muted-foreground font-sans italic">
                  {p.includes}
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gold-800/20">
                  <div>
                    <div className="text-xs text-muted-foreground font-sans">
                      Starting from
                    </div>
                    <div className="text-lg font-bold text-gold-300">
                      ₹{p.price.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-sans">
                      per person
                    </div>
                  </div>
                  <Button
                    className="h-10 px-4 bg-gold-500/15 border border-gold-600/40 text-gold-300 hover:bg-gold-500/25 text-sm"
                    data-ocid={`tourism.package.book_button.${i + 1}`}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* International Packages */}
        <div>
          <h2
            className="font-bold text-gold-300 text-lg mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            International Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INTERNATIONAL.map((p, i) => (
              <div
                key={p.id}
                className="bg-card border border-gold-800/30 rounded-xl p-5 flex flex-col gap-3 hover:border-gold-600/40 transition-colors"
                data-ocid={`tourism.intl_package.item.${i + 1}`}
              >
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-gold-400" />
                  <h3
                    className="font-semibold text-foreground"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {p.destination}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs font-sans text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {p.duration}
                  </span>
                  <span>{p.bookingsCount} bookings</span>
                </div>
                <ul className="space-y-1">
                  {p.highlights.map((h) => (
                    <li
                      key={h}
                      className="text-xs text-muted-foreground font-sans flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-gold-500 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="text-[10px] text-blue-400/80 font-sans">
                  Visa: {p.visa}
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gold-800/20">
                  <div>
                    <div className="text-lg font-bold text-gold-300">
                      ₹{p.price.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-sans">
                      per person
                    </div>
                  </div>
                  <Button
                    className="h-10 px-4 bg-blue-500/10 border border-blue-600/40 text-blue-300 hover:bg-blue-500/20 text-sm"
                    data-ocid={`tourism.intl_package.enquire_button.${i + 1}`}
                  >
                    Enquire
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Management Table */}
        <div
          className="bg-card border border-gold-800/30 rounded-xl p-5"
          data-ocid="tourism.bookings_section"
        >
          <h2
            className="font-bold text-gold-300 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Booking Management
          </h2>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm font-sans min-w-[600px]">
              <thead>
                <tr className="border-b border-gold-800/20">
                  {["Client", "Package", "Travel Date", "Amount", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-2 text-muted-foreground text-xs font-medium"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {BOOKINGS_TABLE.map((b, i) => (
                  <tr
                    key={b.id}
                    className="border-b border-gold-800/10 hover:bg-muted/20"
                    data-ocid={`tourism.booking.item.${i + 1}`}
                  >
                    <td className="py-2.5 px-2 text-foreground">{b.client}</td>
                    <td className="py-2.5 px-2 text-muted-foreground">
                      {b.pkg}
                    </td>
                    <td className="py-2.5 px-2 text-muted-foreground">
                      {b.date}
                    </td>
                    <td className="py-2.5 px-2 text-gold-300 font-medium text-right">
                      {fmtPrice(b.amount)}
                    </td>
                    <td className="py-2.5 px-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          b.status === "Confirmed"
                            ? "bg-green-500/15 text-green-400"
                            : b.status === "Completed"
                              ? "bg-muted text-muted-foreground"
                              : b.status === "Advance Paid"
                                ? "bg-blue-500/15 text-blue-400"
                                : "bg-amber-500/15 text-amber-400"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-3 justify-center pb-4">
          <a
            href="tel:+919512609016"
            className="inline-flex items-center gap-2 h-11 px-6 bg-gold-500/10 border border-gold-600/40 text-gold-300 hover:bg-gold-500/20 rounded-md text-sm font-sans transition-colors"
            data-ocid="tourism.cta.call_button"
          >
            Call: +91 9512609016
          </a>
          <a
            href="https://wa.me/919512609016"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-11 px-6 bg-green-500/10 border border-green-600/40 text-green-300 hover:bg-green-500/20 rounded-md text-sm font-sans transition-colors"
            data-ocid="tourism.cta.whatsapp_button"
          >
            WhatsApp Enquiry
          </a>
        </div>
      </div>
    </div>
  );
}
