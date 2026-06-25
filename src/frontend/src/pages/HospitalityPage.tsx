import SecureAppGate from "@/components/shared/SecureAppGate";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Menu,
  Plus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const VENUES = [
  {
    id: 1,
    name: "Grand Banquet Hall",
    capacity: 500,
    type: "Banquet",
    rate: "₹2,50,000/day",
    status: "Available",
    amenities: ["Stage", "PA System", "Catering", "A/C", "Parking"],
  },
  {
    id: 2,
    name: "Conference Hall A",
    capacity: 80,
    type: "Conference",
    rate: "₹45,000/day",
    status: "Booked",
    amenities: ["Projector", "Video Conf.", "Whiteboard", "A/C"],
  },
  {
    id: 3,
    name: "Boardroom Suite",
    capacity: 25,
    type: "Meeting",
    rate: "₹18,000/day",
    status: "Available",
    amenities: ["TV Screen", "Video Conf.", "A/C", "Coffee"],
  },
  {
    id: 4,
    name: "Terrace Garden",
    capacity: 250,
    type: "Outdoor",
    rate: "₹80,000/day",
    status: "Available",
    amenities: ["Open Air", "Décor", "Catering", "Lighting"],
  },
  {
    id: 5,
    name: "Executive Lounge",
    capacity: 40,
    type: "Lounge",
    rate: "₹22,000/day",
    status: "Maintenance",
    amenities: ["Bar", "Seating", "A/C", "TV"],
  },
  {
    id: 6,
    name: "Training Room B",
    capacity: 50,
    type: "Training",
    rate: "₹28,000/day",
    status: "Available",
    amenities: ["Projector", "Whiteboard", "Internet", "A/C"],
  },
  {
    id: 7,
    name: "Exhibition Hall",
    capacity: 400,
    type: "Exhibition",
    rate: "₹1,80,000/day",
    status: "Available",
    amenities: ["Open Floor", "Power Points", "Parking", "A/C"],
  },
  {
    id: 8,
    name: "Rooftop Terrace",
    capacity: 120,
    type: "Outdoor",
    rate: "₹65,000/day",
    status: "Booked",
    amenities: ["Panoramic View", "Catering", "Lighting"],
  },
  {
    id: 9,
    name: "Private Dining Room",
    capacity: 30,
    type: "Dining",
    rate: "₹35,000/day",
    status: "Available",
    amenities: ["Full Catering", "Bar", "A/C", "TV"],
  },
  {
    id: 10,
    name: "Seminar Hall",
    capacity: 200,
    type: "Seminar",
    rate: "₹95,000/day",
    status: "Available",
    amenities: ["Stage", "Projector", "PA System", "A/C"],
  },
  {
    id: 11,
    name: "AV Studio",
    capacity: 15,
    type: "Recording",
    rate: "₹12,000/hr",
    status: "Available",
    amenities: ["Camera", "Lighting", "Teleprompter", "Live Stream"],
  },
  {
    id: 12,
    name: "Sport & Wellness Zone",
    capacity: 60,
    type: "Sports",
    rate: "₹30,000/day",
    status: "Available",
    amenities: ["Gym", "Yoga Space", "Changing Room"],
  },
];

const BOOKINGS = [
  {
    id: 1,
    client: "Mahindra Finance Ltd",
    venue: "Grand Banquet Hall",
    date: "Jun 27, 2026",
    event: "Annual Awards Night",
    guests: 400,
    status: "Confirmed",
    amount: "₹2,50,000",
  },
  {
    id: 2,
    client: "IIM Ahmedabad",
    venue: "Conference Hall A",
    date: "Jun 18, 2026",
    event: "Alumni Meet",
    guests: 70,
    status: "Confirmed",
    amount: "₹45,000",
  },
  {
    id: 3,
    client: "MSTC GLOBAL Internal",
    venue: "Boardroom Suite",
    date: "Jun 17, 2026",
    event: "Investor Meeting",
    guests: 18,
    status: "Confirmed",
    amount: "₹18,000",
  },
  {
    id: 4,
    client: "Rohan Weddings",
    venue: "Terrace Garden",
    date: "Jun 22, 2026",
    event: "Engagement Ceremony",
    guests: 180,
    status: "Tentative",
    amount: "₹80,000",
  },
  {
    id: 5,
    client: "TechPark Gujarat",
    venue: "Training Room B",
    date: "Jun 20, 2026",
    event: "Tech Workshop",
    guests: 45,
    status: "Confirmed",
    amount: "₹28,000",
  },
  {
    id: 6,
    client: "ANAROCK Realty",
    venue: "Seminar Hall",
    date: "Jun 28, 2026",
    event: "Investment Seminar",
    guests: 180,
    status: "Confirmed",
    amount: "₹95,000",
  },
  {
    id: 7,
    client: "Devendra Rao & Family",
    venue: "Private Dining Room",
    date: "Jul 2, 2026",
    event: "Celebration Dinner",
    guests: 28,
    status: "Tentative",
    amount: "₹35,000",
  },
  {
    id: 8,
    client: "Ahmedabad Youth Club",
    venue: "Sport & Wellness Zone",
    date: "Jul 5, 2026",
    event: "Fitness Camp",
    guests: 55,
    status: "Confirmed",
    amount: "₹30,000",
  },
];

const CATERING = [
  {
    pkg: "Silver Banquet",
    desc: "Veg + 1 Non-Veg item, Welcome Drink, Dessert",
    per: "₹850/person",
    min: 50,
  },
  {
    pkg: "Gold Premium",
    desc: "Full Veg + 3 Non-Veg, Live Stations, Premium Dessert Counter",
    per: "₹1,350/person",
    min: 50,
  },
  {
    pkg: "Platinum Elite",
    desc: "5-Star Multi-Cuisine, Live Cooking, Bar, Dessert Lab",
    per: "₹2,100/person",
    min: 100,
  },
  {
    pkg: "Corporate Box Lunch",
    desc: "Set 3-Course Lunch, Coffee, Mineral Water",
    per: "₹450/person",
    min: 20,
  },
  {
    pkg: "Evening High Tea",
    desc: "Savoury Bites, Pastries, Tea & Coffee Service",
    per: "₹280/person",
    min: 15,
  },
];

export default function HospitalityPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <SecureAppGate appName="Hospitality Hub">
      <div className="min-h-screen bg-[#06090f] text-gold-100">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gold-800/30 bg-[#0a0e1a] sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gold-900/20 md:hidden"
            data-ocid="hospitality.menu_toggle"
          >
            <Menu className="w-5 h-5 text-gold-400" />
          </button>
          <Link
            to="/apps"
            className="flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-sm"
            data-ocid="hospitality.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Apps</span>
          </Link>
          <div className="flex-1">
            <h1
              className="text-lg font-bold text-gold-400"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Hospitality Hub
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-700/30 border border-gold-600/40 rounded-lg text-gold-300 text-xs hover:bg-gold-700/50"
            data-ocid="hospitality.add_booking_button"
          >
            <Plus className="w-3.5 h-3.5" />
            New Booking
          </button>
        </div>

        <div className="flex">
          {sidebarOpen && (
            <div
              role="presentation"
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setSidebarOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSidebarOpen(false);
                }
              }}
            />
          )}
          <aside
            className={`fixed md:static inset-y-0 left-0 z-50 w-56 bg-[#0a0e1a] border-r border-gold-800/30 flex flex-col transition-transform duration-200 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gold-800/20">
              <span className="font-bold text-gold-400 text-sm">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1 hover:bg-gold-900/20 rounded"
                data-ocid="hospitality.close_sidebar"
              >
                <X className="w-4 h-4 text-gold-400" />
              </button>
            </div>
            <nav className="p-2 space-y-1 text-sm">
              {["Venues", "Bookings", "Catering"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-gold-900/10 hover:text-gold-400"
                >
                  <Building2 className="w-4 h-4" />
                  {item}
                </a>
              ))}
            </nav>
          </aside>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  label: "Total Venues",
                  val: "12",
                  icon: Building2,
                  color: "text-gold-400",
                },
                {
                  label: "Events This Month",
                  val: "8",
                  icon: Calendar,
                  color: "text-green-400",
                },
                {
                  label: "Total Guests",
                  val: "1,234",
                  icon: Users,
                  color: "text-blue-400",
                },
                {
                  label: "Revenue (Jun)",
                  val: "₹6.8L",
                  icon: Building2,
                  color: "text-orange-400",
                },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-4"
                  data-ocid={`hospitality.stat.${i + 1}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                    <span className="text-xs text-muted-foreground">
                      {s.label}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Venues */}
            <div
              id="venues"
              className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-4"
            >
              <h3
                className="font-bold text-gold-400 mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Venues ({VENUES.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {VENUES.map((v, i) => (
                  <div
                    key={v.id}
                    className="border border-gold-800/30 rounded-xl p-4 hover:border-gold-600/40 transition-colors"
                    data-ocid={`hospitality.venue.${i + 1}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-sm text-foreground">
                        {v.name}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${v.status === "Available" ? "bg-green-900/30 text-green-300" : v.status === "Booked" ? "bg-red-900/30 text-red-300" : "bg-gray-800/30 text-gray-300"}`}
                      >
                        {v.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {v.capacity} pax
                      </span>
                      <span>{v.type}</span>
                    </div>
                    <div className="text-sm font-bold text-gold-400 mb-2">
                      {v.rate}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {v.amenities.slice(0, 3).map((a) => (
                        <span
                          key={a}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-gold-900/20 text-gold-400 border border-gold-800/20"
                        >
                          {a}
                        </span>
                      ))}
                      {v.amenities.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{v.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bookings */}
            <div
              id="bookings"
              className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-4"
            >
              <h3
                className="font-bold text-gold-400 mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Booking Management
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold-800/30">
                      {[
                        "#",
                        "Client",
                        "Venue",
                        "Date",
                        "Event",
                        "Guests",
                        "Status",
                        "Amount",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left py-2 pr-4 text-gold-400 text-xs"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {BOOKINGS.map((b, i) => (
                      <tr
                        key={b.id}
                        className="border-b border-gold-900/20 hover:bg-gold-900/10"
                        data-ocid={`hospitality.booking.${i + 1}`}
                      >
                        <td className="py-2 pr-4 text-muted-foreground">
                          {b.id}
                        </td>
                        <td className="py-2 pr-4 font-medium">{b.client}</td>
                        <td className="py-2 pr-4 text-muted-foreground text-xs">
                          {b.venue}
                        </td>
                        <td className="py-2 pr-4 text-muted-foreground">
                          {b.date}
                        </td>
                        <td className="py-2 pr-4 text-foreground">{b.event}</td>
                        <td className="py-2 pr-4 text-right">{b.guests}</td>
                        <td className="py-2 pr-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${b.status === "Confirmed" ? "bg-green-900/30 text-green-300" : "bg-yellow-900/30 text-yellow-300"}`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-2 text-gold-400 font-bold">
                          {b.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Catering */}
            <div
              id="catering"
              className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-4"
            >
              <h3
                className="font-bold text-gold-400 mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Catering Packages
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {CATERING.map((c, i) => (
                  <div
                    key={c.pkg}
                    className="border border-gold-800/30 rounded-xl p-4"
                    data-ocid={`hospitality.catering.${i + 1}`}
                  >
                    <div className="font-bold text-gold-400 mb-1">{c.pkg}</div>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      {c.desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-400">
                        {c.per}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Min {c.min} pax
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>

        {/* Add Booking Modal */}
        {showAdd && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            data-ocid="hospitality.dialog"
          >
            <div className="bg-[#0e1420] border border-gold-800/40 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-5">
                <h3
                  className="font-bold text-gold-400"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  New Venue Booking
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="p-1.5 hover:bg-gold-900/20 rounded-lg"
                  data-ocid="hospitality.close_button"
                >
                  <X className="w-4 h-4 text-gold-400" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  {
                    label: "Client / Organisation",
                    ph: "e.g. TechPark Gujarat",
                  },
                  { label: "Event Name", ph: "e.g. Annual Conference" },
                  { label: "Expected Guests", ph: "Number of guests" },
                  { label: "Date", ph: "DD Month YYYY" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs text-gold-400 mb-1">
                      {f.label}
                    </label>
                    <input
                      type="text"
                      placeholder={f.ph}
                      className="w-full bg-[#06090f] border border-gold-800/40 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-gold-400 mb-1">
                    Venue
                  </label>
                  <select
                    className="w-full bg-[#06090f] border border-gold-800/40 rounded-lg px-3 py-2 text-sm"
                    data-ocid="hospitality.venue_select"
                  >
                    {VENUES.map((v) => (
                      <option key={v.id}>
                        {v.name} ({v.capacity} pax)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2 rounded-lg border border-gold-800/40 text-muted-foreground text-sm"
                  data-ocid="hospitality.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2 rounded-lg bg-gold-700/30 border border-gold-600/40 text-gold-300 text-sm"
                  data-ocid="hospitality.submit_button"
                >
                  Book Venue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SecureAppGate>
  );
}
